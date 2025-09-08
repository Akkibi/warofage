import * as THREE from 'three';
import { lerp } from 'three/src/math/MathUtils.js';
import { gsap } from 'gsap';

import { HealthBar } from './healthBar';
import { eventEmitter } from '../utils/eventEmitter';
import { charactersStats } from '../staticData';

import type { CharacterStatsType, CharacterType, Era } from '../types';

const bounds = { minx: -5.5, maxx: 4.9, miny: -0.5, maxy: 0.5 };
const boundsEnemy = { minx: -4.9, maxx: 5.5, miny: -0.5, maxy: 0.5 };

export class Character {
  private scene: THREE.Scene;
  private characterObject: THREE.Group;
  private mesh: THREE.Mesh;
  private type: string;
  private era: Era;
  private speed: { x: number; y: number };
  public isAlive: boolean;
  public isAlly: boolean;
  public id: number;
  public isFighting: boolean;
  private enemyBasePosition: THREE.Vector3;
  public enemyTarget: Character | null;
  public health: number;
  private healthBar: HealthBar | null;
  private characterList: Character[];
  private cumulativeTime: number;
  public stats: CharacterStatsType;
  private sizeIndicator: THREE.PolarGridHelper;
  private attackSizeIndicator: THREE.PolarGridHelper;
  private targetPosition: THREE.Vector3;

  constructor(
    count: number,
    scene: THREE.Scene,
    type: CharacterType,
    era: Era,
    isAlly: boolean,
    characterList: Character[]
  ) {
    this.stats = charactersStats[type];
    this.health = this.stats.health;
    this.characterList = characterList;
    this.id = count;
    this.era = era;
    this.scene = scene;
    this.type = type;
    this.isAlly = isAlly;
    this.enemyBasePosition = new THREE.Vector3(isAlly ? 6 : -6, 0, 0);
    this.speed = { x: 0, y: 0 };
    this.isAlive = true;
    this.isFighting = false;
    this.enemyTarget = null;
    this.cumulativeTime = 0;

    const color = isAlly ? 0x0000ff : 0xff0000;
    const size = this.stats.size / 2;
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(size, size * 3, size),
      new THREE.MeshStandardMaterial({ color: color })
    );
    this.mesh.position.y = size * 1.5;
    this.mesh.position.z = 0;
    this.mesh.castShadow = true;
    this.characterObject = new THREE.Group();
    this.characterObject.add(this.mesh);
    this.scene.add(this.characterObject);
    const smallRandom = (Math.random() - 0.5) * 0.2;
    const posx = isAlly ? -5 + smallRandom : 5 + smallRandom;
    const posz = Math.random() - 0.5;
    this.characterObject.position.set(posx, 0, posz);
    this.targetPosition = new THREE.Vector3(posx, 0, posz);

    // blue polar grid helper
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
    // add polar grid helper
    this.attackSizeIndicator = new THREE.PolarGridHelper(
      this.stats.attackRange,
      1,
      1,
      16,
      0xff0000,
      0xff0000
    );
    this.attackSizeIndicator.position.y = 0.01;
    this.attackSizeIndicator.position.z = 0;
    this.characterObject.add(this.attackSizeIndicator);

