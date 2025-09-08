import * as THREE from 'three';

import { eventEmitter } from '../utils/eventEmitter';

import type { Era } from '../types';

// states of history ages

// base is the respresantation of a clan in the game can have 3 types of building state
export class Base {
  private scene: THREE.Scene;
  private baseGroup: THREE.Group;
  private era: Era;
  private mesh: THREE.Mesh | null;
  private isAlly: boolean;

  constructor(scene: THREE.Scene, isAlly: boolean) {
    this.mesh = null;
    this.scene = scene;
    this.isAlly = isAlly;
    this.baseGroup = new THREE.Group();
    this.scene.add(this.baseGroup);
    if (isAlly) {
      this.baseGroup.position.set(-5.5, 0.4, 0);
    } else {
      this.baseGroup.position.set(5.5, 0.4, 0);
    }
    this.era = 'Stone Age';
    this.updateEra('Stone Age');

    eventEmitter.on('base-attack', (isToAlly: boolean, amount: number) => {
      if (isToAlly === this.isAlly) {
        this.attack(amount);
      }
    });
    eventEmitter.on('base-update-era', (era: Era) => {
      this.updateEra(era);
    });
  }

  private attack(amount: number) {
    console.log((this.isAlly ? 'ally' : 'enemy') + ' attacked by ' + amount);
  }

  updateEra(era: Era) {
    this.era = era;
    if (this.mesh) {
      this.baseGroup.remove(this.mesh);
    }
    switch (this.era) {
      case 'Stone Age':
        this.mesh = new THREE.Mesh(
          new THREE.BoxGeometry(1, 1, 1),
          new THREE.MeshStandardMaterial({ color: 0x00ff00 })
        );

        break;
      case 'Iron Age':
        this.mesh = new THREE.Mesh(
          new THREE.BoxGeometry(1, 1, 1),
          new THREE.MeshStandardMaterial({ color: 0x0000ff })
        );
        break;
      case 'Medieval Era':
        this.mesh = new THREE.Mesh(
          new THREE.BoxGeometry(1, 1, 1),
          new THREE.MeshStandardMaterial({ color: 0xff0000 })
        );
        break;
      case 'Modern Era':
        this.mesh = new THREE.Mesh(
          new THREE.BoxGeometry(1, 1, 1),
          new THREE.MeshStandardMaterial({ color: 0x00ffff })
        );
        break;
      case 'Post Modern Era':
        this.mesh = new THREE.Mesh(
          new THREE.BoxGeometry(1, 1, 1),
          new THREE.MeshStandardMaterial({ color: 0xff00ff })
        );
        break;
    }
    this.baseGroup.add(this.mesh);
  }

  getObject() {
    return this.baseGroup;
  }
}
