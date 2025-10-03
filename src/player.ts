import { User } from './users';

export class Player extends User {
  private static instance: Player;

  private constructor() {
    super();
  }

  public static getInstance() {
    if (!Player.instance) {
      Player.instance = new Player();
    }
    return Player.instance;
  }
}
