/* ══════════════════════════════════════════════════════════════════════
   THE PLATE — cymatics for SoundWork

   A Chladni plate: sand on a vibrating surface drifts away from where it
   shakes and gathers on the still (nodal) lines, so every tone draws its
   own figure. The grains here do exactly that — each one wanders in
   proportion to how hard its spot is shaking.

   Input is the visitor's own voice (microphone, analysed on-device and
   never recorded or sent) or the notes of one of seven maqamat — Nahawand,
   Ajam, Saba, Hijaz, Bayat, Kurd and Rast — played singly or walked up and
   down as a sayr.
   With neither, the plate slowly works through its figures by itself.
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var RR = window.RR = window.RR || {};
  var plate = document.getElementById('plate');
  if (!plate) return;
  var cv = plate.querySelector('canvas');
  var x = cv.getContext('2d');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var noteEl = plate.querySelector('[data-plate-note]');
  var hzEl = plate.querySelector('[data-plate-hz]');
  var micBtn = document.querySelector('[data-mic]');
  var micTx = document.querySelector('[data-mic-text]');

  // [n, m, sign]: cos(nπx)cos(mπy) ± cos(mπx)cos(nπy), ordered roughly by pitch
  var MODES = [[1, 2, -1], [1, 3, 1], [2, 3, -1], [1, 4, -1], [2, 4, 1], [3, 4, -1], [1, 5, 1],
               [2, 5, -1], [3, 5, 1], [4, 5, -1], [3, 6, 1], [5, 6, -1], [4, 7, 1], [5, 7, -1]];
  var N = Math.min(innerWidth, innerHeight) < 700 ? 4200 : 7500;
  var P = new Float32Array(N * 2);
  for (var i = 0; i < N; i++) seed(i);
  function seed(i) {
    var a = Math.random() * 6.2832, r = Math.sqrt(Math.random()) * 0.96;
    P[i * 2] = Math.cos(a) * r; P[i * 2 + 1] = Math.sin(a) * r;
  }

  var mode = 3, agit = 1, agitT = 0.8, source = 'idle', lastDemo = 0, visible = false;
  var PI = Math.PI;

  function field(px, py, m) {
    var X = (px + 1) * 0.5 * PI, Y = (py + 1) * 0.5 * PI;
    return Math.cos(m[0] * X) * Math.cos(m[1] * Y) + m[2] * Math.cos(m[1] * X) * Math.cos(m[0] * Y);
  }

  function setMode(k, kick) {
    k = Math.max(0, Math.min(MODES.length - 1, k | 0));
    if (k !== mode) { mode = k; if (kick) agit = Math.max(agit, 1.2); }
  }

  /* ── sizing ──────────────────────────────────────────────────────── */
  var S = 0, dpr = 1;
  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    var r = cv.getBoundingClientRect();
    S = Math.max(10, Math.round(r.width * dpr));
    cv.width = S; cv.height = S;
  }
  size();
  addEventListener('resize', size);

  // freeze a param at whatever value its automation has reached, rather than reading .value,
  // which reports the last value SET, not the value currently sounding — the source of clicks
  // Glide a param from WHATEVER it is sounding now toward v. Never read .value (it reports the
  // last value set, not the one sounding) and never follow a hold with a linear/exponential ramp
  // (a ramp measures from the previous event, which may be long past). setTargetAtTime starts
  // from the live value at t, so it cannot click or jump. tau: time to cover ~63% of the way.
  function glide(p, v, t, tau) {
    if (p.cancelAndHoldAtTime) p.cancelAndHoldAtTime(t); else p.cancelScheduledValues(t);
    p.setTargetAtTime(v, t, tau);
  }

  /* ── the maqamat ─────────────────────────────────────────────────────
     Seven maqamat, each as its eight-note ascent (cents above the tonic,
     quarter tones included), tuned to A = 432 to sit inside the garden.
     Every pitch draws the same figure in whichever maqam it falls, so the
     plate shows how the maqamat share and bend the same ground. */
  var A432 = 432;
  var TONIC = { Bb3: A432 * Math.pow(2, -11 / 12), C4: A432 * Math.pow(2, -9 / 12), D4: A432 * Math.pow(2, -7 / 12) };
  var MAQAMAT = {
    rast:     { name: 'Rast', ar: 'راست', tonic: 'C4', glow: [233, 165, 91],
                cents: [0, 200, 350, 500, 700, 900, 1050, 1200], notes: ['C', 'D', 'E½♭', 'F', 'G', 'A', 'B½♭', 'C'],
                built: 'Jins Rast on C · jins Rast on G', mood: 'The mother of the maqamat — upright, grounded, whole.' },
    nahawand: { name: 'Nahawand', ar: 'نهاوند', tonic: 'C4', glow: [201, 167, 232],
                cents: [0, 200, 300, 500, 700, 800, 1100, 1200], notes: ['C', 'D', 'E♭', 'F', 'G', 'A♭', 'B', 'C'],
                built: 'Jins Nahawand on C · jins Hijaz on G', mood: 'Tender and romantic, with a gentle ache.' },
    ajam:     { name: 'Ajam', ar: 'عجم', tonic: 'Bb3', glow: [239, 226, 204],
                cents: [0, 200, 400, 500, 700, 900, 1100, 1200], notes: ['B♭', 'C', 'D', 'E♭', 'F', 'G', 'A', 'B♭'],
                built: 'Jins Ajam on B♭ · jins Ajam on F', mood: 'Bright and open — a morning, a celebration.' },
    saba:     { name: 'Saba', ar: 'صبا', tonic: 'D4', glow: [120, 160, 230],
                cents: [0, 150, 300, 400, 700, 800, 1000, 1100], notes: ['D', 'E½♭', 'F', 'G♭', 'A', 'B♭', 'C', 'D♭'],
                built: 'Jins Saba on D · jins Hijaz on F — its octave falls short, to D♭', mood: 'Longing — the heart that has not yet arrived.' },
    hijaz:    { name: 'Hijaz', ar: 'حجاز', tonic: 'D4', glow: [217, 80, 74],
                cents: [0, 100, 400, 500, 700, 800, 1000, 1200], notes: ['D', 'E♭', 'F♯', 'G', 'A', 'B♭', 'C', 'D'],
                built: 'Jins Hijaz on D · jins Nahawand on G', mood: 'The desert and the far horizon; the pilgrim road.' },
    bayat:    { name: 'Bayat', ar: 'بياتي', tonic: 'D4', glow: [84, 199, 168],
                cents: [0, 150, 300, 500, 700, 800, 1000, 1200], notes: ['D', 'E½♭', 'F', 'G', 'A', 'B♭', 'C', 'D'],
                built: 'Jins Bayat on D · jins Nahawand on G', mood: 'Earthy and warm — the voice of the people.' },
    kurd:     { name: 'Kurd', ar: 'كرد', tonic: 'D4', glow: [150, 214, 190],
                cents: [0, 100, 300, 500, 700, 800, 1000, 1200], notes: ['D', 'E♭', 'F', 'G', 'A', 'B♭', 'C', 'D'],
                built: 'Jins Kurd on D · jins Nahawand on G', mood: 'Plain-spoken and intimate; a lament sung close.' }
  };
  var ORDER = ['nahawand', 'ajam', 'saba', 'hijaz', 'bayat', 'kurd', 'rast'];
  var maqam = 'hijaz', glow = MAQAMAT.hijaz.glow.slice(), glowT = glow.slice();
  var LOWEST = TONIC.Bb3, HIGHEST = TONIC.D4 * 2;
  function freqOf(m, i) { return TONIC[m.tonic] * Math.pow(2, m.cents[i] / 1200); }
  // the same pitch always draws the same figure: B♭3 the simplest, D5 the most intricate
  function modeOf(f) { return Math.round(Math.log2(f / LOWEST) / Math.log2(HIGHEST / LOWEST) * (MODES.length - 1)); }

  var tabsEl = document.querySelector('[data-maqamat]');
  var notesEl = document.querySelector('[data-notes]');
  var moodEl = document.querySelector('[data-maqam-mood]');
  var builtEl = document.querySelector('[data-maqam-built]');
  var sayrBtn = document.querySelector('[data-sayr]');
  var noteBtns = [];

  function buildNotes() {
    var m = MAQAMAT[maqam];
    notesEl.innerHTML = '';
    notesEl.setAttribute('aria-label', 'The notes of maqam ' + m.name);
    noteBtns = m.cents.map(function (c, i) {
      var b = document.createElement('button');
      b.type = 'button';
      var f = freqOf(m, i);
      b.dataset.note = f.toFixed(2);
      b.dataset.i = i;
      b.setAttribute('aria-pressed', 'false');
      b.setAttribute('aria-label', m.notes[i].replace('½♭', ' half-flat').replace('♭', ' flat').replace('♯', ' sharp') + ', degree ' + (i + 1));
      b.innerHTML = '<b></b><i>' + (i + 1) + '</i><s>' + Math.round(f) + ' Hz</s>';
      b.querySelector('b').textContent = m.notes[i];
      if (c % 100) b.classList.add('is-quarter');
      b.addEventListener('click', function () { stopSayr(); pressNote(b, true); });
      notesEl.appendChild(b);
      return b;
    });
    if (moodEl) moodEl.textContent = m.mood;
    if (builtEl) builtEl.textContent = m.built;
    plate.style.setProperty('--glow', m.glow.join(','));
  }

  function setMaqam(key) {
    if (!MAQAMAT[key]) return;
    stopSayr();
    if (tone) stopTone();
    maqam = key; glowT = MAQAMAT[key].glow.slice();
    if (tabsEl) [].forEach.call(tabsEl.querySelectorAll('button'), function (b) {
      b.setAttribute('aria-pressed', b.dataset.maqam === key ? 'true' : 'false');
    });
    buildNotes();
    if (source === 'tone') source = micOn ? 'mic' : 'idle';
    read(MAQAMAT[key].name, 'on ' + MAQAMAT[key].notes[0] + ' · tap a note, or play the maqam');
  }

  if (tabsEl) {
    ORDER.forEach(function (key) {
      var m = MAQAMAT[key], b = document.createElement('button');
      b.type = 'button'; b.dataset.maqam = key; b.setAttribute('aria-pressed', 'false');
      b.innerHTML = '<span lang="ar"></span><b></b>';
      b.querySelector('span').textContent = m.ar;
      b.querySelector('b').textContent = m.name;
      b.addEventListener('click', function () { setMaqam(key); });
      tabsEl.appendChild(b);
    });
  }

  /* ── tones ───────────────────────────────────────────────────────── */
  var tone = null, toneBtn = null;
  function playTone(f, btn) {
    var ctx = RR.audio && RR.audio.ensure();
    if (!ctx) return;
    var t = ctx.currentTime;
    var root = TONIC[MAQAMAT[maqam].tonic] / 2;
    if (!tone) {
      var o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain(), g2 = ctx.createGain();
      // under every note, the maqam's tonic an octave down: each degree is heard against home
      var d = ctx.createOscillator(), dg = ctx.createGain();
      o.type = 'sine'; o2.type = 'sine'; d.type = 'sine';
      o.frequency.value = f; o2.frequency.value = f * 2; d.frequency.value = root;
      g2.gain.value = 0.16;
      dg.gain.setValueAtTime(0, t); dg.gain.setTargetAtTime(0.035, t, 0.5);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.075, t + 0.25);
      o.connect(g); o2.connect(g2); g2.connect(g); g.connect(ctx.destination);
      d.connect(dg); dg.connect(ctx.destination);
      if (RR.audio.verb) { g.connect(RR.audio.verb); dg.connect(RR.audio.verb); }
      o.start(t); o2.start(t); d.start(t);
      tone = { o: o, o2: o2, g: g, d: d, dg: dg };
    } else {
      glide(tone.o.frequency, f, t, 0.045);
      glide(tone.o2.frequency, f * 2, t, 0.045);
      glide(tone.d.frequency, root, t, 0.2);
    }
    if (toneBtn) toneBtn.classList.remove('is-on');
    toneBtn = btn; if (btn) btn.classList.add('is-on');
  }
  function stopTone() {
    if (toneBtn) toneBtn.classList.remove('is-on');
    toneBtn = null;
    noteBtns.forEach(function (o) { o.setAttribute('aria-pressed', 'false'); });
    if (!tone) return;
    var ctx = RR.audio.ctx, t = ctx.currentTime, tn = tone; tone = null;
    glide(tn.g.gain, 0, t, 0.12); glide(tn.dg.gain, 0, t, 0.3);
    tn.o.stop(t + 1.5); tn.o2.stop(t + 1.5); tn.d.stop(t + 1.5);
  }

  function pressNote(b, toggle) {
    if (toggle && toneBtn === b) {
      stopTone(); source = micOn ? 'mic' : 'idle'; return;
    }
    if (micOn) stopMic();
    noteBtns.forEach(function (o) { o.setAttribute('aria-pressed', 'false'); });
    b.setAttribute('aria-pressed', 'true');
    var f = parseFloat(b.dataset.note), m = MAQAMAT[maqam];
    playTone(f, b);
    setMode(modeOf(f), true);
    source = 'tone'; agitT = 1;
    read(m.notes[+b.dataset.i], m.name + ' · degree ' + (+b.dataset.i + 1) + ' · ' + f.toFixed(1) + ' Hz');
  }

  /* the sayr: the maqam walked up and back down, every note drawing its figure */
  var sayrTimer = 0, sayrOn = false;
  function stopSayr() {
    clearTimeout(sayrTimer);
    if (!sayrOn) return;
    sayrOn = false;
    if (sayrBtn) { sayrBtn.setAttribute('aria-pressed', 'false'); sayrBtn.querySelector('[data-sayr-text]').textContent = 'Play the maqam'; }
  }
  function sayr() {
    if (sayrOn) { stopSayr(); stopTone(); source = 'idle'; return; }
    sayrOn = true;
    sayrBtn.setAttribute('aria-pressed', 'true'); sayrBtn.querySelector('[data-sayr-text]').textContent = 'Stop';
    var seq = [0, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1, 0];
    var k = 0;
    (function step() {
      if (!sayrOn) return;
      if (k >= seq.length) {
        stopSayr();
        sayrTimer = setTimeout(function () { if (!sayrOn && tone) { stopTone(); source = micOn ? 'mic' : 'idle'; } }, 1800);
        return;
      }
      pressNote(noteBtns[seq[k]], false);
      // linger at the top, and at home
      var d = k === 7 ? 1700 : k === seq.length - 1 ? 2200 : k === 0 ? 1300 : 820;
      k++;
      sayrTimer = setTimeout(step, d);
    })();
  }
  if (sayrBtn) sayrBtn.addEventListener('click', function () { if (micOn) stopMic(); sayr(); });

  if (notesEl) setMaqam('hijaz');

  /* ── microphone ──────────────────────────────────────────────────── */
  var micOn = false, stream = null, an = null, buf = null, micSrc = null, pitchSmooth = 0, stableFor = 0, candidate = -1;
  function startMic() {
    var ctx = RR.audio && RR.audio.ensure();
    if (!ctx || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      micTx.textContent = 'No microphone here — try a note'; return;
    }
    micTx.textContent = 'Waiting for permission…';
    navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: false, autoGainControl: false } })
      .then(function (s) {
        stream = s;
        micSrc = ctx.createMediaStreamSource(s);
        an = ctx.createAnalyser(); an.fftSize = 2048; buf = new Float32Array(an.fftSize);
        micSrc.connect(an);                                   // never to the speakers
        micOn = true; source = 'mic';
        stopSayr(); stopTone();
        if (RR.audio.on) RR.audio.duck(true);
        micBtn.classList.add('is-on'); micBtn.setAttribute('aria-pressed', 'true');
        micTx.textContent = 'Listening — hum a long note';
        read('—', 'hum a long note');
      })
      .catch(function () { micTx.textContent = 'Microphone declined — try a note'; });
  }
  function stopMic() {
    micOn = false;
    if (stream) stream.getTracks().forEach(function (t) { t.stop(); });
    stream = null; an = null;
    if (micSrc) { micSrc.disconnect(); micSrc = null; }
    if (RR.audio && RR.audio.on) RR.audio.duck(false);
    micBtn.classList.remove('is-on'); micBtn.setAttribute('aria-pressed', 'false');
    micTx.textContent = 'Hum with your voice';
    if (source === 'mic') source = 'idle';
  }
  if (micBtn) {
    micBtn.setAttribute('aria-pressed', 'false');
    micBtn.addEventListener('click', function () { micOn ? stopMic() : startMic(); });
  }

  // autocorrelation pitch — good enough for a sustained hum, which is what is asked for
  function detect() {
    an.getFloatTimeDomainData(buf);
    var n = buf.length, rms = 0;
    for (var i = 0; i < n; i++) rms += buf[i] * buf[i];
    rms = Math.sqrt(rms / n);
    if (rms < 0.012) return { f: 0, rms: rms };
    var sr = an.context.sampleRate, lo = Math.floor(sr / 900), hi = Math.floor(sr / 70);
    var best = -1, bestV = 0, half = n - hi;
    var e0 = 0; for (i = 0; i < half; i++) e0 += buf[i] * buf[i];
    for (var lag = lo; lag <= hi; lag++) {
      var s = 0;
      for (i = 0; i < half; i++) s += buf[i] * buf[i + lag];
      s /= e0;
      if (s > bestV) { bestV = s; best = lag; }
    }
    if (bestV < 0.72 || best < 0) return { f: 0, rms: rms };
    return { f: sr / best, rms: rms };
  }

  var NOTES = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'B♭', 'B'];
  function noteName(f) {
    var m = Math.round(12 * Math.log2(f / 440)) + 69;
    return NOTES[((m % 12) + 12) % 12] + (Math.floor(m / 12) - 1);
  }
  function read(a, b) { if (noteEl) noteEl.textContent = a; if (hzEl) hzEl.textContent = b; }

  /* ── loop ────────────────────────────────────────────────────────── */
  var io = new IntersectionObserver(function (es) {
    visible = es[0].isIntersecting;
    if (!visible) { if (micOn) stopMic(); stopSayr(); if (tone) { stopTone(); source = 'idle'; } }
  }, { threshold: 0 });
  io.observe(plate);

  var last = performance.now(), tick = 0;
  function frame(now) {
    requestAnimationFrame(frame);
    var dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (!visible) return;
    tick++;

    if (source === 'mic' && an && tick % 2 === 0) {
      var r = detect();
      agitT = Math.min(1.3, r.rms * 16);
      if (r.f) {
        pitchSmooth = pitchSmooth ? pitchSmooth + (r.f - pitchSmooth) * 0.3 : r.f;
        var k = Math.round(Math.log2(pitchSmooth / 80) / Math.log2(620 / 80) * (MODES.length - 1));
        if (k === candidate) stableFor += dt * 2; else { candidate = k; stableFor = 0; }
        if (stableFor > 0.18) setMode(k, false);
        read(noteName(pitchSmooth), pitchSmooth.toFixed(1) + ' Hz · figure ' + MODES[mode][0] + ':' + MODES[mode][1]);
      } else if (r.rms < 0.012) {
        read('—', 'hum a long note');
      }
      if (RR.field) RR.field.level(Math.min(1, r.rms * 8));
    } else if (source === 'idle') {
      if (now - lastDemo > 7000) { lastDemo = now; setMode((mode + 1 + (Math.random() * 3 | 0)) % MODES.length, true); agitT = 0.9; }
      if (now - lastDemo > 2600) agitT = 0.12;
      read('Resting figure', MODES[mode][0] + ' : ' + MODES[mode][1]);
    }
    agit += (agitT - agit) * (1 - Math.exp(-dt * 3));

    var m = MODES[mode], a = reduce ? 0.9 : agit;
    var steps = reduce ? 1 : 2;
    for (var s = 0; s < steps; s++) {
      for (var i = 0; i < N; i++) {
        var px = P[i * 2], py = P[i * 2 + 1];
        var v = Math.abs(field(px, py, m));
        var st = a * (0.0012 + v * 0.028);
        px += (Math.random() - 0.5) * st * 2;
        py += (Math.random() - 0.5) * st * 2;
        var rr = px * px + py * py;
        if (rr > 0.94) { var sc = 0.96 / Math.sqrt(rr) * 0.99; px *= sc; py *= sc; }
        P[i * 2] = px; P[i * 2 + 1] = py;
      }
    }

    // the last frame is left to fade rather than wiped, so moving grains draw their own short trails
    var h = S / 2, rad = h * 0.985;
    x.globalCompositeOperation = 'destination-out';
    x.fillStyle = 'rgba(0,0,0,' + (reduce ? 1 : 0.34) + ')';
    x.fillRect(0, 0, S, S);
    x.globalCompositeOperation = 'lighter';
    for (var gi = 0; gi < 3; gi++) glow[gi] += (glowT[gi] - glow[gi]) * Math.min(1, dt * 3);
    var gc = (glow[0] | 0) + ',' + (glow[1] | 0) + ',' + (glow[2] | 0);
    var g = x.createRadialGradient(h, h, 0, h, h, rad);
    g.addColorStop(0, 'rgba(' + gc + ',' + (0.04 + 0.04 * Math.min(1, a)).toFixed(3) + ')'); g.addColorStop(1, 'rgba(' + gc + ',0)');
    x.fillStyle = g; x.beginPath(); x.arc(h, h, rad, 0, 6.2832); x.fill();
    // where grains gather the light adds up: the figure glows, the scatter stays sand
    x.fillStyle = 'rgba(239,226,204,0.5)';
    var ds = Math.max(1, 1.5 * dpr);
    for (i = 0; i < N; i++) x.fillRect(h + P[i * 2] * rad - ds / 2, h + P[i * 2 + 1] * rad - ds / 2, ds, ds);
    x.globalCompositeOperation = 'source-over';
  }
  requestAnimationFrame(frame);
})();
