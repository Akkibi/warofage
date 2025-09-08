import { useEffect, useState } from 'react';

import { eventEmitter } from './utils/eventEmitter';

import type { CharacterType } from './types';

const baseDefense = 1000;

const UiElements = () => {
  const [xp, setXp] = useState(0);
  const [money, setMoney] = useState(0);
  const [health, setHealth] = useState(10000);
  const [enemyHealth, setEnemyHealth] = useState(10000);

  const handleCreateCharacter = (name: CharacterType) => {
    for (let i = 0; i < 2; i++) {
      eventEmitter.trigger('create-character', [name, true]);
    }
    console.log('create character');
  };

  const handleCreateTurret = (isAlly: boolean) => {
    eventEmitter.trigger('create-turret', ['Simple', isAlly]);
  };

  const handleCreateEnemyCharacter = (name: CharacterType) => {
    for (let i = 0; i < 2; i++) {
      eventEmitter.trigger('create-character', [name, false]);
    }
    console.log('create enemy character');
  };

  useEffect(() => {
    const xpHandler = (newNumber: number) => setXp(newNumber);
    const moneyHandler = (newNumber: number) => setMoney(newNumber);
    const healthBaseHandler = (isAlly: boolean, damage: number) => {
      if (isAlly) {
        if (health > 0) {
          setHealth(
            health -
              Math.max(1, Math.floor((damage * 100) / (100 + baseDefense)))
          );
        }
      } else {
        if (enemyHealth > 0) {
          setEnemyHealth(Math.max(enemyHealth - Math.max(damage + 10, 1), 0));
        }
      }
    };
    eventEmitter.on('update-xp', xpHandler);
    eventEmitter.on('update-money', moneyHandler);
    eventEmitter.on('hit-base', healthBaseHandler);
    return () => {
      eventEmitter.off('update-xp', xpHandler);
      eventEmitter.off('update-money', moneyHandler);
      eventEmitter.off('hit-base', healthBaseHandler);
    };
  }, [health, enemyHealth]);

  const handleEvolve = () => {
    eventEmitter.trigger('evolve', [true, 'Iron age']);
  };
  return (
    <>
      <h1 className='text-amber-950 text-2xl font-black absolute bottom-5 right-5'>
        War of Ages
      </h1>
      <div className='absolute top-0 left-0 right-0 flex flex-rox gap-2 p-2 h-10'>
        <div className='bg-amber-950 relative h-full flex-1'>
          <span className='absolute right-2 z-10'>{health}/10000</span>
          <div
            style={{
              transform: `scaleX(${health / 10000})`,
            }}
            className='absolute top-0 left-0 bottom-0 w-full bg-blue-400'
          ></div>
        </div>
        <div className='bg-amber-950 relative h-full flex-1'>
          <span className='absolute right-2 z-10'>{enemyHealth}/10000</span>
          <div
            className='absolute top-0 left-0 bottom-0 w-full bg-red-400 origin-left'
            style={{
              transform: `scaleX(${enemyHealth / 10000})`,
            }}
          ></div>
        </div>
      </div>
      <div className=' absolute bottom-0 left-0 p-5 flex flex-col gap-2'>
        <div className='flex flex-row gap-5 bg-amber-200 max-w-min p-2'>
          <h2 className='text-black w-30'>
            XP: <span>{xp}</span>
          </h2>
          <h2 className='text-black w-30'>
            $: <span>{money}</span>
          </h2>
        </div>
        <div className='bg-amber-200 max-w-min p-2 flex flex-row gap-2'>
          <button
            type='button'
            className='h-10 px-5 bg-amber-950 text-white'
            onClick={() => handleEvolve()}
          >
            Evolve
          </button>
          <button
            type='button'
            className='h-10 px-5 bg-amber-950 text-white min-w-max'
            onClick={() => handleCreateTurret(true)}
          >
            Create turret
          </button>
          <button
            type='button'
            className='h-10 px-5 bg-red-900 text-white min-w-max'
            onClick={() => handleCreateTurret(false)}
          >
            create enemy turret
          </button>
        </div>
        <div className='bg-amber-200 max-w-min p-2 text-black'>
          <p className='text-sm mb-2'>Create Character</p>
          <div className='flex flex-row gap-2'>
            <button
              type='button'
              className='h-10 px-5 bg-amber-950 text-white'
              onClick={() => handleCreateCharacter('Tank')}
            >
              Tank
            </button>
            <button
              type='button'
              className='h-10 px-5 bg-amber-950 text-white'
              onClick={() => handleCreateCharacter('Assassin')}
            >
              Assasin
            </button>
            <button
              type='button'
              className='h-10 px-5 bg-amber-950 text-white'
              onClick={() => handleCreateCharacter('Archer')}
            >
              Archer
            </button>
            <button
              type='button'
              className='h-10 px-5 bg-amber-950 text-white'
              onClick={() => handleCreateCharacter('Mage')}
            >
              Mage
            </button>
            <button
              type='button'
              className='h-10 px-5 bg-amber-950 text-white'
              onClick={() => handleCreateCharacter('Bruiser')}
            >
              Bruiser
            </button>
            <button
              type='button'
              className='h-10 px-5 bg-amber-950 text-white'
              onClick={() => handleCreateCharacter('Scout')}
            >
              Scout
            </button>
            <button
              type='button'
              className='h-10 px-5 bg-amber-950 text-white'
              onClick={() => handleCreateCharacter('Guardian')}
            >
              Guardian
            </button>
          </div>
        </div>
        <div className='bg-amber-200 max-w-min p-2 text-black'>
          <p className='text-sm mb-2'>Create Character</p>
          <div className='flex flex-row gap-2'>
            <button
              type='button'
              className='h-10 px-5 bg-red-900 text-white'
              onClick={() => handleCreateEnemyCharacter('Tank')}
            >
              Tank
            </button>
            <button
              type='button'
              className='h-10 px-5 bg-red-900 text-white'
              onClick={() => handleCreateEnemyCharacter('Assassin')}
            >
              Assasin
            </button>
            <button
              type='button'
              className='h-10 px-5 bg-red-900 text-white'
              onClick={() => handleCreateEnemyCharacter('Archer')}
            >
              Archer
            </button>
            <button
              type='button'
              className='h-10 px-5 bg-red-900 text-white'
              onClick={() => handleCreateEnemyCharacter('Mage')}
            >
              Mage
            </button>
            <button
              type='button'
              className='h-10 px-5 bg-red-900 text-white'
              onClick={() => handleCreateEnemyCharacter('Bruiser')}
            >
              Bruiser
            </button>
            <button
              type='button'
              className='h-10 px-5 bg-red-900 text-white'
              onClick={() => handleCreateEnemyCharacter('Scout')}
            >
              Scout
            </button>
            <button
              type='button'
              className='h-10 px-5 bg-red-900 text-white'
              onClick={() => handleCreateEnemyCharacter('Guardian')}
            >
              Guardian
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UiElements;
