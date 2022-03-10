import * as THREE from "three";
import { Vector3 } from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";

export function addText(
  fontLoader: FontLoader,
  scene: THREE.Scene,
  group: THREE.Group,
  fontSize: number,
  position: Vector3,
  rotation: Vector3,
  doubleText: boolean,
  message: string
) {
  let lineText: THREE.Object3D<THREE.Event>;
  // let clone: THREE.Group;
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

    const shapes = font.generateShapes(message, fontSize);

    const geometry = new THREE.ShapeGeometry(shapes);
    geometry.computeBoundingBox();
    const xMid =
      -0.5 * (geometry.boundingBox!.max.x - geometry.boundingBox!.min.x);
    // const yMid = - 0.5 * ( geometry.boundingBox!.max.y - geometry.boundingBox!.min.y );
    const yMid = 0;
    geometry.translate(xMid, yMid, 0);

    // make shape ( N.B. edge view not visible )
    const text = new THREE.Mesh(geometry, matLite);
    text.position.z = - (fontSize / 3);

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
    if (doubleText) {
      // @ts-ignore: the types are different
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
    }

    group = new THREE.Group();
    group.add(text);
    if(lineText) group.add(lineText);
    group.position.x = position.x;
    group.position.y = position.y;
    group.position.z = position.z;

    group.rotation.x = rotation.x;
    group.rotation.y = rotation.y;
    group.rotation.z = rotation.z;

    scene.add(group);
  });
}