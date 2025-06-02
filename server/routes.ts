import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { sendAppointmentConfirmation } from "./emailService";
import { insertAppointmentSchema, insertContactMessageSchema, insertPatientSchema, insertMedicalRecordSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Services routes
  app.get('/api/services', async (req, res) => {
    try {
      const services = await storage.getActiveServices();
      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  // Appointments routes
  app.get('/api/appointments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role === 'doctor' || user?.role === 'admin') {
        // Doctor/admin can see all appointments
        const appointments = await storage.getAppointments();
        res.json(appointments);
      } else {
        // Patient can only see their own appointments
        const patient = await storage.getPatientByUserId(userId);
        if (patient) {
          const appointments = await storage.getPatientAppointments(patient.id);
          res.json(appointments);
        } else {
          res.json([]);
        }
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  app.get('/api/appointments/date/:date', isAuthenticated, async (req, res) => {
    try {
      const { date } = req.params;
      const appointments = await storage.getAppointmentsByDate(date);
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching appointments by date:", error);
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  app.post('/api/appointments', async (req, res) => {
    try {
      const appointmentData = insertAppointmentSchema.parse(req.body);
      
      // Use the clinic's default doctor
      const defaultDoctorId = 'doctor-1';
      
      const appointment = await storage.createAppointment({
        ...appointmentData,
        status: 'scheduled',
        doctorId: defaultDoctorId
      });

      // Send email confirmation
      try {
        if (appointment.patientId && appointment.serviceId) {
          const patient = await storage.getPatient(appointment.patientId);
          const user = patient?.userId ? await storage.getUser(patient.userId) : null;
          const service = await storage.getService(appointment.serviceId);

          if (patient && user && service && user.email) {
            await sendAppointmentConfirmation({
              appointment,
              patient,
              user,
              service
            });
          }
        }
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail the appointment creation if email fails
      }

      res.status(201).json(appointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid appointment data", errors: error.errors });
      } else {
        console.error("Error creating appointment:", error);
        res.status(500).json({ message: "Failed to create appointment" });
      }
    }
  });

  app.patch('/api/appointments/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const appointment = await storage.updateAppointment(parseInt(id), updateData);
      res.json(appointment);
    } catch (error) {
      console.error("Error updating appointment:", error);
      res.status(500).json({ message: "Failed to update appointment" });
    }
  });

  // Patient routes
  app.get('/api/patient/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const patient = await storage.getPatientByUserId(userId);
      res.json(patient);
    } catch (error) {
      console.error("Error fetching patient profile:", error);
      res.status(500).json({ message: "Failed to fetch patient profile" });
    }
  });

  app.post('/api/patient/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const patientData = insertPatientSchema.parse({ ...req.body, userId });
      
      // Check if patient already exists
      const existingPatient = await storage.getPatientByUserId(userId);
      
      if (existingPatient) {
        const updatedPatient = await storage.updatePatient(existingPatient.id, patientData);
        res.json(updatedPatient);
      } else {
        const newPatient = await storage.createPatient(patientData);
        res.status(201).json(newPatient);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid patient data", errors: error.errors });
      } else {
        console.error("Error creating/updating patient profile:", error);
        res.status(500).json({ message: "Failed to create/update patient profile" });
      }
    }
  });

  // Contact messages routes
  app.post('/api/contact', async (req, res) => {
    try {
      const messageData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid contact data", errors: error.errors });
      } else {
        console.error("Error creating contact message:", error);
        res.status(500).json({ message: "Failed to send message" });
      }
    }
  });

  app.get('/api/contact', isAuthenticated, async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      res.status(500).json({ message: "Failed to fetch contact messages" });
    }
  });

  // Dashboard stats routes
  app.get('/api/dashboard/stats', isAuthenticated, async (req, res) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const todayAppointments = await storage.getAppointmentsByDate(today);
      const allAppointments = await storage.getAppointments();
      
      // Calculate basic stats
      const stats = {
        todayAppointments: todayAppointments.length,
        totalAppointments: allAppointments.length,
        completedAppointments: allAppointments.filter(a => a.status === 'completed').length,
        cancelledAppointments: allAppointments.filter(a => a.status === 'cancelled').length,
      };
      
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Analytics routes
  app.get('/api/analytics', isAuthenticated, async (req, res) => {
    try {
      const appointments = await storage.getAppointments();
      const services = await storage.getServices();
      
      // Calculate overview metrics
      const totalAppointments = appointments.length;
      const completedAppointments = appointments.filter(apt => apt.status === 'completed').length;
      const cancelledAppointments = appointments.filter(apt => apt.status === 'cancelled').length;
      const completionRate = totalAppointments > 0 ? Math.round((completedAppointments / totalAppointments) * 100) : 0;
      const cancellationRate = totalAppointments > 0 ? Math.round((cancelledAppointments / totalAppointments) * 100) : 0;
      
      // Calculate revenue
      const totalRevenue = appointments
        .filter(apt => apt.status === 'completed')
        .reduce((sum, apt) => {
          const service = services.find(s => s.id === apt.serviceId);
          return sum + (service ? parseFloat(service.price) : 0);
        }, 0);

      // Service statistics
      const serviceStats = services.map(service => {
        const serviceAppointments = appointments.filter(apt => apt.serviceId === service.id);
        const serviceRevenue = serviceAppointments
          .filter(apt => apt.status === 'completed')
          .length * parseFloat(service.price);
        
        return {
          serviceName: service.name,
          bookingCount: serviceAppointments.length,
          revenue: serviceRevenue,
          averageDuration: service.duration
        };
      });

      // Monthly stats (last 6 months)
      const monthlyStats = [];
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        const monthAppointments = appointments.filter(apt => {
          const aptDate = new Date(apt.appointmentDate);
          return aptDate.getMonth() === date.getMonth() && aptDate.getFullYear() === date.getFullYear();
        });
        
        const monthRevenue = monthAppointments
          .filter(apt => apt.status === 'completed')
          .reduce((sum, apt) => {
            const service = services.find(s => s.id === apt.serviceId);
            return sum + (service ? parseFloat(service.price) : 0);
          }, 0);

        monthlyStats.push({
          month: monthName,
          appointments: monthAppointments.length,
          revenue: monthRevenue,
          newPatients: monthAppointments.length
        });
      }

      // Appointment status breakdown
      const appointmentStatusBreakdown = {
        scheduled: appointments.filter(apt => apt.status === 'scheduled').length,
        confirmed: appointments.filter(apt => apt.status === 'confirmed').length,
        completed: completedAppointments,
        cancelled: cancelledAppointments
      };

      const analyticsData = {
        overview: {
          totalAppointments,
          totalPatients: appointments.length,
          totalRevenue,
          averageAppointmentDuration: services.reduce((sum, s) => sum + s.duration, 0) / services.length || 0,
          completionRate,
          cancellationRate
        },
        monthlyStats,
        serviceStats,
        appointmentStatusBreakdown
      };

      res.json(analyticsData);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Medical records routes
  app.get('/api/patients/:patientId/medical-records', isAuthenticated, async (req, res) => {
    try {
      const { patientId } = req.params;
      const records = await storage.getPatientMedicalRecords(parseInt(patientId));
      res.json(records);
    } catch (error) {
      console.error("Error fetching medical records:", error);
      res.status(500).json({ message: "Failed to fetch medical records" });
    }
  });

  app.post('/api/medical-records', isAuthenticated, async (req, res) => {
    try {
      const recordData = insertMedicalRecordSchema.parse(req.body);
      const record = await storage.createMedicalRecord(recordData);
      res.status(201).json(record);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid medical record data", errors: error.errors });
      } else {
        console.error("Error creating medical record:", error);
        res.status(500).json({ message: "Failed to create medical record" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
