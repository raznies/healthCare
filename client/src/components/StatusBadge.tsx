import { Badge } from '@/components/ui/badge';
import { getStatusBadgeClass, getStatusLabel } from '@/lib/statusColors';
import type { AppointmentStatus } from '@/lib/statusColors';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

/**
 * StatusBadge Component
 * Displays appointment status with consistent styling across the application
 *
 * @example
 * <StatusBadge status="confirmed" />
 */
export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={`${getStatusBadgeClass(status)} ${className}`}
    >
      {getStatusLabel(status)}
    </Badge>
  );
}
