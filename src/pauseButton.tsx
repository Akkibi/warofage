import { cn } from './utils/cn';
import { useStore } from './store';

export const PauseButton = ({ className }: { className?: string }) => {
  const setIsGamePaused = useStore((s) => s.setIsGamePaused);
  const isPaused = useStore((s) => s.isGamePaused);

  // useEffect(() => {
  //   if (isPaused) {
  //     gsap.globalTimeline.pause();
  //   } else {
  //     gsap.globalTimeline.play();
  //   }
  //   console.log('isPaused', isPaused, gsap.globalTimeline.paused());
  // }, [isPaused]);

  return (
    <>
      <button
        type='button'
        className={cn(
          'h-10 w-10 bg-black text-white flex justify-center items-center rounded-lg',
          className
        )}
        onClick={() => setIsGamePaused(!isPaused)}
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
