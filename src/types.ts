export type Era =
  | 'Stone Age'
  | 'Iron Age'
  | 'Medieval Era'
  | 'Modern Era'
  | 'Post Modern Era';

export interface GlobalsType {
  player: BaseValuesType;
  enemy: BaseValuesType;
}

interface BaseValuesType {
  xp: number;
  money: number;
  eraIndex: number;
  era: Era;
}

export interface CharacterStatsType {
  size: number;
  health: number;
  attack: number;
  attackRange: number;
  attackSpeed: number;
  defense: number;
  speed: number;
  xp: number;
  money: number;
}

export type CharacterType =
  | 'Tank'
  | 'Assassin'
  | 'Archer'
  | 'Mage'
  | 'Bruiser'
  | 'Scout'
  | 'Guardian';

export type CharacterListStatsType = {
  [key in CharacterType]: CharacterStatsType;
};

export type TurretType = 'Simple' | 'Double' | 'Explosive';

export interface TurretStatsType {
  price: number;
  attack: number;
  range: number;
  speed: number;
}

export type TurretListStatsType = {
  [key in TurretType]: TurretStatsType;
};
