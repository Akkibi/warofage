import { cn } from './utils/cn';

interface Props {
  children: React.ReactNode;
  title: string;
  className?: string;
  ornament?: boolean;
}

export const UiGroup = ({ children, title, className, ornament }: Props) => {
  return (
    <div className='flex flex-col'>
      <div className='bg-purple-400 relative rounded-t-lg'>
        {ornament && (
          <div className='absolute inset-2 z-0 bg-[url(/bands.svg)] bg-no-repeat bg-contain bg-right opacity-20'></div>
        )}
        <p className='text-xs lg:text-sm px-2 py-1 text-black font-black relative z-10 alexandria uppercase '>
          {title}
        </p>
      </div>
      <div
        className={cn(
          'bg-purple-500/50 max-w-min p-[2px] text-black border-purple-400 border-2 rounded-b-lg',
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};
