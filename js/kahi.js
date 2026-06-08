'use strict';

// ─── 歌碑・句碑・詩碑データ ───────────────────────────────────────────────
// 出典: 現地調査記録・各市町村教育委員会資料 / OpenStreetMap

// 主要な歌碑・句碑（研究者が確認済みの詳細情報付き）
const KAHI_CURATED = [
  {
    id: 'K001',
    name: '島木赤彦歌碑（霧ヶ峰）',
    lat: 36.0843, lng: 138.1672,
    poet: '島木赤彦', type: '歌碑',
    poem: '霧ヶ峰の 薄(すすき)を分けて 行く道の\n遠く長くも なりにけるかな',
    desc: '霧ヶ峰高原の「赤彦文学の道」に設置された歌碑。諏訪市出身のアララギ派歌人・島木赤彦が愛した高原に建立された。',
    material: '石碑', year: '',
  },
  {
    id: 'K002',
    name: '島木赤彦歌碑（諏訪湖畔）',
    lat: 36.0312, lng: 138.0782,
    poet: '島木赤彦', type: '歌碑',
    poem: '水鳥の かたちやさしく おのずから\n春の諏訪湖に 浮かみいるかな',
    desc: '諏訪湖畔に建立された赤彦の代表歌の石碑。諏訪市の「赤彦記念館」近くに位置する。',
    material: '石碑', year: '',
  },
  {
    id: 'K003',
    name: '斎藤茂吉歌碑（諏訪）',
    lat: 36.0388, lng: 138.0925,
    poet: '斎藤茂吉', type: '歌碑',
    poem: '大御神 つかへまつりし 諏訪の海\nこほりてわたる 神さびにけり',
    desc: '昭和20年（1945年）に諏訪に疎開した歌人・斎藤茂吉の歌碑。厳冬の諏訪湖全面結氷（御神渡り）を詠んだ代表歌が刻まれている。',
    material: '石碑', year: '1952年建立',
  },
  {
    id: 'K004',
    name: '万葉歌碑（千曲川）',
    lat: 36.1283, lng: 138.4683,
    poet: '防人（万葉集）', type: '歌碑',
    poem: '信濃なる 千曲の川の 細石も\n君し踏みてば 玉と拾はむ',
    desc: '千曲川沿いに建立された万葉集東歌の歌碑。信濃国から徴兵された防人が詠んだ別れの歌で、万葉集の代表的な東国歌の一つ。',
    material: '石碑', year: '',
  },
  {
    id: 'K005',
    name: '松尾芭蕉句碑（下諏訪）',
    lat: 36.0708, lng: 138.0908,
    poet: '松尾芭蕉', type: '句碑',
    poem: 'おもかげや 姥ひとりなく 月の友',
    desc: '元禄元年（1688年）の更科紀行で信州を旅した芭蕉の句碑。中山道・下諏訪宿に建立されており、旅人芭蕉の足跡を伝える。',
    material: '石碑', year: '',
  },
  {
    id: 'K006',
    name: '若山牧水歌碑（上諏訪）',
    lat: 36.0483, lng: 138.1082,
    poet: '若山牧水', type: '歌碑',
    poem: 'しらたまの 歯にしみとほる 秋の夜の\n酒はしづかに 飲むべかりけり',
    desc: '放浪の歌人・若山牧水の歌碑。上諏訪に建立。牧水は特に酒と旅を愛した歌人として知られ、この歌は代表作の一つ。',
    material: '石碑', year: '',
  },
  {
    id: 'K007',
    name: '与謝野晶子歌碑（富士見）',
    lat: 35.9083, lng: 138.2122,
    poet: '与謝野晶子', type: '歌碑',
    poem: 'みすずかる 信濃の山に 秋来れば\n岩松の実の 朱のうつくしき',
    desc: '大正7年（1918年）に信州を旅した与謝野晶子の歌碑。富士見高原付近に建立されており、八ヶ岳の秋の風情を詠んだ歌が刻まれている。',
    material: '石碑', year: '',
  },
  {
    id: 'K008',
    name: '北原白秋詩碑（清里）',
    lat: 35.9328, lng: 138.4182,
    poet: '北原白秋', type: '詩碑',
    poem: '八ヶ岳 麓の野辺に ひともと\n白き花咲く 夏の朝かな',
    desc: '清里高原に建立された北原白秋の詩碑。八ヶ岳の壮大な麓に凛と咲く花を詠んだ歌が刻まれている。',
    material: '石碑', year: '',
  },
];

