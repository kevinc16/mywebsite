import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';

import { Water } from 'three/examples/jsm/objects/Water';
import { Sky } from 'three/examples/jsm/objects/Sky';

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
import { addStars, addStarsToScene, removeStarsFromScene } from "./stars";

// ============= globals =============
// const rotationRad = 0.0015;
const bgColor = 0xeeeeee;
const dayFog = new THREE.FogExp2( bgColor, 0.0003 );
const nightFog = new THREE.FogExp2( 0x01001c, 0.0003 );

// ============== init ===============

const clock = new THREE.Clock();
const scene = new THREE.Scene();
scene.background = new THREE.Color(bgColor);
scene.fog = dayFog;

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  9000
);
camera.position.z = 0.001; // for the drag effect

const raycaster = new THREE.Raycaster();

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.className = "container-fluid";
renderer.toneMapping = THREE.ACESFilmicToneMapping;
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
    new Vector3(0, 1.2, -5),
    new Vector3(0, 0, 0),
    true,
    0.4,
    "This is Kevin's \nWebsite"
  );
  let clone = new THREE.Group();
  addText(
    fontLoader, 
    scene, 
    clone, 
    0.65,
    new Vector3(0, -1.8, -5),
    new Vector3(Math.PI, 0, 0),
    false,
    0.1,
    "This is Kevin's \nWebsite"
  );

  let descriptionText = new THREE.Group();
  addText(
    fontLoader, 
    scene, 
    descriptionText, 
    0.3,
    new Vector3(5, 1, 0.5),
    new Vector3(0, -Math.PI/2, 0),
    false,
    0.4,
    "Hello! \
    \nI'm a Computer Engineering student at \
    \nthe University of Waterloo. \
    \nI love to learn and enjoy building \
    \napplications for new tech."
  );

  let projectTitleText = new THREE.Group();
  addText(
    fontLoader, 
    scene, 
    projectTitleText, 
    0.35,
    new Vector3(0, 1.6, 5),
    new Vector3(0, Math.PI, 0),
    false,
    0.4,
    "Some projects:"
  );
  let projectText = new THREE.Group();
  addText(
    fontLoader, 
    scene, 
    projectText, 
    0.27,
    new Vector3(0, 1, 5),
    new Vector3(0, Math.PI, 0),
    false,
    0.4,
    "Flutter Dictionary \
    \nPathfinder \
    \nSorting Visualizer \
    \n \
    \nYou can find more on my GitHub page \
    "
  );

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
    0.4,
    "Email: z576chen@uwaterloo.ca\
    \nLinkedIn: kevinc16\
    \nGitHub: kevinc16\
    "
  );

  // ===== WATER =====

  const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 );
  const water = new Water(
    waterGeometry,
    {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load( 'textures/waternormals.jpg', function ( texture ) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      } ),
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x00395e,
      distortionScale: 3.7,
      fog: scene.fog !== undefined
    }
  );
  water.position.y = -100;
  water.rotation.x = - Math.PI / 2;
  scene.add( water );

  // ===== SKY =====

  const sun = new THREE.Vector3();
  const sky = new Sky();
  sky.scale.setScalar( 10000 );
  scene.add( sky );

  const skyUniforms = sky.material.uniforms;

  skyUniforms[ 'turbidity' ].value = 10;
  skyUniforms[ 'rayleigh' ].value = 2;
  skyUniforms[ 'mieCoefficient' ].value = 0.005;
  skyUniforms[ 'mieDirectionalG' ].value = 0.8;

  const parameters = {
    elevation: 180,
    azimuth: 90
  };

  let isNight = false;
  let stars: any[] = [];
  function updateSun() {

    const phi = THREE.MathUtils.degToRad( parameters.elevation );
    const theta = THREE.MathUtils.degToRad( parameters.azimuth );

    if (parameters.elevation % 360 > 88 && parameters.elevation % 360 < 272) {
      if (!isNight) {
        addStars(scene, stars);
        addStarsToScene(scene, stars);
        scene.fog = nightFog;
      }
      isNight = true;
    }
    else {
      if (isNight) {
        removeStarsFromScene(scene, stars);
        scene.fog = dayFog;
      }
      isNight = false;
    }

    sun.setFromSphericalCoords( 1, phi, theta );

    sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
    water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();

    // scene.environment = pmremGenerator.fromScene( sky ).texture;
  }
  updateSun();

  // ===== stars =====

  addStars(scene, stars);

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

  const cameraControls = new CameraControls( camera, renderer.domElement );
  cameraControls.minDistance = cameraControls.maxDistance = 1;
  cameraControls.minAzimuthAngle = -2*Math.PI;
  cameraControls.maxAzimuthAngle = 2*Math.PI;
  cameraControls.azimuthRotateSpeed = - 0.3; // negative value to invert rotation direction
  cameraControls.polarRotateSpeed   = - 0.3; // negative value to invert rotation direction

  cameraControls.mouseButtons.middle = CameraControls.ACTION.NONE;
  cameraControls.mouseButtons.right = CameraControls.ACTION.NONE;
  cameraControls.mouseButtons.wheel = CameraControls.ACTION.NONE;

  cameraControls.saveState();

  // ===== events =====

  const projects = document.getElementById("projects-link");
  projects!.onclick = (e: MouseEvent) => {
    // helps with less rotations in angle
    // if (cameraControls.azimuthAngle > 0)
    //   cameraControls.rotateTo( Math.PI , 90 * THREE.MathUtils.DEG2RAD, true );
    // else
    //   cameraControls.rotateTo( -Math.PI , 90 * THREE.MathUtils.DEG2RAD, true );
    const projects = document.getElementById("projects");
    projects!.classList.toggle("hidden");
  }
  
  const aboutMe = document.getElementById("about-me-link");
  aboutMe!.onclick = (e: MouseEvent) => {
    // if (cameraControls.azimuthAngle < Math.PI/2)
    //   cameraControls.rotateTo( -Math.PI/2 , 90 * THREE.MathUtils.DEG2RAD, true );
    // else
    //   cameraControls.rotateTo( Math.PI*3/2 , 90 * THREE.MathUtils.DEG2RAD, true );
    const aboutMe = document.getElementById("about-me");
    aboutMe!.classList.toggle("hidden");
  }

  const contacts = document.getElementById("contacts-link");
  contacts!.onclick = (e: MouseEvent) => {
    // if (cameraControls.azimuthAngle > -Math.PI/2)
    //   cameraControls.rotateTo( Math.PI/2 , 90 * THREE.MathUtils.DEG2RAD, true );
    // else
    //   cameraControls.rotateTo( -Math.PI*3/2 , 90 * THREE.MathUtils.DEG2RAD, true );
    const contact = document.getElementById("contact");
    contact!.classList.toggle("hidden");
  }

  // ============== animate ================

  function animate() {
    requestAnimationFrame(animate);
        
    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);
    
    onWindowResize();

    const delta = clock.getDelta();
    cameraControls.update( delta );

    composer.render();

    water.material.uniforms[ 'time' ].value += 0.2 / 60.0;
    
    // parameters.elevation += 0.1;
    updateSun();
  }
  // window.addEventListener("mousemove", onMouseMove, false);
  window.addEventListener("resize", onWindowResize, false);
  window.addEventListener("scroll", onWindowResize, false);

  animate();
}

// ===== main ======

main();
