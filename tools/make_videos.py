#!/usr/bin/env python3
"""Render ELA Quest video lessons to MP4.

Each video is a list of scenes; each scene has "beats" (one narrated line each). Narration comes from
Kokoro (voice af_heart, via sweet_voice.py), animation is drawn with Pillow, chimes/music are synthesized with numpy,
and ffmpeg muxes everything. Captions are burned in with read-along word highlighting.

Usage:  python3 tools/make_videos.py            # all videos
        python3 tools/make_videos.py magic-e    # one video
Outputs videos/<id>.mp4, videos/<id>.jpg and data/videos.js (catalog read by the app).
"""
import hashlib, json, math, os, subprocess, sys, tempfile, wave
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTS = os.path.join(ROOT, 'tools', 'fonts')
OUT = os.path.join(ROOT, 'videos')
W, H, FPS, SR = 1280, 720, 24, 24000  # SR matches the Kokoro voice
GAP = 0.45  # silence after each narrated line

PAPER, SURFACE, INK, MUTED, LINE, RULE, RULE_MID = '#f5f8fd', '#ffffff', '#1d2640', '#5b6684', '#dfe6f2', '#b9cdee', '#e6a3a8'
COLORS = {'phonics': '#dc6a12', 'grammar': '#1f8f4e', 'reading': '#2b5fd0', 'writing': '#c42f69', 'mix': '#6a4fd0'}
GOOD, GOLD = '#1c8f50', '#f2b01e'
TAGC = {'noun': '#2b5fd0', 'verb': '#1f8f4e', 'adj': '#dc6a12'}
TAGL = {'noun': 'noun', 'verb': 'verb', 'adj': 'adjective'}

_fc = {}
def font(kind, size):
    k = (kind, size)
    if k not in _fc:
        if kind == 'display':
            f = ImageFont.truetype(os.path.join(FONTS, 'Fredoka-VF.ttf'), size)
            try: f.set_variation_by_axes([600, 100])
            except Exception: pass
        elif kind == 'bold':
            f = ImageFont.truetype(os.path.join(FONTS, 'Andika-Bold.ttf'), size)
        elif kind == 'emoji':
            f = ImageFont.truetype('/System/Library/Fonts/Apple Color Emoji.ttc', 160)
        else:
            f = ImageFont.truetype(os.path.join(FONTS, 'Andika-Regular.ttf'), size)
        _fc[k] = f
    return _fc[k]

def hexa(c, a=255):
    c = c.lstrip('#'); return (int(c[0:2], 16), int(c[2:4], 16), int(c[4:6], 16), a)

def mix(c1, c2, t):
    a, b = hexa(c1), hexa(c2)
    return '#%02x%02x%02x' % tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))

def ease(x):
    x = max(0.0, min(1.0, x)); return 1 - (1 - x) ** 3

# ---------------- sprites ----------------
_ec = {}
def emoji(ch, size):
    k = (ch, size)
    if k not in _ec:
        im = Image.new('RGBA', (200, 200), (0, 0, 0, 0))
        ImageDraw.Draw(im).text((100, 100), ch, font=font('emoji', 160), embedded_color=True, anchor='mm')
        bb = im.getbbox() or (0, 0, 200, 200)
        im = im.crop(bb)
        r = size / max(im.size)
        _ec[k] = im.resize((max(1, int(im.width * r)), max(1, int(im.height * r))), Image.LANCZOS)
    return _ec[k]

def wrap(text, f, maxw):
    words, lines, cur = text.split(), [], ''
    for w in words:
        t = (cur + ' ' + w).strip()
        if f.getlength(t) <= maxw or not cur: cur = t
        else: lines.append(cur); cur = w
    if cur: lines.append(cur)
    return lines

