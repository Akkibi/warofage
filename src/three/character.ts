import * as THREE from 'three';
import { gsap } from 'gsap';
import { lerp } from 'three/src/math/MathUtils.js';

import { useStore } from '../store';
import { HealthBar } from './healthBar';
import { eventEmitter } from '../utils/eventEmitter';
import { charactersStats } from '../staticData';
import { MeshGenerator } from './generateMesh';

import type { CharacterStatsType, CharacterType, Era } from '../types';

const bounds = { minx: -5.5, maxx: 4.9, miny: -0.5, maxy: 0.5 };
const boundsEnemy = { minx: -4.9, maxx: 5.5, miny: -0.5, maxy: 0.5 };
const speedMultiplier = 0.006;

export class Character {
  private randomFightDelay: number;
  private scene: THREE.Scene;
  private characterObject: THREE.Group;
  private meshGroup: THREE.Group;
  private meshManager: MeshGenerator;
  private type: string;
  private era: Era;
  private speed: { x: number; y: number };
  public isAlive: boolean;
  public isAlly: boolean;
  public id: number;
  private enemyBasePosition: THREE.Vector3;
  public enemyTarget: Character | null;
  public health: number;
  private healthBar: HealthBar | null;
  private allyCharacterList: Character[] = [];
  private enemyCharacterList: Character[] = [];
  private cumulativeTime: number;
  public stats: CharacterStatsType;
  private sizeIndicator: THREE.PolarGridHelper;
  private attackSizeIndicator: THREE.PolarGridHelper;
  private targetPosition: THREE.Vector3;
  private isMoving: boolean;
  private color: THREE.Color;
  private isHover: boolean;

  constructor(
    count: number,
    scene: THREE.Scene,
    type: CharacterType,
    era: Era,
    isAlly: boolean,
    allyCharacterList: Character[],
    enemyCharacterList: Character[]
  ) {
    const stats = charactersStats[type];
    const eraMultiplier = 1 + useStore.getState().playerEra / 10;
    this.stats = {
      size: stats.size,
      health: stats.health * eraMultiplier,
      attack: stats.attack * eraMultiplier,
      attackSpeed: stats.attackSpeed,
      attackRange: stats.attackRange * eraMultiplier,
      defense: stats.defense * eraMultiplier,
      speed: stats.speed + useStore.getState().playerEra * 10,
      xp: stats.xp * eraMultiplier,
      money: stats.money * eraMultiplier,
      isDistance: stats.isDistance,
      quantity: stats.quantity,
    };
    this.health = this.stats.health;
    this.allyCharacterList = isAlly ? allyCharacterList : enemyCharacterList;
    this.enemyCharacterList = isAlly ? enemyCharacterList : allyCharacterList;
    this.id = count;
    this.era = era;
    this.scene = scene;
    this.type = type;
    this.isAlly = isAlly;
    this.enemyBasePosition = new THREE.Vector3(isAlly ? 6 : -6, 0, 0);
    this.speed = { x: 0, y: 0 };
    this.isAlive = true;
    this.isMoving = true;
    this.enemyTarget = null;
    this.cumulativeTime = 0;
    this.randomFightDelay = 0;
    this.isHover = false;

    this.color = new THREE.Color(isAlly ? 0x00b8db : 0xf6339a);
    // slight change in tint depending on era
    if (isAlly) {
      this.color = this.color.lerp(
        new THREE.Color(0x00ff00),
        useStore.getState().playerEra / 10
      );
    } else {
      this.color = this.color.lerp(
        new THREE.Color(0xff0000),
        useStore.getState().enemyEra / 10
      );
    }

    this.meshGroup = new THREE.Group();
    this.meshManager = new MeshGenerator(
      this.meshGroup,
      this.stats.size,
      this.color
    );
    this.meshGroup.name = this.type;

    this.characterObject = new THREE.Group();
    this.characterObject.userData.class = this;
    this.characterObject.userData.canBeClicked = true;
    this.characterObject.add(this.meshGroup);
    this.scene.add(this.characterObject);
    const smallRandom = (Math.random() - 0.5) * 0.2;
    const posx = isAlly ? -5 - smallRandom : 5 + smallRandom;
    const posz = Math.random() - 0.5;
    this.characterObject.position.set(posx, 0, posz);
    this.targetPosition = new THREE.Vector3(posx, 0, posz);

    // size indicator
    this.sizeIndicator = new THREE.PolarGridHelper(
      this.stats.size,
      1,
      1,
      16,
      0x0000ff,
      0x0000ff
    );
    this.sizeIndicator.position.y = 0.01;
    this.sizeIndicator.position.z = 0;
    this.characterObject.add(this.sizeIndicator);
    const sizeMaterial = this.sizeIndicator.material as THREE.MeshBasicMaterial;
    sizeMaterial.transparent = true;
    sizeMaterial.opacity = 0;

    // attack range indicator
    this.attackSizeIndicator = new THREE.PolarGridHelper(
      this.stats.attackRange,
      1,
      1,
      32,
      0xff0000,
      0xff0000
    );
    this.attackSizeIndicator.position.y = 0.01;
    this.attackSizeIndicator.position.z = 0;
    this.characterObject.add(this.attackSizeIndicator);
    const rangeMaterial = this.attackSizeIndicator
      .material as THREE.MeshBasicMaterial;
    rangeMaterial.transparent = true;
    rangeMaterial.opacity = 0;

    // add health bar
    this.healthBar = new HealthBar(this.scene, this);
  }

