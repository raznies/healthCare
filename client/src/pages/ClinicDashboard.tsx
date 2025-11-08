import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, CheckCircle, Star, Plus, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { getIconContainerClass, getIconColorClass } from "@/lib/statusColors";
import { SidebarProvider, Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarInput, SidebarInset } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";

interface Appointment {
  id: number;
  patientName: string;
  patientPhone: string;
  serviceId: number;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  notes?: string;
}

interface DashboardStats {
  todayAppointments: number;
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
}

export default function ClinicDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Redirect to login if not authenticated or not authorized
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || (user?.role !== 'doctor' && user?.role !== 'admin'))) {
      toast({
        title: "Unauthorized",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, user, toast]);

  // Fetch dashboard stats
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
    enabled: isAuthenticated && (user?.role === 'doctor' || user?.role === 'admin'),
    retry: false,
  });

  // Fetch all appointments
  const { data: allAppointments = [], isLoading: appointmentsLoading } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments"],
    enabled: isAuthenticated && (user?.role === 'doctor' || user?.role === 'admin'),
    retry: false,
  });

  // Fetch appointments by date
  const { data: todayAppointments = [], isLoading: todayLoading } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments/date", selectedDate],
    enabled: isAuthenticated && (user?.role === 'doctor' || user?.role === 'admin'),
    retry: false,
  });

  // Update appointment status mutation
  const updateAppointmentMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      return await apiRequest("PATCH", `/api/appointments/${id}`, { status });
    },
    onSuccess: () => {
      toast({
        title: "Appointment Updated",
        description: "The appointment status has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/appointments/date", selectedDate] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update appointment. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleStatusUpdate = (appointmentId: number, status: string) => {
    updateAppointmentMutation.mutate({ id: appointmentId, status });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (isLoading || !isAuthenticated || (user?.role !== 'doctor' && user?.role !== 'admin')) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="offcanvas" variant="sidebar">
        <SidebarHeader>
          <span className="font-bold text-lg">Clinic Portal</span>
        </SidebarHeader>
        <SidebarInput placeholder="Search..." />
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={true}>
                <a href="/clinic-dashboard">Dashboard</a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/appointments">Appointments</a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/patients">Patients</a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/analytics">Analytics</a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/settings">Settings</a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="container-wide section-dashboard">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
                <BreadcrumbSeparator />
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbPage>Clinic Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="mb-8 mt-6">
            <h1 className="text-3xl font-bold">Clinic Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, Dr. {user?.firstName || "Doctor"}! Here's your practice overview.</p>
          </div>

          {/* Dashboard Stats */}
          <div className="grid-stats mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={getIconContainerClass('primary')}>
                    <Calendar className={`h-6 w-6 ${getIconColorClass('primary')}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-muted-foreground">Today's Appointments</p>
                    <p className="text-2xl font-bold">
                      {statsLoading ? "..." : stats?.todayAppointments || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={getIconContainerClass('success')}>
                    <Users className={`h-6 w-6 ${getIconColorClass('success')}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-muted-foreground">Total Appointments</p>
                    <p className="text-2xl font-bold">
                      {statsLoading ? "..." : stats?.totalAppointments || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={getIconContainerClass('warning')}>
                    <CheckCircle className={`h-6 w-6 ${getIconColorClass('warning')}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold">
                      {statsLoading ? "..." : stats?.completedAppointments || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={getIconContainerClass('info')}>
                    <Star className={`h-6 w-6 ${getIconColorClass('info')}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-muted-foreground">Patient Rating</p>
                    <p className="text-2xl font-bold">4.9★</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Today's Schedule */}
            <div className="lg:col-span-2">
              <Card>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Schedule</h2>
                    <div className="flex items-center space-x-4">
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="border border-input rounded-md px-3 py-2 text-sm
                                   focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      />
                    </div>
                  </div>
                  {todayLoading ? (
                    <div className="text-center py-8">Loading appointments...</div>
                  ) : todayAppointments.length === 0 ? (
                    <EmptyState
                      icon={<Calendar className="h-12 w-12" />}
                      title="No Appointments"
                      description="No appointments scheduled for this date."
                    />
                  ) : (
                    <div className="space-y-4">
                      {todayAppointments.map((appointment) => (
                        <div key={appointment.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="text-center min-w-[60px]">
                              <div className="text-sm text-muted-foreground">{formatTime(appointment.appointmentTime)}</div>
                            </div>
                            <div>
                              <h3 className="font-semibold">{appointment.patientName}</h3>
                              <p className="text-sm text-muted-foreground">Service ID: {appointment.serviceId}</p>
                              <p className="text-xs text-muted-foreground">{appointment.patientPhone}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <StatusBadge status={appointment.status} />
                            <div className="flex space-x-1">
                              {appointment.status === 'scheduled' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}
                                  disabled={updateAppointmentMutation.isPending}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
                              {appointment.status === 'confirmed' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                                  disabled={updateAppointmentMutation.isPending}
                                >
                                  <CheckCircle className="h-4 w-4 text-[hsl(var(--success-green))]" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                                disabled={updateAppointmentMutation.isPending}
                              >
                                <X className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Quick Actions & Notifications */}
            <div className="space-y-6">
              <Card>
                <div className="p-6">
                  <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
                  <div className="space-y-3">
                    <Button className="w-full justify-start">
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Patient
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule Appointment
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Users className="mr-2 h-4 w-4" />
                      View All Patients
                    </Button>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
                  <div className="space-y-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <p className="text-sm font-medium text-primary">New appointment booked</p>
                      <p className="text-xs text-primary/80">Just now</p>
                    </div>
                    <div className="p-3 bg-[hsl(var(--success-green))]/10 rounded-lg">
                      <p className="text-sm font-medium text-[hsl(var(--success-green))]">Payment received</p>
                      <p className="text-xs text-[hsl(var(--success-green))]/80">2 hours ago</p>
                    </div>
                    <div className="p-3 bg-[hsl(var(--warning-yellow))]/10 rounded-lg">
                      <p className="text-sm font-medium text-[hsl(var(--warning-yellow))]">Appointment reminder sent</p>
                      <p className="text-xs text-[hsl(var(--warning-yellow))]/80">3 hours ago</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
