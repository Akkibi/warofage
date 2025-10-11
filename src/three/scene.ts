import * as THREE from 'three';
import { gsap } from 'gsap';
import Stats from 'stats.js';

import { Camera } from './camera';
import { Base } from './base';
import { CharacterManager } from './characterManager';
import { TurretManager } from './turretManager';
import { useStore } from '../store';
import { PointerHandler } from '../utils/touchHandler';
import { GltfMeshLoader } from '../utils/meshLoader';
// import { RaycastManager } from './raycastManager';

export class SceneManager {
  private static instance: SceneManager;
  private stats: Stats;
  private canvas: HTMLDivElement | null;
  private scene: THREE.Scene;
  private camera: Camera;
  private renderer: THREE.WebGLRenderer;
  private characterManager: CharacterManager;
  private turretManager: TurretManager;
  private bases: Base[] = [];
  private pointerHandler: PointerHandler;
  // private rayCastManager: RaycastManager;

  private constructor(canvas: HTMLDivElement) {
    //stats
    this.stats = new Stats();
    this.stats.showPanel(0);
    const statsDom = document.getElementById('stats-position');
    requestAnimationFrame(() => {
      this.stats.dom.style.position = 'relative';
      statsDom?.appendChild(this.stats.dom);
    });

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x80abd2);
    this.camera = Camera.getInstance();
    // this.rayCastManager = RaycastManager.getInstance(
    //   this.scene,
    //   this.camera.getCamera()
    // );

    // pointer
    this.pointerHandler = new PointerHandler(canvas, {
      swipeThreshold: 50,
      tapMaxDuration: 300,
      tapMaxMovement: 10,
    });
    console.log('pointerHandler', this.pointerHandler);
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

    const gltfMeshLoader = GltfMeshLoader.getInstance();
    gltfMeshLoader
      .loadModel('./models/environement/terrainBase.glb', this.scene)
      .then((mesh) => {
        mesh.scale.multiplyScalar(0.5);
      });
    this.scene.add(this.camera.getCameraGroup());

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.shadowMap.enabled = true;
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // ambian light
    const ambientLight = new THREE.AmbientLight(0x9090c0);
    this.scene.add(ambientLight);
    // sun light

    const sunLight = new THREE.DirectionalLight(0xffffee, 4);
    sunLight.position.set(2, 4, 1);
    sunLight.lookAt(new THREE.Vector3(0, 0, 0));
    sunLight.castShadow = true;
    sunLight.shadow.camera.near = -2; // default
    sunLight.shadow.camera.far = 100; // default
    sunLight.shadow.mapSize.width = 1024; // default
    sunLight.shadow.mapSize.height = 1024; // default
    this.scene.add(sunLight);

    // hook GSAP ticker instead of setAnimationLoop
    gsap.ticker.add((_time, deltatime) => this.animate(deltatime));
    gsap.ticker.add((_time, deltatime) => this.camera.animate(deltatime));
    gsap.ticker.add(() => {
      this.renderer.render(this.scene, this.camera.getCamera());
    });
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
    this.renderer.setPixelRatio(window.devicePixelRatio * 0.25);
    this.renderer.setSize(window.innerWidth, window.innerHeight, false);
    this.renderer.setClearColor(0x000000, 1);
    canvas.appendChild(this.renderer.domElement);
  }

  private animate(deltatime: number) {
    this.stats.begin();
    if (useStore.getState().isGamePaused) return;
    const deltaTime = deltatime * 2.0;
    // put per-frame logic here (object updates, controls, etc.)
    // this.renderer.render(this.scene, this.camera.getCamera());
    this.characterManager.update(deltaTime);
    this.turretManager.update(deltaTime);
    this.stats.end();
  }

  public getScene(): THREE.Scene {
    return this.scene;
  }
}
