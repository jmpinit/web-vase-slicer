import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import * as THREE from 'three';
import slice from './slice';

/**
 * Attaches loaders for the model texture and the model geometry to the webpage
 */
export default function attachModelLoaders(scene) {
  const loader = new STLLoader();

  const inputModelEl = document.getElementById('input-model');
  inputModelEl.addEventListener('change', () => {
    const uploadedFile = inputModelEl.files[0];
    const url = URL.createObjectURL(uploadedFile);

    loader.load(url, (geometry) => {
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3,
      });
      const mesh = new THREE.Mesh(geometry, material);

      scene.add(mesh);

      URL.revokeObjectURL(url);

      console.log('3D model loaded');

      const feedRate = parseInt(document.getElementById('input-feedrate').value);
      const layerHeight = parseFloat(document.getElementById('input-layer-height').value);
      const pointsAroundPerimeter = parseInt(document.getElementById('input-points-around-perimeter').value);

      slice(scene, feedRate, layerHeight, pointsAroundPerimeter);
    }, undefined, (error) => {
      console.error(error);
      URL.revokeObjectURL(url);
    });
  });
}
