import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import (OrbitControls) from "three/"

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
import { addModel } from "./model";
import { Object3D, Vector3 } from "three";

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

function resizeCanvasToDisplaySize() {
  const canvas = renderer.domElement;
  // look up the size the canvas is being displayed
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  // adjust displayBuffer size to match
  if (canvas.width !== width || canvas.height !== height) {
    // you must pass false here or three.js sadly fights the browser
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    // update any render target sizes here
  }
}

// obj - your object (THREE.Object3D or derived)
// point - the point of rotation (THREE.Vector3)
// axis - the axis of rotation (normalized THREE.Vector3)
// theta - radian value of rotation
// pointIsWorld - boolean indicating the point is in world coordinates (default = false)
function rotateAboutPoint(
  obj: Object3D,
  point: Vector3,
  axis: Vector3,
  theta: number,
  pointIsWorld?: boolean
) {
  pointIsWorld = pointIsWorld === undefined ? false : pointIsWorld;

  if (pointIsWorld) {
    obj.parent!.localToWorld(obj.position); // compensate for world coordinate
  }

  obj.position.sub(point); // remove the offset
  obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
  obj.position.add(point); // re-add the offset

  if (pointIsWorld) {
    obj.parent!.worldToLocal(obj.position); // undo world coordinates compensation
  }

  obj.rotateOnAxis(axis, theta); // rotate the OBJECT
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

  const loader = new GLTFLoader();

  let earth: THREE.Group;
  loader.load(
    "../assets/a_windy_day/scene.gltf",
    function (gltf) {
      gltf.scene.scale.set(2, 2, 2);
      earth = gltf.scene;
      scene.add(earth);

      console.log(gltf);

      return gltf.scene;
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );

  document.addEventListener(
    "click",
    (event) => {
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

    resizeCanvasToDisplaySize();

    renderer.render(scene, camera);
  }
  window.addEventListener("mousemove", onMouseMove, false);

  animate();
}

main();
