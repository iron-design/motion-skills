# Prompt Motion 인기 20 모션 스킬

prompt-motion.com의 인기순 상위 항목(2026-11-17 기준)을 분석해, 중복을 묶고 서로 다른 20가지 모션 유형을 Claude Code 스킬로 만들었다.
상위 20개 중 8개가 같은 '쇼릴' 프롬프트라서 1번 스킬로 묶고, 50위까지 내려가며 고유한 유형을 채웠다.

| # | 스킬 | 내용 | 사이트 순위 |
|---|---|---|---|
| 1 | [motion-showreel](01-motion-showreel/SKILL.md) | 모션 디자이너 쇼릴 (15초) | #1 |
| 2 | [ui-shape-morph-loop](02-ui-shape-morph-loop/SKILL.md) | 하나의 도형이 UI 상태들로 모핑 | #2 |
| 3 | [keynote-launch-film](03-keynote-launch-film/SKILL.md) | 애플 키노트식 원테이크 런칭 필름 | #5 |
| 4 | [landing-page-3d-flyover](04-landing-page-3d-flyover/SKILL.md) | 랜딩 페이지 3D 플라이오버 | #6 |
| 5 | [editorial-fast-ad](05-editorial-fast-ad/SKILL.md) | 레퍼런스 기반 고속 에디토리얼 광고 | #9 |
| 6 | [recipe-process-explainer](06-recipe-process-explainer/SKILL.md) | 레시피/공정 단계 설명 애니메이션 | #10 |
| 7 | [prompt-box-launch-sting](07-prompt-box-launch-sting/SKILL.md) | 프롬프트 입력 → 결과 런칭 스팅 | #11 |
| 8 | [app-demo-window](08-app-demo-window/SKILL.md) | 맥 윈도우 앱 데모 (스크럽 가능한 HTML) | #14 |
| 9 | [beat-synced-footage-ad](09-beat-synced-footage-ad/SKILL.md) | 실사 클립 비트 싱크 광고 (UGC/프로모) | #16 |
| 10 | [multi-genre-concept-explainer](10-multi-genre-concept-explainer/SKILL.md) | 장르가 계속 바뀌는 개념 설명 영상 | #18 |
| 11 | [saas-promo-from-url](11-saas-promo-from-url/SKILL.md) | URL 리서치 기반 SaaS 프로모 | #20 |
| 12 | [business-explainer-30s](12-business-explainer-30s/SKILL.md) | 30초 비즈니스 애니메이션 익스플레이너 | #21 |
| 13 | [logo-assembly-reveal](13-logo-assembly-reveal/SKILL.md) | 로고 조립 슬로우 리빌 | #23 |
| 14 | [talking-head-punchy-edit](14-talking-head-punchy-edit/SKILL.md) | 토킹헤드 클립 펀치 편집 | #25 |
| 15 | [kinetic-type-bumper](15-kinetic-type-bumper/SKILL.md) | 스트리트 포스터 키네틱 타이포 범퍼 | #28 |
| 16 | [single-dot-motion-system](16-single-dot-motion-system/SKILL.md) | 하나의 점이 모든 장면을 잇는 모션 시스템 | #29 |
| 17 | [ball-guided-ui-loop](17-ball-guided-ui-loop/SKILL.md) | 공이 안내하는 UI 모션 루프 | #30 |
| 18 | [ambient-cinematic-loop](18-ambient-cinematic-loop/SKILL.md) | 앰비언트 시네마틱 장면 루프 | #31 |
| 19 | [math-concept-manim](19-math-concept-manim/SKILL.md) | Manim 수학 개념 설명 영상 | #32 |
| 20 | [history-timeline-video](20-history-timeline-video/SKILL.md) | 역사/연표 타임라인 영상 | #35 |

## 설치
각 폴더를 Claude Code 스킬 디렉터리로 복사한다(폴더명의 번호 접두사는 빼도 된다).

```bash
mkdir -p ~/.claude/skills && for d in */; do [ "$d" = "_shared/" ] && continue; cp -R "$d" ~/.claude/skills/"${d#*-}"; done
```

## 렌더 준비 (HTML 기반 스킬)
```bash
npm i -D playwright && npx playwright install chromium
brew install ffmpeg
pip3 install librosa numpy
```

macOS 13 등 Playwright 전용 Chromium이 지원되지 않으면 설치된 Chrome과 npm ffmpeg를 쓴다:

```bash
npm i -D ffmpeg-static
```

```bash
CHROME_CHANNEL=chrome FFMPEG=node_modules/ffmpeg-static/ffmpeg node scripts/render.mjs index.html out.mp4 --dur 10
```

## 공용 스크립트 (`_shared/`, 각 스킬의 `scripts/`에 복사됨)
- `motion.js` — 닫힌 형태 스프링, 스프링 합산 트랙, 키프레임, 스태거, 시드 난수
- `render.mjs` — `window.seek(t)` HTML → 서브프레임 모션블러 MP4, `--stills`로 비트별 스틸 검수
- `beats.py` — 템포·비트·다운비트·드롭 측정

각 스킬은 원 프롬프트를 그대로 복사하지 않고 기법을 정리해 다시 썼으며, SKILL.md 끝에 원본 링크를 남겼다.
