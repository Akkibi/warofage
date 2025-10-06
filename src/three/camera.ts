import * as THREE from 'three';
import { lerp } from 'three/src/math/MathUtils.js';

import { eventEmitter } from '../utils/eventEmitter';
import { useStore } from '../store';

import type { SwipeDataType } from '../utils/touchHandler';

export class Camera {
  private static instance: Camera; // must be static
  private cameraGroup: THREE.Group;
  private camera: THREE.PerspectiveCamera;
  private scroll: {
    min: number;
    max: number;
    current: number;
    target: number;
  };

  private constructor() {
    this.cameraGroup = new THREE.Group();
    this.camera = new THREE.PerspectiveCamera(
      25,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.cameraGroup.add(this.camera);
    this.camera.position.y = 5;
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.cameraGroup.rotation.x = Math.PI / 3;
    this.cameraGroup.rotation.z = 0;
    this.cameraGroup.rotation.y = 0;

    this.scroll = {
      min: -4.2,
      max: 4.2,
      current: 5,
      target: 0,
    };
    window.addEventListener('wheel', this.handleScroll);
    eventEmitter.on('swipeX', this.handleSwipe);
  }

  private handleSwipe = (e: SwipeDataType) => {
    this.storeScroll(e.distance * 0.01 * (e.direction === 'left' ? 1 : -1));
  };

  private handleScroll = (e: WheelEvent) => {
    this.storeScroll(e.deltaY * 0.01);
  };

  private storeScroll(amount: number) {
    if (
      useStore.getState().enemyHealth <= 0 ||
      useStore.getState().playerHealth <= 0
    )
      return;
    if (
      this.scroll.target < this.scroll.min - 2 ||
      this.scroll.target > this.scroll.max + 2
    )
      return;
    this.scroll.target += amount;
  }
  public animate(deltaTime: number) {
    if (this.scroll.target < this.scroll.min) {
      this.scroll.target = lerp(
        this.scroll.target,
        this.scroll.min,
        0.01 * deltaTime
      );
    } else if (this.scroll.target > this.scroll.max) {
      this.scroll.target = lerp(
        this.scroll.target,
        this.scroll.max,
        0.01 * deltaTime
      );
    }
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, 0.1);
    this.cameraGroup.position.x = this.scroll.current;

    const distanceFromTarget = this.cameraGroup.position.x - this.scroll.target;
    const newFov = 25 + Math.abs(distanceFromTarget) * 3;
    this.camera.fov = lerp(this.camera.fov, newFov, 0.01 * deltaTime);
    this.camera.updateProjectionMatrix();
  }

  public getCamera() {
    return this.camera;
  }

  public getCameraGroup() {
    return this.cameraGroup;
  }

  public static getInstance() {
    if (!Camera.instance) {
      Camera.instance = new Camera();
    }
    return Camera.instance;
  }
}
