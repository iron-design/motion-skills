// motion.js — 시간의 순수 함수로 모션을 계산하는 헬퍼 (모든 스킬 공용)
// 규칙: 화면의 모든 값은 window.seek(t) 안에서 t(초)만으로 계산한다.
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, k) => a + (b - a) * k;
export const range = (t, t0, t1) => clamp((t - t0) / (t1 - t0)); // t0~t1 구간 진행률 0..1
export const easeOutCubic = k => 1 - Math.pow(1 - k, 3);
export const easeInOutCubic = k => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
export const easeOutExpo = k => (k >= 1 ? 1 : 1 - Math.pow(2, -10 * k));

// 닫힌 형태(closed-form) 스프링 스텝 응답: 0→1. dt<0이면 0.
// freq: 고유진동수(Hz), zeta: 감쇠비(0.7~0.9 = 살짝 오버슛, 1 = 오버슛 없음)
export function spring(dt, freq = 2.2, zeta = 0.8) {
  if (dt <= 0) return 0;
  const w = 2 * Math.PI * freq;
  if (zeta >= 1) return 1 - Math.exp(-w * dt) * (1 + w * dt);
  const wd = w * Math.sqrt(1 - zeta * zeta);
  return 1 - Math.exp(-zeta * w * dt) * (Math.cos(wd * dt) + ((zeta * w) / wd) * Math.sin(wd * dt));
}

// 목표값이 여러 번 바뀌는 값 = 변경마다 스프링 하나씩 더한 합 → 여전히 t의 순수 함수
// keys: [{t: 시작시각, v: 목표값}, ...] (첫 키가 초기값)
export function springTrack(t, keys, freq = 2.2, zeta = 0.8) {
  let v = keys[0].v;
  for (let i = 1; i < keys.length; i++) v += (keys[i].v - keys[i - 1].v) * spring(t - keys[i].t, freq, zeta);
  return v;
}

// 키프레임 트랙(이징 보간): [[t, v], ...]
export function track(t, kf, ease = easeInOutCubic) {
  if (t <= kf[0][0]) return kf[0][1];
  for (let i = 1; i < kf.length; i++) {
    const [t1, v1] = kf[i], [t0, v0] = kf[i - 1];
    if (t <= t1) return lerp(v0, v1, ease(range(t, t0, t1)));
  }
  return kf[kf.length - 1][1];
}

// 비트 그리드: BPM과 첫 다운비트 오프셋으로 n번째 비트 시각
export const beat = (n, bpm = 120, offset = 0) => offset + (n * 60) / bpm;

// 결정적 난수(시드 고정) — Math.random 금지
export function rng(seed = 1) {
  return () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
}

// 글자별 스태거 등장: 각 글자의 진행률 배열
export const stagger = (t, start, count, gap = 0.0625, freq = 2.6, zeta = 0.75) =>
  Array.from({ length: count }, (_, i) => spring(t - start - i * gap, freq, zeta));
