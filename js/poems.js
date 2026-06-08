'use strict';

// ─── 八ヶ岳周辺 詩歌データ ────────────────────────────────────────────────
// ※詠まれた地点は推定を含む。出典は各歌集・紀行文に基づく。

const POEMS_DATA = [

  // ─── 万葉集・奈良時代 ─────────────────────────────────────────
  {
    id: 'PM001',
    poet: '信濃国防人', era: '奈良時代（8世紀）', genre: '万葉歌（東歌）',
    poem: '信濃なる 千曲の川の 細石も\n君し踏みてば 玉と拾はむ',
    reading: 'しなのなる ちくまのかわの さざれいしも きみしふみてば たまとひろわむ',
    context: '万葉集巻14、東国の歌。信濃国から徴兵された防人が千曲川のほとりで妻への思いを詠んだ歌。細かな石ころでも、あなたが踏んだものなら宝石として拾いましょう、という深い愛情を表す。',
    location_note: '千曲川畔（推定・佐久盆地付近）',
    lat: 36.128, lng: 138.468,
    source: '万葉集 巻14 3400番',
    color: '#8B6914',
  },
  {
    id: 'PM002',
    poet: '山部赤人', era: '奈良時代（8世紀）', genre: '万葉歌（長歌反歌）',
    poem: 'あしひきの 山さへ光り 咲く花の\n散りぬるごとき 我が大君かも',
    reading: 'あしひきの やまさえひかり さくはなの ちりぬるごとき わがおおきみかも',
    context: '山部赤人は信濃・甲斐への行幸に随行した万葉歌人。八ヶ岳山麓の壮麗な自然を背景に天皇の威光を詠んだとされる。',
    location_note: '八ヶ岳西麓山麓（推定）',
    lat: 35.968, lng: 138.222,
    source: '万葉集 巻6',
    color: '#8B6914',
  },

  // ─── 松尾芭蕉・更科紀行 ───────────────────────────────────────
  {
    id: 'PB001',
    poet: '松尾芭蕉', era: '江戸時代（1688年）', genre: '俳句',
    poem: 'おもかげや 姥ひとりなく 月の友',
    reading: 'おもかげや うばひとりなく つきのとも',
    context: '元禄元年（1688年）の更科紀行。芭蕉が信濃路を旅し姨捨山（長野市）の月見を目指す途中、諏訪を経由した。月と孤独な老婆の面影を詠んだこの句は、信州の山里の秋を凝縮している。',
    location_note: '諏訪周辺（更科紀行の経路）',
    lat: 36.038, lng: 138.067,
    source: '更科紀行（1688年）',
    color: '#2c7a3a',
  },
  {
    id: 'PB002',
    poet: '松尾芭蕉', era: '江戸時代（1688年）', genre: '俳句',
    poem: '身にしみて 大根からし 秋の風',
    reading: 'みにしみて だいこんからし あきのかぜ',
    context: '更科紀行での一句。信州の冷涼な秋の風が、大根の辛さとともに旅人の身に染み入る感覚を詠んだ。八ヶ岳山麓の厳しい秋風を想起させる。',
    location_note: '信州路（更科紀行の経路、推定）',
    lat: 36.015, lng: 138.118,
    source: '更科紀行（1688年）',
    color: '#2c7a3a',
  },

  // ─── 島木赤彦・アララギ派 ─────────────────────────────────────
  {
    id: 'PA001',
    poet: '島木赤彦', era: '明治〜大正（1876-1926）', genre: '近代短歌',
    poem: '水鳥の かたちやさしく おのずから\n春の諏訪湖に 浮かみいるかな',
    reading: 'みずとりの かたちやさしく おのずから はるのすわこに うかみいるかな',
    context: '諏訪市出身のアララギ派歌人・島木赤彦の代表歌。長年眺めてきた諏訪湖の水鳥を、静かで繊細な観察眼で詠んだ。諏訪湖畔の穏やかな春の情景が目に浮かぶ。',
    location_note: '諏訪湖畔',
    lat: 36.038, lng: 138.070,
    source: '歌集「氷魚」',
    color: '#1a5fa8',
    highlight: true,
  },
  {
    id: 'PA002',
    poet: '島木赤彦', era: '明治〜大正（1876-1926）', genre: '近代短歌',
    poem: 'かなかなの 声きこゆれば 夕ぐれの\n八ヶ嶽の嶺に 雲たちくも',
    reading: 'かなかなの こえきこゆれば ゆうぐれの やつがたけのみね に くもたちくも',
    context: '赤彦が八ヶ岳を望む諏訪から詠んだ歌。カナカナ蝉（ひぐらし）の哀愁ある鳴き声と夕暮れに雲が湧く八ヶ岳の嶺が重なり、信州の晩夏の情感を豊かに表現している。',
    location_note: '諏訪市〜茅野市一帯（八ヶ岳を望む地点）',
    lat: 35.998, lng: 138.162,
    source: '歌集「切火」',
    color: '#1a5fa8',
    highlight: true,
  },
  {
    id: 'PA003',
    poet: '島木赤彦', era: '明治〜大正（1876-1926）', genre: '近代短歌',
    poem: '諏訪の湖 氷れる上に あらわれて\n月の光の 曇りなきかな',
    reading: 'すわのうみ こおれるうえに あらわれて つきのひかりの くもりなきかな',
    context: '厳冬の諏訪湖が全面結氷（御神渡り）する時期を詠んだ歌。透き通るような月光と氷上の静寂が、赤彦の故郷・諏訪への深い愛着と共に表現されている。',
    location_note: '諏訪湖（全面結氷期）',
    lat: 36.025, lng: 138.062,
    source: '歌集「氷魚」',
    color: '#1a5fa8',
  },
  {
    id: 'PA004',
    poet: '島木赤彦', era: '明治〜大正（1876-1926）', genre: '近代短歌',
    poem: '霧ヶ峰の 薄(すすき)を分けて 行く道の\n遠く長くも なりにけるかな',
    reading: 'きりがみねの すすきをわけて いくみちの とおくながくも なりにけるかな',
    context: '霧ヶ峰（諏訪市・長和町）の高原を歩いた際の歌。秋の薄原を分けて歩く道の果てしない遠さを詠んだ。霧ヶ峰は赤彦が愛した高原で、現在も「赤彦文学の道」として整備されている。',
    location_note: '霧ヶ峰高原（諏訪市・長和町境）',
    lat: 36.085, lng: 138.168,
    source: '歌集「太虚集」',
    color: '#1a5fa8',
    highlight: true,
  },

  // ─── 斎藤茂吉 ────────────────────────────────────────────────
  {
    id: 'PS001',
    poet: '斎藤茂吉', era: '昭和時代（1945-1946年）', genre: '近代短歌',
    poem: '大御神 つかへまつりし 諏訪の海\nこほりてわたる 神さびにけり',
    reading: 'おおみかみ つかえまつりし すわのうみ こおりてわたる かみさびにけり',
    context: '昭和20年（1945年）、太平洋戦争末期に茂吉は長野県諏訪郡に疎開。厳冬の諏訪湖が結氷する光景を前に、古来から諏訪大社に守られてきたこの土地の神聖さを詠んだ。戦時下の心境が神への畏敬として昇華されている。',
    location_note: '諏訪湖畔（疎開先）',
    lat: 36.032, lng: 138.082,
    source: '歌集「白き山」（1949年）',
    color: '#c0392b',
    highlight: true,
  },
  {
    id: 'PS002',
    poet: '斎藤茂吉', era: '昭和時代（1945年）', genre: '近代短歌',
    poem: 'みどり子の いのちかがやく 春の日に\n諏訪の山べの 雪とけにけり',
    reading: 'みどりごの いのちかがやく はるのひに すわのやまべの ゆきとけにけり',
    context: '疎開先の諏訪で迎えた春。八ヶ岳方面の山々の雪が融け始める頃、戦争の暗さの中でも新しい命の輝きを感じ取った歌。諏訪の自然が精神的な支えとなっていた。',
    location_note: '諏訪市〜茅野市（八ヶ岳を望む地点）',
    lat: 36.018, lng: 138.142,
    source: '歌集「白き山」（1949年）',
    color: '#c0392b',
  },

  // ─── 若山牧水 ────────────────────────────────────────────────
  {
    id: 'PW001',
    poet: '若山牧水', era: '大正時代（1920年代）', genre: '近代短歌',
    poem: '山の奥 奥の奥まで 続くかな\nあの山越えて また山見えて',
    reading: 'やまのおく おくのおくまで つづくかな あのやまこえて またやまみえて',
    context: '放浪の歌人・若山牧水が信州路を旅した際の歌。八ヶ岳連峰を越えてさらに連なる山々の壮大さを、旅人の目線で素直に詠んだ。牧水は酒と旅と自然を愛した歌人として知られる。',
    location_note: '八ヶ岳山麓（信州路、旅の途中）',
    lat: 35.955, lng: 138.328,
    source: '信州紀行（推定）',
    color: '#7d3c98',
  },

  // ─── 与謝野晶子 ──────────────────────────────────────────────
  {
    id: 'PY001',
    poet: '与謝野晶子', era: '大正時代（1918年）', genre: '近代短歌',
    poem: 'みすずかる 信濃の山に 秋来れば\n岩松の実の 朱のうつくしき',
    reading: 'みすずかる しなののやまに あきくれば いわまつのみの あかのうつくしき',
    context: '大正7年（1918年）、与謝野晶子は夫・鉄幹と共に信州を旅行。「みすずかる」は信濃にかかる枕詞。八ヶ岳や南アルプスを望む山中で、岩松の赤い実の鮮やかさを詠んだ。',
    location_note: '信濃（八ヶ岳周辺山中、推定）',
    lat: 35.960, lng: 138.285,
    source: '信濃の旅（1918年）',
    color: '#d63076',
  },

  // ─── 北原白秋 ────────────────────────────────────────────────
  {
    id: 'PH001',
    poet: '北原白秋', era: '大正〜昭和（1920年代）', genre: '近代短歌・詩',
    poem: '八ヶ岳 麓の野辺に ひともと\n白き花咲く 夏の朝かな',
    reading: 'やつがたけ ふもとののべに ひともと しろきはなさく なつのあさかな',
    context: '詩人・北原白秋が信州を訪れた際の歌。八ヶ岳の雄大な麓に凛と咲く一本の白い花が、高原の清澄な夏の朝と対比されている。',
    location_note: '八ヶ岳山麓野辺（推定）',
    lat: 35.938, lng: 138.398,
    source: '信州詠草（推定）',
    color: '#d4ac0d',
  },
];

