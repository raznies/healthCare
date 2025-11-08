/**
 * Centralized status color management
 * Single source of truth for appointment status badge styling
 */

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled';

/**
 * Get the CSS classes for a status badge using design tokens
 * @param status - The appointment status
 * @returns Tailwind CSS classes for the badge
 */
export function getStatusBadgeClass(status: string): string {
  const statusMap: Record<string, string> = {
    scheduled: 'bg-[hsl(var(--warning-yellow))]/10 text-[hsl(var(--warning-yellow))] border-[hsl(var(--warning-yellow))]/20',
    confirmed: 'bg-primary/10 text-primary border-primary/20',
    completed: 'bg-[hsl(var(--success-green))]/10 text-[hsl(var(--success-green))] border-[hsl(var(--success-green))]/20',
    cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
  };

  return statusMap[status.toLowerCase()] || 'bg-muted text-muted-foreground border-border';
}

/**
 * Get the display label for a status
 * @param status - The appointment status
 * @returns Formatted status label
 */
export function getStatusLabel(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

/**
 * Get the icon container background class based on type
 * @param type - The icon container type
 * @returns Tailwind CSS classes for the icon container
 */
export function getIconContainerClass(type: 'primary' | 'success' | 'warning' | 'danger' | 'info'): string {
  const typeMap: Record<string, string> = {
    primary: 'bg-primary/10',
    success: 'bg-[hsl(var(--success-green))]/10',
    warning: 'bg-[hsl(var(--warning-yellow))]/10',
    danger: 'bg-destructive/10',
    info: 'bg-[hsl(var(--medical-blue))]/10',
  };

  return typeMap[type] || 'bg-muted';
}

/**
 * Get the icon color class based on type
 * @param type - The icon color type
 * @returns Tailwind CSS classes for the icon
 */
export function getIconColorClass(type: 'primary' | 'success' | 'warning' | 'danger' | 'info'): string {
  const typeMap: Record<string, string> = {
    primary: 'text-primary',
    success: 'text-[hsl(var(--success-green))]',
    warning: 'text-[hsl(var(--warning-yellow))]',
    danger: 'text-destructive',
    info: 'text-[hsl(var(--medical-blue))]',
  };

  return typeMap[type] || 'text-muted-foreground';
}