  public removeHover = () => {
    // console.log('removeActive', this.id);
    (this.sizeIndicator.material as THREE.MeshBasicMaterial).opacity = 0;
    (this.attackSizeIndicator.material as THREE.MeshBasicMaterial).opacity = 0;
  };

  public setHover = () => {
    // console.log('setActive', this.id);
    (this.sizeIndicator.material as THREE.MeshBasicMaterial).opacity = 1;
    (this.attackSizeIndicator.material as THREE.MeshBasicMaterial).opacity = 1;
    console.log(this.isHover);
  };

  private updatePosition() {
    const maxSpeed =
      this.stats.speed * speedMultiplier * (this.isAlly ? 1 : -1);
    this.speed.x = lerp(this.speed.x, maxSpeed, 0.1);
    this.targetPosition.x += this.speed.x;
    this.targetPosition.z += this.speed.y;
  }

  private updateFight(deltaTime: number) {
    if (this.enemyTarget !== null) {
      if (
        this.isEnemyDistanceForFight(this.enemyTarget) &&
        this.enemyTarget.isAlive
      ) {
        this.handleFight(deltaTime);
        // console.log('fight');
      } else {
        this.enemyTarget = null;
      }
    } else {
      this.handleFight(deltaTime);
    }
  }

  public updateSpeed(x: number, y: number) {
    this.speed.x += x;
    this.speed.y += y;
  }

  public setSpeed(x: number, y: number) {
    this.speed.x = x;
    this.speed.y = y;
  }

  public getTargetPosition(): THREE.Vector3 {
    return this.targetPosition;
  }

  public getPosition(): THREE.Vector3 {
    return this.characterObject.position;
  }

  public setTarget(enemyTarget: Character) {
    this.enemyTarget = enemyTarget;
  }

  private checkBounds(): boolean {
    const adaptedBounds = this.isAlly ? bounds : boundsEnemy;
    if (this.targetPosition.x > adaptedBounds.maxx) {
      this.targetPosition.x = adaptedBounds.maxx;
      this.speed.x = 0;
      return this.isAlly ? true : false;
    }
    if (this.targetPosition.x < adaptedBounds.minx) {
      this.targetPosition.x = adaptedBounds.minx;
      this.speed.x = 0;
      return this.isAlly ? false : true;
    }
    if (this.targetPosition.z > adaptedBounds.maxy) {
      this.targetPosition.z = adaptedBounds.maxy;
      this.speed.y = 0;
    }
    if (this.targetPosition.z < adaptedBounds.miny) {
      this.targetPosition.z = adaptedBounds.miny;
      this.speed.y = 0;
    }
    return false;
  }

  public destroy() {
    this.scene.remove(this.characterObject);
    this.allyCharacterList.splice(this.allyCharacterList.indexOf(this), 1);
  }

  private handleFight(deltatime: number) {
    this.cumulativeTime += deltatime;
    if (this.healthBar) {
      this.healthBar.updatePosition(this.characterObject.position);
      this.healthBar.updateLoad(
        this.cumulativeTime /
          (3000 / this.stats.attackSpeed + this.randomFightDelay)
      );
    }
    if (
      this.cumulativeTime >
      3000 / this.stats.attackSpeed + this.randomFightDelay
    ) {
      this.hit(this.stats.attack);
      this.cumulativeTime = 0;
      this.randomFightDelay = Math.random() * 500;
    }
  }

