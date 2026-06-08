'use strict';

// ─── 八ヶ岳周辺 遺跡データ ────────────────────────────────────────────────
// 出典: 文化庁 国指定文化財等データベース / 各市町村教育委員会 遺跡台帳
// ※座標はWGS84（十分の一度精度）

const RUINS_DATA = [

  // ─── 縄文時代 ───────────────────────────────────────────────
  {
    id: 'R001', name: '尖石遺跡', lat: 35.9975, lng: 138.2512,
    period: 'jomon', periodLabel: '縄文中期', type: '集落跡',
    city: '茅野市', pref: '長野県',
    desc: '縄文時代中期（約4500〜5000年前）の大規模集落遺跡。国の特別史跡。竪穴住居跡100棟以上が確認されている縄文時代の一大拠点。',
    designated: '国特別史跡', year: '1952年指定',
  },
  {
    id: 'R002', name: '与助尾根遺跡', lat: 35.9981, lng: 138.2525,
    period: 'jomon', periodLabel: '縄文中期', type: '集落跡',
    city: '茅野市', pref: '長野県',
    desc: '尖石遺跡に隣接する縄文中期の集落遺跡。国の特別史跡（尖石遺跡と一体）。土偶・土器など多数の遺物が出土。',
    designated: '国特別史跡', year: '1952年',
  },
  {
    id: 'R003', name: '棚畑遺跡', lat: 35.9435, lng: 138.2598,
    period: 'jomon', periodLabel: '縄文中期', type: '集落跡',
    city: '茅野市', pref: '長野県',
    desc: '縄文のビーナス（国宝）が出土した遺跡。高さ27cmの土偶は縄文時代中期の傑作として世界的に知られる。',
    designated: '国史跡', year: '1995年 棚畑の縄文のビーナス・国宝指定',
    highlight: true,
  },
  {
    id: 'R004', name: '金生遺跡', lat: 35.8448, lng: 138.4983,
    period: 'jomon', periodLabel: '縄文晩期〜弥生', type: '集落跡',
    city: '北杜市', pref: '山梨県',
    desc: '縄文晩期から弥生時代初頭の遺跡。土偶・石棒・石器が大量出土。長野・山梨の文化交流を示す重要遺跡。',
    designated: '国史跡', year: '1988年',
  },
  {
    id: 'R005', name: '曽利遺跡', lat: 35.9138, lng: 138.2245,
    period: 'jomon', periodLabel: '縄文中期', type: '集落跡',
    city: '富士見町', pref: '長野県',
    desc: '曽利式土器の標式遺跡。大型の縄文集落で、火焰型土器に通じる渦巻文様が特徴的な曽利式土器が初めて定義された。',
    designated: '国史跡', year: '1972年',
  },
  {
    id: 'R006', name: '井戸尻遺跡', lat: 35.9083, lng: 138.2183,
    period: 'jomon', periodLabel: '縄文中期', type: '集落跡・水田跡',
    city: '富士見町', pref: '長野県',
    desc: '縄文中期の大規模集落。近年の調査で縄文時代の「水田」状遺構が発見され注目を集める。高地性の農耕的生活の証拠とも議論される。',
    designated: '県史跡', year: '1963年',
    highlight: true,
  },
  {
    id: 'R007', name: '藤内遺跡', lat: 35.9875, lng: 138.2385,
    period: 'jomon', periodLabel: '縄文中期', type: '集落跡',
    city: '茅野市', pref: '長野県',
    desc: '尖石遺跡群の一つ。縄文中期の竪穴住居跡と多量の土器・石器が出土。',
    designated: '市史跡', year: '',
  },
  {
    id: 'R008', name: '上ノ段遺跡', lat: 35.9920, lng: 138.2460,
    period: 'jomon', periodLabel: '縄文中期〜後期', type: '集落跡',
    city: '茅野市', pref: '長野県',
    desc: '縄文中期から後期にかけての集落遺跡。標高約1,000mの高地に位置し、八ヶ岳西麓の縄文文化を示す。',
    designated: '', year: '',
  },
  {
    id: 'R009', name: '滝沢遺跡', lat: 35.9562, lng: 138.3188,
    period: 'jomon', periodLabel: '縄文中期', type: '集落跡',
    city: '原村', pref: '長野県',
    desc: '原村の縄文遺跡。八ヶ岳西麓の縄文中期集落群の一つ。',
    designated: '', year: '',
  },
  {
    id: 'R010', name: '阿久遺跡', lat: 35.8918, lng: 138.2068,
    period: 'jomon', periodLabel: '縄文早期〜中期', type: '環状列石・集落跡',
    city: '富士見町', pref: '長野県',
    desc: '縄文早期から中期にかけての環状列石（ストーンサークル）を持つ遺跡。縄文時代の儀礼空間の証拠として重要。',
    designated: '国史跡', year: '2001年',
    highlight: true,
  },
  {
    id: 'R011', name: '長坂上条遺跡', lat: 35.8412, lng: 138.4725,
    period: 'jomon', periodLabel: '縄文後期', type: '集落跡',
    city: '北杜市', pref: '山梨県',
    desc: '縄文後期の大規模集落。八ヶ岳東麓の縄文文化を示す遺跡群の一つ。',
    designated: '', year: '',
  },
  {
    id: 'R012', name: '大深山遺跡', lat: 35.9308, lng: 138.3932,
    period: 'jomon', periodLabel: '縄文中期', type: '集落跡',
    city: '南牧村', pref: '長野県',
    desc: '八ヶ岳東麓の縄文中期集落。高地の集落跡で、黒曜石製石器が多数出土しており交易ルートとの関連が示唆される。',
    designated: '', year: '',
  },

  // ─── 黒曜石産地遺跡 ──────────────────────────────────────────
  {
    id: 'O001', name: '和田峠黒曜石産地遺跡', lat: 36.0908, lng: 138.2133,
    period: 'obsidian', periodLabel: '旧石器〜縄文', type: '石材採掘遺跡',
    city: '長和町', pref: '長野県',
    desc: '日本最大の黒曜石産地。旧石器時代から縄文時代にかけて採掘された黒曜石は北海道から九州まで流通した。産出地同定研究の基準産地。',
    designated: '国史跡', year: '2009年',
    highlight: true,
  },
  {
    id: 'O002', name: '星ヶ台黒曜石採掘遺跡', lat: 36.0803, lng: 138.2012,
    period: 'obsidian', periodLabel: '旧石器〜縄文', type: '石材採掘遺跡',
    city: '長和町', pref: '長野県',
    desc: '和田峠産地の中核を成す採掘遺跡。数万点に及ぶ剥片・石核が発見されており、大規模な石器生産工房跡と考えられる。',
    designated: '国史跡（和田峠一体）', year: '2009年',
  },
  {
    id: 'O003', name: '男女倉遺跡（黒曜石採掘）', lat: 36.0653, lng: 138.2121,
    period: 'obsidian', periodLabel: '旧石器〜縄文', type: '石材採掘遺跡',
    city: '長和町', pref: '長野県',
    desc: '和田峠黒曜石産地の一角。旧石器時代後期（約3万年前）から利用が始まった採掘遺跡。蛍光X線分析でここ産の黒曜石が全国で確認されている。',
    designated: '', year: '',
  },

  // ─── 弥生〜古墳時代 ──────────────────────────────────────────
  {
    id: 'K001', name: '大泉清里古墳群', lat: 35.8618, lng: 138.4712,
    period: 'kofun', periodLabel: '古墳時代', type: '古墳群',
    city: '北杜市', pref: '山梨県',
    desc: '八ヶ岳東麓に展開する古墳時代の古墳群。前方後円墳・円墳が複数確認されており、この地域の豪族の存在を示す。',
    designated: '', year: '',
  },
  {
    id: 'K002', name: '茅野市北山古墳群', lat: 36.0050, lng: 138.1608,
    period: 'kofun', periodLabel: '古墳時代', type: '古墳群',
    city: '茅野市', pref: '長野県',
    desc: '諏訪盆地北部に位置する古墳群。古墳時代後期（6〜7世紀）の横穴式石室墳が主体。',
    designated: '', year: '',
  },

  // ─── 中世〜近世 ──────────────────────────────────────────────
  {
    id: 'M001', name: '海ノ口城跡', lat: 35.8883, lng: 138.4308,
    period: 'medieval', periodLabel: '中世（戦国期）', type: '山城跡',
    city: '南牧村', pref: '長野県',
    desc: '武田氏家臣・海野氏の城跡。海ノ口城を巡る武田信玄の初陣（1536年）が行われた場所として有名。高台に空堀・土塁が残存。',
    designated: '県史跡', year: '',
    highlight: true,
  },
  {
    id: 'M002', name: '若神子城跡', lat: 35.8283, lng: 138.5017,
    period: 'medieval', periodLabel: '中世（戦国期）', type: '山城跡',
    city: '北杜市', pref: '山梨県',
    desc: '武田氏一族の城跡。甲斐源氏の勢力圏を示す中世城郭遺跡。',
    designated: '', year: '',
  },

  // ─── 古道・峠 ────────────────────────────────────────────────
  {
    id: 'T001', name: '棒道（武田の棒道）', lat: 35.9523, lng: 138.2745,
    period: 'historic', periodLabel: '近世（江戸期）', type: '古道',
    city: '原村〜茅野市', pref: '長野県',
    desc: '武田信玄が整備したとされる軍用道路「棒道」の遺構。諏訪から北信濃に向かう直線的な道で、現在も一部が遊歩道として残る。',
    designated: '', year: '',
  },
  {
    id: 'T002', name: '縄文海道（黒曜石交易路推定路）', lat: 35.9750, lng: 138.3850,
    period: 'obsidian', periodLabel: '縄文時代', type: '推定交易ルート',
    city: '八ヶ岳山麓一帯', pref: '長野県・山梨県',
    desc: '和田峠産黒曜石が東海・関東・東北へ運ばれたとされる縄文の交易ルート。八ヶ岳山麓は主要な中継地。',
    designated: '', year: '',
  },
];

