import * as THREE from 'three';
import { lerp } from 'three/src/math/MathUtils.js';

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
      min: -4,
      max: 4,
      current: 5,
      target: 0,
    };
    window.addEventListener('wheel', this.handleScroll);
  }

  private handleScroll = (e: WheelEvent) => {
    if (
      this.scroll.target < this.scroll.min - 2 ||
      this.scroll.target > this.scroll.max + 2
    )
      return;
    this.scroll.target += e.deltaY * 0.01;
  };

  public animate() {
    // this.cameraGroup.position.x = Math.sin(Date.now() / 1000) * 1;

    if (this.scroll.target < this.scroll.min) {
      this.scroll.target = lerp(this.scroll.target, this.scroll.min, 0.1);
    } else if (this.scroll.target > this.scroll.max) {
      this.scroll.target = lerp(this.scroll.target, this.scroll.max, 0.1);
    }
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, 0.1);
    this.cameraGroup.position.x = this.scroll.current;
    // this.camera.position.y = Math.cos(Date.now() / 1000) * 1;
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
