import * as THREE from 'three';

import type { Character } from './character';

export class HealthBar {
  private scene: THREE.Scene;
  private mesh: THREE.Mesh;
  private character: Character;

  constructor(scene: THREE.Scene, character: Character) {
    this.scene = scene;
    this.character = character;
    const color = character.isAlly ? 0x0000ff : 0xff0000;
    this.mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.2, 0.02),
      new THREE.MeshBasicMaterial({ color: color })
    );
    this.mesh.position.y = 0.5;
    this.mesh.position.z = 0;
    this.mesh.castShadow = false;
    this.scene.add(this.mesh);
    this.mesh.visible = false;
  }

  public updatePosition() {
    this.mesh.position.x = this.character.getPosition().x;
    this.mesh.position.z = this.character.getPosition().z;
  }

  public setHealth(health: number) {
    if (!this.mesh.visible) this.mesh.visible = true;
    this.mesh.scale.x = health / this.character.stats.health;
  }

  public destroy() {
    this.scene.remove(this.mesh);
  }
}
