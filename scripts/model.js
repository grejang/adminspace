const container = document.getElementById('model-container');
container.style.cssText = 'width:100%;height:400px;';

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
container.appendChild(renderer.domElement);

const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
camera.position.set(0, 0, 6); 

scene.add(new THREE.AmbientLight(0xffffff, 0.7));
const dir = new THREE.DirectionalLight(0xffffff, 0.8);
dir.position.set(5, 5, 5);
scene.add(dir);

let model = null;
const loader = new THREE.GLTFLoader();
loader.load('adminspace_diorama.glb', function(gltf) {
  model = gltf.scene;
  scene.add(model);

  const box   = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  const size   = box.getSize(new THREE.Vector3());
  const scale  = 3.5 / Math.max(size.x, size.y, size.z);
  model.scale.setScalar(scale);
  model.position.sub(center.multiplyScalar(scale));

  model.rotation.y = 20 * (Math.PI / 180);
  model.rotation.x = 20 * (Math.PI / 180);
});

(function animate() {
  requestAnimationFrame(animate);
  if (model) model.rotation.y += 0.003;
  renderer.render(scene, camera);
})();

window.addEventListener('resize', () => {
  renderer.setSize(container.clientWidth, container.clientHeight);
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
});