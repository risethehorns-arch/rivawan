/* ══════════════════════════════════════════════════════════════════════
   THE GARDEN — the site's sound

   Rawan asked for sound that settles the nervous system rather than
   stirring it: the frequencies she plays in her own space, and birds.
   So this is a garden at dawn, synthesised live in the browser (nothing
   is a recording, nothing is fetched):

     the bed     pure sine tones at 432, 528 and 741 Hz over a soft root
                 (108 / 216 Hz), each breathing in and out on its own slow
                 tide, so the chord is never quite the same twice
     the plant   sparse, unhurried notes in a pentatonic tuned to A = 432,
                 now and then gliding between pitches — the way plant
                 bio-sonification sings
     the birds   a handful of procedural songbirds (a warbler's trill, a
                 blackbird's phrase, a two-note "fee-bee", a far-off dove)
                 placed around the listener, near and far
     the breeze  a whisper of filtered air underneath it all

   Holding to whirl breathes a tone that climbs from 432 toward 528.
   Off until the visitor asks for it — never autoplays. A visitor who left
   it on is offered it back on their next page, on their first touch.

   Also owns the AudioContext for the cymatics plate (tones + microphone),
   so the page only ever opens one.
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var RR = window.RR = window.RR || {};
  var AC = window.AudioContext || window.webkitAudioContext;
  var ctx = null, master, bedBus, bedFilt, verb, verbGain, melBus, birdBus, breath = null;
  var on = false, ducked = false, built = false, timers = [];

  // A = 432: a gentle major pentatonic on D, two octaves
  var A4 = 432;
  function at(semis) { return A4 * Math.pow(2, semis / 12); }
  var SCALE = [-7, -5, -3, 0, 2, 5, 7, 9, 12, 14].map(at);          // D4 E4 F♯4 A4 B4 D5 E5 F♯5 A5 B5
  var CHIMES = [-7, -5, -3, 0, 2, 5, 7, 9].map(function (s) { return at(s + 12); });

  // each section leans the garden a little: how often the plant sings, how busy the birds are
  var MOODS = {
    '':     { notes: 1, birds: 1, bright: 2600 },
    voice:  { notes: 0.8, birds: 1.6, bright: 2800 },    // Al-Tuyoor: the birds come closer
    whirl:  { notes: 1.4, birds: 0.8, bright: 3000 },
    sound:  { notes: 0.45, birds: 0.6, bright: 2000 },   // the plate is speaking: the garden hushes
    circle: { notes: 1, birds: 1, bright: 2200 },
    path:   { notes: 0.9, birds: 1.5, bright: 2600 }
  };
  var mood = MOODS[''];

  // Glide a param from WHATEVER it is sounding now toward v. Never read .value (it reports the
  // last value set, not the one sounding) and never follow a hold with a linear/exponential ramp
  // (a ramp measures from the previous event, which may be long past). setTargetAtTime starts
  // from the live value at t, so it cannot click or jump. tau: time to cover ~63% of the way.
  function glide(p, v, t, tau) {
    if (p.cancelAndHoldAtTime) p.cancelAndHoldAtTime(t); else p.cancelScheduledValues(t);
    p.setTargetAtTime(v, t, tau);
  }
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function pick(a) { return a[(Math.random() * a.length) | 0]; }

  function ensure() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return ctx; }
    if (!AC) return null;
    ctx = new AC();

    master = ctx.createGain(); master.gain.value = 0;
    var comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -20; comp.knee.value = 18; comp.ratio.value = 2; comp.attack.value = 0.05; comp.release.value = 0.6;
    master.connect(comp); comp.connect(ctx.destination);

    // a generated open-air space: soft, dark, long — more glade than hall
    verb = ctx.createConvolver();
    var len = ctx.sampleRate * 5, ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (var ch = 0; ch < 2; ch++) {
      var d = ir.getChannelData(ch), lp = 0;
      for (var i = 0; i < len; i++) {
        lp += ((Math.random() * 2 - 1) - lp) * 0.35;                 // one-pole lowpass: no hiss in the tail
        d[i] = lp * Math.pow(1 - i / len, 2.6) * (i < ctx.sampleRate * 0.012 ? i / (ctx.sampleRate * 0.012) : 1);
      }
    }
    verb.buffer = ir;
    verbGain = ctx.createGain(); verbGain.gain.value = 0.7;
    verb.connect(verbGain); verbGain.connect(master);

    bedBus = ctx.createGain(); bedBus.gain.value = 1;
    bedFilt = ctx.createBiquadFilter(); bedFilt.type = 'lowpass'; bedFilt.frequency.value = 2600; bedFilt.Q.value = 0.4;
    bedBus.connect(bedFilt); bedFilt.connect(master); bedFilt.connect(verb);

    melBus = ctx.createGain(); melBus.gain.value = 1; melBus.connect(master); melBus.connect(verb);
    // the birds sit forward of the bed: Rawan asked for them by name
    birdBus = ctx.createGain(); birdBus.gain.value = 2.5; birdBus.connect(master); birdBus.connect(verb);

    RR.audio.ctx = ctx;
    RR.audio.verb = verb;
    return ctx;
  }

  /* ── the bed: 108 · 216 · 432 · 528 · 741 ───────────────────────── */
  function bed() {
    var tones = [
      { f: 108, g: 0.055, rate: 0.021 },
      { f: 216, g: 0.040, rate: 0.034 },
      { f: 432, g: 0.022, rate: 0.047, beat: 0.25 },     // a slow shimmer: two sines a quarter-hertz apart
      { f: 528, g: 0.016, rate: 0.029, beat: 0.18 },
      { f: 741, g: 0.0075, rate: 0.053 }
    ];
    tones.forEach(function (p, k) {
      var g = ctx.createGain(); g.gain.value = p.g;
      // its own tide: an LFO swelling this tone between ~35% and 100%
      var lfo = ctx.createOscillator(), lg = ctx.createGain();
      lfo.frequency.value = p.rate; lg.gain.value = p.g * 0.65;
      lfo.connect(lg); lg.connect(g.gain);
      lfo.start(ctx.currentTime + k * 3.1);
      [0, p.beat || 0].forEach(function (b, j) {
        if (j && !b) return;
        var o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = p.f + b;
        var pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
        if (pan) { pan.pan.value = j ? 0.35 : -0.2 + k * 0.1; o.connect(pan); pan.connect(g); } else o.connect(g);
        o.start();
      });
      g.connect(bedBus);
    });
    // the breeze: brown noise through a wandering bandpass
    var nb = ctx.createBuffer(1, ctx.sampleRate * 6, ctx.sampleRate), nd = nb.getChannelData(0), last = 0;
    for (var i = 0; i < nd.length; i++) { last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; nd[i] = last * 3.2; }
    var n = ctx.createBufferSource(); n.buffer = nb; n.loop = true;
    var bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 520; bp.Q.value = 0.5;
    var ng = ctx.createGain(); ng.gain.value = 0.05;
    var bl = ctx.createOscillator(), blg = ctx.createGain(); bl.frequency.value = 0.07; blg.gain.value = 0.035;
    bl.connect(blg); blg.connect(ng.gain); bl.start();
    var bf = ctx.createOscillator(), bfg = ctx.createGain(); bf.frequency.value = 0.043; bfg.gain.value = 220;
    bf.connect(bfg); bfg.connect(bp.frequency); bf.start();
    n.connect(bp); bp.connect(ng); ng.connect(master); n.start();
  }

  /* ── the plant ───────────────────────────────────────────────────── */
  var noteAt = 0, lastNote = 4;
  function plantNote(when) {
    // a slow random walk through the scale: mostly steps, sometimes a leap
    var step = Math.random() < 0.75 ? pick([-1, 1, -1, 1, 2, -2]) : pick([-4, -3, 3, 4]);
    lastNote = Math.max(0, Math.min(SCALE.length - 1, lastNote + step));
    var f = SCALE[lastNote];
    var o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain(), g2 = ctx.createGain();
    o.type = 'sine'; o2.type = 'sine';
    o.frequency.setValueAtTime(f, when);
    o2.frequency.setValueAtTime(f * 3.0, when);                      // a faint wooden overtone, like a kalimba tine
    if (Math.random() < 0.3) {                                       // the glide that makes it sound alive
      var to = SCALE[Math.max(0, Math.min(SCALE.length - 1, lastNote + pick([-1, 1])))];
      o.frequency.setTargetAtTime(to, when + rnd(0.2, 0.6), 0.35);
      o2.frequency.setTargetAtTime(to * 3, when + rnd(0.2, 0.6), 0.35);
    }
    var peak = rnd(0.028, 0.05), dur = rnd(2.6, 5.2);
    g.gain.setValueAtTime(0, when);
    g.gain.linearRampToValueAtTime(peak, when + rnd(0.04, 0.35));
    g.gain.exponentialRampToValueAtTime(0.0004, when + dur);
    g2.gain.setValueAtTime(0, when);
    g2.gain.linearRampToValueAtTime(peak * 0.12, when + 0.02);
    g2.gain.exponentialRampToValueAtTime(0.0002, when + 0.8);
    var pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    var out = pan || melBus;
    if (pan) { pan.pan.value = rnd(-0.6, 0.6); pan.connect(melBus); }
    o.connect(g); o2.connect(g2); g.connect(out); g2.connect(out);
    o.start(when); o2.start(when); o.stop(when + dur + 0.1); o2.stop(when + dur + 0.1);
  }

  /* ── the birds ───────────────────────────────────────────────────── */
  // every bird is a sine whistle with a pitch contour and an envelope, placed somewhere around you
  function voice(when, near, pan) {
    var g = ctx.createGain(), lp = ctx.createBiquadFilter(), p = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    lp.type = 'lowpass'; lp.frequency.value = 3500 + 5000 * near;
    g.gain.value = 0.35 + 0.65 * near;
    g.connect(lp);
    if (p) { p.pan.value = pan; lp.connect(p); p.connect(birdBus); } else lp.connect(birdBus);
    return g;
  }
  function whistle(out, t, dur, f0, f1, peak, curve, vib) {
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(f0, t);
    if (curve === 'exp') o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    else o.frequency.linearRampToValueAtTime(f1, t + dur);
    if (vib) {
      var v = ctx.createOscillator(), vg = ctx.createGain();
      v.frequency.value = vib[0]; vg.gain.value = vib[1];
      v.connect(vg); vg.connect(o.frequency); v.start(t); v.stop(t + dur + 0.05);
    }
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + Math.min(0.012, dur * 0.25));
    g.gain.setValueAtTime(peak, t + dur * 0.6);
    g.gain.linearRampToValueAtTime(0, t + dur);
    o.connect(g); g.connect(out);
    o.start(t); o.stop(t + dur + 0.02);
  }
  var BIRDS = {
    // a warbler: a quick, falling trill
    warbler: function (t, out) {
      var n = 7 + (Math.random() * 9 | 0), f = rnd(3600, 4800), gap = rnd(0.06, 0.085), drop = rnd(0.97, 0.99);
      for (var i = 0; i < n; i++) {
        whistle(out, t, gap * 0.7, f * 1.12, f * 0.86, 0.02, 'lin');
        t += gap * (1 - i * 0.012); f *= drop;
      }
    },
    // a blackbird: a few unhurried fluted notes, each one bending
    blackbird: function (t, out) {
      var n = 3 + (Math.random() * 4 | 0);
      for (var i = 0; i < n; i++) {
        var d = rnd(0.12, 0.32), a = rnd(1700, 2900), b = a * rnd(0.8, 1.3);
        whistle(out, t, d, a, b, 0.024, 'exp', [rnd(14, 26), rnd(30, 90)]);
        t += d + rnd(0.04, 0.12);
      }
    },
    // "fee-bee": two clear notes, the second a step lower
    feebee: function (t, out) {
      var f = rnd(3500, 4100);
      whistle(out, t, 0.32, f, f * 0.995, 0.02, 'lin');
      whistle(out, t + 0.42, 0.38, f * 0.86, f * 0.84, 0.018, 'lin');
    },
    // a single far chirp, rising
    chirp: function (t, out) {
      var n = 1 + (Math.random() * 3 | 0);
      for (var i = 0; i < n; i++) { whistle(out, t, 0.07, rnd(2800, 3600), rnd(4400, 5600), 0.018, 'exp'); t += rnd(0.12, 0.3); }
    },
    // a turtle dove, far away: soft low coos
    dove: function (t, out) {
      var f = rnd(430, 520);
      [0.5, 0.75, 0.5, 0.5].forEach(function (d, i) {
        whistle(out, t, d, f * (i === 1 ? 1.06 : 1), f * 0.94, i === 1 ? 0.05 : 0.038, 'lin', [7, 6]);
        t += d + 0.14;
      });
    }
  };
  var BIRD_ODDS = ['warbler', 'warbler', 'blackbird', 'blackbird', 'blackbird', 'feebee', 'chirp', 'chirp', 'dove'];
  var birdAt = 0, perches = [];
  for (var pi = 0; pi < 5; pi++) perches.push({ pan: rnd(-0.85, 0.85), near: rnd(0.15, 0.9) });   // the same few birds, in their own trees

  function scheduler() {
    if (!on || !ctx || document.hidden) return;
    var now = ctx.currentTime, ahead = now + 1.2;
    while (noteAt < ahead) {
      if (noteAt < now) noteAt = now + 0.05;
      plantNote(noteAt);
      // sometimes two notes close together, then a long rest
      noteAt += (Math.random() < 0.22 ? rnd(0.35, 0.8) : rnd(1.6, 4.6)) / mood.notes;
    }
    while (birdAt < ahead) {
      if (birdAt < now) birdAt = now + rnd(0.5, 2);
      var kind = pick(BIRD_ODDS), perch = pick(perches);
      if (kind === 'dove') perch = { pan: perch.pan, near: 0.12 };
      BIRDS[kind](birdAt, voice(birdAt, perch.near, perch.pan));
      // a bird often answers itself
      if (kind !== 'dove' && Math.random() < 0.35) BIRDS[kind](birdAt + rnd(1.4, 2.6), voice(birdAt, perch.near, perch.pan));
      birdAt += rnd(2.8, 9) / mood.birds;
    }
  }

  function build() {
    if (built) return;
    built = true;
    bed();
    noteAt = ctx.currentTime + 1.5; birdAt = ctx.currentTime + 2.5;
    timers.push(setInterval(scheduler, 400));
  }

  function setMaster(v, secs) {
    if (!ctx) return;
    glide(master.gain, v, ctx.currentTime, (secs || 1.5) / 3);
  }
  function level() { return on ? (ducked ? 0.1 : 0.62) : 0; }

  function setOn(v) {
    on = !!v;
    if (on) { if (!ensure()) { on = false; return false; } build(); }
    setMaster(level(), on ? 4 : 0.9);
    try { localStorage.setItem('rr-sound', on ? '1' : '0'); } catch (e) {}
    document.querySelectorAll('[data-sound]').forEach(function (b) {
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      if (b.classList.contains('snd')) b.setAttribute('aria-label', 'Sound: ' + (on ? 'on' : 'off'));
      var tx = b.querySelector('[data-sound-text]');
      if (tx) tx.textContent = on ? 'Sound is on' : 'Enter with sound';
      b.classList.toggle('is-on', on);
    });
    document.documentElement.classList.toggle('has-sound', on);
    if (RR.field) RR.field.level(on ? 0.18 : 0);
    return on;
  }

  // holding: a breath of tone that climbs from 432 toward 528 while you turn
  function hold(v) {
    if (!on || !ctx) return;
    var t = ctx.currentTime;
    if (v && !breath) {
      var o = ctx.createOscillator(), o2 = ctx.createOscillator(), vib = ctx.createOscillator(), vg = ctx.createGain(), g = ctx.createGain();
      o.type = 'sine'; o2.type = 'sine';
      o.frequency.setValueAtTime(432, t); o.frequency.setTargetAtTime(528, t + 0.4, 2.6);
      o2.frequency.setValueAtTime(648, t); o2.frequency.setTargetAtTime(792, t + 0.4, 2.6);   // a fifth above, very quiet
      vib.frequency.value = 4.6; vg.gain.value = 2.2; vib.connect(vg); vg.connect(o.frequency);
      var g2 = ctx.createGain(); g2.gain.value = 0.3;
      g.gain.setValueAtTime(0, t); g.gain.setTargetAtTime(0.05, t, 0.6);
      o.connect(g); o2.connect(g2); g2.connect(g);
      g.connect(master); g.connect(verb);
      o.start(t); o2.start(t); vib.start(t);
      breath = { o: o, o2: o2, vib: vib, g: g };
      glide(bedFilt.frequency, 4200, t, 1.6);
    } else if (!v && breath) {
      var b = breath; breath = null;
      glide(b.g.gain, 0, t, 0.6);
      [b.o, b.o2, b.vib].forEach(function (s) { s.stop(t + 4); });
      glide(bedFilt.frequency, mood.bright, t, 1.4);
    }
  }

  // a small bell from the scale, for hovering the navigation
  var lastChime = 0;
  function chime(i) {
    if (!on || !ctx) return;
    var t = ctx.currentTime;
    if (t - lastChime < 0.09) return; lastChime = t;
    var f = CHIMES[((i % CHIMES.length) + CHIMES.length) % CHIMES.length];
    [1, 2.76, 5.4].forEach(function (m, k) {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = f * m;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime([0.022, 0.007, 0.0025][k], t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 2.6 - k * 0.6);
      o.connect(g); g.connect(master); g.connect(verb);
      o.start(t); o.stop(t + 2.7);
    });
  }

  function section(name) {
    var m = MOODS[name] || MOODS[''];
    if (m === mood) return;
    mood = m;
    if (!ctx || !built) return;
    var t = ctx.currentTime;
    if (!breath) glide(bedFilt.frequency, m.bright, t, 2);
    glide(bedBus.gain, name === 'sound' ? 0.55 : 1, t, 1.5);
  }

  // a visitor who left the garden playing gets it back on their first touch of the next page
  // (browsers only let sound start from a gesture, so this is the earliest it can honestly come)
  var wanted = false;
  try { wanted = localStorage.getItem('rr-sound') === '1'; } catch (e) {}
  if (wanted && AC) {
    document.documentElement.classList.add('sound-waiting');
    var resume = function (e) {
      if (e && e.target && e.target.closest && e.target.closest('[data-sound]')) { cleanup(); return; }   // the button handles itself
      cleanup();
      if (!on) setOn(true);
    };
    var cleanup = function () {
      document.documentElement.classList.remove('sound-waiting');
      removeEventListener('pointerdown', resume, true); removeEventListener('keydown', resume, true);
    };
    addEventListener('pointerdown', resume, true); addEventListener('keydown', resume, true);
  }

  RR.audio = {
    ctx: null,
    ensure: ensure,
    get on() { return on; },
    toggle: function () { return setOn(!on); },
    set: setOn,
    hold: hold,
    chime: chime,
    call: function (kind, pan) { if (!on || !ctx || !built) return; var t = ctx.currentTime + 0.03; (BIRDS[kind] || BIRDS.chirp)(t, voice(t, 0.9, pan == null ? 0.5 : pan)); },
    section: section,
    duck: function (v) { ducked = !!v; setMaster(level(), 0.6); }
  };
})();
