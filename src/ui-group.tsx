import { cn } from './utils/cn';

interface Props {
  children: React.ReactNode;
  title: string;
  className?: string;
}

export const UiGroup = ({ children, title, className }: Props) => {
  return (
    <div className='flex flex-col'>
      <div className='bg-blue-950 relative'>
        <div className='p-1 absolute w-full h-full'>
          <div className='bg-[url(https://typographyfall2017.wordpress.com/wp-content/uploads/2017/11/bodoni-ornaments-c2a3-modified-03.png)] w-full h-full bg-contain bg-no-repeat bg-right opacity-20'></div>
        </div>
        <p className='text-sm px-5 py-1 text-blue-400 font-bold'>{title}</p>
      </div>
      <div
        className={cn(
          'bg-blue-950/50 max-w-min p-[2px] text-black border-blue-950 border-2',
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};
