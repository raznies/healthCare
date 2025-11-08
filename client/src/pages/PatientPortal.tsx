import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, User, History, CalendarPlus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import BookingModal from "@/components/BookingModal";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { SidebarProvider, Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarInput, SidebarInset } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { spacing } from "@/lib/designTokens";

interface Appointment {
  id: number;
  patientName: string;
  serviceId: number;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  notes?: string;
}

interface Patient {
  id: number;
  userId: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
}

export default function PatientPortal() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [patientData, setPatientData] = useState({
    phone: "",
    dateOfBirth: "",
    address: "",
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  // Fetch patient appointments
  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ["/api/appointments"],
    enabled: isAuthenticated,
    retry: false,
  });

  // Fetch patient profile
  const { data: patient, isLoading: patientLoading } = useQuery({
    queryKey: ["/api/patient/profile"],
    enabled: isAuthenticated,
    retry: false,
  });

  // Update patient profile mutation
  const updatePatientMutation = useMutation({
    mutationFn: async (data: typeof patientData) => {
      return await apiRequest("POST", "/api/patient/profile", data);
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/patient/profile"] });
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
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Update appointment mutation
  const updateAppointmentMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      return await apiRequest("PATCH", `/api/appointments/${id}`, { status });
    },
    onSuccess: () => {
      toast({
        title: "Appointment Updated",
        description: "Your appointment has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
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

  // Set patient data when loaded
  useEffect(() => {
    if (patient) {
      setPatientData({
        phone: patient.phone || "",
        dateOfBirth: patient.dateOfBirth || "",
        address: patient.address || "",
      });
    }
  }, [patient]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updatePatientMutation.mutate(patientData);
  };

  const handleCancelAppointment = (appointmentId: number) => {
    updateAppointmentMutation.mutate({ id: appointmentId, status: "cancelled" });
  };

  const upcomingAppointments = appointments.filter((apt: Appointment) =>
    new Date(`${apt.appointmentDate}T${apt.appointmentTime}`) > new Date() &&
    apt.status !== "cancelled"
  );

  const pastAppointments = appointments.filter((apt: Appointment) =>
    new Date(`${apt.appointmentDate}T${apt.appointmentTime}`) <= new Date() ||
    apt.status === "cancelled"
  );

  if (isLoading || !isAuthenticated) {
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
              <SidebarMenuButton asChild>
                <a href="/clinic-dashboard">Dashboard</a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/appointments">Appointments</a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={true}>
                <a href="/patient-portal">Patients</a>
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
        <div className="container-narrow section-dashboard">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
                <BreadcrumbSeparator />
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbPage>Patient Portal</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Card className="shadow-xl mt-6">
            <CardHeader className="bg-primary text-white rounded-t-lg">
              <div className="text-center">
                <CardTitle className="text-3xl mb-2 text-white">Patient Portal</CardTitle>
                <p className="text-primary-100">Welcome back, {user?.firstName || "Patient"}!</p>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <Tabs defaultValue="appointments" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="appointments" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Appointments
                  </TabsTrigger>
                  <TabsTrigger value="profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="history" className="flex items-center gap-2">
                    <History className="h-4 w-4" />
                    History
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="appointments" className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Upcoming Appointments</h2>
                    <Button onClick={() => setShowBookingModal(true)}>
                      <CalendarPlus className="mr-2 h-4 w-4" />
                      Book New Appointment
                    </Button>
                  </div>

                  {appointmentsLoading ? (
                    <div className="text-center py-8">Loading appointments...</div>
                  ) : upcomingAppointments.length === 0 ? (
                    <EmptyState
                      icon={<Calendar className="h-12 w-12" />}
                      title="No Upcoming Appointments"
                      description="Schedule your next dental visit to maintain optimal oral health."
                      action={
                        <Button onClick={() => setShowBookingModal(true)}>
                          Book Appointment
                        </Button>
                      }
                    />
                  ) : (
                    <div className="space-y-4">
                      {upcomingAppointments.map((appointment: Appointment) => (
                        <Card key={appointment.id} className="border-l-4 border-l-[hsl(var(--appointment-blue))]">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                              <div className="space-y-2">
                                <h3 className="font-semibold">Service ID: {appointment.serviceId}</h3>
                                <div className="flex items-center text-muted-foreground">
                                  <Calendar className="h-4 w-4 mr-2" />
                                  {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.appointmentTime}
                                </div>
                                <StatusBadge status={appointment.status} />
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleCancelAppointment(appointment.id)}
                                  disabled={updateAppointmentMutation.isPending}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="profile" className="space-y-6">
                  <h2 className="text-xl font-bold">Profile Information</h2>
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={user?.firstName || ""}
                          disabled
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={user?.lastName || ""}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={user?.email || ""}
                        disabled
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={patientData.phone}
                        onChange={(e) => setPatientData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={patientData.dateOfBirth}
                        onChange={(e) => setPatientData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={patientData.address}
                        onChange={(e) => setPatientData(prev => ({ ...prev, address: e.target.value }))}
                      />
                    </div>

                    <Button type="submit" disabled={updatePatientMutation.isPending}>
                      {updatePatientMutation.isPending ? "Updating..." : "Update Profile"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="history" className="space-y-6">
                  <h2 className="text-xl font-bold">Appointment History</h2>
                  {pastAppointments.length === 0 ? (
                    <EmptyState
                      icon={<History className="h-12 w-12" />}
                      title="No Past Appointments"
                      description="Your appointment history will appear here."
                    />
                  ) : (
                    <div className="space-y-4">
                      {pastAppointments.map((appointment: Appointment) => (
                        <Card key={appointment.id}>
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                              <div className="space-y-2">
                                <h3 className="font-semibold">Service ID: {appointment.serviceId}</h3>
                                <div className="flex items-center text-muted-foreground">
                                  <Calendar className="h-4 w-4 mr-2" />
                                  {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.appointmentTime}
                                </div>
                              </div>
                              <StatusBadge status={appointment.status} />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          <BookingModal open={showBookingModal} onOpenChange={setShowBookingModal} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
