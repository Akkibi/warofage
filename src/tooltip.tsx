import { cn } from './utils/cn';

export const Tooltip = ({
  children,
  text,
  className,
}: {
  children: React.ReactNode;
  text: string;
  className?: string;
}) => {
  return (
    <div className={cn('relative group', className)}>
      <div
        className='absolute bottom-full left-1/2 -translate-x-1/2 -translate-y-2 w-fit h-fit bg-black/70 p-[2px] text-nowrap opacity-0 group-hover:opacity-100 duration-100 ease-out transition-all'
        style={{
          clipPath:
            'polygon(0.5rem 0, calc(100% - 0.5rem) 0, 100% 0.5rem, 100% calc(100% - 0.5rem), calc(100% - 0.5rem) 100%, 0.5rem 100%, 0 calc(100% - 0.5rem), 0 0.5rem)',
        }}
      >
        <p className='text-sm font-bold text-white w-full text-center p-2 px-3'>
          {text}
        </p>
      </div>
      {children}
    </div>
  );
};
