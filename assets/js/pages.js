/* ══════════════════════════════════════════════════════════════════════
   THE PAGES — calendar, event landing, Voice Liberation, action, store

   Each part below wakes only if its page is open. All of it draws from
   assets/js/data.js. Nothing here takes money or holds a real calendar:
   reservations, bookings and orders are written as an email to Rawan
   who confirms each one herself; each page says so on screen.
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var RR = window.RR = window.RR || {};
  var D = RR.data, F = RR.fmt;
  if (!D || !F) return;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var esc = function (t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var SAMPLE = '<span class="sample">Sample</span>';
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  var mail = D.config.email;
  function mailto(to, subject, lines) {
    window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
  }
  function where(g) { return g.online ? 'Online' : g.place + (g.country ? ', ' + g.country : ''); }
  function dayBlock(g) {
    var a = F.date(g.start), b = g.end ? F.date(g.end) : null;
    return a.getDate() + '<small>' + F.MON3[a.getMonth()] + '</small>' + (b ? '<em>to ' + b.getDate() + ' ' + F.MON3[b.getMonth()] + '</em>' : '');
  }
  // handed to page-only scripts (assets/js/lataif.js on the unlinked courses page)
  var kit = function () { return { $: $, $$: $$, esc: esc, bell: bell, mailto: mailto, mail: mail }; };
  // a soft bell for the pages that answer a touch with a tone, whether or not the garden is playing
  function bell(f, gain) {
    var ctx = RR.audio && RR.audio.ensure();
    if (!ctx) return;
    var t = ctx.currentTime;
    [1, 2.01, 3.0].forEach(function (m, k) {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = f * m;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime((gain || 0.06) * [1, 0.25, 0.08][k], t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 3.4 - k * 0.8);
      o.connect(g); g.connect(ctx.destination); if (RR.audio.verb) g.connect(RR.audio.verb);
      o.start(t); o.stop(t + 3.5);
    });
  }

  RR.pageKit = kit();

  /* ── home: the next landings ─────────────────────────────────────── */
  var soon = $('[data-soon]');
  if (soon) {
    RR.upcoming().slice(0, +soon.dataset.soon || 3).forEach(function (g) {
      var a = F.date(g.start), li = document.createElement('li');
      li.innerHTML = '<a href="event.html?e=' + esc(g.slug) + '">' +
        '<span class="soon__d">' + a.getDate() + '<small>' + F.MON3[a.getMonth()] + ' ' + a.getFullYear() + '</small></span>' +
        '<span><p class="soon__t">' + esc(g.title) + '</p><p class="soon__m"><span class="kind kind--' + g.kind + '">' + F.KIND[g.kind] + '</span> ' + esc(where(g)) + (g.sample ? ' ' + SAMPLE : '') + '</p></span>' +
        '<span class="soon__go" aria-hidden="true">→</span></a>';
      soon.appendChild(li);
    });
  }

  /* ── calendar ────────────────────────────────────────────────────── */
  var cal = $('[data-calendar]');
  if (cal) {
    var all = RR.upcoming();
    var feat = all.filter(function (g) { return g.feature; })[0];
    var featEl = $('[data-feature]');
    if (feat && featEl) {
      featEl.href = 'event.html?e=' + feat.slug;
      featEl.innerHTML = '<div class="feature__img">' + RR.img(feat.img, '(max-width:1000px) 100vw, 55vw') + '</div>' +
        '<div class="feature__copy"><p class="eyebrow eyebrow--candle">' + (feat.kind === 'launch' ? 'The launch' : feat.kind === 'retreat' ? 'The next retreat' : 'Next') + (feat.sample ? ' ' + SAMPLE : '') + '</p>' +
        '<p class="big">' + esc(feat.title) + '</p>' +
        '<p class="feature__meta"><span>' + esc(F.range(feat)) + '</span><span>' + esc(where(feat)) + '</span><span class="status status--' + feat.status + '">' + F.STATUS[feat.status] + '</span></p>' +
        '<p>' + esc(feat.lede) + '</p>' +
        '<span><span class="btn btn--candle">Details &amp; reserve</span></span></div>';
      featEl.hidden = false;
    }

    // the year ahead, as a ribbon of months with a light for each gathering
    var ribbon = $('[data-ribbon]'), now = new Date(), months = [];
    for (var mi = 0; mi < 12; mi++) months.push(new Date(now.getFullYear(), now.getMonth() + mi, 1));
    var key = function (d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2); };
    var byMonth = {};
    all.forEach(function (g) { (byMonth[g.start.slice(0, 7)] = byMonth[g.start.slice(0, 7)] || []).push(g); });

    var wrap = $('[data-months]');
    Object.keys(byMonth).sort().forEach(function (k) {
      var p = k.split('-'), sec = document.createElement('section');
      sec.className = 'month'; sec.id = 'm-' + k;
      sec.innerHTML = '<h2 class="month__h">' + F.MON[+p[1] - 1] + '<small>' + p[0] + '</small></h2><ul></ul>';
      var ul = $('ul', sec);
      byMonth[k].forEach(function (g) {
        var li = document.createElement('li');
        li.className = 'gcard'; li.dataset.kind = g.kind; li.dataset.online = g.online ? '1' : '';
        li.innerHTML = '<div class="gcard__d">' + dayBlock(g) + '</div>' +
          '<div class="gcard__img">' + RR.img(g.img, '150px') + '</div>' +
          '<div><p class="gcard__m"><span class="kind kind--' + g.kind + '">' + F.KIND[g.kind] + '</span><span>' + esc(where(g)) + '</span>' + (g.time ? '<span>' + esc(g.time) + '</span>' : '') + '</p>' +
          '<h3 class="gcard__t"><a href="event.html?e=' + esc(g.slug) + '">' + esc(g.title) + '</a></h3>' +
          '<p class="gcard__l">' + esc(g.lede) + '</p></div>' +
          '<div class="gcard__end"><span class="status status--' + g.status + '">' + F.STATUS[g.status] + '</span>' + (g.sample ? SAMPLE : '') +
          '<button type="button" class="ics" data-ics="' + esc(g.slug) + '">+ Add to calendar</button></div>';
        ul.appendChild(li);
      });
      wrap.appendChild(sec);
    });
    if (!all.length) wrap.innerHTML = '<p class="cal-empty">New dates are on their way.</p>';

    months.forEach(function (d) {
      var k = key(d), n = (byMonth[k] || []).length, b = document.createElement('button');
      b.type = 'button';
      b.innerHTML = F.MON3[d.getMonth()] + '<i>' + new Array(n + 1).join('<b></b>') + '</i>';
      b.setAttribute('aria-label', F.MON[d.getMonth()] + ' ' + d.getFullYear() + ': ' + n + (n === 1 ? ' gathering' : ' gatherings'));
      if (!n) { b.classList.add('is-empty'); b.disabled = true; }
      else b.addEventListener('click', function () { var t = document.getElementById('m-' + k); if (t) t.scrollIntoView({ behavior: 'smooth' }); });
      ribbon.appendChild(b);
    });

    // filters
    var KINDS = [['all', 'All'], ['launch', 'Launch'], ['retreat', 'Retreats'], ['concert', 'Concerts'], ['workshop', 'Workshops'], ['circle', 'Circles'], ['online', 'Online']];
    var fl = $('[data-filters]');
    KINDS.forEach(function (k) {
      var n = k[0] === 'all' ? all.length : all.filter(function (g) { return k[0] === 'online' ? g.online : g.kind === k[0]; }).length;
      if (!n && k[0] !== 'all') return;
      var b = document.createElement('button');
      b.type = 'button'; b.dataset.f = k[0]; b.setAttribute('aria-pressed', k[0] === 'all' ? 'true' : 'false');
      b.innerHTML = k[1] + '<span>' + n + '</span>';
      b.addEventListener('click', function () {
        $$('button', fl).forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
        $$('.gcard', wrap).forEach(function (c) {
          c.hidden = !(k[0] === 'all' || (k[0] === 'online' ? c.dataset.online : c.dataset.kind === k[0]));
        });
        $$('.month', wrap).forEach(function (m) { m.hidden = !$$('.gcard:not([hidden])', m).length; });
      });
      fl.appendChild(b);
    });
  }
  $$('[data-ics]').forEach(function (b) {
    b.addEventListener('click', function () {
      var g = D.gatherings.filter(function (x) { return x.slug === b.dataset.ics; })[0];
      if (g) RR.ics(g);
    });
  });

  /* ── one gathering's own landing page ────────────────────────────── */
  var ev = $('[data-event]');
  if (ev) {
    var slug = (location.search.match(/[?&]e=([^&]+)/) || [])[1];
    var up = RR.upcoming();
    var g = D.gatherings.filter(function (x) { return x.slug === decodeURIComponent(slug || ''); })[0] || up[0] || D.gatherings[0];
    document.title = g.title + ' — Rawan Roshni';
    // the field takes the shape of the gathering
    var hero = $('.ehero');
    hero.dataset.form = { retreat: 'skirt', concert: 'birds', workshop: 'logo', circle: 'ring' }[g.kind] || 'drift';
    $('[data-e-img]').innerHTML = RR.img(g.img, '100vw').replace('loading="lazy"', 'fetchpriority="high"');
    $('[data-e-kind]').innerHTML = '<span class="kind kind--' + g.kind + '">' + F.KIND[g.kind] + '</span>' +
      ' <span class="status status--' + g.status + '">' + F.STATUS[g.status] + '</span>' + (g.sample ? ' ' + SAMPLE : '');
    $('[data-e-title]').textContent = g.title;
    $('[data-e-when]').textContent = F.range(g);
    $('[data-e-time]').textContent = g.time || '—';
    $('[data-e-where]').textContent = where(g);
    $('[data-e-lede]').textContent = g.lede;
    var days = Math.round((F.date(g.start) - new Date().setHours(0, 0, 0, 0)) / 864e5);
    $('[data-e-count]').textContent = days > 1 ? 'In ' + days + ' days' : days === 1 ? 'Tomorrow' : days === 0 ? 'Today' : '';
    $('[data-e-about]').innerHTML = g.about.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
    $('[data-e-includes]').innerHTML = g.includes.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('');
    $('[data-e-days]').innerHTML = g.days.map(function (p) { return '<li><b>' + esc(p.t) + '</b><span>' + esc(p.d) + '</span></li>'; }).join('');
    $$('[data-e-ics]').forEach(function (b) { b.addEventListener('click', function () { RR.ics(g); }); });

    var tiers = $('[data-tiers]');
    if (g.img2) {
      var po = document.createElement('figure'); po.className = 'poster curtain';
      po.innerHTML = RR.img(g.img2, '(max-width:900px) 92vw, 40vw');
      $('.eabout').appendChild(po); setTimeout(function () { po.classList.add('in'); }, 50);
    }
    tiers.innerHTML = (g.price ? g.price.tiers : []).map(function (t, i) {
      return '<label><input type="radio" name="tier" value="' + esc(t.name) + '"' + (i === 0 ? ' checked' : '') + '><span><b>' + esc(t.name) + '</b><em>' + F.money(t.amount, g.price.cur) + '</em>' +
        (t.note ? '<small>' + esc(t.note) + '</small>' : '<small>per person</small>') + '</span></label>';
    }).join('');
    var wait = g.status === 'waitlist';
    $('[data-reserve-title]').textContent = g.apply ? 'Apply for your place' : g.free ? 'Save your place' : wait ? 'Join the waitlist' : g.status === 'soon' ? 'Ask to be told first' : 'Reserve your place';
    $('[data-reserve-btn]').textContent = g.apply ? 'Apply now' : g.free ? 'RSVP' : wait ? 'Join the waitlist' : g.status === 'soon' ? 'Tell me when it opens' : 'Reserve my place';
    if (g.apply) {
      // places by application: the organisers' own form, in a new tab
      $('.reserve .fields').hidden = true; $('.reserve .fine').textContent = 'Places are by application. The form opens in a new tab.';
      var ab = $('[data-reserve-btn]'); ab.type = 'button'; ab.addEventListener('click', function () { window.open(g.apply, '_blank', 'noopener'); });
      $('.mobile-reserve .btn').textContent = 'Apply';
    }
    if (g.free) { var qf = $('.reserve .qty'); if (qf) qf.closest('.field').hidden = false; }
    $('[data-mobile-label]').textContent = F.range(g);
    var q = 1, qo = $('[data-qty]');
    $$('[data-q]').forEach(function (b) {
      b.addEventListener('click', function () { q = Math.max(1, Math.min(8, q + +b.dataset.q)); qo.value = q; qo.textContent = q; });
    });
    var rf = $('[data-reserve-form]');
    rf.addEventListener('submit', function (e) {
      e.preventDefault();
      var tier = ($('input[name="tier"]:checked', rf) || {}).value || '';
      var name = rf.elements.name.value.trim(), em = rf.elements.email.value.trim(), note = rf.elements.note.value.trim();
      mailto(mail, (wait ? 'Waitlist: ' : 'Reservation: ') + g.title + ' — ' + F.range(g), [
        'Dear Rawan,', '', (wait ? 'Please add me to the waitlist for ' : 'I would like to reserve ') + q + (q > 1 ? ' places' : ' place') + ' at ' + g.title + ' (' + F.range(g) + ', ' + where(g) + ').',
        tier ? 'Option: ' + tier : '', '', note, '', 'With warmth,', name, em
      ]);
      $('[data-reserved-what]').textContent = q + (q > 1 ? ' places' : ' place') + ' · ' + tier + ' · ' + F.range(g);
      $('.reserve').classList.add('is-done');
    });

    var others = $('[data-others]');
    up.filter(function (x) { return x !== g; }).slice(0, 3).forEach(function (o) {
      var li = document.createElement('li');
      li.innerHTML = '<a class="ocard" href="event.html?e=' + esc(o.slug) + '"><span class="ocard__img">' + RR.img(o.img, '(max-width:900px) 92vw, 30vw') + '</span>' +
        '<span class="ocard__d">' + esc(F.range(o)) + ' · ' + esc(where(o)) + '</span><span class="ocard__t">' + esc(o.title) + '</span></a>';
      others.appendChild(li);
    });

    // on a phone, a reserve bar that steps aside once the form itself is on screen
    var mr = $('.mobile-reserve'), rs = $('.reserve');
    if (mr && rs && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { mr.classList.toggle('is-away', es[0].isIntersecting); }, { threshold: 0.1 }).observe(rs);
    }
  }

  /* ── Voice Liberation: three breaths ─────────────────────────────── */
  var orb = $('[data-breath]');
  if (orb) {
    var word = $('.breath__word', orb), cnt = $('[data-breath-count]');
    var bOn = false, bTimer = 0, round = 0;
    var phase = function (label, scale, secs, next) {
      word.textContent = label;
      orb.style.setProperty('--bt', secs + 's');
      orb.style.setProperty('--b', scale);
      bTimer = setTimeout(next, secs * 1000);
    };
    var cycle = function () {
      if (!bOn) return;
      if (round >= 3) { bOn = false; word.textContent = 'Thank you'; cnt.textContent = 'Touch to breathe again'; orb.style.setProperty('--bt', '2s'); orb.style.setProperty('--b', 0.7); return; }
      round++; cnt.textContent = 'Breath ' + round + ' of 3';
      if (RR.audio && RR.audio.on) RR.audio.chime(round + 1);
      phase('In', 1, 4, function () { phase('Hold', 1, 2, function () { phase('Out', 0.55, 6, cycle); }); });
    };
    orb.addEventListener('click', function () {
      clearTimeout(bTimer);
      if (bOn) { bOn = false; word.textContent = 'Begin'; cnt.textContent = 'Touch to begin'; orb.style.setProperty('--b', 0.55); return; }
      bOn = true; round = 0; cycle();
    });
  }

  /* ── Voice Liberation: the booking ───────────────────────────────── */
  var bk = $('[data-booker]');
  if (bk) {
    // What can be booked online is the consultation; the seven-session journey is agreed in it.
    // (Rawan, Oct 2026: there are no single Voice Liberation sessions.) Rawan sets the fee.
    var FORMATS = [
      { id: 'consult', name: 'A consultation', len: 45, price: 'A small fee', note: 'Online or in Amman · 45 minutes', slots: ['10:00', '13:00', '17:00', '18:00'] }
    ];
    var st = { f: null, day: null, slot: null };
    var steps = $$('.steps li', bk), panes = $$('.bk-step', bk);
    var visitorTz = (Intl.DateTimeFormat().resolvedOptions().timeZone || '').replace(/_/g, ' ');
    var homeTz = D.config.tz;
    function show(i) {
      panes.forEach(function (p, k) { p.hidden = k !== i; });
      steps.forEach(function (s, k) { s.classList.toggle('is-here', k === i); s.classList.toggle('is-done', k < i); });
      var h = $('h3', panes[i]); if (h && bk.dataset.started) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
      // on a phone the steps sit above the panel: bring each new step into view
      if (bk.dataset.started && innerWidth <= 900) {
        var top = panes[i].getBoundingClientRect().top + scrollY - (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 64) - 16;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
      bk.dataset.started = '1';
    }
    function sideNote(i, t) { var s = $('span', steps[i]); if (s) s.textContent = t || ''; }

    // 1 · the format
    var fbox = $('[data-bk-formats]');
    FORMATS.forEach(function (f) {
      var b = document.createElement('button');
      b.type = 'button'; b.setAttribute('aria-pressed', 'false');
      b.innerHTML = '<b>' + esc(f.name) + '</b><small>' + esc(f.note) + '</small><em>' + esc(f.price) + '</em>';
      b.addEventListener('click', function () {
        st.f = f; st.slot = null;
        $$('button', fbox).forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
        sideNote(0, f.name); sideNote(2, '');
        drawCal(); show(1);
      });
      fbox.appendChild(b);
    });
    var pre = (location.hash.match(/#booking-(\w+)/) || [])[1];
    if (pre) setTimeout(function () { var i = FORMATS.map(function (f) { return f.id; }).indexOf(pre); if (i >= 0) $$('button', fbox)[i].click(); }, 0);

    // 2 · the day: four days a week for the next six weeks. A request, not a booking: Rawan confirms by email.
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var first = new Date(today); first.setDate(first.getDate() + 1);
    var last = new Date(today); last.setDate(last.getDate() + 42);
    var view = new Date(first.getFullYear(), first.getMonth(), 1);
    var openDay = function (d) {
      if (d < first || d > last) return false;
      return [0, 1, 3, 4].indexOf(d.getDay()) >= 0;                     // Sun, Mon, Wed, Thu
    };
    var calEl = $('[data-bk-cal]'), calTitle = $('[data-bk-month]');
    function drawCal() {
      calTitle.textContent = F.MON[view.getMonth()] + ' ' + view.getFullYear();
      calEl.innerHTML = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(function (d) { return '<span class="dow">' + d + '</span>'; }).join('');
      var start = (new Date(view.getFullYear(), view.getMonth(), 1).getDay() + 6) % 7;
      var n = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
      for (var i = 0; i < start; i++) calEl.appendChild(document.createElement('span'));
      for (var day = 1; day <= n; day++) {
        var d = new Date(view.getFullYear(), view.getMonth(), day), b = document.createElement('button');
        b.type = 'button'; b.textContent = day;
        var ok = openDay(d);
        b.setAttribute('aria-label', d.toDateString() + (ok ? ', available' : ', not available'));
        if (ok) {
          b.classList.add('is-open');
          b.setAttribute('aria-pressed', st.day && +st.day === +d ? 'true' : 'false');
          (function (d) { b.addEventListener('click', function () { st.day = d; st.slot = null; sideNote(1, d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })); sideNote(2, ''); drawCal(); drawSlots(); show(2); }); })(d);
        } else b.disabled = true;
        calEl.appendChild(b);
      }
      $('[data-bk-prev]').disabled = view <= new Date(first.getFullYear(), first.getMonth(), 1);
      $('[data-bk-next]').disabled = view >= new Date(last.getFullYear(), last.getMonth(), 1);
    }
    $('[data-bk-prev]').addEventListener('click', function () { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); drawCal(); });
    $('[data-bk-next]').addEventListener('click', function () { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); drawCal(); });

    // 3 · the time — set in Amman (UTC+3 all year), shown in the visitor's own time too
    var slotEl = $('[data-bk-slots]');
    function slotDate(day, hm) {
      var p = hm.split(':');
      return new Date(Date.UTC(day.getFullYear(), day.getMonth(), day.getDate(), +p[0] - 3, +p[1]));
    }
    function local(dt) { return dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }
    function drawSlots() {
      slotEl.innerHTML = '';
      $('[data-bk-day]').textContent = st.day.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });
      st.f.slots.forEach(function (hm) {
        var dt = slotDate(st.day, hm), b = document.createElement('button');
        b.type = 'button'; b.setAttribute('aria-pressed', 'false');
        var there = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: homeTz });
        b.innerHTML = esc(local(dt)) + (there === local(dt) ? '' : '<small>' + esc(there) + ' Amman</small>');
        b.addEventListener('click', function () {
          st.slot = dt;
          $$('button', slotEl).forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
          sideNote(2, local(dt));
          var inPerson = $('[data-bk-inperson]');
          if (inPerson) { inPerson.disabled = !!st.f.online; if (st.f.online) $('input[value="Online"]', bk).checked = true; }
          show(3);
        });
        slotEl.appendChild(b);
      });
      $('[data-bk-tz]').textContent = /Amman/.test(visitorTz) ? 'Times are in Amman time.' : 'Times are shown in your time (' + (visitorTz || 'local') + '). Rawan is in Amman.';
    }
    $$('[data-bk-back]').forEach(function (b) { b.addEventListener('click', function () { show(+b.dataset.bkBack); }); });

    // 4 · details, and the request
    var bf = $('[data-bk-form]');
    bf.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = bf.elements.name.value.trim(), em = bf.elements.email.value.trim(), msg = bf.elements.msg.value.trim();
      var mode = ($('input[name="mode"]:checked', bf) || {}).value || 'Online';
      var whenTxt = st.slot.toLocaleString(undefined, { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
      var amman = st.slot.toLocaleString('en-GB', { timeZone: homeTz, weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
      mailto(mail, 'Voice Liberation — ' + st.f.name + ' — ' + amman + ' (Amman)', [
        'Dear Rawan,', '', 'I would like to book ' + st.f.name.toLowerCase() + ' (' + st.f.len + ' minutes, ' + mode.toLowerCase() + ').',
        'Time: ' + amman + ' Amman time' + (whenTxt !== amman ? ' (' + whenTxt + ' my time)' : ''), '', msg, '', 'With warmth,', name, em
      ]);
      $('[data-bk-done]').textContent = st.f.name + ' · ' + whenTxt + ' · ' + mode;
      show(4);
    });
    $('[data-bk-ics]').addEventListener('click', function () {
      var s = st.slot, e2 = new Date(+s + st.f.len * 60000);
      var z = function (d) { return d.toISOString().replace(/[-:]/g, '').replace(/\.\d+/, ''); };
      var body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Rawan Roshni//Voice Liberation//EN', 'BEGIN:VEVENT', 'UID:vl-' + z(s) + '@rawanroshni',
        'DTSTAMP:' + z(new Date()), 'DTSTART:' + z(s), 'DTEND:' + z(e2), 'SUMMARY:Voice Liberation with Rawan Roshni (requested)', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
      var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([body], { type: 'text/calendar' })); a.download = 'voice-liberation.ics';
      document.body.appendChild(a); a.click(); a.remove();
    });
    // one format only: it is chosen for the visitor, and the booking opens on the calendar
    $$('button', fbox)[0].click();
  }

  /* ── Action Options & Zakat: the organisations, each a door out ──── */
  var acts = $('[data-actions]');
  if (acts) {
    (D.actions || []).forEach(function (o, i) {
      var li = document.createElement('li'); li.className = 'org reveal';
      var host = o.url.replace(/^https?:\/\//, '').replace(/\/$/, '');
      li.innerHTML = '<a href="' + esc(o.url) + '" target="_blank" rel="noopener"><span class="org__n">0' + (i + 1) + '</span><b class="org__name">' + esc(o.name) + '</b><span class="org__what">' + esc(o.what) + '</span><span class="org__url">' + esc(host) + ' ↗</span></a>';
      acts.appendChild(li);
      setTimeout(function () { li.classList.add('in'); }, 80 + i * 90);
    });
  }

  /* ── the store ───────────────────────────────────────────────────── */
  var shop = $('[data-store]');
  if (shop) {
    var CATS = [['all', 'All'], ['objects', 'Objects'], ['recordings', 'Recordings'], ['courses', 'Courses'], ['music', 'Music'], ['gifts', 'Gifts']];
    var CAT_NAME = { music: 'Music', recordings: 'Recording', gifts: 'Gift', objects: 'Object', courses: 'Course' };
    function priceOf(p) { return p.price ? (p.approx ? 'from ' : '') + F.money(p.price, p.cur) + (p.ship ? ' <small>+ shipping</small>' : '') : (p.priceText || 'On request'); }
    function ctaOf(p) { return p.link ? '<a class="add" href="' + esc(p.link) + '">' + esc(p.cta || 'Enquire') + '</a>' : '<button type="button" class="add" data-add="' + p.id + '">Add to bag</button>'; }
    var byId = {}; D.products.forEach(function (p) { byId[p.id] = p; });
    var bag = store.get('rr-bag', {});
    Object.keys(bag).forEach(function (k) { if (!byId[k]) delete bag[k]; });

    var grid = $('[data-products]');
    D.products.forEach(function (p) {
      var li = document.createElement('li');
      li.className = 'product'; li.dataset.cat = p.cat;
      li.innerHTML = '<div class="product__badge">' + (p.badge ? '<span class="tag">' + esc(p.badge) + '</span>' : '') + (p.sample ? SAMPLE : '') + '</div>' +
        '<button type="button" class="product__img' + (p.contain ? ' is-contain' : '') + '" data-quick="' + p.id + '" aria-label="More about ' + esc(p.title) + '">' + RR.img(p.img, '(max-width:800px) 46vw, 23vw') + '</button>' +
        '<div class="product__body"><span class="product__cat">' + CAT_NAME[p.cat] + '</span><h3 class="product__t">' + esc(p.title) + '</h3><p class="product__by">' + esc(p.by) + ' · ' + esc(p.kind) + '</p></div>' +
        '<div class="product__end"><span class="product__price">' + priceOf(p) + '</span>' + ctaOf(p) + '</div>';
      grid.appendChild(li);
    });

    var fl2 = $('[data-cats]');
    CATS.forEach(function (c) {
      var n = c[0] === 'all' ? D.products.length : D.products.filter(function (p) { return p.cat === c[0]; }).length;
      if (!n) return;
      var b = document.createElement('button');
      b.type = 'button'; b.setAttribute('aria-pressed', c[0] === 'all' ? 'true' : 'false');
      b.innerHTML = c[1] + '<span>' + n + '</span>';
      b.addEventListener('click', function () {
        $$('button', fl2).forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
        $$('.product', grid).forEach(function (el) { el.hidden = !(c[0] === 'all' || el.dataset.cat === c[0]); });
      });
      fl2.appendChild(b);
    });

    var bagBtn = $('[data-bag-btn]'), drawer = $('[data-drawer]'), list = $('[data-bag-list]');
    function count() { return Object.keys(bag).reduce(function (s, k) { return s + bag[k]; }, 0); }
    function render() {
      var n = count();
      $('b', bagBtn).textContent = n;
      bagBtn.hidden = !n;
      list.innerHTML = '';
      var sum = 0;
      Object.keys(bag).forEach(function (k) {
        var p = byId[k], q = bag[k]; sum += (p.price || 0) * q;
        var li = document.createElement('li'); li.className = 'line';
        li.innerHTML = '<span class="line__img">' + RR.img(p.img, '72px') + '</span>' +
          '<div><p class="line__t">' + esc(p.title) + '</p><div class="qty"><button type="button" data-dq="-1" aria-label="One fewer">−</button><output>' + q + '</output><button type="button" data-dq="1" aria-label="One more">+</button></div></div>' +
          '<div><span class="line__p">' + F.money(p.price * q, p.cur) + '</span><button type="button" class="line__rm">Remove</button></div>';
        $$('[data-dq]', li).forEach(function (b) { b.addEventListener('click', function () { bag[k] = Math.max(0, Math.min(9, bag[k] + +b.dataset.dq)); if (!bag[k]) delete bag[k]; save(); }); });
        $('.line__rm', li).addEventListener('click', function () { delete bag[k]; save(); });
        list.appendChild(li);
      });
      if (!n) list.innerHTML = '<li class="drawer__empty">Your bag is empty — for now.</li>';
      $('[data-bag-sum]').textContent = F.money(sum, 'USD');
      $('[data-checkout]').disabled = !n;
      $$('[data-add]').forEach(function (b) { var inBag = !!bag[b.dataset.add]; b.classList.toggle('is-added', inBag); b.textContent = inBag ? 'In your bag' : 'Add to bag'; });
    }
    function save() { store.set('rr-bag', bag); render(); }
    function add(id) {
      bag[id] = Math.min(9, (bag[id] || 0) + 1); save();
      bagBtn.classList.remove('is-bump'); void bagBtn.offsetWidth; bagBtn.classList.add('is-bump');
      if (RR.audio && RR.audio.on) RR.audio.chime(D.products.indexOf(byId[id]));
    }
    shop.addEventListener('click', function (e) {
      var a = e.target.closest('[data-add]'); if (a) { add(a.dataset.add); return; }
      var qv = e.target.closest('[data-quick]'); if (qv) openQuick(byId[qv.dataset.quick]);
    });
    var openDlg = function (d) { if (d.showModal) d.showModal(); else d.setAttribute('open', ''); };
    bagBtn.addEventListener('click', function () { openDlg(drawer); });
    $$('[data-close]').forEach(function (b) { b.addEventListener('click', function () { b.closest('dialog').close(); }); });
    [drawer, $('[data-quickview]')].forEach(function (d) { d.addEventListener('click', function (e) { if (e.target === d) d.close(); }); });
    $('[data-checkout]').addEventListener('click', function () {
      var lines = ['Dear Rawan,', '', 'I would like to order:'];
      Object.keys(bag).forEach(function (k) { lines.push('  · ' + bag[k] + ' × ' + byId[k].title + ' — ' + F.money(byId[k].price * bag[k], byId[k].cur)); });
      lines.push('', 'With warmth,');
      mailto(mail, 'An order from the store', lines);
      $('[data-checkout-note]').textContent = 'Your order is written as an email to Rawan. She replies to confirm it, with shipping and how to pay.';
    });
    var qd = $('[data-quickview]');
    function openQuick(p) {
      $('.quick__img', qd).className = 'quick__img' + (p.contain ? ' is-contain' : '');
      $('.quick__img', qd).innerHTML = RR.img(p.img, '(max-width:800px) 94vw, 450px');
      $('[data-q-cat]', qd).innerHTML = CAT_NAME[p.cat] + (p.sample ? ' ' + SAMPLE : '');
      $('[data-q-title]', qd).textContent = p.title;
      $('[data-q-by]', qd).textContent = p.by + ' · ' + p.kind;
      $('[data-q-about]', qd).textContent = p.about;
      $('[data-q-price]', qd).innerHTML = priceOf(p);
      var qa = $('[data-q-add]', qd); qa.dataset.add = p.id; qa.textContent = p.link ? (p.cta || 'Enquire') : 'Add to bag'; qa.dataset.link = p.link || '';
      openDlg(qd);
    }
    $('[data-q-add]', qd).addEventListener('click', function (e) { var l = e.currentTarget.dataset.link; if (l) { location.href = l; return; } add(e.currentTarget.dataset.add); qd.close(); openDlg(drawer); });
    render();
  }
})();
