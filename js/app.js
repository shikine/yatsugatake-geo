'use strict';

// ─── 定数 ───────────────────────────────────
const CENTER = [35.97, 138.37];
const ZOOM = 11;
const GSI_URL = 'https://cyberjapandata.gsi.go.jp/xyz/{id}/{z}/{x}/{y}.{ext}';
const ELEV_API = 'https://cyberjapandata2.gsi.go.jp/general/dem/scripts/getelevation.php';
// WMS は CORS 制限のためブラウザから直接呼び出せないため GeoJSON ポリゴンで代替

// ─── 状態 ───────────────────────────────────
let map, geoLayer, jshisLayer, landslideLayer;
let sectionMode = false;
let sectionPoints = [];
let sectionMarkers = [];
let sectionLine = null;
let boringMarkers = [];

// 古地図レイヤー
let oldMapLayers = {};
let compareControl = null;
let compareBaseLayer = null;

// ─── 初期化 ──────────────────────────────────
function init() {
  map = L.map('map', {
    center: CENTER,
    zoom: ZOOM,
    zoomControl: true,
  });

  // ベースレイヤー
  const baseLayers = {
    std: L.tileLayer(GSI_URL.replace('{id}', 'std').replace('{ext}', 'png'), {
      attribution: '&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>',
      maxZoom: 18,
    }),
    pale: L.tileLayer(GSI_URL.replace('{id}', 'pale').replace('{ext}', 'png'), {
      attribution: '&copy; 国土地理院', maxZoom: 18,
    }),
    relief: L.tileLayer(GSI_URL.replace('{id}', 'hillshademap').replace('{ext}', 'png'), {
      attribution: '&copy; 国土地理院', maxZoom: 16,
    }),
    photo: L.tileLayer(GSI_URL.replace('{id}', 'seamlessphoto').replace('{ext}', 'jpg'), {
      attribution: '&copy; 国土地理院', maxZoom: 18,
    }),
  };

  baseLayers.std.addTo(map);

  // 地質図 GeoJSON レイヤー（産総研シームレス地質図に基づく簡略ポリゴン）
  geoLayer = buildGeoLayer();

  // J-SHIS 地盤増幅率タイル（AVS30）
  jshisLayer = L.tileLayer(
    'https://www.j-shis.bosai.go.jp/map/JSHIS2/data/S/AVS30/AVS30_V2/{z}/{x}/{y}.png',
    {
      opacity: 0.55,
      attribution: '&copy; <a href="https://www.j-shis.bosai.go.jp/">防災科研 J-SHIS</a>',
      maxZoom: 14,
      errorTileUrl: '',
    }
  );

  // 土砂災害リスク（国土地理院 土砂災害警戒区域）
  landslideLayer = L.tileLayer.wms('https://disaportal.gsi.go.jp/kml/kyukeisha/wms', {
    layers: 'kyukeisha_keikaiall',
    format: 'image/png',
    transparent: true,
    opacity: 0.65,
    attribution: '&copy; 国土地理院 土砂災害警戒区域',
    errorTileUrl: '',
  });

  // 古地図専用パネル（クリップ制御用）
  map.createPane('oldMapPane');
  map.getPane('oldMapPane').style.zIndex = 250;

  // 古地図タイルレイヤー（国土地理院 地図・空中写真閲覧サービス）
  oldMapLayers = {
    meiji: L.tileLayer(
      'https://cyberjapandata.gsi.go.jp/xyz/jinsokuzu/{z}/{x}/{y}.png',
      {
        attribution: '&copy; <a href="https://www.gsi.go.jp/">国土地理院</a> 迅速測図（明治13〜19年）',
        pane: 'oldMapPane', maxZoom: 16, minZoom: 5, opacity: 0.85,
        errorTileUrl: '',
      }
    ),
    '1970': L.tileLayer(
      'https://cyberjapandata.gsi.go.jp/xyz/gazo1/{z}/{x}/{y}.jpg',
      {
        attribution: '&copy; 国土地理院 国土変遷アーカイブ（1970年代）',
        pane: 'oldMapPane', maxZoom: 17, minZoom: 5, opacity: 0.85,
        errorTileUrl: '',
      }
    ),
    '1980': L.tileLayer(
      'https://cyberjapandata.gsi.go.jp/xyz/gazo2/{z}/{x}/{y}.jpg',
      {
        attribution: '&copy; 国土地理院 国土変遷アーカイブ（1980年代）',
        pane: 'oldMapPane', maxZoom: 17, minZoom: 5, opacity: 0.85,
        errorTileUrl: '',
      }
    ),
    '1990': L.tileLayer(
      'https://cyberjapandata.gsi.go.jp/xyz/gazo3/{z}/{x}/{y}.jpg',
      {
        attribution: '&copy; 国土地理院 国土変遷アーカイブ（1990年代）',
        pane: 'oldMapPane', maxZoom: 17, minZoom: 5, opacity: 0.85,
        errorTileUrl: '',
      }
    ),
  };

  // 遺跡・詩歌・歌碑・河川レイヤー初期化
  RuinsLayer.init(map);
  PoemsLayer.init(map);
  KahiLayer.init(map);
  RiversLayer.init(map);

  // ボーリングマーカー追加
  addBoringMarkers();

  // 峰アイコン追加
  addPeakMarkers();

  // イベントリスナー
  setupControls(baseLayers);
  setupMapEvents();
  setupGeolocation();

  // 年表・地質ユニット一覧の初期化
  initTimeline();
  initGeoUnitsList();
}

