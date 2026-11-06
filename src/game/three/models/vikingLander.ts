import * as THREE from 'three';
import { MaterialLibrary } from '../materials';

export function createVikingLander(materials: MaterialLibrary): {
  lander: THREE.Group;
  roboticArm: THREE.Group;
  scoop: THREE.Mesh;
} {
  const lander = new THREE.Group();
  lander.name = 'viking_lander';

  // 1. Hexagonal Main Equipment Deck
  const deckGeo = new THREE.CylinderGeometry(1.4, 1.5, 0.65, 6);
  const deck = new THREE.Mesh(deckGeo, materials.silverMetal);
  deck.position.y = 1.1;
  deck.castShadow = true;
  lander.add(deck);

  // Deck top thermal blanket
  const topCoverGeo = new THREE.CylinderGeometry(1.35, 1.35, 0.08, 6);
  const topCover = new THREE.Mesh(topCoverGeo, materials.whiteMLI);
  topCover.position.y = 1.45;
  lander.add(topCover);

  // 2. Three Tripod Shock-Absorbing Landing Legs
  const legAngles = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3];
  legAngles.forEach((angle) => {
    const legGroup = new THREE.Group();
    legGroup.rotation.y = angle;

    // Inverted V struts
    const mainStrutGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.8, 8);
    const strut = new THREE.Mesh(mainStrutGeo, materials.silverMetal);
    strut.position.set(0, 0.65, 1.7);
    strut.rotation.x = -Math.PI * 0.28;
    legGroup.add(strut);

    // Footpad dish
    const padGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.06, 12);
    const pad = new THREE.Mesh(padGeo, materials.silverMetal);
    pad.position.set(0, 0.03, 2.3);
    legGroup.add(pad);

    lander.add(legGroup);
  });

  // 3. High-Gain S-Band Antenna Dish
  const hgaGroup = new THREE.Group();
  hgaGroup.position.set(-0.5, 1.5, -0.4);
  const dishGeo = new THREE.SphereGeometry(0.45, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.35);
  const dish = new THREE.Mesh(dishGeo, materials.silverMetal);
  dish.rotation.x = -Math.PI * 0.65;
  hgaGroup.add(dish);
  const dishFeed = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.35, 6), materials.darkChassis);
  dishFeed.position.set(0, 0.15, -0.15);
  hgaGroup.add(dishFeed);
  lander.add(hgaGroup);

  // 4. Twin Facsimile Cameras
  [-0.4, 0.4].forEach(x => {
    const camGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.55, 12);
    const cam = new THREE.Mesh(camGeo, materials.darkChassis);
    cam.position.set(x, 1.75, 0.5);
    lander.add(cam);

    const lensGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const lens = new THREE.Mesh(lensGeo, materials.opticalGlass);
    lens.position.set(x, 1.85, 0.59);
    lander.add(lens);
  });

  // 5. Meteorology Sensor Mast
  const metMastGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.2, 8);
  const metMast = new THREE.Mesh(metMastGeo, materials.silverMetal);
  metMast.position.set(0.65, 2.05, -0.2);
  lander.add(metMast);

  // 6. Biology Sample Processing Funnel & Inlet Ports
  const inletGeo = new THREE.CylinderGeometry(0.18, 0.08, 0.22, 12);
  const inlet = new THREE.Mesh(inletGeo, materials.goldFoil);
  inlet.position.set(0.2, 1.56, 0.65);
  inlet.name = 'sample_inlet';
  lander.add(inlet);

  // 7. Articulated 3-Meter Robotic Collector Arm
  const roboticArm = new THREE.Group();
  roboticArm.name = 'viking_robotic_arm';
  roboticArm.position.set(0, 1.25, 1.2);

  // Arm Shoulder joint
  const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 10), materials.darkChassis);
  roboticArm.add(shoulder);

  // Upper boom
  const upperBoomGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.2, 8);
  upperBoomGeo.rotateX(Math.PI / 4);
  const upperBoom = new THREE.Mesh(upperBoomGeo, materials.silverMetal);
  upperBoom.position.set(0, 0.4, 0.4);
  roboticArm.add(upperBoom);

  // Forearm boom
  const forearmGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.3, 8);
  forearmGeo.rotateX(Math.PI / 2.2);
  const forearm = new THREE.Mesh(forearmGeo, materials.silverMetal);
  forearm.position.set(0, 0.5, 1.2);
  roboticArm.add(forearm);

  // Motorized Backhoe Soil Scoop
  const scoopGeo = new THREE.BoxGeometry(0.18, 0.12, 0.22);
  const scoop = new THREE.Mesh(scoopGeo, materials.darkChassis);
  scoop.position.set(0, 0.25, 1.8);
  scoop.name = 'viking_scoop';
  roboticArm.add(scoop);

  lander.add(roboticArm);

  return { lander, roboticArm, scoop };
}
