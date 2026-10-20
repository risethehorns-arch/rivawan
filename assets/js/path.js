/* ══════════════════════════════════════════════════════════════════════
   THE FLIGHT PATH

   The map is every country she has landed in — born, lived, travelled and
   worked — in the order she listed them (Oct 2026); the bird flies them.
   Below it, the log: every offering listed on her old site (Nov 2022 — Oct
   2024). Counts are computed from these lists, never typed.
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var PLACES = {
    dubai:   { name: 'Dubai',               lat: 25.20, lon: 55.27, country: 'UAE', dx: 16, dy: 6 },
    porto:   { name: 'Porto',               lat: 41.15, lon: -8.61, country: 'Portugal', dx: 16, dy: 6 },
    odemira: { name: 'Odemira',             lat: 37.60, lon: -8.64, country: 'Portugal', dx: 16, dy: 6 },
    wasing:  { name: 'Wasing Estate',       lat: 51.37, lon: -1.20, country: 'UK', dx: 16, dy: 6 },
    amman:   { name: 'Amman · Madaba',      lat: 31.90, lon: 35.90, country: 'Jordan', dx: 16, dy: -8 },
    gouna:   { name: 'El Gouna',            lat: 27.40, lon: 33.68, country: 'Egypt', dx: 16, dy: 14 },
    alex:    { name: 'Alexandria',          lat: 31.21, lon: 29.91, country: 'Egypt', dx: -16, dy: -14, end: true },
    siwa:    { name: 'Siwa Oasis',          lat: 29.20, lon: 25.52, country: 'Egypt', dx: -16, dy: 6, end: true },
    fethiye: { name: 'Kabak · Yanıklar',    lat: 36.55, lon: 29.10, country: 'Turkey', dx: -16, dy: -12, end: true },
    online:  { name: 'Online',              online: true, country: '' }
  };

  // kind: concert · workshop · circle
  var EVENTS = [
    ['2024-10-18', 'Al-Tuyoor: Messages from the Birds', 'concert', '', 'Theatre of Digital Arts, Dubai', 'dubai'],
    ['2024-09-02', 'Wonders of Whirling Workshop @ Synesthesia Festival', 'workshop', '', 'The Garden, Porto', 'porto'],
    ['2024-08-30', 'Al-Tuyoor @ Synesthesia Festival', 'concert', '', 'The Garden, Porto', 'porto'],
    ['2024-08-17', 'Al-Tuyoor @ Medicine Festival', 'concert', '10:00–11:00 PM', 'Wasing Estate', 'wasing'],
    ['2024-07-26', 'Al-Tuyoor — Gaza Fundraiser', 'concert', '8:00 PM', 'Tamera Healing Biotope, Odemira', 'odemira'],
    ['2024-04-04', 'Poetry of the Spirit — Ramadan Performance', 'concert', '9:00 PM', 'Theatre of Digital Arts, Dubai', 'dubai'],
    ['2024-04-03', 'Al-Tuyoor: Messages from the Birds', 'concert', '8:00–10:00 PM', 'The Sound Garden, Dubai', 'dubai'],
    ['2024-02-18', 'Collective Grief Ritual @ Moving Towards Liberation', 'circle', '1:00–4:00 PM', 'Off The Dancefloor, on Zoom', 'online'],
    ['2024-01-06', 'Al-Tuyoor — Gaza Fundraiser', 'concert', '7:00 PM', 'Al Rainbow Theatre, Amman', 'amman'],
    ['2023-11-18', 'Al-Tuyoor @ Raabta Wellness Festival', 'concert', '3:00–4:30 PM', 'Fish Farm, Gouna', 'gouna'],
    ['2023-11-17', 'Conscious Communication: Community Tools @ Raabta', 'workshop', '4:00–6:00 PM', 'Fish Farm, Gouna', 'gouna'],
    ['2023-11-17', 'Grief Circle @ Raabta Wellness Festival', 'circle', '10:00–11:30 AM', 'Fish Farm, Gouna', 'gouna'],
    ['2023-11-16', "Women's Circle: Authentic Relating, Desires, Boundaries & Consent", 'circle', '3:30–5:30 PM', 'Fish Farm, Gouna', 'gouna'],
    ['2023-09-04', 'Al-Tuyoor @ Conference of the Birds Festival', 'concert', '10:00 PM', 'Pastorale Wadi, Yanıklar', 'fethiye'],
    ['2023-08-29', "Co-Facilitation & Performances @ SoulStar Women's Retreat", 'circle', '4 days', 'Kabak', 'fethiye'],
    ['2023-05-08', 'SemaZen: Spiritual Singing Circle', 'circle', '6:30 PM', 'Shanti House, Amman', 'amman'],
    ['2023-05-05', 'SemaZen: Live @ Kawon', 'concert', '8:00 PM', 'Kawon Bookstore, Madaba', 'amman'],
    ['2023-04-29', 'SemaZen: Spiritual Singing Circle', 'circle', '8:00 PM', 'MVMNT, Sweifieh Village, Amman', 'amman'],
    ['2023-04-14', 'SemaZen: Sufi Music Night', 'concert', '9:00 PM', 'Jadal for Knowledge and Culture, Amman', 'amman'],
    ['2023-02-11', 'Al-Tuyoor: Messages from the Birds', 'concert', '7:00 PM', 'Osama Al Mashini Theatre, Amman', 'amman'],
    ['2023-01-11', 'Conscious Sexuality & The Wheel of Consent', 'workshop', '6:00–9:00 PM', 'MVMNT, Sweifieh Village, Amman', 'amman'],
    ['2022-12-28', 'Conscious Sexuality & The Wheel of Consent', 'workshop', '12:00–3:00 PM', 'MVMNT, Sweifieh Village, Amman', 'amman'],
    ['2022-11-10', 'Qamarjan World Music @ Dawayer Festival', 'concert', '6:00–7:00 PM', 'Taghagheen Camp, Siwa Oasis', 'siwa'],
    ['2022-11-05', 'Qamarjan World Music @ Raabta Festival', 'concert', '6:00–7:00 PM', 'Fish Farm, Gouna', 'gouna'],
    ['2022-11-05', 'Active SoundWork: Clearing Chakra Pathways with the Voice', 'workshop', '12:00–2:00 PM', 'Raabta Festival, Fish Farm, Gouna', 'gouna'],
    ['2022-11-04', 'Conscious Sexuality & The Wheel of Consent', 'workshop', '5:00–8:00 PM', 'Raabta Festival, Fish Farm, Gouna', 'gouna'],
    ['2022-11-03', 'Al-Tuyoor @ Bab El Ba7r Festival', 'concert', '7:00–8:00 PM', 'Bibliotheca Alexandrina, Alexandria', 'alex']
  ].map(function (e) { return { date: e[0], title: e[1], kind: e[2], time: e[3], venue: e[4], place: e[5] }; });

  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  var KIND = { concert: 'Concert', workshop: 'Workshop', circle: 'Circle' };

  /* ── counts, written into the page ───────────────────────────────── */
  var countries = {}, placesUsed = {};
  EVENTS.forEach(function (e) { var p = PLACES[e.place]; placesUsed[e.place] = (placesUsed[e.place] || 0) + 1; if (p.country) countries[p.country] = 1; });
  var nCountries = Object.keys(countries).length;
  var years = EVENTS.map(function (e) { return +e.date.slice(0, 4); });
  // Rawan's own figure (Oct 2026): the bird has landed in 9 countries. The event list below is older
  // and shows fewer; when her new dates are added, the computed count takes over if it is larger.
  var TUYOOR_COUNTRIES_STATED = 9;
  var tc = document.querySelector('[data-count="tuyoor-countries"]');
  if (tc) {
    var tcs = {};
    EVENTS.forEach(function (e) { if (/Al-Tuyoor/.test(e.title) && PLACES[e.place].country) tcs[PLACES[e.place].country] = 1; });
    tc.textContent = Math.max(TUYOOR_COUNTRIES_STATED, Object.keys(tcs).length) + ' countries';
  }

  /* ── the map: every country she has landed in ───────────────────────
     Her own list (Oct 2026): born in Kuwait; lived in Jordan and Canada; travelled and
     worked in thirteen more. The bird flies them in the order she wrote them. */
  var COUNTRIES = [
    ['Kuwait', 29.4, 47.7, 'born', 1, -14], ['Jordan', 31.9, 35.9, 'lived', 1, 16], ['Canada', 43.7, -79.4, 'lived', 1, -14],
    ['Egypt', 27.2, 31.2, 'worked', 1, 16], ['Turkey', 38.9, 33.0, 'worked', 1, -14], ['Portugal', 39.6, -8.0, 'worked', 1, 16],
    ['USA', 38.0, -97.0, 'worked', 1, 16], ['Spain', 40.4, -3.7, 'worked', 1, -14], ['Morocco', 31.8, -7.1, 'worked', 1, 16],
    ['Tunisia', 34.0, 9.5, 'worked', 1, 16], ['Palestine', 31.9, 35.2, 'worked', -1, -14], ['Panama', 8.5, -80.0, 'worked', 1, 16],
    ['UAE', 24.5, 54.4, 'worked', 1, 16], ['UK', 52.4, -1.5, 'worked', 1, -14], ['Montenegro', 42.7, 19.4, 'worked', 1, -14], ['Ireland', 53.3, -8.0, 'worked', -1, -14]
  ];
  var ROLE = { born: 'Born here', lived: 'Lived here', worked: 'Travelled & worked' };
  var stats = document.querySelector('[data-path-stats]');
  if (stats) {
    var lived = COUNTRIES.filter(function (c) { return c[3] === 'lived'; }).map(function (c) { return c[0]; });
    var worked = COUNTRIES.filter(function (c) { return c[3] === 'worked'; }).length;
    stats.textContent = 'Born in Kuwait. Raised between ' + lived.join(' and ') + '. Travelled and worked in ' + worked + ' countries more — ' + COUNTRIES.length + ' in all.';
  }

  var svg = document.getElementById('map');
  if (svg) {
    var NS = 'http://www.w3.org/2000/svg';
    var LON0 = -108, LON1 = 62, LAT0 = 2, LAT1 = 60;
    var k = Math.cos(34 * Math.PI / 180);
    var VW = 1000, VH = Math.round(VW * (LAT1 - LAT0) / ((LON1 - LON0) * k));
    svg.setAttribute('viewBox', '0 0 ' + VW + ' ' + VH);
    var proj = function (lat, lon) { return [(lon - LON0) / (LON1 - LON0) * VW, (LAT1 - lat) / (LAT1 - LAT0) * VH]; };
    var el = function (n, a, parent) { var e = document.createElementNS(NS, n); for (var q in a) e.setAttribute(q, a[q]); (parent || svg).appendChild(e); return e; };

    var defs = el('defs', {});
    var lg = el('linearGradient', { id: 'arcGrad', x1: '0', y1: '0', x2: '1', y2: '0' }, defs);
    el('stop', { offset: '0', 'stop-color': '#54C7A8', 'stop-opacity': '.9' }, lg);
    el('stop', { offset: '1', 'stop-color': '#E9A55B', 'stop-opacity': '.9' }, lg);

    var grat = el('g', { class: 'grat' });
    for (var lo = -100; lo <= 60; lo += 20) { var a = proj(LAT0, lo), b = proj(LAT1, lo); el('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1] }, grat); }
    for (var la = 10; la <= 60; la += 10) { var c = proj(la, LON0), d = proj(la, LON1); el('line', { x1: c[0], y1: c[1], x2: d[0], y2: d[1] }, grat); }

    var cities = {};
    var arcs = el('g', {}), legs = [];
    for (var i = 1; i < COUNTRIES.length; i++) {
      var A = COUNTRIES[i - 1], B = COUNTRIES[i];
      var p0 = proj(A[1], A[2]), p1 = proj(B[1], B[2]);
      var mx = (p0[0] + p1[0]) / 2, my = (p0[1] + p1[1]) / 2;
      var dx = p1[0] - p0[0], dy = p1[1] - p0[1], L = Math.sqrt(dx * dx + dy * dy);
      var lift = Math.min(150, L * 0.3) * (i % 2 ? 1 : 0.8);
      var cx = mx + dy / L * lift * -1, cy = my - Math.abs(dx / L) * lift - lift * 0.3;
      var path = el('path', { class: 'arc', d: 'M' + p0[0].toFixed(1) + ',' + p0[1].toFixed(1) + ' Q' + cx.toFixed(1) + ',' + cy.toFixed(1) + ' ' + p1[0].toFixed(1) + ',' + p1[1].toFixed(1) }, arcs);
      var len = path.getTotalLength ? path.getTotalLength() : 600;
      path.style.setProperty('--len', len.toFixed(0));
      path.style.setProperty('--dl', ((i - 1) * 0.12).toFixed(2) + 's');
      legs.push({ path: path, len: len, to: B[0], role: B[3] });
    }

    COUNTRIES.forEach(function (cty) {
      var q = proj(cty[1], cty[2]);
      var g = el('g', { class: 'city city--' + cty[3], 'data-place': cty[0] });
      el('circle', { class: 'halo', cx: q[0], cy: q[1], r: cty[3] === 'worked' ? 11 : 16 }, g);
      el('circle', { class: 'core', cx: q[0], cy: q[1], r: 4.5 }, g);
      var anchor = cty[4] < 0 ? 'end' : 'start';
      var t = el('text', { x: q[0] + cty[4] * 14, y: q[1] + cty[5], 'text-anchor': anchor }, g);
      t.textContent = cty[0];
      cities[cty[0]] = g;
    });

    var fig = svg.closest('.map');
    new IntersectionObserver(function (es, obs) {
      if (es[0].isIntersecting) { fig.classList.add('in'); obs.disconnect(); }
    }, { threshold: 0.25 }).observe(fig);

    // the bird — wings, tail, a trail of light — flying her countries in the order she listed them,
    // gliding between beats, folding its wings to land, and naming where it came down
    var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    var landed = document.querySelector('[data-landed]');
    if (legs.length && !still && legs[0].path.getPointAtLength) {
      var trailG = el('g', { class: 'map__trail' });
      var TRAIL = 26, trail = [], dots = [];
      for (var ti = 0; ti < TRAIL; ti++) dots.push(el('circle', { r: 0, cx: -99, cy: -99 }, trailG));
      var bird = el('g', { class: 'map__bird' });
      var tilt = el('g', {}, bird);
      var farWing = el('path', { class: 'wing wing--far' }, tilt);
      el('path', { class: 'body', d: 'M-14,1 Q-6,-4 3,-3 Q7,-8 12,-6.5 Q15,-5.5 15.5,-3.8 L21,-2.6 L15,-1.4 Q13,2.4 6,3.4 Q-4,5 -14,1Z M-12,1 L-24,-5 L-20,1.5 L-24,7Z' }, tilt);
      var nearWing = el('path', { class: 'wing' }, tilt);
      var wing = function (f, s) {
        var ty = -1 - 24 * f * s, tx = -9 + 4 * Math.abs(f);
        return 'M-4,-1 Q' + (-3).toFixed(1) + ',' + (-1 - 15 * f * s).toFixed(1) + ' ' + tx.toFixed(1) + ',' + ty.toFixed(1) + ' Q' + (3).toFixed(1) + ',' + (-1 - 11 * f * s).toFixed(1) + ' 6,-1Z';
      };
      var seen = false, leg = 0, at = 0, rest = 0, lastT = 0, face = 1, bank = 0, flap = 0, glideFor = 0;
      new IntersectionObserver(function (es) { seen = es[0].isIntersecting; }).observe(fig);
      var say = function (L) {
        if (!landed) return;
        landed.classList.remove('is-on'); void landed.offsetWidth;
        landed.textContent = '';
        var b = document.createElement('b'); b.textContent = L.to;
        landed.appendChild(b);
        landed.appendChild(document.createTextNode(' — ' + ROLE[L.role].toLowerCase()));
        landed.classList.add('is-on');
      };
      var fly = function (now) {
        requestAnimationFrame(fly);
        var dt = Math.min(0.05, (now - lastT) / 1000); lastT = now;
        if (!seen || !fig.classList.contains('in')) return;
        var L = legs[leg], p, flying = rest <= 0;
        if (!flying) {
          rest -= dt;
          p = L.path.getPointAtLength(L.len);
          flap += dt * 2;
          var fold = -0.12 + 0.05 * Math.sin(flap * 2);
          nearWing.setAttribute('d', wing(fold, 0.55)); farWing.setAttribute('d', wing(fold, 0.4));
          bank += (-0.42 - bank) * Math.min(1, dt * 6);
          if (rest <= 0) { leg = (leg + 1) % legs.length; at = 0; }
        } else {
          var u = at / L.len, speed = 60 + 250 * Math.sin(Math.PI * Math.min(1, Math.max(0, u)));
          at = Math.min(L.len, at + speed * dt);
          p = L.path.getPointAtLength(at);
          var q = L.path.getPointAtLength(Math.min(L.len, at + 3));
          var dx = q.x - p.x, dy = q.y - p.y;
          if (Math.abs(dx) > 0.05) face += ((dx > 0 ? 1 : -1) - face) * Math.min(1, dt * 8);
          bank += (Math.max(-0.5, Math.min(0.5, Math.atan2(dy, Math.abs(dx) + 0.001) * 0.7)) - bank) * Math.min(1, dt * 5);
          if (glideFor > 0) glideFor -= dt;
          else if (u > 0.3 && u < 0.7 && Math.random() < dt * 0.9) glideFor = 0.5 + Math.random() * 0.5;
          flap += dt * (glideFor > 0 ? 0 : 7.5 + 4 * (1 - Math.sin(Math.PI * u)));
          var f = glideFor > 0 ? 0.18 : Math.sin(flap * 2.1);
          nearWing.setAttribute('d', wing(f, 1)); farWing.setAttribute('d', wing(f * 0.85 + 0.1, 0.72));
          if (at >= L.len) {
            rest = 1.6;
            var c = cities[L.to];
            if (c) { c.classList.add('is-hot'); setTimeout(function () { c.classList.remove('is-hot'); }, 1500); }
            say(L);
          }
        }
        var sc = 1.35 + 0.45 * Math.sin(Math.PI * Math.min(1, at / L.len));
        bird.setAttribute('transform', 'translate(' + p.x.toFixed(1) + ' ' + (p.y - (flying ? 0 : 9)).toFixed(1) + ') scale(' + (sc * face).toFixed(3) + ' ' + sc.toFixed(3) + ')');
        tilt.setAttribute('transform', 'rotate(' + (bank * 57.3).toFixed(1) + ')');
        trail.unshift([p.x, p.y]); if (trail.length > TRAIL) trail.pop();
        for (var i = 0; i < TRAIL; i++) {
          var tp = trail[i], d = dots[i];
          if (!tp || !flying) { d.setAttribute('r', Math.max(0, +d.getAttribute('r') - dt * 4).toFixed(2)); continue; }
          d.setAttribute('cx', tp[0].toFixed(1)); d.setAttribute('cy', tp[1].toFixed(1));
          d.setAttribute('r', (2.6 * (1 - i / TRAIL)).toFixed(2));
          d.setAttribute('opacity', (0.8 * (1 - i / TRAIL)).toFixed(2));
        }
      };
      setTimeout(function () { requestAnimationFrame(fly); }, 0);
    }
  }

  /* ── the log ─────────────────────────────────────────────────────── */
  var log = document.getElementById('log');
  if (log) {
    var byYear = {};
    EVENTS.forEach(function (e) { (byYear[e.date.slice(0, 4)] = byYear[e.date.slice(0, 4)] || []).push(e); });
    Object.keys(byYear).sort().reverse().forEach(function (y) {
      var sec = document.createElement('section'); sec.className = 'log__year';
      var list = byYear[y];
      sec.innerHTML = '<h3 class="log__y">' + y + '<small>' + list.length + ' offerings</small></h3><ul></ul>';
      var ul = sec.querySelector('ul');
      list.forEach(function (e) {
        var li = document.createElement('li'); li.className = 'ev'; li.dataset.place = e.place;
        var m = +e.date.slice(5, 7) - 1, day = +e.date.slice(8, 10);
        var p = PLACES[e.place];
        li.innerHTML =
          '<p class="ev__d">' + day + '<small>' + MONTHS[m] + '</small></p>' +
          '<div><p class="ev__t"></p><p class="ev__m"><span class="ev__k ev__k--' + e.kind + '">' + KIND[e.kind] + '</span></p></div>';
        li.querySelector('.ev__t').textContent = e.title;
        var meta = li.querySelector('.ev__m');
        meta.appendChild(document.createTextNode(e.venue + (p.country ? ', ' + p.country : '') + (e.time ? ' · ' + e.time : '')));
        ul.appendChild(li);
      });
      log.appendChild(sec);
    });

    // hovering an offering lights its place on the map
    log.addEventListener('pointerover', function (ev) {
      var li = ev.target.closest && ev.target.closest('.ev');
      document.querySelectorAll('.city.is-hot').forEach(function (c) { c.classList.remove('is-hot'); });
      if (li && cities) { var cc = PLACES[li.dataset.place] && PLACES[li.dataset.place].country; if (cities[cc]) cities[cc].classList.add('is-hot'); }
    });
    log.addEventListener('pointerleave', function () {
      document.querySelectorAll('.city.is-hot').forEach(function (c) { c.classList.remove('is-hot'); });
    });
  }
})();
