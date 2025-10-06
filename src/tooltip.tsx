import { useEffect, useRef, useState } from 'react';

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
  const [show, setShow] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tooltip = tooltipRef.current;
    if (!tooltip) return;

    let targetVisibility = false;

    const handleMouseEnter = () => {
      targetVisibility = true;
      setTimeout(() => {
        handleChangeVisibility();
      }, 1000);
    };
    const handleMouseLeave = () => {
      targetVisibility = false;
      handleChangeVisibility();
    };

    const handleChangeVisibility = () => {
      setShow(targetVisibility);
    };

    tooltip.addEventListener('mouseenter', handleMouseEnter);
    tooltip.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      tooltip.removeEventListener('mouseenter', handleMouseEnter);
      tooltip.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

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
    <div className={cn('relative group', className)} ref={tooltipRef}>
      {characterStats && show && (
        <div className='absolute z-20 bottom-full left-1/2 -translate-x-1/2 -translate-y-14 w-fit h-fit bg-black/50 p-[2px] text-nowrap opacity-0 group-hover:opacity-100 duration-100 ease-out transition-all select-none pointer-events-none'>
          <div className='bg-black/50 p-2'>
            {statsRow('Health', characterStats.health / 500)}
            {statsRow('Price', characterStats.money / 350)}
            {statsRow('Attack damage', characterStats.attack / 60)}
            {statsRow('Attack speed', characterStats.attackSpeed / 5)}
            {statsRow('Attack range', characterStats.attackRange)}
          </div>
        </div>
      )}
      {turretStats && show && (
        <div className='absolute z-20 bottom-full left-1/2 -translate-x-1/2 -translate-y-14 w-fit h-fit bg-black/50 p-[2px] text-nowrap opacity-0 group-hover:opacity-100 duration-100 ease-out transition-all select-none pointer-events-none'>
          <div className='bg-black/50 p-2'>
            {statsRow('Price', turretStats.price / 8000)}
            {statsRow('Attack damage', turretStats.attack / 350)}
            {statsRow('Attack speed', turretStats.speed / 4)}
            {statsRow('Attack range', turretStats.range / 2)}
          </div>
        </div>
      )}
      <div className='absolute z-20 bottom-full left-1/2 -translate-x-1/2 -translate-y-2 w-fit h-fit bg-black/50 p-[2px] text-nowrap opacity-0 group-hover:opacity-100 duration-100 ease-out transition-all select-none pointer-events-none'>
        <div className='bg-black/50 p-2'>
          <p className='text-sm font-bold text-white w-full text-center'>
            {text}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
};
