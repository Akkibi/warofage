import type { CharacterListStatsType, TurretListStatsType } from './types';

export const turretSpotsPositions = {
  ally: [
    { x: -4.8, z: -0.8 },
    { x: -4.8, z: 0.8 },
    { x: -4.3, z: -1.1 },
    { x: -4.3, z: 1.1 },
  ],
  enemy: [
    { x: 4.8, z: -0.8 },
    { x: 4.8, z: 0.8 },
    { x: 4.3, z: -1.1 },
    { x: 4.3, z: 1.1 },
  ],
};

export const eraStats = [
  { name: 'Stone Age', xp: 0 },
  { name: 'Iron Age', xp: 100000 },
  { name: 'Medieval Era', xp: 400000 },
  { name: 'Modern Era', xp: 1600000 },
  { name: 'Post Modern Era', xp: 6400000 },
];

export const turretStats: TurretListStatsType = {
  Simple: { price: 2000, attack: 10, range: 1.1, speed: 2 },
  Double: { price: 4000, attack: 20, range: 1.1, speed: 4 },
  Explosive: { price: 8000, attack: 350, range: 2, speed: 0.5 },
};

export const charactersStats: CharacterListStatsType = {
  Assassin: {
    size: 0.04,
    health: 40, // reduced from 70
    attack: 20, // reduced from 40
    attackSpeed: 5.0,
    attackRange: 0.16,
    defense: 5, // reduced from 10
    speed: 10,
    xp: 80, // reduced from 120
    money: 60, // reduced from 100
    isDistance: false,
    quantity: 5, // spawns in groups of 5
  },
  Archer: {
    size: 0.05,
    health: 90, // reduced from 120
    attack: 12, // reduced from 15
    attackSpeed: 1.6,
    attackRange: 1,
    defense: 15, // reduced from 20
    speed: 6,
    xp: 70, // reduced from 90
    money: 100, // reduced from 150
    isDistance: true,
    quantity: 3, // spawns in groups of 3
  },
  Bruiser: {
    size: 0.1,
    health: 150, // reduced from 200
    attack: 35, // reduced from 45
    attackSpeed: 2.5,
    attackRange: 0.25,
    defense: 30, // reduced from 40
    speed: 4,
    xp: 90, // reduced from 110
    money: 130, // reduced from 180
    isDistance: false,
    quantity: 2, // spawns in pairs
  },
  Mage: {
    size: 0.05,
    health: 100,
    attack: 60,
    attackSpeed: 2.5,
    attackRange: 0.4,
    defense: 15,
    speed: 5,
    xp: 140,
    money: 200,
    isDistance: true,
    quantity: 1, // spawns solo (baseline)
  },
  Tank: {
    size: 0.15,
    health: 500,
    attack: 40,
    attackSpeed: 1.6,
    attackRange: 0.31,
    defense: 60,
    speed: 3,
    xp: 150,
    money: 350,
    isDistance: false,
    quantity: 1, // spawns solo (too powerful for multiples)
  },
};
