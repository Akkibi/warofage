import { create } from 'zustand';

type Store = {
  playerHealth: number;
  playerMoney: number;
  playerXp: number;
  playerEra: number;
  setPlayerHealth: (n: number) => void;
  setPlayerMoney: (n: number) => void;
  setPlayerXp: (n: number) => void;
  setPlayerEra: (n: number) => void;
  enemyHealth: number;
  enemyMoney: number;
  enemyXp: number;
  enemyEra: number;
  setEnemyHealth: (n: number) => void;
  setEnemyMoney: (n: number) => void;
  setEnemyXp: (n: number) => void;
  setEnemyEra: (n: number) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (n: boolean) => void;
  isGamePaused: boolean;
  setIsGamePaused: (n: boolean) => void;
};

export const useStore = create<Store>((set) => ({
  playerHealth: 1000,
  playerMoney: 10000,
  playerXp: 0,
  playerEra: 0,
  setPlayerMoney: (n: number) => set({ playerMoney: n }),
  setPlayerHealth: (n: number) => set({ playerHealth: n }),
  setPlayerXp: (n: number) => set({ playerXp: n }),
  setPlayerEra: (n: number) => set({ playerEra: n }),
  enemyHealth: 1000,
  enemyMoney: 1000,
  enemyXp: 0,
  enemyEra: 0,
  setEnemyHealth: (n: number) => set({ enemyHealth: n }),
  setEnemyMoney: (n: number) => set({ enemyMoney: n }),
  setEnemyXp: (n: number) => set({ enemyXp: n }),
  setEnemyEra: (n: number) => set({ enemyEra: n }),
  isMenuOpen: false,
  setIsMenuOpen: (n: boolean) => set({ isMenuOpen: n }),
  isGamePaused: false,
  setIsGamePaused: (n: boolean) => set({ isGamePaused: n }),
}));
