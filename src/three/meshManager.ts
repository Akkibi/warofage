import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

export class MeshGenerator {
  private mesh: THREE.Group | null;
  private gltfLoader: GLTFLoader;
  private group: THREE.Group;
  private url: string;

  constructor(
    group: THREE.Group,
    size: number,
    color: THREE.Color,
    url: string
  ) {
    this.group = group;
    this.url = url;
    this.gltfLoader = new GLTFLoader();
    this.mesh = null;
    this.loadModel(size, color);
  }

  public async loadModel(size: number, color: THREE.Color) {
    this.gltfLoader.load(this.url, (gltf) => {
      const mesh = gltf.scene.children[0] as THREE.Group;
      // console.log(mesh);
      (mesh.children[0] as THREE.Mesh).material =
        new THREE.MeshStandardMaterial({
          color: color,
        });
      mesh.position.y = 0;
      mesh.castShadow = true;
      mesh.scale.multiplyScalar(size);
      this.mesh = mesh;
      this.group.add(mesh);
    });
  }

  public getMesh = () => {
    return this.mesh;
  };

  public setColor = (color: THREE.Color) => {
    if (this.mesh) {
      (
        (this.mesh.children[0] as THREE.Mesh)
          .material as THREE.MeshStandardMaterial
      ).color = color;
    }
  };
}
