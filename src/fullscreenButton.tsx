import { useState } from 'react';

import { cn } from './utils/cn';

export const FullscreenButton = ({ className }: { className?: string }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullscren = () => {
    if (isFullscreen) {
      document.exitFullscreen();
    } else {
      document.body.requestFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <>
      <button
        type='button'
        className={cn(
          'h-10 w-10 bg-black text-white flex justify-center items-center rounded-lg',
          className
        )}
        onClick={handleFullscren}
      >
        {isFullscreen ? (
          <svg
            viewBox='0 0 16 16'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className='h-10 w-10 p-2'
          >
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M10 15H15V10H13.2V13.2H10V15ZM6 15V13.2H2.8V10H1V15H6ZM10 2.8H12.375H13.2V6H15V1H10V2.8ZM6 1V2.8H2.8V6H1V1H6Z'
              fill='currentColor'
            ></path>
          </svg>
        ) : (
          <svg
            viewBox='0 0 16 16'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className='h-10 w-10 p-2'
          >
            <path
              d='M1 6L6 6L6 1L4.2 1L4.2 4.2L1 4.2L1 6Z'
              fill='currentColor'
            ></path>
            <path
              d='M15 10L10 10L10 15L11.8 15L11.8 11.8L15 11.8L15 10Z'
              fill='currentColor'
            ></path>
            <path
              d='M6 15L6 10L1 10L1 11.8L4.2 11.8L4.2 15L6 15Z'
              fill='currentColor'
            ></path>
            <path
              d='M10 1L10 6L15 6L15 4.2L11.8 4.2L11.8 1L10 1Z'
              fill='currentColor'
            ></path>
          </svg>
        )}
      </button>
    </>
  );
};
