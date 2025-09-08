import * as THREE from 'three';

import { Turret } from './turret';
import { turretSpotsPositions } from '../staticData';
import { eventEmitter } from '../utils/eventEmitter';

import type { TurretType } from '../types';
import type { Character } from './character';

export class TurretManager {
  private static instance: TurretManager;
  private scene: THREE.Scene;
  private turretList: Turret[] = [];
  private turretSpotsList: THREE.PolarGridHelper[] = [];
  private characterList: Character[];

  private constructor(scene: THREE.Scene, characterList: Character[]) {
    this.scene = scene;
    this.characterList = characterList;

    this.initSpots();
    eventEmitter.on('create-turret', this.createTurret.bind(this));
  }

  private createTurret(type: TurretType, isAlly: boolean) {
    if (this.turretSpotsList.length <= 0) return;
    const goodSpot = this.turretSpotsList.find(
      (spot) => spot.userData.isTaken === false
    );
    console.log('goodSpot', goodSpot);
    if (!goodSpot) return;
    this.addTurret(type, goodSpot, isAlly);
  }

  public static getInstance(scene: THREE.Scene, characterList: Character[]) {
    if (!TurretManager.instance) {
      TurretManager.instance = new TurretManager(scene, characterList);
    }
    return TurretManager.instance;
  }

  private initSpots() {
    turretSpotsPositions.ally.forEach((coords) =>
      this.createSpot(coords, true)
    );
    turretSpotsPositions.enemy.forEach((coords) =>
      this.createSpot(coords, false)
    );
  }

  private createSpot({ x, z }: { x: number; z: number }, isAlly: boolean) {
    const spotIndicator = new THREE.PolarGridHelper(
      0.1,
      1,
      1,
      16,
      0xff0000,
      0xff0000
    );
    spotIndicator.position.x = x;
    spotIndicator.position.z = z;
    spotIndicator.userData.isAlly = isAlly;
    spotIndicator.userData.isTaken = false;
    this.scene.add(spotIndicator);
    this.turretSpotsList.push(spotIndicator);
  }

  public addTurret(
    name: TurretType,
    position: THREE.PolarGridHelper,
    isAlly: boolean
  ) {
    this.turretList.push(
      new Turret(name, position, this.characterList, isAlly, this.scene)
    );
  }

  public update(deltaTime: number) {
    this.turretList.forEach((turret) => {
      turret.update(deltaTime);
    });
  }
}
