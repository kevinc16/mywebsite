import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';

import CameraControls from 'camera-controls';


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

import { addStars } from "./stars";
import { rotateAboutPoint } from "./util";

import "./style.scss";
import { Vector3 } from "three";

// ============= globals =============
// const rotationRad = 0.0015;
const bgColor = 0xeeeeee;
const distance = 135; // in px

// ============== init ===============
CameraControls.install( { THREE: THREE } );

const clock = new THREE.Clock();
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

let camera: THREE.PerspectiveCamera, renderer: CSS3DRenderer;
let controls: CameraControls;
let disableAutoRotate = false;
let descCSS: CSS3DObject, contactsCSS: CSS3DObject, aboutMeCSS: CSS3DObject, projectsCSS: CSS3DObject;

init();
animate();

function init() {

  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 2000 );
  camera.position.z = 899;

  // table

  // for ( let i = 0; i < table.length; i += 5 ) {

  //   const element = document.createElement( 'div' );
  //   element.className = 'element';
  //   element.style.backgroundColor = 'rgba(0,127,127,' + ( Math.random() * 0.5 + 0.25 ) + ')';

  //   const number = document.createElement( 'div' );
  //   number.className = 'number';
  //   number.textContent = `${( i / 5 ) + 1}`;
  //   element.appendChild( number );

  //   const symbol = document.createElement( 'div' );
  //   symbol.className = 'symbol';
  //   symbol.textContent = `${table[ i ]}`;
  //   element.appendChild( symbol );

  //   const details = document.createElement( 'div' );
  //   details.className = 'details';
  //   details.innerHTML = table[ i + 1 ] + '<br>' + table[ i + 2 ];
  //   element.appendChild( details );

  //   const objectCSS = new CSS3DObject( element );
  //   objectCSS.position.x = ( table[ i + 3 ] * 140 ) - 1330;
  //   objectCSS.position.y = ( table[ i + 4 ] * 180 ) - 1000;
  //   objectCSS.position.z = 0
  //   scene.add( objectCSS );

  // }

  const desc = document.getElementById("desc");
  descCSS = new CSS3DObject( desc! );
  descCSS.position.z = distance;
  scene.add(descCSS);

  const contacts = document.getElementById("contact");
  contactsCSS = new CSS3DObject( contacts! );
  contactsCSS.position.z = -distance;
  contactsCSS.rotation.y = Math.PI;
  scene.add(contactsCSS);
  
  const aboutMe = document.getElementById("about-me");
  aboutMeCSS = new CSS3DObject( aboutMe! );
  aboutMeCSS.position.x = distance;
  aboutMeCSS.rotation.y = Math.PI/2;
  scene.add(aboutMeCSS);

  const projects = document.getElementById("projects");
  projectsCSS = new CSS3DObject( projects! );
  projectsCSS.position.x = -distance;
  projectsCSS.rotation.y = -Math.PI/2;
  scene.add(projectsCSS);

  const top = document.getElementById("top");
  const topCSS = new CSS3DObject( top! );
  topCSS.position.y = distance - 25;
  topCSS.rotation.x = -Math.PI/2;
  scene.add(topCSS);

  const down = document.getElementById("bot");
  const downCSS = new CSS3DObject( down! );
  downCSS.position.y = -(distance - 25);
  downCSS.rotation.x = -Math.PI/2;
  scene.add(downCSS);

  const pathfinder = document.getElementById("pathfinder");
  const pathfinderCSS = new CSS3DObject( pathfinder! );
  pathfinderCSS.position.x = -200;
  pathfinderCSS.rotation.y = -Math.PI/2;
  // scene.add(pathfinderCSS);

  addStars(scene);

  const links = document.getElementsByTagName('a');
  for (var i = 0; i < links.length; i++) {
    links[i].onclick = (e) => {
      e.preventDefault();
      window.open(`${e.target}`, '_blank');
    };
  }
  console.log(links)

  //

  renderer = new CSS3DRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.getElementById( 'app' )!.appendChild( renderer.domElement );

  //

  controls = new CameraControls( camera, renderer.domElement );
  controls.minDistance = controls.maxDistance = 1000
  controls.mouseButtons.middle = CameraControls.ACTION.NONE;
  controls.mouseButtons.right = CameraControls.ACTION.NONE;
  controls.mouseButtons.wheel = CameraControls.ACTION.NONE;;
  controls.addEventListener( 'control', render );

  controls.addEventListener( 'transitionstart', () => {
    disableAutoRotate = true;
  } );

  controls.rotate(0.75, -0.1, false);

  const projectsLink = document.getElementById("projects-link");
  const aboutMeLink = document.getElementById("about-me-link");
  const contactsLink = document.getElementById("contacts-link");

  contactsLink!.onclick = (e: MouseEvent) => {
    // helps with less rotations in angle
    if (controls.azimuthAngle > 0)
      controls.rotateTo( Math.PI , 90 * THREE.MathUtils.DEG2RAD, true );
    else
      controls.rotateTo( -Math.PI , 90 * THREE.MathUtils.DEG2RAD, true );
  }

  projectsLink!.onclick = (e: MouseEvent) => {
    if (controls.azimuthAngle < Math.PI/2)
      controls.rotateTo( -Math.PI/2 , 90 * THREE.MathUtils.DEG2RAD, true );
    else
      controls.rotateTo( Math.PI*3/2 , 90 * THREE.MathUtils.DEG2RAD, true );
  }

  aboutMeLink!.onclick = (e: MouseEvent) => {
    if (controls.azimuthAngle > -Math.PI/2)
      controls.rotateTo( Math.PI/2 , 90 * THREE.MathUtils.DEG2RAD, true );
    else
      controls.rotateTo( -Math.PI*3/2 , 90 * THREE.MathUtils.DEG2RAD, true );
  }

  window.addEventListener( 'resize', onWindowResize );

  const loadingManager = new THREE.LoadingManager(() => {
    const loadingScreen = document.getElementById("loading-screen");
    loadingScreen!.classList.add("fade-out");

    // optional: remove loader from DOM via event listener
    loadingScreen!.addEventListener("transitionend", (event: any) => {
      const element = event.target;
      element.remove();
    });
  });
  const gltfloader = new GLTFLoader(loadingManager);

  gltfloader.load(
    "assets/sunrise/scene.gltf",
    function (gltf) {
      // do nothing
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );

}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

  render();
}

function animate() {
  requestAnimationFrame( animate );

  const delta = clock.getDelta();
  controls.update(delta);

  if ( ! disableAutoRotate ) {

		controls.azimuthAngle += 2.5 * delta * THREE.MathUtils.DEG2RAD;

	}

  render();
}

function render() {
  renderer.render( scene, camera );
}
