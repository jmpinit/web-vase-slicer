import * as THREE from 'three';
import { pointsToGcode  } from "./gcode";

export default function slice(scene, feedRate, layerHeight, pointsAroundPerimeter, bottomHeight=0, topHeight=100) {
  const raycaster = new THREE.Raycaster();

  const points = [];
  const radius = 200;
  let y = bottomHeight;
  let angle = 0;

  while (y < topHeight) {
    angle += (2 * Math.PI) / pointsAroundPerimeter;
    y = bottomHeight + layerHeight * (angle / (2 * Math.PI));

    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);

    const origin = new THREE.Vector3(x, y, z);
    const direction = new THREE.Vector3(-x, 0, -z).normalize();

    raycaster.set(origin, direction);
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
      points.push(intersects[0].point);
    }
  }

  const gcode = pointsToGcode(points, feedRate);
  document.getElementById('gcode').innerText += gcode;

  const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );

  const geometry = new THREE.BufferGeometry().setFromPoints( points );
  const line = new THREE.Line( geometry, material );

  scene.add(line);
}
