'use strict';

// ─── 主要河川 詳細情報（地質・水系・ハザード） ──────────────────────────────
const RIVER_DETAIL = {
  '釜無川': {
    watershed: '富士川水系', basin: '1,676 km²', length: '98 km',
    source: '甲斐駒ヶ岳・鋸岳（南アルプス北端）', confluence: '富士川（静岡県富士市）',
    geology: '花崗岩・変成岩起源の砂礫が主体。上流は勾配が急で侵食力が強く、八ヶ岳崩壊（約2万年前）の岩屑なだれ堆積物を浸食しながら流れる。白州付近で扇状地が発達。',
    hazard: '土石流・河岸侵食・洪水（扇状地末端部）', risk: 'high',
    water_quality: '清冽。サントリー白州蒸溜所の仕込み水として著名。',
    station_name: '白州水位観測所', station_url: 'https://k.river.go.jp/',
  },
  '大武川': {
    watershed: '富士川水系（釜無川支流）', basin: '71 km²', length: '22 km',
    source: '八ヶ岳（権現岳南東）', confluence: '釜無川（北杜市白州町）',
    geology: '安山岩質溶岩・火砕流堆積物を刻む急流。八ヶ岳の新期・古期火山岩が混在する渓流。土石流の発生頻度が高い。',
    hazard: '土石流・急流侵食', risk: 'high',
    water_quality: '透明度高い。水温低め。',
    station_name: '大武川流量観測所', station_url: 'https://k.river.go.jp/',
  },
  '尾白川': {
    watershed: '富士川水系（釜無川支流）', basin: '113 km²', length: '30 km',
    source: '甲斐駒ヶ岳（標高2,967m）', confluence: '釜無川（北杜市白州町）',
    geology: '花崗岩単一岩盤を刻む峡谷。白い花崗岩の岩床が特徴的で、「白い川」の語源とされる。日本名水百選に選定。',
    hazard: '鉄砲水・岩盤崩落', risk: 'medium',
    water_quality: '日本名水百選。花崗岩起源で硬度が低く超軟水（硬度15mg/L程度）。',
    station_url: 'https://k.river.go.jp/',
  },
  '塩川': {
    watershed: '富士川水系（釜無川支流）', basin: '297 km²', length: '46 km',
    source: '長野県富士見町（鉢伏山付近）', confluence: '釜無川（北杜市須玉町）',
    geology: '八ヶ岳東麓の火山灰台地と古期溶岩を流れる。中流部に段丘地形が発達し、河岸段丘を刻んだ侵食谷が見られる。',
    hazard: '洪水・段丘崩壊', risk: 'medium',
    water_quality: 'やや硬水。流域の農業用水として重要。',
    station_url: 'https://k.river.go.jp/',
  },
  '須玉川': {
    watershed: '富士川水系（釜無川支流）', basin: '240 km²', length: '45 km',
    source: '長野県南牧村（八ヶ岳東麓）', confluence: '釜無川（北杜市須玉町）',
    geology: '八ヶ岳東麓の崩積土・火砕流堆積物を侵食。清里〜須玉間に扇状地を形成。野辺山高原の溶岩台地下に伏流水帯がある。',
    hazard: '土砂流出・洪水', risk: 'medium',
    water_quality: '比較的清冽。清里高原の湧水が流入。',
    station_url: 'https://k.river.go.jp/',
  },
  '千曲川': {
    watershed: '信濃川水系（千曲川）', basin: '7,163 km²', length: '214 km（信濃川全長: 367km）',
    source: '甲武信ヶ岳（埼玉・山梨・長野県境）', confluence: '信濃川（新潟市で日本海へ）',
    geology: '日本最長の河川（信濃川）の長野県区間。八ヶ岳東麓を北流し佐久盆地を形成。上流部は変成岩・花崗岩の砂礫、中流部は火山灰・砂礫の厚い堆積層。',
    hazard: '洪水・河川氾濫（佐久平）', risk: 'high',
    water_quality: '中硬水。流域の農業・工業用水として重要。佐久鯉の産地。',
    station_name: '千曲川水系水位観測', station_url: 'https://k.river.go.jp/',
  },
  '柳川': {
    watershed: '信濃川水系（千曲川支流）', basin: '67 km²', length: '24 km',
    source: '野辺山高原（八ヶ岳南東麓）', confluence: '千曲川（南佐久郡南牧村）',
    geology: '野辺山溶岩台地（標高1,300〜1,400m）を流れる。玄武岩質安山岩の溶岩原を浸食してできた谷で、伏流水が多い。',
    hazard: '伏流・渇水リスク', risk: 'low',
    water_quality: '清冽・低硬度。高原牧場の水源。',
    station_url: 'https://k.river.go.jp/',
  },
  '杣添川': {
    watershed: '信濃川水系（千曲川支流）', basin: '38 km²', length: '19 km',
    source: '横岳西面（八ヶ岳）', confluence: '千曲川（南牧村）',
    geology: '八ヶ岳の安山岩・火砕流堆積物を刻む急流。横岳南東斜面の崩落地形と連動しており、土石流の発生源となる谷が多い。',
    hazard: '土石流・急流侵食', risk: 'high',
    water_quality: '清冽だが出水時は濁度高い。',
    station_url: 'https://k.river.go.jp/',
  },
  '宮川': {
    watershed: '天竜川水系（上川支流）', basin: '145 km²', length: '33 km',
    source: '八ヶ岳（赤岳・阿弥陀岳西麓）', confluence: '上川（茅野市）→諏訪湖',
    geology: '八ヶ岳西麓の安山岩質溶岩・崩積土を流れる。上流部は急峻な渓谷。縄文時代の尖石遺跡は宮川水系の段丘上に立地。',
    hazard: '土石流・洪水', risk: 'medium',
    water_quality: '八ヶ岳の湧水が豊富。上流域に縄文遺跡多数。',
    station_url: 'https://k.river.go.jp/',
  },
  '上川': {
    watershed: '天竜川水系', basin: '342 km²', length: '52 km',
    source: '八ヶ岳（編笠山・権現岳西麓）', confluence: '諏訪湖（茅野市）',
    geology: '八ヶ岳西麓から諏訪盆地へと流れ込む。火山灰・崩積土・溶岩由来の砂礫を運搬し、諏訪湖の三角州を形成。',
    hazard: '洪水（下流の諏訪盆地）・土砂堆積', risk: 'medium',
    water_quality: '清冽。茅野市の農業・生活用水。',
    station_url: 'https://k.river.go.jp/',
  },
  '天竜川': {
    watershed: '天竜川水系', basin: '5,090 km²', length: '213 km',
    source: '諏訪湖（長野県諏訪市）', confluence: '遠州灘（静岡県浜松市）',
    geology: '日本最急の大河の一つ（平均勾配1/150）。諏訪湖を源流とし、フォッサマグナの断裂地帯を南流。伊那谷は天竜川が形成した典型的な断層谷。',
    hazard: '急流による侵食・洪水・土砂移動', risk: 'high',
    water_quality: '中硬水。諏訪湖からの流出が多く、夏季はアオコ問題あり。',
    station_name: '釜口水門（諏訪湖）', station_url: 'https://k.river.go.jp/',
  },
  '砥川': {
    watershed: '天竜川水系（上川支流）', basin: '52 km²', length: '18 km',
    source: '富士山・八ヶ岳火山灰台地', confluence: '上川（諏訪市）',
    geology: '諏訪盆地西縁を流れる。流域は主に火山灰台地からなり、地下水位が高く湧水が豊富。',
    hazard: '軟弱地盤での浸水', risk: 'low',
    water_quality: '湧水が豊富で清冽。',
    station_url: 'https://k.river.go.jp/',
  },
};

