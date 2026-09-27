/* SAHNE 1 — BAHÇE (0–10 s)  Havuzlu, çiçeklikli bir bahçe planı.
   The whole film's drawing lives in LI.world(t); each scene only sets the camera. */
(function (LI) {
  'use strict';
  const { seg, lerp, inOut } = LI.E;
  const KD = LI.KD, F = () => LI.Film, A = LI.Ang, Ink = LI.Ink;
  const END = (t) => 1 - seg(t, 90.4, 91.4);

  function win(t, a, b, fi = 0.4, fo = 0.4) { return seg(t, a, a + fi) * (1 - seg(t, b - fo, b)); }
  function exprs(ctx, t, P, list, sz) {
    const f = F();
    list.forEach(([a, b, items, hot]) => {
      const al = win(t, a, b); if (al <= 0) return;
      f.expr(ctx, typeof items === 'string' ? [items] : items, P.x, P.y, sz ?? P.s, { alpha: al, w: P.w, halo: true, color: hot ? A.amber : undefined });
    });
  }
  const at = (P, k, y) => ({ x: P.x, y: y ?? P.y[k], s: P.s, w: P.w });
  const amber = (a) => `rgba(${LI.AMBER_RGB},${a})`;
  const fr = (n, d, h) => F().fr(n, d, h);
  const neg = (s) => s.replace('-', '−');
  const label = (v) => (v < 0 ? neg(String(v)) : String(v));

  /* ---- boxes and equal objects: cabinet projection, x right, y back, z up ---- */
  const Pj = (O, c, x, y, z) => [O[0] + x * c + y * c * 0.5, O[1] - z * c - y * c * 0.5];
  function poly(ctx, P, a, fill, seed, w = 3) {
    ctx.beginPath(); P.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath();
    ctx.fillStyle = `rgba(${LI.PAPER_RGB},${a})`; ctx.fill();
    fill.forEach((f) => { if (f) { ctx.fillStyle = f; ctx.fill(); } });
    Ink.path(ctx, P.concat([P[0]]), { w, alpha: a * 0.9, seed, taper: [0, 0] });
  }
  /** a solid block x..x+dx, y..y+dy, z..z+dz */
  function block(ctx, O, c, x, y, z, dx, dy, dz, a, h, seed) {
    if (a <= 0) return;
    const P = (i, j, k) => Pj(O, c, x + i * dx, y + j * dy, z + k * dz), H = h > 0 ? amber(a * 0.6 * h) : null;
    poly(ctx, [P(0, 0, 1), P(1, 0, 1), P(1, 1, 1), P(0, 1, 1)], a, [amber(a * 0.2), H], seed, 2.5);
    poly(ctx, [P(1, 0, 0), P(1, 1, 0), P(1, 1, 1), P(1, 0, 1)], a, [`rgba(${LI.INK_RGB},${a * 0.14})`, H], seed + 1, 2.5);
    poly(ctx, [P(0, 0, 0), P(1, 0, 0), P(1, 0, 1), P(0, 0, 1)], a, [`rgba(${LI.INK_RGB},${a * 0.04})`, H], seed + 2, 2.5);
  }
  function ball(ctx, O, c, x, y, z, a, seed) {
    if (a <= 0) return; const C = Pj(O, c, x + 0.5, y + 0.5, z + 0.5), r = c * 0.47;
    ctx.beginPath(); ctx.arc(C[0], C[1], r, 0, 7);
    ctx.fillStyle = `rgba(${LI.PAPER_RGB},${a})`; ctx.fill();
    const g = ctx.createRadialGradient(C[0] - r * 0.35, C[1] - r * 0.35, r * 0.1, C[0], C[1], r);
    g.addColorStop(0, amber(a * 0.12)); g.addColorStop(1, amber(a * 0.45)); ctx.fillStyle = g; ctx.fill();
    const P = []; for (let i = 0; i <= 28; i++) P.push([C[0] + r * Math.cos(i / 28 * 6.2832), C[1] + r * Math.sin(i / 28 * 6.2832)]);
    Ink.path(ctx, P, { w: 2.5, alpha: a * 0.9, seed, taper: [0, 0] });
  }
  /** items [{x,y,z,dx,dy,dz}] in painter's order, each with a fill index i */
  function fillList(L, W, H, dx = 1) {
    const out = [];
    for (let z = 0; z < H; z++) for (let y = W - 1; y >= 0; y--) for (let x = 0; x < L; x += dx) out.push({ x, y, z, dx, dy: 1, dz: 1 });
    out.forEach((q, i) => (q.i = i));
    return out.slice().sort((p, q) => q.y - p.y || p.x - q.x || p.z - q.z);
  }
  const shown = (t, t0, dt, n) => Math.max(0, Math.min(n, Math.floor((t - t0) / dt + 0.4)));
  /** an open glass box: back walls first, then the contents, then the front edges */
  function container(ctx, O, c, L, W, H, a, seed, draw) {
    if (a <= 0) return;
    const P = (x, y, z) => Pj(O, c, x, y, z), ink = `rgba(${LI.INK_RGB},${a * 0.05})`;
    poly(ctx, [P(0, W, 0), P(L, W, 0), P(L, W, H), P(0, W, H)], a * 0.8, [ink], seed, 2);
    poly(ctx, [P(0, 0, 0), P(0, W, 0), P(0, W, H), P(0, 0, H)], a * 0.8, [ink], seed + 1, 2);
    poly(ctx, [P(0, 0, 0), P(L, 0, 0), P(L, W, 0), P(0, W, 0)], a * 0.8, [ink], seed + 2, 2);
    if (draw) draw();
    [[[0, 0, 0], [L, 0, 0]], [[L, 0, 0], [L, 0, H]], [[L, 0, H], [0, 0, H]], [[0, 0, H], [0, 0, 0]], [[L, 0, 0], [L, W, 0]], [[L, W, 0], [L, W, H]], [[L, W, H], [L, 0, H]], [[0, W, H], [L, W, H]], [[0, 0, H], [0, W, H]]]
      .forEach(([p, q], i) => Ink.path(ctx, [P(...p), P(...q)], { w: 3, alpha: a * 0.85, seed: seed + 10 + i, taper: [0, 0] }));
  }
  function fillBox(ctx, O, c, L, W, H, t, t0, dt, a, seed, kind = 'cube', hot = 0) {
    const dx = kind === 'brick' ? 2 : 1, items = fillList(L, W, H, dx);
    container(ctx, O, c, L, W, H, a, seed, () => items.forEach((q) => {
      const k = seg(t, t0 + q.i * dt, t0 + q.i * dt + 0.35); if (k <= 0) return;
      const dz = (1 - inOut(k)) * (H + 1 - q.z);
      if (kind === 'ball') ball(ctx, O, c, q.x, q.y, q.z + dz, a * k, seed + 100 + q.i * 3);
      else block(ctx, O, c, q.x, q.y, q.z + dz, q.dx, 1, 1, a * k, hot, seed + 100 + q.i * 3);
    }));
    return items.length;
  }
  function tag(ctx, env, O, c, L, text, a, hot) {
    if (a <= 0) return; const s = KD.L(env).G.s;
    F().T(ctx, text, O[0] + L * c / 2, O[1] + s * 0.95, { size: s * 0.66, alpha: a, halo: true, color: hot ? A.amber : undefined });
  }
  /** cubes of an L × W × H prism; when(q) gives each cube's arrival time (Infinity = never) */
  function cubes(L, W, H) {
    const out = [];
    for (let z = 0; z < H; z++) for (let y = W - 1; y >= 0; y--) for (let x = 0; x < L; x++) out.push({ x, y, z });
    return out.sort((p, q) => q.y - p.y || p.x - q.x || p.z - q.z);
  }
  function fillT(ctx, O, c, B, t, a, when, hot, seed) {
    let n = 0;
    container(ctx, O, c, B[0], B[1], B[2], a, seed, () => cubes(...B).forEach((q, i) => {
      const t0 = when(q); if (!(t >= t0)) return; n++;
      const k = seg(t, t0, t0 + 0.3);
      block(ctx, O, c, q.x, q.y, q.z + (1 - inOut(k)) * 1.2, 1, 1, 1, a * k, hot ? hot(q) : 0, seed + 100 + i * 3);
    }));
    return n;
  }
  function edges(ctx, env, O, c, B, a, labels) {
    if (a <= 0) return; const s = KD.L(env).G.s, o = { size: s * 0.7, alpha: a, halo: true, color: A.amber };
    const m = (p, q) => { const P = Pj(O, c, ...p), Q = Pj(O, c, ...q); return [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2]; };
    const [L, W, H] = B;
    let q = m([0, 0, 0], [L, 0, 0]); F().T(ctx, labels[0], q[0], q[1] + 36, o);
    q = m([L, 0, 0], [L, W, 0]); F().T(ctx, labels[1], q[0] + 50, q[1] + 12, o);
    q = m([L, W, 0], [L, W, H]); F().T(ctx, labels[2], q[0] + 48, q[1], o);
  }
  function tally(ctx, env, t, rows) {
    const T = KD.L(env).TL;
    rows.forEach(([t0, t1, txt, hot], i) => { const al = win(t, t0, t1) * END(t); if (al > 0) F().T(ctx, txt, T.x, T.y[i], { size: T.s, alpha: al, halo: true, color: hot ? A.amber : undefined }); });
  }

  function fillPoly(ctx, P, a, fills, seed, w = 2.5) {
    ctx.beginPath(); P.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath();
    fills.forEach((f) => { if (f) { ctx.fillStyle = f; ctx.fill(); } });
    if (w > 0) Ink.path(ctx, P.concat([P[0]]), { w, alpha: a * 0.9, seed, taper: [0, 0] });
  }
  const U = (env, p) => { const G = KD.L(env).GR; return [G.x + p[0] * G.u, G.y - p[1] * G.u]; };
  const circ = (c, r, a0 = 0, a1 = 360, n = 48) => { const P = []; for (let j = 0; j <= n; j++) { const d = (a0 + (a1 - a0) * j / n) * Math.PI / 180; P.push([c[0] + r * Math.cos(d), c[1] + r * Math.sin(d)]); } return P; };
  function dashP(ctx, env, pts, a, seed, color, closed = true) {
    if (a <= 0) return; const P = pts.map((p) => U(env, p)); if (closed) P.push(P[0]);
    for (let i = 0; i < P.length - 1; i++) { const p = P[i], q = P[i + 1], n = 14; for (let j = 0; j < n; j += 2) Ink.path(ctx, [[lerp(p[0], q[0], j / n), lerp(p[1], q[1], j / n)], [lerp(p[0], q[0], (j + 1) / n), lerp(p[1], q[1], (j + 1) / n)]], { w: 2.5, alpha: a, seed: seed + i * 20 + j, taper: [0, 0], color }); }
  }
  function lab(ctx, env, p, txt, a, hot, sz = 0.66) { if (a > 0) { const q = U(env, p), s = KD.L(env).G.s; F().T(ctx, txt, q[0], q[1], { size: s * sz, alpha: a, halo: true, color: hot ? A.amber : undefined }); } }
  /** a garden: outer polygon, holes (lists of unit points); grass = outer minus holes */
  function garden(ctx, env, outer, holes, a, grassHot, seed) {
    if (a <= 0) return;
    const O = outer.map((p) => U(env, p));
    ctx.beginPath(); O.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath();
    holes.forEach((H) => { const P = H.P.map((p) => U(env, p)); P.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath(); });
    ctx.fillStyle = amber(a * (0.16 + 0.4 * grassHot)); ctx.fill('evenodd');
    Ink.path(ctx, O.concat([O[0]]), { w: 3.5, alpha: a, seed, taper: [0, 0] });
    holes.forEach((H, i) => {
      const P = H.P.map((p) => U(env, p));
      ctx.beginPath(); P.forEach((q, j) => (j ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath();
      ctx.fillStyle = H.kind === 'water' ? `rgba(${LI.INK_RGB},${a * 0.12})` : amber(a * 0.1); ctx.fill();
      if (H.hot > 0) { ctx.fillStyle = amber(a * 0.5 * H.hot); ctx.fill(); }
      Ink.path(ctx, P.concat(H.closed === false ? [] : [P[0]]), { w: 2.5, alpha: a * 0.9, seed: seed + 10 + i * 7, taper: [0, 0] });
      if (H.kind === 'flowers' && a > 0) for (let k = 0; k < H.dots.length; k++) { const q = U(env, H.dots[k]); ctx.beginPath(); ctx.arc(q[0], q[1], 4, 0, 7); ctx.fillStyle = amber(a * 0.8); ctx.fill(); }
      if (H.kind === 'water') for (let k = 0; k < 3; k++) { const c = U(env, H.c), r = H.r * KD.L(env).GR.u; Ink.path(ctx, [-0.5, -0.1, 0.3].map((u, j) => [c[0] + r * (u - 0.2) + j * 12, c[1] + r * (0.1 * k - 0.1) + (j % 2 ? -5 : 5)]), { w: 1.5, alpha: a * 0.35, seed: seed + 60 + k, taper: [0.2, 0.2] }); }
    });
  }
  const TRAP = [[0, 0], [20, 0], [12, 10], [0, 10]];
  const POOL = { kind: 'water', P: circ([10, 4.5], 3), c: [10, 4.5], r: 3 };
  const BED = { kind: 'flowers', P: [[0, 0]].concat(circ([0, 0], 4, 0, 90, 24)), dots: [[1, 1], [2.2, 0.8], [0.8, 2.2], [2.5, 2], [1.4, 3], [3, 1]] };
  const SQ = [[0, 0], [10, 0], [10, 10], [0, 10]];
  const SEMI = { kind: 'flowers', P: circ([5, 0], 5, 0, 180, 36), dots: [[2, 1], [4, 2.5], [6, 1.2], [8, 1.5], [5, 4], [3, 3.2], [7, 3.2]] };
  const RHO = { kind: 'water', P: [[3, 7.5], [5, 9], [7, 7.5], [5, 6]], c: [5, 7.5], r: 1.2 };

  function context(ctx, env, t) {
    exprs(ctx, t, KD.L(env).CX, [
      [4.4, 10.2, 'Bahçeye çim ekeceğiz'],
      [10.6, 27.8, 'Neler verilmiş, ne isteniyor?'],
      [28.4, 45.8, 'Bahçenin alanı'],
      [46.4, 63.8, 'Havuz, çiçeklik ve çim'],
      [64.4, 79.8, 'Aynı strateji başka bir bahçede'],
    ]);
  }

  function figure(ctx, env, t) {
    const a = END(t), aG = win(t, 4.6, 63.8) * a;
    if (aG > 0) {
      const g = aG * seg(t, 4.8, 5.4);
      const pool = Object.assign({}, POOL, { hot: win(t, 12.8, 14.2) + win(t, 47.4, 50.6) });
      const bed = Object.assign({}, BED, { hot: win(t, 14.4, 15.8) + win(t, 51.0, 54.2) });
      garden(ctx, env, TRAP, [pool, bed].map((h) => Object.assign(h, { })) , g, win(t, 16.0, 17.4) + win(t, 55.0, 63.8) * 0.8 + win(t, 11.4, 12.6), 93000);
      const d = aG * seg(t, 5.8, 6.2);
      lab(ctx, env, [10, -1.0], '20 m', d); lab(ctx, env, [6, 11.0], '12 m', d); lab(ctx, env, [-1.6, 5], '10 m', d);
      lab(ctx, env, [10, 4.5], 'r = 3 m', aG * seg(t, 6.6, 7.0), false, 0.56); lab(ctx, env, [1.9, 4.8], 'r = 4 m', aG * seg(t, 6.6, 7.0), false, 0.56);
      // the wrong rectangle and the right split
      dashP(ctx, env, [[0, 0], [20, 0], [20, 10], [0, 10]], aG * win(t, 29.4, 32.8), 93100, LI.INK_RGB);
      dashP(ctx, env, [[12, 0], [12, 10]], aG * win(t, 38.4, 45.8), 93200, LI.AMBER_RGB, false);
      if (t > 38.8 && t < 45.8) { const k = aG * win(t, 38.8, 45.8); lab(ctx, env, [6, 7.5], '12 · 10 = 120', k, true, 0.6); lab(ctx, env, [15, 2.2], '8 · 10 / 2 = 40', k, true, 0.56); }
    }
    const a5 = win(t, 64.8, 79.8) * a;
    if (a5 > 0) {
      const g = a5 * seg(t, 65.0, 65.6);
      garden(ctx, env, SQ, [Object.assign({}, SEMI, { hot: win(t, 67.6, 70.4) }), Object.assign({}, RHO, { hot: win(t, 70.6, 73.2) })], g, win(t, 73.4, 79.8), 94000);
      lab(ctx, env, [5, -1.0], '10 m', g); lab(ctx, env, [-1.6, 5], '10 m', g);
      lab(ctx, env, [5, 2.2], 'r = 5 m', g * seg(t, 66.0, 66.4), false, 0.56); lab(ctx, env, [5, 7.5], '4 m · 3 m', g * seg(t, 66.0, 66.4), false, 0.5);
    }
    tally(ctx, env, t, [[11.4, 27.8, 'Bahçe: yamuk'], [12.8, 27.8, 'Havuz: daire'], [14.4, 27.8, 'Çiçeklik: 90° lik daire dilimi']]);
    tally(ctx, env, t, [[29.6, 32.8, '20 · 10 = 200 ✗'], [33.4, 45.8, 'Yamuk: (20 + 12) / 2 · 10'], [35.0, 45.8, '= 160 m²', true]]);
    tally(ctx, env, t, [[47.6, 63.8, 'Havuz: 3,14 · 3 · 3 = 28,26'], [51.2, 63.8, 'Çiçeklik: 3,14 · 4 · 4 · 90/360 = 12,56'], [55.2, 63.8, 'Çim: 160 − 28,26 − 12,56 = 119,18 m²', true]]);
    tally(ctx, env, t, [[66.4, 79.8, 'Bahçe: 10 · 10 = 100'], [67.8, 79.8, 'Yarım daire: 3,14 · 25 · 180/360 = 39,25'], [70.8, 79.8, 'Eşkenar dörtgen havuz: 4 · 3 / 2 = 6'], [73.6, 79.8, 'Çim: 100 − 39,25 − 6 = 54,75 m²', true]].map((r, i) => r));
  }

  function words(ctx, env, t) {
    const W = KD.L(env).W;
    exprs(ctx, t, at(W, 0), [[5.6, 10.2, 'Bahçe bir dik yamuk: tabanlar 20 m ve 12 m, yükseklik 10 m'],
      [11.4, 27.8, 'Çim = bahçe − havuz − çiçeklik'],
      [29.4, 32.8, 'Dikdörtgen gibi mi hesaplayalım? Hayır, bahçe yamuk'], [33.0, 45.8, 'Yamuk bağıntısını kullanalım'],
      [47.4, 63.8, 'Havuz ve çiçekliği çıkaralım'],
      [65.4, 79.8, 'Yeni bahçe: kare, yarım daire çiçeklik, eşkenar dörtgen havuz']]);
    exprs(ctx, t, at(W, 1), [[7.2, 10.2, 'Ortada r = 3 m havuz, köşede r = 4 m çeyrek daire çiçeklik'],
      [17.6, 27.8, 'Tahmin: 160 − 27 − 12 ≈ 120 m²'],
      [38.4, 45.8, 'Kontrol: dikdörtgen + üçgen = 120 + 40 = 160 ✓'],
      [57.6, 63.8, '119,18 ≈ 120: tahminle uyumlu ✓ · 40 m² için 1 kg: yaklaşık 3 kg tohum'],
      [75.4, 79.8, 'Bütünden içteki şekilleri çıkar: her planda işler']]);
    exprs(ctx, t, at(W, 2), [[8.8, 10.2, 'Kaç m² çim? 40 m² için 1 kg tohum: kaç kg?', true], [22.4, 27.8, 'Bileşenler: yamuk, daire, daire dilimi', true],
      [41.6, 45.8, 'Bahçe 160 m²', true],
      [60.4, 63.8, '119,18 m² çim, 3 kg tohum', true],
      [77.4, 79.8, 'Çim = bütün − içteki şekiller', true]]);
  }

  function summary(ctx, env, t) {
    if (t < 80.4) return;
    const S = KD.L(env).SUM, f = F(), a = END(t);
    [['Bileşenler: yamuk, daire, daire dilimi', 80.6], ['Tahmin et, hesapla, kontrol et', 81.6], ['İşe yaramayan stratejiyi değiştir', 82.6], ['Çim = bütün − içteki şekiller!', 83.6, true]].forEach(([s, t0, hot], i) => {
      const al = seg(t, t0, t0 + 0.4) * a; if (al <= 0) return;
      f.expr(ctx, [s], S.x, S.y[i], S.s * (i === 3 ? 1.1 : 1), { alpha: al, w: S.w, halo: true, color: hot ? A.amber : undefined });
    });
  }

  LI.fireworks = function (ctx, env, t) {
    const k = seg(t, 84.4, 86.4);
    if (k <= 0 || t >= 91) return;
    const n = F().nokta(t, env), C = [n.x, n.y - 170];
    [30, 60, 90, 120, 150].forEach((d, i) => {
      const r = 150 + 30 * Math.sin(t * 2 + i);
      A.arc(ctx, C, r, d - 12, d + 12, { p: seg(k, i * 0.12, i * 0.12 + 0.4), alpha: 0.8 * (1 - seg(t, 90.2, 91)), w: 6, seed: 80 + i });
    });
  };

  LI.world = function (ctx, env, t) { context(ctx, env, t); figure(ctx, env, t); words(ctx, env, t); summary(ctx, env, t); };

  function camera(t, env) {
    const L = KD.L(env);
    return LI.Camera.breathe(LI.Camera.track([
      [0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [3.0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [4.8, KD.cam(env, { zoom: 1 })],
    ], t), t, 0.5);
  }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 1, start: 0, end: 10, name: 'The garden', nameTr: 'Bahçe', concept: 'Grass to sow', conceptTr: 'Çim ekilecek', render });
})(window.LI = window.LI || {});
