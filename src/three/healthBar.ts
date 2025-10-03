import * as THREE from 'three';

import type { Character } from './character';

export class HealthBar {
  private scene: THREE.Scene;
  private loadBar: THREE.Mesh;
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
    this.mesh.position.y = 0.3;
    this.mesh.position.z = 0;
    this.mesh.castShadow = false;
    this.scene.add(this.mesh);
    this.mesh.visible = false;

    this.loadBar = new THREE.Mesh(
      new THREE.PlaneGeometry(0.2, 0.005),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    this.loadBar.position.y = 0.285;
    this.loadBar.position.z = 0;
    this.loadBar.castShadow = false;
    this.scene.add(this.loadBar);

    (this.loadBar.material as THREE.MeshBasicMaterial).transparent = true;
    (this.loadBar.material as THREE.MeshBasicMaterial).opacity = 0.25;
    this.loadBar.visible = false;
  }

  public updateLoad(load: number) {
    if (!this.loadBar.visible) this.loadBar.visible = true;
    this.loadBar.scale.x = 1 - load;
  }

  public updatePosition(position: THREE.Vector3) {
    this.mesh.position.x = position.x;
    this.mesh.position.z = position.z;
    this.loadBar.position.x = position.x;
    this.loadBar.position.z = position.z;
  }

  public setHealth(health: number) {
    if (!this.mesh.visible) this.mesh.visible = true;
    this.mesh.scale.x = health / this.character.stats.health;
  }

  public destroy() {
    this.scene.remove(this.mesh);
    this.scene.remove(this.loadBar);
  }
}
