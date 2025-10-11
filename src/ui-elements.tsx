import { useEffect } from 'react';

import { eventEmitter } from './utils/eventEmitter';
import { eraStats, turretStats } from './staticData';
import { UiGroup } from './ui-group';
import { Button } from './button';
import { Tooltip } from './tooltip';
import { useStore } from './store';
import { PauseButton } from './pauseButton';
import { FullscreenButton } from './fullscreenButton';
import { ButtonCharacters } from './buttons-characters';

import type { TurretStatsType, TurretType } from './types';

// HealthBar.tsx

const UiElements = () => {
  const playerHealth = useStore((s) => s.playerHealth);
  const playerMoney = useStore((s) => s.playerMoney);
  const playerXp = useStore((s) => s.playerXp);
  const enemyHealth = useStore((s) => s.enemyHealth);
  const enemyMoney = useStore((s) => s.enemyMoney);
  const enemyXp = useStore((s) => s.enemyXp);
  const playerEra = useStore((s) => s.playerEra);
  const setIsMenuOpen = useStore((s) => s.setIsMenuOpen);
  const setIsGamePaused = useStore((s) => s.setIsGamePaused);
  useEffect(() => {
    if (playerHealth <= 0 || enemyHealth <= 0) {
      setIsMenuOpen(true);
      setIsGamePaused(true);
    }
  }, [playerHealth, enemyHealth, setIsMenuOpen, setIsGamePaused]);

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
      <div className='top-0 left-0 h-[15vh] w-[15vh] bg-[url(/corners.svg)] absolute z-0 bg-no-repeat bg-cover select-none pointer-events-none rotate-90'></div>
      <div className='bottom-0 left-0 h-[15vh] w-[15vh] bg-[url(/corners.svg)] absolute z-0 bg-no-repeat bg-cover select-none pointer-events-none'></div>
      <div className='top-0 right-0 h-[15vh] w-[15vh] bg-[url(/corners.svg)] absolute z-0 bg-no-repeat bg-cover select-none pointer-events-none rotate-180'></div>
      <div className='bottom-0 right-0 h-[15vh] w-[15vh] bg-[url(/corners.svg)] absolute z-0 bg-no-repeat bg-cover select-none pointer-events-none -rotate-90'></div>

      <div className='absolute top-0 left-0 right-0 w-full h-[7vh] bg-[url(/bands2.png)] mix-blend-multiply rotate-180'></div>
      <div className='absolute bottom-0 left-0 right-0 w-full h-[7vh] bg-[url(/bands2.png)] mix-blend-multiply'></div>
      <div className='bottom-0 left-0 h-full w-full bg-[url(/boundstexture.png)] absolute z-0 bg-no-repeat bg-cover inset-0 select-none pointer-events-none mix-blend-multiply opacity-50 bg-center'></div>
      <div className='absolute top-14 lg:top-25 -right-1 bg-black/70 h-fit p-[2px] w-fit rounded-lg'>
        <UiGroup title='options' className='w-full max-w-full'>
          <div className='flex flex-col gap-1 p-1'>
            <FullscreenButton className='w-full' />
            <PauseButton className='w-full' />
            <div
              id='stats-position'
              className='w-full h-10 bg-purple-950 rounded-lg overflow-clip'
            ></div>
          </div>
        </UiGroup>
      </div>
      <h1 className='text-white text-2xl font-black absolute bottom-5 right-5 text-right'>
        <span className='text-xs font-light flex flex-col'>
          <br /> {enemyXp}
          <br />$ {enemyMoney}
        </span>
        <div className='w-20 h-10 bg-contain bg-no-repeat bg-[url(/logo.svg)]'></div>
      </h1>
      <div className='absolute top-1 right-1 left-1 lg:top-5 lg:left-5 lg:right-5 flex flex-col'>
        <div className='flex flex-rox gap-5 h-10 lg:h-10 rounded-full'>
          <div className='bg-black/50 rounded-full flex-1 p-[2px] relative'>
            <div className='bg-cyan-950/50 border-cyan-900/50 border-2 p-1 rounded-full h-full'>
              <div className='bg-cyan-950 relative h-full flex-1 rounded-full overflow-clip'>
                <b className='absolute right-6 top-1 z-10 text-xs text-cyan-500 mix-blend-difference'>
                  {playerHealth} / 1000
                </b>
                <div
                  className='absolute top-0 right-0 bottom-0 w-full bg-white origin-left transition-all duration-75 ease-out'
                  style={{
                    transform: `scaleX(${Math.max(playerHealth / 1000, 0)})`,
                  }}
                ></div>
                <div
                  style={{
                    transform: `scaleX(${Math.max(playerHealth / 1000, 0)})`,
                  }}
                  className='absolute top-0 left-0 bottom-0 w-full bg-cyan-500 origin-left'
                ></div>
              </div>
            </div>
          </div>
          <div className='bg-black/50 rounded-full flex-1 p-[2px] relative'>
            <div className='bg-amber-950/50 border-amber-900/50 border-2 p-1 flex-1 flex gap-1 rounded-full h-full'>
              <div className='bg-amber-950 relative h-full flex-1 rounded-full overflow-clip'>
                <b className='absolute left-6 top-1 z-10 text-xs text-amber-500 mix-blend-difference'>
                  {enemyHealth} / 1000
                </b>
                <div
                  className='absolute top-0 right-0 bottom-0 w-full bg-white origin-right transition-all duration-75 ease-out'
                  style={{
                    transform: `scaleX(${Math.max(enemyHealth / 1000, 0)})`,
                  }}
                ></div>
                <div
                  className='absolute top-0 right-0 bottom-0 w-full bg-amber-500 origin-right'
                  style={{
                    transform: `scaleX(${Math.max(enemyHealth / 1000, 0)})`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-row p-[2px] gap-[2px] bg-black/50 w-fit text-white rounded-lg mt-2'>
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
      </div>
      <ButtonCharacters />
      <div className=' absolute bottom-5 left-60 lg:bottom-5 lg:left-72 flex flex-row-reverse lg:flex-col gap-1 items-end'>
        <div className='flex flex-row gap-1'>
          <div className='flex p-[2px] bg-black/50 w-50 text-white rounded-lg h-fit'>
            <div className='bg-purple-700/50  border-purple-400 border-2 p-1 w-full flex-1 rounded-lg'>
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
                    className='h-14 w-14 absolute right-0 top-1/2 -translate-y-1/2 z-0 opacity-10'
                    viewBox='0 0 16 16'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M9.00001 0H7.00001L5.51292 4.57681L0.700554 4.57682L0.0825195 6.47893L3.97581 9.30756L2.48873 13.8843L4.10677 15.0599L8.00002 12.2313L11.8933 15.0599L13.5113 13.8843L12.0242 9.30754L15.9175 6.47892L15.2994 4.57681L10.4871 4.57681L9.00001 0Z'
                      fill='#ffffff'
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
          <div className='flex flex-row p-[2px] gap-[2px] bg-black/70 rounded-lg'>
            <UiGroup title='Create turret' ornament>
              <div className='flex flex-row gap-[2px] lg:gap-2 p-[2px] lg:p-1'>
                {Object.entries(turretStats).map(([name, stats]) => (
                  <Tooltip
                    text={'$' + stats.price}
                    key={name}
                    turretStats={stats}
                  >
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
      </div>
    </>
  );
};

export default UiElements;
