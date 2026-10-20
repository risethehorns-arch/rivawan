/* ══════════════════════════════════════════════════════════════════════
   THE INK FIELD

   Every particle is born from a pixel of Rawan's own calligraphic mark
   (روان), so at rest the field IS the logo. As the page moves through her
   movements the same ink re-forms:

     logo   the name, moving inside like a murmuration; every so often
            part of it lifts off as a flock and streams home again —
            hold to set the whole flock free
     drift  ink let loose in water: caustic filaments, not confetti
     birds  Al-Tuyoor: a flock riding one thermal, circling like the whirl
     skirt  a whirling dancer; the cloth opens the longer you hold, the
            hem is drawn as its own line of light, sparks leave it at speed
     ring   twelve people, hands joined, lit by the fire they stand around

   Two passes, one canvas:
     1. the AURA  — a full-screen breath of coloured light behind the ink,
                    in the mood of the section (teal, blue, rose, amber…),
                    with the vignette and the film grain folded in
     2. the INK   — additive points; one in fourteen is drawn as a wide,
                    faint halo, which is all the bloom this needs

   Which formation, where, how big and in what light is decided by the
   page, not by this file: the section holding the middle of the viewport
   names its form in [data-form] (and optionally [data-mood]), and its
   [data-anchor] element's box is where the ink goes. CSS owns placement;
   this owns motion. Content never waits on it.
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var RR = window.RR = window.RR || {};
  var root = document.documentElement;
  var canvas = document.getElementById('field');
  var noop = { hold: function () {}, level: function () {}, turns: function () { return 0; }, spin: function () { return 0; }, open: function () { return 0; }, form: 'logo' };

  function fail() {
    root.classList.add('no-gl');
    RR.field = RR.field && RR.field.turns ? RR.field : noop;
    var stage = document.querySelector('.hero__stage');
    if (stage && !stage.querySelector('.hero__fallback')) {
      var im = new Image();
      im.className = 'hero__fallback'; im.alt = 'روان — Rawan, in the calligraphy of her mark';
      im.src = 'assets/img/logo-900.webp';
      stage.insertBefore(im, stage.firstChild);
    }
  }

  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var gl = null;
  try {
    gl = canvas.getContext('webgl', { antialias: false, alpha: false, depth: false, stencil: false,
      premultipliedAlpha: false, preserveDrawingBuffer: false, powerPreference: 'high-performance' });
  } catch (e) { gl = null; }
  if (!gl) { fail(); return; }

  var small = Math.min(innerWidth, innerHeight) < 700;
  var cores = navigator.hardwareConcurrency || 8;
  var COUNT = small ? 18000 : (cores <= 4 ? 22000 : 34000);
  var drawCount = COUNT;
  var dprCap = small ? 1.5 : 1.75;
  var haloShare = small ? 0.05 : 0.07;
  var rung = 0;

  var FORMS = ['logo', 'drift', 'birds', 'skirt', 'ring'];
  var SCALE = { logo: 0.8, drift: 1, birds: 1, skirt: 0.92, ring: 0.9 };
  // r, g, b, strength — the light each form is seen in
  var MOODS = {
    logo: [0.07, 0.30, 0.25, 0.55], drift: [0.05, 0.20, 0.18, 0.30], birds: [0.06, 0.19, 0.36, 0.55],
    skirt: [0.42, 0.08, 0.09, 0.50], ring: [0.50, 0.23, 0.06, 0.62],
    teal: [0.07, 0.30, 0.25, 0.45], blue: [0.06, 0.19, 0.36, 0.5], rose: [0.42, 0.08, 0.09, 0.5],
    amber: [0.50, 0.23, 0.06, 0.55], violet: [0.20, 0.11, 0.36, 0.42], none: [0, 0, 0, 0]
  };

  /* ── pass 1: the aura ────────────────────────────────────────────── */
  var AVS = 'attribute vec2 aP; void main(){ gl_Position = vec4(aP, 0.0, 1.0); }';
  var AFS = [
    'precision highp float;',
    'uniform vec2 uRes, uAt;',
    'uniform float uR, uI, uTa;',
    'uniform vec3 uMood;',
    'float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }',
    'void main(){',
    '  vec2 px = gl_FragCoord.xy;',
    '  float d = length(px - uAt) / uR;',
    '  vec3 col = vec3(5.0, 10.0, 9.0) / 255.0;',
    '  col += uMood * uI * (exp(-d * d * 1.7) + 0.28 * exp(-d * d * 0.32));',
    '  vec2 v = px / uRes - 0.5;',
    '  col *= 1.0 - 0.8 * dot(v, v);',
    '  col += (hash(px + fract(uTa) * 61.0) - 0.5) * 0.02;',     // grain, and the dither that keeps the gradient from banding
    '  gl_FragColor = vec4(max(col, 0.0), 1.0);',
    '}'
  ].join('\n');

  /* ── pass 2: the ink ─────────────────────────────────────────────── */
  var VS = [
    'precision highp float;',
    'attribute vec3 aA;',                 // home.xy in the mark, ink luminance
    'attribute vec4 aB;',                 // seeds
    'attribute vec4 aC;',                 // more seeds; aC.w picks the halos
    'uniform float uT, uAsp, uSwirl, uSpin, uOpen, uSize, uAlpha, uLvl, uMaxPt, uHalo, uFly;',
    'uniform vec2 uC, uH;',
    'uniform vec4 uW, uWt;',              // eased / target weights: logo drift birds skirt
    'uniform vec2 uW4;',                  // ring: eased, target
    'uniform vec3 uPtr;',
    'varying vec4 vC;',
    'varying float vSoft;',
    'const float TAU = 6.28318530718;',
    'const float PI = 3.14159265359;',
    'mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }',

    /* the name, alive as a murmuration */
    'void fLogo(out vec2 p, out vec3 col, out float b, out float sz){',
    '  vec2 h = aA.xy; float r = length(h); float t = uT;',
    // inside the strokes the ink moves the way a flock does: neighbours shift together on one slow
    // current, and every so often a wave of turning sweeps across the whole body of it
    '  vec2 flow = vec2(sin(h.y * 5.0 + t * 0.55 + 1.3 * sin(h.x * 2.7 - t * 0.31)),',
    '                   cos(h.x * 4.6 - t * 0.47 + 1.3 * sin(h.y * 3.1 + t * 0.27)));',
    '  vec2 wd = vec2(cos(t * 0.13), sin(t * 0.13));',
    '  float band = exp(-pow(dot(h, wd) - (mod(t * 0.42, 3.4) - 1.7), 2.0) * 14.0);',
    '  float a = uSwirl * (1.3 - r) + 0.03 * sin(t * 0.35 + r * 5.0);',
    '  vec2 home = rot(a) * h + flow * (0.011 + 0.02 * band) + vec2(-wd.y, wd.x) * band * 0.026 * (aB.x - 0.5);',
    '  home *= 1.0 + 0.012 * sin(t * 0.7) + 0.06 * uLvl;',
    // the flight: every nineteen seconds a share of the ink lifts off the name as a murmuration,
    // folds and pours across the sky, and streams home to write it again. Holding sets them all free.
    '  float ph = fract(t / 19.0 - aB.z * 0.2 + 0.55);',
    '  float go = step(aC.x, 0.4) * smoothstep(0.02, 0.2, ph) * (1.0 - smoothstep(0.56, 0.84, ph));',
    '  go = max(go, clamp((uFly - aB.z * 0.45) / 0.55, 0.0, 1.0));',
    '  go = go * go * (3.0 - 2.0 * go);',
    // the flock is a thin sheet of birds in 3D that twists, folds and tumbles. Where the sheet turns
    // edge-on to you the birds stack up into a dark-bright ribbon; face-on they thin to a veil —
    // exactly how a murmuration reads from the ground
    '  float tt = t * 0.33;',
    // denser at the heart, with stragglers loose at the edges: a flock has no hard outline
    '  float ang = aB.x * TAU, rad = sqrt(aC.y) * (1.0 + 0.55 * pow(aC.z, 7.0));',
    '  vec3 m = vec3(cos(ang) * rad * (1.3 + 0.35 * sin(tt * 1.3)), sin(ang) * rad * 0.8, (aB.y - 0.5) * 0.12);',
    '  m.yz = rot(1.7 * sin(m.x * 1.9 + tt * 1.15)) * m.yz;',        // the twist that runs along the flock
    '  m.y += 0.34 * sin(m.x * 2.4 + tt * 1.45);',                  // the fold
    '  m.z += 0.28 * cos(m.x * 1.7 - tt);',
    '  m.x += 0.07 * sin(m.x * 9.0 - t * 2.2);',                   // density waves running through it
    '  m.xz = rot(0.95 * sin(tt * 0.5)) * m.xz;',                    // and the whole flock rocking as it banks
    '  m.yz = rot(0.5 + 0.35 * sin(tt * 0.7)) * m.yz;',
    '  vec2 q = m.xy / (1.0 + m.z * 0.3);',
    '  vec2 cc = mix(vec2(0.5 * sin(t * 0.17 + 0.6), 0.3 + 0.24 * sin(t * 0.23)), vec2(0.06 * sin(t * 0.3), 0.04), uFly * 0.7);',
    '  vec2 cloud = cc + q * (0.56 + 0.3 * uFly);',
    '  vec2 path = vec2(-(cloud - home).y, (cloud - home).x) * sin(go * PI) * 0.35 * (aB.y - 0.5);',
    '  p = mix(home, cloud, go) + path;',
    // light travelling round the coil of the mark, the way wet ink catches a lamp
    '  float sheen = pow(0.5 + 0.5 * sin(atan(h.y, h.x) + r * 7.0 - t * 0.55), 3.0);',
    '  col = mix(vec3(0.05, 0.30, 0.24), vec3(0.42, 0.98, 0.82), aA.z);',
    '  col = mix(col, vec3(0.86, 1.0, 0.94), (sheen * 0.4 + band * 0.35) * aA.z);',
    '  b = (0.5 + 0.7 * aA.z) * (0.78 + 0.6 * sheen + 0.35 * band);',
    '  b *= 1.0 + 1.6 * pow(max(0.0, sin(t * 1.7 + aC.z * 90.0)), 28.0);',
    '  sz = 0.85 + 0.45 * aA.z;',
    '  col = mix(col, mix(vec3(0.45, 0.88, 0.78), vec3(0.96, 0.93, 0.86), aC.z), go);',
    '  b = mix(b, 0.3 + 0.16 * aC.z, go);',
    '  sz = mix(sz, 0.55 + 0.25 * aC.z, go);',
    '}',

    /* ink in water */
    'void fDrift(out vec2 p, out vec3 col, out float b, out float sz){',
    '  vec2 ext = vec2(max(uAsp, 1.0), max(1.0 / uAsp, 1.0)) * 1.3;',
    '  vec2 q = (aB.xy * 2.0 - 1.0) * ext;',
    '  float t = uT * 0.05;',
    // the warp is not area-preserving on purpose: where it folds, the ink gathers into filaments
    '  q += 0.30 * vec2(sin(q.y * 1.3 + t * 1.1 + 1.7), cos(q.x * 1.1 - t * 0.9));',
    '  q += 0.40 * vec2(sin(q.x * 2.1 + 1.9 * sin(q.y * 0.9 + t) + t * 0.7), sin(q.y * 2.3 + 1.9 * cos(q.x * 0.8 - t * 0.8)));',
    '  q += 0.15 * vec2(sin(q.x * 5.3 + 1.4 * sin(q.y * 2.1 - t * 1.3)), sin(q.y * 5.7 + 1.4 * cos(q.x * 1.9 + t * 1.1)));',
    '  q += (aC.xy - 0.5) * 0.09 * aC.z;',
    '  p = q;',
    '  col = mix(vec3(0.08, 0.40, 0.33), vec3(0.62, 0.92, 0.82), aC.z * aC.z);',
    '  b = (0.22 + 0.5 * aB.w * aB.w) * (0.75 + 0.25 * sin(uT * 1.3 + aC.x * 40.0));',
    '  sz = 0.7 + 0.7 * aC.y;',
    '}',

    /* the birds: one thermal, everyone circling it the same way */
    'void fBirds(out vec2 p, out vec3 col, out float b, out float sz){',
    '  const float N = 46.0;',
    '  float id = floor(aB.x * N);',
    '  float h1 = fract(sin(id * 12.9898 + 1.0) * 43758.5453);',
    '  float h2 = fract(sin(id * 78.233 + 2.0) * 12345.6789);',
    '  float h3 = fract(sin(id * 39.425 + 3.0) * 24680.1357);',
    '  float rad = 0.24 + 1.0 * sqrt(h1);',
    '  float th = h2 * TAU + uT * 0.21 * (1.3 - 0.5 * rad / 1.24);',
    '  vec2 c0 = vec2(0.12 * sin(uT * 0.07), 0.06 * cos(uT * 0.05));',
    '  vec2 c = c0 + vec2(rad * cos(th), 0.6 * rad * sin(th) + 0.035 * sin(uT * 0.4 + h3 * TAU));',
    '  vec2 d = normalize(vec2(-sin(th), 0.6 * cos(th)));',
    '  float depth = 0.5 - 0.5 * sin(th);',                       // 1 near, 0 far
    '  float s = 0.108 * mix(0.68, 1.25, depth) * (0.8 + 0.4 * h3);',
    '  float burst = smoothstep(-0.1, 0.7, sin(uT * 0.45 + h3 * TAU * 3.0));',   // glide, then a few beats
    '  float fl = sin(uT * (6.5 + 2.0 * h1) + h2 * 40.0) * burst;',
    '  float part = aB.y, u = aB.z, v = aC.x;',
    '  vec2 loc; float lit = 1.0;',
    '  if (part < 0.13) {',
    '    loc = vec2(mix(-0.30, 0.36, u), (v - 0.5) * 0.12 * sqrt(max(0.0, sin(PI * u))));',
    '  } else if (part < 0.19) {',
    '    loc = vec2(mix(-0.26, -0.52, u), (v - 0.5) * 2.0 * mix(0.03, 0.11, u));',
    '  } else {',
    '    float side = part < 0.595 ? 1.0 : -1.0;',
    '    float le = 0.16 + 0.10 * sin(u * 2.6) - 0.44 * u * u - 0.16 * u * fl;',     // leading edge: out to the wrist, swept back to the tip
    '    float ch = 0.30 * pow(1.0 - u, 0.75) + 0.02;',
    '    loc = vec2(le - v * v * ch, side * u * (1.0 - 0.36 * abs(fl)));',
    '    lit = 1.0 - 0.4 * v;',
    '  }',
    '  p = c + mat2(d.x, d.y, -d.y, d.x) * (loc * s);',
    '  col = mix(vec3(0.30, 0.66, 0.74), vec3(0.97, 0.93, 0.85), depth);',
    '  b = (0.13 + 0.2 * depth) * lit;',
    '  sz = 0.62 + 0.45 * depth;',
    '}',

    /* the whirl */
    'void fSkirt(out vec2 p, out vec3 col, out float b, out float sz){',
    '  float sel = aB.w, ph = uSpin, o = uOpen; vec3 P;',
    '  col = vec3(0.93, 0.89, 0.81); b = 0.42; sz = 1.0;',
    '  if (sel < 0.70) {',
    '    float hem = step(0.9, aC.y);',                           // a tenth of the cloth is the hem line itself
    '    float v = mix(sqrt(aB.y), 1.0, hem);',
    '    float th = aB.x * TAU + ph * (1.0 - 0.28 * v);',
    '    float R = 0.06 + pow(v, mix(1.3, 1.0, o)) * (0.50 + 0.40 * o);',
    '    R *= 1.0 + 0.03 * (1.0 - o) * v * sin(th * 5.0 - ph * 1.6);',
    '    float y = 0.03 - pow(v, mix(0.82, 1.0, o)) * (0.64 - 0.40 * o)',
    '            + (0.045 - 0.02 * o) * v * v * sin(th * 7.0 + ph * 1.3 + 1.0);',
    '    P = vec3(R * cos(th), y + (aB.z - 0.5) * 0.01 * (1.0 - hem), R * sin(th));',
    '    col = mix(vec3(0.30, 0.78, 0.66), vec3(0.96, 0.29, 0.27), smoothstep(0.12, 0.95, v));',
    '    col = mix(col, vec3(1.0, 0.74, 0.52), hem * 0.8);',
    '    b = (0.27 + 0.14 * o + 0.5 * hem) * (0.7 + 0.3 * sin(th * 22.0 + v * 4.0));',       // pleats
    '    sz = 0.9 + 0.35 * hem;',
    '  } else if (sel < 0.735) {',                                // sparks thrown off the hem at speed
    '    float life = fract(aB.y + uT * (0.3 + 0.3 * aB.z));',
    '    float th = aB.x * TAU + ph * 0.72 - life * 1.4;',
    '    float R = 0.56 + 0.40 * o + life * (0.18 + 0.3 * aC.x);',
    '    P = vec3(R * cos(th), 0.03 - (0.64 - 0.40 * o) + life * 0.12 * (aC.z - 0.3), R * sin(th));',
    '    col = vec3(1.0, 0.66, 0.42);',
    '    b = (1.0 - life) * (1.0 - life) * o * 0.8;',
    '    sz = 0.8;',
    '  } else if (sel < 0.90) {',
    '    float a = aB.x * TAU, u = aB.y;',
    '    if (aC.z < 0.62) {',                                     // torso: waist, ribs, shoulders, neck
    '      float r = mix(0.046, 0.088, smoothstep(0.0, 0.8, u)) * (1.0 - 0.74 * smoothstep(0.84, 1.0, u));',
    '      P = vec3(r * cos(a), 0.02 + u * 0.42, 0.62 * r * sin(a));',
    '    } else if (aC.z < 0.9) {',                               // head, a little tilted
    '      float yy = u * 2.0 - 1.0, rr = sqrt(max(0.0, 1.0 - yy * yy));',
    '      P = vec3(0.012, 0.497, 0.0) + vec3(rr * cos(a) * 0.040, yy * 0.052, rr * sin(a) * 0.044);',
    '    } else {',                                               // hair gathered up
    '      float yy = u * 2.0 - 1.0, rr = sqrt(max(0.0, 1.0 - yy * yy));',
    '      P = vec3(0.0, 0.563, -0.012) + vec3(rr * cos(a), yy, rr * sin(a)) * 0.025;',
    '    }',
    '    P.xz = rot(ph) * P.xz;',
    '    b = 0.36;',
    '  } else {',                                                 // arms: one hand to the sky, one to the earth
    '    float side = aB.x < 0.5 ? 1.0 : -1.0, u = aB.y;',
    '    vec3 sh = vec3(side * 0.082, 0.385, 0.0);',
    '    vec3 hand = side > 0.0 ? vec3(0.40, 0.60 + 0.06 * o, 0.05) : vec3(-0.42, 0.30 + 0.10 * o, -0.05);',
    '    vec3 el = mix(sh, hand, 0.5) + vec3(0.0, side > 0.0 ? -0.05 : 0.04, 0.0);',
    '    float ta = aC.z * TAU, tr = 0.017 * (1.0 - 0.45 * u);',
    '    P = mix(mix(sh, el, u), mix(el, hand, u), u) + vec3(0.0, cos(ta), sin(ta)) * tr;',
    '    P.xz = rot(ph) * P.xz;',
    '    b = 0.36;',
    '  }',
    '  float cp = cos(0.40), sp = sin(0.40);',
    '  float y2 = P.y * cp + P.z * sp, z2 = P.z * cp - P.y * sp;',
    '  float k = 1.0 / (1.0 + z2 * 0.2);',
    '  p = vec2(P.x, y2 + 0.04 - 0.1 * uOpen) * k * 1.2;',
    '  b *= 0.6 + 0.7 * clamp(0.5 - z2 * 0.6, 0.0, 1.0);',
    '  sz *= 0.85 + 0.3 * clamp(0.5 - z2 * 0.6, 0.0, 1.0);',
    '}',

    /* the circle */
    'void fRing(out vec2 p, out vec3 col, out float b, out float sz){',
    '  const float K = 12.0;',
    '  float k = floor(aB.x * K);',
    '  float ang = k / K * TAU + uT * 0.045, Rr = 0.80;',
    '  vec3 radial = vec3(cos(ang), 0.0, sin(ang));',
    '  vec3 tang = vec3(-sin(ang), 0.0, cos(ang));',
    '  vec3 base = radial * Rr + vec3(0.0, -0.12, 0.0);',
    '  float sel = aB.w, lit = 0.5, fire = -1.0; vec3 P;',
    '  float sway = 0.014 * sin(uT * 0.9 + k * 1.7);',
    '  float flick = 0.8 + 0.2 * sin(uT * 9.0 + sin(uT * 3.1) * 2.0);',
    '  sz = 1.0;',
    '  if (sel < 0.46) {',                                        // robe: feet to shoulders
    '    float u = aB.y, a = aB.z * TAU;',
    '    float r = mix(0.064, 0.048, u) * (1.0 + 0.3 * smoothstep(0.68, 0.9, u)) * (1.0 - 0.62 * smoothstep(0.92, 1.0, u));',
    '    P = base + (radial * cos(a) + tang * sin(a)) * r + vec3(0.0, u * 0.27, 0.0) + tang * sway * u;',
    '    lit = max(0.0, -cos(a));',                               // the side that faces the fire
    '  } else if (sel < 0.56) {',                                 // head
    '    float a = aB.z * TAU, yy = aB.y * 2.0 - 1.0, rr = sqrt(max(0.0, 1.0 - yy * yy));',
    '    P = base + vec3(0.0, 0.316, 0.0) + (radial * cos(a) + tang * sin(a)) * rr * 0.033 + vec3(0.0, yy * 0.037, 0.0) + tang * sway;',
    '    lit = max(0.0, -cos(a));',
    '  } else if (sel < 0.78) {',                                 // arms, out to the neighbour's hand
    '    float side = aC.x < 0.5 ? 1.0 : -1.0, u = aB.y;',
    '    float a2 = ang + side * PI / K;',
    '    float lift = 0.05 + 0.05 * sin(uT * 0.5 + (k + side * 0.5) * TAU / K * 2.0);',   // the joined hands rise and fall round the ring
    '    vec3 hand = vec3(cos(a2), 0.0, sin(a2)) * Rr * 0.985 + vec3(0.0, -0.02 + lift, 0.0);',
    '    vec3 shd = base + vec3(0.0, 0.24, 0.0) + tang * side * 0.05 + tang * sway;',
    '    vec3 el = mix(shd, hand, 0.5) + vec3(0.0, -0.035, 0.0);',
    '    P = mix(mix(shd, el, u), mix(el, hand, u), u) + (vec3(aC.y, aC.z, aB.z) - 0.5) * 0.014;',
    '    lit = 0.45;',
    '  } else if (sel < 0.965) {',                                // the fire
    '    float h = fract(aB.y + uT * (0.5 + 0.7 * aC.x) * 0.45);',
    '    float a = aB.z * TAU + uT * 0.8 + h * 3.0;',
    '    float r = pow(1.0 - h, 1.4) * 0.125 * sqrt(aC.y) * (0.75 + 0.25 * sin(h * 9.0 - uT * 6.0 + aB.z * 6.0)) + 0.014 * sin(uT * 5.0 + aB.z * 30.0) * h;',
    '    P = vec3(cos(a) * r, -0.12 + h * (0.26 + 0.14 * aC.z), sin(a) * r);',
    '    fire = h;',
    '  } else {',                                                 // sparks
    '    float h = fract(aB.y + uT * (0.12 + 0.1 * aC.x));',
    '    float a = aB.z * TAU;',
    '    P = vec3(cos(a) * (0.03 + 0.10 * h) + 0.05 * sin(uT * 1.3 + aB.z * 20.0) * h, -0.10 + h * 0.85, sin(a) * (0.03 + 0.10 * h));',
    '    fire = 2.0 + h;',
    '  }',
    '  float cp = cos(0.42), sp = sin(0.42);',
    '  float y2 = P.y * cp + P.z * sp, z2 = P.z * cp - P.y * sp;',
    '  float k2 = 1.0 / (1.0 + z2 * 0.25);',
    '  p = vec2(P.x, y2 - 0.12) * k2 * 1.08;',
    '  if (fire < 0.0) {',
    '    col = mix(vec3(0.24, 0.44, 0.40), vec3(1.0, 0.66, 0.34), lit * flick);',
    '    b = (0.16 + 0.5 * lit * flick) * (0.7 + 0.5 * clamp(0.5 - z2 * 0.6, 0.0, 1.0));',
    '    sz = 0.85 + 0.3 * clamp(0.5 - z2 * 0.6, 0.0, 1.0);',
    '  } else if (fire < 1.5) {',
    '    col = mix(vec3(1.0, 0.80, 0.42), vec3(0.92, 0.22, 0.07), smoothstep(0.0, 0.8, fire));',
    '    b = (1.0 - fire) * 0.36 + 0.05;',
    '  } else {',
    '    col = vec3(1.0, 0.6, 0.25);',
    '    b = (3.0 - fire) * 0.7; sz = 0.8;',
    '  }',
    '}',

    'void main(){',
    // the stagger: each particle leads or lags the eased weights by its own seed,
    // so a change of form travels through the ink instead of arriving all at once
    '  float lead = aB.z * 1.6 - 0.6;',
    '  vec4 w4 = max(uW + (uWt - uW) * lead, 0.0);',
    '  float w5 = max(uW4.x + (uW4.y - uW4.x) * lead, 0.0);',
    '  float sum = w4.x + w4.y + w4.z + w4.w + w5 + 1e-5;',
    '  vec2 P = vec2(0.0); vec3 C = vec3(0.0); float B = 0.0, S = 0.0; vec2 p; vec3 c; float b, s;',
    '  if (w4.x > 0.0005) { fLogo(p, c, b, s);  P += p * w4.x; C += c * w4.x; B += b * w4.x; S += s * w4.x; }',
    '  if (w4.y > 0.0005) { fDrift(p, c, b, s); P += p * w4.y; C += c * w4.y; B += b * w4.y; S += s * w4.y; }',
    '  if (w4.z > 0.0005) { fBirds(p, c, b, s); P += p * w4.z; C += c * w4.z; B += b * w4.z; S += s * w4.z; }',
    '  if (w4.w > 0.0005) { fSkirt(p, c, b, s); P += p * w4.w; C += c * w4.w; B += b * w4.w; S += s * w4.w; }',
    '  if (w5 > 0.0005)   { fRing(p, c, b, s);  P += p * w5;   C += c * w5;   B += b * w5;   S += s * w5; }',
    '  P /= sum; C /= sum; B /= sum; S /= sum;',
    // in transit nothing travels in a straight line: the ink turns as it goes
    '  float tr = 1.0 - max(max(max(w4.x, w4.y), max(w4.z, w4.w)), w5) / sum;',
    '  P = rot(tr * (1.0 + 1.7 * aB.x)) * P * (1.0 + 0.4 * tr * (aC.x - 0.3));',
    '  vec2 d = P - uPtr.xy; float dd = dot(d, d);',
    '  float f = uPtr.z * exp(-dd / 0.035);',
    '  P += d * inversesqrt(dd + 1e-4) * f * 0.09 + vec2(-d.y, d.x) * f * 0.9;',
    '  B += f * 0.5;',
    '  float halo = step(1.0 - uHalo, aC.w);',
    '  float size = uSize * S * (0.6 + 0.8 * aC.y);',
    '  gl_Position = vec4(uC + P * uH, 0.0, 1.0);',
    '  gl_PointSize = min(mix(size, size * 7.0 + 8.0, halo), uMaxPt);',
    '  vC = vec4(C, uAlpha * B * mix(1.0, 0.1, halo));',
    '  vSoft = halo;',
    '}'
  ].join('\n');

  var FS = [
    'precision mediump float;',
    'varying vec4 vC;',
    'varying float vSoft;',
    'void main(){',
    '  vec2 q = gl_PointCoord - 0.5; float d = dot(q, q) * 4.0;',
    '  if (d > 1.0) discard;',
    '  float a = mix(smoothstep(1.0, 0.1, d), exp(-d * 4.5) - 0.011, vSoft);',
    '  gl_FragColor = vec4(vC.rgb, vC.a * a);',
    '}'
  ].join('\n');

  function program(vsrc, fsrc) {
    function sh(type, src) {
      var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.error('[field]', gl.getShaderInfoLog(s)); return null; }
      return s;
    }
    var v = sh(gl.VERTEX_SHADER, vsrc), f = sh(gl.FRAGMENT_SHADER, fsrc);
    if (!v || !f) return null;
    var p = gl.createProgram();
    gl.attachShader(p, v); gl.attachShader(p, f); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) { console.error('[field]', gl.getProgramInfoLog(p)); return null; }
    return p;
  }
  function uniforms(p, names) { var o = {}; names.forEach(function (n) { o[n] = gl.getUniformLocation(p, n); }); return o; }

  var aura = program(AVS, AFS), ink = program(VS, FS);
  if (!aura || !ink) { fail(); return; }
  var UA = uniforms(aura, ['uRes', 'uAt', 'uR', 'uI', 'uTa', 'uMood']);
  var U = uniforms(ink, ['uT', 'uAsp', 'uSwirl', 'uSpin', 'uOpen', 'uSize', 'uAlpha', 'uLvl', 'uMaxPt', 'uHalo', 'uFly', 'uC', 'uH', 'uW', 'uWt', 'uW4', 'uPtr']);
  var aLoc = { P: gl.getAttribLocation(aura, 'aP'), A: gl.getAttribLocation(ink, 'aA'), B: gl.getAttribLocation(ink, 'aB'), C: gl.getAttribLocation(ink, 'aC') };

  var quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  var maxPt = (gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE) || [1, 64])[1];

  /* ── particles from the mark ─────────────────────────────────────── */
  function rng(seed) { return function () { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }; }
  var rand = rng(20260929);
  var STRIDE = 11, pts = gl.createBuffer(), ready = false;

  function build(sample) {
    var D = new Float32Array(COUNT * STRIDE);
    for (var i = 0; i < COUNT; i++) {
      var h = sample(), o = i * STRIDE;
      D[o] = h[0]; D[o + 1] = h[1]; D[o + 2] = h[2];
      for (var j = 3; j < STRIDE; j++) D[o + j] = rand();
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, pts);
    gl.bufferData(gl.ARRAY_BUFFER, D, gl.STATIC_DRAW);
    ready = true;
  }

  // if the mark cannot be read, the ink still makes a spiral — her logo is one anyway
  function spiralSample() {
    var t = rand(), a = t * 6.283 * 2.6, r = 0.12 + t * 0.85;
    return [Math.cos(a) * r + (rand() - 0.5) * 0.06, Math.sin(a) * r + (rand() - 0.5) * 0.06, rand()];
  }

  var img = new Image();
  img.onload = function () {
    try {
      var w = img.naturalWidth, h = img.naturalHeight;
      var c = document.createElement('canvas'); c.width = w; c.height = h;
      var x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(img, 0, 0);
      var d = x.getImageData(0, 0, w, h).data, idx = [];
      for (var i = 0; i < w * h; i++) if (d[i * 4 + 3] > 120) idx.push(i);
      if (idx.length < 500) throw new Error('empty mark');
      var half = Math.max(w, h) / 2;
      build(function () {
        var k = idx[(rand() * idx.length) | 0];
        var px = (k % w) + rand(), py = ((k / w) | 0) + rand();
        var lum = Math.min(1, Math.max(0, (d[k * 4 + 1] - 23) / 176));
        return [(px - w / 2) / half, -(py - h / 2) / half, Math.pow(lum, 0.8)];
      });
    } catch (e) { build(spiralSample); }
  };
  img.onerror = function () { build(spiralSample); };
  img.src = 'assets/img/logo-map.webp';

  /* ── the page tells the field where to be ────────────────────────── */
  var sections = [].slice.call(document.querySelectorAll('[data-form]'));
  var active = null;
  var W = [0, 1, 0, 0, 0];             // start as loose ink, assemble into the name
  var Wt = [1, 0, 0, 0, 0];
  var cur = { cx: 0, cy: 0, hs: 300, asp: 1, alpha: 0, mood: [0, 0, 0, 0] };
  var first = true;

  function target() {
    var mid = innerHeight * 0.5, pick = null;
    for (var i = 0; i < sections.length; i++) {
      var r = sections[i].getBoundingClientRect();
      if (r.top <= mid && r.bottom > mid) { pick = sections[i]; break; }
    }
    if (!pick) {
      // above the first or below the last: hold the nearest
      var last = sections[sections.length - 1];
      pick = last && last.getBoundingClientRect().bottom <= mid ? last : sections[0];
    }
    if (pick !== active) {
      active = pick;
      window.dispatchEvent(new CustomEvent('rr:section', { detail: { el: pick, form: pick.dataset.form } }));
    }
    return pick;
  }

  function anchorBox(sec, Wd, Hd) {
    var a = sec.querySelector('[data-anchor]') || sec;
    var r = a.getBoundingClientRect();
    var form = sec.dataset.form;
    var scale = parseFloat(a.dataset.scale || '') || SCALE[form] || 1;
    var hs = Math.min(r.width, r.height) / 2 * scale;
    var narrow = Wd <= 900;
    if (a.hasAttribute('data-full') || (narrow && a.hasAttribute('data-full-m'))) { hs = Math.min(Wd, Hd) / 2 * (narrow && a.hasAttribute('data-full-m') ? 0.95 : scale); }
    return {
      x: r.left + r.width / 2, y: r.top + r.height / 2, hs: Math.max(40, hs),
      asp: Math.max(0.2, r.width / Math.max(1, r.height)),
      alpha: parseFloat((narrow && sec.dataset.alphaM) || sec.dataset.alpha || '1'),
      mood: MOODS[sec.dataset.mood] || MOODS[form] || MOODS.none
    };
  }

  /* ── pointer, hold, level ────────────────────────────────────────── */
  var ptr = { x: -9999, y: -9999, on: 0, target: 0, last: 0 };
  addEventListener('pointermove', function (e) {
    ptr.x = e.clientX; ptr.y = e.clientY; ptr.target = 1; ptr.last = performance.now();
  }, { passive: true });
  document.addEventListener('pointerout', function (e) { if (!e.relatedTarget) ptr.target = 0; });
  addEventListener('pointerup', function (e) { if (e.pointerType !== 'mouse') ptr.target = 0; });
  addEventListener('pointercancel', function () { ptr.target = 0; });

  var holding = false, open = 0, spin = 0, spinV = 1.3, swirl = 0, swirlV = 0, fly = 0, turns = 0, lvl = 0, lvlT = 0;

  RR.field = {
    hold: function (v) { holding = !!v && !reduce; root.classList.toggle('is-holding', holding); },
    level: function (v) { lvlT = v; },
    gust: function (v) { if (!reduce) swirlV += v; },
    turns: function () { return turns; },
    spin: function () { return spin; },
    open: function () { return open; },
    get form() { return active ? active.dataset.form : 'logo'; },
    get rung() { return rung; }
  };

  /* ── sizing ──────────────────────────────────────────────────────── */
  var dpr = 1, Wpx = 0, Hpx = 0;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, dprCap);
    Wpx = innerWidth; Hpx = innerHeight;
    canvas.width = Math.round(Wpx * dpr); canvas.height = Math.round(Hpx * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  addEventListener('resize', resize); resize();

  gl.disable(gl.DEPTH_TEST);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

  // a device that cannot hold ~45fps sheds the expensive things first, and ink last
  function shed() {
    rung++;
    if (rung === 1) haloShare *= 0.5;
    else if (rung === 2) { haloShare = 0; dprCap = Math.max(1, dprCap - 0.25); resize(); }
    else if (drawCount > 9000) { drawCount = Math.round(drawCount * 0.75); dprCap = Math.max(1, dprCap - 0.25); resize(); }
  }

  /* ── the loop ────────────────────────────────────────────────────── */
  var t0 = performance.now(), last = t0, slow = 0, born = t0;
  function frame(now) {
    requestAnimationFrame(frame);
    var raw = (now - last) / 1000; last = now;
    var dt = Math.min(0.05, raw);
    var t = reduce ? 14 : (now - t0) / 1000;

    if (raw < 0.25) { if (raw > 0.0225) slow++; else slow = Math.max(0, slow - 2); }
    if (slow > 80) { shed(); slow = 0; }

    var sec = target();
    if (!sec) return;
    var form = sec.dataset.form, fi = FORMS.indexOf(form);
    for (var i = 0; i < 5; i++) Wt[i] = i === fi ? 1 : 0;

    var box = anchorBox(sec, Wpx, Hpx);
    var intro = now - born < 2600;
    var kp = first || reduce ? 1 : 1 - Math.exp(-dt * 9);
    var kw = reduce ? 1 : 1 - Math.exp(-dt * (intro ? 0.85 : 1.3));
    var ka = reduce ? 1 : 1 - Math.exp(-dt * 2.2);
    first = false;
    cur.cx += (box.x - cur.cx) * kp; cur.cy += (box.y - cur.cy) * kp;
    cur.hs += (box.hs - cur.hs) * kp; cur.asp += (box.asp - cur.asp) * kp;
    cur.alpha += (box.alpha - cur.alpha) * ka;
    for (i = 0; i < 4; i++) cur.mood[i] += (box.mood[i] - cur.mood[i]) * ka * 0.6;
    for (i = 0; i < 5; i++) W[i] += (Wt[i] - W[i]) * kw;

    // hold: the skirt opens and speeds, the name twists into a vortex
    var ko = 1 - Math.exp(-dt * (holding ? 0.9 : 1.6));
    open += ((holding && form === 'skirt' ? 1 : 0) - open) * ko;
    var spinTarget = holding ? 11 : 1.3;
    spinV += (spinTarget - spinV) * (1 - Math.exp(-dt * (holding ? 0.7 : 0.9)));
    if (!reduce) spin += spinV * dt;
    if (holding && form === 'skirt') turns += spinV * dt / 6.2832;
    // hold on the name: the whole flock lifts off it, and pours back when you let go
    var flyT = holding && form === 'logo' ? 1 : 0;
    fly += (flyT - fly) * (1 - Math.exp(-dt * (flyT ? 1.1 : 0.75)));
    swirlV *= Math.exp(-dt * 3);
    swirl += swirlV * dt;
    if (!holding) swirl *= Math.exp(-dt * 1.4);

    lvl += (lvlT - lvl) * (1 - Math.exp(-dt * 8));

    var idle = now - ptr.last > 2200;
    ptr.on += ((ptr.target && !idle ? 1 : ptr.target ? 0.35 : 0) - ptr.on) * (1 - Math.exp(-dt * 5));
    var hs = cur.hs;

    /* pass 1 */
    gl.useProgram(aura);
    gl.disable(gl.BLEND);
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.enableVertexAttribArray(aLoc.P);
    gl.vertexAttribPointer(aLoc.P, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(UA.uRes, canvas.width, canvas.height);
    gl.uniform2f(UA.uAt, cur.cx * dpr, (Hpx - cur.cy) * dpr);
    gl.uniform1f(UA.uR, Math.max(hs * 1.9, Math.min(Wpx, Hpx) * 0.42) * dpr);
    gl.uniform1f(UA.uI, cur.mood[3] * Math.min(1, cur.alpha * 1.6 + 0.2) * (1 + 0.45 * open + 0.6 * fly + 0.8 * lvl));
    gl.uniform1f(UA.uTa, reduce ? 0.37 : t);
    gl.uniform3f(UA.uMood, cur.mood[0], cur.mood[1], cur.mood[2]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (!ready) return;

    /* pass 2 */
    gl.useProgram(ink);
    gl.enable(gl.BLEND);
    gl.bindBuffer(gl.ARRAY_BUFFER, pts);
    gl.enableVertexAttribArray(aLoc.A); gl.vertexAttribPointer(aLoc.A, 3, gl.FLOAT, false, STRIDE * 4, 0);
    gl.enableVertexAttribArray(aLoc.B); gl.vertexAttribPointer(aLoc.B, 4, gl.FLOAT, false, STRIDE * 4, 12);
    gl.enableVertexAttribArray(aLoc.C); gl.vertexAttribPointer(aLoc.C, 4, gl.FLOAT, false, STRIDE * 4, 28);
    gl.uniform1f(U.uT, t);
    gl.uniform1f(U.uAsp, cur.asp);
    gl.uniform1f(U.uSwirl, swirl);
    gl.uniform1f(U.uFly, reduce ? 0 : fly);
    gl.uniform1f(U.uSpin, spin);
    gl.uniform1f(U.uOpen, open);
    gl.uniform1f(U.uLvl, lvl);
    gl.uniform1f(U.uMaxPt, maxPt);
    gl.uniform1f(U.uHalo, haloShare);
    gl.uniform2f(U.uC, cur.cx / Wpx * 2 - 1, 1 - cur.cy / Hpx * 2);
    gl.uniform2f(U.uH, hs / Wpx * 2, hs / Hpx * 2);
    gl.uniform4f(U.uW, W[0], W[1], W[2], W[3]);
    gl.uniform4f(U.uWt, Wt[0], Wt[1], Wt[2], Wt[3]);
    gl.uniform2f(U.uW4, W[4], Wt[4]);
    gl.uniform3f(U.uPtr, (ptr.x - cur.cx) / hs, -(ptr.y - cur.cy) / hs, reduce ? 0 : ptr.on);
    var dens = COUNT / drawCount;
    gl.uniform1f(U.uSize, (small ? 1.9 : 2.1) * dpr * Math.min(1.25, Math.max(0.72, hs / 380)) * Math.sqrt(Math.min(1.6, dens)));
    gl.uniform1f(U.uAlpha, 0.62 * cur.alpha * Math.min(1.5, dens) * (small ? 1.15 : 1));
    gl.drawArrays(gl.POINTS, 0, drawCount);
  }
  requestAnimationFrame(frame);

  canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); ready = false; fail(); });
})();
