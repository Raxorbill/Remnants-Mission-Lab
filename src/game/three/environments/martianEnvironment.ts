import * as THREE from 'three';
import { MaterialLibrary } from '../materials';
import { getMartianTerrainHeight } from '../terrainHeight';

function createMarsSkyDome(): THREE.Mesh {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Smooth vertical atmospheric dust gradient (from deep dusky rust zenith to butterscotch horizon)
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0.0, '#381308'); // High zenith: dusky deep burnt rust
  grad.addColorStop(0.35, '#752d19'); // Mid zenith: warm terra-cotta
  grad.addColorStop(0.68, '#aa5233'); // Lower sky: salmon dusty haze
  grad.addColorStop(0.88, '#d47b52'); // Near horizon: bright butterscotch amber
  grad.addColorStop(1.0, '#e8a57e'); // Horizon glow: pale dusty peach

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  const texture = new THREE.CanvasTexture(canvas);
  const skyGeo = new THREE.SphereGeometry(152, 32, 24);
  const skyMat = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.BackSide,
    fog: false,
  });
  return new THREE.Mesh(skyGeo, skyMat);
}

function createMarsSunGlow(): THREE.Group {
  const sunGroup = new THREE.Group();
  // Pale golden-white Sun disk as seen through thin CO2 & dust atmosphere
  const sunDisk = new THREE.Mesh(
    new THREE.CircleGeometry(3.6, 24),
    new THREE.MeshBasicMaterial({
      color: 0xfff5dc,
      side: THREE.DoubleSide,
      fog: false,
    })
  );
  // Forward-scattered dust halo (famous Martian bluish-peach glow discovered by Viking & Curiosity)
  const haloDisk = new THREE.Mesh(
    new THREE.CircleGeometry(16.0, 32),
    new THREE.MeshBasicMaterial({
      color: 0x86c2e2,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide,
      fog: false,
    })
  );
  sunGroup.add(haloDisk);
  sunGroup.add(sunDisk);

  // Position along the sun light direction (normalized * 142m)
  sunGroup.position.set(45, 32, 25).normalize().multiplyScalar(142);
  sunGroup.lookAt(0, 0, 0);
  return sunGroup;
}

