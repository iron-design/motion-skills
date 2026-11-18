# motion-skills

Claude Code용 모션 그래픽 스킬 20개와 샘플 영상.

[prompt-motion.com](https://prompt-motion.com)의 인기 항목(2026-11-17 기준)을 분석해, 서로 다른 20가지 모션 유형을 스킬로 정리했습니다. 각 스킬은 원 프롬프트를 그대로 복사하지 않고 기법을 다시 썼으며, `SKILL.md` 끝에 원작자의 출처 링크를 남겼습니다. 원 프롬프트와 연출 아이디어의 권리는 각 작성자에게 있습니다.

## 구성
- [`motion-skills/`](motion-skills/README.md) — 스킬 20개, 공용 스크립트(`_shared/`), 설치·렌더 방법
- [`sample/`](sample/) — 16번 스킬(점 하나가 모든 장면을 잇는 모션)로 만든 샘플
  - `single-dot-motion.mp4` — 1920×1080, 60fps, 13.6초 루프
  - `index.html` — 원본 애니메이션(Chrome으로 열면 재생, `?t=5.9`로 특정 시점 정지)

## 샘플 다시 렌더하기
```bash
cd sample && npm install
CHROME_CHANNEL=chrome FFMPEG=node_modules/ffmpeg-static/ffmpeg node render.mjs index.html out.mp4 --dur 13.6 --sub 2
```
샘플 연출은 @ultimaxbt의 공개 프롬프트("Orange dot motion system")를 바탕으로 했습니다.