def text_block(text, f, color=INK, maxw=1000, align='center', spacing=1.25):
    lines = wrap(text, f, maxw)
    lh = int(f.size * spacing)
    w = int(max(f.getlength(l) for l in lines)) + 4
    im = Image.new('RGBA', (w, lh * len(lines) + int(f.size * 0.35)), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    for i, l in enumerate(lines):
        x = (w - f.getlength(l)) / 2 if align == 'center' else 0
        d.text((x, i * lh), l, font=f, fill=color)
    return im

def card(w, h, fill=SURFACE, outline=LINE, radius=22, width=3, stripe=None, shadow=True):
    im = Image.new('RGBA', (w + 8, h + 10), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    if shadow: d.rounded_rectangle((4, 8, w + 4, h + 8), radius, fill=(29, 38, 64, 28))
    d.rounded_rectangle((2, 2, w + 2, h + 2), radius, fill=fill, outline=outline, width=width)
    if stripe: d.rounded_rectangle((2, 2, 16, h + 2), radius, fill=stripe); d.rectangle((10, 2, 18, h + 2), fill=fill)
    return im

def chip(text, f, fg, bg, padx=26, pady=12, outline=None, radius=None):
    tw = f.getlength(text); th = f.size
    w, h = int(tw + padx * 2), int(th * 1.25 + pady * 2)
    im = Image.new('RGBA', (w + 6, h + 8), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    r = radius if radius is not None else h // 2
    d.rounded_rectangle((3, 6, w + 3, h + 6), r, fill=(29, 38, 64, 30))
    d.rounded_rectangle((3, 3, w + 3, h + 3), r, fill=bg, outline=outline or bg, width=3)
    d.text((3 + w / 2, 3 + h / 2), text, font=f, fill=fg, anchor='mm')
    return im

def put(img, spr, cx, cy, a=1.0, s=1.0, anchor='c'):
    if a <= 0.01 or spr is None: return
    if abs(s - 1) > 0.01:
        spr = spr.resize((max(1, int(spr.width * s)), max(1, int(spr.height * s))), Image.BILINEAR)
    if a < 0.99:
        spr = spr.copy(); al = spr.getchannel('A').point(lambda v: int(v * a)); spr.putalpha(al)
    x = int(cx - spr.width / 2) if anchor in ('c', 'n', 's') else int(cx) if anchor == 'w' else int(cx - spr.width)
    y = int(cy - spr.height / 2) if anchor in ('c', 'w', 'e') else int(cy) if anchor == 'n' else int(cy - spr.height)
    img.alpha_composite(spr, (x, y))

def pop(img, spr, cx, cy, t0, t, anchor='c'):
    p = ease((t - t0) / 0.45)
    if t < t0: return
    put(img, spr, cx, cy + 24 * (1 - p), a=p, s=0.86 + 0.14 * p, anchor=anchor)

# ---------------- audio ----------------
def tts(text, path):
    """Natural narration (Kokoro af_heart, see sweet_voice.py), cached per line."""
    from sweet_voice import synth
    cache = os.path.join(os.path.dirname(__file__), '.voice-cache', 'video_' + hashlib.md5(text.encode()).hexdigest()[:16] + '.npy')
    if os.path.exists(cache): return np.load(cache)
    a = synth(text)
    os.makedirs(os.path.dirname(cache), exist_ok=True); np.save(cache, a)
    return a

def tone(freqs, dur, vol=0.3, decay=6.0, kind='sine'):
    t = np.arange(int(SR * dur)) / SR
    out = np.zeros_like(t)
    for f in freqs:
        w = np.sin(2 * np.pi * f * t) if kind == 'sine' else 2 * np.abs(2 * ((f * t) % 1) - 1) - 1
        out += w
    env = np.exp(-decay * t) * np.minimum(1, t / 0.006)
    return (out / max(1, len(freqs))) * env * vol

def sfx(name):
    if name == 'pop':
        t = np.arange(int(SR * 0.11)) / SR
        f = 520 + 900 * t / 0.11
        return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-28 * t) * 0.22
    if name == 'ding':
        a = tone([1318.5, 1975.5], 0.9, 0.22, 4.5); b = tone([2637], 0.5, 0.06, 7); a[: len(b)] += b; return a
    if name == 'chime':
        parts = [np.pad(tone([f], 0.7, 0.16, 5), (int(SR * 0.09 * i), 0)) for i, f in enumerate([523.25, 659.25, 783.99, 1046.5])]
        n = max(len(p) for p in parts); return sum(np.pad(p, (0, n - len(p))) for p in parts)
    if name == 'tick':
        return tone([1200], 0.05, 0.18, 60, 'tri')
    if name == 'tada':
        parts = [np.pad(tone([f, f * 1.5], 0.9, 0.17, 3.5, 'tri'), (int(SR * d), 0)) for f, d in [(523.25, 0), (659.25, 0.12), (783.99, 0.24), (1046.5, 0.36)]]
        n = max(len(p) for p in parts); return sum(np.pad(p, (0, n - len(p))) for p in parts)
    if name == 'whoosh':
        t = np.arange(int(SR * 0.35)) / SR
        noise = np.random.default_rng(1).standard_normal(len(t))
        k = np.ones(40) / 40
        return np.convolve(noise, k, 'same') * np.sin(np.pi * t / 0.35) * 0.18
    return np.zeros(1)

def music(n, seed=3):
    """Soft pentatonic plucks + low pad, kept well under the narration."""
    rng = np.random.default_rng(seed)
    out = np.zeros(n, dtype=np.float32)
    scale = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25]
    beat = 60 / 84
    chords = [[130.81, 196.0], [110.0, 164.81], [146.83, 220.0], [98.0, 146.83]]
    i = 0
    t = 0.0
    while t < n / SR:
        s = int(t * SR)
        if i % 8 == 0:
            ch = chords[(i // 8) % len(chords)]
            pad = tone(ch, beat * 8, 0.05, 0.25)
            e = min(n, s + len(pad)); out[s:e] += pad[: e - s]
        if rng.random() < 0.7:
            nt = tone([rng.choice(scale)], 0.8, 0.045, 5.5, 'tri')
            e = min(n, s + len(nt)); out[s:e] += nt[: e - s]
        t += beat / 2; i += 1
    fade = int(SR * 1.5)
    out[:fade] *= np.linspace(0, 1, fade); out[-fade:] *= np.linspace(1, 0, fade)
    return out

# ---------------- scene renderers ----------------
# Each renderer: fn(img, sc, t, starts, color, cache)  t = seconds since scene start; starts = beat start times.
def r_title(img, sc, t, st, col, C):
    if 'spr' not in C:
        C['emo'] = emoji(sc['emoji'], 190)
        C['title'] = text_block(sc['title'], font('display', 70), INK, 1000)
        C['sub'] = text_block(sc.get('sub', ''), font('regular', 34), MUTED, 1000) if sc.get('sub') else None
        C['spr'] = 1
    bob = math.sin(t * 2.2) * 8
    pop(img, C['emo'], W / 2, 250 + bob, 0, t)
    pop(img, C['title'], W / 2, 430, 0.25, t)
    if C['sub']: pop(img, C['sub'], W / 2, 520, 0.6, t)

def r_bullets(img, sc, t, st, col, C):
    items = sc['items']
    off = 1 if sc.get('heading') else 0
    if 'h' not in C:
        C['h'] = text_block(sc['heading'], font('display', 52), col, 1100) if sc.get('heading') else None
        C['rows'] = []
        tiles = sc.get('layout') == 'tiles'
        for it in items:
            em, main, sub = (list(it) + [None, None])[:3]
            if tiles:
                w, h = 200, 230
                c = card(w, h, stripe=None)
                if em: c.alpha_composite(emoji(em, 86), (w // 2 + 4 - 43, 26))
                f = font('display', 52 if len(main) <= 4 else 34)
                d = ImageDraw.Draw(c); d.text((w / 2 + 4, 148), main, font=f, fill=col, anchor='mm')
                if sub: d.text((w / 2 + 4, 200), sub, font=font('regular', 26), fill=MUTED, anchor='mm')
            else:
                w, h = 960, 76 if not sub else 82
                c = card(w, h, stripe=col)
                x = 40
                if em: c.alpha_composite(emoji(em, 52), (x, (h + 4 - 52) // 2 + 2)); x += 76
                d = ImageDraw.Draw(c)
                if sub:
                    d.text((x, 8), main, font=font('bold', 33), fill=INK)
                    d.text((x, 48), sub, font=font('regular', 24), fill=MUTED)
                else:
                    d.text((x, (h + 4) / 2), main, font=font('bold', 35), fill=INK, anchor='lm')
            C['rows'].append(c)
    if C['h']: pop(img, C['h'], W / 2, 150, st[0], t)
    n = len(items)
    if sc.get('layout') == 'tiles':
        gap = 26; tw = 206
        x0 = W / 2 - (n * tw + (n - 1) * gap) / 2 + tw / 2
        for k, c in enumerate(C['rows']):
            if k + off < len(st): pop(img, c, x0 + k * (tw + gap), 360, st[k + off], t)
    else:
        top = 215 if C['h'] else 150
        rh = min(C['rows'][0].height + 12, (588 - top) / max(1, n))
        y0 = top + rh / 2
        for k, c in enumerate(C['rows']):
            if k + off < len(st): pop(img, c, W / 2, y0 + k * rh, st[k + off], t)

def r_wordmath(img, sc, t, st, col, C):
    rows = sc['rows']
    off = 1 if sc.get('heading') else 0
    if 'h' not in C:
        C['h'] = text_block(sc['heading'], font('display', 48), col, 1100) if sc.get('heading') else None
        C['r'] = []
        f = font('display', 50)
        for a, op, b, res, note in rows:
            C['r'].append([chip(a, f, INK, SURFACE, outline=LINE, radius=16), text_block(op, font('display', 50), MUTED), chip(b, f, '#fff', mix(col, '#000000', 0.05), radius=16),
                           text_block('=', font('display', 50), MUTED), chip(res, f, '#fff', GOOD, radius=16), text_block(note, font('regular', 30), MUTED) if note else None])
    if C['h']: pop(img, C['h'], W / 2, 145, st[0], t)
    vis = [k for k in range(len(rows)) if k + off < len(st) and t >= st[k + off]]
    first = max(0, len(vis) - 4)
    for slot, k in enumerate(vis[first:]):
        y = (225 if C['h'] else 180) + slot * 92
        t0 = st[k + off]
        parts = C['r'][k]
        xs = [300, 420, 520, 640, 780]
        for j, spr in enumerate(parts[:5]):
            pop(img, spr, xs[j] + (60 if j == 4 else 0), y, t0 + [0, 0.5, 0.6, 1.3, 1.4][j], t)
        if parts[5]: pop(img, parts[5], 1080, y, t0 + 1.8, t)

def r_sentence(img, sc, t, st, col, C):
    words = sc['words']
    f = font('display', 58)
    if 'lay' not in C:
        C['h'] = text_block(sc['heading'], font('display', 46), col, 1100) if sc.get('heading') else None
        sp = f.getlength(' ')
        ws = [f.getlength(w) + 34 for w, _ in words]
        lines, cur, cw = [], [], 0
        for i, w in enumerate(ws):
            if cur and cw + w > 1100: lines.append(cur); cur, cw = [], 0
            cur.append(i); cw += w + sp
        lines.append(cur)
        lay = {}
        for li, line in enumerate(lines):
            tot = sum(ws[i] for i in line) + sp * (len(line) - 1)
            x = W / 2 - tot / 2
            for i in line:
                lay[i] = (x + ws[i] / 2, 300 + li * 150); x += ws[i] + sp
        C['lay'] = lay
        C['plain'] = {i: chip(w, f, INK, SURFACE, padx=17, pady=8, outline=LINE, radius=14) for i, (w, _) in enumerate(words)}
        C['hl'] = {i: chip(w, f, '#fff', TAGC.get(tag, col), padx=17, pady=8, radius=14) for i, (w, tag) in enumerate(words) if tag}
        C['lab'] = {i: text_block(TAGL.get(tag, tag), font('bold', 26), TAGC.get(tag, col)) for i, (w, tag) in enumerate(words) if tag}
    if C['h']: pop(img, C['h'], W / 2, 150, st[0], t)
    on = {}
    for bi, b in enumerate(sc['beats']):
        if bi < len(st) and t >= st[bi]:
            for tag in b.get('hl', []): on.setdefault(tag, st[bi])
    for i, (w, tag) in enumerate(words):
        x, y = C['lay'][i]
        if tag in on and t >= on[tag]:
            p = ease((t - on[tag]) / 0.4)
            put(img, C['plain'][i], x, y, a=1 - p)
            put(img, C['hl'][i], x, y - 6 * math.sin(p * math.pi), a=p, s=1 + 0.08 * math.sin(p * math.pi))
            put(img, C['lab'][i], x, y + 62, a=p)
        else:
            pop(img, C['plain'][i], x, y, st[0] + 0.05 * i, t)

def r_sort(img, sc, t, st, col, C):
    bins, items = sc['bins'], sc['items']
    nb = len(bins); bw = 330; gap = 40
    x0 = W / 2 - (nb * bw + (nb - 1) * gap) / 2 + bw / 2
    if 'b' not in C:
        C['b'] = []
        for name, tag in bins:
            c = card(bw, 300, fill=mix(TAGC.get(tag, col), SURFACE, 0.9), outline=mix(TAGC.get(tag, col), SURFACE, 0.4))
            ImageDraw.Draw(c).text((bw / 2 + 4, 40), name, font=font('display', 40), fill=TAGC.get(tag, col), anchor='mm')
            C['b'].append(c)
        C['w'] = [chip(w, font('bold', 34), INK, SURFACE, outline=LINE, padx=20, pady=6) for w, b in items]
    for k, c in enumerate(C['b']): pop(img, c, x0 + k * (bw + gap), 420, st[0] + 0.15 * k, t)
    count = [0] * nb
    for k, (w, b) in enumerate(items):
        if k + 1 >= len(st) or t < st[k + 1]: continue
        t0 = st[k + 1]
        tx, ty = x0 + b * (bw + gap), 350 + count[b] * 62
        count[b] += 1
        p = ease((t - t0) / 0.7)
        sx, sy = W / 2, 150
        x = sx + (tx - sx) * p; y = sy + (ty - sy) * p - 80 * math.sin(p * math.pi)
        put(img, C['w'][k], x, y, a=min(1, (t - t0) / 0.2))

def r_quiz(img, sc, t, st, col, C):
    roles = [b.get('role') for b in sc['beats']]
    ia, ic, ir = roles.index('ask'), roles.index('count'), roles.index('reveal')
    if 'q' not in C:
        C['tag'] = chip('Your turn!', font('display', 36), '#fff', GOLD, padx=26, pady=6)
        C['q'] = text_block(sc['q'], font('display', 48), INK, 1060)
        C['p'] = None
        if sc.get('passage'):
            tb = text_block(sc['passage'], font('regular', 30), INK, 980, spacing=1.35)
            c = card(tb.width + 60, tb.height + 36, fill=mix(col, SURFACE, 0.93), outline=mix(col, SURFACE, 0.6))
            c.alpha_composite(tb, (32, 20)); C['p'] = c
        f = font('bold', 38)
        C['o'] = [chip(o, f, INK, SURFACE, outline=LINE, padx=28, pady=12, radius=18) for o in sc['opts']]
        C['ok'] = [chip('✓ ' + o, f, '#fff', GOOD, padx=28, pady=12, radius=18) for o in sc['opts']]
    pop(img, C['tag'], W / 2, 140, st[ia], t)
    qy = 215 if C['p'] else 240
    pop(img, C['q'], W / 2, qy + C['q'].height / 2 - 20, st[ia] + 0.15, t)
    oy = 470
    if C['p']: pop(img, C['p'], W / 2, qy + C['q'].height + C['p'].height / 2, st[ia] + 0.3, t); oy = min(545, qy + C['q'].height + C['p'].height + 50)
    n = len(sc['opts']); gap = 30
    ws = [o.width for o in C['o']]
    vertical = sum(ws) + gap * (n - 1) > 1180
    tot = sum(ws) + gap * (n - 1)
    x = W / 2 - tot / 2
    for k, o in enumerate(C['o']):
        if vertical: cx, cy = W / 2, oy - 40 + k * 70
        else: cx, cy = x + ws[k] / 2, oy; x += ws[k] + gap
        revealed = ir < len(st) and t >= st[ir]
        correct = sc['opts'][k] == sc['a']
        if revealed:
            p = ease((t - st[ir]) / 0.4)
            if correct:
                put(img, C['ok'][k], cx, cy, s=1 + 0.1 * math.sin(p * math.pi))
            else:
                put(img, o, cx, cy, a=1 - 0.6 * p)
        else:
            pop(img, o, cx, cy, st[ia] + 0.5 + 0.15 * k, t)
    if ic < len(st) and st[ic] <= t < (st[ir] if ir < len(st) else 1e9):
        left = 3 - int(t - st[ic])
        if left >= 1:
            fr = (t - st[ic]) % 1
            b = Image.new('RGBA', (130, 130), (0, 0, 0, 0))
            d = ImageDraw.Draw(b); d.ellipse((5, 5, 125, 125), fill=GOLD)
            d.text((65, 62), str(left), font=font('display', 72), fill='#fff', anchor='mm')
            put(img, b, 1150, 150, a=1, s=1.15 - 0.15 * ease(fr / 0.3))

def r_tablelegs(img, sc, t, st, col, C):
    if 'top' not in C:
        tb = text_block(sc['main'], font('display', 46), '#fff', 760)
        top = Image.new('RGBA', (860, 120), (0, 0, 0, 0)); d = ImageDraw.Draw(top)
        d.rounded_rectangle((0, 8, 860, 120), 22, fill=(29, 38, 64, 40)); d.rounded_rectangle((0, 0, 860, 110), 22, fill=col)
        top.alpha_composite(tb, (430 - tb.width // 2, 55 - tb.height // 2 + 4)); C['top'] = top
        C['lab'] = text_block('MAIN IDEA', font('bold', 24), col)
        C['legs'] = []
        for dtl in sc['details']:
            tb = text_block(dtl, font('bold', 28), INK, 230)
            c = card(260, max(84, tb.height + 26), fill=SURFACE, outline=mix(col, SURFACE, 0.5))
            c.alpha_composite(tb, (134 - tb.width // 2, (c.height - 8) // 2 - tb.height // 2 + 4))
            C['legs'].append(c)
        C['dl'] = text_block('DETAILS', font('bold', 24), MUTED)
    pop(img, C['lab'], W / 2, 160, st[0], t)
    if len(st) > 1: pop(img, C['top'], W / 2, 235, st[1], t)
    xs = [W / 2 - 300, W / 2, W / 2 + 300]
    for k, c in enumerate(C['legs']):
        if k + 2 < len(st) and t >= st[k + 2]:
            t0 = st[k + 2]; p = ease((t - t0) / 0.5)
            d = ImageDraw.Draw(img)
            d.rounded_rectangle((xs[k] - 16, 290, xs[k] + 16, 290 + 150 * p), 10, fill=mix(col, '#000000', 0.25))
            pop(img, c, xs[k], 500, t0 + 0.3, t)
    if len(st) > 2: pop(img, C['dl'], 160, 500, st[2], t)

def r_boxes(img, sc, t, st, col, C):
    boxes = sc['boxes']; n = len(boxes)
    off = 1 if sc.get('intro', True) else 0
    cols = 2 if n == 4 else n
    bw = 520 if cols == 2 else 360
    bh = 200 if n == 4 else 300
    if 'b' not in C:
        C['b'] = []
        for lab, em, txt, c2 in boxes:
            cc = COLORS.get(c2, col) if c2 else col
            c = card(bw, bh, fill=SURFACE, outline=mix(cc, SURFACE, 0.45), width=4)
            d = ImageDraw.Draw(c)
            d.rounded_rectangle((2, 2, bw + 2, 56), 22, fill=cc); d.rectangle((2, 30, bw + 2, 56), fill=cc)
            d.text((24, 29), lab, font=font('display', 32), fill='#fff', anchor='lm')
            x = 24
            if em: c.alpha_composite(emoji(em, 70), (x, 80 if n == 4 else 76)); x += 92
            tb = text_block(txt, font('bold', 30 if n == 4 else 31), INK, bw - x - 26 if n == 4 else bw - 50, align='left')
            if n == 4: c.alpha_composite(tb, (x, 75))
            else: c.alpha_composite(tb, (24, 170))
            C['b'].append(c)
    for k, c in enumerate(C['b']):
        if k + off >= len(st): continue
        if cols == 2: cx = W / 2 + (-280 if k % 2 == 0 else 280); cy = 230 + (k // 2) * 228
        else: cx = W / 2 + (k - (n - 1) / 2) * (bw + 30); cy = 345
        pop(img, c, cx, cy, st[k + off], t)
        if cols != 2 and k < n - 1 and t >= st[k + off] + 0.3:
            ImageDraw.Draw(img).text((cx + bw / 2 + 15, cy), '›', font=font('display', 60), fill=MUTED, anchor='mm')

def r_beforeafter(img, sc, t, st, col, C):
    pairs = sc['pairs']; off = 1 if sc.get('heading') else 0
    if 'p' not in C:
        C['h'] = text_block(sc['heading'], font('display', 48), col, 1100) if sc.get('heading') else None
        C['p'] = []
        for a, b in pairs:
            ta = text_block(a, font('bold', 34), MUTED, 400); tb = text_block(b, font('bold', 36), INK, 560)
            ca = card(440, max(90, ta.height + 30), fill=PAPER); ca.alpha_composite(ta, (224 - ta.width // 2, (ca.height - 8) // 2 - ta.height // 2 + 4))
            cb = card(600, max(90, tb.height + 30), fill=mix(GOOD, SURFACE, 0.88), outline=GOOD); cb.alpha_composite(tb, (304 - tb.width // 2, (cb.height - 8) // 2 - tb.height // 2 + 4))
            C['p'].append((ca, cb))
        C['arrow'] = text_block('→', font('display', 64), col)
    if C['h']: pop(img, C['h'], W / 2, 150, st[0], t)
    for k, (ca, cb) in enumerate(C['p']):
        if k + off >= len(st): continue
        y = 260 + k * 140; t0 = st[k + off]
        pop(img, ca, 270, y, t0, t); pop(img, C['arrow'], 535, y, t0 + 0.7, t); pop(img, cb, 880, y, t0 + 1.0, t)

def r_oreo(img, sc, t, st, col, C):
    layers = sc['layers']
    if 'l' not in C:
        C['l'] = []
        for k, (letter, text) in enumerate(layers):
            cookie = k in (0, 3)
            fill = '#4a3426' if cookie else '#ffffff'
            fg = '#ffffff' if cookie else INK
            c = card(900, 92, fill=fill, outline='#4a3426', width=4, radius=46)
            d = ImageDraw.Draw(c)
            d.ellipse((14, 10, 86, 82), fill=GOLD); d.text((50, 47), letter, font=font('display', 44), fill='#fff', anchor='mm')
            d.text((110, 48), text, font=font('bold', 32), fill=fg, anchor='lm')
            C['l'].append(c)
    for k, c in enumerate(C['l']):
        if k + 1 < len(st): pop(img, c, W / 2, 170 + k * 108, st[k + 1], t)

def r_levels(img, sc, t, st, col, C):
    if 'c' not in C:
        C['c'] = []
        for name, grade, desc, c2, stars in [('Starter', 'GRADE 2', 'Learn the basics', '#6fbf73', 1), ('Star', 'GRADE 2', 'Harder practice', '#3f8fd8', 2), ('Challenge', 'GRADE 3', 'Grade 3 work!', '#9a5cd6', 3)]:
            c = card(330, 300, fill=SURFACE, outline=mix(c2, SURFACE, 0.4), width=4)
            d = ImageDraw.Draw(c)
            d.rounded_rectangle((2, 2, 332, 26), 22, fill=c2); d.rectangle((2, 16, 332, 26), fill=c2)
            d.text((167, 80), grade, font=font('bold', 26), fill=c2, anchor='mm')
            d.text((167, 140), name, font=font('display', 58), fill=INK, anchor='mm')
            d.text((167, 200), desc, font=font('regular', 28), fill=MUTED, anchor='mm')
            d.text((167, 255), '★' * stars + '☆' * (3 - stars), font=font('bold', 44), fill=GOLD, anchor='mm')
            C['c'].append(c)
        C['badge'] = chip('Score 70% to unlock the next level', font('display', 34), '#fff', GOOD, padx=30, pady=8)
        C['h'] = text_block('Three levels for every skill', font('display', 52), col, 1100)
    pop(img, C['h'], W / 2, 150, st[0], t)
    for k, c in enumerate(C['c']):
        if k + 1 < len(st): pop(img, c, W / 2 + (k - 1) * 370, 360, st[k + 1], t)
    if len(st) > 4: pop(img, C['badge'], W / 2, 555, st[4], t)

def r_outro(img, sc, t, st, col, C):
    if 'a' not in C:
        C['a'] = text_block(sc['title'], font('display', 76), col, 1100)
        C['b'] = text_block(sc.get('sub', ''), font('regular', 36), MUTED, 1000)
        C['s'] = emoji('⭐', 90)
    for k in range(5):
        ang = t * 0.8 + k * 2 * math.pi / 5
        put(img, C['s'], W / 2 + math.cos(ang) * 360, 330 + math.sin(ang) * 150, a=ease(t / 0.6), s=0.6 + 0.15 * math.sin(t * 3 + k))
    pop(img, C['a'], W / 2, 310, 0, t)
    pop(img, C['b'], W / 2, 420, 0.4, t)

RENDER = {'title': r_title, 'bullets': r_bullets, 'wordmath': r_wordmath, 'sentence': r_sentence, 'sort': r_sort, 'quiz': r_quiz,
          'tablelegs': r_tablelegs, 'boxes': r_boxes, 'beforeafter': r_beforeafter, 'oreo': r_oreo, 'levels': r_levels, 'outro': r_outro}

# ---------------- base frame & captions ----------------
def base_frame(title, color, subject_label):
    im = Image.new('RGBA', (W, H), hexa(PAPER))
    d = ImageDraw.Draw(im)
    # faint primary-ruled paper across the stage
    for y in range(150, 600, 90):
        d.line((0, y, W, y), fill=hexa(RULE, 70), width=2)
        for x in range(0, W, 22): d.line((x, y + 30, x + 11, y + 30), fill=hexa(RULE_MID, 55), width=2)
        d.line((0, y + 60, W, y + 60), fill=hexa(RULE, 70), width=2)
    d.rectangle((0, 0, W, 84), fill=color)
    d.text((36, 42), title, font=font('display', 34), fill='#ffffff', anchor='lm')
    d.text((W - 36, 42), f'ELA Quest · {subject_label}', font=font('bold', 24), fill=hexa('#ffffff', 220), anchor='rm')
    return im

class Captions:
    def __init__(self):
        self.f = font('bold', 34); self.cache = {}
    def layout(self, text):
        if text in self.cache: return self.cache[text]
        lines = wrap(text, self.f, 1080)[:3]
        words, sp = [], self.f.getlength(' ')
        lh = 46; y0 = 655 - (len(lines) - 1) * lh / 2
        total = sum(len(l) for l in lines); acc = 0
        for li, l in enumerate(lines):
            x = W / 2 - self.f.getlength(l) / 2
            for w in l.split():
                acc += len(w) + 1
                words.append((w, x, y0 + li * lh, acc / max(1, total)))
                x += self.f.getlength(w) + sp
        self.cache[text] = (words, len(lines))
        return self.cache[text]
    def draw(self, img, text, prog, color):
        d = ImageDraw.Draw(img)
        d.rounded_rectangle((60, 598, W - 60, 712), 24, fill=SURFACE, outline=LINE, width=2)
        if not text: return
        words, nl = self.layout(text)
        for w, x, y, end in words:
            d.text((x, y), w, font=self.f, fill=INK if end <= prog + 0.02 else '#9aa3b8', anchor='lm')

# ---------------- build ----------------
def build(video, tmp):
    vid = video['id']; color = COLORS[video['subject']]
    beats = []  # (scene_idx, beat_idx, text, audio, dur, sfx)
    for si, sc in enumerate(video['scenes']):
        for bi, b in enumerate(sc['beats']):
            if b.get('silent'):
                beats.append([si, bi, b.get('cap', ''), None, b['silent'], b.get('sfx')])
            else:
                a = tts(b.get('say', b['text']), os.path.join(tmp, f'{vid}_{si}_{bi}.wav'))
                beats.append([si, bi, b['text'], a, len(a) / SR + b.get('gap', GAP), b.get('sfx')])
    # timeline
    t = 0.6; starts = {}
    for row in beats:
        starts[(row[0], row[1])] = t; row.append(t); t += row[4]
    total = t + 0.8
    scene_start = {si: min(v for (s, b), v in starts.items() if s == si) for si in range(len(video['scenes']))}
    scene_end = {si: (scene_start[si + 1] if si + 1 < len(video['scenes']) else total) for si in range(len(video['scenes']))}

    # audio mix
    n = int(total * SR) + SR
    mixbuf = np.zeros(n, dtype=np.float32)
    def add(sig, at, vol=1.0):
        s = int(at * SR); e = min(n, s + len(sig)); mixbuf[s:e] += sig[: e - s] * vol
    for si in scene_start:
        sc = video['scenes'][si]
        add(sfx('tada' if sc['type'] == 'outro' else 'chime' if sc['type'] == 'title' else 'whoosh'), scene_start[si] - 0.25)
    for si, bi, text, a, dur, fx, st in beats:
        sc = video['scenes'][si]
        if a is not None: add(a, st, 0.95)
        if fx: add(sfx(fx), st)
        elif sc['type'] in ('bullets', 'wordmath', 'boxes', 'oreo', 'levels', 'tablelegs', 'beforeafter') and (bi > 0 or not sc.get('heading', sc['type'] != 'boxes')):
            add(sfx('pop'), st)
        elif sc['type'] == 'sort' and bi > 0: add(sfx('pop'), st + 0.55)
        if sc['type'] == 'quiz' and sc['beats'][bi].get('role') == 'count':
            for k in range(3): add(sfx('tick'), st + k)
        if sc['type'] == 'quiz' and sc['beats'][bi].get('role') == 'reveal': add(sfx('ding'), st)
    mixbuf += music(n)
    peak = np.max(np.abs(mixbuf)); mixbuf = mixbuf / max(1.0, peak / 0.95)
    wav = os.path.join(tmp, f'{vid}.wav')
    with wave.open(wav, 'w') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mixbuf * 32767).astype(np.int16).tobytes())

    # video
    base = base_frame(video['title'], color, video['label'])
    cap = Captions()
    out = os.path.join(OUT, f'{vid}.mp4')
    ff = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                           '-i', wav, '-c:v', 'libx264', '-preset', 'medium', '-crf', '27', '-pix_fmt', 'yuv420p', '-tune', 'animation',
                           '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', '-shortest', out], stdin=subprocess.PIPE)
    caches = {si: {} for si in scene_start}
    nframes = int(total * FPS)
    poster = None
    for fi in range(nframes):
        tt = fi / FPS
        si = max([s for s in scene_start if scene_start[s] <= tt] or [0])
        sc = video['scenes'][si]
        img = base.copy()
        st = [starts[(si, b)] - scene_start[si] for b in range(len(sc['beats']))]
        ls = tt - scene_start[si]
        # fade between scenes
        RENDER[sc['type']](img, sc, ls, st, color, caches[si])
        fade_out = scene_end[si] - tt
        if fade_out < 0.3 and si + 1 in scene_start:
            ov = Image.new('RGBA', (W, 600 - 84), hexa(PAPER, int(255 * (1 - fade_out / 0.3)))); img.alpha_composite(ov, (0, 84))
        # caption: current narrated beat
        cur = None
        for row in beats:
            if row[6] <= tt < row[6] + row[4]: cur = row
        if cur:
            text = cur[2]
            prog = (tt - cur[6]) / max(0.1, (len(cur[3]) / SR if cur[3] is not None else cur[4]))
            cap.draw(img, text, prog if cur[3] is not None else 1.0, color)
        else:
            cap.draw(img, '', 0, color)
        d = ImageDraw.Draw(img)
        d.rectangle((0, 84, W, 90), fill=mix(color, PAPER, 0.75)); d.rectangle((0, 84, int(W * tt / total), 90), fill=GOLD)
        rgb = img.convert('RGB')
        if poster is None and tt >= video.get('poster_at', 2.2): poster = rgb
        ff.stdin.write(rgb.tobytes())
    ff.stdin.close(); ff.wait()
    (poster or rgb).resize((640, 360), Image.LANCZOS).save(os.path.join(OUT, f'{vid}.jpg'), quality=82)
    return round(total)

if __name__ == '__main__':
    sys.path.insert(0, os.path.dirname(__file__))
    from video_scripts import VIDEOS
    os.makedirs(OUT, exist_ok=True)
    only = set(sys.argv[1:])
    cat_path = os.path.join(OUT, 'durations.json')
    durs = json.load(open(cat_path)) if os.path.exists(cat_path) else {}
    with tempfile.TemporaryDirectory() as tmp:
        for v in VIDEOS:
            if only and v['id'] not in only: continue
            print('rendering', v['id'], flush=True)
            durs[v['id']] = build(v, tmp)
            print('  done', durs[v['id']], 's', flush=True)
    json.dump(durs, open(cat_path, 'w'), indent=1)
    catalog = [{'id': v['id'], 'title': v['title'], 'subject': v['subject'], 'label': v['label'], 'desc': v['desc'], 'practice': v.get('practice'),
                'src': f"videos/{v['id']}.mp4", 'poster': f"videos/{v['id']}.jpg", 'secs': durs.get(v['id'], 0)} for v in VIDEOS]
    with open(os.path.join(ROOT, 'data', 'videos.js'), 'w') as f:
        f.write('// Generated by tools/make_videos.py: the video lesson catalog.\nconst VIDEOS = ' + json.dumps(catalog, indent=1, ensure_ascii=False) + ';\n')
    print('catalog written')
