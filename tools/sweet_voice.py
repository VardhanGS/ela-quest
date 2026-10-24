"""Shared natural-voice synthesis for ELA Quest (Kokoro-82M via kokoro-onnx, voice "af_heart").

Runs fully offline. Model files live in tools/tts-models/ (kokoro-v1.0.onnx, voices-v1.0.bin).
"""
import os, re
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
VOICE = 'af_heart'      # warm, gentle American English female voice
SPEED = 0.92            # a touch slower than normal for young listeners
SR = 24000

_k = None
def kokoro():
    global _k
    if _k is None:
        from kokoro_onnx import Kokoro
        _k = Kokoro(os.path.join(HERE, 'tts-models', 'kokoro-v1.0.onnx'), os.path.join(HERE, 'tts-models', 'voices-v1.0.bin'))
    return _k

PUNCT = {'.': 'period', '?': 'question mark', '!': 'exclamation mark', ',': 'comma'}

def prepare(text, kind='', words=frozenset()):
    """Return the text Kokoro should read (the caption/display text is unchanged)."""
    t = text.strip()
    if t in PUNCT: return PUNCT[t]
    short = re.fullmatch(r'[a-z]{1,3}', t)
    if kind == 'tile' or (short and (len(t) == 1 or t not in words)):
        # letters and letter chunks: Kokoro spells unknown clusters ("sh" -> "S H") and says vowel teams as sounds
        return t if len(t) > 1 else t.upper() + '.'
    return t

def fix_phonemes(ph):
    # "the a says…" is read as the article "uh"; in these lessons it always means the letter A.
    for a, b in [('ðɪ ɐ ', 'ðɪ ˈeɪ '), ('ðə ɐ ', 'ðə ˈeɪ '), ('lˈɛɾɚɹ ɐ ', 'lˈɛɾɚɹ ˈeɪ '), ('lˈɛɾɚ ɐ ', 'lˈɛɾɚ ˈeɪ ')]:
        ph = ph.replace(a, b)
    return ph

def synth(text, kind='', words=frozenset(), speed=None):
    k = kokoro()
    t = prepare(text, kind, words)
    sp = speed or (0.62 if kind == 'slow' else SPEED)
    ph = fix_phonemes(k.tokenizer.phonemize(t, 'en-us'))
    audio, sr = k.create(ph, voice=VOICE, speed=sp, is_phonemes=True)
    assert sr == SR
    return np.asarray(audio, dtype=np.float32)
