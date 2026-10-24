#!/usr/bin/env python3
"""Static dev server with HTTP Range support (needed for video seeking, and for any video playback in Safari).

Usage: python3 tools/serve.py [port]   (serves the ELAQuest folder)
"""
import os, re, sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from functools import partial

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class RangeHandler(SimpleHTTPRequestHandler):
    def send_head(self):
        rng = self.headers.get('Range')
        path = self.translate_path(self.path)
        if not rng or not os.path.isfile(path):
            return super().send_head()
        m = re.match(r'bytes=(\d*)-(\d*)', rng)
        size = os.path.getsize(path)
        if not m:
            self.send_error(416); return None
        start = int(m.group(1)) if m.group(1) else max(0, size - int(m.group(2) or 0))
        end = int(m.group(2)) if m.group(1) and m.group(2) else size - 1
        end = min(end, size - 1)
        if start > end:
            self.send_response(416); self.send_header('Content-Range', f'bytes */{size}'); self.end_headers(); return None
        f = open(path, 'rb'); f.seek(start)
        self.send_response(206)
        self.send_header('Content-Type', self.guess_type(path))
        self.send_header('Accept-Ranges', 'bytes')
        self.send_header('Content-Range', f'bytes {start}-{end}/{size}')
        self.send_header('Content-Length', str(end - start + 1))
        self.end_headers()
        self._remaining = end - start + 1
        return f

    def copyfile(self, source, outputfile):
        remaining = getattr(self, '_remaining', None)
        if remaining is None:
            return super().copyfile(source, outputfile)
        while remaining > 0:
            chunk = source.read(min(64 * 1024, remaining))
            if not chunk: break
            try: outputfile.write(chunk)
            except (BrokenPipeError, ConnectionResetError): break
            remaining -= len(chunk)
        self._remaining = None

    def end_headers(self):
        if not self.headers.get('Range'): self.send_header('Accept-Ranges', 'bytes')
        super().end_headers()


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 4181
    ThreadingHTTPServer(('', port), partial(RangeHandler, directory=ROOT)).serve_forever()
