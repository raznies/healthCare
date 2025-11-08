import { cn } from '@/lib/utils';

type SpinnerSize = 'sm' | 'md' | 'lg';

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

/**
 * LoadingSpinner Component
 * Displays a consistent loading spinner across the application
 *
 * @example
 * <LoadingSpinner size="lg" />
 */
export function LoadingSpinner({ size = 'lg', className }: LoadingSpinnerProps) {
  const sizeClasses: Record<SpinnerSize, string> = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-32 w-32',
  };

  return (
    <div className="flex items-center justify-center min-h-64">
      <div className="text-center">
        <div
          className={cn(
            'animate-spin rounded-full border-b-2 border-primary mx-auto',
            sizeClasses[size],
            className
          )}
        />
      </div>
    </div>
  );
}

/**
 * LoadingSpinnerInline Component
 * Displays an inline loading spinner without the container
 *
 * @example
 * <LoadingSpinnerInline size="md" />
 */
export function LoadingSpinnerInline({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses: Record<SpinnerSize, string> = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-b-2 border-primary',
        sizeClasses[size],
        className
      )}
    />
  );
}