    this.healthBar = new HealthBar(this.scene, this);
  }

  private updatePosition() {
    if (!this.isAlive) return;

    const targetPosition = this.enemyTarget
      ? this.enemyTarget.getPosition()
      : this.enemyBasePosition;
    this.characterObject.lookAt(targetPosition);

    this.targetPosition.x += this.speed.x;
    this.targetPosition.z += this.speed.y;
    this.keepInBounds();
    this.characterObject.position.copy(this.targetPosition);
    if (this.healthBar) {
      this.healthBar.updatePosition();
    }
  }

  private updateFight(deltaTime: number) {
    if (this.isFighting && this.enemyTarget) {
      const distance = this.enemyTarget
        .getPosition()
        .distanceTo(this.targetPosition);
      if (distance < this.stats.attackRange + this.enemyTarget.stats.size) {
        this.handleFight(deltaTime);
        console.log('fight');
      } else {
        this.enemyTarget = null;
      }
    } else {
      this.speed.x = lerp(
        this.speed.x,
        this.stats.speed * 0.0001 * (this.isAlly ? 1 : -1),
        0.1
      );
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

  public getPosition(): THREE.Vector3 {
    return this.targetPosition;
  }

  public setTarget(enemyTarget: Character) {
    this.isFighting = true;
    this.enemyTarget = enemyTarget;
  }

  private keepInBounds() {
    const adaptedBounds = this.isAlly ? bounds : boundsEnemy;
    if (this.targetPosition.x > adaptedBounds.maxx) {
      this.targetPosition.x = adaptedBounds.maxx;
      this.speed.x = 0;
      if (this.isAlly && !this.isFighting) {
        this.isFighting = true;
      }
    }
    if (this.targetPosition.x < adaptedBounds.minx) {
      this.targetPosition.x = adaptedBounds.minx;
      this.speed.x = 0;
      if (!this.isAlly && !this.isFighting) {
        this.isFighting = true;
      }
    }
    if (this.targetPosition.z > adaptedBounds.maxy) {
      this.targetPosition.z = adaptedBounds.maxy;
      this.speed.y = 0;
    }
    if (this.targetPosition.z < adaptedBounds.miny) {
      this.targetPosition.z = adaptedBounds.miny;
      this.speed.y = 0;
    }
  }

  public destroy() {
    this.scene.remove(this.characterObject);
    this.characterList.splice(this.characterList.indexOf(this), 1);
  }

  private handleFight(deltatime: number) {
    this.cumulativeTime += deltatime;
    if (this.cumulativeTime > 3000 / this.stats.attackSpeed) {
      this.hit(this.stats.attack);
      this.cumulativeTime = 0;
    }
  }

  private hit(damage: number) {
    if (this.enemyTarget !== null) {
      // console.log('hit', this.enemyTarget.id, this.enemyTarget.isAlive);
      if (this.enemyTarget.isAlive) {
        this.enemyTarget.takeDamage(damage);
      } else {
        this.enemyTarget = null;
        this.isFighting = false;
        console.log('remove enemy target');
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
    if (this.health <= 0) {
      this.die();
    }
    if (this.healthBar) {
      this.healthBar.setHealth(this.health);
    }
  }

  private die() {
    this.isAlive = false;
    this.isFighting = false;
    this.enemyTarget = null;
    eventEmitter.trigger('character-dies', [
      this.isAlly,
      this.id,
      this.era,
      this.type,
      this.targetPosition,
    ]);
    if (this.healthBar) {
      this.healthBar.destroy();
      this.healthBar = null;
    }
    // this.targetPosition.y = -0.1;
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
        this.mesh.position,
        {
          y: 0,
          x: 0.1,
          duration: 0.5,
          ease: 'power2.in',
        },
        '0'
      )
      .to(
        this.mesh.rotation,
        { x: -Math.PI / 2, y: 0, z: 0, duration: 0.5, ease: 'power2.in' },
        '<'
      );
    die.play();
  }

  private handleColision = (
    character: Character,
    other: Character,
    distance: number
  ) => {
    if (
      character.isAlly !== other.isAlly &&
      character.stats.attackRange + other.stats.size > distance &&
      this.isFighting === false
    ) {
      character.setTarget(other);
      character.isFighting = true;
      character.cumulativeTime = 0;
      console.log('start fight');
    }
    if (character.stats.size + other.stats.size > distance) {
      const positionDifference =
        character.getPosition().x - other.getPosition().x;
      const differenceIsAlly = character.isAlly
        ? positionDifference < 0
        : positionDifference > 0;
      if (differenceIsAlly) {
        if (Math.abs(this.speed.x) > 0 || Math.abs(this.speed.y) > 0) {
          this.speed.y = lerp(this.speed.y, 0, 0.25);
          this.speed.x = lerp(this.speed.x, 0, 0.25);
        }
        return true;
      } else {
        return false;
      }
    }
    return false;
  };

  public update = (deltaTime: number) => {
    let isColision = false;
    this.characterList.forEach((otherCharacter) => {
      if (
        otherCharacter.id !== this.id &&
        otherCharacter.isAlive &&
        this.isAlive
      ) {
        const distance = this.getPosition().distanceTo(
          otherCharacter.getPosition()
        );
        const maxDistanceInteraction =
          Math.max(this.stats.size, this.stats.attackRange) +
          Math.max(otherCharacter.stats.size, otherCharacter.stats.attackRange);

        if (Math.abs(distance) < maxDistanceInteraction) {
          const isCollitionWithThisEnemy = this.handleColision(
            this,
            otherCharacter,
            distance
          );
          isColision = isColision || isCollitionWithThisEnemy;
        }
      }
    });
    if (!isColision) {
      this.updatePosition();
    }
    this.updateFight(deltaTime);
  };
}
