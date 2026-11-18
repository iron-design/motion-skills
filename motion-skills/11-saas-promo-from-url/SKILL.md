---
name: saas-promo-from-url
description: 제품 URL/랜딩 페이지를 리서치해 브랜드 스타일 그대로 15~40초 SaaS 런칭 프로모를 만든다. 'OO 서비스 홍보 영상', '이 사이트로 프로모 만들어줘', 'SaaS 런칭 영상' 요청에 사용.
---

# URL 리서치 기반 SaaS 프로모

## 시작 절차
입력을 받은 뒤(빠진 항목은 기본값 사용), 코드 전에 **초 단위 스토리보드**를 먼저 보여주고 확인받는다.

## 먼저 받을 입력
제품 URL, 길이(15/30/40초), 강조할 기능 3~5개(없으면 리서치로 선정), 음악(선택)

## 디렉션
먼저 **리서치**: 사이트를 열어 색상 토큰·폰트·로고·핵심 카피·기능·수치를 추출해 `brand.json`으로 정리한다. 영상은 랜딩 페이지와 같은 스타일. 제품 UI를 HTML로 재현해 기능을 '사용하는 장면'으로 보여주고(링크 단축 → 클릭 → 분석 차트가 자라는 식), 숫자는 카운트업, 마지막은 로고 + URL.

## 구조
- 0–2s 훅: 문제 한 줄 키네틱 타이포
- 2–(N-3)s 기능 3~5개, 각 기능은 UI 모션 하나 + 짧은 헤드라인
- 소셜 프루프: 수치/로고 월
- 마지막 3s: 로고 락업 + URL + CTA

## 금지
브랜드와 다른 색/폰트, 가짜 수치(사이트에 없는 숫자), 스톡 일러스트

## 엔진 규칙 (공통)
1. **HTML 한 파일**, 지정 해상도·60fps. 모든 스타일은 `window.seek(t)` 안에서 시간 `t`만으로 계산한다. CSS transition/animation, `setTimeout`, 프레임 간 상태 보관 금지 → 어떤 프레임이든 독립적으로 렌더 가능해야 한다.
2. 모션 값은 `scripts/motion.js`의 `spring`(닫힌 형태 스프링), `springTrack`(목표 변경마다 스프링 합산), `track`(이징 키프레임), `stagger`(글자별), `rng`(시드 고정 난수)를 쓴다. `Math.random()` 금지.
3. 음악이 있으면 `python3 scripts/beats.py track.mp3 > beats.json`으로 비트 그리드를 측정하고, 컷은 다운비트에·UI 히트는 비트에 맞춘다. 효과음은 파일 시작이 아니라 **측정된 피크**가 이벤트에 오도록 배치하고, 음악 아래로 작게. 최종 -14 LUFS.
4. 풀 렌더 전에 `node scripts/render.mjs index.html out.mp4 --stills <비트 시각들>`로 비트마다 스틸을 뽑아 겹침·답답함·가독성을 고친다.
5. 렌더: `node scripts/render.mjs index.html out.mp4 --w W --h H --fps 60 --dur D --sub 3 --audio track.mp3` (서브프레임 3개를 ffmpeg tmix로 합쳐 실제 모션블러). 필요: Playwright(chromium), ffmpeg.
6. 공통 함정: 카메라가 스케일하는 요소에 `will-change` 금지(텍스트 흐려짐) · `preserve-3d` 요소에 opacity/filter 금지(평면화됨, 래퍼를 페이드) · 모핑 컨테이너 안 텍스트 교체는 나가는/들어오는 타이밍을 분리 · 화면을 채우는 도형은 네 모서리를 넘어갈 때까지 키운다 · 음악/효과음은 상업 이용 가능한 라이선스만.

## 렌더 전 체크리스트
brand.json의 색/폰트만 쓰였는가 · 모든 수치에 출처가 있는가 · 기능 장면이 실제 기능과 일치하는가

## 출처 (prompt-motion.com 인기 #20 (유사 #15, #17, #24))
이 스킬은 아래 공개 프롬프트의 기법을 정리·재구성한 것이다. 원 프롬프트의 권리는 각 작성자에게 있다.
- https://prompt-motion.com/steventey-0d20e4
- https://prompt-motion.com/ajith-io-c52e09
- https://prompt-motion.com/samuel-yostt-891f87
- https://prompt-motion.com/thayto-dev-44b911
