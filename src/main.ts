import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";

// ===== post processing =====
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

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
import { onMouseClick } from "./mouseEvents";

// ============= globals =============
const rotationRad = 0.0015;

// ============== init ===============

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);

const camera = new THREE.PerspectiveCamera(
  80,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);

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

  // camera.position.z = 20;
  // camera.position.y = 50;
  // camera.position.z = 5;
  // camera.position.y = 0;
  // camera.position.x = 0;

  // let geometry = new THREE.SphereGeometry(0.03);
  // let material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  // const sphere = new THREE.Mesh(geometry, material);
  // sphere.position.set(0,0,0);
  // scene.add(sphere);

  // ===== grid helper =====
  // let gridhelper = new THREE.GridHelper(200, 50);
  // scene.add(gridhelper);

  // ===== ambient light =====
  const ambientLight = new THREE.AmbientLight("white");
  scene.add(ambientLight);

  // ===== font =====

  let group: THREE.Group;
  let text: THREE.Mesh;
  let lineText: THREE.Object3D<THREE.Event>;
  let clone: THREE.Group;
  const fontLoader = new FontLoader();
  fontLoader.load("fonts/helvetiker_regular.typeface.json", function (font) {
    const color = 0x006699;

    const matDark = new THREE.LineBasicMaterial({
      color: color,
      side: THREE.DoubleSide,
    });

    const matLite = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
    });

    const message = "This is Kevin's \nWebsite";

    const shapes = font.generateShapes(message, 1);

    const geometry = new THREE.ShapeGeometry(shapes);
    geometry.computeBoundingBox();
    const xMid =
      -0.5 * (geometry.boundingBox!.max.x - geometry.boundingBox!.min.x);
    // const yMid = - 0.5 * ( geometry.boundingBox!.max.y - geometry.boundingBox!.min.y );
    const yMid = 0;
    geometry.translate(xMid, yMid, 0);

    // make shape ( N.B. edge view not visible )

    text = new THREE.Mesh(geometry, matLite);
    text.position.z = -0.3;

    // make line shape ( N.B. edge view remains visible )

    const holeShapes = [];
    for (let i = 0; i < shapes.length; i++) {
      const shape = shapes[i];

      if (shape.holes && shape.holes.length > 0) {
        for (let j = 0; j < shape.holes.length; j++) {
          const hole = shape.holes[j];
          holeShapes.push(hole);
        }
      }
    }
    shapes.push.apply(shapes, holeShapes);

    lineText = new THREE.Object3D();
    for (let i = 0; i < shapes.length; i++) {
      const shape = shapes[i];
      const points = shape.getPoints();
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      geometry.translate(xMid, 0, 0);

      const lineMesh = new THREE.Line(geometry, matDark);
      lineText.add(lineMesh);
    }

    group = new THREE.Group();
    group.add(text);
    group.add(lineText);
    group.position.z = -5;

    scene.add(group);

    clone = group.clone();
    clone.position.z = 5;
    clone.rotation.y = Math.PI;
    scene.add(clone);
  });

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

  // const params = {
  //   exposure: 0,
  //   bloomStrength: 1.5,
  //   bloomThreshold: 0,
  //   bloomRadius: 1.5
  // };
  // const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
  // bloomPass.threshold = params.bloomThreshold;
  // bloomPass.strength = params.bloomStrength;
  // bloomPass.radius = params.bloomRadius;
  // composer.addPass(bloomPass);

  // const glitchPass = new GlitchPass();
  // composer.addPass( glitchPass );

  // document.addEventListener(
  //   "click",
  //   () => {
  //     raycaster.setFromCamera(mouse, camera);
  //     const intersects = raycaster.intersectObjects([sphere]);

  //     const isIntersected = intersects.find(
  //       (intersectedEl) => intersectedEl.object.uuid === sphere.uuid
  //     );
  //     console.log(intersects);
  //     intersects[0].object.scale.set(1.5, 1.5, 1.5);

  //     if (isIntersected) {
  //       onMouseClick();
  //     }
  //   },
  //   false
  // );

  // ================ orbit controls ====================

  const instructions = document.getElementById("hint");
  const controls = new PointerLockControls(camera, renderer.domElement);
  document.body.addEventListener("click", function () {
    controls.lock();
  });
  controls.addEventListener("lock", function () {
    instructions!.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      {
        duration: 500,
      }
    );
    instructions!.style.opacity = "0";
  });
  controls.addEventListener("unlock", function () {
    instructions!.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      {
        duration: 1000,
      }
    );
    instructions!.style.opacity = "1";
  });
  // controls.enableZoom = false;

  // ============== animate ================

  function animate() {
    requestAnimationFrame(animate);

    if (group) {
      rotateAboutPoint(
        group,
        new Vector3(0, 0, 0),
        new Vector3(0, 1, 0),
        -rotationRad,
        true
      );
    }

    if (clone) {
      rotateAboutPoint(
        clone,
        new Vector3(0, 0, 0),
        new Vector3(0, 1, 0),
        -rotationRad,
        true
      );
    }

    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);
    // const intersects: any = raycaster.intersectObjects([sphere]);

    // sphere.material.color.set("white");
    // sphere.scale.set(1, 1, 1);
    // for (let i = 0; i < intersects.length; i++) {
    //   intersects[i].object.material.color.set(0xff00ff);
    //   intersects[i].object.scale.set(1.2, 1.2, 1.2);
    // }

    onWindowResize();

    composer.render();
  }
  window.addEventListener("mousemove", onMouseMove, false);
  window.addEventListener("resize", onWindowResize, false);

  animate();
}

// ===== main ======

main();