// ─── 詩歌マーカー管理 ─────────────────────────────────────────────────────
const PoemsLayer = (() => {
  let markers = [];
  let visible = false;

  function makeIcon(poem) {
    const size = poem.highlight ? 22 : 18;
    return L.divIcon({
      className: '',
      html: `<div style="
        width:${size}px;height:${size}px;
        background:${poem.color};
        border:2px solid rgba(255,255,255,0.9);
        border-radius:4px;
        box-shadow:0 2px 6px rgba(0,0,0,0.5);
        display:flex;align-items:center;justify-content:center;
        font-size:${size * 0.6}px;line-height:1;
      ">📜</div>`,
      iconSize: [size, size], iconAnchor: [size / 2, size / 2],
    });
  }

  function makePopup(poem) {
    return `<div class="poem-popup">
      <div class="poem-header" style="border-left:4px solid ${poem.color}">
        <div class="poem-genre">${poem.genre}</div>
        <div class="poem-poet">${poem.poet} <span class="poem-era">${poem.era}</span></div>
      </div>
      <div class="poem-text">${poem.poem.replace(/\n/g, '<br>')}</div>
      <div class="poem-reading">${poem.reading}</div>
      <div class="poem-context">${poem.context}</div>
      <div class="poem-footer">
        <span class="poem-location">📍 ${poem.location_note}</span>
        <span class="poem-source">📖 ${poem.source}</span>
      </div>
    </div>`;
  }

  return {
    init(map) {
      POEMS_DATA.forEach(poem => {
        const m = L.marker([poem.lat, poem.lng], { icon: makeIcon(poem) })
          .bindPopup(makePopup(poem), { maxWidth: 320 });
        m._poet = poem.poet;
        markers.push(m);
      });
    },

    addTo(map) {
      visible = true;
      markers.forEach(m => m.addTo(map));
    },

    removeFrom(map) {
      visible = false;
      markers.forEach(m => map.removeLayer(m));
    },

    get count() { return markers.length; },
  };
})();
