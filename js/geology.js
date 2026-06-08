// 八ヶ岳の地質データ・地層情報

const YATSUGATAKE_GEOLOGY = {
  // 主要な地質ユニット (産総研シームレス地質図の凡例に準拠)
  units: [
    { id: 'Qv4', name: '新期溶岩流・スコリア', age: '後期更新世〜完新世', color: '#c0392b',
      desc: '硫黄岳・横岳周辺の比較的新しい玄武岩質安山岩溶岩。多孔質で透水性が高く、地下水の主要な帯水層を形成。' },
    { id: 'Qv3', name: '中期火砕流堆積物', age: '中期更新世', color: '#e67e22',
      desc: '赤岳・阿弥陀岳周辺に分布する溶結凝灰岩・火砕流堆積物。崩壊しやすく、岩屑なだれの発生源となりやすい。' },
    { id: 'Qv2', name: '古期八ヶ岳火山岩', age: '前期更新世', color: '#8e44ad',
      desc: '編笠山・権現岳周辺の安山岩〜デイサイト質溶岩。風化が進み、粘土鉱物が発達。滑りやすい地盤を形成。' },
    { id: 'Qal', name: '沖積層・火山灰', age: '完新世', color: '#f1c40f',
      desc: '山麓部の谷底・扇状地に堆積。腐植土・砂礫・火山灰の互層。軟弱地盤で液状化・圧密沈下に注意が必要。' },
    { id: 'Qls', name: '崩積土・地すべり堆積物', age: '現在〜後期更新世', color: '#e74c3c',
      desc: '急斜面直下に分布する不均質な堆積物。大規模な岩屑なだれ（約2万年前の八ヶ岳崩壊）の堆積物を含む。' },
    { id: 'Kgr', name: '花崗岩類（基盤岩）', age: '白亜紀', color: '#3498db',
      desc: '八ヶ岳の基盤を構成する花崗岩・花崗閃緑岩。深部では堅固だが、表層の風化帯（マサ土）は崩壊しやすい。' },
    { id: 'P', name: '変成岩類', age: 'ペルム紀〜三畳紀', color: '#2ecc71',
      desc: '秩父帯の変成岩類。片岩・片麻岩からなり、折状構造が発達。斜面方向次第で滑りやすい面を形成。' },
  ],

  // 主要峰の地質情報
  peaks: [
    { name: '赤岳', lat: 35.972, lng: 138.370, elev: 2899, geo: 'Qv3',
      desc: '八ヶ岳最高峰。山体は火砕流堆積物・溶結凝灰岩が主体で、急崖が発達。崩落リスク高。',
      hazard: 0.82 },
    { name: '阿弥陀岳', lat: 35.969, lng: 138.352, elev: 2805, geo: 'Qv3',
      desc: '急峻な玄武岩質安山岩の岩体。南陵・北陵の岩壁は崩落の歴史がある。',
      hazard: 0.78 },
    { name: '硫黄岳', lat: 35.980, lng: 138.387, elev: 2760, geo: 'Qv4',
      desc: '爆裂火口跡（硫黄岳火口壁）を持つ。最も若い火山活動の証拠が残る。水蒸気爆発の地形。',
      hazard: 0.65 },
    { name: '横岳', lat: 35.975, lng: 138.379, elev: 2830, geo: 'Qv4',
      desc: '安山岩質溶岩が積み重なった岩稜。多数の岩塔は差別侵食によるもの。',
      hazard: 0.70 },
    { name: '天狗岳', lat: 35.996, lng: 138.380, elev: 2646, geo: 'Qv2',
      desc: '東西二峰からなる。古期の安山岩質溶岩ドームが侵食された山体。',
      hazard: 0.55 },
    { name: '編笠山', lat: 35.943, lng: 138.335, elev: 2524, geo: 'Qv2',
      desc: '八ヶ岳南端の独立峰。古期溶岩が厚く堆積。山頂は大きな岩塊で覆われる。',
      hazard: 0.45 },
    { name: '権現岳', lat: 35.952, lng: 138.346, elev: 2715, geo: 'Qv2',
      desc: '南八ヶ岳の要衝。古期火山岩の険しい岩稜が特徴。',
      hazard: 0.60 },
    { name: '蓼科山', lat: 36.108, lng: 138.298, elev: 2531, geo: 'Qv4',
      desc: '八ヶ岳北端の独立成層火山。山頂溶岩原と岩礫地が広がる。',
      hazard: 0.50 },
  ],

  // 地盤増幅率の傾向（標高帯別の概算）
  amplificationByElevation: (elev) => {
    if (elev > 2000) return { factor: 1.2, risk: 'low', label: '低（岩盤露出域）' };
    if (elev > 1500) return { factor: 1.8, risk: 'medium', label: '中（火山灰〜崩積土）' };
    if (elev > 1000) return { factor: 2.5, risk: 'high', label: '高（沖積層域）' };
    return { factor: 3.2, risk: 'very-high', label: '非常に高（軟弱地盤）' };
  },

  // 地層モデル（断面図用）：深さ(m)と地層
  stratigraphyModel: (lat, lng, elev) => {
    const isHighMountain = elev > 2000;
    const isMidSlope = elev > 1200 && elev <= 2000;
    const isValley = elev <= 1200;

    if (isHighMountain) return [
      { name: '岩塊・スコリア', thickness: 1.5, color: '#c0392b', symbol: 'Qv' },
      { name: '溶岩流（安山岩）', thickness: 15, color: '#922b21', symbol: 'Qv' },
      { name: '火砕流堆積物', thickness: 30, color: '#e67e22', symbol: 'Qv3' },
      { name: '古期溶岩', thickness: 50, color: '#8e44ad', symbol: 'Qv2' },
      { name: '花崗岩（基盤）', thickness: null, color: '#3498db', symbol: 'Kgr' },
    ];
    if (isMidSlope) return [
      { name: '表土・腐植土', thickness: 0.5, color: '#6d4c41', symbol: 'As' },
      { name: '火山灰層', thickness: 2, color: '#f1c40f', symbol: 'Qal' },
      { name: '崩積土', thickness: 5, color: '#e74c3c', symbol: 'Qls' },
      { name: '溶岩風化帯', thickness: 20, color: '#d35400', symbol: 'Qv2' },
      { name: '古期溶岩', thickness: 40, color: '#8e44ad', symbol: 'Qv2' },
      { name: '花崗岩（基盤）', thickness: null, color: '#3498db', symbol: 'Kgr' },
    ];
    return [
      { name: '表土・腐植土', thickness: 1, color: '#6d4c41', symbol: 'As' },
      { name: '火山灰・砂礫', thickness: 4, color: '#f1c40f', symbol: 'Qal' },
      { name: '旧河床礫層', thickness: 8, color: '#95a5a6', symbol: 'Qg' },
      { name: '火山泥流堆積物', thickness: 20, color: '#e67e22', symbol: 'Qv3' },
      { name: '古期溶岩', thickness: 40, color: '#8e44ad', symbol: 'Qv2' },
      { name: '花崗岩（基盤）', thickness: null, color: '#3498db', symbol: 'Kgr' },
    ];
  },

  // 地点の地質ユニットを推定（実際はWMSから取得）
  estimateUnit: (lat, lng, elev) => {
    if (elev > 2200) return 'Qv4';
    if (elev > 1800) return 'Qv3';
    if (elev > 1400) return 'Qv2';
    if (lat > 36.0) return 'Qv4';
    const distFromCenter = Math.sqrt(
      Math.pow(lat - 35.97, 2) + Math.pow(lng - 138.37, 2)
    );
    if (distFromCenter < 0.08) return 'Qv3';
    if (distFromCenter < 0.15) return 'Qv2';
    return 'Qal';
  },

  // ボーリングデータ（KuniJiban公開データより抜粋・参考値）
  boringData: [
    {
      id: 'BH-001', name: '小淵沢地点', lat: 35.872, lng: 138.253,
      depth: 20, year: 2015,
      layers: [
        { name: '表土', from: 0, to: 0.5, n: 1, soil: '腐植土' },
        { name: '火山灰', from: 0.5, to: 3.0, n: 5, soil: '火山灰質シルト' },
        { name: '礫層', from: 3.0, to: 8.0, n: 28, soil: '砂礫（溶岩由来）' },
        { name: '溶岩分解物', from: 8.0, to: 15.0, n: 44, soil: '砂質マサ土' },
        { name: '軟岩', from: 15.0, to: 20.0, n: 50, soil: '安山岩（風化）' },
      ]
    },
    {
      id: 'BH-002', name: '富士見高原', lat: 35.913, lng: 138.333,
      depth: 15, year: 2018,
      layers: [
        { name: '表土', from: 0, to: 1.0, n: 2, soil: '腐植土・火山灰' },
        { name: '火山砂礫', from: 1.0, to: 4.0, n: 12, soil: '火山砂礫（スコリア含む）' },
        { name: '崩積土', from: 4.0, to: 10.0, n: 20, soil: '安山岩角礫' },
        { name: '溶岩', from: 10.0, to: 15.0, n: 50, soil: '安山岩（堅硬）' },
      ]
    },
    {
      id: 'BH-003', name: '清里高原', lat: 35.928, lng: 138.420,
      depth: 25, year: 2012,
      layers: [
        { name: '表土', from: 0, to: 0.8, n: 2, soil: '腐植土' },
        { name: '火山灰', from: 0.8, to: 5.0, n: 8, soil: '火山灰質粘性土（関東ローム）' },
        { name: '砂礫', from: 5.0, to: 12.0, n: 22, soil: '砂礫（溶岩起源）' },
        { name: '溶岩風化', from: 12.0, to: 20.0, n: 40, soil: '安山岩風化帯' },
        { name: '基盤岩', from: 20.0, to: 25.0, n: 50, soil: '花崗岩' },
      ]
    },
    {
      id: 'BH-004', name: '野辺山高原', lat: 35.940, lng: 138.473,
      depth: 18, year: 2020,
      layers: [
        { name: '表土', from: 0, to: 1.5, n: 3, soil: '腐植土・火山灰（浅間山由来含む）' },
        { name: '火山灰互層', from: 1.5, to: 6.0, n: 10, soil: '火山灰・砂の互層' },
        { name: '泥流', from: 6.0, to: 14.0, n: 18, soil: '火山泥流堆積物（礫混じり）' },
        { name: '溶岩', from: 14.0, to: 18.0, n: 50, soil: '安山岩溶岩' },
      ]
    },
    {
      id: 'BH-005', name: '原村', lat: 35.978, lng: 138.272,
      depth: 22, year: 2019,
      layers: [
        { name: '盛土', from: 0, to: 1.0, n: 4, soil: '盛土（火山灰質）' },
        { name: '火山灰', from: 1.0, to: 4.5, n: 7, soil: 'シルト質火山灰' },
        { name: '砂礫', from: 4.5, to: 10.0, n: 25, soil: '砂礫（八ヶ岳起源）' },
        { name: '溶岩分解', from: 10.0, to: 18.0, n: 38, soil: '安山岩分解物（マサ土状）' },
        { name: '岩盤', from: 18.0, to: 22.0, n: 50, soil: '安山岩（新鮮）' },
      ]
    },
  ],

  // 地質イベント年表
  events: [
    { year: '約25万年前', title: '八ヶ岳火山群の活動開始', desc: '古八ヶ岳火山（現在より東方）が形成開始。' },
    { year: '約5〜3万年前', title: '大規模火砕流', desc: '赤岳・阿弥陀岳周辺で大規模な火砕流堆積物が形成。' },
    { year: '約2万年前', title: '八ヶ岳崩壊', desc: '大規模な山体崩壊（岩屑なだれ）が発生。現在の山麓に扇状地地形を形成。推定移動距離30km以上。' },
    { year: '約1万年前', title: '硫黄岳爆裂火口形成', desc: '水蒸気爆発により硫黄岳の爆裂火口が形成。最も新しい火山活動。' },
    { year: '江戸時代', title: '地すべり・崩壊記録', desc: '大雨による崩壊が複数記録されている。特に火山灰堆積地で顕著。' },
    { year: '1959年', title: '伊勢湾台風による崩壊', desc: '山麓部で多数の土石流・崩壊が発生。地質図に現在も崩積土として記録。' },
    { year: '現在', title: '継続的な侵食・地盤変動', desc: '地すべり監視エリアが複数設定。火山活動に関連した微小地震が観測されることも。' },
  ],
};
