import * as THREE from 'three';

import { turretStats } from '../staticData';

import type { TurretStatsType, TurretType } from '../types';
import type { Character } from './character';

export class Turret {
  private positionReference: THREE.PolarGridHelper;
  private stats: TurretStatsType;
  private name: TurretType;
  private characterList: Character[];
  private mesh: THREE.Mesh;
  private enemyTarget: Character | null;
  private isAlly: boolean;
  private cumulativeTime: number;
  private scene: THREE.Scene;

  constructor(
    name: TurretType,
    polarGridHelper: THREE.PolarGridHelper,
    characterList: Character[],
    isAlly: boolean,
    scene: THREE.Scene
  ) {
    this.scene = scene;
    this.positionReference = polarGridHelper;
    this.stats = turretStats[name];
    this.name = name;
    this.characterList = characterList;
    this.isAlly = isAlly;
    this.enemyTarget = null;
    this.cumulativeTime = 0;

    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.1, 0.5),
      new THREE.MeshStandardMaterial({ color: 0xffff00 })
    );
    this.mesh.position.copy(this.positionReference.position);

    this.scene.add(this.mesh);
    this.positionReference.userData.isTaken = true;
  }

  public update(deltaTime: number) {
    if (this.enemyTarget !== null) {
      const distanceToTarget = this.positionReference.position.distanceTo(
        this.enemyTarget.getPosition()
      );

      if (distanceToTarget < this.stats.range && this.enemyTarget.isAlive) {
        this.handleAttack(deltaTime);
        this.mesh.lookAt(this.enemyTarget.getPosition());
      } else {
        this.setEnemyTarget(null);
      }
    } else {
      this.characterList.forEach((character) => {
        if (character.isAlive && character.isAlly !== this.isAlly) {
          const distanceToTarget = this.positionReference.position.distanceTo(
            character.getPosition()
          );
          if (distanceToTarget < this.stats.range) {
            this.setEnemyTarget(character);
            this.cumulativeTime = 0;
          }
        }
      });
    }
  }

  private handleAttack(deltaTime: number) {
    if (!this.enemyTarget) return;
    this.cumulativeTime += deltaTime;
    if (this.cumulativeTime > 3000 / this.stats.speed) {
      if (this.enemyTarget.isAlive) {
        this.enemyTarget.takeDamage(this.stats.attack);
      }
      console.log('turret attack', this.enemyTarget);
      this.cumulativeTime = 0;
    }
    if (!this.enemyTarget.isAlive) {
      this.setEnemyTarget(null);
    }
  }

  public getPosition() {
    return this.positionReference.position;
  }

  public setEnemyTarget(enemyTarget: Character | null) {
    this.enemyTarget = enemyTarget;
  }

  public destroy() {
    this.scene.remove(this.mesh);
    this.positionReference.userData.isTaken = false;
  }
}
