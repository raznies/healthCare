import { Card, CardContent } from '@/components/ui/card';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

/**
 * EmptyState Component
 * Displays a consistent empty state pattern across the application
 *
 * @example
 * <EmptyState
 *   icon={<Calendar className="h-12 w-12" />}
 *   title="No Appointments"
 *   description="You don't have any upcoming appointments."
 *   action={<Button>Book Appointment</Button>}
 * />
 */
export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Card className="text-center p-8">
      <CardContent className="space-y-4">
        <div className="flex justify-center text-muted-foreground">
          {icon}
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
        {action && <div className="pt-2">{action}</div>}
      </CardContent>
    </Card>
  );
}