function initGeoUnitsList() {
  const el = document.getElementById('geo-units-list');
  el.innerHTML = YATSUGATAKE_GEOLOGY.units.map(u => `
    <div class="geo-unit-row">
      <div class="geo-unit-swatch" style="background:${u.color}"></div>
      <div class="geo-unit-body">
        <div class="geo-unit-id">${u.id} <span style="font-weight:400;color:var(--text-muted)">${u.age}</span></div>
        <div class="geo-unit-name">${u.name}</div>
      </div>
    </div>`).join('');
}

// ─── 地質GeoJSONレイヤー ───────────────────────
function buildGeoLayer() {
  return L.geoJSON(GEOLOGY_GEOJSON, {
    style: feature => {
      const unit = YATSUGATAKE_GEOLOGY.units.find(u => u.id === feature.properties.unitId);
      return {
        fillColor: unit ? unit.color : '#888',
        fillOpacity: 0.55,
        color: unit ? unit.color : '#888',
        weight: 1,
        opacity: 0.7,
      };
    },
    onEachFeature: (feature, layer) => {
      const unit = YATSUGATAKE_GEOLOGY.units.find(u => u.id === feature.properties.unitId);
      layer.bindTooltip(
        `<b>${feature.properties.name}</b><br>${feature.properties.age}`,
        { sticky: true, className: 'geo-tooltip' }
      );
      layer.on('click', e => {
        L.DomEvent.stopPropagation(e);
        showUnitInfo(unit, feature.properties);
      });
    },
  });
}

function showUnitInfo(unit, props) {
  if (!unit) return;
  document.getElementById('info-content').innerHTML = `
    <div class="info-item">
      <div class="info-label">地質区分</div>
      <div class="info-value">
        <span class="geo-badge" style="background:${unit.color}22;color:${unit.color};border:1px solid ${unit.color}44">
          ${unit.id} ${unit.name}
        </span>
      </div>
    </div>
    <div class="info-item">
      <div class="info-label">地層名</div>
      <div class="info-value highlight">${props.name}</div>
    </div>
    <div class="info-item">
      <div class="info-label">地質時代</div>
      <div class="info-value">${unit.age}</div>
    </div>
    <div class="info-item">
      <div class="info-label">解説</div>
      <div class="info-value" style="font-size:0.78rem;line-height:1.6;color:#c8cce8">${unit.desc}</div>
    </div>
  `;
}

// ─── ボーリングマーカー ────────────────────────
function addBoringMarkers() {
  YATSUGATAKE_GEOLOGY.boringData.forEach(b => {
    const icon = L.divIcon({
      className: '',
      html: `<div class="boring-marker" style="width:10px;height:10px;"></div>`,
      iconSize: [10, 10],
      iconAnchor: [5, 5],
    });
    const m = L.marker([b.lat, b.lng], { icon })
      .bindPopup(boringPopupHtml(b), { maxWidth: 280 });
    boringMarkers.push(m);
    m.addTo(map);
  });
}

function boringPopupHtml(b) {
  const rows = b.layers.map(l =>
    `<tr>
      <td>${l.name}</td>
      <td>${l.from}〜${l.to}m</td>
      <td>${l.n === 50 ? '≥50' : l.n}</td>
      <td>${l.soil}</td>
    </tr>`
  ).join('');
  return `<div class="boring-popup">
    <h3>📊 ${b.name}（${b.id}）</h3>
    <p style="font-size:0.72rem;color:#666;margin-bottom:6px">調査深度 ${b.depth}m / ${b.year}年</p>
    <table class="strata-table">
      <thead><tr><th>地層</th><th>深度</th><th>N値</th><th>土質</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </div>`;
}

