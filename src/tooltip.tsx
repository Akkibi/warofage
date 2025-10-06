import { cn } from './utils/cn';

import type { CharacterStatsType, TurretStatsType } from './types';

export const Tooltip = ({
  children,
  text,
  className,
  characterStats,
  turretStats,
}: {
  children: React.ReactNode;
  text: string;
  className?: string;
  characterStats?: CharacterStatsType;
  turretStats?: TurretStatsType;
}) => {
  const statsRow = (name: string, value: number) => {
    return (
      <div className='flex flex-row'>
        <p className='p-1 text-white w-24 text-xs font-light'>{name}</p>
        <div className='relative w-30'>
          <div className='absolute inset-2 bg-black'>
            <div
              className='absolute inset-0 bg-cyan-400 origin-left'
              style={{
                transform: `scaleX(${value})`,
              }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={cn('relative group', className)}>
      <div className='absolute z-20 bottom-full left-1/2 -translate-x-1/2 -translate-y-2 w-fit h-fit bg-black/50 p-[2px] text-nowrap opacity-0 group-hover:opacity-100 duration-100 ease-out transition-all select-none pointer-events-none'>
        <div className='bg-black/50 p-2'>
          {characterStats ? (
            <>
              {statsRow('Health', characterStats.health / 500)}
              {statsRow('Price', characterStats.money / 350)}
              {statsRow('Attack', characterStats.attack / 60)}
              {statsRow('Attack speed', characterStats.attackSpeed / 5)}
              {statsRow('Attack range', characterStats.attackRange)}
            </>
          ) : turretStats ? (
            <div>{turretStats.attack}</div>
          ) : (
            <p className='text-sm font-bold text-white w-full text-center p-2 px-3'>
              {text}
            </p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};
