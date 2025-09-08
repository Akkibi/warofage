import type { CharacterListStatsType, TurretListStatsType } from './types';

export const turretSpotsPositions = {
  ally: [
    { x: -5, z: -1 },
    { x: -5, z: 1 },
    { x: -4.5, z: -1.3 },
    { x: -4.5, z: 1.3 },
  ],
  enemy: [
    { x: 5, z: -1 },
    { x: 5, z: 1 },
    { x: 4.5, z: -1.3 },
    { x: 4.5, z: 1.3 },
  ],
};

export const turretStats: TurretListStatsType = {
  Simple: { price: 500, attack: 10, range: 1, speed: 1 },
  Double: { price: 1000, attack: 20, range: 1, speed: 2 },
  Explosive: { price: 1500, attack: 100, range: 1.5, speed: 0.5 },
};

export const charactersStats: CharacterListStatsType = {
  Tank: {
    size: 0.14,
    health: 300,
    attack: 25,
    attackSpeed: 0.8, // slow
    attackRange: 0.3,
    defense: 60,
    speed: 20,
    xp: 100,
    money: 200,
  },
  Assassin: {
    size: 0.04,
    health: 80,
    attack: 40,
    attackSpeed: 3.0, // very fast
    attackRange: 0.16,
    defense: 10,
    speed: 90,
    xp: 120,
    money: 150,
  },
  Archer: {
    size: 0.05,
    health: 120,
    attack: 10,
    attackSpeed: 0.6, // slow arrow
    attackRange: 1,
    defense: 20,
    speed: 60,
    xp: 90,
    money: 100,
  },
  Mage: {
    size: 0.05,
    health: 100,
    attack: 60,
    attackSpeed: 1.5, // medium-fast burst
    attackRange: 0.4,
    defense: 15,
    speed: 50,
    xp: 140,
    money: 180,
  },
  Bruiser: {
    size: 0.1,
    health: 200,
    attack: 45,
    attackSpeed: 1.5, // balanced
    attackRange: 0.25,
    defense: 40,
    speed: 40,
    xp: 110,
    money: 130,
  },
  Scout: {
    size: 0.05,
    health: 70,
    attack: 20,
    attackSpeed: 3.5, // extremely fast
    attackRange: 0.11,
    defense: 10,
    speed: 100,
    xp: 70,
    money: 90,
  },
  Guardian: {
    size: 0.15,
    health: 500,
    attack: 35,
    attackSpeed: 0.6, // very slow
    attackRange: 0.31,
    defense: 80,
    speed: 15,
    xp: 150,
    money: 250,
  },
};