// ─── 峰マーカー ──────────────────────────────
function addPeakMarkers() {
  YATSUGATAKE_GEOLOGY.peaks.forEach(p => {
    const unit = YATSUGATAKE_GEOLOGY.units.find(u => u.id === p.geo);
    const color = unit ? unit.color : '#888';
    const icon = L.divIcon({
      className: '',
      html: `<div style="
        background:${color};color:#fff;font-size:0.65rem;font-weight:700;
        padding:2px 5px;border-radius:3px;white-space:nowrap;
        box-shadow:0 1px 4px rgba(0,0,0,0.5);
        border:1px solid rgba(255,255,255,0.4);
      ">▲ ${p.name}<br>${p.elev}m</div>`,
      iconAnchor: [0, 0],
    });
    L.marker([p.lat, p.lng], { icon, interactive: true })
      .on('click', () => showPeakInfo(p))
      .addTo(map);
  });
}

// ─── コントロール設定 ─────────────────────────
function setupControls(baseLayers) {
  // ベースマップ切替
  document.querySelectorAll('input[name="base"]').forEach(radio => {
    radio.addEventListener('change', () => {
      Object.values(baseLayers).forEach(l => map.removeLayer(l));
      baseLayers[radio.value].addTo(map);
    });
  });

  // オーバーレイ
  document.getElementById('layer-geo').addEventListener('change', e => {
    e.target.checked ? geoLayer.addTo(map) : map.removeLayer(geoLayer);
  });
  document.getElementById('layer-jshis').addEventListener('change', e => {
    e.target.checked ? jshisLayer.addTo(map) : map.removeLayer(jshisLayer);
  });
  document.getElementById('layer-landslide').addEventListener('change', e => {
    e.target.checked ? landslideLayer.addTo(map) : map.removeLayer(landslideLayer);
  });
  document.getElementById('layer-boring').addEventListener('change', e => {
    boringMarkers.forEach(m => e.target.checked ? m.addTo(map) : map.removeLayer(m));
  });

  // 遺跡レイヤー
  const ruinsFilterGroup = document.getElementById('ruins-filter-group');
  document.getElementById('layer-ruins').addEventListener('change', e => {
    if (e.target.checked) {
      RuinsLayer.addTo(map);
      ruinsFilterGroup.style.display = '';
    } else {
      RuinsLayer.removeFrom(map);
      ruinsFilterGroup.style.display = 'none';
    }
  });

  // 遺跡 時代フィルターボタン生成
  const filterContainer = document.getElementById('ruins-period-filter');
  RUIN_PERIODS.forEach(p => {
    const btn = document.createElement('button');
    btn.className = 'period-btn' + (p.id === 'all' ? ' active' : '');
    btn.dataset.period = p.id;
    btn.style.setProperty('--period-color', p.color);
    btn.textContent = p.label;
    btn.addEventListener('click', () => {
      document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const isVisible = document.getElementById('layer-ruins').checked;
      RuinsLayer.filterByPeriod(p.id, map, isVisible);
    });
    filterContainer.appendChild(btn);
  });

  // 地質図透過度
  document.getElementById('geo-opacity').addEventListener('input', e => {
    const opacity = e.target.value / 100;
    geoLayer.setStyle({ fillOpacity: opacity * 0.9, opacity });
  });

  // 詩歌レイヤー
  document.getElementById('layer-poems').addEventListener('change', e => {
    e.target.checked ? PoemsLayer.addTo(map) : PoemsLayer.removeFrom(map);
  });

  // 歌碑・句碑レイヤー
  document.getElementById('layer-kahi').addEventListener('change', e => {
    e.target.checked ? KahiLayer.addTo(map) : KahiLayer.removeFrom(map);
  });

  // 河川情報レイヤー
  document.getElementById('layer-rivers').addEventListener('change', e => {
    e.target.checked ? RiversLayer.addTo(map) : RiversLayer.removeFrom(map);
  });

  // 古地図レイヤー チェックボックス
  ['meiji', '1970', '1980', '1990'].forEach(key => {
    document.getElementById(`layer-${key}`).addEventListener('change', e => {
      if (e.target.checked) {
        oldMapLayers[key].addTo(map);
      } else {
        map.removeLayer(oldMapLayers[key]);
      }
    });
  });

  // 古地図透過度
  document.getElementById('old-opacity').addEventListener('input', e => {
    const opacity = e.target.value / 100;
    Object.values(oldMapLayers).forEach(l => l.setOpacity(opacity));
  });

  // 時代比較スライダー
  document.getElementById('btn-compare').addEventListener('click', toggleCompareMode);

  // 断面ツール
  document.getElementById('btn-section').addEventListener('click', toggleSectionMode);
  document.getElementById('btn-clear').addEventListener('click', clearAll);
  document.getElementById('btn-close-section').addEventListener('click', () => {
    document.getElementById('section-panel').classList.add('hidden');
  });

  // 3Dビューア
  document.getElementById('btn-3d').addEventListener('click', () => VIEWER3D.open());
  document.getElementById('btn-close-3d').addEventListener('click', () => VIEWER3D.close());
  document.getElementById('terrain-color-mode').addEventListener('change', e => {
    VIEWER3D.buildTerrain(e.target.value);
  });

  // タブ切替
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
      btn.classList.add('active');
      document.getElementById(`tab-${btn.dataset.tab}`).classList.remove('hidden');
    });
  });

  // エリアジャンプ
  document.querySelectorAll('.area-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      map.setView([+btn.dataset.lat, +btn.dataset.lng], +btn.dataset.zoom);
    });
  });
}