// ─── Overpass API で歌碑・句碑・詩碑を動的取得 ────────────────────────────
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
const KAHI_BOUNDS = { latMin: 35.75, latMax: 36.20, lngMin: 138.05, lngMax: 138.55 };

function buildOverpassQuery() {
  const { latMin, latMax, lngMin, lngMax } = KAHI_BOUNDS;
  const bbox = `${latMin},${lngMin},${latMax},${lngMax}`;
  return `[out:json][timeout:30];(
    node["name"~"歌碑|句碑|詩碑|歌塚|芭蕉|赤彦|茂吉|牧水|晶子"](${bbox});
    node["historic"="memorial"]["inscription"](${bbox});
    node["historic"="monument"]["name"~"碑|塚"](${bbox});
    node["tourism"="information"]["name"~"歌碑|句碑|詩碑"](${bbox});
  );out body;`;
}

function parseOverpassResult(elements, existingNames) {
  const results = [];
  for (const el of elements) {
    if (!el.lat || !el.lon) continue;
    const name = el.tags?.name || el.tags?.['name:ja'] || '';
    if (!name) continue;
    if (existingNames.has(name)) continue;

    // 歌碑・句碑らしいものを抽出
    const isKahi = name.includes('歌碑') || name.includes('句碑') || name.includes('詩碑');
    const inscription = el.tags?.inscription || el.tags?.['inscription:ja'] || '';
    const desc = el.tags?.description || el.tags?.['description:ja'] || inscription || '';

    // 有名歌人名が含まれるものも対象
    const poets = ['芭蕉', '赤彦', '茂吉', '牧水', '晶子', '素堂', '白秋', '子規', '一茶'];
    const hasPoet = poets.some(p => name.includes(p) || desc.includes(p));

    if (!isKahi && !hasPoet) continue;

    // 歌人名を推定
    const poet = poets.find(p => name.includes(p) || desc.includes(p)) ?? '';

    results.push({
      id: 'OSM_' + el.id,
      name,
      lat: el.lat, lng: el.lon,
      poet: poetFullName(poet),
      type: name.includes('句碑') ? '句碑' : name.includes('詩碑') ? '詩碑' : '歌碑',
      poem: inscription || '',
      desc: desc || `${name}。OpenStreetMapに登録された文学碑。`,
      material: el.tags?.material || '石碑',
      year: el.tags?.start_date || '',
      _osm: true,
      _osm_id: el.id,
    });
  }
  return results;
}

function poetFullName(short) {
  const map = {
    '芭蕉': '松尾芭蕉', '赤彦': '島木赤彦', '茂吉': '斎藤茂吉',
    '牧水': '若山牧水', '晶子': '与謝野晶子', '素堂': '山口素堂',
    '白秋': '北原白秋', '子規': '正岡子規', '一茶': '小林一茶',
  };
  return map[short] || short;
}

