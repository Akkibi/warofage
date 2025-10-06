import * as THREE from 'three';

import type { Character } from './character';

const HEALTH_BAR_SIZE = 0.2;

export class HealthBar {
  private scene: THREE.Scene;
  private group: THREE.Group;
  private loadBar: THREE.Mesh;
  private loadGroup: THREE.Group;
  private mesh: THREE.Mesh;
  private backMesh: THREE.Mesh;
  private character: Character;

  constructor(scene: THREE.Scene, character: Character) {
    this.scene = scene;
    this.character = character;
    this.group = new THREE.Group();
    this.group.position.set(-HEALTH_BAR_SIZE / 2, 0.3, 0);
    this.loadGroup = new THREE.Group();
    this.loadGroup.position.set(-HEALTH_BAR_SIZE / 2, 0.285, 0);

    // healthBar mesh
    const color = new THREE.Color(character.isAlly ? 0x00b8db : 0xf6339a);
    this.mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(HEALTH_BAR_SIZE, 0.02),
      new THREE.MeshBasicMaterial({ color: color })
    );
    this.mesh.position.set(HEALTH_BAR_SIZE / 2, 0, 0);
    this.mesh.castShadow = false;
    this.group.add(this.mesh);
    this.scene.add(this.group);
    this.mesh.visible = false;

    // background mesh
    this.backMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(HEALTH_BAR_SIZE, 0.02),
      new THREE.MeshBasicMaterial({ color: 0x000000 })
    );
    (this.backMesh.material as THREE.MeshBasicMaterial).transparent = true;
    (this.backMesh.material as THREE.MeshBasicMaterial).opacity = 0.5;
    this.backMesh.position.y = 0.3;
    this.backMesh.position.z = 0.1;
    this.backMesh.castShadow = false;
    this.scene.add(this.backMesh);
    this.backMesh.visible = false;

    // load bar
    this.loadBar = new THREE.Mesh(
      new THREE.PlaneGeometry(HEALTH_BAR_SIZE, 0.005),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    this.loadBar.castShadow = false;
    this.loadBar.position.set(HEALTH_BAR_SIZE / 2, 0, 0);

    this.loadGroup.add(this.loadBar);
    this.scene.add(this.loadGroup);

    (this.loadBar.material as THREE.MeshBasicMaterial).transparent = true;
    (this.loadBar.material as THREE.MeshBasicMaterial).opacity = 0.25;
    this.loadBar.visible = false;
  }

  public updateLoad(load: number) {
    if (!this.loadBar.visible) this.loadBar.visible = true;
    this.loadGroup.scale.x = Math.min(load, 1);
  }

  public updatePosition(position: THREE.Vector3) {
    this.group.position.x = position.x - HEALTH_BAR_SIZE / 2;
    this.group.position.z = position.z;
    this.loadGroup.position.x = position.x - HEALTH_BAR_SIZE / 2;
    this.loadGroup.position.z = position.z;
    this.backMesh.position.x = position.x;
    this.backMesh.position.z = position.z - 0.002;
  }

  public setHealth(health: number) {
    if (!this.mesh.visible) {
      this.mesh.visible = true;
      this.backMesh.visible = true;
    }
    this.group.scale.x = health / this.character.stats.health;
  }

  public destroy() {
    this.group.remove(this.mesh);
    this.scene.remove(this.group);
    this.loadGroup.remove(this.loadBar);
    this.scene.remove(this.loadGroup);
    this.scene.remove(this.backMesh);
  }
}