// ─── マップイベント ───────────────────────────
function setupMapEvents() {
  map.on('click', async e => {
    if (sectionMode) {
      handleSectionClick(e.latlng);
    } else {
      await showLocationInfo(e.latlng);
    }
  });
}

// ─── 地点情報表示 ─────────────────────────────
async function showLocationInfo(latlng) {
  setLoading(true);
  try {
    const elev = await getElevation(latlng.lat, latlng.lng);
    const unitId = YATSUGATAKE_GEOLOGY.estimateUnit(latlng.lat, latlng.lng, elev);
    const unit = YATSUGATAKE_GEOLOGY.units.find(u => u.id === unitId);
    const amp = YATSUGATAKE_GEOLOGY.amplificationByElevation(elev);
    const strata = YATSUGATAKE_GEOLOGY.stratigraphyModel(latlng.lat, latlng.lng, elev);

    const strataHtml = strata.map(s =>
      `<div class="strata-row">
        <div class="strata-color" style="background:${s.color}"></div>
        <span class="strata-name">${s.name}</span>
        <span class="strata-depth">${s.thickness ? s.thickness + 'm' : '深部'}</span>
      </div>`
    ).join('');

    const hazardPct = Math.min(95, Math.round((amp.factor / 3.5) * 100));
    const ampColor = amp.risk === 'low' ? '#4caf50' : amp.risk === 'medium' ? '#ff9800' : '#f44336';

    document.getElementById('info-content').innerHTML = `
      <div class="info-item">
        <div class="info-label">座標</div>
        <div class="info-value">${latlng.lat.toFixed(5)}°N, ${latlng.lng.toFixed(5)}°E</div>
      </div>
      <div class="info-item">
        <div class="info-label">標高</div>
        <div class="info-value highlight">${elev !== null ? elev + ' m' : 'データなし'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">推定地質区分</div>
        <div class="info-value">
          <span class="geo-badge" style="background:${unit?.color}22;color:${unit?.color};border:1px solid ${unit?.color}44">
            ${unit?.id ?? '不明'} ${unit?.name ?? ''}
          </span>
          <p style="font-size:0.75rem;color:#8890b0;margin-top:4px;line-height:1.5">${unit?.desc ?? ''}</p>
        </div>
      </div>
      <div class="info-item">
        <div class="info-label">地盤増幅率（AVS30推定）</div>
        <div class="info-value" style="color:${ampColor}">${amp.label}</div>
        <div class="hazard-bar">
          <div class="hazard-indicator" style="left:${hazardPct}%"></div>
        </div>
      </div>
      <div class="info-item">
        <div class="info-label">推定地層構成</div>
        <div class="stratigraphy">${strataHtml}</div>
      </div>
    `;

    // マーカー追加
    L.circleMarker([latlng.lat, latlng.lng], {
      radius: 6, color: '#fff', fillColor: unit?.color ?? '#888',
      fillOpacity: 0.9, weight: 2
    }).addTo(map);

  } catch (err) {
    console.error(err);
    document.getElementById('info-content').innerHTML =
      '<p class="placeholder">情報取得に失敗しました</p>';
  }
  setLoading(false);
}

