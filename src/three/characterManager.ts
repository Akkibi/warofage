import * as THREE from 'three';

import { Character } from './character';
import { eventEmitter } from '../utils/eventEmitter';
import { globals } from '../globals';

import type { CharacterType } from '../types';

export class CharacterManager {
  private static instance: CharacterManager;
  private scene: THREE.Scene;
  private group: THREE.Group;
  public characterList: Character[] = [];
  private count: number = 0;

  private constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);
    eventEmitter.on(
      'create-character',
      (type: CharacterType, isAlly: boolean) => this.addCharacter(type, isAlly)
    );
  }

  public static getInstance(scene: THREE.Scene) {
    if (!CharacterManager.instance) {
      CharacterManager.instance = new CharacterManager(scene);
    }
    return CharacterManager.instance;
  }

  public addCharacter(type: CharacterType, isAlly: boolean) {
    const era = globals.player.era;
    const character = new Character(
      this.count,
      this.scene,
      type,
      era,
      isAlly,
      this.characterList
    );
    this.characterList.push(character);
    this.count++;
  }

  public update(deltatime: number) {
    this.characterList.forEach((character) => {
      character.update(deltatime);
    });
  }
}
