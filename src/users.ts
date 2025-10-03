import { eventEmitter } from './utils/eventEmitter';
import { useStore } from './store';

import type { CharacterStatsType } from './types';

export class User {
  public money: number;
  public xp: number;
  public health: number;
  public era: number;
  private baseDefense: number;
  protected isAlly: boolean;

  constructor() {
    this.isAlly = true;
    this.money = 1000;
    this.xp = 99000;
    this.health = 1000;
    this.era = 0;
    this.baseDefense = 100;

    eventEmitter.on('character-dies', this.characterDieHandler.bind(this));
    eventEmitter.on('hit-base', this.handleHitBase.bind(this));
    eventEmitter.on('spend-money', this.setMoney.bind(this));
  }

  protected evolve = () => {
    if (this.isAlly) {
      useStore.setState({ playerEra: this.era + 1 });
    } else {
      useStore.setState({ enemyEra: this.era + 1 });
    }
    this.era++;
    this.baseDefense = 100 + this.era * 10;
  };

  private handleHitBase = (isAlly: boolean, damage: number) => {
    if (isAlly !== this.isAlly) return;
    if (this.health <= 0) return;
    this.setHealth(
      this.health -
        Math.max(1, Math.floor((damage * 100) / (100 + this.baseDefense)))
    );
  };

  private characterDieHandler = (
    isAlly: boolean,
    stats: CharacterStatsType
  ) => {
    if (isAlly === this.isAlly) return;
    // console.log('character die', stats, isAlly ? 'ally' : 'enemy');
    this.setMoney(
      this.isAlly,
      Math.round((stats.money / stats.quantity) * 1.1 + this.money)
    );
    this.setXp(this.xp + stats.xp);
  };

  protected setXp = (newNumber: number) => {
    this.xp = newNumber;
    if (this.isAlly) {
      useStore.setState({ playerXp: this.xp });
    } else {
      useStore.setState({ enemyXp: this.xp });
    }
  };

  protected setMoney = (isAlly: boolean, newNumber: number) => {
    if (isAlly !== this.isAlly) return;
    this.money = newNumber;
    if (this.isAlly) {
      useStore.setState({ playerMoney: this.money });
    } else {
      useStore.setState({ enemyMoney: this.money });
    }
  };

  protected setHealth = (newNumber: number) => {
    this.health = newNumber;
    if (this.isAlly) {
      useStore.setState({ playerHealth: this.health });
    } else {
      useStore.setState({ enemyHealth: this.health });
    }
  };
}
