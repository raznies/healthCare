import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Users, DollarSign, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface AnalyticsData {
  overview: {
    totalAppointments: number;
    totalPatients: number;
    totalRevenue: number;
    averageAppointmentDuration: number;
    completionRate: number;
    cancellationRate: number;
  };
  monthlyStats: {
    month: string;
    appointments: number;
    revenue: number;
    newPatients: number;
  }[];
  serviceStats: {
    serviceName: string;
    bookingCount: number;
    revenue: number;
    averageDuration: number;
  }[];
  appointmentStatusBreakdown: {
    scheduled: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
}

export default function Analytics() {
  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ['/api/analytics'],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">Comprehensive insights into your clinic's performance</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.overview.totalAppointments || 0}</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.overview.totalPatients || 0}</div>
                <p className="text-xs text-muted-foreground">+8% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{analytics?.overview.totalRevenue?.toLocaleString() || 0}</div>
                <p className="text-xs text-muted-foreground">+15% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.overview.completionRate || 0}%</div>
                <p className="text-xs text-muted-foreground">+2% from last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Status Breakdown</CardTitle>
                <CardDescription>Current status distribution of all appointments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Completed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{analytics?.appointmentStatusBreakdown.completed || 0}</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {analytics?.overview.totalAppointments 
                        ? Math.round((analytics.appointmentStatusBreakdown.completed / analytics.overview.totalAppointments) * 100) 
                        : 0}%
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span>Scheduled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{analytics?.appointmentStatusBreakdown.scheduled || 0}</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {analytics?.overview.totalAppointments 
                        ? Math.round((analytics.appointmentStatusBreakdown.scheduled / analytics.overview.totalAppointments) * 100) 
                        : 0}%
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <span>Confirmed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{analytics?.appointmentStatusBreakdown.confirmed || 0}</span>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                      {analytics?.overview.totalAppointments 
                        ? Math.round((analytics.appointmentStatusBreakdown.confirmed / analytics.overview.totalAppointments) * 100) 
                        : 0}%
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span>Cancelled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{analytics?.appointmentStatusBreakdown.cancelled || 0}</span>
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      {analytics?.overview.totalAppointments 
                        ? Math.round((analytics.appointmentStatusBreakdown.cancelled / analytics.overview.totalAppointments) * 100) 
                        : 0}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Performance</CardTitle>
                <CardDescription>Last 6 months appointment and revenue trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.monthlyStats.slice(-6).map((month, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{month.month}</p>
                        <p className="text-sm text-gray-600">{month.appointments} appointments</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{month.revenue.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">{month.newPatients} new patients</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Performance</CardTitle>
              <CardDescription>Analysis of individual service bookings and revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.serviceStats.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{service.serviceName}</h3>
                      <p className="text-sm text-gray-600">{service.bookingCount} bookings</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{service.revenue.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">{service.averageDuration} min avg</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Average Duration</CardTitle>
                <CardDescription>Per appointment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analytics?.overview.averageAppointmentDuration || 0} min</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Completion Rate</CardTitle>
                <CardDescription>Successfully completed appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{analytics?.overview.completionRate || 0}%</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cancellation Rate</CardTitle>
                <CardDescription>Cancelled appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">{analytics?.overview.cancellationRate || 0}%</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>By service type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics?.serviceStats.map((service, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{service.serviceName}</span>
                      <span className="font-medium">₹{service.revenue.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue Trend</CardTitle>
                <CardDescription>Last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics?.monthlyStats.slice(-6).map((month, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{month.month}</span>
                      <span className="font-medium">₹{month.revenue.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}