export function createMartianEnvironment(scene: THREE.Scene, materials: MaterialLibrary): {
  ground: THREE.Mesh;
  rocks: THREE.InstancedMesh;
  pebbles?: THREE.InstancedMesh;
} {
  // 1. Martian Atmospheric Sky Dome & Atmospheric Fog
  const skyDome = createMarsSkyDome();
  scene.add(skyDome);
  const sunGlow = createMarsSunGlow();
  scene.add(sunGlow);

  scene.background = new THREE.Color(0xb25636);
  scene.fog = new THREE.FogExp2(0xb25636, 0.0048);

  // 2. Warm Directional Solar Key Light & Scattered Dust Ambient Fill
  const sunLight = new THREE.DirectionalLight(0xfff0e2, 2.9);
  sunLight.position.set(45, 32, 25);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 160;
  const d = 36;
  sunLight.shadow.camera.left = -d;
  sunLight.shadow.camera.right = d;
  sunLight.shadow.camera.top = d;
  sunLight.shadow.camera.bottom = -d;
  sunLight.shadow.bias = -0.0003;
  scene.add(sunLight);

  // Dusty atmospheric scattered fill: warm peach sky fill + deep rust ground bounce
  const hemiLight = new THREE.HemisphereLight(0xd97c55, 0x481c0e, 0.75);
  scene.add(hemiLight);

  // 3. Martian Surface Terrain with Sand Dunes, Ripples & Stratified Outcroppings
  // 240m x 240m high-resolution terrain mesh
  const groundGeo = new THREE.PlaneGeometry(240, 240, 180, 180);
  groundGeo.rotateX(-Math.PI / 2);

  const pos = groundGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    pos.setY(i, getMartianTerrainHeight(x, z));
  }
  groundGeo.computeVertexNormals();

  const ground = new THREE.Mesh(groundGeo, materials.marsGround);
  ground.receiveShadow = true;
  scene.add(ground);

  // 4. Two-Tier Distant Mountain Horizon (Outer jagged peaks + Inner stratified crater rim)
  // Outer mountain range
  const outerRimGeo = new THREE.CylinderGeometry(136, 142, 38, 64, 1, true);
  const oPos = outerRimGeo.attributes.position;
  for (let i = 0; i < oPos.count; i++) {
    const y = oPos.getY(i);
    if (y > 0) {
      const angle = Math.atan2(oPos.getZ(i), oPos.getX(i));
      const peak = Math.sin(angle * 4) * 6.8 + Math.sin(angle * 9) * 4.2 + Math.cos(angle * 17) * 2.5;
      oPos.setY(i, y + peak);
    }
  }
  outerRimGeo.computeVertexNormals();
  const outerRimMat = new THREE.MeshStandardMaterial({
    color: 0x8a3c26,
    roughness: 0.98,
    metalness: 0.02,
    side: THREE.BackSide,
  });
  const outerRim = new THREE.Mesh(outerRimGeo, outerRimMat);
  outerRim.position.y = 4;
  scene.add(outerRim);

  // Inner crater rim ridge
  const innerRimGeo = new THREE.CylinderGeometry(96, 102, 22, 64, 1, true);
  const iPos = innerRimGeo.attributes.position;
  for (let i = 0; i < iPos.count; i++) {
    const y = iPos.getY(i);
    if (y > 0) {
      const angle = Math.atan2(iPos.getZ(i), iPos.getX(i));
      const peak = Math.sin(angle * 6 + 1.2) * 3.8 + Math.cos(angle * 13) * 2.2;
      iPos.setY(i, y + peak);
    }
  }
  innerRimGeo.computeVertexNormals();
  const innerRimMat = new THREE.MeshStandardMaterial({
    color: 0x732815,
    roughness: 0.95,
    metalness: 0.04,
    side: THREE.BackSide,
  });
  const innerRim = new THREE.Mesh(innerRimGeo, innerRimMat);
  innerRim.position.y = 2;
  scene.add(innerRim);

  // 5. Tier 1: Natural Tabular Basalt Slabs & Weathered Outcroppings
  const rockGeo = new THREE.DodecahedronGeometry(0.52, 0);
  const rockCount = 95;
  const rocks = new THREE.InstancedMesh(rockGeo, materials.groundRockMars, rockCount);
  const dummy = new THREE.Object3D();

  for (let i = 0; i < rockCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = 7.5 + Math.random() * 85;
    const x = Math.cos(angle) * r;
    const z = Math.sin(angle) * r;
    const scale = 0.45 + Math.random() * 1.6;
    const groundY = getMartianTerrainHeight(x, z);

    dummy.scale.set(
      scale * (0.8 + Math.random() * 0.5),
      scale * 0.35,
      scale * (0.8 + Math.random() * 0.5)
    );
    dummy.rotation.set(
      (Math.random() - 0.5) * 0.3,
      Math.random() * Math.PI * 2,
      (Math.random() - 0.5) * 0.3
    );
    dummy.position.set(x, groundY + scale * 0.08, z);
    dummy.updateMatrix();
    rocks.setMatrixAt(i, dummy.matrix);
  }
  rocks.instanceMatrix.needsUpdate = true;
  rocks.receiveShadow = true;
  rocks.castShadow = true;
  scene.add(rocks);

  // 6. Tier 2: Scattered Small Pebbles, Scree & Gravel Fields (Authentic Mars Rover Surface Detail)
  const pebbleGeo = new THREE.DodecahedronGeometry(0.18, 0);
  const pebbleCount = 180;
  const pebbles = new THREE.InstancedMesh(pebbleGeo, materials.groundRockMars, pebbleCount);

  for (let i = 0; i < pebbleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = 5.5 + Math.random() * 75;
    const x = Math.cos(angle) * r;
    const z = Math.sin(angle) * r;
    const pScale = 0.4 + Math.random() * 0.9;
    const groundY = getMartianTerrainHeight(x, z);

    dummy.scale.set(
      pScale * (0.7 + Math.random() * 0.6),
      pScale * (0.4 + Math.random() * 0.4),
      pScale * (0.7 + Math.random() * 0.6)
    );
    dummy.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );
    dummy.position.set(x, groundY + pScale * 0.05, z);
    dummy.updateMatrix();
    pebbles.setMatrixAt(i, dummy.matrix);
  }
  pebbles.instanceMatrix.needsUpdate = true;
  pebbles.receiveShadow = true;
  scene.add(pebbles);

  return { ground, rocks, pebbles };
}