// ─── 峰情報 ──────────────────────────────────
function showPeakInfo(peak) {
  const unit = YATSUGATAKE_GEOLOGY.units.find(u => u.id === peak.geo);
  const hazardPct = Math.round(peak.hazard * 100);
  const hColor = peak.hazard > 0.7 ? '#f44336' : peak.hazard > 0.5 ? '#ff9800' : '#4caf50';

  document.getElementById('info-content').innerHTML = `
    <div class="info-item">
      <div class="info-label">山名</div>
      <div class="info-value highlight" style="font-size:1.1rem">▲ ${peak.name}</div>
    </div>
    <div class="info-item">
      <div class="info-label">標高</div>
      <div class="info-value highlight">${peak.elev} m</div>
    </div>
    <div class="info-item">
      <div class="info-label">主要地質</div>
      <div class="info-value">
        <span class="geo-badge" style="background:${unit?.color}22;color:${unit?.color};border:1px solid ${unit?.color}44">
          ${unit?.id} ${unit?.name}
        </span>
      </div>
    </div>
    <div class="info-item">
      <div class="info-label">地質解説</div>
      <div class="info-value" style="font-size:0.78rem;line-height:1.6;color:#c8cce8">${peak.desc}</div>
    </div>
    <div class="info-item">
      <div class="info-label">崩壊・地盤リスク</div>
      <div class="info-value" style="color:${hColor};font-weight:700">${hazardPct}%</div>
      <div class="hazard-bar">
        <div class="hazard-indicator" style="left:${hazardPct}%"></div>
      </div>
    </div>
  `;
}

// ─── 断面ツール ──────────────────────────────
function toggleSectionMode() {
  sectionMode = !sectionMode;
  const btn = document.getElementById('btn-section');
  const hint = document.getElementById('section-hint');
  if (sectionMode) {
    btn.classList.add('active');
    btn.innerHTML = '<span class="icon">📐</span> 断面モード ON';
    hint.textContent = '始点をクリック →';
    map.getContainer().style.cursor = 'crosshair';
  } else {
    btn.classList.remove('active');
    btn.innerHTML = '<span class="icon">📐</span> 地層断面を引く';
    hint.textContent = '';
    map.getContainer().style.cursor = '';
  }
}

async function handleSectionClick(latlng) {
  sectionPoints.push(latlng);
  const icon = L.divIcon({
    className: '',
    html: `<div class="section-marker-icon" style="width:14px;height:14px;"></div>`,
    iconSize: [14, 14], iconAnchor: [7, 7],
  });
  sectionMarkers.push(L.marker(latlng, { icon }).addTo(map));

  const hint = document.getElementById('section-hint');

  if (sectionPoints.length === 1) {
    hint.textContent = '終点をクリック →';
    return;
  }

  if (sectionPoints.length >= 2) {
    const [p1, p2] = sectionPoints;
    if (sectionLine) map.removeLayer(sectionLine);
    sectionLine = L.polyline([p1, p2], {
      color: '#7c9ef5', weight: 2.5, dashArray: '6 4'
    }).addTo(map);

    sectionPoints = [];
    sectionMarkers = [];
    toggleSectionMode();
    hint.textContent = '';

    await buildCrossSection(p1, p2);
  }
}

// ─── 断面図生成 ──────────────────────────────
async function buildCrossSection(p1, p2) {
  setLoading(true);
  const N = 30;
  const points = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    points.push({
      lat: p1.lat + (p2.lat - p1.lat) * t,
      lng: p1.lng + (p2.lng - p1.lng) * t,
      dist: haversine(p1, { lat: p1.lat + (p2.lat - p1.lat) * t, lng: p1.lng + (p2.lng - p1.lng) * t }),
    });
  }

  // 標高取得（並列）
  const elevs = await Promise.all(
    points.map(pt => getElevation(pt.lat, pt.lng))
  );

  setLoading(false);

  const validElevs = elevs.map(e => e ?? 0);
  const minElev = Math.min(...validElevs) - 200;
  const maxElev = Math.max(...validElevs) + 100;
  const totalDist = haversine(p1, p2);

  document.getElementById('section-panel').classList.remove('hidden');

  drawCrossSection(points, validElevs, minElev, maxElev, totalDist, p1, p2);
}

