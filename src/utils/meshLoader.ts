import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

export class GltfMeshLoader {
  private static instance: GltfMeshLoader;
  private gltfLoader: GLTFLoader;

  private constructor() {
    this.gltfLoader = new GLTFLoader();
  }

  public static getInstance(): GltfMeshLoader {
    if (!GltfMeshLoader.instance) {
      GltfMeshLoader.instance = new GltfMeshLoader();
    }
    return GltfMeshLoader.instance;
  }

  public async loadModel(
    url: string,
    group: THREE.Group | THREE.Scene
  ): Promise<THREE.Group> {
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        url,
        (gltf) => {
          const mesh = gltf.scene as THREE.Group;
          group.add(mesh);
          resolve(mesh);
        },
        undefined,
        (error) => reject(error)
      );
    });
  }
}
