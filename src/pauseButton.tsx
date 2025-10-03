import { useState } from 'react';

import { cn } from './utils/cn';
import { eventEmitter } from './utils/eventEmitter';

export const PauseButton = ({ className }: { className?: string }) => {
  const [isPaused, setIsPaused] = useState(false);

  const handlePause = () => {
    eventEmitter.trigger('pause-game', [!isPaused]);
    setIsPaused(!isPaused);
  };

  return (
    <>
      <button
        type='button'
        className={cn(
          'h-10 w-10 bg-blue-900 text-white flex justify-center items-center',
          className
        )}
        onClick={handlePause}
      >
        {isPaused ? (
          <svg
            className='h-10 w-10 p-2'
            viewBox='0 0 16 16'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M5 16L7 16L15 8L7 -2.7818e-08L5 0L5 16Z'
              fill='currentColor'
              className='h-10 w-10 p-2'
            ></path>
          </svg>
        ) : (
          <svg
            viewBox='0 0 16 16'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className='h-10 w-10 p-2'
          >
            <path d='M7 1H2V15H7V1Z' fill='currentColor'></path>
            <path d='M14 1H9V15H14V1Z' fill='currentColor'></path>
          </svg>
        )}
      </button>
    </>
  );
};