function drawCrossSection(points, elevs, minElev, maxElev, totalDist, p1, p2) {
  const canvas = document.getElementById('section-canvas');
  const container = document.getElementById('section-container');
  canvas.width = container.clientWidth - 180;
  canvas.height = container.clientHeight - 16;
  const ctx = canvas.getContext('2d');

  const W = canvas.width, H = canvas.height;
  const PAD = { top: 20, right: 20, bottom: 40, left: 55 };
  const cw = W - PAD.left - PAD.right;
  const ch = H - PAD.top - PAD.bottom;

  const toX = dist => PAD.left + (dist / totalDist) * cw;
  const toY = elev => PAD.top + ch - ((elev - minElev) / (maxElev - minElev)) * ch;

  ctx.clearRect(0, 0, W, H);

  // 地層を背景として描画
  for (let i = 0; i < points.length - 1; i++) {
    const pt = points[i];
    const elev = elevs[i];
    const strata = YATSUGATAKE_GEOLOGY.stratigraphyModel(pt.lat, pt.lng, elev);
    let baseDepth = elev;

    strata.forEach((s, si) => {
      const topY = toY(baseDepth);
      const bottomElev = s.thickness ? baseDepth - s.thickness : minElev;
      const bottomY = toY(bottomElev);
      const x1 = toX(pt.dist);
      const x2 = i + 1 < points.length ? toX(points[i + 1].dist) : x1 + 2;

      ctx.fillStyle = hexToRgba(s.color, si === 0 ? 0.55 : 0.7);
      ctx.fillRect(x1, topY, x2 - x1 + 1, bottomY - topY);
      baseDepth = Math.max(bottomElev, minElev);
    });
  }

  // グリッド
  ctx.strokeStyle = 'rgba(120,130,170,0.2)';
  ctx.lineWidth = 1;
  const elevStep = Math.ceil((maxElev - minElev) / 5 / 100) * 100;
  for (let e = Math.ceil(minElev / elevStep) * elevStep; e <= maxElev; e += elevStep) {
    const y = toY(e);
    ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(W - PAD.right, y); ctx.stroke();
    ctx.fillStyle = 'rgba(180,190,220,0.8)';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(e + 'm', PAD.left - 4, y + 4);
  }

  // 距離軸
  ctx.fillStyle = 'rgba(180,190,220,0.8)';
  ctx.font = '10px sans-serif';
  ctx.textAlign = 'center';
  for (let km = 0; km <= Math.ceil(totalDist); km++) {
    const x = toX(km * 1000);
    if (x > PAD.left && x < W - PAD.right) {
      ctx.fillText(km + 'km', x, H - PAD.bottom + 14);
    }
  }

  // 地表ライン
  ctx.beginPath();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.shadowColor = 'rgba(255,255,255,0.5)';
  ctx.shadowBlur = 4;
  points.forEach((pt, i) => {
    const x = toX(pt.dist), y = toY(elevs[i]);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.shadowBlur = 0;

  // 地表塗りつぶし
  ctx.beginPath();
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  points.forEach((pt, i) => {
    const x = toX(pt.dist), y = toY(elevs[i]);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.lineTo(toX(points[points.length - 1].dist), H - PAD.bottom);
  ctx.lineTo(PAD.left, H - PAD.bottom);
  ctx.fill();

  // 端点ラベル
  ctx.fillStyle = '#7c9ef5';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('A', PAD.left, PAD.top - 6);
  ctx.textAlign = 'right';
  ctx.fillText("A'", W - PAD.right, PAD.top - 6);

  // 凡例
  const midIdx = Math.floor(points.length / 2);
  const midStrata = YATSUGATAKE_GEOLOGY.stratigraphyModel(
    points[midIdx].lat, points[midIdx].lng, elevs[midIdx]
  );
  const legend = document.getElementById('section-legend');
  legend.innerHTML = '<p style="font-size:0.7rem;color:#8890b0;margin-bottom:6px;font-weight:700">凡例</p>';
  midStrata.forEach(s => {
    legend.innerHTML += `
      <div class="legend-item">
        <div class="legend-color" style="background:${s.color}"></div>
        <span>${s.name}</span>
      </div>`;
  });
}

// ─── ユーティリティ ──────────────────────────
async function getElevation(lat, lng) {
  try {
    const res = await fetch(`${ELEV_API}?lon=${lng}&lat=${lat}&outtype=JSON`);
    const data = await res.json();
    return data.elevation !== null ? Math.round(data.elevation) : null;
  } catch {
    return null;
  }
}

function haversine(p1, p2) {
  const R = 6371000;
  const dLat = (p2.lat - p1.lat) * Math.PI / 180;
  const dLng = (p2.lng - p1.lng) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(p1.lat * Math.PI / 180) * Math.cos(p2.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ─── 時代比較スライダー（カスタム実装） ──────────────────────
let compareSliderEl = null;
let compareDividerEl = null;

function toggleCompareMode() {
  const btn = document.getElementById('btn-compare');
  const sel = document.getElementById('compare-old-layer');

  if (compareControl) {
    // 比較モード終了
    if (compareBaseLayer) { map.removeLayer(compareBaseLayer); compareBaseLayer = null; }
    if (compareSliderEl) { compareSliderEl.remove(); compareSliderEl = null; }
    if (compareDividerEl) { compareDividerEl.remove(); compareDividerEl = null; }
    map.getPane('oldMapPane').style.clipPath = '';
    compareControl = null;
    btn.classList.remove('active');
    btn.innerHTML = '<span class="icon">🔀</span> 比較モード ON';
    return;
  }

  const oldKey = sel.value;
  if (!oldKey) { alert('比較する古地図を選択してください'); return; }

  // 他の古地図チェックを外してから比較用レイヤーを追加
  ['meiji', '1970', '1980', '1990'].forEach(k => {
    document.getElementById(`layer-${k}`).checked = false;
    map.removeLayer(oldMapLayers[k]);
  });
  compareBaseLayer = oldMapLayers[oldKey];
  compareBaseLayer.addTo(map);

  // スライダーをマップ上に追加
  const mapContainer = map.getContainer();

  compareSliderEl = document.createElement('input');
  compareSliderEl.type = 'range';
  compareSliderEl.min = 0;
  compareSliderEl.max = 100;
  compareSliderEl.value = 50;
  compareSliderEl.className = 'compare-range-input';
  mapContainer.appendChild(compareSliderEl);

  compareDividerEl = document.createElement('div');
  compareDividerEl.className = 'compare-divider';
  mapContainer.appendChild(compareDividerEl);

  // ラベル
  const labels = { meiji: '迅速測図（明治）', '1970': '1970年代', '1980': '1980年代', '1990': '1990年代' };
  const leftLabel = document.createElement('div');
  leftLabel.className = 'compare-label compare-label-left';
  leftLabel.textContent = labels[oldKey];
  compareDividerEl.appendChild(leftLabel);
  const rightLabel = document.createElement('div');
  rightLabel.className = 'compare-label compare-label-right';
  rightLabel.textContent = '現代（標準地図）';
  compareDividerEl.appendChild(rightLabel);

  function updateClip(pct) {
    const w = mapContainer.clientWidth;
    const x = Math.round(w * pct / 100);
    map.getPane('oldMapPane').style.clipPath = `inset(0 ${w - x}px 0 0)`;
    compareDividerEl.style.left = x + 'px';
  }

  compareSliderEl.addEventListener('input', e => updateClip(+e.target.value));
  updateClip(50);

  compareControl = true; // フラグとして使用
  btn.classList.add('active');
  btn.innerHTML = `<span class="icon">🔀</span> 比較中 ← → (終了)`;
}

// ─── 現在地 ──────────────────────────────────
let locationMarker = null;
let locationCircle = null;

function setupGeolocation() {
  const btn = document.getElementById('btn-locate');
  if (!btn) return;
  btn.addEventListener('click', locateUser);
}

function locateUser() {
  if (!navigator.geolocation) {
    alert('このブラウザは位置情報に対応していません');
    return;
  }
  const btn = document.getElementById('btn-locate');
  btn.classList.add('active');
  btn.innerHTML = '<span class="icon">📍</span> 取得中...';

  navigator.geolocation.getCurrentPosition(
    pos => {
      const { latitude: lat, longitude: lng, accuracy } = pos.coords;

      // 既存マーカーを削除
      if (locationMarker) { map.removeLayer(locationMarker); map.removeLayer(locationCircle); }

      // 精度円
      locationCircle = L.circle([lat, lng], {
        radius: accuracy,
        color: '#4a90e2', fillColor: '#4a90e2', fillOpacity: 0.1, weight: 1,
      }).addTo(map);

      // 現在地マーカー
      const icon = L.divIcon({
        className: '',
        html: `<div style="
          width:16px;height:16px;background:#4a90e2;
          border:3px solid #fff;border-radius:50%;
          box-shadow:0 0 0 3px rgba(74,144,226,0.4);
        "></div>`,
        iconSize: [16, 16], iconAnchor: [8, 8],
      });
      locationMarker = L.marker([lat, lng], { icon })
        .bindPopup(`<b>現在地</b><br>精度: ±${Math.round(accuracy)}m`)
        .addTo(map)
        .openPopup();

      map.setView([lat, lng], 13);

      btn.classList.remove('active');
      btn.innerHTML = '<span class="icon">📍</span> 現在地';
    },
    err => {
      btn.classList.remove('active');
      btn.innerHTML = '<span class="icon">📍</span> 現在地';
      alert('位置情報を取得できませんでした: ' + err.message);
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

function clearAll() {
  sectionPoints = [];
  if (sectionLine) { map.removeLayer(sectionLine); sectionLine = null; }
  sectionMarkers.forEach(m => map.removeLayer(m));
  sectionMarkers = [];
  document.getElementById('section-panel').classList.add('hidden');
  document.getElementById('info-content').innerHTML =
    '<p class="placeholder">地図をクリックすると<br>地質情報を表示します</p>';
  if (sectionMode) toggleSectionMode();
}

function setLoading(show) {
  document.getElementById('loading').classList.toggle('hidden', !show);
}

// ─── モバイル対応 ────────────────────────────
const IS_MOBILE = () => window.innerWidth <= 768;
let sheetOpen = false;

function initMobile() {
  // リスナーは常に設定し、IS_MOBILE()は各ハンドラ内で確認

  const sidebar  = document.getElementById('sidebar');
  const handle   = document.getElementById('sheet-handle');

  // ─ ボトムシート 開閉 ─
  function openSheet() {
    sidebar.classList.add('sheet-open');
    sheetOpen = true;
    document.querySelectorAll('.bnav-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.tab === currentTab);
    });
  }

  function closeSheet() {
    sidebar.classList.remove('sheet-open');
    sheetOpen = false;
  }

  function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
    const btn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
    const content = document.getElementById(`tab-${tabId}`);
    if (btn) btn.classList.add('active');
    if (content) content.classList.remove('hidden');
    currentTab = tabId;
  }

  let currentTab = 'map';

  // ─ ボトムナビ ─
  document.querySelectorAll('.bnav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      if (tab === 'info') {
        // 情報タブ：現在の地点情報を表示
        switchTab('map');
        document.getElementById('tab-map').scrollTop = 9999; // infoまでスクロール
        openSheet();
      } else {
        switchTab(tab);
        if (!sheetOpen) {
          openSheet();
        } else if (currentTab === tab) {
          closeSheet(); // 同じタブ再タップで閉じる
        } else {
          openSheet();
        }
      }
      document.querySelectorAll('.bnav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // ─ FAB ─
  document.getElementById('fab-locate')?.addEventListener('click', locateUser);
  document.getElementById('fab-3d')?.addEventListener('click', () => VIEWER3D.open());
  document.getElementById('fab-section')?.addEventListener('click', () => {
    closeSheet();
    toggleSectionMode();
  });

  // ─ ハンドルドラッグ ─
  let dragStartY = 0, dragStartTranslate = 0, isDragging = false;

  handle.addEventListener('touchstart', e => {
    isDragging = true;
    dragStartY = e.touches[0].clientY;
    dragStartTranslate = sheetOpen ? 0 : sidebar.clientHeight;
    sidebar.style.transition = 'none';
  }, { passive: true });

  handle.addEventListener('touchmove', e => {
    if (!isDragging) return;
    const dy = e.touches[0].clientY - dragStartY;
    const newTranslate = Math.max(0, dragStartTranslate + dy);
    sidebar.style.transform = `translateY(${newTranslate}px)`;
  }, { passive: true });

  handle.addEventListener('touchend', e => {
    if (!isDragging) return;
    isDragging = false;
    sidebar.style.transition = '';
    sidebar.style.transform = '';
    const dy = e.changedTouches[0].clientY - dragStartY;
    if (dy > 60) {
      closeSheet(); // 下方向にドラッグ → 閉じる
    } else if (dy < -30) {
      openSheet();  // 上方向にドラッグ → 開く
    } else {
      sheetOpen ? openSheet() : closeSheet(); // 元に戻す
    }
  }, { passive: true });

  // ─ マップクリック時に情報タブを開く ─
  map.on('click', () => {
    if (!IS_MOBILE()) return;
    // 地図クリック後、少し待ってから情報パネルが更新されていたら開く
    setTimeout(() => {
      const content = document.getElementById('info-content');
      if (content && !content.querySelector('.placeholder')) {
        switchTab('map');
        openSheet();
        document.querySelectorAll('.bnav-btn').forEach(b => {
          b.classList.toggle('active', b.dataset.tab === 'info');
        });
      }
    }, 400);
  });

  // ─ シートの外（マップ）タップで閉じる ─
  document.getElementById('map').addEventListener('click', () => {
    if (sheetOpen) closeSheet();
  });
}

// ─── 起動 ────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => { init(); initMobile(); });
