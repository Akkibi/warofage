import { Button } from './button';
import { useStore } from './store';
import { cn } from './utils/cn';
import { eventEmitter } from './utils/eventEmitter';
import { charactersStats } from './staticData';
import { Tooltip } from './tooltip';

import type { CharacterStatsType, CharacterType } from './types';

const handleCreateCharacter = (
  name: CharacterType,
  stats: CharacterStatsType
) => {
  const playerMoney = useStore.getState().playerMoney;
  if (stats.money > playerMoney) return;
  eventEmitter.trigger('update-player-money', [true, stats.money * -1]);
  for (let i = 0; i < stats.quantity; i++) {
    eventEmitter.trigger('create-character', [name, true]);
  }
  console.log('create character');
};

export const ButtonCharacters = () => {
  return (
    <div className='absolute bottom-5 left-5 z-20 rotate-45'>
      <div className='flex flex-row w-full justify-center h-fit'>
        <IndividualButton name='Assassin'>Assasin</IndividualButton>
      </div>
      <div className='flex flex-row w-full justify-center h-fit'>
        <IndividualButton name='Archer'>Archer</IndividualButton>
        <IndividualButton name='Bruiser'>Bruiser</IndividualButton>
        <IndividualButton name='Tank'>Tank</IndividualButton>
      </div>
      <div className='flex flex-row w-full justify-center h-fit'>
        <IndividualButton name='Mage'>Mage</IndividualButton>
      </div>
    </div>
  );
};

const IndividualButton = ({
  children,
  className,
  name,
}: {
  children: React.ReactNode;
  className?: string;
  name: CharacterType;
}) => {
  const playerMoney = useStore((s) => s.playerMoney);
  const stats = charactersStats[name];
  return (
    <div className='w-16 h-16 lg:w-20 lg:h-20 bg-black/50 p-[2px] rounded-xl'>
      <div
        className={cn(
          'w-full h-full bg-purple-500/50 border-2 border-purple-400 p-1 rounded-xl',
          className
        )}
      >
        <Tooltip
          text={'$ ' + stats.money}
          characterStats={stats}
          className='w-full h-full'
        >
          <Button
            onClick={() => handleCreateCharacter(name, stats)}
            disabled={stats.money > playerMoney}
            className='w-full h-full relative'
          >
            <span className='-rotate-45 absolute inline-block -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2'>
              {children}
            </span>
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};
