import { div } from 'three/src/nodes/TSL.js';

import { cn } from './utils/cn';

export const Button = ({
  children,
  onClick,
  disabled,
  className,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) => {
  return (
    <button
      type='button'
      className={cn(
        'min-h-8 lg:min-h-12 px-2 lg:px-4 bg-black hover:bg-lime-950 hover:scale-105 active:scale-95 text-white relative transition-all duration-100 ease-out text-xs lg:text-sm font-light',
        className
      )}
      onClick={onClick}
      style={{
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {children}
    </button>
  );
};
