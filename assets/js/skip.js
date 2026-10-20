/* ══════════════════════════════════════════════════════════════════════
   THE SKIP BIRDS — move through a long page a chapter at a time

   Two small ink birds perch at the edge of the screen, one above the
   other on a thread of light. A bird with its wings raised is a "v": it
   points down, and the bird below carries you to the next chapter. The
   one above flies with its wings lowered, a "^", and takes you back.
   The bead on the thread is how far you are through the chapter you are in.

   They bob and flick their wings while they wait, flap when the pointer
   comes near, and name the chapter they would take you to. Press one and
   it takes off: a small flock crosses the screen in the direction you
   are going, the ink of the field is stirred, the chapter's name passes
   through the middle of the screen, and the page glides there. When a
   chapter is long and you have been in it a while, the lower bird calls.

   Only pages long enough to need it (more than four and a half screens,
   three or more chapters) get the birds; the rest stay as they are.
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var RR = window.RR = window.RR || {};
  var doc = document.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ar = doc.lang === 'ar';
  var T = ar
    ? { next: 'التالي', back: 'عودة إلى', call: 'تخطَّ إلى', toNext: 'تخطَّ إلى ', toBack: 'عودة إلى ', nav: 'التنقّل بين أقسام الصفحة' }
    : { next: 'next', back: 'back to', call: 'skip ahead to', toNext: 'Skip ahead to ', toBack: 'Back to ', nav: 'Move through the page' };
  // chapter names, English and Arabic, by section id or by its data-screen
  var NAMES = {
    threshold: ['', 'The beginning', 'البداية'], she: ['', 'She', 'هي'], voice: ['I', 'The Voice', 'الصوت'],
    whirl: ['II', 'The Whirl', 'الدوران'], resonance: ['III', 'Resonance', 'الرنين'], circle: ['IV', 'The Circle', 'الدائرة'],
    path: ['', 'The Flight Path', 'المسار'], story: ['', 'Her Story', 'الحكاية'], walk: ['', 'Walk with her', 'رافقها'],
    word: ['', 'Word', 'الكلمة'], book: ['', 'Work with Rawan', 'العمل مع روان']
  };
  var SCREEN_AR = {
    'Voice Liberation': 'تحرير الصوت', 'The program': 'البرنامج', 'The journey': 'الرحلة', 'Breathe': 'تنفّس',
    'Formats': 'الخطوتان', 'Booking': 'الحجز', 'Questions': 'أسئلة', 'Gathering': 'اللقاء',
    'The invitation': 'الدعوة', 'More gatherings': 'لقاءات أخرى'
  };
  var MOOD = { teal: '84,199,168', blue: '127,178,229', rose: '217,80,74', amber: '233,165,91', violet: '169,154,242' };
  var FORM_MOOD = { skirt: 'rose', ring: 'amber', birds: 'blue' };

  var secs = [].slice.call(document.querySelectorAll('section[data-screen]')).filter(function (s) {
    return !(s.parentElement && s.parentElement.closest('section[data-screen]'));
  });
  if (secs.length < 3) return;
  var chapters = secs.map(function (s) {
    var n = NAMES[s.id], scr = s.dataset.screen || '';
    var num = n ? n[0] : '', en = n ? n[1] : scr.replace(/^[IVX]+ · /, ''), arn = n ? n[2] : (SCREEN_AR[scr] || scr);
    var mood = s.dataset.mood || FORM_MOOD[s.dataset.form] || 'teal';
    return { el: s, num: num, name: ar ? arn : en, rgb: MOOD[mood] || MOOD.teal, top: 0, h: 0, called: false };
  });

  /* ── the birds ───────────────────────────────────────────────────── */
  function bird(cls) {
    return '<svg class="' + cls + '" viewBox="-20 -12 40 22" aria-hidden="true">' +
      '<g class="sbw sbw--l"><path d="M0 3 C-4 -2 -10 -6 -17 -5"/><path class="sbw__f" d="M-6 -1.6 C-9 -3.6 -12 -4.4 -15 -4.2"/></g>' +
      '<g class="sbw sbw--r"><path d="M0 3 C4 -2 10 -6 17 -5"/><path class="sbw__f" d="M6 -1.6 C9 -3.6 12 -4.4 15 -4.2"/></g>' +
      '<ellipse class="sbb" cx="0" cy="3.4" rx="1.9" ry="2.3"/></svg>';
  }
  var nav = document.createElement('nav');
  nav.className = 'skipbirds'; nav.setAttribute('aria-label', T.nav);
  nav.innerHTML =
    '<button type="button" class="sb sb--up"><span class="sb__bird">' + bird('sb__svg') + '</span><span class="sb__label"><small></small><b></b></span></button>' +
    '<span class="sb__thread" aria-hidden="true"><i class="sb__fill"></i><i class="sb__bead"></i></span>' +
    '<button type="button" class="sb sb--down"><span class="sb__bird">' + bird('sb__svg') + '</span><span class="sb__label"><small></small><b></b></span></button>';
  document.body.appendChild(nav);
  var up = nav.querySelector('.sb--up'), down = nav.querySelector('.sb--down');
  var card = document.createElement('div');
  card.className = 'sbcard'; card.setAttribute('aria-hidden', 'true');
  card.innerHTML = '<small></small><b></b>';
  document.body.appendChild(card);
  var flock = document.createElement('div');
  flock.className = 'sbflock'; flock.setAttribute('aria-hidden', 'true');
  document.body.appendChild(flock);

  function setLabel(btn, small, ch) {
    btn.querySelector('small').textContent = small;
    btn.querySelector('b').textContent = (ch.num && !ar ? ch.num + ' · ' : '') + ch.name;
    btn.setAttribute('aria-label', (btn === down ? T.toNext : T.toBack) + (ch.num && !ar ? ch.num + ' · ' : '') + ch.name);
  }

  /* ── where we are ────────────────────────────────────────────────── */
  var idx = 0, lastSkip = -1e9, qualifies = false, introduced = false;
  function measure() {
    var y = scrollY;
    chapters.forEach(function (c) { var r = c.el.getBoundingClientRect(); c.top = r.top + y; c.h = r.height; });
    qualifies = doc.scrollHeight > innerHeight * 4.5;
    nav.classList.toggle('is-page', qualifies);
  }
  var probe = function () { return scrollY + innerHeight * 0.45; };
  function targets() {
    var nxt = chapters[idx + 1] || null;
    var into = scrollY - chapters[idx].top;
    var prev = into > innerHeight * 0.35 ? chapters[idx] : chapters[idx - 1] || null;
    return { next: nxt, prev: prev };
  }
  var queued = false;
  function update() {
    queued = false;
    if (!qualifies) return;
    var p = probe(), i = 0;
    for (var k = 0; k < chapters.length; k++) if (chapters[k].top <= p) i = k;
    idx = i;
    var c = chapters[idx], t = targets();
    var shown = scrollY > innerHeight * 0.6 && !sheetOpen();
    nav.classList.toggle('is-on', shown);
    if (shown && !introduced) { introduced = true; setTimeout(function () { if (nav.classList.contains('has-down')) intro(); }, 900); }
    nav.classList.toggle('has-down', !!t.next);
    nav.classList.toggle('has-up', !!t.prev);
    if (t.next) setLabel(down, T.next, t.next);
    if (t.prev) setLabel(up, T.back, t.prev);
    var prog = Math.max(0, Math.min(1, (p - c.top) / Math.max(1, c.h)));
    nav.style.setProperty('--p', prog.toFixed(3));
    nav.style.setProperty('--c', c.rgb);
    // a long chapter, and you have been in it a while: the lower bird calls, once
    if (shown && t.next && !c.called && c.h > innerHeight * 1.6 && p - c.top > innerHeight * 1.1 && performance.now() - lastSkip > 15000 && !gliding) {
      c.called = true; call(t.next);
    }
  }
  function queue() { if (!queued) { queued = true; requestAnimationFrame(update); } }
  var sheet = document.getElementById('sheet');
  function sheetOpen() { return (sheet && !sheet.hidden) || !!document.querySelector('dialog[open]'); }
  if (sheet && 'MutationObserver' in window) new MutationObserver(queue).observe(sheet, { attributes: true, attributeFilter: ['hidden'] });

  /* ── life while waiting: a bob, a flick of the wings now and then ─ */
  function flick() {
    if (!reduce && nav.classList.contains('is-on') && !gliding) {
      var b = Math.random() < 0.5 ? up : down;
      b.classList.remove('is-flick'); void b.offsetWidth; b.classList.add('is-flick');
      setTimeout(function () { b.classList.remove('is-flick'); }, 700);
    }
    setTimeout(flick, 4200 + Math.random() * 4800);
  }
  if (!reduce) setTimeout(flick, 3000);
  // the pointer near them: they lean toward it and beat faster
  if (!reduce && matchMedia('(hover: hover)').matches) {
    addEventListener('pointermove', function (e) {
      if (!nav.classList.contains('is-on')) return;
      var r = nav.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      var dx = e.clientX - cx, dy = e.clientY - cy, dist = Math.hypot(dx, dy);
      var near = Math.max(0, 1 - dist / 220);
      nav.style.setProperty('--near', near.toFixed(3));
      nav.style.setProperty('--lean', (Math.max(-1, Math.min(1, dx / 220)) * 14 * near).toFixed(2) + 'deg');
    }, { passive: true });
  }

  function intro() {
    down.classList.add('is-calling');
    setTimeout(function () { down.classList.remove('is-calling'); }, 2600);
  }
  function call(ch) {
    down.classList.add('is-calling');
    down.querySelector('small').textContent = T.call;
    if (RR.audio && RR.audio.on && RR.audio.call) RR.audio.call('chirp', ar ? -0.6 : 0.6);
    setTimeout(function () { down.classList.remove('is-calling'); queue(); }, 3200);
  }

  /* ── the flight ──────────────────────────────────────────────────── */
  var gliding = false, raf = 0;
  function stopGlide() { if (!gliding) return; gliding = false; cancelAnimationFrame(raf); doc.style.scrollBehavior = ''; settle(); }
  ['wheel', 'touchstart'].forEach(function (ev) { addEventListener(ev, stopGlide, { passive: true }); });
  addEventListener('keydown', function (e) { if (/^(Arrow|Page|Home|End| )/.test(e.key)) stopGlide(); });

  function crossing(dir, rgb) {
    // a small flock crosses the screen the way you are going
    if (reduce) return;
    var n = innerWidth < 700 ? 9 : 14, side = ar ? 0.26 : 0.74;
    for (var i = 0; i < n; i++) {
      var b = document.createElement('span');
      b.className = 'sbflock__b';
      b.innerHTML = bird('');
      b.style.setProperty('--c', rgb);
      var x0 = innerWidth * (side + (Math.random() - 0.5) * 0.42), s = 0.7 + Math.random() * 0.9;
      var sway = (Math.random() - 0.5) * 160, dur = 1100 + Math.random() * 700;
      b.style.left = x0 + 'px';
      flock.appendChild(b);
      var from = dir > 0 ? -0.15 : 1.1, to = dir > 0 ? 1.15 : -0.2;
      var anim = b.animate([
        { transform: 'translate(0,' + (innerHeight * from) + 'px) rotate(' + (dir > 0 ? 0 : 180) + 'deg) scale(' + s + ')', opacity: 0 },
        { opacity: 0.95, offset: 0.18 },
        { transform: 'translate(' + sway + 'px,' + (innerHeight * (from + to) / 2) + 'px) rotate(' + (dir > 0 ? 0 : 180) + 'deg) scale(' + s * 1.08 + ')', offset: 0.5 },
        { opacity: 0.85, offset: 0.8 },
        { transform: 'translate(' + (-sway * 0.4) + 'px,' + (innerHeight * to) + 'px) rotate(' + (dir > 0 ? 0 : 180) + 'deg) scale(' + s * 0.9 + ')', opacity: 0 }
      ], { duration: dur, delay: i * 55 + Math.random() * 90, easing: 'cubic-bezier(.45,.05,.4,1)', fill: 'both' });
      anim.onfinish = (function (el) { return function () { el.remove(); }; })(b);
    }
  }
  function passCard(ch, dir, dur) {
    if (reduce) return;
    card.querySelector('small').textContent = ch.num && !ar ? ch.num : '';
    card.querySelector('b').textContent = ch.name;
    card.style.setProperty('--c', ch.rgb);
    card.animate([
      { opacity: 0, transform: 'translate(-50%, calc(-50% + ' + (dir * 46) + 'px)) scale(.94)', filter: 'blur(10px)' },
      { opacity: 1, transform: 'translate(-50%, -50%) scale(1)', filter: 'blur(0px)', offset: 0.3 },
      { opacity: 1, transform: 'translate(-50%, -50%) scale(1)', filter: 'blur(0px)', offset: 0.52 },
      { opacity: 0, transform: 'translate(-50%, calc(-50% - ' + (dir * 46) + 'px)) scale(1.03)', filter: 'blur(8px)' }
    ], { duration: dur * 0.85, easing: 'cubic-bezier(.4,0,.2,1)' });
  }
  function sound(dir) {
    var A = RR.audio;
    if (!A || !A.on) return;
    var notes = dir > 0 ? [6, 4, 2, 0] : [0, 2, 4, 6];
    notes.forEach(function (n, k) { setTimeout(function () { A.chime(n); }, k * 110); });
    if (A.call) setTimeout(function () { A.call(dir > 0 ? 'warbler' : 'chirp', ar ? -0.5 : 0.5); }, 160);
  }
  function settle() {
    nav.classList.remove('is-flying', 'is-going-up', 'is-going-down');
    [up, down].forEach(function (b) { b.classList.remove('is-off'); b.classList.add('is-land'); setTimeout(function () { b.classList.remove('is-land'); }, 900); });
    queue();
  }
  function go(dir) {
    var t = targets(), ch = dir > 0 ? t.next : t.prev;
    if (!ch) return;
    measure();
    var to = Math.max(0, Math.min(ch.top, doc.scrollHeight - innerHeight));
    var from = scrollY, dist = to - from;
    lastSkip = performance.now();
    var btn = dir > 0 ? down : up;
    btn.classList.add('is-off');
    nav.classList.add('is-flying', dir > 0 ? 'is-going-down' : 'is-going-up');
    if (RR.field && RR.field.gust) RR.field.gust(dir * 2.6);
    sound(dir);
    if (reduce || Math.abs(dist) < 2) {
      scrollTo({ top: to, behavior: 'auto' }); settle(); focusChapter(ch); return;
    }
    var dur = Math.min(1700, Math.max(800, 560 + Math.abs(dist) * 0.15));
    crossing(dir, ch.rgb);
    if (Math.abs(dist) > innerHeight * 1.25) passCard(ch, dir, dur);   // a short hop needs no title: the chapter is already in view
    doc.style.scrollBehavior = 'auto';
    gliding = true;
    var t0 = performance.now();
    (function step(now) {
      if (!gliding) return;
      var k = Math.min(1, (now - t0) / dur);
      var e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      scrollTo(0, from + dist * e);
      if (k < 1) raf = requestAnimationFrame(step);
      else { gliding = false; doc.style.scrollBehavior = ''; settle(); focusChapter(ch); }
    })(t0);
  }
  // keyboard users land where they went, without the page jumping again
  function focusChapter(ch) {
    if (!nav.contains(document.activeElement)) return;
    var h = ch.el.querySelector('h1, h2, h3');
    if (!h) return;
    if (!h.hasAttribute('tabindex')) h.setAttribute('tabindex', '-1');
    h.focus({ preventScroll: true });
  }
  up.addEventListener('click', function () { go(-1); });
  down.addEventListener('click', function () { go(1); });

  /* ── the event page's reservation bar sits at the bottom on phones ─ */
  var bar = document.querySelector('.mobile-reserve');
  function lift() {
    var on = bar && getComputedStyle(bar).display !== 'none';
    nav.style.setProperty('--lift', on ? (bar.offsetHeight + 14) + 'px' : '0px');
  }

  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', function () { measure(); lift(); queue(); });
  addEventListener('load', function () { measure(); queue(); });
  if (window.ResizeObserver) new ResizeObserver(function () { measure(); queue(); }).observe(document.body);
  measure(); lift(); update();
  RR.skip = { go: go, chapters: chapters };
})();
