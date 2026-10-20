/* ══════════════════════════════════════════════════════════════════════
   LANGUAGES — English and Arabic (Spanish to follow)

   The pages are written in English. In Arabic, every element whose
   English text matches an entry below is replaced by its Arabic, the page
   turns right-to-left, and the type changes to Aref Ruqaa (headings, the
   hand of her mark) and IBM Plex Sans Arabic (reading text).

   Keys are the element's own HTML, whitespace collapsed, exactly as the
   browser serialises it (so &rsquo; is written ’, an empty attribute is
   written data-x=""). Text with no entry simply stays in English, and an
   English line that is later edited stops matching rather than showing a
   wrong translation — so the Arabic can grow one line at a time.

   DRAFT: the Arabic is ZYRN's draft for Rawan to correct in her own words.
   Choosing a language is remembered; ?lang=ar or ?lang=en in a link sets it.
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var RR = window.RR = window.RR || {};
  var root = document.documentElement;
  var lang = root.lang === 'ar' ? 'ar' : 'en';      // set before paint by the inline script in <head>
  RR.lang = lang;

  var P = [
    /* ── the frame: nav, menu, footer ── */
    [`Skip to content`, `انتقل إلى المحتوى`],
    [`Calendar`, `التقويم`], [`Voice Liberation`, `تحرير الصوت`], [`Courses`, `الدورات`], [`Store`, `المتجر`],
    [`Sound`, `الصوت`], [`Book`, `احجز`],
    [`The journey`, `الرحلة`], [`Walk with her`, `رافقها`],
    [`<em>✦</em> Home <span lang="ar">روان</span>`, `<em>✦</em> الرئيسية <span lang="en">Home</span>`],
    [`<em>I</em> The Voice <span lang="ar">الصوت</span>`, `<em>I</em> الصوت <span lang="en">The Voice</span>`],
    [`<em>II</em> The Whirl <span lang="ar">الدوران</span>`, `<em>II</em> الدوران <span lang="en">The Whirl</span>`],
    [`<em>III</em> Resonance <span lang="ar">الرنين</span>`, `<em>III</em> الرنين <span lang="en">Resonance</span>`],
    [`<em>IV</em> The Circle <span lang="ar">الدائرة</span>`, `<em>IV</em> الدائرة <span lang="en">The Circle</span>`],
    [`<em>·</em> The Flight Path <span lang="ar">المسار</span>`, `<em>·</em> مسار الطيران <span lang="en">The Flight Path</span>`],
    [`<em>·</em> Her Story <span lang="ar">الحكاية</span>`, `<em>·</em> حكايتها <span lang="en">Her Story</span>`],
    [`<em>·</em> Calendar <span lang="ar">التقويم</span>`, `<em>·</em> التقويم <span lang="en">Calendar</span>`],
    [`<em>·</em> Voice Liberation <span lang="ar">تحرير الصوت</span>`, `<em>·</em> تحرير الصوت <span lang="en">Voice Liberation</span>`],
    [`<em>·</em> Courses <span lang="ar">الدورات</span>`, `<em>·</em> الدورات <span lang="en">Courses</span>`],
    [`<em>·</em> Store <span lang="ar">المتجر</span>`, `<em>·</em> المتجر <span lang="en">Store</span>`],
    [`<em>·</em> Book Rawan <span lang="ar">الدعوة</span>`, `<em>·</em> ادعُ روان <span lang="en">Book Rawan</span>`],
    [`© <span data-year="">2026</span> Rawan Roshni. All rights reserved.`, `© <span data-year="">2026</span> روان روشني. جميع الحقوق محفوظة.`],
    [`Designed by`, `تصميم`],
    [`Rawan Roshni`, `روان روشني`],

    /* ── threshold ── */
    [`Singer · Songwriter · Whirling dancer · Sound practitioner · Facilitator · Artivist`, `مغنّية · كاتبة أغانٍ · راقصة دوران · معالِجة بالصوت · مُيسِّرة · فنّانة ناشطة`],
    [`Rawan`, `روان`], [`Roshni`, `روشني`],
    [`Transcendental feminine voice.`, `صوتٌ أنثويٌّ متسامٍ.`],
    [`She who shakes off shackles.`, `هي التي تنفض عنها القيود.`],
    [`World citizen. Radical love, embodied.`, `مواطنةُ العالم. حبٌّ جذريٌّ متجسِّد.`],
    [`Shameless being.`, `كائنٌ بلا خجل.`],
    [`Truth seeker — and speaker.`, `باحثةٌ عن الحقيقة — وناطقةٌ بها.`],
    [`Listen`, `استمع`], [`Enter with sound`, `ادخل مع الصوت`], [`Sound is on`, `الصوت يعمل`],
    [`SINGER · SONGWRITER · WHIRLING DANCER · SOUND PRACTITIONER · FACILITATOR · ARTIVIST · STORYTELLER ·`,
     `مغنّية · كاتبة أغانٍ · راقصة دوران · معالِجة بالصوت · مُيسِّرة · فنّانة ناشطة · راوية · مغنّية · كاتبة أغانٍ · راقصة دوران ·`],
    [`Press &amp; hold`, `اضغط مطوّلاً`], [`Touch &amp; hold`, `المس مطوّلاً`], [`to set the flock free`, `لتُطلِق السِّرب`],

    /* ── she ── */
    [`Rawan Roshni is`, `روان روشني`],
    [`a <b>Palestinian / Balkan</b> woman living life to its fullest expression — a global citizen, co-creating the reality on this earth. She brings the gift of her voice as a <b>singer</b>, and as a <b>truth-speaker</b>, <b>storyteller</b> and <b>space holder</b>, to every circle she is part of.`,
     `امرأةٌ <b>فلسطينيّة / بلقانيّة</b> تعيش الحياة في أكمل تجلّياتها — مواطنةٌ عالميّة تشارك في خلق الواقع على هذه الأرض. تحمل هبةَ صوتها <b>مغنّيةً</b>، و<b>ناطقةً بالحقيقة</b> و<b>راويةً</b> و<b>حاضنةً للمساحة</b>، إلى كلّ دائرةٍ تكون جزءاً منها.`],
    [`<span>01</span>Singer-songwriter`, `<span>01</span>مغنّية وكاتبة أغانٍ`],
    [`<span>02</span>Performance artist`, `<span>02</span>فنّانة أداء`],
    [`<span>03</span>Whirling dance instructor`, `<span>03</span>مدرّبة رقص الدوران`],
    [`<span>04</span>Sound practitioner`, `<span>04</span>معالِجة بالصوت`],
    [`<span>05</span>Facilitator`, `<span>05</span>مُيسِّرة`],
    [`<span>06</span>Artivist`, `<span>06</span>فنّانة ناشطة`],

    /* ── I · the voice ── */
    [`The Voice <span lang="ar" class="ar">الصوت</span>`, `الصوت <span lang="en" class="ar">The Voice</span>`],
    [`Singing since childhood. On the stages of Amman since 2012. Covers across genres, then her own bilingual originals, and now a solo show of live-looping, music and poetry that has carried her across nine countries.`,
     `تغنّي منذ طفولتها، وعلى مسارح عمّان منذ عام 2012. بدأت بأداء أغانٍ من أنماطٍ شتّى، ثم أغانيها الأصليّة بلغتين، وصولاً إلى عرضٍ منفرد من الحلقات الصوتيّة الحيّة والموسيقى والشعر حملها إلى تسع دول.`],
    [`The current show · since November 2022`, `العرض الحالي · منذ تشرين الثاني 2022`],
    [`Al-Tuyoor<em>Messages from the Birds</em>`, `الطيور<em>رسائل من الطيور</em>`],
    [`Rawan takes on the character of the great bird, traversing the skies and landing to deliver messages to humanity — in a trilingual fusion of <b>English</b>, <b>Arabic</b> and <b>Animal</b>. A solo original music and poetry performance, built live from loops of her own voice.`,
     `تتقمّص روان شخصيّة الطائر العظيم، تجوب السماوات وتهبط لتحمل رسائلَ إلى البشريّة — بمزيجٍ من ثلاث لغات: <b>الإنجليزيّة</b> و<b>العربيّة</b> و<b>لغة الحيوان</b>. عرضٌ منفرد من موسيقاها وشعرها، يُبنى حيّاً من حلقاتٍ متكرّرة لصوتها.`],
    [`Form`, `الشكل`], [`Live-looping · music · poetry`, `حلقات صوتيّة حيّة · موسيقى · شعر`],
    [`Languages`, `اللغات`], [`English · Arabic · Animal`, `الإنجليزيّة · العربيّة · لغة الحيوان`],
    [`Landed in`, `حطّ في`],
    [`Bring Al-Tuyoor to your stage`, `استضِف «الطيور» على مسرحك`],
    [`Releases`, `الإصدارات`],
    [`Six originals and covers, and an album with SemaZen. Tap one to watch.`, `ستّة أعمالٍ أصليّة ومُعادة، وألبوم مع SemaZen. اختر واحداً لمشاهدته.`],
    [`Latest`, `الأحدث`], [`Single`, `أغنية منفردة`], [`Album`, `ألبوم`],
    [`Latest release · a translated cover of <i>Leve Palestina</i> by Kofia Band, with her grandmother Alia Risheq among the voices`,
     `أحدث إصدار · نسخةٌ مترجمة من <i>Leve Palestina</i> لفرقة كوفيّة، وجدّتها عالية رشق بين الأصوات`],
    [`The Path of Heart · Sufi-inspired world fusion with Max Mira, Rakan Jreisat (oud) and Amjad Al-Saifi (violin)`,
     `صراط العشق · موسيقى عالميّة مستوحاة من الصوفيّة، مع ماكس ميرا وراكان جريسات (عود) وأمجد الصيفي (كمان)`],
    [`July 2021 · bright summer pop with a North-African Gnawa pulse, with Moody Kablawi`, `تمّوز 2021 · بوب صيفيّ مشرق بنبضٍ كناوي من شمال أفريقيا، مع مودي كبلاوي`],
    [`April 2021 · an intimate indie-folk song that goes straight to the heart`, `نيسان 2021 · أغنية فولك مستقلّة حميمة تصل مباشرةً إلى القلب`],
    [`March 2020 · her first solo piece, experimental world fusion with the duo MFKZT, and a video art piece`, `آذار 2020 · أوّل أعمالها المنفردة، موسيقى عالميّة تجريبيّة مع ثنائي MFKZT، وعملٌ فنّي مصوّر`],
    [`An original single with Atef Malhas`, `أغنية أصليّة مع عاطف ملحس`],
    [`The album of SemaZen, the interactive spiritual music project she co-founded in 2014 · Allah Ya Mawlana, We Are Circling, The Four Elements, Glory Glory, Burn It All Away, Ho'oponopono`,
     `ألبوم SemaZen، مشروع الموسيقى الروحيّة التفاعليّة الذي شاركت في تأسيسه عام 2014 · Allah Ya Mawlana، We Are Circling، The Four Elements، Glory Glory، Burn It All Away، Ho'oponopono`],
    [`Listen on`, `استمع على`],

    /* ── II · the whirl ── */
    [`The Whirl <span lang="ar" class="ar">الدوران</span>`, `الدوران <span lang="en" class="ar">The Whirl</span>`],
    [`Rawan founded <b>Wonders of Whirling</b>, her own workshop series in contemporary whirling dance — taught so far in Jordan, Palestine, Egypt and Spain — and carries the turn onto festival stages as performance art.`,
     `أسّست روان <b>«عجائب الدوران»</b>، سلسلة ورشاتها في رقص الدوران المعاصر — درّستها حتى الآن في الأردن وفلسطين ومصر وإسبانيا — وتحمل الدوران إلى مسارح المهرجانات فنَّ أداء.`],
    [`Hold<br>to whirl`, `اضغط<br>لتدور`],
    [`Press and hold, or hold the space bar. The longer you turn, the wider the skirt opens.`, `اضغط مطوّلاً، أو أبقِ مفتاح المسافة مضغوطاً. كلّما طال دورانك، اتّسعت التنّورة.`],
    [`Contemporary whirling · performance`, `دوران معاصر · أداء`],
    [`Wonders of Whirling`, `عجائب الدوران`],
    [`An ancient turn, opened to every body.`, `دورانٌ قديم، مفتوحٌ لكلّ جسد.`],
    [`A workshop series she founded and teaches herself — and a performance she has carried onto the stages of events and festivals.`, `سلسلة ورشاتٍ أسّستها وتدرّسها بنفسها — وعرضٌ حملته إلى مسارح الفعاليّات والمهرجانات.`],
    [`Book a whirling workshop`, `احجز ورشة دوران`],
    [`Whirling on film`, `الدوران على الشاشة`],
    [`Self-choreographed · with Earlybird &amp; Tara Hakim`, `من تصميمها · مع Earlybird وتارا حكيم`],
    [`Self-choreographed · with Studio8, Pess Music &amp; Dragonfly Productions`, `من تصميمها · مع Studio8 وPess Music وDragonfly Productions`],
    [`Wonders of Whirling in Palestine`, `عجائب الدوران في فلسطين`],
    [`The workshop, in occupied Palestine`, `الورشة، في فلسطين المحتلّة`],
    [`A feature on her story as a whirling teacher (Arabic)`, `تقرير عن قصّتها مدرّبةً للدوران (بالعربيّة)`],

    /* ── III · resonance ── */
    [`Resonance <span lang="ar" class="ar">الرنين</span>`, `الرنين <span lang="en" class="ar">Resonance</span>`],
    [`Sound is present in all of Rawan's facilitation. In her <b>SoundWork</b> sessions it becomes the main language — an invitation to engage your own voice, to open blockages, bring balance, transform emotion and discover new parts of yourself inside the collective frequency of harmony.`,
     `الصوت حاضرٌ في كلّ ما تيسّره روان. وفي جلسات <b>SoundWork</b> يصبح اللغةَ الأساسيّة — دعوةً لإشراك صوتك أنت، لفتح الانسدادات، واستعادة التوازن، وتحويل المشاعر، واكتشاف أجزاءٍ جديدة من ذاتك داخل التردّد الجماعيّ للتناغم.`],
    [`listening for a tone`, `في انتظار نغمة`],
    [`Try it · The Cymatics Lab`, `جرّب · مختبر السيماتكس`],
    [`Sound has a shape.`, `للصوت شكل.`],
    [`Every tone draws its own figure in the sand. Choose a maqam and play its notes, let it walk up and down by itself, or <b>hum into your microphone</b> — and watch the grains find the still lines.`,
     `لكلّ نغمةٍ شكلٌ ترسمه في الرمل. اختر مقاماً واعزف نغماته، أو دعه يصعد ويهبط وحده، أو <b>دندن في الميكروفون</b> — وشاهد الحبيبات تجد خطوطها الساكنة.`],
    [`Play the maqam`, `اعزف المقام`], [`Stop`, `إيقاف`], [`Hum with your voice`, `دندن بصوتك`],
    [`Listening — hum a long note`, `أستمع — دندن نغمةً طويلة`], [`hum a long note`, `دندن نغمةً طويلة`],
    [`Tuned to A = 432 Hz, like the garden you hear when sound is on. Your voice is analysed on this device only — nothing is recorded or sent anywhere.`,
     `مضبوطٌ على 432 هرتز، مثل الحديقة التي تسمعها حين يعمل الصوت. يُحلَّل صوتك على هذا الجهاز فقط — لا يُسجَّل شيء ولا يُرسَل إلى أيّ مكان.`],
    [`The mother of the maqamat — upright, grounded, whole.`, `أمّ المقامات — شامخٌ، راسخٌ، مكتمل.`],
    [`Tender and romantic, with a gentle ache.`, `رقيقٌ وعاطفيّ، فيه وجعٌ ناعم.`],
    [`Bright and open — a morning, a celebration.`, `مشرقٌ ومنفتح — صباحٌ واحتفال.`],
    [`Longing — the heart that has not yet arrived.`, `الحنين — قلبٌ لم يصل بعد.`],
    [`The desert and the far horizon; the pilgrim road.`, `الصحراء والأفق البعيد؛ طريق الحجيج.`],
    [`Earthy and warm — the voice of the people.`, `ترابيٌّ ودافئ — صوت الناس.`],
    [`Plain-spoken and intimate; a lament sung close.`, `صريحٌ وحميم؛ شجنٌ يُغنّى عن قرب.`],
    [`In circle`, `في دائرة`],
    [`Group sound-healing journeys, often alongside other sound healers and musicians, where every voice in the room becomes part of the instrument.`, `رحلاتُ شفاءٍ جماعيّة بالصوت، غالباً إلى جانب معالجين بالصوت وموسيقيّين آخرين، حيث يصبح كلّ صوتٍ في الغرفة جزءاً من الآلة.`],
    [`One-on-one`, `فرديّاً`],
    [`Private sessions where Rawan uses her own voice together with yours to spread healing vibrations.`, `جلساتٌ خاصّة تستخدم فيها روان صوتها مع صوتك لنشر ذبذبات الشفاء.`],
    [`Ask about a SoundWork session`, `اسأل عن جلسة SoundWork`],

    /* ── IV · the circle ── */
    [`The Circle <span lang="ar" class="ar">الدائرة</span>`, `الدائرة <span lang="en" class="ar">The Circle</span>`],
    [`More than a decade of holding space — with groups from teenagers to adults, in refugee camps and corporate offices, and on the teams that pioneered alternative gatherings across the Middle East, among them <b>Manna Gathering</b> and <b>Mystic Earth</b>.`,
     `أكثر من عقدٍ من احتضان المساحات — مع مجموعاتٍ من المراهقين إلى البالغين، في مخيّمات اللاجئين وفي المكاتب، وضمن الفِرق التي كانت رائدةً في التجمّعات البديلة في الشرق الأوسط، ومنها <b>Manna Gathering</b> و<b>Mystic Earth</b>.`],
    [`COMMUNITY BUILDING ✦ COLLECTIVE HEALING ✦ CONFLICT TRANSFORMATION ✦ CONSCIOUS SEXUALITY ✦ COMPASSIONATE COMMUNICATION ✦ EMPOWERED ENGAGEMENT ✦ ARTIVISM ✦`,
     `بناء المجتمع ✦ الشفاء الجماعي ✦ تحويل النزاعات ✦ الجنسانيّة الواعية ✦ التواصل الرحيم ✦ الانخراط المُمكِّن ✦ الفنّ الناشط ✦`],
    [`Community building`, `بناء المجتمع`], [`Collective healing`, `الشفاء الجماعيّ`], [`Conflict transformation`, `تحويل النزاعات`],
    [`Conscious sexuality`, `الجنسانيّة الواعية`], [`Compassionate communication`, `التواصل الرحيم`],
    [`Empowered engagement`, `الانخراط المُمكِّن`], [`Artivism`, `الفنّ الناشط`],
    [`Circles she has held`, `دوائر احتضنتها`],
    [`Conscious Sexuality &amp; The Wheel of Consent`, `الجنسانيّة الواعية وعجلة الموافقة`],
    [`Women's Circle: Authentic Relating, Desires, Boundaries &amp; Consent`, `دائرة نساء: التواصل الأصيل، الرغبات، الحدود والموافقة`],
    [`Grief Circle &amp; Collective Grief Ritual`, `دائرة الحزن وطقس الحزن الجماعيّ`],
    [`Conscious Communication: Community Tools`, `التواصل الواعي: أدوات مجتمعيّة`],
    [`Desert circle`, `دائرة في الصحراء`], [`The huddle`, `العناق الجماعيّ`], [`Singing with children`, `الغناء مع الأطفال`],
    [`Community workshop`, `ورشة مجتمعيّة`], [`Walking together`, `نمشي معاً`], [`Sound circle`, `دائرة صوت`],
    [`Drag to turn the circle`, `اسحب لتدير الدائرة`],

    /* ── the flight path ── */
    [`The Flight Path <span lang="ar" class="ar">المسار</span>`, `مسار الطيران <span lang="en" class="ar">The Flight Path</span>`],
    [`Where the bird has landed — concerts, workshops, circles and rituals,`, `حيث حطّ الطائر — حفلاتٌ وورشاتٌ ودوائر وطقوس،`],
    [`Each light is a place she has landed; the bird flies them in the order she did.<span class="map__swipe"> Swipe to travel.</span>`,
     `كلّ ضوءٍ مكانٌ حطّت فيه؛ ويطير الطائر بينها بالترتيب الذي سافرت به.<span class="map__swipe"> اسحب للتنقّل.</span>`],
    [`Next landings`, `المحطّات القادمة`], [`Where the bird flies next.`, `إلى أين يطير الطائر بعد ذلك.`], [`The full calendar`, `التقويم كاملاً`],

    /* ── her story ── */
    [`Her Story <span lang="ar" class="ar">الحكاية</span>`, `حكايتها <span lang="en" class="ar">Her Story</span>`],
    [`Kuwait`, `الكويت`], [`Amman`, `عمّان`], [`London, Ontario`, `لندن، أونتاريو`], [`Toronto`, `تورونتو`], [`Indonesia`, `إندونيسيا`],
    [`Palestine`, `فلسطين`], [`Jordan`, `الأردن`], [`Toronto, again`, `تورونتو، من جديد`], [`India`, `الهند`], [`Everywhere since`, `وفي كلّ مكانٍ منذ ذلك الحين`],
    [`Born to Palestinian diaspora parents.`, `وُلدت لأبوين فلسطينيّين في الشتات.`],
    [`At three, her family took refuge in Jordan during the Gulf War. Nine years of childhood here.`, `في الثالثة من عمرها لجأت عائلتها إلى الأردن خلال حرب الخليج. تسع سنواتٍ من الطفولة هنا.`],
    [`At twelve, to Canada — middle school and high school.`, `في الثانية عشرة، إلى كندا — المرحلتان الإعداديّة والثانويّة.`],
    [`A BA at the University of Toronto, double major in Political Science and Near &amp; Middle Eastern Civilizations.`, `بكالوريوس من جامعة تورونتو، بتخصّصٍ مزدوج في العلوم السياسيّة وحضارات الشرق الأدنى والأوسط.`],
    [`The first journey out into the world — and the bubble bursts.`, `الرحلة الأولى إلى العالم — وتنفجر الفقاعة.`],
    [`Her ancestral homeland, visited for the first time.`, `وطن أجدادها، تزوره للمرّة الأولى.`],
    [`A year as Communications Coordinator with Madrasati — and the knowledge that she could not be kept behind a desk.`, `عامٌ منسّقةً للاتصال مع «مدرستي» — ويقينٌ بأنّها لا يمكن أن تبقى خلف مكتب.`],
    [`Facilitation training with the Institute of Cultural Affairs.`, `تدريبٌ على التيسير مع معهد الشؤون الثقافيّة.`],
    [`Exploring the outer and inner realms in parallel.`, `استكشاف العوالم الخارجيّة والداخليّة معاً.`],
    [`Based in Jordan, flying to Nepal, Egypt, Spain, Turkey, Morocco, Syria, Lebanon and beyond — photography, music, facilitation, festival organising, community catalysing, movement and sound healing. Co-founder of <b>SemaZen</b>, and most recently of the <b>Qamarjan</b> World Music Project.`,
     `مقيمةً في الأردن، ومحلّقةً إلى نيبال ومصر وإسبانيا وتركيا والمغرب وسوريا ولبنان وأبعد — تصويرٌ، وموسيقى، وتيسير، وتنظيم مهرجانات، وتحفيز مجتمعات، وورشاتُ حركةٍ وشفاءٍ بالصوت. شريكةٌ مؤسِّسة لـ<b>SemaZen</b>، ومؤخّراً لمشروع <b>Qamarjan</b> للموسيقى العالميّة.`],

    /* ── walk with her ── */
    [`Walk with her <span lang="ar" class="ar">رافقها</span>`, `رافقها <span lang="en" class="ar">Walk with her</span>`],
    [`Four ways in: sit in a circle with her, work with her one-on-one, learn with her from home, or take something of hers back to your own space.`, `أربعة مداخل: أن تجلس معها في دائرة، أو تعمل معها فرديّاً، أو تتعلّم معها من بيتك، أو تأخذ شيئاً منها إلى مساحتك.`],
    [`Calendar <span lang="ar">التقويم</span>`, `التقويم <span lang="en">Calendar</span>`],
    [`Voice Liberation <span lang="ar">تحرير الصوت</span>`, `تحرير الصوت <span lang="en">Voice Liberation</span>`],
    [`Courses <span lang="ar">الدورات</span>`, `الدورات <span lang="en">Courses</span>`],
    [`Store <span lang="ar">المتجر</span>`, `المتجر <span lang="en">Store</span>`],
    [`Concerts, circles, workshops and retreats — and a page for each, to reserve your place.`, `حفلاتٌ ودوائر وورشاتٌ وخلوات — ولكلٍّ منها صفحةٌ لحجز مكانك.`],
    [`The one-on-one program: a consultation first, then the seven-session journey.`, `البرنامج الفرديّ: استشارةٌ أوّلاً، ثم رحلةٌ من سبع جلسات.`],
    [`Online courses — beginning with <i>Tuning the Lata’if</i>, now in development.`, `دوراتٌ عبر الإنترنت — تبدأ بـ<i>ضبط اللطائف</i>، قيد الإعداد الآن.`],
    [`Music, recorded sound journeys, gifts, and objects made for the turn.`, `موسيقى، ورحلاتٌ صوتيّة مسجّلة، وهدايا، وأغراضٌ صُنعت للدوران.`],

    /* ── word ── */
    [`Rawan is a <em>powerhouse</em>. <em>Deep</em> in her voice and sound, <em>powerful</em> in her impact, and <em>enchanting</em> in the way she brings together the ancient and the new. She is an incredible musician and one of the best space-holders I have met. Whoever gets to receive her medicine is extremely fortunate.`,
     `روان <em>طاقةٌ هائلة</em>. <em>عميقةٌ</em> في صوتها، <em>قويّةٌ</em> في أثرها، و<em>ساحرةٌ</em> في الطريقة التي تجمع بها القديم والجديد. موسيقيّةٌ مذهلة، ومن أفضل من عرفتُ في احتضان المساحات. محظوظٌ جدّاً من يتلقّى دواءها.`],
    [`— Madiha Bee`, `— مديحة بي`],

    /* ── work with Rawan ── */
    [`<span data-i18n="work.title">Work with Rawan</span> <span lang="ar" class="ar">الدعوة</span>`, `اعمل مع روان <span lang="en" class="ar">Work with Rawan</span>`],
    [`Three ways in. Choose the one that fits — the rest takes a minute.`, `ثلاثة مداخل. اختر ما يناسبك — والباقي يستغرق دقيقة.`],
    [`Concerts &amp; performance`, `الحفلات والعروض`],
    [`Concerts, Al-Tuyoor, festival stages and performance art — booked through <b>Aswatna</b>, her booking agency.`, `الحفلات، و«الطيور»، ومسارح المهرجانات وفنّ الأداء — تُحجَز عبر <b>أصواتنا</b>، وكالة الحجز التي تمثّلها.`],
    [`Book a performance`, `احجز عرضاً`],
    [`Workshops &amp; programmes`, `الورشات والبرامج`],
    [`For festivals, retreats, organisations and communities — Rawan designs the programme, holds it, or both.`, `للمهرجانات والخلوات والمؤسّسات والمجتمعات — تصمّم روان البرنامج، أو تيسّره، أو الاثنين معاً.`],
    [`Invite Rawan`, `ادعُ روان`],
    [`The one-on-one program: begin with a consultation, then continue into the seven-session journey.`, `البرنامج الفرديّ: ابدأ باستشارة، ثم تابع في رحلةٍ من سبع جلسات.`],
    [`Book a consultation`, `احجز استشارة`],
    [`To`, `إلى`], [`Aswatna`, `أصواتنا`],
    [`What would you like to book?`, `ماذا تودّ أن تحجز؟`],
    [`Concert`, `حفلة`], [`Al-Tuyoor`, `الطيور`], [`Whirling performance`, `عرض دوران`], [`Sound journey`, `رحلة صوتيّة`],
    [`Your name`, `اسمك`], [`Where &amp; when`, `أين ومتى`], [`A few words about it`, `كلماتٌ قليلة عنه`],
    [`City, venue, dates`, `المدينة، المكان، التواريخ`], [`The occasion, the stage, the audience`, `المناسبة، المسرح، الجمهور`], [`How many, and who`, `كم عددهم، ومن هم`],
    [`Send to Aswatna`, `أرسل إلى أصواتنا`],
    [`Opens in your email app, with the message written.`, `يفتح تطبيق بريدك، والرسالة مكتوبة.`],
    [`Until Aswatna’s address is added, this opens in your email app addressed to Rawan, who passes it on.`, `إلى أن يُضاف عنوان «أصواتنا»، يفتح هذا تطبيق بريدك موجّهاً إلى روان، وهي توصله.`],
    [`Rawan would…`, `تريد من روان أن…`],
    [`Design the programme`, `تصمّم البرنامج`], [`Hold &amp; deliver it`, `تيسّره وتقدّمه`], [`Both`, `الاثنين معاً`],
    [`Workshops &amp; circles she brings`, `ورشاتٌ ودوائر تقدّمها`],
    [`Women’s &amp; grief circles`, `دوائر النساء والحزن`], [`Something custom-made`, `شيءٌ مصمَّم خصّيصاً`],
    [`Organisation or community`, `المؤسّسة أو المجتمع`], [`The group`, `المجموعة`],
    [`Write the invitation`, `اكتب الدعوة`],
    [`Or write to her directly`, `أو راسلها مباشرة`], [`Copy`, `نسخ`], [`Copied`, `نُسخ`],

    /* ── the pages: shared ── */
    [`Draft`, `مسودّة`], [`Sample`, `نموذج`], [`Sample prices`, `أسعارٌ نموذجيّة`],
    [`Places open`, `الأماكن متاحة`], [`Few places left`, `أماكن قليلة متبقّية`], [`Waitlist`, `قائمة انتظار`], [`Booking soon`, `الحجز قريباً`],
    [`Retreat`, `خلوة`], [`Workshop`, `ورشة`], [`Circle`, `دائرة`], [`Online`, `عبر الإنترنت`],
    [`+ Add to calendar`, `+ أضِف إلى التقويم`], [`Details &amp; reserve`, `التفاصيل والحجز`],

    /* calendar */
    [`Gatherings &amp; retreats`, `تجمّعاتٌ وخلوات`],
    [`The <em>calendar</em> <span lang="ar" class="ar">التقويم</span>`, `التقويم <span lang="en" class="ar">The calendar</span>`],
    [`Where to sit in circle with her next — concerts, workshops, circles and retreats, each with its own page to reserve your place.`, `أين تجلس معها في الدائرة القادمة — حفلاتٌ وورشاتٌ ودوائر وخلوات، لكلٍّ منها صفحتها لحجز مكانك.`],
    [`See what is coming`, `ما القادم`], [`Host a gathering`, `استضِف تجمّعاً`],
    [`Hold a gathering with her`, `نظّم تجمّعاً معها`], [`Want Rawan to come to you?`, `تريد أن تأتي روان إليك؟`],
    [`Festivals, retreat centres, organisations and communities can invite her to design or hold a programme.`, `يمكن للمهرجانات ومراكز الخلوات والمؤسّسات والمجتمعات دعوتها لتصميم برنامجٍ أو تيسيره.`],
    [`Never miss a landing`, `لا تفوّت أيّ محطّة`], [`Hear about new dates first.`, `اعرف المواعيد الجديدة أوّلاً.`],
    [`Every gathering on this page can be added to your own calendar in one tap. For news of new ones, write and ask to be on the list.`, `يمكن إضافة كلّ تجمّعٍ في هذه الصفحة إلى تقويمك بلمسة واحدة. ولأخبار الجديد منها، راسلنا واطلب الانضمام إلى القائمة.`],
    [`Join the list`, `انضمّ إلى القائمة`],

    /* event */
    [`The calendar`, `التقويم`], [`When`, `متى`], [`Time`, `الوقت`], [`Where`, `أين`],
    [`Reserve your place`, `احجز مكانك`], [`The invitation`, `الدعوة`], [`What is held`, `ما تتضمّنه`], [`The days`, `الأيّام`],
    [`Your place`, `مكانك`], [`Places`, `عدد الأماكن`], [`Email`, `البريد الإلكتروني`], [`Anything she should know`, `أيّ شيءٍ ينبغي أن تعرفه`],
    [`Reserve my place`, `احجز مكاني`], [`Also coming`, `وقريباً أيضاً`], [`Reserve`, `احجز`],
    [`Join the waitlist`, `انضمّ إلى قائمة الانتظار`],

    /* voice liberation */
    [`The one-on-one program`, `البرنامج الفرديّ`],
    [`Voice <em>Liberation</em> <span lang="ar" class="ar">تحرير الصوت</span>`, `تحرير الصوت <span lang="en" class="ar">Voice Liberation</span>`],
    [`One-on-one with Rawan, for the voice that has been waiting to be let out: a consultation first, then a seven-session journey — online, or in person in Amman.`, `مع روان وجهاً لوجه، للصوت الذي ينتظر أن يتحرّر: استشارةٌ أوّلاً، ثم رحلةٌ من سبع جلسات — عبر الإنترنت، أو حضوريّاً في عمّان.`],
    [`How it works`, `كيف تعمل`],
    [`She who shakes off shackles <em>offers you the same.</em>`, `التي نفضت عنها القيود <em>تقدّم لك الشيء نفسه.</em>`],
    [`The voice is where we were first silenced — and where we come back to life.`, `في الصوت أُسكِتنا أوّل مرّة — وفيه نعود إلى الحياة.`],
    [`It may be for you if`, `قد يكون لك إن`],
    [`you have been told, or decided, that you cannot sing`, `قيل لك، أو قرّرت، أنّك لا تستطيع الغناء`],
    [`your voice tightens when it matters most`, `ينقبض صوتك حين يكون الأمر أهمّ ما يكون`],
    [`you speak for a living and want to speak from deeper`, `تعمل بالكلام وتريد أن تتكلّم من مكانٍ أعمق`],
    [`you sing, and want to find the sound that is only yours`, `تغنّي، وتريد أن تجد الصوت الذي هو لك وحدك`],
    [`something wants to be said, and has not been`, `ثمّة ما يريد أن يُقال، ولم يُقَل بعد`],
    [`The journey <span lang="ar" class="ar">الرحلة</span>`, `الرحلة <span lang="en" class="ar">The journey</span>`],
    [`Seven sessions, through four movements`, `سبع جلسات، عبر أربع حركات`],
    [`One`, `الأولى`], [`Two`, `الثانية`], [`Three`, `الثالثة`], [`Four`, `الرابعة`],
    [`Listening`, `الإصغاء`], [`Loosening`, `الإرخاء`], [`Liberating`, `التحرير`], [`Living`, `العيش`],
    [`Begin`, `ابدأ`], [`In`, `شهيق`], [`Hold`, `أمسِك`], [`Out`, `زفير`], [`Thank you`, `شكراً`],
    [`Before anything else`, `قبل أيّ شيء`], [`Take three breaths with her.`, `خُذ معها ثلاثة أنفاس.`],
    [`Touch to begin`, `المس لتبدأ`],
    [`Ways to work together`, `طرق العمل معاً`],
    [`Step one`, `الخطوة الأولى`], [`A consultation`, `استشارة`], [`45 min · online or Amman`, `45 دقيقة · عبر الإنترنت أو في عمّان`],
    [`Step two`, `الخطوة الثانية`], [`The Voice Liberation journey`, `رحلة تحرير الصوت`],
    [`7 sessions`, `7 جلسات`], [`Fee shared in your consultation`, `تُذكر الرسوم في الاستشارة`],
    [`Book a time`, `احجز موعداً`], [`With Rawan, one-on-one.`, `مع روان، وجهاً لوجه.`],
    [`The consultation <span></span>`, `الاستشارة <span></span>`], [`The day <span></span>`, `اليوم <span></span>`],
    [`The time <span></span>`, `الوقت <span></span>`], [`Your details <span></span>`, `بياناتك <span></span>`],
    [`Choose a day`, `اختر يوماً`], [`Back`, `رجوع`], [`Your details`, `بياناتك`], [`In Amman`, `في عمّان`],
    [`What brings you to your voice?`, `ما الذي يأتي بك إلى صوتك؟`], [`As much or as little as you like`, `بقدر ما تشاء`],
    [`Request this time`, `اطلب هذا الموعد`], [`Your request is written.`, `طلبك مكتوب.`],
    [`Questions`, `أسئلة`],
    [`Can I book a single session?`, `هل يمكنني حجز جلسةٍ واحدة؟`], [`Do I need to be able to sing?`, `هل يجب أن أجيد الغناء؟`],
    [`Online or in person?`, `عبر الإنترنت أم حضوريّاً؟`], [`Is this therapy?`, `هل هذا علاجٌ نفسيّ؟`], [`Can I give it as a gift?`, `هل يمكنني تقديمه هديّة؟`],

    /* courses */
    [`Learn with her, from home`, `تعلّم معها، من بيتك`],
    [`Online <em>courses</em> <span lang="ar" class="ar">الدورات</span>`, `الدورات <span lang="en" class="ar">Online courses</span>`],
    [`Her practices of voice, breath and the turn, held over weeks rather than an afternoon — beginning with one now being made.`, `ممارساتها في الصوت والنَّفَس والدوران، على امتداد أسابيع لا عصرٍ واحد — تبدأ بدورةٍ قيد الإعداد الآن.`],
    [`Tuning the Lata’if`, `ضبط اللطائف`], [`Be the first to know`, `كن أوّل من يعرف`], [`In development`, `قيد الإعداد`],
    [`Tuning the <em>Lata’if</em>`, `ضبط <em>اللطائف</em>`],
    [`The subtle centres of the heart, tuned with the voice.`, `مراكز القلب اللطيفة، مضبوطةً بالصوت.`],
    [`Touch a centre`, `المس مركزاً`], [`The shape of it`, `شكلها`], [`Draft outline`, `مخطّطٌ أوّليّ`],
    [`When it opens`, `حين تفتح`], [`Be the first to know.`, `كن أوّل من يعرف.`], [`Your email`, `بريدك الإلكتروني`], [`Tell me`, `أخبرني`],
    [`Seeds for later`, `بذورٌ لما بعد`], [`Ideas, not yet decided`, `أفكارٌ لم تُقرَّر بعد`], [`An idea`, `فكرة`],

    /* store */
    [`Take something home`, `خُذ شيئاً إلى بيتك`],
    [`The <em>store</em> <span lang="ar" class="ar">المتجر</span>`, `المتجر <span lang="en" class="ar">The store</span>`],
    [`Music, recorded sound journeys, gifts for someone you love, and objects made for the turn.`, `موسيقى، ورحلاتٌ صوتيّة مسجّلة، وهدايا لمن تحبّ، وأغراضٌ صُنعت للدوران.`],
    [`Browse`, `تصفّح`], [`Digital items arrive by email. Objects ship from Amman.`, `تصل المنتجات الرقميّة بالبريد الإلكتروني. وتُشحن الأغراض من عمّان.`],
    [`Your bag`, `حقيبتك`], [`Total`, `المجموع`], [`Checkout`, `الدفع`], [`Add to bag`, `أضِف إلى الحقيبة`], [`In your bag`, `في حقيبتك`],
    [`Music`, `موسيقى`], [`Recording`, `تسجيل`], [`Gift`, `هديّة`], [`Object`, `غرض`],
    /* ── round 4: Aswatna, the launch, the Path of Love, the store, the Action page ── */
    [`Action &amp; Zakat`, `الفعل والزكاة`],
    [`<em>·</em> Action Options &amp; Zakat <span lang="ar">للفلسطينيّين</span>`, `<em>·</em> خيارات الفعل والزكاة <span lang="en">Action &amp; Zakat</span>`],
    [`Action &amp; Zakat <span lang="ar">للفلسطينيّين</span>`, `الفعل والزكاة <span lang="en">Action &amp; Zakat</span>`],
    [`For Palestinians on the ground: organisations to give to, volunteer with, and share.`, `لفلسطينيّي الأرض: منظّماتٌ تتبرّع لها، وتتطوّع معها، وتشاركها.`],
    [`Four ways in: sit in a circle with her, work with her one-on-one, act for Palestine, or take something of hers back to your own space.`, `أربعة مداخل: أن تجلس معها في دائرة، أو تعمل معها فرديّاً، أو تفعل من أجل فلسطين، أو تأخذ شيئاً منها إلى مساحتك.`],
    [`For Palestinians on the ground`, `لفلسطينيّي الأرض`],
    [`Action options <em>&amp; zakat</em> <span lang="ar" class="ar">خيارات الفعل والزكاة</span>`, `خيارات الفعل <em>والزكاة</em> <span lang="en" class="ar">Action options &amp; zakat</span>`],
    [`Organisations Rawan trusts, doing the work on the ground — to donate to, to volunteer with, and to share. Zakat welcome.`, `منظّماتٌ تثق بها روان، تعمل على الأرض — لتتبرّع لها، وتتطوّع معها، وتشاركها. والزكاة مرحّبٌ بها.`],
    [`See the organisations`, `اطّلع على المنظّمات`],
    [`Where to act <span lang="ar" class="ar">أين تفعل</span>`, `أين تفعل <span lang="en" class="ar">Where to act</span>`],
    [`Each link opens the organisation’s own site, where you give or sign up directly. Nothing passes through this page.`, `يفتح كلّ رابط موقع المنظّمة نفسها، حيث تتبرّع أو تسجّل مباشرة. لا يمرّ شيءٌ عبر هذه الصفحة.`],
    [`Zakat`, `الزكاة`], [`If you give zakat, give it here.`, `إن كنت تُخرج الزكاة، فأخرجها هنا.`],
    [`Several of these organisations accept zakat and say so on their own pages. Choose the one whose work you want to carry, and give directly — the whole amount reaches them.`, `تقبل عدّة من هذه المنظّمات الزكاة وتذكر ذلك في صفحاتها. اختر التي تريد أن تحمل عملها، وتبرّع مباشرة — فيصلها المبلغ كاملاً.`],
    [`Direct aid on the ground in Gaza — from a grassroots team.`, `مساعداتٌ مباشرة على الأرض في غزّة — من فريقٍ شعبيّ.`],
    [`Unarmed civilian protection in Palestine: presence, accompanyment, witness.`, `حمايةٌ مدنيّة غير مسلّحة في فلسطين: حضورٌ ومرافقةٌ وشهادة.`],
    [`Unarmed civilian protection in Palestine: presence, accompaniment, witness.`, `حمايةٌ مدنيّة غير مسلّحة في فلسطين: حضورٌ ومرافقةٌ وشهادة.`],
    [`Health, education, aid and leadership for Palestinian children and families.`, `صحّةٌ وتعليمٌ ومساعداتٌ وقيادة لأطفال فلسطين وعائلاتهم.`],
    [`Medical care for injured and sick children, in Palestine and abroad.`, `رعايةٌ طبّية للأطفال الجرحى والمرضى، في فلسطين وخارجها.`],
    [`Support for Palestinians, with dignity at the centre.`, `دعمٌ للفلسطينيّين، والكرامة في القلب.`],
    [`Young Palestinian writers telling the stories behind the numbers.`, `كتّابٌ فلسطينيّون شباب يروون الحكايات خلف الأرقام.`],
    [`Launch`, `إطلاق`], [`Details soon`, `التفاصيل قريباً`], [`RSVP`, `أكّد حضورك`], [`Save your place`, `احفظ مكانك`],
    [`Apply for your place`, `قدّم طلبك`], [`Apply now`, `قدّم الآن`], [`Apply`, `قدّم`],
    [`Places are by application. The form opens in a new tab.`, `الأماكن بالتقديم. يفتح النموذج في نافذة جديدة.`],
    [`The next retreat`, `الخلوة القادمة`], [`Details &amp; reserve`, `التفاصيل والحجز`],
    [`Born in Kuwait. Raised between Jordan and Canada. Travelled and worked in 13 countries more — 16 in all.`, `وُلدت في الكويت. نشأت بين الأردن وكندا. سافرت وعملت في 13 دولةً أخرى — 16 في المجموع.`],
    [`Born here`, `وُلدت هنا`], [`Lived here`, `عاشت هنا`], [`Travelled &amp; worked`, `سافرت وعملت`],
    [`Where the bird has landed — concerts, workshops, circles and rituals,`, `حيث حطّ الطائر — حفلاتٌ وورشاتٌ ودوائر وطقوس،`],
    /* the store, round 4 */
    [`Objects`, `أغراض`], [`Recordings`, `تسجيلات`], [`Courses`, `دورات`], [`Course`, `دورة`],
    [`Add to bag`, `أضِف إلى الحقيبة`], [`On request`, `حسب الطلب`], [`By consultation`, `بالاستشارة`], [`Coming soon`, `قريباً`], [`Pre-order`, `اطلب مسبقاً`],
    [`Book a consultation`, `احجز استشارة`], [`+ shipping`, `+ الشحن`],
    [`The Shamanic Bendir`, `البندير الشامانيّ`], [`A Turkish frame drum, in fusion with the shamanic drum`, `دفٌّ تركيّ، في امتزاجٍ مع الطبل الشامانيّ`], [`Object · made in Istanbul / Fethiye`, `غرض · صُنع في إسطنبول / فتحية`],
    [`Wonders of Whirling Skirts`, `تنانير عجائب الدوران`], [`Co-designed by Rawan Roshni &amp; Ziya Kocaturk`, `بتصميمٍ مشترك من روان روشني وضياء كوجاتورك`], [`Object · made to order`, `غرض · يُصنع حسب الطلب`],
    [`A Meditation or Chant in Rawan’s Voice`, `تأمّلٌ أو ترنيمة بصوت روان`], [`Custom-made, for you`, `يُصنع خصّيصاً لك`], [`Recording · by consultation`, `تسجيل · بالاستشارة`],
    [`Tuning the Lata’if`, `ضبط اللطائف`], [`An online course`, `دورة عبر الإنترنت`], [`Course · pre-recorded · coming soon`, `دورة · مسجّلة · قريباً`],
    /* Voice Liberation, from her document */
    [`A one-on-one program of liberation through the voice, and liberation of the voice. Seven sessions of ninety minutes, in person in Amman or online — beginning with a consultation.`, `برنامجٌ فرديّ للتحرّر عبر الصوت، ولتحرير الصوت. سبع جلسات، تسعون دقيقةً لكلٍّ منها، حضوريّاً في عمّان أو عبر الإنترنت — تبدأ باستشارة.`],
    [`Liberation through the voice. Liberation of the voice.`, `تحرّرٌ عبر الصوت. وتحريرٌ للصوت.`],
    [`The four elements <span lang="ar" class="ar">العناصر الأربعة</span>`, `العناصر الأربعة <span lang="en" class="ar">The four elements</span>`],
    [`Inside every one of the seven sessions`, `في كلّ جلسةٍ من الجلسات السبع`],
    [`Sound healing with the human voice`, `الشفاء بالصوت البشريّ`], [`Sound &amp; soma`, `الصوت والجسد`], [`Reflections`, `تأمّلات`], [`Performance techniques`, `تقنيات الأداء`],
    [`The Voice Liberation Program`, `برنامج تحرير الصوت`], [`A small fee`, `رسمٌ رمزيّ`], [`7 × 90 min`, `7 × 90 دقيقة`], [`700 JOD`, `700 دينار`],
    [`How is it paid?`, `كيف يُدفع؟`],
    /* the launch & the Path of Love (live data, shown as it is written) */
    [`11.11 — The Launch`, `11.11 — الإطلاق`], [`Evening · details to come`, `مساءً · التفاصيل لاحقاً`],
    [`The Path of Love · درب الحب`, `درب الحبّ · The Path of Love`], [`8 days · 7 nights`, `8 أيّام · 7 ليالٍ`], [`Aswan, Egypt`, `أسوان، مصر`], [`Amman, Jordan`, `عمّان، الأردن`]
    ,
    /* ── cymatics: what each maqam is built from ── */
    [`Resting figure`, `شكلٌ ساكن`],
    [`Jins Rast on C · jins Rast on G`, `جنس راست على دو · جنس راست على صول`],
    [`Jins Nahawand on C · jins Hijaz on G`, `جنس نهاوند على دو · جنس حجاز على صول`],
    [`Jins Ajam on B♭ · jins Ajam on F`, `جنس عجم على سي♭ · جنس عجم على فا`],
    [`Jins Saba on D · jins Hijaz on F — its octave falls short, to D♭`, `جنس صبا على ري · جنس حجاز على فا — ولا يكتمل جوابه، فيقف عند ري♭`],
    [`Jins Hijaz on D · jins Nahawand on G`, `جنس حجاز على ري · جنس نهاوند على صول`],
    [`Jins Bayat on D · jins Nahawand on G`, `جنس بياتي على ري · جنس نهاوند على صول`],
    [`Jins Kurd on D · jins Nahawand on G`, `جنس كرد على ري · جنس نهاوند على صول`],

    /* ── the pages: draft notes ── */
    [`The words on this page are <b>draft copy</b> for Rawan to rewrite in her own voice; formats, prices and the available times are <b>samples</b>.`,
     `نصوص هذه الصفحة <b>مسودّة</b> لتعيد روان كتابتها بصوتها؛ والصيغ والأسعار والمواعيد المتاحة <b>نماذج</b>.`],
    [`The course is <b>in development</b>. The description, outline and the map of the lata’if below are <b>draft</b> — one traditional map, for Rawan to correct to the one she teaches.`,
     `الدورة <b>قيد الإعداد</b>. الوصف والمخطّط وخريطة اللطائف أدناه <b>مسودّة</b> — خريطةٌ تقليديّة واحدة، لتصحّحها روان وفق ما تعلّمه.`],

    /* ── voice liberation: the copy ── */
    [`Voice Liberation is Rawan’s one-on-one work with the voice: breath, body, sound and song, in a space where nothing has to be beautiful and nothing is held back. She uses her own voice together with yours, the way she does in SoundWork, to meet the places where the sound stops.`,
     `تحرير الصوت هو عمل روان الفرديّ مع الصوت: النَّفَس والجسد والصوت والغناء، في مساحةٍ لا يُطلب فيها أن يكون شيءٌ جميلاً، ولا يُحبس فيها شيء. تستخدم صوتها مع صوتك، كما تفعل في SoundWork، لتلتقي بالأماكن التي يتوقّف عندها الصوت.`],
    [`It is not a singing lesson. It is for anyone who has felt their voice shrink — in a room, in a family, in a life — and wants it back.`,
     `ليس درساً في الغناء. إنّه لكلّ من شعر بصوته ينكمش — في غرفة، في عائلة، في حياة — ويريد أن يستعيده.`],
    [`The voice you arrive with: where it lives, where it hides, what it has been carrying.`, `الصوت الذي تأتي به: أين يسكن، وأين يختبئ، وماذا كان يحمل.`],
    [`Breath, body and jaw — the places the sound is held — softened through movement and touch of sound.`, `النَّفَس والجسد والفكّ — حيث يُحبس الصوت — تلين بالحركة وبلمسة الصوت.`],
    [`Sound without permission: toning, wailing, laughing, the animal voice — and the song underneath.`, `صوتٌ بلا استئذان: ترنيم، ونحيب، وضحك، والصوت الحيوانيّ — والأغنية التي تحتها.`],
    [`Bringing the freed voice home: a daily practice, and the words you came to say.`, `أن تعود بالصوت المتحرّر إلى البيت: ممارسةٌ يوميّة، والكلمات التي جئت لتقولها.`],
    [`Every session begins the same way: arriving in the breath. Touch the circle, and follow it in, and out, three times.`, `تبدأ كلّ جلسةٍ بالطريقة نفسها: الوصول إلى النَّفَس. المس الدائرة، واتبعها شهيقاً وزفيراً، ثلاث مرّات.`],
    [`Forty-five minutes to meet, to hear what brings you, to listen to your voice together — and to feel whether the journey is right for you now.`, `خمسٌ وأربعون دقيقة للتعارف، ولسماع ما يأتي بك، وللإصغاء إلى صوتك معاً — ولتشعر إن كانت الرحلة مناسبةً لك الآن.`],
    [`Seven sessions through all four movements, with practices to carry between them. It begins after your consultation, when you both know it is the right time.`, `سبع جلساتٍ عبر الحركات الأربع، مع ممارساتٍ تحملها بينها. تبدأ بعد استشارتك، حين تعرفان معاً أنّ الوقت قد حان.`],
    [`Send the email that just opened, and Rawan will confirm your time.`, `أرسل الرسالة التي فُتحت للتوّ، وستؤكّد روان موعدك.`],
    [`Voice Liberation is a journey of seven sessions, because the voice opens in stages. It always begins with a consultation, where you meet Rawan and decide together whether to continue.`, `تحرير الصوت رحلةٌ من سبع جلسات، لأنّ الصوت ينفتح على مراحل. وتبدأ دائماً باستشارة، تلتقي فيها بروان وتقرّران معاً إن كنتما ستكملان.`],
    [`No. Many people come because they believe they cannot. The work begins with breath and sound, not songs.`, `لا. كثيرون يأتون لأنّهم يظنّون أنّهم لا يستطيعون. يبدأ العمل بالنَّفَس والصوت، لا بالأغاني.`],
    [`Both. Online sessions work beautifully with headphones and a room where you can be loud. In-person sessions are in Amman.`, `الاثنان. الجلسات عبر الإنترنت تنجح تماماً بسمّاعاتٍ وغرفةٍ يمكنك أن ترفع فيها صوتك. والجلسات الحضوريّة في عمّان.`],
    [`It is not a replacement for therapy. It is voice and body work that often touches deep places, held with care and experience.`, `ليس بديلاً عن العلاج النفسيّ. إنّه عملٌ بالصوت والجسد يلامس غالباً أماكن عميقة، تُحتضن بعنايةٍ وخبرة.`],
    [`Yes — a consultation gift card is in the <a href="store.html">store</a>.`, `نعم — بطاقة هديّة للاستشارة موجودة في <a href="store.html">المتجر</a>.`],

    /* ── courses: the copy ── */
    [`In the Sufi path, the <i>lata’if</i> are subtle centres of perception — the heart, the spirit, the secret, the hidden and the most hidden among them — each with its own place in the body and its own light.`,
     `في الطريق الصوفيّ، <i>اللطائف</i> مراكز إدراكٍ لطيفة — منها القلب والروح والسرّ والخفيّ والأخفى — لكلٍّ منها موضعه في الجسد ونوره الخاصّ.`],
    [`In this course Rawan brings them sound: a tone, a breath and a practice for each centre, so that they can be felt, not only known about — and tuned, the way an instrument is.`,
     `في هذه الدورة تمنحها روان الصوت: نغمةً ونَفَساً وممارسةً لكلّ مركز، كي تُحَسّ لا أن تُعرف فقط — وتُضبط، كما تُضبط الآلة.`],
    [`Each point on the figure is one of the lata’if. Touch one to hear its tone.`, `كلّ نقطةٍ على الشكل لطيفةٌ من اللطائف. المس إحداها لتسمع نغمتها.`],
    [`Arriving`, `الوصول`], [`Breath, posture, and the home note`, `النَّفَس، والجلسة، ونغمة القرار`],
    [`Qalb — the heart`, `القلب`], [`Ruh — the spirit`, `الروح`], [`Sirr — the secret`, `السرّ`], [`Khafi — the hidden`, `الخفيّ`], [`Akhfa — the most hidden`, `الأخفى`],
    [`Tone, breath and practice`, `نغمة ونَفَس وممارسة`], [`The whole instrument`, `الآلة كلّها`],
    [`Sounding every centre together; a closing live circle`, `إصدار صوت المراكز كلّها معاً؛ ودائرةٌ حيّة ختاميّة`],
    [`Format to be decided — for example: recorded lessons and guided audio, released weekly, with live circles on Zoom.`, `الصيغة لم تُحدَّد بعد — مثلاً: دروسٌ مسجّلة وتسجيلاتٌ صوتيّة موجَّهة، تُنشر أسبوعيّاً، مع دوائر حيّة عبر Zoom.`],
    [`Leave your email, and you will hear when Tuning the Lata’if opens — and about the introductory evening before it.`, `اترك بريدك، وستعرف حين تفتح دورة «ضبط اللطائف» — وعن الأمسية التعريفيّة التي تسبقها.`],
    [`In this draft this writes an email to Rawan. At launch it joins a mailing list.`, `في هذه المسودّة يكتب هذا رسالةً إلى روان. وعند الإطلاق يضيفك إلى قائمة بريديّة.`],
    [`Wonders of Whirling: Foundations`, `عجائب الدوران: الأساسيّات`],
    [`The first steps of the turn, taught at home: grounding, the axis, the gaze, and how to stop.`, `الخطوات الأولى للدوران، تُعلَّم في البيت: التجذّر، والمحور، والنظرة، وكيف تتوقّف.`],
    [`SoundWork: 21 Days of Voice`, `واحد وعشرون يوماً من الصوت · SoundWork`],
    [`Ten minutes a day for three weeks, to make friends with your own voice.`, `عشر دقائق يوميّاً لثلاثة أسابيع، لتصادق صوتك.`],

    /* ── store and event: the copy ── */
    [`Rawan confirms every order herself, by email.`, `تؤكّد روان كلّ طلبٍ بنفسها، عبر البريد.`],
    [`Your order is written as an email to Rawan. She replies to confirm it, with shipping and how to pay.`, `يُكتب طلبك رسالةً إلى روان، وتردّ لتؤكّده مع تفاصيل الشحن وطريقة الدفع.`],
    [`Choose the time that suits you best. Rawan replies by email to confirm it, or to offer another, with the fee and the link.`, `اختر الموعد الذي يناسبك. تردّ روان عبر البريد لتؤكّده أو لتقترح موعداً آخر، مع الرسوم والرابط.`],
    [`Your reservation is written as an email to Rawan, and she confirms your place herself.`, `يُكتب حجزك رسالةً إلى روان، وتؤكّد مكانك بنفسها.`],
    [`Send the email that just opened, and Rawan will confirm your place.`, `أرسل الرسالة التي فُتحت للتوّ، وستؤكّد روان مكانك.`],
    [`This page draws itself from the calendar. <a href="calendar.html">See the calendar</a>.`, `تُبنى هذه الصفحة من التقويم. <a href="calendar.html">اطّلع على التقويم</a>.`],
    [`Online or in Amman · 45 minutes`, `عبر الإنترنت أو في عمّان · 45 دقيقة`],
    [`per person`, `للشخص`], [`Tell me when it opens`, `أخبرني حين يفتح`], [`Ask to be told first`, `اطلب أن تُبلَّغ أوّلاً`]

  ];

  // a few lines carry live numbers: these are matched by pattern
  var NUM = { All: 'الكل', Retreats: 'خلوات', Concerts: 'حفلات', Workshops: 'ورشات', Circles: 'دوائر', Online: 'عبر الإنترنت', Music: 'موسيقى', Recordings: 'تسجيلات', Gifts: 'هدايا', Objects: 'أغراض' };
  // months as the Levant names them, and short weekday names for the booking calendar
  var MON = { January: 'كانون الثاني', February: 'شباط', March: 'آذار', April: 'نيسان', May: 'أيّار', June: 'حزيران', July: 'تمّوز', August: 'آب', September: 'أيلول', October: 'تشرين الأوّل', November: 'تشرين الثاني', December: 'كانون الأوّل' };
  var MON3 = { Jan: 'ك٢', Feb: 'شباط', Mar: 'آذار', Apr: 'نيسان', May: 'أيّار', Jun: 'حزيران', Jul: 'تمّوز', Aug: 'آب', Sep: 'أيلول', Oct: 'ت١', Nov: 'ت٢', Dec: 'ك١' };
  var DOW = { Mon: 'إثنين', Tue: 'ثلاثاء', Wed: 'أربعاء', Thu: 'خميس', Fri: 'جمعة', Sat: 'سبت', Sun: 'أحد' };
  var MAQ = { Rast: 'راست', Nahawand: 'نهاوند', Ajam: 'عجم', Saba: 'صبا', Hijaz: 'حجاز', Bayat: 'بياتي', Kurd: 'كرد' };
  var RX = [
    [/^(January|February|March|April|May|June|July|August|September|October|November|December)<small>(\d{4})<\/small>$/, function (m) { return MON[m[1]] + '<small>' + m[2] + '</small>'; }],
    [/^(January|February|March|April|May|June|July|August|September|October|November|December) (\d{4})$/, function (m) { return MON[m[1]] + ' ' + m[2]; }],
    [/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)(<i>.*<\/i>)$/, function (m) { return MON3[m[1]] + m[2]; }],
    [/^(\d+)<small>(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)<\/small>(?:<em>to (\d+) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)<\/em>)?$/, function (m) {
      return m[1] + '<small>' + MON3[m[2]] + '</small>' + (m[3] ? '<em>إلى ' + m[3] + ' ' + MON3[m[4]] + '</em>' : ''); }],
    [/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)$/, function (m) { return DOW[m[1]]; }],
    [/^(Rast|Nahawand|Ajam|Saba|Hijaz|Bayat|Kurd) · degree (\d) · ([\d.]+) Hz$/, function (m) { return MAQ[m[1]] + ' · الدرجة ' + m[2] + ' · ' + m[3] + ' هرتز'; }],
    [/^on (.+) · tap a note, or play the maqam$/, function (m) { return 'على ' + m[1] + ' · المس نغمة، أو اعزف المقام'; }],
    [/^(\d+) countries$/, function (m) { return m[1] + ' دول'; }],
    [/^(\d+) offerings in (\d+) countries and online, (\d{4}) to (\d{4})\.$/, function (m) { return m[1] + ' تقدمة في ' + m[2] + ' دول وعبر الإنترنت، من ' + m[3] + ' إلى ' + m[4] + '.'; }],
    [/^(All|Retreats|Concerts|Workshops|Circles|Online|Music|Recordings|Gifts|Objects)<span>(\d+)<\/span>$/, function (m) { return NUM[m[1]] + '<span>' + m[2] + '</span>'; }]
  ];

  var D = {};
  P.forEach(function (p) { D[p[0]] = p[1]; });
  var norm = function (s) { return s.replace(/ /g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim(); };
  function look(k) {
    if (D.hasOwnProperty(k)) return D[k];
    for (var i = 0; i < RX.length; i++) { var m = k.match(RX[i][0]); if (m) return RX[i][1](m); }
    return null;
  }
  RR.t = function (s) { return lang === 'ar' ? (look(norm(s)) || s) : s; };

  var SKIP = { SCRIPT: 1, STYLE: 1, CANVAS: 1, NOSCRIPT: 1, TEXTAREA: 1, svg: 0 };
  function visit(el) {
    if (SKIP[el.tagName]) return;
    // an English label kept beside the Arabic on purpose is left as it is
    if (el.getAttribute && el.getAttribute('lang') === 'en') return;
    if (el.hasAttribute && el.hasAttribute('placeholder')) { var ph = look(norm(el.getAttribute('placeholder'))); if (ph) el.setAttribute('placeholder', ph); }
    var html = el.innerHTML;
    if (html && html.length < 1600) {
      var v = look(norm(html));
      if (v != null) {
        el.innerHTML = v;
        // Arabic along a path must not be stretched letter by letter: let it run at its natural width
        if (el.tagName.toLowerCase() === 'textpath') { el.removeAttribute('textLength'); el.removeAttribute('lengthAdjust'); }
        return;
      }
    }
    for (var c = el.firstElementChild; c; c = c.nextElementSibling) visit(c);
  }

  var mo = null;
  function apply(node) {
    if (lang !== 'ar') return;
    if (mo) mo.disconnect();
    visit(node || document.body);
    $$(document, 'input[placeholder], textarea[placeholder]').forEach(function (i) { var ph = look(norm(i.placeholder)); if (ph) i.placeholder = ph; });
    if (mo) watch();
  }
  function $$(r, s) { return [].slice.call(r.querySelectorAll(s)); }

  // text written later by the page (a button's state, a count, a booking step) is translated as it appears
  var queue = [], queued = false;
  function watch() {
    mo.observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  function flush() {
    queued = false;
    var list = queue; queue = [];
    mo.disconnect();
    list.forEach(function (n) { if (n.isConnected) visit(n); });
    watch();
  }

  if (lang === 'ar') {
    var t = look(norm(document.title.replace(/ — Rawan Roshni$/, ''))) ;
    document.title = (t ? t + ' — ' : '') + 'روان روشني';
    apply();
    mo = new MutationObserver(function (ms) {
      ms.forEach(function (m) {
        var n = m.type === 'characterData' ? m.target.parentElement : m.target;
        if (n && n.nodeType === 1 && queue.indexOf(n) < 0) queue.push(n);
      });
      if (!queued) { queued = true; requestAnimationFrame(flush); }
    });
    watch();
    // a second full pass once every deferred script has drawn its part of the page
    document.addEventListener('DOMContentLoaded', function () { apply(); });
  }

  /* ── the switch ── */
  function setLang(l) {
    try { localStorage.setItem('rr-lang', l); sessionStorage.setItem('rr-scroll', String(scrollY)); } catch (e) {}
    var u = new URL(location.href);
    u.searchParams.delete('lang');
    location.replace(u.pathname + u.search + u.hash);
  }
  [].forEach.call(document.querySelectorAll('[data-lang]'), function (b) {
    b.setAttribute('aria-pressed', lang === 'ar' ? 'true' : 'false');
    b.setAttribute('aria-label', lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربيّة');
    b.addEventListener('click', function () { setLang(lang === 'ar' ? 'en' : 'ar'); });
  });
  try {
    var y = sessionStorage.getItem('rr-scroll');
    if (y) { sessionStorage.removeItem('rr-scroll'); addEventListener('load', function () { scrollTo({ top: +y, behavior: 'instant' }); }); }
  } catch (e) {}
})();
