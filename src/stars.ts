import * as THREE from "three";

export function addStars(scene: THREE.Scene, stars: any[]) {
  // top
  const color = 0xeeeeee;
  for ( var y = 100; y < 1000; y += 10 ) {
    var geometry   = new THREE.SphereGeometry(0.5, 32, 32)
    var material = new THREE.MeshBasicMaterial( {color: color} );
    var sphere = new THREE.Mesh(geometry, material)

    sphere.position.x = Math.random() * 1000 - 500;
    sphere.position.y = y;
    sphere.position.z = Math.random() * 1000 - 500;;

    stars.push(sphere);
  }
  // right
  for ( var y = 100; y < 1000; y += 10 ) {
    var geometry   = new THREE.SphereGeometry(0.5, 32, 32)
    var material = new THREE.MeshBasicMaterial( {color: color} );
    var sphere = new THREE.Mesh(geometry, material)

    sphere.position.x = y;
    sphere.position.y = Math.random() * 1000;
    sphere.position.z = Math.random() * 1000 - 500;

    stars.push(sphere);
  }
  // left
  for ( var y = -100; y > -1000; y -= 10 ) {
    var geometry   = new THREE.SphereGeometry(0.5, 32, 32)
    var material = new THREE.MeshBasicMaterial( {color: color} );
    var sphere = new THREE.Mesh(geometry, material)

    sphere.position.x = y;
    sphere.position.y = Math.random() * 1000;
    sphere.position.z = Math.random() * 1000 - 500;

    stars.push(sphere);
  }
  // front
  for ( var y = 100; y < 1000; y += 10 ) {
    var geometry   = new THREE.SphereGeometry(0.5, 32, 32)
    var material = new THREE.MeshBasicMaterial( {color: color} );
    var sphere = new THREE.Mesh(geometry, material)

    sphere.position.x = Math.random() * 1000 - 500;
    sphere.position.y = Math.random() * 1000;
    sphere.position.z = y

    stars.push(sphere);
  }
  // back
  for ( var y = -100; y > -1000; y -= 10 ) {
    var geometry   = new THREE.SphereGeometry(0.5, 32, 32)
    var material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
    var sphere = new THREE.Mesh(geometry, material)

    sphere.position.x = Math.random() * 1000 - 500;
    sphere.position.y = Math.random() * 1000;
    sphere.position.z = y

    stars.push(sphere);
  }
}

export function addStarsToScene(scene: THREE.Scene, stars: any[]) {
  stars.map((star) => {
    scene.add(star);
  })
}

export function removeStarsFromScene(scene: THREE.Scene, stars: any[]) {
  stars.map((star) => {
    scene.remove(star);
  })
  stars = [];
}