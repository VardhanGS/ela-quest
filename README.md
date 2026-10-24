# ELA Quest

An interactive Grade 2 → Grade 3 English Language Arts practice app: phonics, grammar, reading comprehension, and a guided Writing Studio. It has three levels per skill, a "Watch first" example before every quest, 10 narrated video lessons, sounds, and a natural recorded voice.

Static site with no build step. Open `index.html` through any web server, or visit the GitHub Pages site.

## Regenerating media (macOS)

```bash
python3 -m venv tools/.venv && tools/.venv/bin/pip install kokoro-onnx soundfile numpy pillow
# download kokoro-v1.0.onnx and voices-v1.0.bin into tools/tts-models/
# (from https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0)
node tools/enumerate_speech.js                    # list every spoken line
tools/.venv/bin/python tools/make_voice.py         # voice/*.m4a + data/voice-clips.js
tools/.venv/bin/python tools/make_videos.py        # videos/*.mp4 + data/videos.js
python3 tools/serve.py 4181                        # local server with video seeking
```

Voice: Kokoro-82M (Apache-2.0), voice `af_heart`. Fonts: Andika and Fredoka (SIL Open Font License).
