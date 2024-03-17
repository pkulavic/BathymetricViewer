import { loadESRIASCII } from "./load_data.js";
import { createBufferGeometry } from "./createBuffer.js";
import { OrbitControls } from 'https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js'
import {FlyControls } from 'https://unpkg.com/three@0.127.0/examples/jsm/controls/FlyControls.js'

const url = 'data/gebco_2023_n22.6189_s18.2704_w-160.8926_e-153.9642.asc';
loadESRIASCII(url)
  .then(result => {
    if (result) {
      const { header, data } = result;
      // Process the header and data as needed
      console.log(result);
      const geometry = createBufferGeometry(result.header, result.data)
      const colors = [];
      const positions = geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        const elevation = positions[i + 1]; // Assuming y-coordinate represents elevation
      
        if (isNaN(elevation)) {
          // Handle invalid elevation values
          colors.push(0, 0, 0); // Assign a default color (e.g., black)
          continue;
        }
      
        const color = new THREE.Color();
      
        // Map elevation to a color gradient
        if (elevation < 0) {
          // Below sea level (negative values)
          const normalizedElevation = Math.max(elevation / -1000, -1);
          color.setHSL(0.6, 1, 0.5 + (normalizedElevation + 1) / 2); // Blue to black
        } else {
          // Above sea level (positive values)
          const normalizedElevation = Math.min(elevation / 1000, 1);
          color.setHSL(0.3, 1, 0.5 + normalizedElevation / 2); // Green to white
        }
      
        colors.push(color.r, color.g, color.b);
      }
      console.log(colors);
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      console.log(geometry)

    // Create a scene
    const scene = new THREE.Scene();

    // Create a camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 100, 200);
    camera.lookAt(0, 0, 0);

    // Create a renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create a material
    // const material = new THREE.MeshPhongMaterial({
    // vertexColors: true,
    // side: THREE.DoubleSide,
    // shininess: 0,
    // });
    // Create a MeshLambertMaterial
    // const material = new THREE.MeshLambertMaterial({
    //     vertexColors: true,
    //     side: THREE.BackSide,
    // });

    // const material = new THREE.MeshBasicMaterial({side: THREE.BackSide});
    const material = new THREE.MeshStandardMaterial({side: THREE.DoubleSide})

    // Create a mesh using the terrain geometry and material
    const terrainMesh = new THREE.Mesh(geometry, material);
    scene.add(terrainMesh);


    // Calculate the bounding box of the geometry
    const boundingBox = new THREE.Box3().setFromObject(terrainMesh);
    const center = boundingBox.getCenter(new THREE.Vector3());
    const size = boundingBox.getSize(new THREE.Vector3());

    // Position the camera to look down on the terrain
    const cameraDistance = Math.max(size.y) * 1.5; // Adjust the multiplier as needed
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

    // Set up orbit controls
    // const controls = new OrbitControls(camera, renderer.domElement);
    // controls.target.set(0, 0, 0);
    // controls.update();
    // Create an instance of FlyControls
    const controls = new FlyControls(camera, renderer.domElement);
    controls.movementSpeed = 100000; // Adjust the movement speed as needed
    controls.rollSpeed = Math.PI / 6; // Adjust the roll speed as needed
    controls.autoForward = false; // Set to true if you want automatic forward movement
    controls.dragToLook = true; // Set to true to enable drag to look around

    const clock = new THREE.Clock();

    // Update the controls in the animation loop
    function animate() {
    requestAnimationFrame(animate);
    controls.update(clock.getDelta());
    renderer.render(scene, camera);
    }

    // // Animation loop
    // function animate() {
    //     requestAnimationFrame(animate);
    //     controls.update();
    //     renderer.render(scene, camera);
    // }

    // Start the animation loop
    animate();

    }
  });


