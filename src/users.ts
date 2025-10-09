import { eventEmitter } from './utils/eventEmitter';
import { useStore } from './store';

import type { CharacterStatsType } from './types';

export class User {
  private baseDefense: number;
  protected isAlly: boolean;

  constructor() {
    this.isAlly = true;
    this.baseDefense = 100;

    eventEmitter.on('character-dies', this.characterDieHandler.bind(this));
    eventEmitter.on('hit-base', this.handleHitBase.bind(this));
    eventEmitter.on('spend-money', this.setMoney.bind(this));
  }

  private handleHitBase = (isAlly: boolean, damage: number) => {
    if (isAlly !== this.isAlly) return;
    const era = useStore.getState().playerEra;
    this.updateHealth(
      -Math.max(
        1,
        Math.floor((damage * 100) / (100 + this.baseDefense * (era * 0.1 + 1)))
      )
    );
  };

  private characterDieHandler = (
    isAlly: boolean,
    stats: CharacterStatsType
  ) => {
    if (isAlly === this.isAlly) return;
    // console.log('character die', stats, isAlly ? 'ally' : 'enemy');
    this.addMoney(!isAlly, Math.round((stats.money / stats.quantity) * 1.1));
    this.setXp(
      Math.round(stats.xp / stats.quantity + useStore.getState().playerXp)
    );
  };

  protected setXp = (newNumber: number) => {
    if (this.isAlly) {
      useStore.setState({ playerXp: newNumber });
    } else {
      useStore.setState({ enemyXp: newNumber });
    }
  };

  protected setMoney = (isAlly: boolean, newNumber: number) => {
    if (isAlly !== this.isAlly) return;
    if (this.isAlly) {
      useStore.setState({ playerMoney: newNumber });
    } else {
      useStore.setState({ enemyMoney: newNumber });
    }
  };

  protected addMoney = (isAlly: boolean, newNumber: number) => {
    if (isAlly !== this.isAlly) return;
    if (this.isAlly) {
      useStore.setState({
        playerMoney: useStore.getState().playerMoney + newNumber,
      });
    } else {
      useStore.setState({
        enemyMoney: useStore.getState().enemyMoney + newNumber,
      });
    }
  };

  protected setHealth = (newNumber: number) => {
    if (this.isAlly) {
      if (useStore.getState().playerHealth <= 0) return;
      useStore.setState({ playerHealth: newNumber });
    } else {
      if (useStore.getState().enemyHealth <= 0) return;
      useStore.setState({ enemyHealth: newNumber });
    }
  };

  protected updateHealth(delta: number) {
    if (this.isAlly) {
      useStore.setState({
        playerHealth: useStore.getState().playerHealth + delta,
      });
    } else {
      useStore.setState({
        enemyHealth: useStore.getState().enemyHealth + delta,
      });
    }
  }
}
