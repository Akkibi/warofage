import { User } from './users';
import { eventEmitter } from './utils/eventEmitter';
import { eraStats } from './staticData';

import type { CharacterType } from './types';
import type { Character } from './three/character';

const characterGroups: CharacterType[][] = [
  ['Mage', 'Archer'],
  ['Assassin', 'Mage'],
  ['Assassin', 'Bruiser'],
  ['Bruiser', 'Tank'],
  ['Tank', 'Mage'],
  ['Tank', 'Archer'],
];

export class Enemy extends User {
  private static instance: Enemy;
  private cumulativeTime: number = 0;
  private enemyCharacterList: Character[];

  private constructor(enemyList: Character[]) {
    super();
    this.enemyCharacterList = enemyList;
    this.isAlly = false;
  }

  public tick = (deltatime: number) => {
    this.cumulativeTime += deltatime;
    const varyingPart = Math.max(
      0,
      1 - this.xp / (eraStats[this.era + 1].xp ?? 100000)
    );
    const timeToGenerate =
      5000 + Math.floor(Math.random() * 3000) + 3000 * varyingPart;

    if (this.cumulativeTime < timeToGenerate) return;
    console.log('timeToGenerate', timeToGenerate, 3000 * varyingPart);
    if (this.xp > (eraStats[this.era + 1].xp ?? 100000)) {
      this.evolve();
    }
    const nbCharacter = this.calculateNbOfCharactersAtSpawn();
    if (nbCharacter < 30) {
      this.generateCharacter();
    }
    this.cumulativeTime = 0;
  };

  private calculateNbOfCharactersAtSpawn = () => {
    let total = 0;
    this.enemyCharacterList.forEach((character) => {
      if (character.isAlive && character.getPosition().x > 4) total++;
    });
    console.log('total', total);
    return total;
  };

  private generateCharacter() {
    console.log(this.enemyCharacterList.length);
    if (this.enemyCharacterList.length >= 150) return;
    // select random character group, if xp is > to half the next xp level, generate double the amount
    const characterGroup =
      characterGroups[Math.floor(Math.random() * characterGroups.length)];
    characterGroup.forEach((name) => {
      eventEmitter.trigger('create-character', [name, false]);
    });
  }

  public static getInstance(enemyList: Character[]) {
    if (!Enemy.instance) {
      Enemy.instance = new Enemy(enemyList);
    }
    return Enemy.instance;
  }
}
