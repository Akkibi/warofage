import { eventEmitter } from './utils/eventEmitter';
import { charactersStats, eraStats, turretStats } from './staticData';
import { UiGroup } from './ui-group';
import { Button } from './button';
import { Tooltip } from './tooltip';
import { useStore } from './store';
import { PauseButton } from './pauseButton';
import { FullscreenButton } from './fullscreenButton';

import type {
  CharacterStatsType,
  CharacterType,
  TurretStatsType,
  TurretType,
} from './types';

// HealthBar.tsx

const UiElements = () => {
  const playerHealth = useStore((s) => s.playerHealth);
  const playerMoney = useStore((s) => s.playerMoney);
  const playerXp = useStore((s) => s.playerXp);
  const enemyHealth = useStore((s) => s.enemyHealth);
  const enemyMoney = useStore((s) => s.enemyMoney);
  const enemyXp = useStore((s) => s.enemyXp);
  const playerEra = useStore((s) => s.playerEra);

  const handleCreateCharacter = (
    name: CharacterType,
    stats: CharacterStatsType
  ) => {
    if (stats.money > playerMoney) return;
    const newMoney = playerMoney - stats.money;
    eventEmitter.trigger('spend-money', [true, newMoney]);
    for (let i = 0; i < stats.quantity; i++) {
      eventEmitter.trigger('create-character', [name, true]);
    }
    console.log('create character');
  };

  const handleCreateTurret = (name: TurretType, stats: TurretStatsType) => {
    if (stats.price > playerMoney) return;
    const newMoney = playerMoney - stats.price;
    eventEmitter.trigger('spend-money', [true, newMoney]);
    eventEmitter.trigger('create-turret', [name, true]);
  };

  const handleEvolve = () => {
    eventEmitter.trigger('evolve', [true, 'Iron age']);
  };
  return (
    <>
      <div className='absolute top-25 left-1 md:left-5 bg-black/50 h-fit p-[2px] w-fit'>
        <UiGroup title='options' className='w-full max-w-full'>
          <div className='flex flex-col gap-1'>
            <FullscreenButton className='w-full' />
            <PauseButton className='w-full' />
          </div>
        </UiGroup>
      </div>
      {playerHealth <= 0 && (
        <div className='absolute inset-0 z-50 bg-black/50 flex justify-center items-center'>
          <div className='w-fit h-fit bg-black/50 p-[2px] text-nowrap'>
            <UiGroup title='End'>
              <div className='p-5 flex flex-col justify-center items-center gap-5'>
                <p className='text-3xl font-bold text-white w-full text-center p-5'>
                  You lost
                </p>
                <p className='text-white'>
                  {"Mabe you didn't try hard enough"}
                </p>
                <Button onClick={() => {}}>Play again</Button>
              </div>
            </UiGroup>
          </div>
        </div>
      )}
      <h1 className='text-white text-2xl font-black absolute bottom-5 right-5'>
        War of Ages
        {enemyXp}
        <br />$ {enemyMoney}
      </h1>
      <div className='absolute top-1 right-1 left-1 md:top-5 md:left-5 md:right-5 flex flex-rox gap-[2px] p-[2px] h-10 bg-black/50'>
        <div className='bg-blue-950/50 border-blue-900/50 border-2 p-1 flex-1'>
          <div className='bg-blue-950 relative h-full flex-1'>
            <span className='absolute left-1 -bottom-8 z-10'>
              {playerHealth}/1000
            </span>
            <div
              style={{
                transform: `scaleX(${playerHealth / 1000})`,
              }}
              className='absolute top-0 left-0 bottom-0 w-full bg-blue-500 origin-left transition-all duration-75 ease-out'
            ></div>
          </div>
        </div>
        <div className='bg-red-950/50 border-red-900/50 border-2 p-1 flex-1'>
          <div className='bg-red-950 relative h-full flex-1'>
            <span className='absolute right-1 -bottom-8 z-10'>
              {enemyHealth}/1000
            </span>
            <div
              className='absolute top-0 right-0 bottom-0 w-full bg-red-500 origin-right transition-all duration-75 ease-out'
              style={{
                transform: `scaleX(${enemyHealth / 1000})`,
              }}
            ></div>
          </div>
        </div>
      </div>
      <div className=' absolute bottom-1 left-1 md:bottom-5 md:left-5 flex flex-col gap-1'>
        <div className='flex flex-row gap-1'>
          <div className='flex flex-row p-[2px] gap-[2px] bg-black/50 w-fit text-white'>
            <UiGroup title='XP'>
              <div className='flex flex-row gap-2 px-2 w-30 font-bold'>
                <p className='text-white'>{playerXp}</p>
              </div>
            </UiGroup>
            <UiGroup title='Money'>
              <div className='flex flex-row gap-2 px-2 w-30 font-bold'>
                <p className='text-white'>$ {playerMoney}</p>
              </div>
            </UiGroup>
          </div>
          <div className='flex p-[2px] bg-black/50 w-50 text-white'>
            <div className='bg-blue-950/50  border-blue-900/50 border-2 p-1 w-full flex-1'>
              <Tooltip
                className='w-full'
                text={
                  (eraStats[playerEra + 1].xp?.toString() ?? 'Max evolution') +
                  ' xp'
                }
              >
                <Button
                  onClick={() => handleEvolve()}
                  className='w-full overflow-clip'
                  disabled={playerXp < eraStats[playerEra + 1].xp}
                >
                  <svg
                    className='h-14 w-14 absolute right-0 top-1/2 -translate-y-1/2 z-0 opacity-30'
                    viewBox='0 0 16 16'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M9.00001 0H7.00001L5.51292 4.57681L0.700554 4.57682L0.0825195 6.47893L3.97581 9.30756L2.48873 13.8843L4.10677 15.0599L8.00002 12.2313L11.8933 15.0599L13.5113 13.8843L12.0242 9.30754L15.9175 6.47892L15.2994 4.57681L10.4871 4.57681L9.00001 0Z'
                      fill='#000000'
                    ></path>
                  </svg>
                  {eraStats[playerEra + 1] ? (
                    <span className='w-full relative z-10'>
                      Evolve to {eraStats[playerEra + 1].name}
                    </span>
                  ) : (
                    'Max evolution'
                  )}
                </Button>
              </Tooltip>
            </div>
          </div>
        </div>
        <div className='flex flex-row gap-2'>
          <div className='flex flex-row p-[2px] gap-[2px] bg-black/70'>
            <UiGroup title='Create character'>
              <div className='flex flex-row gap-2 p-1'>
                {Object.entries(charactersStats).map(([name, stats]) => (
                  <Tooltip text={'$' + stats.money} key={name}>
                    <Button
                      disabled={stats.money > playerMoney}
                      onClick={() =>
                        handleCreateCharacter(name as CharacterType, stats)
                      }
                    >
                      {name}
                    </Button>
                  </Tooltip>
                ))}
              </div>
            </UiGroup>
            <UiGroup title='Create turret'>
              <div className='flex flex-row gap-2 p-1'>
                {Object.entries(turretStats).map(([name, stats]) => (
                  <Tooltip text={'$' + stats.price} key={name}>
                    <Button
                      key={name}
                      disabled={stats.price > playerMoney}
                      onClick={() =>
                        handleCreateTurret(name as TurretType, stats)
                      }
                    >
                      {name}
                    </Button>
                  </Tooltip>
                ))}
              </div>
            </UiGroup>
          </div>
        </div>
        {/*<div className='flex flex-row p-[2px] gap-[2px] bg-black/70'>
          <div className='flex flex-col'>
            <div className='bg-red-950 relative'>
              <div className='p-1 absolute w-full h-full'>
                <div className='bg-[url(https://typographyfall2017.wordpress.com/wp-content/uploads/2017/11/bodoni-ornaments-c2a3-modified-03.png)] w-full h-full bg-contain bg-no-repeat bg-right opacity-20'></div>
              </div>
              <p className='text-sm px-5 py-1 font-bold text-red-400'>
                Create character
              </p>
            </div>
            <div className='bg-red-950/50 max-w-min p-[2px] text-black border-red-950 border-2'>
              <div className='flex flex-row gap-2 p-1'>
                {Object.entries(charactersStats).map(([name, stats]) => (
                  <button
                    key={name}
                    type='button'
                    className='h-12 px-6 bg-red-900 text-white relative text-sm'
                    onClick={() =>
                      handleCreateEnemyCharacter(name as CharacterType)
                    }
                  >
                    {name}:<br />{' '}
                    <span className='font-bold'>${stats.money}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className='flex flex-col'>
            <div className='bg-red-950 relative'>
              <div className='p-1 absolute w-full h-full'>
                <div className='bg-[url(https://typographyfall2017.wordpress.com/wp-content/uploads/2017/11/bodoni-ornaments-c2a3-modified-03.png)] w-full h-full bg-contain bg-no-repeat bg-right opacity-20'></div>
              </div>
              <p className='text-sm px-5 py-1 font-bold text-red-400'>
                Create turret
              </p>
            </div>
            <div className='bg-red-950/50 max-w-min p-[2px] text-black border-red-950 border-2'>
              <div className='flex flex-row gap-2 p-1'>
                {Object.entries(turretStats).map(([name, stats]) => (
                  <button
                    key={name}
                    type='button'
                    className='h-12 px-6 bg-red-900 text-white relative text-sm'
                    onClick={() => handleCreateEnemyTurret(name as TurretType)}
                  >
                    {name}:<br />
                    <span className='font-bold'>${stats.price}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>*/}
      </div>
    </>
  );
};

export default UiElements;
