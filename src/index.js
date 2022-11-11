import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import attachModelLoaders from './model-loading';

// ==================
// SETUP 3D RENDERING
// ==================

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('viewport'),
});

// Create camera
// Aspect will be updated in the resize handler
const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 10000);

const camControls = new OrbitControls(camera, renderer.domElement);

const scene = new THREE.Scene();

function handleResize() {
  const w = renderer.domElement.offsetWidth;
  const h = renderer.domElement.offsetHeight;

  camera.aspect = w / h;
  camera.updateProjectionMatrix();

  renderer.setSize(w, h);
}
{
  const resizeObserver = new ResizeObserver(() => handleResize());
  resizeObserver.observe(renderer.domElement);
  handleResize();
}

// ===============
// CONSTRUCT SCENE
// ===============

camera.position.z = 450;

const light = new THREE.AmbientLight(0xffffff);
scene.add(light);

attachModelLoaders(scene);

// =========
// RENDERING
// =========

function animate() {
  requestAnimationFrame(animate);
  camControls.update();
  renderer.render(scene, camera);
}

animate();

// Copy code button

const copyButton = document.getElementById('btn-copy-code');
const codeEl = document.getElementById('gcode');

copyButton.addEventListener('click', async () => {
  await copyCode(codeEl, copyButton);
});

async function copyCode(block, button) {
  let text = block.innerText;

  await navigator.clipboard.writeText(text);

  const oldText = button.innerText;
  button.innerText = 'Code Copied';

  setTimeout(() => {
    button.innerText = oldText;
  }, 800);
}

// Download code button
// https://stackoverflow.com/a/18197341

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

document.getElementById('btn-dl-code').onclick = () => download('print.nc', codeEl.innerText);
