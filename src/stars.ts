import * as THREE from "three";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";

export function addStars(scene: THREE.Scene) {
  const stars = document.getElementById("stars");
  const starsCSS = new CSS3DObject( stars! );
  starsCSS.scale.multiplyScalar(2);
  
  const upStars = starsCSS.clone();
  upStars.position.y = 900;
  upStars.rotation.x = Math.PI/2;
  scene.add(upStars);

  const downStars = starsCSS.clone();
  downStars.position.y = -900;
  downStars.rotation.x = Math.PI/2;
  scene.add(downStars);

  const frontStars = starsCSS.clone();
  frontStars.position.z = 1000;
  scene.add(frontStars);

  const leftStars = starsCSS.clone();
  leftStars.position.x = 1000;
  leftStars.rotation.y = Math.PI/2;
  scene.add(leftStars);

  const rightStars = starsCSS.clone();
  rightStars.position.x = -1000;
  rightStars.rotation.y = Math.PI/2;
  scene.add(rightStars);

  starsCSS.position.z = -1000;
  scene.add(starsCSS);
}