  private hit(damage: number) {
    if (this.enemyTarget !== null) {
      if (this.enemyTarget.isAlive) {
        this.enemyTarget.takeDamage(damage);
      } else {
        this.enemyTarget = null;
        // console.log('remove enemy target');
      }
    } else {
      eventEmitter.trigger('hit-base', [!this.isAlly, damage]);
    }
  }

  public takeDamage(damage: number) {
    this.health -= Math.max(
      1,
      Math.floor((damage * 100) / (100 + this.stats.defense))
    );
    this.animateDamage();
    if (this.health <= 0) {
      this.die();
    }
    if (this.healthBar) {
      this.healthBar.setHealth(this.health);
    }
  }

  private animateDamage() {
    this.meshManager.setColor(new THREE.Color(0xffffff));
    requestAnimationFrame(() => this.meshManager.setColor(this.color));
  }

  private die() {
    this.isAlive = false;
    this.enemyTarget = null;
    eventEmitter.trigger('character-dies', [
      this.isAlly,
      this.stats,
      this.type,
      this.id,
      this.era,
      this.targetPosition,
    ]);
    if (this.healthBar) {
      this.healthBar.destroy();
      this.healthBar = null;
    }
    this.animateDie();
  }

  private animateDie() {
    const die = gsap.timeline({
      onComplete: () => {
        this.destroy();
      },
    });
    // chacacter fall backwards
    die
      .to(
        this.meshGroup.position,
        {
          y: 0,
          x: this.stats.size / 2,
          duration: 0.5,
          ease: 'power2.in',
        },
        '0'
      )
      .to(
        this.meshGroup.rotation,
        { x: -Math.PI / 2, y: 0, z: 0, duration: 0.5, ease: 'power2.in' },
        '<'
      );
    die.play();
  }

  private handleAllyCollision = () => {
    this.allyCharacterList.forEach((otherCharacter) => {
      if (otherCharacter.isAlive === false) return;

      const distanceFromOther = this.getTargetPosition().distanceTo(
        otherCharacter.getTargetPosition()
      );
      if (distanceFromOther < this.stats.size + otherCharacter.stats.size) {
        const distanceFromEnemyBase = this.getTargetPosition().distanceTo(
          this.enemyBasePosition
        );
        const otherDistanceFromEnemyBase = otherCharacter
          .getTargetPosition()
          .distanceTo(this.enemyBasePosition);
        if (distanceFromEnemyBase > otherDistanceFromEnemyBase) {
          this.isMoving = false;
        }
      }
    });
  };

  private isEnemyDistanceForFight = (enemy: Character): boolean => {
    const distanceFromOther = this.getTargetPosition().distanceTo(
      enemy.getTargetPosition()
    );
    if (distanceFromOther < this.stats.attackRange && this.stats.isDistance) {
      return true;
    } else if (distanceFromOther < this.stats.size + enemy.stats.size) {
      return true;
    }
    return false;
  };

  private handleEnemyCollision = () => {
    this.enemyCharacterList.forEach((otherCharacter) => {
      if (otherCharacter.isAlive === false) return;
      if (this.isEnemyDistanceForFight(otherCharacter)) {
        this.isMoving = false;
        this.setTarget(otherCharacter);
      }
    });
  };

  public update = (deltaTime: number) => {
    if (!this.isAlive) return;

    this.isMoving = true;

    // update rotation
    const enemy = this.enemyTarget;
    if (enemy) {
      this.characterObject.lookAt(enemy.getTargetPosition());
    } else {
      this.characterObject.lookAt(this.enemyBasePosition);
    }

    // update if fighting
    if (this.enemyTarget !== null || this.checkBounds()) {
      this.isMoving = false;
      this.updateFight(deltaTime);
      return;
    }

    // update state of fight and movement
    this.handleAllyCollision();
    this.handleEnemyCollision();
    if (this.isMoving) {
      this.updatePosition();
    } else {
      this.setSpeed(0, 0);
    }
  };

  public step = (deltatime: number) => {
    if (!this.isAlive) return;
    this.characterObject.position.lerp(this.targetPosition, deltatime / 1000);
    if (this.healthBar) {
      this.healthBar.updatePosition(this.characterObject.position);
    }
  };
}
