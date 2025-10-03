import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { eventEmitter } from '../utils/eventEmitter';

import type { Era } from '../types';

// states of history ages
const environementMesh: Record<Era, string> = {
  'Stone Age': '/models/environement/stone_age.glb',
  'Iron Age': '/models/environement/iron_age.glb',
  'Medieval Era': '/models/environement/medieval_era.glb',
  'Modern Era': '/models/environement/modern_era.glb',
  'Post Modern Era': '/models/environement/post_modern_era.glb',
};

// base is the respresantation of a clan in the game can have 3 types of building state
export class Base {
  private scene: THREE.Scene;
  private baseGroup: THREE.Group;
  private era: Era;
  private mesh: THREE.Object3D | null;
  private isAlly: boolean;
  private loader: GLTFLoader;

  constructor(scene: THREE.Scene, isAlly: boolean) {
    this.mesh = null;
    this.scene = scene;
    this.isAlly = isAlly;
    this.baseGroup = new THREE.Group();
    this.scene.add(this.baseGroup);
    this.baseGroup.scale.multiplyScalar(0.5);
    this.baseGroup.scale.x *= isAlly ? -1 : 1;
    this.era = 'Stone Age';
    this.loader = new GLTFLoader();

    this.updateEra('Stone Age', isAlly);

    eventEmitter.on('base-update-era', (era: Era, isAlly: boolean) => {
      this.updateEra(era, isAlly);
    });
  }

  updateEra(era: Era, isAlly: boolean) {
    if (this.isAlly !== isAlly) return;
    this.era = era;

    if (this.mesh) {
      this.baseGroup.remove(this.mesh);
      this.mesh = null;
    }

    const path = environementMesh[this.era];
    this.loader.load(
      path,
      (gltf) => {
        this.mesh = gltf.scene;
        this.baseGroup.add(this.mesh);
      },
      undefined,
      (error) => {
        console.error('Error loading model:', error);
      }
    );
  }

  getObject() {
    return this.baseGroup;
  }
}
