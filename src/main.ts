import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';

import CameraControls from 'camera-controls';

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

CameraControls.install( { THREE: THREE } );

import "./style.scss";
import { Vector3 } from "three";
import { rotateAboutPoint } from "./util";

import { addText } from "./text";

// ============= globals =============
// const rotationRad = 0.0015;

// ============== init ===============

const clock = new THREE.Clock();
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);
camera.position.z = 0.001; // for the drag effect

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
    0.7,
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
    0.3,
    new Vector3(0, -5, -0.5),
    new Vector3(-Math.PI/2, 0, 0),
    false,
    "Hello! \
    \nI'm a Computer Engineering student at the \nUniversity of Waterloo. \
    \nI love to learn and enjoy building applications \nfor new tech."
  )

  let projectTitleText = new THREE.Group();
  addText(
    fontLoader, 
    scene, 
    projectTitleText, 
    0.35,
    new Vector3(-0.8, 5, 1.2),
    new Vector3(Math.PI/2, 0, 0),
    false,
    "Some projects I made:"
  )
  let projectText = new THREE.Group();
  addText(
    fontLoader, 
    scene, 
    projectText, 
    0.27,
    new Vector3(0, 5, 0.5),
    new Vector3(Math.PI/2, 0, 0),
    false,
    "Flutter Dictionary \
    \nPathfinder \
    \nSorting Visualizer \
    \n \
    \nYou can find more on my GitHub page \
    "
  )

  // let catText = new THREE.Group();
  // addText(
  //   fontLoader, 
  //   scene, 
  //   catText, 
  //   0.3,
  //   new Vector3(0, 1, 5),
  //   new Vector3(0, Math.PI, 0),
  //   true,
  //   "Our cat \
  //   "
  // )

  let socialsText = new THREE.Group();
  addText(
    fontLoader, 
    scene, 
    socialsText,
    0.3,
    new Vector3(-5, 1, 0),
    new Vector3(0, Math.PI/2, 0),
    false,
    "Email: z576chen@uwaterloo.ca\
    \nLinkedIn: kevinc16\
    \nGitHub: kevinc16\
    "
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

  // const controls = new OrbitControls(camera, renderer.domElement);
  // controls.enableZoom = false;
  // controls.enablePan = false;
  // controls.rotateSpeed *= -0.6;
  const cameraControls = new CameraControls( camera, renderer.domElement );
  cameraControls.minDistance = cameraControls.maxDistance = 1;
  cameraControls.azimuthRotateSpeed = - 0.3; // negative value to invert rotation direction
  cameraControls.polarRotateSpeed   = - 0.3; // negative value to invert rotation direction

  cameraControls.mouseButtons.middle = CameraControls.ACTION.NONE;
  cameraControls.mouseButtons.right = CameraControls.ACTION.NONE;
  cameraControls.mouseButtons.wheel = CameraControls.ACTION.NONE;

  cameraControls.saveState();

  // ===== events =====

  const projects = document.getElementById("projects");
  projects!.onclick = (e: MouseEvent) => {
    cameraControls.rotateTo( 0 , 180 * THREE.MathUtils.DEG2RAD, true );
  }

  const aboutMe = document.getElementById("about-me");
  aboutMe!.onclick = (e: MouseEvent) => {
    cameraControls.rotateTo( 0 , -180 * THREE.MathUtils.DEG2RAD, true );
  }

  const contacts = document.getElementById("contacts");
  contacts!.onclick = (e: MouseEvent) => {
    cameraControls.rotateTo( Math.PI/2, 90 * THREE.MathUtils.DEG2RAD, true );
  }

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

    const delta = clock.getDelta();
    cameraControls.update( delta );

    composer.render();
  }
  // window.addEventListener("mousemove", onMouseMove, false);
  window.addEventListener("resize", onWindowResize, false);

  animate();
}

// ===== main ======

main();
