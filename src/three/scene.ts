import * as THREE from 'three';
import { gsap } from 'gsap';

import { Camera } from './camera';
import { Environement } from './environement';
import { Base } from './base';
import { CharacterManager } from './characterManager';
import { TurretManager } from './turretManager';

export class SceneManager {
  private static instance: SceneManager;
  private scene: THREE.Scene;
  private camera: Camera;
  private renderer: THREE.WebGLRenderer;
  private environment: Environement;
  private characterManager: CharacterManager;
  private turretManager: TurretManager;
  private bases: Base[] = [];

  private constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x80abd2);
    this.camera = Camera.getInstance();
    this.environment = Environement.getInstance();
    this.characterManager = CharacterManager.getInstance(this.scene);
    this.turretManager = TurretManager.getInstance(
      this.scene,
      this.characterManager.characterList
    );

    const ally = new Base(this.scene, true);
    const enemy = new Base(this.scene, false);
    this.bases.push(ally, enemy);

    this.environment.init(this.scene);
    this.scene.add(this.camera.getCameraGroup());

    // center of the map marker
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.11, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x999900 })
    );
    cube.position.y = 0;
    cube.position.z = 0;
    cube.castShadow = true;
    this.scene.add(cube);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.shadowMap.enabled = true;
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // ambian light
    const ambientLight = new THREE.AmbientLight(0x404040);
    this.scene.add(ambientLight);
    // sun light

    const sunLight = new THREE.DirectionalLight(0xffffff, 1);
    sunLight.position.set(1, 1, -1);
    sunLight.lookAt(new THREE.Vector3(0, 0, 0));
    sunLight.castShadow = true;
    sunLight.shadow.camera.near = -2; // default
    sunLight.shadow.camera.far = 100; // default
    sunLight.shadow.mapSize.width = 1024; // default
    sunLight.shadow.mapSize.height = 1024; // default
    this.scene.add(sunLight);

    // hook GSAP ticker instead of setAnimationLoop
    gsap.ticker.add((deltatime) => this.animate(deltatime));
    window.addEventListener('resize', this.resize.bind(this));
  }

  public static getInstance(): SceneManager {
    if (!SceneManager.instance) {
      SceneManager.instance = new SceneManager();
    }
    return SceneManager.instance;
  }

  private resize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    const camera = this.camera.getCamera();
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }

  public init(canvas: HTMLDivElement) {
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 1);
    canvas.appendChild(this.renderer.domElement);
  }

  private animate(deltatime: number) {
    // put per-frame logic here (object updates, controls, etc.)
    this.camera.animate();
    this.renderer.render(this.scene, this.camera.getCamera());
    this.characterManager.update(deltatime);
    this.turretManager.update(deltatime);
  }

  public getScene(): THREE.Scene {
    return this.scene;
  }
}
