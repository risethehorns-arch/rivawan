/* ══════════════════════════════════════════════════════════════════════
   THE STRINGS — the footer's platforms, strung as a small harp

   Each platform's glyph sits on its own string, between a curved neck
   and a straight soundboard; the strings shorten to the right like a
   harp's. Pass over a string (or focus it, or touch it) and it is
   plucked: it rings in the platform's own colour, its neighbours hum
   in sympathy, a ring of sound leaves the glyph, a note floats up, the
   name appears under it, and, when the garden is playing, it sounds a
   note of the scale. Sweep across them and you play a glissando.
   So that nobody mistakes it for a row of icons (Oct 2026): a caption
   under it says "Play the strings" — with a "Hear them" button while the
   sound is off, which turns it on and strums — and now and then, until
   someone plays it, a small light glides across and plucks the strings
   by itself. Without this script the glyphs are plain links.
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
  // the caption that says it is an instrument, and the light that shows it being played
  var touch = matchMedia('(hover: none)').matches;
  var cue = document.createElement('span');
  cue.className = 'harp__cue';
  cue.innerHTML = '<span class="harp__eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="harp__cue-t"></span>' +
    '<button type="button" class="harp__hear" data-sound aria-pressed="false" aria-label="Turn the sound on to hear the strings">Hear them</button>';
  ul.appendChild(cue);
  var pick = document.createElement('span');
  pick.className = 'harp__pick'; pick.setAttribute('aria-hidden', 'true');
  ul.appendChild(pick);

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
    cue.style.setProperty('--cx', f2((px + kx) / 2) + 'px');
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
  // a note floats up from a plucked string, in the platform's colour: music, even with the sound off
  var GLYPH = '<svg viewBox="0 0 14 18" aria-hidden="true"><ellipse cx="5" cy="14.2" rx="3.6" ry="2.6" transform="rotate(-22 5 14.2)"/>' +
    '<rect x="7.6" y="1.5" width="1.4" height="12.6" rx=".6"/><path d="M8.6 1.5c.6 2.4 2.4 3.3 3.6 4.6 1 1.1 1.1 2.8.3 4.3.3-1.6-.4-2.9-2-3.6l-1.9-.8z"/></svg>';
  function note(s, faint) {
    var o = document.createElement('span');
    o.className = 'harp__note' + (faint ? ' is-faint' : ''); o.innerHTML = GLYPH;
    o.style.left = s.x.toFixed(1) + 'px'; o.style.top = (s.top + 4).toFixed(1) + 'px';
    o.style.setProperty('--b', s.b.join(','));
    o.style.setProperty('--dr', ((Math.random() - 0.5) * 22).toFixed(1) + 'px'); o.style.setProperty('--rot', ((Math.random() - 0.5) * 40).toFixed(0) + 'deg');
    ul.appendChild(o);
    setTimeout(function () { o.remove(); }, 1700);
  }
  function pluck(i, strength, quiet, faintNote) {
    var s = S[i];
    if (reduce) { s.glow = Math.max(s.glow, strength); wake(); return; }
    var dir = Math.random() < 0.5 ? -1 : 1;
    s.v += dir * strength * 260;
    s.glow = Math.max(s.glow, quiet ? 0.35 * strength : strength);
    // the neighbours answer, softly
    [i - 1, i + 1].forEach(function (j) { if (S[j]) { S[j].v -= dir * strength * 70; S[j].glow = Math.max(S[j].glow, quiet ? 0 : 0.18 * strength); } });
    if (!quiet) {
      ring(s); note(s);
      if (RR.audio && RR.audio.on) RR.audio.chime(i * 2);
    } else if (faintNote) note(s, true);
    wake();
  }
  // the light that plays it: it glides across the strings, left to right, plucking each as it passes
  var strumming = false;
  function strum(audible) {
    if (strumming) return;
    var order = S.slice().sort(function (p, q) { return p.x - q.x; });
    if (reduce) { order.forEach(function (s, k) { setTimeout(function () { s.glow = 1; wake(); }, k * 90); }); return; }
    strumming = true;
    var xa = order[0].x - 22, xb = order[order.length - 1].x + 20, done = {}, t0 = performance.now(), ms = 1150;
    var yAt = function (x) {   // a little above the middle of the strings, following their tops
      var k = 0; while (k < order.length - 1 && order[k + 1].x < x) k++;
      var a = order[k], b = order[Math.min(k + 1, order.length - 1)], f = b.x === a.x ? 0 : Math.max(0, Math.min(1, (x - a.x) / (b.x - a.x)));
      var mid = function (s) { return s.top + (s.bot - s.top) * 0.3; };
      return mid(a) + (mid(b) - mid(a)) * f;
    };
    pick.classList.add('is-on');
    (function step(now) {
      var t = Math.min(1, (now - t0) / ms), e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, x = xa + (xb - xa) * e;
      pick.style.transform = 'translate(' + x.toFixed(1) + 'px,' + yAt(x).toFixed(1) + 'px)';
      S.forEach(function (s, i) { if (!done[i] && x >= s.x) { done[i] = 1; pluck(i, audible ? 0.85 : 0.6, !audible, !audible); } });
      if (t < 1) requestAnimationFrame(step); else { pick.classList.remove('is-on'); strumming = false; }
    })(t0);
  }
  function showName(s) {
    ul.classList.toggle('has-name', !!s);
    if (!s) { name.classList.remove('is-on'); return; }
    name.textContent = s.a.getAttribute('aria-label') || '';
    name.style.setProperty('--x', s.x.toFixed(1) + 'px');
    name.style.setProperty('--b', s.b.join(','));
    name.classList.add('is-on');
  }

  var played = false;   // once someone has played it, the light stops showing them how
  S.forEach(function (s, i) {
    var on = function () { played = true; if (s.hover) return; s.hover = true; s.a.classList.add('is-plucked'); pluck(i, 1); showName(s); };
    var off = function () { s.hover = false; s.a.classList.remove('is-plucked'); if (!S.some(function (o) { return o.hover; })) showName(null); wake(); };
    s.a.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse' || e.pointerType === 'pen') on(); });
    s.a.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse' || e.pointerType === 'pen') off(); });
    s.a.addEventListener('focus', function () { if (s.a.matches(':focus-visible')) on(); });
    s.a.addEventListener('blur', off);
    s.a.addEventListener('pointerdown', function (e) { if (e.pointerType === 'touch') { played = true; pluck(i, 1); showName(s); setTimeout(function () { showName(null); }, 1400); } });
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

  // the caption follows the sound: "Play the strings" and, while the sound is off, "Hear them"
  var cueText = cue.querySelector('.harp__cue-t'), hear = cue.querySelector('.harp__hear');
  function sync() {
    var on = !!(RR.audio && RR.audio.on);
    cueText.textContent = touch ? 'Sweep across the strings' : 'Play the strings';
    hear.hidden = on; cue.classList.toggle('is-live', on);
  }
  hear.addEventListener('click', function (e) {
    e.preventDefault(); e.stopPropagation();
    if (!RR.audio) return;
    played = true;
    if (RR.audio.toggle()) setTimeout(function () { strum(true); }, 420);   // the first thing they hear is the harp
    sync();
  });
  cue.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse' && !e.target.closest('.harp__hear')) strum(false); });
  new MutationObserver(sync).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  sync();

  // the first time the footer comes into view the light strums it softly; then, every so often while it is
  // on screen and nobody has played it yet, it shows them again (three times at most)
  if ('IntersectionObserver' in window && !reduce) {
    var seen = false, inView = false, shown = 0;
    var io = new IntersectionObserver(function (es) {
      inView = es[0].isIntersecting;
      if (inView && !seen) { seen = true; setTimeout(function () { strum(false); }, 260); shown = 1; }
    }, { threshold: 0.9 });
    io.observe(ul);
    setInterval(function () {
      if (inView && !played && shown < 3 && !document.hidden) { shown++; strum(false); }
    }, 12000);
  }

  addEventListener('resize', layout);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
  layout();
  RR.strings = { pluck: pluck };
})();
