import * as THREE from 'three';

// Procedural high-fidelity texture generators
function createMoonTexture(): { diffuse: THREE.CanvasTexture; bump: THREE.CanvasTexture; roughness: THREE.CanvasTexture } {
  // 1. Diffuse Albedo Canvas (1024x1024)
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Base Lunar regolith tone (authentic dark charcoal-gray mare basalt)
  ctx.fillStyle = '#5c616b';
  ctx.fillRect(0, 0, 1024, 1024);

  // Micro-noise & multi-mineral grain variation (anorthosite white flakes + pyroxene dark specs)
  const imgData = ctx.getImageData(0, 0, 1024, 1024);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const n1 = (Math.random() - 0.5) * 38;
    const n2 = Math.random() < 0.09 ? (Math.random() * 55 - 15) : 0;
    const lum = n1 + n2;
    data[i] = Math.min(255, Math.max(0, data[i] + lum));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + lum));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + lum + 4)); // subtle titanium/silver tint
  }
  ctx.putImageData(imgData, 0, 0);

  // Bright highland impact ejecta rays (Tycho / Copernicus style filament sprays)
  for (let i = 0; i < 28; i++) {
    const cx = 512 + (Math.random() - 0.5) * 550;
    const cy = 512 + (Math.random() - 0.5) * 550;
    const angle = Math.random() * Math.PI * 2;
    const len = 220 + Math.random() * 340;
    const rayGrad = ctx.createLinearGradient(cx, cy, cx + Math.cos(angle) * len, cy + Math.sin(angle) * len);
    rayGrad.addColorStop(0, 'rgba(235, 242, 252, 0.24)');
    rayGrad.addColorStop(0.4, 'rgba(205, 215, 228, 0.12)');
    rayGrad.addColorStop(1, 'rgba(100, 105, 115, 0)');

    ctx.strokeStyle = rayGrad;
    ctx.lineWidth = 14 + Math.random() * 20;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * len, cy + Math.sin(angle) * len);
    ctx.stroke();
  }

  // Continuous natural geological tone variation (lunar maria streaks & ejecta wisps)
  for (let i = 0; i < 20; i++) {
    const cx = 512 + (Math.random() - 0.5) * 500;
    const cy = 512 + (Math.random() - 0.5) * 500;
    const angle = Math.random() * Math.PI * 2;
    const len = 260 + Math.random() * 360;
    const rayGrad = ctx.createLinearGradient(cx, cy, cx + Math.cos(angle) * len, cy + Math.sin(angle) * len);
    rayGrad.addColorStop(0, 'rgba(205, 215, 226, 0.15)');
    rayGrad.addColorStop(0.5, 'rgba(175, 185, 200, 0.07)');
    rayGrad.addColorStop(1, 'rgba(92, 97, 107, 0)');

    ctx.strokeStyle = rayGrad;
    ctx.lineWidth = 26 + Math.random() * 34;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * len, cy + Math.sin(angle) * len);
    ctx.stroke();
  }

  // Subtle astronaut boot-print tread patterns near origin
  ctx.strokeStyle = 'rgba(32, 35, 42, 0.40)';
  ctx.lineWidth = 2.5;
  for (let s = -3; s <= 3; s++) {
    const bx = 512 + s * 14;
    const by = 512 + s * 22;
    ctx.strokeRect(bx - 4, by - 8, 8, 16);
  }

  const diffuse = new THREE.CanvasTexture(canvas);
  diffuse.wrapS = THREE.RepeatWrapping;
  diffuse.wrapT = THREE.RepeatWrapping;
  diffuse.repeat.set(10, 10);
  diffuse.colorSpace = THREE.SRGBColorSpace;

  // 2. High-Frequency Micro-Noise Bump Map (512x512)
  const bCanvas = document.createElement('canvas');
  bCanvas.width = 512;
  bCanvas.height = 512;
  const bCtx = bCanvas.getContext('2d')!;
  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, 512, 512);

  const bData = bCtx.getImageData(0, 0, 512, 512);
  const bd = bData.data;
  for (let i = 0; i < bd.length; i += 4) {
    const v = 128 + (Math.random() - 0.5) * 68;
    bd[i] = v;
    bd[i + 1] = v;
    bd[i + 2] = v;
  }
  bCtx.putImageData(bData, 0, 0);

  const bump = new THREE.CanvasTexture(bCanvas);
  bump.wrapS = THREE.RepeatWrapping;
  bump.wrapT = THREE.RepeatWrapping;
  bump.repeat.set(10, 10);

  // 3. Roughness Map (512x512): powdery regolith is diffuse, glassy impact spatter is smoother
  const rCanvas = document.createElement('canvas');
  rCanvas.width = 512;
  rCanvas.height = 512;
  const rCtx = rCanvas.getContext('2d')!;
  rCtx.fillStyle = '#e2e2e2'; // mostly high roughness ~0.88
  rCtx.fillRect(0, 0, 512, 512);

  const rData = rCtx.getImageData(0, 0, 512, 512);
  const rd = rData.data;
  for (let i = 0; i < rd.length; i += 4) {
    const val = 224 + (Math.random() - 0.5) * 40;
    rd[i] = val;
    rd[i + 1] = val;
    rd[i + 2] = val;
  }
  rCtx.putImageData(rData, 0, 0);

  const roughness = new THREE.CanvasTexture(rCanvas);
  roughness.wrapS = THREE.RepeatWrapping;
  roughness.wrapT = THREE.RepeatWrapping;
  roughness.repeat.set(10, 10);

  return { diffuse, bump, roughness };
}