// ─── 時代定義 ─────────────────────────────────────────────────────────────
const RUIN_PERIODS = [
  { id: 'all',      label: 'すべて',       color: '#888' },
  { id: 'jomon',    label: '縄文',         color: '#e67e22' },
  { id: 'obsidian', label: '黒曜石産地',   color: '#9b59b6' },
  { id: 'kofun',    label: '古墳',         color: '#27ae60' },
  { id: 'medieval', label: '中世',         color: '#2980b9' },
  { id: 'historic', label: '近世・古道',   color: '#7f8c8d' },
];

// ─── Leafletレイヤー管理 ─────────────────────────────────────────────────
const RuinsLayer = (() => {
  let markers = [];
  let activePeriod = 'all';
  let layerGroup = null;

  function makeIcon(ruin) {
    const p = RUIN_PERIODS.find(p => p.id === ruin.period);
    const color = p ? p.color : '#888';
    const star = ruin.highlight ? '★' : '●';
    const size = ruin.highlight ? 14 : 10;
    return L.divIcon({
      className: '',
      html: `<div style="
        width:${size}px;height:${size}px;
        background:${color};
        border:2px solid rgba(255,255,255,0.85);
        border-radius:50%;
        box-shadow:0 1px 5px rgba(0,0,0,0.55);
        display:flex;align-items:center;justify-content:center;
        font-size:${size * 0.55}px;color:#fff;font-weight:900;
      ">${ruin.highlight ? '★' : ''}</div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  }

  function makePopup(ruin) {
    const p = RUIN_PERIODS.find(p => p.id === ruin.period);
    const color = p ? p.color : '#888';
    return `<div class="ruin-popup">
      <div class="ruin-popup-header" style="border-left:4px solid ${color}">
        <span class="ruin-period-badge" style="background:${color}22;color:${color};border:1px solid ${color}44">${ruin.periodLabel}</span>
        <h3>${ruin.name}</h3>
        <span class="ruin-type">${ruin.type} / ${ruin.city} ${ruin.pref}</span>
      </div>
      <p class="ruin-desc">${ruin.desc}</p>
      ${ruin.designated ? `<div class="ruin-designated">🏛️ ${ruin.designated}${ruin.year ? '（' + ruin.year + '）' : ''}</div>` : ''}
    </div>`;
  }

  // ─── Wikidata SPARQL取得 ────────────────────────────────────────
  const WIKIDATA_SPARQL = 'https://query.wikidata.org/sparql';
  const BOUNDS_QUERY = { latMin: 35.75, latMax: 36.20, lngMin: 138.05, lngMax: 138.55 };

  // WikidataのQID→時代マッピング
  const WD_TYPE_MAP = {
    Q839954:  { period: 'jomon',    label: '遺跡',     type: '考古遺跡' },
    Q13431:   { period: 'kofun',    label: '古墳',     type: '古墳' },
    Q1641119: { period: 'medieval', label: '史跡',     type: '歴史的遺産' },
    Q4989906: { period: 'jomon',    label: '土塁',     type: '土塁遺跡' },
    Q44377:   { period: 'medieval', label: '城',       type: '城跡' },
    Q1324928: { period: 'kofun',    label: '前方後円墳', type: '古墳' },
  };

  // タイプ別に個別クエリを発行（wdt:P279*を避け高速化）
  const WD_QUERIES = [
    { type: 'Q839954', period: 'jomon',    label: '遺跡' },
    { type: 'Q13431',  period: 'kofun',    label: '古墳' },
    { type: 'Q1324928',period: 'kofun',    label: '前方後円墳' },
    { type: 'Q44377',  period: 'medieval', label: '城跡' },
    { type: 'Q1641119',period: 'medieval', label: '史跡' },
  ];

  function buildQuery(typeQid) {
    const { latMin, latMax, lngMin, lngMax } = BOUNDS_QUERY;
    return `SELECT DISTINCT ?item ?itemLabel ?coord ?desc WHERE {
  ?item wdt:P31 wd:${typeQid} ; wdt:P625 ?coord .
  BIND(geof:latitude(?coord) AS ?lat)
  BIND(geof:longitude(?coord) AS ?lon)
  FILTER(?lat > ${latMin} && ?lat < ${latMax} && ?lon > ${lngMin} && ?lon < ${lngMax})
  OPTIONAL { ?item schema:description ?desc FILTER(LANG(?desc) = "ja") }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "ja,en". }
} LIMIT 150`;
  }

  function parseWikidataResult(bindings) {
    // 既存埋め込みデータのIDセット（重複排除用）
    const existingIds = new Set(RUINS_DATA.map(r => r.name));
    const parsed = [];
    const seen = new Set();

    for (const b of bindings) {
      const name = b.itemLabel?.value ?? '不明';
      const qid = b.item?.value?.split('/').pop() ?? '';
      const key = qid || name;
      if (seen.has(key)) continue;
      seen.add(key);

      // 座標パース "Point(lng lat)"
      const coordStr = b.coord?.value ?? '';
      const m = coordStr.match(/Point\(([0-9.]+)\s+([0-9.]+)\)/);
      if (!m) continue;
      const lng = parseFloat(m[1]), lat = parseFloat(m[2]);
      if (isNaN(lat) || isNaN(lng)) continue;

      // タイプ判定
      const typeQid = b.type?.value?.split('/').pop() ?? '';
      const typeInfo = WD_TYPE_MAP[typeQid] ?? { period: 'jomon', label: '遺跡', type: '考古遺跡' };

      parsed.push({
        id: qid, name, lat, lng,
        period: typeInfo.period,
        periodLabel: typeInfo.label,
        type: b.typeLabel?.value ?? typeInfo.type,
        city: '', pref: '',
        desc: b.desc?.value ?? '',
        designated: '',
        _wikidata: true,
        _wd_url: `https://www.wikidata.org/wiki/${qid}`,
      });
    }
    return parsed;
  }

  function makeWikidataPopup(ruin) {
    const p = RUIN_PERIODS.find(p => p.id === ruin.period);
    const color = p ? p.color : '#888';
    return `<div class="ruin-popup">
      <div class="ruin-popup-header" style="border-left:4px solid ${color}">
        <span class="ruin-period-badge" style="background:${color}22;color:${color};border:1px solid ${color}44">${ruin.periodLabel}</span>
        <h3>${ruin.name}</h3>
        <span class="ruin-type">${ruin.type}</span>
      </div>
      ${ruin.desc ? `<p class="ruin-desc">${ruin.desc}</p>` : '<p class="ruin-desc" style="color:#aaa">詳細情報なし</p>'}
      <div class="ruin-designated" style="background:#f0f4ff">
        🌐 <a href="${ruin._wd_url}" target="_blank" style="color:#1a6bcc">Wikidata で見る</a>
      </div>
    </div>`;
  }

  function addRuinMarker(ruin, mapRef) {
    const isWd = ruin._wikidata;
    const p = RUIN_PERIODS.find(p => p.id === ruin.period);
    const color = p ? p.color : '#888';
    const size = ruin.highlight ? 14 : isWd ? 8 : 10;

    const icon = L.divIcon({
      className: '',
      html: `<div style="
        width:${size}px;height:${size}px;
        background:${color};
        border:${isWd ? '1.5px' : '2px'} solid rgba(255,255,255,${isWd ? '0.6' : '0.85'});
        border-radius:50%;
        box-shadow:0 1px 4px rgba(0,0,0,${isWd ? '0.35' : '0.55'});
        opacity:${isWd ? '0.85' : '1'};
      ">${ruin.highlight ? '<span style="font-size:8px;color:#fff;font-weight:900;line-height:14px;display:block;text-align:center">★</span>' : ''}</div>`,
      iconSize: [size, size], iconAnchor: [size / 2, size / 2],
    });

    const popup = isWd ? makeWikidataPopup(ruin) : makePopup(ruin);
    const m = L.marker([ruin.lat, ruin.lng], { icon })
      .bindPopup(popup, { maxWidth: 300 });
    m._ruinPeriod = ruin.period;
    markers.push(m);
    if (mapRef && (activePeriod === 'all' || m._ruinPeriod === activePeriod)) {
      m.addTo(mapRef);
    }
  }

  let _mapRef = null;
  let _visible = false;

  return {
    init(map) {
      _mapRef = map;
      // 埋め込みデータを追加
      RUINS_DATA.forEach(ruin => {
        const p = RUIN_PERIODS.find(p => p.id === ruin.period);
        const color = p ? p.color : '#888';
        const size = ruin.highlight ? 14 : 10;
        const icon = L.divIcon({
          className: '',
          html: `<div style="width:${size}px;height:${size}px;background:${color};border:2px solid rgba(255,255,255,0.85);border-radius:50%;box-shadow:0 1px 5px rgba(0,0,0,0.55);">${ruin.highlight ? '<span style="font-size:8px;color:#fff;font-weight:900;line-height:'+size+'px;display:block;text-align:center">★</span>' : ''}</div>`,
          iconSize: [size, size], iconAnchor: [size / 2, size / 2],
        });
        const m = L.marker([ruin.lat, ruin.lng], { icon })
          .bindPopup(makePopup(ruin), { maxWidth: 300 });
        m._ruinPeriod = ruin.period;
        markers.push(m);
      });
    },

    addTo(map) {
      _visible = true;
      markers.forEach(m => {
        if (activePeriod === 'all' || m._ruinPeriod === activePeriod) m.addTo(map);
      });
      // Wikidataを非同期フェッチ
      if (!this._wdFetched) this.fetchWikidata();
    },

    removeFrom(map) {
      _visible = false;
      markers.forEach(m => map.removeLayer(m));
    },

    filterByPeriod(period, map, isVisible) {
      activePeriod = period;
      if (!isVisible) return;
      markers.forEach(m => {
        if (period === 'all' || m._ruinPeriod === period) m.addTo(map);
        else map.removeLayer(m);
      });
    },

    async fetchWikidata() {
      this._wdFetched = true;
      updateRuinsStatus('Wikidata取得中...');
      const embeddedNames = new Set(RUINS_DATA.map(r => r.name));
      const seenQids = new Set();
      let totalAdded = 0;

      for (const q of WD_QUERIES) {
        try {
          const url = `${WIKIDATA_SPARQL}?format=json&query=${encodeURIComponent(buildQuery(q.type))}`;
          const res = await fetch(url, { headers: { Accept: 'application/json' } });
          const json = await res.json();

          for (const b of json.results.bindings) {
            const name = b.itemLabel?.value ?? '';
            const qid = b.item?.value?.split('/').pop() ?? '';
            if (!qid || seenQids.has(qid)) continue;
            seenQids.add(qid);
            if (embeddedNames.has(name)) continue;

            const coordStr = b.coord?.value ?? '';
            const m = coordStr.match(/Point\(([0-9.-]+)\s+([0-9.-]+)\)/);
            if (!m) continue;

            const ruin = {
              id: qid, name: name || `遺跡(${qid})`,
              lat: parseFloat(m[2]), lng: parseFloat(m[1]),
              period: q.period, periodLabel: q.label,
              type: q.label, city: '', pref: '',
              desc: b.desc?.value ?? '',
              designated: '', _wikidata: true,
              _wd_url: `https://www.wikidata.org/wiki/${qid}`,
            };
            addRuinMarker(ruin, _visible ? _mapRef : null);
            totalAdded++;
          }
          updateRuinsStatus(`${markers.length}件表示中...`);
        } catch (e) {
          console.warn(`Wikidata ${q.type} fetch failed:`, e);
        }
      }
      updateRuinsStatus(`計 ${markers.length}件（Wikidata +${totalAdded}件）`);
    },

    get count() { return markers.length; },
  };
})();

function updateRuinsStatus(msg) {
  const el = document.getElementById('ruins-status');
  if (el) el.textContent = msg;
}
