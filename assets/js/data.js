/* ══════════════════════════════════════════════════════════════════════
   THE DATA — one file Rawan (or whoever keeps the site) edits

   Everything the pages show comes from here: gatherings and retreats, the
   store, who handles which booking, and the organisations on the Action
   Options & Zakat page. Each page reads it and draws itself, so adding a
   retreat is adding an entry, not a page.

   Round 4 (2026-10-08): filled from Rawan's own emails. Approximate prices
   are marked `approx: true` and shown as "from"; she is confirming them with
   the atelier and the designer.
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var RR = window.RR = window.RR || {};

  RR.data = {
    config: {
      email: 'rawan.roshni@gmail.com',
      // her music management & booking agency (Palestinian): performance requests go here
      agency: { name: 'Aswatna Studio', contact: 'Nour', email: 'nour@aswatnastudio.com', url: '' },
      tz: 'Asia/Amman'
    },

    /* ── gatherings: concerts, workshops, circles, retreats ─────────────
       kind: retreat · concert · workshop · circle · launch
       status: open · few · waitlist · soon
       price: { cur, tiers:[{name, amount, note}] } — or `free: true` with an RSVP,
       or `apply: url` when places are by application */
    gatherings: [
      { slug: 'the-launch', kind: 'launch', feature: true,
        title: '11.11 — The Launch', start: '2026-11-11', time: 'Evening · details to come',
        place: 'Amman', country: 'Jordan', img: 'birdsong-oracle', status: 'soon', free: true,
        lede: 'One night: the release of “Dragonfly” and its music video, the documentary behind it, a new chapter with Aswatna — and the launch of this platform.',
        about: [
          'Join us as we gather for the release of Rawan Roshni’s latest single, “Dragonfly”, with its groundbreaking music video co-produced, shot and edited by Bermudafide — alongside the behind-the-scenes documentary of this incredible experience.',
          'We also come together to celebrate her signing with the Palestinian music management and booking agency Aswatna. And to top it all off, we will be in awe as she launches her epic new platform by ZYRN.',
          'The venue, the poster and the RSVP are on their way. Leave your name below and you will be the first to hear.'
        ],
        includes: ['The premiere of the “Dragonfly” music video', 'The behind-the-scenes documentary', 'A celebration with Aswatna', 'The launch of the platform'],
        days: [{ t: 'Doors', d: 'Time to be announced' }, { t: 'Dragonfly', d: 'The single, the video, the documentary' }, { t: 'The platform', d: 'Live, on the night' }] },

      { slug: 'the-path-of-love', kind: 'retreat', apply: 'https://docs.google.com/forms/d/1RNebW7YMxFMp2Ox_GzIZl76F1417ZrsGSRB4NNRmS0A/viewform',
        title: 'The Path of Love · درب الحب', start: '2026-12-01', end: '2026-12-08', time: '8 days · 7 nights',
        place: 'Aswan', country: 'Egypt', img: 'path-of-love', img2: 'aswan-nile', status: 'open',
        lede: 'Love is a sacred principle. Eight days on a private island on the Nile, for Arab participants ready to redefine love — in our relationships, our societies and our movements.',
        about: [
          'Our aim is to create a safe space for Arab participants to explore together how patriarchal systems have taken root within us.',
          'Together, we will seek ways to step beyond the constraints of these teachings and beliefs, and learn new ways of loving in all its depth. We will explore love as a sacred organising principle — from our personal relationships to our social systems and political movements.',
          'The programme takes place on a private island in Aswan, offering a unique, intimate setting on the banks of the Nile in Nubia, Upper Egypt. Spaces are limited; we invite you to spread this call.'
        ],
        includes: ['Facilitated by Sami Awad, A’ida Shibli and Rawan Roshni', 'A private island on the Nile, Nubia', 'Eight days · seven nights', 'The vision: from A’ida Shibli'],
        days: [{ t: 'Dec 1', d: 'Arrival on the island' }, { t: 'Dec 2 – 7', d: 'The path, day by day' }, { t: 'Dec 8', d: 'Closing, departure' }],
        vision: 'If you feel the call to redefine love, we invite you to join us on this Path of Love.' }
    ],

    /* ── the store ─────────────────────────────────────────────────────
       price: number, or null with `priceText`; `approx: true` shows "from";
       `cta` + `link` replace the bag for things that begin with a conversation */
    products: [
      { id: 'shamanic-bendir', cat: 'objects', title: 'The Shamanic Bendir', by: 'A Turkish frame drum, in fusion with the shamanic drum', kind: 'Object · made in Istanbul / Fethiye', price: 250, cur: 'USD', approx: true, ship: true, img: 'bendir-siwa',
        about: 'Much like the ally Rawan carries on her own journey. From the atelier she trusts in Istanbul and Fethiye, each drum has a unique sound and soul. Played like a daff or bendir with the hands and fingers, or held by its back and played with a stick in the shamanic tradition. Inflatable, so it can be tuned to any tone — and does not change with heat, dryness or damp.' },
      { id: 'whirling-skirt', cat: 'objects', title: 'Wonders of Whirling Skirts', by: 'Co-designed by Rawan Roshni & Ziya Kocaturk', kind: 'Object · made to order', price: 300, cur: 'USD', approx: true, ship: true, img: 'whirl-red-motion',
        about: 'Choose from the Islamic geometric patterns we have listed — or bring an image you desire; that is customisable too. Once printed, Ziya designs, cuts and shapes the skirt for beautiful movement in the whirling dance: waves of colour for any whirler at any stage, from beginner to advanced. An adjustable waist, so one size fits all, and a lighter fabric, so it lifts and spins without asking too much of you.' },
      { id: 'custom-chant', cat: 'recordings', title: 'A Meditation or Chant in Rawan’s Voice', by: 'Custom-made, for you', kind: 'Recording · by consultation', price: null, priceText: 'By consultation', cta: 'Book a consultation', link: 'voice-liberation.html#booking', img: 'birdsong-feathers',
        about: 'Clients have asked for — and ordered — these simple, soulful, repetitive meditations and chants for their retreats, their own clients, and their private practice at home. To sing with, to listen and relax, or for processes of release and transformation. Book a consultation call with Rawan to discuss and shape your order.' },
      { id: 'tuning-the-lataif', cat: 'courses', title: 'Tuning the Lata’if', by: 'An online course', kind: 'Course · pre-recorded · coming soon', price: null, priceText: 'Coming soon', cta: 'Pre-order', link: 'mailto:rawan.roshni@gmail.com?subject=Pre-order%3A%20Tuning%20the%20Lata%E2%80%99if', badge: 'Pre-order', img: 'tuyoor-candles',
        about: 'The pre-recorded course that explains the Sufi energy system of the Lata’if, and gives practical exercises for tuning them and working with them as centres for healing, transformation and spiritual growth.' }
    ],

    /* ── Action Options & Zakat — for Palestinians on the ground ───────── */
    actions: [
      { name: 'The Sameer Project', url: 'https://thesameerproject.org/', what: 'Direct aid on the ground in Gaza — from a grassroots team.' },
      { name: 'UCPiP — Unarmed Civilian Protection', url: 'https://www.ucpip.org/', what: 'Unarmed civilian protection in Palestine: presence, accompaniment, witness.' },
      { name: 'HEAL Palestine', url: 'https://www.healpalestine.org/', what: 'Health, education, aid and leadership for Palestinian children and families.' },
      { name: 'Palestine Children’s Relief Fund', url: 'https://www.pcrf.net/', what: 'Medical care for injured and sick children, in Palestine and abroad.' },
      { name: 'Dignity for Palestine', url: 'https://dignity4palestine.org', what: 'Support for Palestinians, with dignity at the centre.' },
      { name: 'We Are Not Numbers', url: 'https://wearenotnumbers.org', what: 'Young Palestinian writers telling the stories behind the numbers.' }
    ],

    courses: []
  };

  /* ── helpers the pages share ─────────────────────────────────────────── */
  var MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var MON3 = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function d(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  RR.fmt = {
    MON: MON, MON3: MON3, date: d,
    range: function (g) {
      var a = d(g.start), b = g.end ? d(g.end) : null;
      if (!b) return a.getDate() + ' ' + MON[a.getMonth()] + ' ' + a.getFullYear();
      if (a.getMonth() === b.getMonth()) return a.getDate() + '–' + b.getDate() + ' ' + MON[a.getMonth()] + ' ' + a.getFullYear();
      return a.getDate() + ' ' + MON3[a.getMonth()] + ' – ' + b.getDate() + ' ' + MON3[b.getMonth()] + ' ' + b.getFullYear();
    },
    money: function (n, cur) { return (cur === 'USD' ? '$' : cur === 'EUR' ? '€' : cur + ' ') + n; },
    KIND: { retreat: 'Retreat', concert: 'Concert', workshop: 'Workshop', circle: 'Circle', launch: 'Launch' },
    STATUS: { open: 'Places open', few: 'Few places left', waitlist: 'Waitlist', soon: 'Details soon' }
  };
  RR.upcoming = function () {
    var today = new Date(); today.setHours(0, 0, 0, 0);
    return RR.data.gatherings.filter(function (g) { return d(g.end || g.start) >= today; })
      .sort(function (a, b) { return a.start < b.start ? -1 : 1; });
  };
  // an .ics file built on the spot, so "add to calendar" needs no service
  RR.ics = function (g) {
    var s = g.start.replace(/-/g, ''), e = g.end ? g.end : g.start;
    var ed = d(e); ed.setDate(ed.getDate() + 1);
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    var eStr = ed.getFullYear() + pad(ed.getMonth() + 1) + pad(ed.getDate());
    var esc = function (t) { return String(t).replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n'); };
    var body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Rawan Roshni//Gatherings//EN', 'BEGIN:VEVENT',
      'UID:' + g.slug + '@rawanroshni', 'DTSTAMP:' + s + 'T000000Z', 'DTSTART;VALUE=DATE:' + s, 'DTEND;VALUE=DATE:' + eStr,
      'SUMMARY:' + esc(g.title), 'LOCATION:' + esc(g.place + (g.country ? ', ' + g.country : '')),
      'DESCRIPTION:' + esc(g.lede + (g.time ? '\n' + g.time : '')), 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([body], { type: 'text/calendar' }));
    a.download = g.slug + '.ics';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
  };
  RR.img = function (name, sizes) {
    if (name === 'logo-900') return '<img src="assets/img/logo-900.webp" alt="" loading="lazy" decoding="async" width="877" height="900">';
    return '<img src="assets/img/' + name + '.webp" srcset="assets/img/' + name + '-900.webp 900w, assets/img/' + name + '.webp 1600w" sizes="' + (sizes || '(max-width:900px) 92vw, 33vw') + '" alt="" loading="lazy" decoding="async">';
  };
})();
