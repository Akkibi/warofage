import * as THREE from 'three';

import { Character } from './character';
import { eventEmitter } from '../utils/eventEmitter';
import { Enemy } from '../enemy';
import { Player } from '../player';

import type { CharacterType, Era } from '../types';

export class CharacterManager {
  private static instance: CharacterManager;
  private scene: THREE.Scene;
  private group: THREE.Group;
  public allyCharacterList: Character[] = [];
  public enemyCharacterList: Character[] = [];
  private count: number = 0;
  private allyCumulativeTime: number = 0;
  private enemyCumulativeTime: number = 100;
  private enemy: Enemy;
  private player: Player;

  private constructor(scene: THREE.Scene) {
    this.enemy = Enemy.getInstance(this.enemyCharacterList);
    this.player = Player.getInstance();
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);
    eventEmitter.on(
      'create-character',
      (type: CharacterType, isAlly: boolean) => this.addCharacter(type, isAlly)
    );

    for (let i = 0; i < 10; i++) {
      this.addCharacter('Assassin', true);
    }
  }

  public static getInstance(scene: THREE.Scene) {
    if (!CharacterManager.instance) {
      CharacterManager.instance = new CharacterManager(scene);
    }
    return CharacterManager.instance;
  }

  public addCharacter(type: CharacterType, isAlly: boolean) {
    const era: Era = 'Iron Age';
    const character = new Character(
      this.count,
      this.scene,
      type,
      era,
      isAlly,
      this.allyCharacterList,
      this.enemyCharacterList
    );
    if (isAlly) {
      this.allyCharacterList.push(character);
    } else {
      this.enemyCharacterList.push(character);
    }
    this.count++;
  }

  public update(deltatime: number) {
    this.allyCumulativeTime += deltatime;
    this.enemyCumulativeTime += deltatime;
    if (this.allyCumulativeTime > 200) {
      // console.log('ally', deltatime, this.allyCumulativeTime);
      this.allyCharacterList.forEach((character) => {
        character.update(this.allyCumulativeTime);
      });
      this.allyCumulativeTime = 0;
    }
    if (this.enemyCumulativeTime > 200) {
      this.enemy.tick(this.enemyCumulativeTime);
      this.enemyCharacterList.forEach((character) => {
        character.update(this.enemyCumulativeTime);
      });
      this.enemyCumulativeTime = 0;
    }
    this.allyCharacterList.forEach((character) => {
      character.step(deltatime);
    });
    this.enemyCharacterList.forEach((character) => {
      character.step(deltatime);
    });
  }
}
