import * as THREE from 'three';
import { gsap } from 'gsap';

import { turretStats } from '../staticData';

import type { TurretStatsType, TurretType } from '../types';
import type { Character } from './character';

interface EnemyTargetFinderType {
  character: Character;
  distance: number;
}

export class Turret {
  private randomFightDelay: number;
  private positionReference: THREE.PolarGridHelper;
  private stats: TurretStatsType;
  private name: TurretType;
  private characterList: Character[];
  private group: THREE.Group;
  private mesh: THREE.Mesh;
  private enemyTarget: Character | null;
  private defaultPosition: THREE.Vector3;
  private currentTargetPosition: THREE.Vector3;
  private isAlly: boolean;
  private cumulativeTime: number;
  private scene: THREE.Scene;
  private rangeIndicator: THREE.PolarGridHelper;
  private closestEnemy: EnemyTargetFinderType | null;
  private cumulativeActionTime: number;

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
    this.cumulativeActionTime = 0;
    this.closestEnemy = null;
    this.randomFightDelay = 0;

    console.log('create turret', this.name, this.isAlly);

    const color =
      name === 'Simple' ? 0xffff00 : name === 'Double' ? 0x0000ff : 0xff0000;
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.1, 0.5),
      new THREE.MeshStandardMaterial({ color: color })
    );
    this.group = new THREE.Group();
    this.group.position.copy(this.positionReference.position);
    this.group.position.y += 0.2;

    this.group.add(this.mesh);
    this.scene.add(this.group);
    const defaultPosition = new THREE.Vector3();
    this.group.getWorldPosition(defaultPosition);
    defaultPosition.add(
      new THREE.Vector3(this.group.position.x * -0.1, 0, -this.group.position.z)
    );
    this.defaultPosition = defaultPosition;
    this.currentTargetPosition = defaultPosition.clone();

    // line helper
    const lineHelper = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, this.stats.range),
      ]),
      new THREE.LineBasicMaterial({ color: 0x00ff00 })
    );
    this.group.add(lineHelper);

    // range indicator
    this.rangeIndicator = new THREE.PolarGridHelper(
      this.stats.range,
      1,
      1,
      64,
      0x00ff00,
      0x00ff00
    );
    this.rangeIndicator.position.copy(this.positionReference.position);
    const rangeMaterial = this.rangeIndicator
      .material as THREE.MeshBasicMaterial;
    rangeMaterial.transparent = true;
    rangeMaterial.opacity = 0.5;
    this.scene.add(this.rangeIndicator);

    // turret holder
    const turretHolder = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.2, 0.4, 8, 1),
      new THREE.MeshStandardMaterial({ color: 0x999900 })
    );
    turretHolder.position.copy(this.positionReference.position);
    turretHolder.castShadow = false;
    this.scene.add(turretHolder);

    this.positionReference.userData.isTaken = true;
  }

  public update(deltaTime: number) {
    this.lookatTransition(deltaTime);
    this.cumulativeActionTime += deltaTime;
    if (this.cumulativeActionTime < 100) return;

    if (this.enemyTarget !== null) {
      const distanceToTarget = this.positionReference.position.distanceTo(
        this.enemyTarget.getPosition()
      );

      if (distanceToTarget < this.stats.range && this.enemyTarget.isAlive) {
        // this.group.lookAt(this.enemyTarget.getPosition());
        this.handleAttack(this.cumulativeActionTime);
      } else {
        this.setEnemyTarget(null);
      }
    } else {
      const newEnemy = this.selectNewTarget();
      this.enemyTarget = newEnemy ? newEnemy.character : null;
    }
    this.cumulativeActionTime = 0;
  }

  private selectNewTarget = (): EnemyTargetFinderType | null => {
    this.closestEnemy = null;
    this.characterList.forEach((character) => {
      if (character.isAlive) {
        const distanceToTarget = this.positionReference.position.distanceTo(
          character.getPosition()
        );
        if (distanceToTarget < this.stats.range) {
          if (
            this.closestEnemy === null ||
            this.closestEnemy.distance > distanceToTarget
          ) {
            this.closestEnemy = { character, distance: distanceToTarget };
          }
        }
      }
    });
    this.cumulativeTime = 0;
    return this.closestEnemy;
  };

  private lookatTransition = (deltaTime: number) => {
    const targetPosition =
      this.enemyTarget !== null
        ? this.enemyTarget.getPosition()
        : this.defaultPosition;
    this.currentTargetPosition.lerp(targetPosition, deltaTime / 100);
    this.group.lookAt(this.currentTargetPosition);
  };

  private handleAttack(deltaTime: number) {
    if (!this.enemyTarget) return;
    if (!this.enemyTarget.isAlive) {
      this.setEnemyTarget(null);
    }
    this.cumulativeTime += deltaTime;
    if (this.cumulativeTime < 3000 / this.stats.speed + this.randomFightDelay)
      return;
    this.cumulativeTime = 0;
    this.randomFightDelay = Math.random() * 500;

    if (this.enemyTarget.isAlive) {
      this.animateShoot();
      this.enemyTarget.takeDamage(this.stats.attack);
      if (!this.enemyTarget.isAlive) {
        const newEnemy = this.selectNewTarget();
        this.enemyTarget = newEnemy ? newEnemy.character : null;
      }
    }
  }

  private animateShoot() {
    gsap.fromTo(
      this.mesh.position,
      { z: -0.1 },
      {
        z: 0,
        duration: 0.5,
        ease: 'expo.out',
        overwrite: true,
      }
    );
  }

  public getPosition() {
    return this.positionReference.position;
  }

  public setEnemyTarget(enemyTarget: Character | null) {
    this.enemyTarget = enemyTarget;
  }

  public destroy() {
    this.scene.remove(this.group);
    this.positionReference.userData.isTaken = false;
  }
}
