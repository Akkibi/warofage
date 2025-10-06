import * as THREE from 'three';
import { gsap } from 'gsap';

import { Camera } from './camera';
import { Base } from './base';
import { CharacterManager } from './characterManager';
import { TurretManager } from './turretManager';
// import { RaycastManager } from './raycastManager';

export class SceneManager {
  private static instance: SceneManager;
  private canvas: HTMLDivElement | null;
  private scene: THREE.Scene;
  private camera: Camera;
  private renderer: THREE.WebGLRenderer;
  private characterManager: CharacterManager;
  private turretManager: TurretManager;
  private bases: Base[] = [];
  // private rayCastManager: RaycastManager;

  private constructor(canvas: HTMLDivElement) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x80abd2);
    this.camera = Camera.getInstance();
    // this.rayCastManager = RaycastManager.getInstance(
    //   this.scene,
    //   this.camera.getCamera()
    // );
    this.characterManager = CharacterManager.getInstance(this.scene);
    this.turretManager = TurretManager.getInstance(
      this.scene,
      this.characterManager.allyCharacterList,
      this.characterManager.enemyCharacterList
    );
    this.canvas = canvas;
    console.log('canvas', this.canvas);

    const ally = new Base(this.scene, true);
    const enemy = new Base(this.scene, false);
    this.bases.push(ally, enemy);

    this.scene.add(this.camera.getCameraGroup());

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.shadowMap.enabled = true;
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // ambian light
    const ambientLight = new THREE.AmbientLight(0x9090c0);
    this.scene.add(ambientLight);
    // sun light

    const sunLight = new THREE.DirectionalLight(0xffffee, 4);
    sunLight.position.set(1, 1, -1);
    sunLight.lookAt(new THREE.Vector3(0, 0, 0));
    sunLight.castShadow = true;
    sunLight.shadow.camera.near = -2; // default
    sunLight.shadow.camera.far = 100; // default
    sunLight.shadow.mapSize.width = 1024; // default
    sunLight.shadow.mapSize.height = 1024; // default
    this.scene.add(sunLight);

    // hook GSAP ticker instead of setAnimationLoop
    gsap.ticker.add((_time, deltatime) => this.animate(deltatime));
    window.addEventListener('resize', this.resize.bind(this));

    this.init(canvas);

    // canvas.addEventListener('click', (e) => this.handleClick(e));
    // canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
  }

  // private handleMouseMove(e: MouseEvent) {
  //   this.rayCastManager.hover(e);
  // }

  // private handleClick(e: MouseEvent) {
  //   this.rayCastManager.click(e);
  // }

  public static getInstance(canvas: HTMLDivElement): SceneManager {
    if (!SceneManager.instance) {
      SceneManager.instance = new SceneManager(canvas);
    }
    return SceneManager.instance;
  }

  private resize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    const camera = this.camera.getCamera();
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }

  private init(canvas: HTMLDivElement) {
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 1);
    canvas.appendChild(this.renderer.domElement);
  }

  private animate(deltatime: number) {
    const deltaTime = deltatime * 2.0;
    // put per-frame logic here (object updates, controls, etc.)
    this.camera.animate();
    this.renderer.render(this.scene, this.camera.getCamera());
    this.characterManager.update(deltaTime);
    this.turretManager.update(deltaTime);
  }

  public getScene(): THREE.Scene {
    return this.scene;
  }
}
