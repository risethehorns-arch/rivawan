/* ══════════════════════════════════════════════════════════════════════
   THE STRINGS — the footer's platforms, strung as a small harp

   Each platform's glyph sits on its own string, between a curved neck
   and a straight soundboard; the strings shorten to the right like a
   harp's. Pass over a string (or focus it, or touch it) and it is
   plucked: it rings in the platform's own colour, its neighbours hum
   in sympathy, a ring of sound leaves the glyph, the name appears under
   it, and, when the garden is playing, it sounds a note of the scale.
   Sweep across them and you play a glissando. Without this script the
   glyphs are plain links.
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var RR = window.RR = window.RR || {};
  var ul = document.querySelector('.social');
  if (!ul) return;
  var links = [].slice.call(ul.querySelectorAll('.social__i'));
  if (links.length < 2) return;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS = 'http://www.w3.org/2000/svg';
  var BONE = [239, 231, 218];

  ul.classList.add('is-harp');
  // the harp names each platform itself; the pointer's follower ring stays out of the way
  links.forEach(function (a) { a.removeAttribute('data-cursor'); });
  var svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', 'harp'); svg.setAttribute('aria-hidden', 'true');
  var neck = document.createElementNS(NS, 'path'); neck.setAttribute('class', 'harp__neck');
  var board = document.createElementNS(NS, 'path'); board.setAttribute('class', 'harp__board');
  svg.appendChild(neck); svg.appendChild(board);
  ul.insertBefore(svg, ul.firstChild);
  var name = document.createElement('span');
  name.className = 'harp__name'; name.setAttribute('aria-hidden', 'true');
  ul.appendChild(name);

  // one string per link: a ringing path, its colour, and a damped spring
  var S = links.map(function (a, i) {
    var p = document.createElementNS(NS, 'path'); p.setAttribute('class', 'harp__str');
    svg.appendChild(p);
    var b = (getComputedStyle(a).getPropertyValue('--b') || a.style.getPropertyValue('--b') || '84,199,168').split(',').map(Number);
    return { a: a, p: p, b: b, x: 0, top: 0, bot: 0, d: 0, v: 0, glow: 0, w: 34 + i * 7, hover: false };
  });

  var W = 0, H = 0;
  function layout() {
    var r = ul.getBoundingClientRect();
    W = r.width; H = r.height;
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    // visual order, so the harp has the same silhouette in Arabic (right to left)
    var order = S.slice().sort(function (p, q) { return p.a.parentNode.getBoundingClientRect().left - q.a.parentNode.getBoundingClientRect().left; });
    var n = order.length, boardY = H - 34;
    order.forEach(function (s, k) {
      var lr = s.a.parentNode.getBoundingClientRect();
      var f = n > 1 ? k / (n - 1) : 0;
      s.x = lr.left - r.left + lr.width / 2;
      s.top = 8 + 58 * (f + 0.12 * Math.sin(2 * Math.PI * f));  // the neck: an S, steep, a shoulder, steep again
      s.bot = boardY;
      s.a.style.setProperty('--y', ((s.top + s.bot) / 2).toFixed(1) + 'px');
      s.w = 30 + k * 8;                                       // shorter strings ring higher
    });
    // the neck: a smooth curve through the string tops, running past both ends
    var L = order[0], R = order[n - 1], f2 = function (v) { return v.toFixed(1); };
    var px = L.x - 24, kx = R.x + 22;
    // the pillar, rising from the foot of the soundboard and curving out a little
    var d = 'M' + f2(px + 2) + ' ' + boardY + ' Q' + f2(px - 10) + ' ' + f2((boardY + L.top) / 2) + ' ' + f2(px) + ' ' + f2(L.top - 4);
    // the neck, through the tops of the strings, with a small scroll at the crown
    var pts = [[px, L.top - 4]].concat(order.map(function (s) { return [s.x, s.top]; }), [[kx, R.top + 10]]);
    for (var i = 1; i < pts.length - 1; i++) {
      var mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2;
      d += ' Q' + f2(pts[i][0]) + ' ' + f2(pts[i][1]) + ' ' + f2(mx) + ' ' + f2(my);
    }
    // the knee, curving down to meet the soundboard
    d += ' Q' + f2(kx + 8) + ' ' + f2((R.top + boardY) / 2 + 6) + ' ' + f2(kx - 2) + ' ' + boardY;
    neck.setAttribute('d', d);
    var crown = document.getElementById('harp-crown') || (function () { var c = document.createElementNS(NS, 'circle'); c.id = 'harp-crown'; c.setAttribute('class', 'harp__crown'); c.setAttribute('r', '2.6'); svg.appendChild(c); return c; })();
    crown.setAttribute('cx', f2(px)); crown.setAttribute('cy', f2(L.top - 4));
    board.setAttribute('d', 'M' + f2(px + 2) + ' ' + boardY + ' L' + f2(kx - 2) + ' ' + boardY);
    draw();
  }

  function draw() {
    for (var i = 0; i < S.length; i++) {
      var s = S[i], mid = (s.top + s.bot) / 2;
      s.p.setAttribute('d', 'M' + s.x.toFixed(1) + ' ' + s.top.toFixed(1) + ' Q' + (s.x + 2 * s.d).toFixed(2) + ' ' + mid.toFixed(1) + ' ' + s.x.toFixed(1) + ' ' + s.bot.toFixed(1));
      var g = Math.min(1, s.glow), c = BONE.map(function (v, k) { return Math.round(v + (s.b[k] - v) * g); });
      s.p.style.stroke = 'rgba(' + c.join(',') + ',' + (0.3 + 0.7 * g).toFixed(3) + ')';
      s.p.style.strokeWidth = (1.1 + 0.9 * g).toFixed(2);
      s.p.style.filter = g > 0.05 ? 'drop-shadow(0 0 ' + (2 + 5 * g).toFixed(1) + 'px rgba(' + s.b.join(',') + ',' + (0.85 * g).toFixed(2) + '))' : '';
      s.a.style.setProperty('--dx', s.d.toFixed(2) + 'px');
    }
  }

  // the springs run only while something is still ringing
  var running = false, last = 0;
  function tick(now) {
    var dt = Math.min(0.033, (now - last) / 1000 || 0.016); last = now;
    var busy = false;
    for (var i = 0; i < S.length; i++) {
      var s = S[i];
      if (s.hover && !reduce) s.v += (Math.random() - 0.5) * 60 * dt;            // a held string keeps shimmering
      for (var k = 0, h = dt / 4; k < 4; k++) {                                   // substeps keep the stiff strings stable at 30fps
        s.v += (-s.w * s.w * s.d - 3.4 * s.v) * h;
        s.d += s.v * h;
      }
      s.glow += ((s.hover ? 1 : 0) - s.glow) * (1 - Math.exp(-dt * (s.hover ? 14 : 1.6)));
      if (Math.abs(s.d) > 0.02 || Math.abs(s.v) > 0.2 || s.glow > 0.01 || s.hover) busy = true;
      else { s.d = 0; s.v = 0; s.glow = 0; }
    }
    draw();
    if (busy) requestAnimationFrame(tick); else running = false;
  }
  function wake() { if (!running) { running = true; last = performance.now(); requestAnimationFrame(tick); } }

  function ring(s) {
    var o = document.createElement('span');
    o.className = 'harp__ring'; o.setAttribute('aria-hidden', 'true');
    o.style.setProperty('--b', s.b.join(','));
    o.style.setProperty('--y', s.a.style.getPropertyValue('--y'));
    s.a.parentNode.appendChild(o);
    setTimeout(function () { o.remove(); }, 1300);
  }
  function pluck(i, strength, quiet) {
    var s = S[i];
    if (reduce) { s.glow = Math.max(s.glow, strength); wake(); return; }
    var dir = Math.random() < 0.5 ? -1 : 1;
    s.v += dir * strength * 260;
    s.glow = Math.max(s.glow, quiet ? 0.35 * strength : strength);
    // the neighbours answer, softly
    [i - 1, i + 1].forEach(function (j) { if (S[j]) { S[j].v -= dir * strength * 70; S[j].glow = Math.max(S[j].glow, quiet ? 0 : 0.18 * strength); } });
    if (!quiet) {
      ring(s);
      if (RR.audio && RR.audio.on) RR.audio.chime(i * 2);
    }
    wake();
  }
  function showName(s) {
    if (!s) { name.classList.remove('is-on'); return; }
    name.textContent = s.a.getAttribute('aria-label') || '';
    name.style.setProperty('--x', s.x.toFixed(1) + 'px');
    name.style.setProperty('--b', s.b.join(','));
    name.classList.add('is-on');
  }

  S.forEach(function (s, i) {
    var on = function () { if (s.hover) return; s.hover = true; s.a.classList.add('is-plucked'); pluck(i, 1); showName(s); };
    var off = function () { s.hover = false; s.a.classList.remove('is-plucked'); if (!S.some(function (o) { return o.hover; })) showName(null); wake(); };
    s.a.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse' || e.pointerType === 'pen') on(); });
    s.a.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse' || e.pointerType === 'pen') off(); });
    s.a.addEventListener('focus', function () { if (s.a.matches(':focus-visible')) on(); });
    s.a.addEventListener('blur', off);
    s.a.addEventListener('pointerdown', function (e) { if (e.pointerType === 'touch') { pluck(i, 1); showName(s); setTimeout(function () { showName(null); }, 1400); } });
  });

  // touch: sweep a finger across the strings for a glissando (a sweep is not a tap)
  var sweep = null;
  ul.addEventListener('pointerdown', function (e) { if (e.pointerType === 'touch') sweep = { x: e.clientX, moved: 0 }; });
  ul.addEventListener('pointermove', function (e) {
    if (!sweep || e.pointerType !== 'touch') return;
    var left = ul.getBoundingClientRect().left, a = Math.min(sweep.x, e.clientX) - left, b = Math.max(sweep.x, e.clientX) - left;
    S.forEach(function (s, i) { if (s.x > a && s.x <= b) { pluck(i, 0.8); showName(s); } });
    sweep.moved += Math.abs(e.clientX - sweep.x); sweep.x = e.clientX;
  });
  var endSweep = function () { if (sweep && sweep.moved > 14) ul.dataset.swept = '1'; sweep = null; setTimeout(function () { showName(null); }, 1200); };
  ul.addEventListener('pointerup', endSweep); ul.addEventListener('pointercancel', function () { sweep = null; });
  ul.addEventListener('click', function (e) { if (ul.dataset.swept) { e.preventDefault(); delete ul.dataset.swept; } }, true);

  // the first time the footer comes into view, a soft strum, left to right
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      io.disconnect();
      var order = S.map(function (s, i) { return i; }).sort(function (p, q) { return S[p].x - S[q].x; });
      order.forEach(function (i, k) { setTimeout(function () { pluck(i, 0.55, true); }, 160 + k * 85); });
    }, { threshold: 0.9 });
    io.observe(ul);
  }

  addEventListener('resize', layout);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
  layout();
  RR.strings = { pluck: pluck };
})();
