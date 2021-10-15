import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/*
    Y
    |
    |
    |
    |------------> X
   /
  /
 /
Z 
*/

import "./style.scss";
import { Vector3 } from "three";
import { rotateAboutPoint } from "./util";

// ============= globals =============
const rotationRad = 0.0003;

// ============== init ===============
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const raycaster = new THREE.Raycaster();

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.className = "container-fluid";
document.body.appendChild(renderer.domElement);

function onMouseClick() {
  const desc = document.getElementsByClassName("desc")[0];
  if (desc.classList.contains("hidden")) desc.classList.remove("hidden");
  else desc.classList.add("hidden");
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onTransitionEnd(event: any) {
  const element = event.target;
  element.remove();
}

const mouse = new THREE.Vector2();
function onMouseMove(event: MouseEvent) {
  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function main() {
  renderer.outputEncoding = THREE.sRGBEncoding;

  camera.position.z = 5;

  const geometry = new THREE.SphereGeometry(0.03);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(0.2, 1.45, 1.4);
  sphere.addEventListener("onclick", () => {
    sphere.scale.set(1.5, 1.5, 1.5);
  });
  scene.add(sphere);

  const ambientLight = new THREE.AmbientLight("white");
  scene.add(ambientLight);

  // ========================= model ==============================

  const loadingManager = new THREE.LoadingManager(() => {
    const loadingScreen = document.getElementById("loading-screen");
    loadingScreen!.classList.add("fade-out");

    // optional: remove loader from DOM via event listener
    loadingScreen!.addEventListener("transitionend", onTransitionEnd);
  });

  const gltfloader = new GLTFLoader(loadingManager);

  let earth: THREE.Group;
  gltfloader.load(
    "../assets/a_windy_day/scene.gltf",
    function (gltf) {
      gltf.scene.scale.set(2, 2, 2);
      earth = gltf.scene;
      scene.add(earth);

      return gltf.scene;
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );

  document.addEventListener(
    "click",
    () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects([sphere]);

      const isIntersected = intersects.find(
        (intersectedEl) => intersectedEl.object.uuid === sphere.uuid
      );
      console.log(intersects);

      if (isIntersected) {
        onMouseClick();
      }
    },
    false
  );

  // ======================= orbit controls ============================

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;

  function animate() {
    requestAnimationFrame(animate);

    if (earth) earth.rotation.y += rotationRad;

    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);
    const intersects: any = raycaster.intersectObjects([sphere]);

    sphere.material.color.set("white");
    for (let i = 0; i < intersects.length; i++) {
      intersects[i].object.material.color.set(0xff0000);
    }
    rotateAboutPoint(
      sphere,
      new Vector3(0, 0, 0),
      new Vector3(0, 1, 0),
      rotationRad,
      true
    );

    controls.update();

    onWindowResize();

    renderer.render(scene, camera);
  }
  window.addEventListener("mousemove", onMouseMove, false);
  window.addEventListener("resize", onWindowResize, false);

  animate();
}

main();