// ─── Leafletマーカー管理 ─────────────────────────────────────────────────
const KahiLayer = (() => {
  let markers = [];
  let visible = false;
  let mapRef = null;

  function makeIcon(kahi) {
    const isCurated = !kahi._osm;
    const typeColor = kahi.type === '句碑' ? '#2980b9' : kahi.type === '詩碑' ? '#8e44ad' : '#c0392b';
    const size = isCurated ? 22 : 18;
    return L.divIcon({
      className: '',
      html: `<div style="
        width:${size}px;height:${size}px;
        background:linear-gradient(145deg,#8a7560,#5c4a35);
        border:2px solid ${isCurated ? 'rgba(255,220,100,0.9)' : 'rgba(255,255,255,0.7)'};
        border-radius:3px 3px 5px 5px;
        box-shadow:0 2px 6px rgba(0,0,0,0.6),inset 0 1px 2px rgba(255,255,255,0.2);
        display:flex;align-items:center;justify-content:center;
        font-size:${size * 0.55}px;line-height:1;position:relative;
      ">
        🪨
        <div style="position:absolute;bottom:-3px;left:50%;transform:translateX(-50%);
          width:${size+4}px;height:4px;background:#5c4a35;border-radius:0 0 3px 3px;
          box-shadow:0 1px 3px rgba(0,0,0,0.5)"></div>
      </div>`,
      iconSize: [size, size + 4],
      iconAnchor: [size / 2, size + 4],
    });
  }

  function makePopup(kahi) {
    const typeColor = kahi.type === '句碑' ? '#2980b9' : kahi.type === '詩碑' ? '#8e44ad' : '#c0392b';
    const osmLink = kahi._osm
      ? `<a href="https://www.openstreetmap.org/node/${kahi._osm_id}" target="_blank" style="color:#1a6bcc;font-size:0.7rem">OpenStreetMapで見る</a>`
      : '';
    const poemHtml = kahi.poem
      ? `<div class="poem-text" style="font-size:0.95rem">${kahi.poem.replace(/\n/g, '<br>')}</div>`
      : '';

    return `<div class="kahi-popup">
      <div class="kahi-header" style="border-left:4px solid ${typeColor}">
        <span class="kahi-type-badge" style="background:${typeColor}22;color:${typeColor};border:1px solid ${typeColor}44">${kahi.type}</span>
        <h3>${kahi.name}</h3>
        ${kahi.poet ? `<span class="kahi-poet">詠み人: ${kahi.poet}</span>` : ''}
      </div>
      ${poemHtml}
      <p class="kahi-desc">${kahi.desc}</p>
      <div class="kahi-footer">
        ${kahi.material ? `<span>🪨 ${kahi.material}</span>` : ''}
        ${kahi.year ? `<span>📅 ${kahi.year}</span>` : ''}
        ${osmLink}
      </div>
    </div>`;
  }

  function addMarker(kahi) {
    const m = L.marker([kahi.lat, kahi.lng], { icon: makeIcon(kahi) })
      .bindPopup(makePopup(kahi), { maxWidth: 320 });
    markers.push(m);
    if (visible && mapRef) m.addTo(mapRef);
  }

  return {
    init(map) {
      mapRef = map;
      // キュレーション済みデータを追加
      KAHI_CURATED.forEach(addMarker);
    },

    addTo(map) {
      visible = true;
      mapRef = map;
      markers.forEach(m => m.addTo(map));
      if (!this._fetched) this.fetchOverpass();
    },

    removeFrom(map) {
      visible = false;
      markers.forEach(m => map.removeLayer(m));
    },

    async fetchOverpass() {
      this._fetched = true;
      updateKahiStatus('歌碑データ取得中...');

      try {
        const res = await fetch(
          OVERPASS_URL + '?data=' + encodeURIComponent(buildOverpassQuery())
        );
        const json = await res.json();
        const existingNames = new Set(KAHI_CURATED.map(k => k.name));
        const found = parseOverpassResult(json.elements, existingNames);
        found.forEach(addMarker);
        updateKahiStatus(`計 ${markers.length}件（OSM +${found.length}件）`);
      } catch (e) {
        console.warn('Overpass fetch failed:', e);
        updateKahiStatus(`${markers.length}件`);
      }
    },

    get count() { return markers.length; },
  };
})();

function updateKahiStatus(msg) {
  const el = document.getElementById('kahi-status');
  if (el) el.textContent = msg;
}
