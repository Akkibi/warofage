import { type Era, type GlobalsType } from './types';

export const eraList: Era[] = [
  'Stone Age',
  'Iron Age',
  'Medieval Era',
  'Modern Era',
  'Post Modern Era',
];

export const globals: GlobalsType = {
  player: {
    xp: 0,
    money: 0,
    eraIndex: 0,
    era: eraList[0],
  },
  enemy: {
    xp: 0,
    money: 0,
    eraIndex: 0,
    era: eraList[0],
  },
};
