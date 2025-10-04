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
        'min-h-10 md:min-h-12 px-2 md:px-6 bg-blue-900 hover:bg-blue-800 hover:scale-105 active:scale-95 text-white relative text-sm transition-all duration-100 ease-out',
        className
      )}
      onClick={onClick}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      {children}
    </button>
  );
};