function createMarsTexture(): { diffuse: THREE.CanvasTexture; bump: THREE.CanvasTexture; roughness: THREE.CanvasTexture } {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Deep Mars iron-oxide rust bedrock base (ochre & burnt sienna)
  ctx.fillStyle = '#9e4222';
  ctx.fillRect(0, 0, 1024, 1024);

  // Granular color variation (fine dust, hematite grains, dark basalt flecks)
  const imgData = ctx.getImageData(0, 0, 1024, 1024);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 52;
    data[i] = Math.min(255, Math.max(0, data[i] + noise + 14));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise * 0.68));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise * 0.26));
  }
  ctx.putImageData(imgData, 0, 0);

  // Natural wind-blown sand ripples and barchan dune crests across the dunes
  for (let y = 0; y < 1024; y += 38) {
    // Trough: darker volcanic basalt sand collected in hollows
    ctx.strokeStyle = 'rgba(64, 22, 11, 0.45)';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(280, y + 16, 720, y - 12, 1024, y + 8);
    ctx.stroke();

    // Windward golden oxidized hematite crest highlight (butterscotch tone)
    ctx.strokeStyle = 'rgba(238, 148, 86, 0.32)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(0, y - 4);
    ctx.bezierCurveTo(280, y + 12, 720, y - 16, 1024, y + 4);
    ctx.stroke();
  }

  // Secondary cross-bedding sediment streaks (fine drift dust)
  for (let i = 0; i < 22; i++) {
    const sx = Math.random() * 1024;
    const sy = Math.random() * 1024;
    const grad = ctx.createLinearGradient(sx, sy, sx + 220, sy + 70);
    grad.addColorStop(0, 'rgba(242, 162, 102, 0.18)');
    grad.addColorStop(1, 'rgba(158, 66, 34, 0)');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 18 + Math.random() * 18;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + 220, sy + 70);
    ctx.stroke();
  }

  const diffuse = new THREE.CanvasTexture(canvas);
  diffuse.wrapS = THREE.RepeatWrapping;
  diffuse.wrapT = THREE.RepeatWrapping;
  diffuse.repeat.set(10, 10);
  diffuse.colorSpace = THREE.SRGBColorSpace;

  // High-contrast multi-frequency bump map for smooth continuous wind ripples
  const bCanvas = document.createElement('canvas');
  bCanvas.width = 512;
  bCanvas.height = 512;
  const bCtx = bCanvas.getContext('2d')!;
  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, 512, 512);

  // Micro-noise for sandy grit
  const bData = bCtx.getImageData(0, 0, 512, 512);
  const bd = bData.data;
  for (let i = 0; i < bd.length; i += 4) {
    const v = 128 + (Math.random() - 0.5) * 50;
    bd[i] = v;
    bd[i + 1] = v;
    bd[i + 2] = v;
  }
  bCtx.putImageData(bData, 0, 0);

  // Directional ripple bumps
  bCtx.strokeStyle = 'rgba(225, 225, 225, 0.44)';
  bCtx.lineWidth = 9;
  for (let y = 0; y < 512; y += 19) {
    bCtx.beginPath();
    bCtx.moveTo(0, y);
    bCtx.bezierCurveTo(140, y + 8, 360, y - 6, 512, y + 4);
    bCtx.stroke();
  }

  const bump = new THREE.CanvasTexture(bCanvas);
  bump.wrapS = THREE.RepeatWrapping;
  bump.wrapT = THREE.RepeatWrapping;
  bump.repeat.set(10, 10);

  // Mars Roughness Map: rough sand dunes (~0.92) vs smoother basalt/hardpan (~0.68)
  const rCanvas = document.createElement('canvas');
  rCanvas.width = 512;
  rCanvas.height = 512;
  const rCtx = rCanvas.getContext('2d')!;
  rCtx.fillStyle = '#dcdcdc';
  rCtx.fillRect(0, 0, 512, 512);

  const rData = rCtx.getImageData(0, 0, 512, 512);
  const rd = rData.data;
  for (let i = 0; i < rd.length; i += 4) {
    const v = 215 + (Math.random() - 0.5) * 45;
    rd[i] = v;
    rd[i + 1] = v;
    rd[i + 2] = v;
  }
  rCtx.putImageData(rData, 0, 0);

  const roughness = new THREE.CanvasTexture(rCanvas);
  roughness.wrapS = THREE.RepeatWrapping;
  roughness.wrapT = THREE.RepeatWrapping;
  roughness.repeat.set(10, 10);

  return { diffuse, bump, roughness };
}

function createSolarPanelTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#081738';
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = '#c5d3ea';
  ctx.lineWidth = 1.5;
  for (let x = 0; x <= 256; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 256);
    ctx.stroke();
  }
  for (let y = 0; y <= 256; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(256, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export class MaterialLibrary {
  public moonGround: THREE.MeshStandardMaterial;
  public marsGround: THREE.MeshStandardMaterial;
  public goldFoil: THREE.MeshStandardMaterial;
  public silverMetal: THREE.MeshStandardMaterial;
  public darkChassis: THREE.MeshStandardMaterial;
  public whiteMLI: THREE.MeshStandardMaterial;
  public solarPanel: THREE.MeshStandardMaterial;
  public carbonFiber: THREE.MeshStandardMaterial;
  public rockMaterial: THREE.MeshStandardMaterial;
  public groundRockMars: THREE.MeshStandardMaterial;
  public opticalGlass: THREE.MeshPhysicalMaterial;
  public laserBeam: THREE.MeshBasicMaterial;
  public markerRing: THREE.MeshBasicMaterial;

  constructor() {
    const moonMaps = createMoonTexture();
    const marsMaps = createMarsTexture();
    const solarTex = createSolarPanelTexture();

    this.moonGround = new THREE.MeshStandardMaterial({
      map: moonMaps.diffuse,
      bumpMap: moonMaps.bump,
      bumpScale: 0.22,
      roughnessMap: moonMaps.roughness,
      roughness: 0.88,
      metalness: 0.05,
    });

    this.marsGround = new THREE.MeshStandardMaterial({
      map: marsMaps.diffuse,
      bumpMap: marsMaps.bump,
      bumpScale: 0.28,
      roughnessMap: marsMaps.roughness,
      roughness: 0.85,
      metalness: 0.08,
    });

    this.goldFoil = new THREE.MeshStandardMaterial({
      color: 0xdfa028,
      roughness: 0.25,
      metalness: 0.88,
    });

    this.silverMetal = new THREE.MeshStandardMaterial({
      color: 0xd8dde4,
      roughness: 0.22,
      metalness: 0.84,
    });

    this.darkChassis = new THREE.MeshStandardMaterial({
      color: 0x22262c,
      roughness: 0.55,
      metalness: 0.45,
    });

    this.whiteMLI = new THREE.MeshStandardMaterial({
      color: 0xeeeeee,
      roughness: 0.55,
      metalness: 0.18,
    });

    this.solarPanel = new THREE.MeshStandardMaterial({
      map: solarTex,
      roughness: 0.15,
      metalness: 0.7,
    });

    this.carbonFiber = new THREE.MeshStandardMaterial({
      color: 0x181a1e,
      roughness: 0.35,
      metalness: 0.6,
    });

    this.rockMaterial = new THREE.MeshStandardMaterial({
      color: 0x6e737c,
      roughness: 0.95,
      metalness: 0.05,
    });

    this.groundRockMars = new THREE.MeshStandardMaterial({
      color: 0x7a301d,
      roughness: 0.92,
      metalness: 0.08,
    });

    this.opticalGlass = new THREE.MeshPhysicalMaterial({
      color: 0x8fe3ff,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.9,
      transparent: true,
      opacity: 0.85,
      ior: 1.5,
    });

    this.laserBeam = new THREE.MeshBasicMaterial({
      color: 0x00ffcc,
      transparent: true,
      opacity: 0.85,
    });

    this.markerRing = new THREE.MeshBasicMaterial({
      color: 0x00d9f5,
      wireframe: true,
      transparent: true,
      opacity: 0.7,
    });
  }

  public dispose() {
    this.moonGround.map?.dispose();
    this.moonGround.bumpMap?.dispose();
    this.moonGround.roughnessMap?.dispose();
    this.moonGround.dispose();
    this.marsGround.map?.dispose();
    this.marsGround.bumpMap?.dispose();
    this.marsGround.roughnessMap?.dispose();
    this.marsGround.dispose();
    this.solarPanel.map?.dispose();
    this.solarPanel.dispose();
    this.goldFoil.dispose();
    this.silverMetal.dispose();
    this.darkChassis.dispose();
    this.whiteMLI.dispose();
    this.carbonFiber.dispose();
    this.rockMaterial.dispose();
    this.groundRockMars.dispose();
    this.opticalGlass.dispose();
    this.laserBeam.dispose();
    this.markerRing.dispose();
  }
}
