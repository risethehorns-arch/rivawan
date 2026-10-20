/* ══════════════════════════════════════════════════════════════════════
   RAWAN ROSHNI — page behaviour

   Everything here is progressive: without it the page is a complete,
   readable document. Nothing waits on an animation frame to become
   visible; reveals only ever delay what is already in the DOM.
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var RR = window.RR = window.RR || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var audio = function () { return RR.audio || { toggle: function () {}, hold: function () {}, chime: function () {}, section: function () {}, duck: function () {} }; };
  var field = function () { return RR.field || { hold: function () {}, turns: function () { return 0; }, spin: function () { return 0; } }; };

  /* ── widows: bind the last two words of every text block ─────────── */
  $$('p, li, h2, h3, figcaption, dd, blockquote p').forEach(function (el) {
    if (el.closest('.hero__cycle, .she__text, svg, .rel__no, .listen, .social')) return;
    var last = el.lastChild;
    while (last && last.nodeType === 1 && last.childNodes.length) last = last.lastChild;
    if (!last || last.nodeType !== 3) return;
    last.nodeValue = last.nodeValue.replace(/\s+(\S+)\s*$/, ' $1');
  });

  /* ── year ────────────────────────────────────────────────────────── */
  $$('[data-year]').forEach(function (e) { e.textContent = new Date().getFullYear(); });

  /* ── nav ─────────────────────────────────────────────────────────── */
  var nav = $('#nav'), sheet = $('#sheet'), menu = $('.nav__menu');
  function onScroll() { nav.classList.toggle('is-stuck', scrollY > 30); }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  function setSheet(open) {
    sheet.hidden = !open;
    menu.setAttribute('aria-expanded', open ? 'true' : 'false');
    menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (menu) menu.addEventListener('click', function () { setSheet(sheet.hidden); });
  $$('a', sheet).forEach(function (a) { a.addEventListener('click', function () { setSheet(false); }); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape' && !sheet.hidden) setSheet(false); });

  var here = (location.pathname.split('/').pop() || 'index.html');
  $$('.nav__links a, .sheet a').forEach(function (a) {
    var href = a.getAttribute('href') || '';
    if (href.split('#')[0] === here && href.indexOf('#') < 0) a.setAttribute('aria-current', 'page');
  });
  var links = $$('.nav__links a');
  window.addEventListener('rr:section', function (e) {
    var el = e.detail.el, id = el.id;
    links.forEach(function (a) { a.classList.toggle('is-here', a.getAttribute('href') === '#' + id); });
    audio().section(el.dataset.root || '');
  });

  // a note of the maqam under each navigation item, when sound is on
  $$('[data-chime]').forEach(function (a) {
    a.addEventListener('pointerenter', function () { audio().chime(+a.dataset.chime); });
  });

  /* ── sound ───────────────────────────────────────────────────────── */
  $$('[data-sound]').forEach(function (b) {
    b.addEventListener('click', function () { audio().toggle(); });
  });

  /* ── reveals ─────────────────────────────────────────────────────── */
  var revs = $$('.reveal, .curtain, .curtains');
  if ('IntersectionObserver' in window && !reduce) {
    var rio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revs.forEach(function (r) {
      var b = r.getBoundingClientRect();
      if (b.top < innerHeight && b.bottom > 0) r.classList.add('in'); else rio.observe(r);
    });
  } else revs.forEach(function (r) { r.classList.add('in'); });

  /* ── hero: the cycling lines ─────────────────────────────────────── */
  var cyc = $$('.hero__cycle span'), ci = 0;
  if (cyc.length && !reduce) setInterval(function () {
    if (document.hidden) return;
    cyc[ci].classList.remove('is-on'); ci = (ci + 1) % cyc.length;
    // park the next line below, then let it rise: set, force a style read, release
    cyc[ci].classList.add('is-next'); void cyc[ci].offsetWidth;
    cyc[ci].classList.remove('is-next'); cyc[ci].classList.add('is-on');
  }, 3400);

  /* ── manifesto: words light as you read ──────────────────────────── */
  var scrub = $('[data-scrub]');
  if (scrub && !reduce) {
    (function wrap(node) {
      [].slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.nodeValue.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var s = document.createElement('span'); s.className = 'w'; s.textContent = part; frag.appendChild(s);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1) wrap(n);
      });
    })(scrub);
    var words = $$('.w', scrub), litN = -1;
    var paint = function () {
      var r = scrub.getBoundingClientRect(), vh = innerHeight;
      var p = (vh * 0.82 - r.top) / (r.height + vh * 0.25);
      var n = Math.round(Math.max(0, Math.min(1, p)) * words.length);
      if (n === litN) return; litN = n;
      for (var i = 0; i < words.length; i++) words[i].classList.toggle('lit', i < n);
    };
    addEventListener('scroll', paint, { passive: true }); addEventListener('resize', paint); paint();
  }

  /* ── hold: the flock lifts off the name (hero), the skirt opens (whirl) ───────────────────────────────────────────────── */
  var holdCount = 0;
  function hold(v) {
    holdCount = Math.max(0, holdCount + (v ? 1 : -1));
    var on = holdCount > 0;
    field().hold(on); audio().hold(on);
  }

  // anywhere on the hero that is not a control
  var hero = $('.hero'), heroTimer = 0, heroDown = null, heroHeld = false;
  if (hero) {
    hero.addEventListener('pointerdown', function (e) {
      if (e.button > 0 || e.target.closest('a, button, input')) return;
      heroDown = { x: e.clientX, y: e.clientY };
      heroTimer = setTimeout(function () { heroHeld = true; hold(true); }, 130);
    });
    var heroUp = function () {
      clearTimeout(heroTimer); heroDown = null;
      if (heroHeld) { heroHeld = false; hold(false); }
    };
    hero.addEventListener('pointermove', function (e) {
      if (heroDown && !heroHeld && Math.hypot(e.clientX - heroDown.x, e.clientY - heroDown.y) > 10) heroUp();
    });
    addEventListener('pointerup', heroUp); addEventListener('pointercancel', heroUp);
    hero.addEventListener('contextmenu', function (e) { if (heroHeld) e.preventDefault(); });
  }

  // the whirl button: mouse, touch, and keyboard
  var wb = $('[data-hold]'), wbHeld = false;
  if (wb) {
    var down = function (e) { if (wbHeld) return; wbHeld = true; wb.classList.add('is-holding'); hold(true); if (e && e.pointerId != null && wb.setPointerCapture) wb.setPointerCapture(e.pointerId); };
    var up = function () { if (!wbHeld) return; wbHeld = false; wb.classList.remove('is-holding'); hold(false); };
    wb.addEventListener('pointerdown', function (e) { e.preventDefault(); down(e); });
    wb.addEventListener('pointerup', up); wb.addEventListener('pointercancel', up); wb.addEventListener('lostpointercapture', up);
    wb.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    wb.addEventListener('keydown', function (e) { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); down(); } });
    wb.addEventListener('keyup', function (e) { if (e.key === ' ' || e.key === 'Enter') up(); });
    wb.addEventListener('blur', up);
    // the space bar anywhere, while the whirl is on screen and nothing is being typed
    addEventListener('keydown', function (e) {
      if (e.key !== ' ' || e.repeat || document.activeElement === wb) return;
      if (/INPUT|TEXTAREA|SELECT|BUTTON|A/.test((document.activeElement || {}).tagName || '')) return;
      if (field().form !== 'skirt') return;
      e.preventDefault(); down();
    });
    addEventListener('keyup', function (e) { if (e.key === ' ' && document.activeElement !== wb) up(); });
  }

  var turnsEl = $('[data-turns]'), spinEls = $$('.whirl__ring, .disc'), lastTurns = -1, whirlNear = false;
  var whirlSec = $('#whirl');
  if (whirlSec && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { whirlNear = es[0].isIntersecting; }, { rootMargin: '10% 0px' }).observe(whirlSec);
  } else whirlNear = true;
  (function tick() {
    requestAnimationFrame(tick);
    if (!whirlNear) return;
    var t = Math.floor(field().turns());
    if (turnsEl && t !== lastTurns) { lastTurns = t; turnsEl.textContent = t; }
    var deg = (field().spin() * 57.2958 * 0.25) % 360;
    for (var i = 0; i < spinEls.length; i++) spinEls[i].style.setProperty('--spin', deg.toFixed(1) + 'deg');
  })();

  /* ── the thread: how far through the page ────────────────────────── */
  var thread = document.createElement('div');
  thread.className = 'thread'; thread.setAttribute('aria-hidden', 'true');
  document.body.appendChild(thread);
  var threadQueued = false;
  function drawThread() {
    threadQueued = false;
    var max = document.documentElement.scrollHeight - innerHeight;
    thread.style.setProperty('--p', max > 0 ? Math.min(1, scrollY / max).toFixed(4) : 0);
  }
  addEventListener('scroll', function () { if (!threadQueued) { threadQueued = true; requestAnimationFrame(drawThread); } }, { passive: true });
  drawThread();

  /* ── the follower: a ring that names what is under the pointer ───── */
  if (fine && !reduce) {
    var cur = document.createElement('div');
    cur.className = 'cur'; cur.setAttribute('aria-hidden', 'true');
    cur.innerHTML = '<span class="cur__ring"><span class="cur__label"></span></span>';
    document.body.appendChild(cur);
    var curLabel = cur.querySelector('.cur__label');
    var cx = -100, cy = -100, tx = -100, ty = -100, curOn = false, curMoving = false;
    var curStep = function () {
      cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
      cur.style.setProperty('--x', cx.toFixed(1) + 'px');
      cur.style.setProperty('--y', cy.toFixed(1) + 'px');
      if (Math.abs(tx - cx) + Math.abs(ty - cy) > 0.3) requestAnimationFrame(curStep); else curMoving = false;
    };
    addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      tx = e.clientX; ty = e.clientY;
      if (!curOn) { curOn = true; cx = tx; cy = ty; cur.classList.add('is-on'); }
      if (!curMoving) { curMoving = true; requestAnimationFrame(curStep); }
      var t = e.target.closest ? e.target.closest('[data-cursor], a, button, label, input, textarea') : null;
      var lab = t && t.dataset ? t.dataset.cursor : '';
      if (t && !lab && t.closest('[data-cursor]') && !/^(A|BUTTON)$/.test(t.tagName)) lab = t.closest('[data-cursor]').dataset.cursor;
      if (lab) { if (curLabel.textContent !== lab) curLabel.textContent = lab; }
      cur.classList.toggle('has-label', !!lab);
      cur.classList.toggle('is-link', !!t && !lab);
    }, { passive: true });
    document.addEventListener('pointerout', function (e) { if (!e.relatedTarget) { curOn = false; cur.classList.remove('is-on'); } });
    addEventListener('pointerdown', function () { cur.classList.add('is-down'); });
    addEventListener('pointerup', function () { cur.classList.remove('is-down'); });
  }

  /* ── Al-Tuyoor: the flock leans toward the pointer ───────────────── */
  var flock = $('.flock');
  if (flock && fine && !reduce) {
    flock.addEventListener('pointermove', function (e) {
      var r = flock.getBoundingClientRect();
      flock.style.setProperty('--px', ((e.clientX - r.left) / r.width * 2 - 1).toFixed(3));
      flock.style.setProperty('--py', ((e.clientY - r.top) / r.height * 2 - 1).toFixed(3));
    });
    flock.addEventListener('pointerleave', function () { flock.style.setProperty('--px', 0); flock.style.setProperty('--py', 0); });
  }

  /* ── releases: a peek follows the pointer ────────────────────────── */
  var peek = $('.rel__peek'), peekImg = peek && $('img', peek);
  if (peek && fine) {
    $$('.rel__row').forEach(function (row) {
      row.addEventListener('pointerenter', function () {
        peekImg.src = 'https://i.ytimg.com/vi/' + row.dataset.yt + '/hqdefault.jpg';
        peek.classList.add('is-on');
      });
      row.addEventListener('pointerleave', function () { peek.classList.remove('is-on'); });
      row.addEventListener('pointermove', function (e) {
        peek.style.setProperty('--mx', (e.clientX + 28) + 'px');
        peek.style.setProperty('--my', (e.clientY - 110) + 'px');
      });
    });
  }

  /* ── video lightbox ──────────────────────────────────────────────── */
  var lb = $('#lightbox'), lbFrame = lb && $('.lightbox__frame', lb);
  function openVideo(id, list) {
    if (!lb || !lb.showModal) { window.open('https://www.youtube.com/watch?v=' + id, '_blank', 'noopener'); return; }
    var src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&modestbranding=1';
    if (list) src += '&playlist=' + list.split(',').filter(function (x) { return x !== id; }).join(',');
    lbFrame.innerHTML = '<iframe src="' + src + '" title="Video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
    lb.showModal();
    audio().duck(true);
    if (peek) peek.classList.remove('is-on');
  }
  $$('[data-yt]').forEach(function (b) {
    b.addEventListener('click', function () { openVideo(b.dataset.yt, b.dataset.list); });
  });
  if (lb) {
    $('.lightbox__close', lb).addEventListener('click', function () { lb.close(); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
    lb.addEventListener('close', function () { lbFrame.innerHTML = ''; audio().duck(false); });
  }

  /* ── the circle: a ring of photographs you can turn ──────────────── */
  var car = $('.carousel'), ring = car && $('[data-ring]', car);
  if (ring) {
    var figs = $$('figure', ring), n = figs.length, step = 360 / n;
    var ang = 0, vel = 0, dragging = false, lastX = 0, R = 300, cw = 260, carVisible = false;
    var layout = function () {
      var w = car.getBoundingClientRect().width;
      cw = Math.max(130, Math.min(340, w / 2.7));
      R = cw / 2 / Math.tan(Math.PI / n) * 1.12;
      car.style.setProperty('--cw', cw + 'px');
      figs.forEach(function (f, i) { f.style.transform = 'rotateY(' + (i * step) + 'deg) translateZ(' + R.toFixed(1) + 'px)'; });
    };
    layout(); addEventListener('resize', layout);
    car.addEventListener('pointerdown', function (e) {
      dragging = true; lastX = e.clientX; vel = 0; car.classList.add('is-drag');
      car.setPointerCapture && car.setPointerCapture(e.pointerId);
    });
    car.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - lastX; lastX = e.clientX;
      ang += dx * 0.28; vel = dx * 0.28 * 60;
    });
    var end = function () { dragging = false; car.classList.remove('is-drag'); };
    car.addEventListener('pointerup', end); car.addEventListener('pointercancel', end);
    new IntersectionObserver(function (es) { carVisible = es[0].isIntersecting; }).observe(car);
    var lastT = performance.now();
    (function spin(now) {
      requestAnimationFrame(spin);
      var dt = Math.min(0.05, (now - lastT) / 1000); lastT = now;
      if (!carVisible) return;
      if (!dragging) { vel *= Math.exp(-dt * 2.2); ang += (vel + (reduce ? 0 : 5)) * dt; }
      ring.style.transform = 'translateZ(' + (-R).toFixed(1) + 'px) rotateX(-9deg) rotateY(' + ang.toFixed(2) + 'deg)';
      for (var i = 0; i < n; i++) {
        var c = Math.cos((i * step + ang) * Math.PI / 180);
        figs[i].style.opacity = (c > 0 ? 0.3 + 0.7 * c : 0.1 + 0.2 * (1 + c)).toFixed(3);
      }
    })(lastT);
  }

  /* ── work with Rawan: three ways in, and the message writes itself ── */
  var cfg = (RR.data && RR.data.config) || { email: 'rawan.roshni@gmail.com', agency: {} };
  var agency = cfg.agency || {};
  var doors = $$('.way__btn');
  // a way's short form unfolds under the three cards; choosing the same way again folds it away
  function openDoor(key, toggle, scroll) {
    doors.forEach(function (d) {
      var panel = document.getElementById(d.getAttribute('aria-controls'));
      var was = d.getAttribute('aria-expanded') === 'true';
      var open = d.dataset.door === key && !(toggle && was);
      d.setAttribute('aria-expanded', open ? 'true' : 'false');
      var way = d.closest('.way'); if (way) way.classList.toggle('is-open', open);
      if (panel) panel.hidden = !open;
      if (open && scroll && panel) setTimeout(function () {
        var r = panel.getBoundingClientRect();
        if (r.bottom > innerHeight || r.top < 0) scrollTo({ top: scrollY + r.top - innerHeight * 0.25, behavior: 'smooth' });
      }, 30);
    });
    var ways = $('.ways'); if (ways) ways.classList.toggle('has-open', doors.some(function (d) { return d.getAttribute('aria-expanded') === 'true'; }));
  }
  doors.forEach(function (d) {
    d.addEventListener('click', function () { openDoor(d.dataset.door, true, true); });
  });

  // the agency: Aswatna. Until its address is added, performance requests come to Rawan, and the form says so
  var agName = $('[data-agency-name]'), agLinks = $('[data-agency-links]');
  if (agency.name && agName) agName.textContent = agency.name;
  if (agLinks) {
    if (agency.contact) agLinks.appendChild(document.createTextNode(agency.contact + ' · '));
    if (agency.email) { var am = document.createElement('a'); am.href = 'mailto:' + agency.email; am.textContent = agency.email; agLinks.appendChild(am); }
    if (agency.url) { var au = document.createElement('a'); au.href = agency.url; au.target = '_blank'; au.rel = 'noopener'; au.textContent = 'aswatna'; agLinks.appendChild(document.createTextNode(' · ')); agLinks.appendChild(au); }
  }
  var musicForm = $('[data-compose="music"]');
  if (musicForm && !agency.email) {
    var mn = $('[data-compose-note]', musicForm);
    if (mn) { mn.removeAttribute('data-i18n'); mn.textContent = 'Until Aswatna’s address is added, this opens in your email app addressed to Rawan, who passes it on.'; mn.setAttribute('data-i18n', 'work.note.agency'); }
  }

  $$('[data-preset]').forEach(function (a) {
    a.addEventListener('click', function () {
      var box = document.querySelector('.compose input[value="' + a.dataset.preset.replace(/"/g, '\\"') + '"]');
      if (!box) return;
      box.checked = true;
      var panel = box.closest('form[data-compose]');
      var door = panel && doors.filter(function (d) { return d.getAttribute('aria-controls') === panel.id; })[0];
      if (door) openDoor(door.dataset.door);
    });
  });
  if (/^#(book|invite)-?(music|facil|voice)?$/.test(location.hash)) {
    var want = location.hash.split('-')[1];
    if (want === 'voice') location.replace('voice-liberation.html#booking');
    else if (want) {
      openDoor(want);
      var bookSec = document.getElementById('book');
      if (bookSec) setTimeout(function () { bookSec.scrollIntoView(); }, 60);
    }
  }

  $$('form[data-compose]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var kind = form.dataset.compose;
      var val = function (n) { return form.elements[n] ? String(form.elements[n].value || '').trim() : ''; };
      var wants = $$('input[name="want"]:checked', form).map(function (i) { return i.value; });
      var role = form.elements.role ? (($$('input[name="role"]:checked', form)[0] || {}).value || '') : '';
      var name = val('name'), org = val('org'), where = val('where'), size = val('size'), msg = val('msg');
      var to = kind === 'music' ? (agency.email || cfg.email) : cfg.email;
      var first = wants.length ? wants[0].replace(/^[^:]+:\s*/, '') : '';
      var subject = kind === 'music'
        ? 'Booking request: Rawan Roshni' + (first ? ' — ' + first + (wants.length > 1 ? ' & more' : '') : '')
        : (role ? role : 'Invitation') + ' — for Rawan' + (first ? ' — ' + first + (wants.length > 1 ? ' & more' : '') : '');
      var lines = [kind === 'music' ? 'Hello,' : 'Dear Rawan,', ''];
      if (kind === 'music') lines.push('I would love to book Rawan Roshni' + (wants.length ? ' for:' : '.'));
      else if (role) lines.push('I would love to work with you on ' + role.toLowerCase() + (wants.length ? ', including:' : '.'));
      else if (wants.length) lines.push('I would love to invite you for:');
      wants.forEach(function (w) { lines.push('  · ' + w); });
      lines.push('');
      if (org) lines.push((kind === 'music' ? 'Festival / venue: ' : 'Organisation: ') + org);
      if (where) lines.push('Where & when: ' + where);
      if (size) lines.push((kind === 'music' ? 'Audience: ' : 'The group: ') + size);
      if (org || where || size) lines.push('');
      if (msg) { lines.push(msg); lines.push(''); }
      lines.push('With warmth,'); lines.push(name);
      window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
      var note = $('[data-compose-note]', form);
      if (note) note.textContent = 'Your email app should open with the message written. If it does not, write to ' + to + '.';
    });
  });
  $$('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var done = function () { b.textContent = 'Copied'; b.classList.add('is-done'); setTimeout(function () { b.textContent = 'Copy'; b.classList.remove('is-done'); }, 1800); };
      if (navigator.clipboard) navigator.clipboard.writeText(b.dataset.copy).then(done, function () {});
    });
  });
})();
