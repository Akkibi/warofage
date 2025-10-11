import { User } from './users';
import { eventEmitter } from './utils/eventEmitter';

export class Player extends User {
  private static instance: Player;

  private constructor() {
    super();
    for (let i = 0; i < 10; i++) {
      eventEmitter.trigger('create-character', ['Assassin', true]);
    }
  }

  public static getInstance() {
    if (!Player.instance) {
      Player.instance = new Player();
    }
    return Player.instance;
  }
}
