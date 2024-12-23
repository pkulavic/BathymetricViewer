import { loadESRIASCII } from "./load_data.js";
import { createBufferGeometry } from "./createBuffer.js";
import { OrbitControls } from 'https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js'
import { FlyControls } from 'https://unpkg.com/three@0.127.0/examples/jsm/controls/FlyControls.js'

let url = 'data/[hawaii]gebco_2023_n22.6189_s18.2704_w-160.8926_e-153.9642.asc';
let scene, camera, renderer, controls, terrainMesh, clock, animationId;

function init(url) {
  let initialRenderComplete = false;

  loadESRIASCII(url)
    .then(result => {
      if (result) {
        const { header, data } = result;
        console.log(result);
        const geometry = createBufferGeometry(result.header, result.data);
        console.log(geometry);

        // Create a scene
        scene = new THREE.Scene();

        // Create a camera
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 100, 200);
        camera.lookAt(0, 0, 0);

        // Create a renderer
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        // Create a material
        const material = new THREE.MeshPhongMaterial({
          vertexColors: true,
          side: THREE.DoubleSide,
          shininess: 1,
        });

        // Create a mesh using the terrain geometry and material
        terrainMesh = new THREE.Mesh(geometry, material);
        scene.add(terrainMesh);
        console.log(terrainMesh);

        // Calculate the bounding box of the geometry
        const boundingBox = new THREE.Box3().setFromObject(terrainMesh);
        const center = boundingBox.getCenter(new THREE.Vector3());
        const size = boundingBox.getSize(new THREE.Vector3());

        // Position the camera to look down on the terrain
        const cameraDistance = Math.max(size.y) * 4; // Adjust the multiplier as needed
        camera.position.set(center.x, cameraDistance, center.z);
        camera.lookAt(center);

        // Calculate the bounding sphere of the geometry
        const boundingSphere = new THREE.Sphere();
        boundingBox.getBoundingSphere(boundingSphere);

        // Adjust the camera's near and far planes based on the bounding sphere
        const near = Math.max(0.1, boundingSphere.radius * 0.01);
        const far = boundingSphere.radius * 10;
        camera.near = near;
        camera.far = far;
        camera.updateProjectionMatrix();

        // Set up lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(0, 1, 0);
        scene.add(directionalLight);

        // Set up controls
        controls = new FlyControls(camera, renderer.domElement);
        controls.movementSpeed = 75000; // Adjust the movement speed as needed
        controls.rollSpeed = Math.PI / 6; // Adjust the roll speed as needed
        controls.autoForward = false; // Set to true if you want automatic forward movement
        controls.dragToLook = true; // Set to true to enable drag to look around

        clock = new THREE.Clock();
        
        // Update the controls in the animation loop
        function animate() {
          animationId = requestAnimationFrame(animate);
          controls.update(clock.getDelta());
          renderer.render(scene, camera);
          if (!initialRenderComplete) {
            initialRenderComplete = true;
            document.getElementById('loading').style.display = 'none';
            document.getElementById('loading-gif').style.display = 'none';
          }
        }

        // Start the animation loop
        animate();
      }
    });
}

function cleanup() {
  if (terrainMesh) {
    terrainMesh.geometry.dispose();
    terrainMesh.material.dispose();
    scene.remove(terrainMesh);
    terrainMesh = null;
  }

  if (renderer) {
    renderer.dispose();
    document.body.removeChild(renderer.domElement);
    renderer = null;
  }

  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  scene = null;
  camera = null;
  controls = null;
  clock = null;

  document.getElementById('loading').style.display = 'block';
  document.getElementById('loading-gif').style.display = 'block';
}

// Initial load
init(url);

// Event listener for dataset selection
document.getElementById('dataset-selector').addEventListener('change', (event) => {
  url = event.target.value;
  // Cleanup the existing scene
  cleanup();
  // Load and render the new dataset
  init(url);
});

