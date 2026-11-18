"""beats.py — 음악의 템포/비트/다운비트/드롭을 JSON으로 출력
필요: pip install librosa numpy
사용: python3 beats.py track.mp3 > beats.json
"""
import json, sys
import numpy as np
import librosa

y, sr = librosa.load(sys.argv[1], sr=None, mono=True)
tempo, frames = librosa.beat.beat_track(y=y, sr=sr, units="frames")
beats = librosa.frames_to_time(frames, sr=sr)
onset = librosa.onset.onset_strength(y=y, sr=sr)
# 다운비트 추정: 4박 위상 중 온셋 에너지가 가장 큰 위상
phase = int(np.argmax([onset[frames[p::4]].sum() for p in range(4)])) if len(frames) >= 8 else 0
downbeats = beats[phase::4]
# 마디별 에너지와 드롭(에너지가 가장 크게 뛰는 다운비트)
rms = librosa.feature.rms(y=y)[0]
rt = librosa.frames_to_time(np.arange(len(rms)), sr=sr)
bar_energy = [float(rms[(rt >= a) & (rt < b)].mean()) for a, b in zip(downbeats[:-1], downbeats[1:])]
drop = float(downbeats[int(np.argmax(np.diff(bar_energy))) + 1]) if len(bar_energy) > 2 else None
print(json.dumps({
    "tempo": float(np.atleast_1d(tempo)[0]),
    "beats": [round(float(b), 4) for b in beats],
    "downbeats": [round(float(b), 4) for b in downbeats],
    "bar_energy": [round(e, 5) for e in bar_energy],
    "drop": drop,
}, indent=1))
