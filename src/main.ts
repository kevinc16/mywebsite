import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";

// ===== post processing =====
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";

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

import { addText } from "./text";

// ============= globals =============
// const rotationRad = 0.0015;

// ============== init ===============

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);

const camera = new THREE.PerspectiveCamera(
  80,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);
camera.position.z = 0.01; // for the drag effect

const raycaster = new THREE.Raycaster();

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.className = "container-fluid";
document.body.appendChild(renderer.domElement);
// renderer.setClearColor( 0xaaaaaa, 1 );

// ============ functions ============

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

  // ===== ambient light =====

  const ambientLight = new THREE.AmbientLight("white");
  scene.add(ambientLight);

  // ===== font =====

  let introText = new THREE.Group();
  const fontLoader = new FontLoader();
  addText(
    fontLoader, 
    scene, 
    introText, 
    1,
    new Vector3(0, 0, -5),
    new Vector3(0, 0, 0),
    true,
    "This is Kevin's \nWebsite"
  )

  let descriptionText = new THREE.Group();
  addText(
    fontLoader, 
    scene, 
    descriptionText, 
    0.37,
    new Vector3(0, -5, 0),
    new Vector3(-Math.PI/2, 0, 0),
    false,
    "Hello! \
    \nI'm a Computer Engineering student at the University of Waterloo. \
    \nI love to learn and enjoy building applications for new tech."
  )

  // ========================= model ==============================

  const loadingManager = new THREE.LoadingManager(() => {
    const loadingScreen = document.getElementById("loading-screen");
    loadingScreen!.classList.add("fade-out");

    // optional: remove loader from DOM via event listener
    loadingScreen!.addEventListener("transitionend", onTransitionEnd);
  });

  const gltfloader = new GLTFLoader(loadingManager);

  let modelSqu = new THREE.Object3D();
  let mainModel: THREE.Group;
  gltfloader.load(
    "assets/sunrise/scene.gltf",
    function (gltf) {
      mainModel = gltf.scene;
      mainModel.scale.multiplyScalar(1 / 10);

      let box3 = new THREE.Box3().setFromObject(mainModel);
      // scene.add(new THREE.Box3Helper(box3, 0xFF0000));

      let center = new Vector3();
      box3.getCenter(center);
      mainModel.position.sub(center);
      // scene.add(new THREE.Box3Helper(new THREE.Box3().setFromObject(mainModel)));
      modelSqu.add(mainModel);
      modelSqu.position.set(0, 0, 0);

      // scene.add(modelSqu);

      return mainModel;
    },
    // called while loading is progressing
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    function (error) {
      console.error(error);
    }
  );

  // ===== post processing =====

  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  // ================ orbit controls ====================

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.rotateSpeed *= -0.6;

  // ============== animate ================

  function animate() {
    requestAnimationFrame(animate);

    // if (group) {
    //   rotateAboutPoint(
    //     group,
    //     new Vector3(0, 0, 0),
    //     new Vector3(0, 1, 0),
    //     -rotationRad,
    //     true
    //   );
    // }

    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    onWindowResize();

    composer.render();
  }
  window.addEventListener("mousemove", onMouseMove, false);
  window.addEventListener("resize", onWindowResize, false);

  animate();
}

// ===== main ======

main();
