/* SAHNE 3 — BAHÇENİN ALANI (28–46 s) */
(function (LI) {
  'use strict';
  const KD = LI.KD, F = () => LI.Film;
  function camera(t, env) { return LI.Camera.breathe(KD.cam(env, { zoom: 1 }), t, 0.4); }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 3, start: 28, end: 46, name: "The garden area", nameTr: "Bahçenin alanı", concept: "160 m²", conceptTr: "160 m²", render });
})(window.LI = window.LI || {});
