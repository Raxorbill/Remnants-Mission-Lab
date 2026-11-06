import * as THREE from 'three';
import { MaterialLibrary } from '../materials';

export function createIngenuityDrone(materials: MaterialLibrary): {
  drone: THREE.Group;
  topRotor: THREE.Group;
  bottomRotor: THREE.Group;
} {
  const drone = new THREE.Group();
  drone.name = 'ingenuity_helicopter';

  // 1. Avionics Core Cube (with gold thermal insulation wrap)
  const cubeGeo = new THREE.BoxGeometry(0.24, 0.22, 0.24);
  const cube = new THREE.Mesh(cubeGeo, materials.goldFoil);
  cube.position.y = 0.32;
  cube.castShadow = true;
  drone.add(cube);

  // Downward Navigation Camera lens on bottom of cube
  const camLens = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.04, 8), materials.darkChassis);
  camLens.position.set(0, 0.2, 0.05);
  drone.add(camLens);

  // 2. Four Carbon Fiber Landing Legs (slanted outward)
  const legAngles = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];
  legAngles.forEach((angle) => {
    const legGroup = new THREE.Group();
    legGroup.rotation.y = angle;

    // Angled carbon fiber tube
    const tubeGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.55, 6);
    tubeGeo.rotateX(-Math.PI * 0.24);
    const tube = new THREE.Mesh(tubeGeo, materials.carbonFiber);
    tube.position.set(0, 0.16, 0.26);
    legGroup.add(tube);

    // Footpad
    const footpad = new THREE.Mesh(new THREE.SphereGeometry(0.022, 6, 6), materials.silverMetal);
    footpad.position.set(0, 0.015, 0.44);
    legGroup.add(footpad);

    drone.add(legGroup);
  });

  // 3. Central Vertical Rotor Mast
  const mastGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.65, 8);
  const mast = new THREE.Mesh(mastGeo, materials.silverMetal);
  mast.position.y = 0.65;
  drone.add(mast);

  // 4. Lower Rotor Hub & Dual Carbon-Fiber Blades
  const bottomRotor = new THREE.Group();
  bottomRotor.position.y = 0.62;

  const hub1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.05, 8), materials.darkChassis);
  bottomRotor.add(hub1);

  // Twin blades (1.2m span scaled)
  [-0.45, 0.45].forEach((bx) => {
    const bladeGeo = new THREE.BoxGeometry(0.85, 0.012, 0.08);
    const blade = new THREE.Mesh(bladeGeo, materials.carbonFiber);
    blade.position.x = bx;
    bottomRotor.add(blade);
  });
  drone.add(bottomRotor);

  // 5. Upper Rotor Hub & Dual Counter-Rotating Blades
  const topRotor = new THREE.Group();
  topRotor.position.y = 0.78;

  const hub2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.05, 8), materials.darkChassis);
  topRotor.add(hub2);

  [-0.45, 0.45].forEach((bx) => {
    const bladeGeo = new THREE.BoxGeometry(0.85, 0.012, 0.08);
    const blade = new THREE.Mesh(bladeGeo, materials.carbonFiber);
    blade.position.x = bx;
    topRotor.add(blade);
  });
  drone.add(topRotor);

  // 6. Top Solar Panel Array
  const solarGeo = new THREE.BoxGeometry(0.35, 0.015, 0.4);
  const solar = new THREE.Mesh(solarGeo, materials.solarPanel);
  solar.position.y = 0.94;
  drone.add(solar);

  // Communication Antenna stub
  const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.16, 6), materials.silverMetal);
  antenna.position.set(0.12, 1.02, 0);
  drone.add(antenna);

  return { drone, topRotor, bottomRotor };
}
