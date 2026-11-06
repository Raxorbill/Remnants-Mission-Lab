import * as THREE from 'three';
import { MaterialLibrary } from '../materials';

export function createMERRover(materials: MaterialLibrary, roverName: 'Spirit' | 'Opportunity' = 'Spirit'): {
  rover: THREE.Group;
  wheels: THREE.Mesh[];
  iddArm: THREE.Group;
  ratTool: THREE.Mesh;
  pancamHead: THREE.Group;
} {
  const rover = new THREE.Group();
  rover.name = `mer_rover_${roverName.toLowerCase()}`;

  // 1. Warm Electronics Box (WEB) Core Chassis (insulated with Aerogel)
  const chassisGeo = new THREE.BoxGeometry(0.9, 0.45, 1.2);
  const chassis = new THREE.Mesh(chassisGeo, materials.goldFoil);
  chassis.position.y = 0.55;
  chassis.castShadow = true;
  rover.add(chassis);

  // 2. Solar Array Wings Deck (Triangular / polygonal solar panels)
  const solarDeckGeo = new THREE.BoxGeometry(1.4, 0.04, 1.5);
  const solarDeck = new THREE.Mesh(solarDeckGeo, materials.solarPanel);
  solarDeck.position.set(0, 0.8, 0.05);
  solarDeck.castShadow = true;
  rover.add(solarDeck);

  // Side wing angled panels
  const leftWingGeo = new THREE.BoxGeometry(0.4, 0.03, 1.3);
  const leftWing = new THREE.Mesh(leftWingGeo, materials.solarPanel);
  leftWing.position.set(-0.85, 0.77, 0.05);
  leftWing.rotation.z = Math.PI * 0.08;
  rover.add(leftWing);

  const rightWing = new THREE.Mesh(leftWingGeo, materials.solarPanel);
  rightWing.position.set(0.85, 0.77, 0.05);
  rightWing.rotation.z = -Math.PI * 0.08;
  rover.add(rightWing);

  // 3. Six Rocker-Bogie Cleated Wheels
  const wheels: THREE.Mesh[] = [];
  const wheelGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.14, 16);
  wheelGeo.rotateZ(Math.PI / 2);

  const wheelPositions = [
    [-0.8, 0.18, 0.65],  // Front Left
    [0.8, 0.18, 0.65],   // Front Right
    [-0.85, 0.18, 0.0],  // Mid Left
    [0.85, 0.18, 0.0],   // Mid Right
    [-0.8, 0.18, -0.65], // Rear Left
    [0.8, 0.18, -0.65],  // Rear Right
  ];

  wheelPositions.forEach(([x, y, z]) => {
    const wheel = new THREE.Mesh(wheelGeo, materials.silverMetal);
    wheel.position.set(x, y, z);
    wheel.castShadow = true;
    rover.add(wheel);
    wheels.push(wheel);

    // Rocker-bogie titanium strut
    const strutGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.45, 6);
    const strut = new THREE.Mesh(strutGeo, materials.darkChassis);
    strut.position.set(x > 0 ? x - 0.12 : x + 0.12, 0.35, z);
    rover.add(strut);
  });

  // 4. Pancam Mast Assembly (PMA)
  const mastGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.1, 8);
  const mast = new THREE.Mesh(mastGeo, materials.silverMetal);
  mast.position.set(0.35, 1.35, 0.45);
  rover.add(mast);

  const pancamHead = new THREE.Group();
  pancamHead.position.set(0.35, 1.9, 0.45);

  const camBarGeo = new THREE.BoxGeometry(0.28, 0.08, 0.08);
  const camBar = new THREE.Mesh(camBarGeo, materials.darkChassis);
  pancamHead.add(camBar);

  // Twin Pancam stereoscopic lenses
  [-0.1, 0.1].forEach(lx => {
    const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.06, 8), materials.opticalGlass);
    lens.rotation.x = Math.PI / 2;
    lens.position.set(lx, 0, 0.04);
    pancamHead.add(lens);
  });
  rover.add(pancamHead);

  // 5. High-Gain Antenna (HGA) dish
  const hga = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.02, 0.06, 16), materials.silverMetal);
  hga.position.set(-0.35, 0.95, -0.4);
  hga.rotation.x = -Math.PI * 0.2;
  rover.add(hga);

  // 6. Instrument Deployment Device (IDD) Arm & Rock Abrasion Tool (RAT)
  const iddArm = new THREE.Group();
  iddArm.name = 'idd_arm';
  iddArm.position.set(0, 0.45, 0.65);

  const armBone1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.45, 8), materials.silverMetal);
  armBone1.position.set(0, 0.1, 0.2);
  armBone1.rotation.x = Math.PI * 0.35;
  iddArm.add(armBone1);

  const armBone2 = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.45, 8), materials.silverMetal);
  armBone2.position.set(0, -0.05, 0.45);
  armBone2.rotation.x = -Math.PI * 0.25;
  iddArm.add(armBone2);

  // Turret carrying the Rock Abrasion Tool (RAT)
  const ratTool = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.08, 12), materials.darkChassis);
  ratTool.rotation.x = Math.PI / 2;
  ratTool.position.set(0, -0.22, 0.65);
  ratTool.name = 'rat_grinder';
  iddArm.add(ratTool);

  // Grinding head bit (diamond abrasive disk)
  const bit = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.02, 10), materials.silverMetal);
  bit.position.set(0, 0.04, 0);
  ratTool.add(bit);

  rover.add(iddArm);

  return { rover, wheels, iddArm, ratTool, pancamHead };
}