// ─── Overpass クエリ ──────────────────────────────────────────────────────
const OVERPASS_RIVER_QUERY = `[out:json][timeout:30];
(
  way["waterway"="river"]["name"](35.75,138.05,36.30,138.60);
  way["waterway"="stream"]["name"](35.75,138.05,36.30,138.60);
);out center;`;

// ─── リスク色 ─────────────────────────────────────────────────────────────
const RISK_COLOR = { high: '#e74c3c', medium: '#f39c12', low: '#27ae60' };

// ─── Leafletマーカー管理 ─────────────────────────────────────────────────
const RiversLayer = (() => {
  let markers = [];
  let visible = false;
  let mapRef = null;
  let fetched = false;

  // 河川名ごとの重心を計算し代表マーカーを作成
  function processRiverData(elements) {
    const riverMap = {};
    for (const el of elements) {
      const name = el.tags?.name;
      if (!name || !el.center) continue;
      if (!riverMap[name]) riverMap[name] = { lats: [], lngs: [], type: el.tags.waterway };
      riverMap[name].lats.push(el.center.lat);
      riverMap[name].lngs.push(el.center.lon);
    }

    const result = [];
    for (const [name, data] of Object.entries(riverMap)) {
      const lat = data.lats.reduce((a, b) => a + b, 0) / data.lats.length;
      const lng = data.lngs.reduce((a, b) => a + b, 0) / data.lngs.length;
      const detail = RIVER_DETAIL[name];
      const isMajor = !!detail;
      result.push({ name, lat, lng, type: data.type, detail, isMajor, segCount: data.lats.length });
    }
    // セグメント数が多い（= 長い）河川を上位に
    return result.sort((a, b) => b.segCount - a.segCount);
  }

  function makeIcon(river) {
    const isMajor = river.isMajor;
    const risk = river.detail?.risk ?? 'low';
    const color = isMajor ? RISK_COLOR[risk] : '#4a90d9';
    const size = isMajor ? 26 : river.type === 'river' ? 18 : 13;

    return L.divIcon({
      className: '',
      html: `<div style="
        display:flex;align-items:center;gap:3px;
        background:rgba(${isMajor ? '255,255,255' : '40,80,160'},0.92);
        border:1.5px solid ${color};
        border-radius:10px;
        padding:2px ${isMajor ? 7 : 5}px;
        font-size:${isMajor ? '0.72' : '0.62'}rem;
        font-weight:${isMajor ? '700' : '600'};
        color:${isMajor ? color : '#cce'};
        white-space:nowrap;
        box-shadow:0 1px 4px rgba(0,0,0,0.4);
        max-width:120px;overflow:hidden;text-overflow:ellipsis;
      ">
        <span style="color:${isMajor ? '#4a90e2' : '#88aadd'}">≋</span>
        ${river.name}
      </div>`,
      iconSize: [null, 20],
      iconAnchor: [0, 10],
      className: 'river-label-icon',
    });
  }

  function makePopup(river) {
    const d = river.detail;
    if (!d) {
      return `<div class="river-popup">
        <h3 class="river-name">≋ ${river.name}</h3>
        <p style="font-size:0.78rem;color:#555">種別: ${river.type === 'river' ? '河川' : '支流・渓流'}</p>
        <p style="font-size:0.75rem;color:#888;margin-top:4px">詳細データなし（<a href="https://k.river.go.jp/" target="_blank">川の防災情報</a>で確認）</p>
      </div>`;
    }

    const riskColor = RISK_COLOR[d.risk ?? 'low'];
    const riskLabel = { high: '高', medium: '中', low: '低' }[d.risk ?? 'low'];

    return `<div class="river-popup">
      <div class="river-header">
        <h3 class="river-name">≋ ${river.name}</h3>
        <span class="river-watershed">${d.watershed}</span>
      </div>
      <div class="river-stats">
        <div class="river-stat"><span class="stat-label">流域面積</span><span class="stat-val">${d.basin}</span></div>
        <div class="river-stat"><span class="stat-label">延長</span><span class="stat-val">${d.length}</span></div>
        <div class="river-stat"><span class="stat-label">源流</span><span class="stat-val">${d.source}</span></div>
        <div class="river-stat"><span class="stat-label">合流先</span><span class="stat-val">${d.confluence}</span></div>
      </div>
      <div class="river-section">
        <div class="river-section-title">🪨 地質・地形</div>
        <p>${d.geology}</p>
      </div>
      <div class="river-section">
        <div class="river-section-title">💧 水質</div>
        <p>${d.water_quality}</p>
      </div>
      <div class="river-hazard" style="border-color:${riskColor}">
        <span class="hazard-risk" style="background:${riskColor}">洪水リスク ${riskLabel}</span>
        <span class="hazard-type">${d.hazard}</span>
      </div>
      <div class="river-links">
        <a href="${d.station_url}" target="_blank" class="river-link">📊 水位情報（川の防災情報）</a>
        <a href="https://www.river.go.jp/" target="_blank" class="river-link">🌊 水文水質DB</a>
      </div>
    </div>`;
  }

  function addMarker(river) {
    const m = L.marker([river.lat, river.lng], {
      icon: makeIcon(river),
      zIndexOffset: river.isMajor ? 200 : 0,
    }).bindPopup(makePopup(river), { maxWidth: 340 });
    markers.push(m);
    if (visible && mapRef) m.addTo(mapRef);
  }

  return {
    init(map) {
      mapRef = map;
    },

    addTo(map) {
      visible = true;
      mapRef = map;
      markers.forEach(m => m.addTo(map));
      if (!fetched) this.fetchRivers();
    },

    removeFrom(map) {
      visible = false;
      markers.forEach(m => map.removeLayer(m));
    },

    async fetchRivers() {
      fetched = true;
      updateRiverStatus('河川データ取得中...');
      try {
        const res = await fetch(
          'https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(OVERPASS_RIVER_QUERY)
        );
        const json = await res.json();
        const rivers = processRiverData(json.elements);

        // 主要河川を優先、小渓流は省略（セグメント2以上 or 主要河川）
        const filtered = rivers.filter(r => r.isMajor || r.segCount >= 2 || r.type === 'river');
        filtered.forEach(addMarker);
        updateRiverStatus(`${filtered.length}河川表示（主要河川${rivers.filter(r=>r.isMajor).length}件）`);
      } catch (e) {
        console.warn('River fetch failed:', e);
        updateRiverStatus('取得失敗');
      }
    },

    get count() { return markers.length; },
  };
})();

function updateRiverStatus(msg) {
  const el = document.getElementById('river-status');
  if (el) el.textContent = msg;
}
