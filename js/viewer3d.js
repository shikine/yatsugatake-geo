'use strict';

// ─── 3D地形ビューア ────────────────────────────────────────────────────────
// Three.jsを使った合成地形モデル（GSI標高APIに基づく地形パラメータ）
// 実際の峰データから逆距離加重補間で標高グリッドを生成

const VIEWER3D = (() => {
  let scene, camera, renderer, controls, animId;
  let terrain = null;
  let colorMode = 'elevation';

  // 八ヶ岳コア範囲（山岳部に絞って高低差を強調）
  const BOUNDS = {
    latMin: 35.87, latMax: 36.13,
    lngMin: 138.23, lngMax: 138.50,
  };
  const GRID = 72; // 72x72グリッド

  // ─── 合成標高モデル ───────────────────────────────────────────
  // 実際の峰データ＋周辺地形パラメータから補間
  function syntheticElev(lat, lng) {
    const peaks = YATSUGATAKE_GEOLOGY.peaks;

    // 距離ベースのベース標高（八ヶ岳主稜線に近いほど高い）
    const ridgeLat = 35.97 + (lng - 138.37) * 0.3;
    const distFromRidge = Math.sqrt(
      Math.pow((lat - ridgeLat) * 111000, 2) +
      Math.pow((lng - 138.37) * 91000, 2)
    );
    const base = 750 + Math.max(0, 1 - distFromRidge / 18000) * 900;

    // 各峰からのガウス的な貢献（逆距離加重）
    let peakSum = 0, wSum = 0;
    peaks.forEach(pk => {
      const dlat = (lat - pk.lat) * 111000;
      const dlng = (lng - pk.lng) * 91000;
      const d2 = dlat * dlat + dlng * dlng;
      const sigma2 = 4500 * 4500;
      const w = Math.exp(-d2 / (2 * sigma2));
      peakSum += pk.elev * w;
      wSum += w;
    });

    const peakContrib = wSum > 0.001 ? peakSum / wSum : base;
    const elevation = Math.max(base, base * 0.3 + peakContrib * 0.7);

    // 地形の細かいテクスチャ（決定論的ノイズ）
    const noise = Math.sin(lat * 310) * Math.cos(lng * 250) * 18
                + Math.sin(lat * 520 + lng * 300) * 8;

    return Math.max(650, elevation + noise);
  }

  // ─── 標高→色変換（モード別） ─────────────────────────────────
  function elevToColor(elev, lat, lng, mode) {
    if (mode === 'geology') {
      const unitId = YATSUGATAKE_GEOLOGY.estimateUnit(lat, lng, elev);
      const unit = YATSUGATAKE_GEOLOGY.units.find(u => u.id === unitId);
      const hex = unit ? unit.color : '#888888';
      return new THREE.Color(hex);
    }
    if (mode === 'hazard') {
      const amp = YATSUGATAKE_GEOLOGY.amplificationByElevation(elev);
      if (amp.risk === 'low') return new THREE.Color(0.20, 0.65, 0.30);
      if (amp.risk === 'medium') return new THREE.Color(0.90, 0.62, 0.10);
      if (amp.risk === 'high') return new THREE.Color(0.85, 0.25, 0.15);
      return new THREE.Color(0.55, 0.05, 0.05);
    }
    // elevation mode
    if (elev > 2700) return new THREE.Color(0.95, 0.95, 0.97);  // 雪・岩峰
    if (elev > 2400) return new THREE.Color(0.72, 0.58, 0.52);  // 火山岩露出
    if (elev > 2000) return new THREE.Color(0.62, 0.42, 0.30);  // 高山帯
    if (elev > 1700) return new THREE.Color(0.22, 0.50, 0.25);  // 亜高山帯林
    if (elev > 1400) return new THREE.Color(0.28, 0.60, 0.32);  // 山地帯林
    if (elev > 1100) return new THREE.Color(0.52, 0.70, 0.38);  // 山麓草地
    return new THREE.Color(0.72, 0.80, 0.50);                   // 平地・農地
  }

  // ─── 地形メッシュ生成 ─────────────────────────────────────────
  const ELEV_MIN = 700;
  const ELEV_MAX = 2950;
  const TERRAIN_HEIGHT = 90;  // 垂直方向を強調
  const TERRAIN_SIZE = 100;

  function elevToY(elev) {
    return ((elev - ELEV_MIN) / (ELEV_MAX - ELEV_MIN)) * TERRAIN_HEIGHT;
  }

  function buildTerrainMesh(mode) {
    const latRange = BOUNDS.latMax - BOUNDS.latMin;
    const lngRange = BOUNDS.lngMax - BOUNDS.lngMin;

    const geo = new THREE.PlaneGeometry(TERRAIN_SIZE, TERRAIN_SIZE, GRID - 1, GRID - 1);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const elevGrid = [];

    for (let j = 0; j < GRID; j++) {
      for (let i = 0; i < GRID; i++) {
        const idx = j * GRID + i;
        const lat = BOUNDS.latMin + (j / (GRID - 1)) * latRange;
        const lng = BOUNDS.lngMin + (i / (GRID - 1)) * lngRange;
        const elev = syntheticElev(lat, lng);
        elevGrid.push({ elev, lat, lng });

        pos.setY(idx, elevToY(elev));

        const c = elevToColor(elev, lat, lng, mode);
        colors[idx * 3]     = c.r;
        colors[idx * 3 + 1] = c.g;
        colors[idx * 3 + 2] = c.b;
      }
    }

    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();

    const mat = new THREE.MeshPhongMaterial({
      vertexColors: true,
      shininess: 12,
      specular: new THREE.Color(0.15, 0.15, 0.15),
    });

    return { mesh: new THREE.Mesh(geo, mat), elevGrid };
  }

  // ─── ピークスプライト ─────────────────────────────────────────
  function makePeakSprite(peak) {
    const canvas = document.createElement('canvas');
    canvas.width = 220; canvas.height = 64;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(8,12,32,0.85)';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(0, 0, 220, 64, 8);
    else ctx.rect(0, 0, 220, 64);
    ctx.fill();

    ctx.strokeStyle = 'rgba(124,158,245,0.5)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(`▲ ${peak.name}`, 10, 26);

    ctx.fillStyle = '#7c9ef5';
    ctx.font = '16px sans-serif';
    ctx.fillText(`${peak.elev}m`, 10, 50);

    const unit = YATSUGATAKE_GEOLOGY.units.find(u => u.id === peak.geo);
    if (unit) {
      ctx.fillStyle = unit.color;
      ctx.fillText(unit.id, 145, 50);
    }

    const tex = new THREE.CanvasTexture(canvas);
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
    sp.scale.set(28, 8, 1);
    return sp;
  }

  function addPeakMarkers(elevGrid) {
    const latRange = BOUNDS.latMax - BOUNDS.latMin;
    const lngRange = BOUNDS.lngMax - BOUNDS.lngMin;

    YATSUGATAKE_GEOLOGY.peaks.forEach(pk => {
      if (pk.lat < BOUNDS.latMin || pk.lat > BOUNDS.latMax) return;
      if (pk.lng < BOUNDS.lngMin || pk.lng > BOUNDS.lngMax) return;

      const xi = (pk.lng - BOUNDS.lngMin) / lngRange;
      const zi = (pk.lat - BOUNDS.latMin) / latRange;
      const x = (xi - 0.5) * TERRAIN_SIZE;
      const z = (zi - 0.5) * TERRAIN_SIZE;
      const y = elevToY(pk.elev);

      // スパイク（峰を示す垂直線）
      const spikeGeo = new THREE.CylinderGeometry(0.1, 0.1, 6, 4);
      const spikeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const spike = new THREE.Mesh(spikeGeo, spikeMat);
      spike.position.set(x, y + 3, z);
      scene.add(spike);

      // ラベルスプライト
      const sp = makePeakSprite(pk);
      sp.position.set(x + 2, y + 8, z);
      scene.add(sp);
    });
  }

  // ─── シーン初期化 ─────────────────────────────────────────────
  function initScene(container) {
    const W = container.clientWidth, H = container.clientHeight;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070b1a);
    scene.fog = new THREE.FogExp2(0x0d1630, 0.007);

    camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 800);
    camera.position.set(-15, 160, 100);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // ライト
    scene.add(new THREE.AmbientLight(0x8899cc, 0.6));

    const sun = new THREE.DirectionalLight(0xfff4e0, 1.4);
    sun.position.set(-40, 80, 60);
    sun.castShadow = true;
    scene.add(sun);

    const fill = new THREE.DirectionalLight(0x4466aa, 0.4);
    fill.position.set(60, 30, -50);
    scene.add(fill);

    // 星空背景
    const starGeo = new THREE.BufferGeometry();
    const starVerts = [];
    for (let i = 0; i < 1200; i++) {
      starVerts.push(
        (Math.random() - 0.5) * 500,
        Math.random() * 150 + 20,
        (Math.random() - 0.5) * 500
      );
    }
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starVerts, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.35 })));

    // OrbitControls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 45, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2.2; // 地面より下に行かないように
    controls.minDistance = 30;
    controls.maxDistance = 350;
    controls.update();

    window.addEventListener('resize', onResize);
  }

  function animate() {
    animId = requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  function onResize() {
    const container = document.getElementById('canvas-3d-container');
    if (!container || !renderer) return;
    const W = container.clientWidth, H = container.clientHeight;
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    renderer.setSize(W, H);
  }

  // ─── 公開API ─────────────────────────────────────────────────
  return {
    open() {
      const modal = document.getElementById('modal-3d');
      modal.classList.remove('hidden');

      const container = document.getElementById('canvas-3d-container');
      if (renderer) { animate(); return; }

      initScene(container);
      this.buildTerrain('elevation');
      animate();
    },

    close() {
      document.getElementById('modal-3d').classList.add('hidden');
      if (animId) { cancelAnimationFrame(animId); animId = null; }
    },

    buildTerrain(mode) {
      colorMode = mode;
      // テレインとピークマーカーを削除
      const toRemove = scene.children.filter(c => c.isSprite || c.isMesh);
      toRemove.forEach(c => scene.remove(c));
      terrain = null;

      const loadEl = document.getElementById('loading-3d');
      loadEl.classList.remove('hidden');

      // 非同期風にrAFで処理（UIブロック回避）
      requestAnimationFrame(() => {
        const { mesh, elevGrid } = buildTerrainMesh(mode);
        terrain = mesh;
        scene.add(terrain);
        addPeakMarkers(elevGrid);
        loadEl.classList.add('hidden');
      });
    },
  };
})();
