/* ══════════════════════════════════════════════════════════════════════
   THE POST — "Or send word with a bird"

   Her address sits on a fine wire, and one of the site's ink birds is
   perched at its end (Al-Tuyoor is a show of messages from the birds;
   here a message goes the other way). The bird breathes and looks about;
   pass over the address and it hops. Send — the address is an ordinary
   mailto link — and the bird lifts off with a small letter, the wire
   twangs like one of the footer's harp strings, it calls once if the
   garden is playing, and a little later it comes back and lands.
   Copy the address and it drops a feather. Without this script the
   address and the Copy button work exactly the same.
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var RR = window.RR = window.RR || {};
  var box = document.querySelector('[data-post]');
  if (!box) return;
  var line = box.querySelector('.post__line'), addr = box.querySelector('.post__addr'), spot = box.querySelector('.post__perch');
  var note = box.querySelector('[data-post-note]'), copy = box.querySelector('[data-copy]');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS = 'http://www.w3.org/2000/svg';
  // the perched bird is drawn on a 44 x 34 grid with its feet at (20, 30); on screen it is 54 px wide
  var K = 54 / 44, FX = 20 * K, FY = 30 * K;

  // the perched bird: side on, facing the address, in the site's ink line
  var PERCHED = '<svg viewBox="0 0 44 34" aria-hidden="true">' +
    '<path class="pb-l" d="M18.6 24.6 L17.8 30 M22.2 24.8 L22.6 30"/>' +
    '<path class="pb-b" d="M8.4 12.6 C9 8.4 13.6 6.6 16.8 9.2 C19.4 11.6 24.4 12.8 29.2 14.8 L40.6 12.4 L33.8 19 C31.2 22.8 25.8 25 19.8 24.9 C13.6 24.8 9.4 21 8.4 16.4 Z"/>' +
    '<path class="pb-l" d="M8.7 12.9 L4.4 14.5 L8.6 15.7"/><circle cx="11.9" cy="11.7" r="1.05"/>' +
    '<path class="pb-l" d="M15.6 16.6 C20.2 14.4 26.2 15.4 31.4 18.6"/><path class="pb-f" d="M18.2 19.6 C22.2 18.4 26.4 19 29.6 20.9"/></svg>';
  // in the air it is the skip birds' glyph, wings beating, with the letter hanging below
  var FLYING = '<svg viewBox="-20 -12 40 30" aria-hidden="true">' +
    '<g class="pf-w pf-w--l"><path d="M0 3 C-4 -2 -10 -6 -17 -5"/><path class="pf-f" d="M-6 -1.6 C-9 -3.6 -12 -4.4 -15 -4.2"/></g>' +
    '<g class="pf-w pf-w--r"><path d="M0 3 C4 -2 10 -6 17 -5"/><path class="pf-f" d="M6 -1.6 C9 -3.6 12 -4.4 15 -4.2"/></g>' +
    '<ellipse cx="0" cy="3.4" rx="1.9" ry="2.3"/>' +
    '<g class="pf-letter"><path class="pf-f" d="M0 5.6 L0 8.4"/><rect x="-3.6" y="8.4" width="7.2" height="5" rx=".6"/><path class="pf-flap" d="M-3.4 8.7 L0 11.2 L3.4 8.7"/></g></svg>';
  var FEATHER = '<svg viewBox="0 0 10 22" aria-hidden="true"><path d="M5 21 C5 14 5 7 5.4 1 M5.2 3 C8 5 8.6 9 7 13 C6.2 15 5.6 16.4 5.2 18 M5 4 C2.4 6 1.6 9.6 3 13 C3.8 15 4.4 16.4 4.8 18"/></svg>';

  var wire = document.createElementNS(NS, 'svg'); wire.setAttribute('class', 'post__wire'); wire.setAttribute('aria-hidden', 'true');
  var wp = document.createElementNS(NS, 'path'); wire.appendChild(wp);
  var bird = document.createElement('span'); bird.className = 'post__bird'; bird.innerHTML = PERCHED;
  var flyer = document.createElement('span'); flyer.className = 'post__flyer'; flyer.innerHTML = FLYING;
  line.appendChild(wire); line.appendChild(bird); line.appendChild(flyer);
  box.classList.add('is-live');

  // the wire: from under the first letter to just past the bird, dipping where the bird stands
  var x0 = 0, x1 = 0, wy = 0, bx = 0, d = 0, v = 0, rest = 1.6, perched = true, busy = false;
  function layout() {
    var L = line.getBoundingClientRect(), a = addr.getBoundingClientRect(), s = spot.getBoundingClientRect();
    x0 = a.left - L.left; wy = a.bottom - L.top - 2; bx = s.left - L.left + s.width * 0.42; x1 = s.right - L.left;
    wire.setAttribute('width', Math.ceil(L.width)); wire.setAttribute('height', Math.ceil(L.height + 30));
    draw();
  }
  function draw() {
    var f = function (n) { return n.toFixed(1); }, y = wy + d;
    wp.setAttribute('d', 'M' + f(x0) + ' ' + f(wy) + ' Q' + f((x0 + bx) / 2) + ' ' + f(wy + d * 0.9) + ' ' + f(bx) + ' ' + f(y) + ' Q' + f((bx + x1) / 2) + ' ' + f(wy + d * 0.9) + ' ' + f(x1) + ' ' + f(wy));
    bird.style.transform = 'translate(' + f(bx - FX) + 'px,' + f(y - FY) + 'px)';   // its feet on the wire
  }
  // the wire is a damped spring; it only runs while it is moving
  var running = false, last = 0;
  function tick(now) {
    var dt = Math.min(0.033, (now - last) / 1000 || 0.016); last = now;
    for (var k = 0, h = dt / 4; k < 4; k++) { v += (-620 * (d - (perched ? rest : 0)) - 7.5 * v) * h; d += v * h; }
    draw();
    if (Math.abs(v) > 0.4 || Math.abs(d - (perched ? rest : 0)) > 0.05) requestAnimationFrame(tick);
    else { d = perched ? rest : 0; draw(); running = false; }
  }
  function twang(kick) { v += kick; if (!running) { running = true; last = performance.now(); requestAnimationFrame(tick); } }

  // a flight along a curve, the bird banking with it; done() when it arrives
  function fly(from, c1, c2, to, ms, letter, done) {
    flyer.classList.add('is-on'); flyer.classList.toggle('has-letter', !!letter);
    var t0 = performance.now();
    (function step(now) {
      var t = Math.min(1, (now - t0) / ms), e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2, u = 1 - e;
      var px = u * u * u * from[0] + 3 * u * u * e * c1[0] + 3 * u * e * e * c2[0] + e * e * e * to[0];
      var py = u * u * u * from[1] + 3 * u * u * e * c1[1] + 3 * u * e * e * c2[1] + e * e * e * to[1];
      var dx = 3 * u * u * (c1[0] - from[0]) + 6 * u * e * (c2[0] - c1[0]) + 3 * e * e * (to[0] - c2[0]);
      var bank = Math.max(-18, Math.min(18, dx * 0.04));
      flyer.style.transform = 'translate(' + px.toFixed(1) + 'px,' + py.toFixed(1) + 'px) rotate(' + bank.toFixed(1) + 'deg)';
      flyer.style.opacity = from[2] != null ? String(from[2] + (to[2] - from[2]) * e) : '1';
      if (t < 1) requestAnimationFrame(step); else done();
    })(t0);
  }
  function send() {
    if (busy || reduce) return;
    busy = true; perched = false;
    var sx = bx - FX, sy = wy + d - FY;
    bird.classList.add('is-gone'); twang(-300);
    if (RR.audio && RR.audio.on) RR.audio.call('chirp', 0.7);
    fly([sx, sy, 1], [sx + 50, sy - 70], [sx + 170, sy - 190], [sx + 330, sy - 300, 0], 1700, true, function () {
      flyer.classList.remove('is-on');
      // back, from the other side of the sky, letter delivered
      setTimeout(function () {
        layout(); var hx = bx - FX, hy = wy - FY;
        fly([hx - 300, hy - 240, 0], [hx - 200, hy - 210], [hx - 40, hy - 40], [hx, hy, 1], 1500, false, function () {
          flyer.classList.remove('is-on'); bird.classList.remove('is-gone'); perched = true; twang(240); busy = false;
        });
      }, 2600);
    });
  }
  function say(t) { if (!note) return; note.textContent = t; note.classList.add('is-on'); clearTimeout(say.t); say.t = setTimeout(function () { note.classList.remove('is-on'); }, 5200); }

  addr.addEventListener('click', function () { send(); say('On its way — your email app is opening.'); });
  // pass over the address and the bird hops; the wire answers when it lands
  function hop() {
    if (busy || reduce || bird.classList.contains('is-hop')) return;
    bird.classList.add('is-hop'); twang(-60);
    setTimeout(function () { twang(150); }, 330);
    setTimeout(function () { bird.classList.remove('is-hop'); }, 560);
  }
  addr.addEventListener('pointerenter', function (e) { if (e.pointerType !== 'touch') hop(); });
  addr.addEventListener('focus', hop);
  // copying the address: the bird nods and lets a feather fall
  if (copy) copy.addEventListener('click', function () {
    if (busy || reduce) return;
    hop();
    var f = document.createElement('span'); f.className = 'post__feather'; f.innerHTML = FEATHER;
    f.style.left = (bx + 2) + 'px'; f.style.top = (wy - 16) + 'px';
    line.appendChild(f); setTimeout(function () { f.remove(); }, 2600);
  });

  // when it first comes into view, the wire is drawn and the bird flies in to it
  if ('IntersectionObserver' in window && !reduce) {
    bird.classList.add('is-gone'); perched = false; d = 0; busy = true;   // nothing to send until it has landed
    var io = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      io.disconnect(); layout(); box.classList.add('is-drawn');
      setTimeout(function () {
        var hx = bx - FX, hy = wy - FY;
        fly([hx + 260, hy - 200, 0], [hx + 170, hy - 170], [hx + 40, hy - 40], [hx, hy, 1], 1400, false, function () {
          flyer.classList.remove('is-on'); bird.classList.remove('is-gone'); perched = true; busy = false; twang(220);
        });
      }, 900);
    }, { threshold: 0.6 });
    io.observe(box);
  } else box.classList.add('is-drawn');

  addEventListener('resize', layout);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
  layout();
})();
