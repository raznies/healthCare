import { MailService } from '@sendgrid/mail';
import type { Appointment, Service, Patient, User } from '@shared/schema';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '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';

if (!SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

const mailService = new MailService();
mailService.setApiKey(SENDGRID_API_KEY);

interface AppointmentEmailData {
  appointment: Appointment;
  patient: Patient;
  user: User;
  service: Service;
}

export async function sendAppointmentConfirmation(data: AppointmentEmailData): Promise<boolean> {
  try {
    const { appointment, patient, user, service } = data;
    
    const appointmentDate = new Date(appointment.appointmentDate).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563EB; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f8f9fa; }
        .appointment-details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        .button { background: #2563EB; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Dr. Anjali Dental Care</h1>
          <p>Appointment Confirmation</p>
        </div>
        
        <div class="content">
          <h2>Hello ${user.firstName || 'Patient'},</h2>
          
          <p>Your appointment has been successfully scheduled. Here are the details:</p>
          
          <div class="appointment-details">
            <h3>Appointment Details</h3>
            <p><strong>Service:</strong> ${service.name}</p>
            <p><strong>Date:</strong> ${appointmentDate}</p>
            <p><strong>Time:</strong> ${appointment.appointmentTime}</p>
            <p><strong>Duration:</strong> ${service.duration} minutes</p>
            <p><strong>Price:</strong> ₹${service.price}</p>
            <p><strong>Status:</strong> ${appointment.status}</p>
          </div>
          
          <h3>Important Information:</h3>
          <ul>
            <li>Please arrive 15 minutes before your appointment time</li>
            <li>Bring a valid ID and any previous medical records</li>
            <li>If you need to reschedule, please contact us at least 24 hours in advance</li>
          </ul>
          
          <h3>Contact Information:</h3>
          <p>📍 123 Main Street, City Name, 123456</p>
          <p>📞 +91 98765 43210</p>
          <p>✉️ contact@dranjalidental.clinic</p>
        </div>
        
        <div class="footer">
          <p>Thank you for choosing Dr. Anjali Dental Care</p>
          <p>This is an automated confirmation email.</p>
        </div>
      </div>
    </body>
    </html>
    `;

    const text = `
    Dr. Anjali Dental Care - Appointment Confirmation
    
    Hello ${user.firstName || 'Patient'},
    
    Your appointment has been successfully scheduled.
    
    Appointment Details:
    - Service: ${service.name}
    - Date: ${appointmentDate}
    - Time: ${appointment.appointmentTime}
    - Duration: ${service.duration} minutes
    - Price: ₹${service.price}
    - Status: ${appointment.status}
    
    Important Information:
    - Please arrive 15 minutes before your appointment time
    - Bring a valid ID and any previous medical records
    - If you need to reschedule, please contact us at least 24 hours in advance
    
    Contact: +91 98765 43210 | contact@dranjalidental.clinic
    
    Thank you for choosing Dr. Anjali Dental Care!
    `;

    await mailService.send({
      to: user.email!,
      from: {
        email: 'noreply@dranjalidental.clinic',
        name: 'Dr. Anjali Dental Care'
      },
      subject: `Appointment Confirmed - ${appointmentDate} at ${appointment.appointmentTime}`,
      text,
      html,
    });

    console.log('Appointment confirmation email sent successfully to:', user.email);
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

export async function sendAppointmentReminder(data: AppointmentEmailData): Promise<boolean> {
  try {
    const { appointment, patient, user, service } = data;
    
    const appointmentDate = new Date(appointment.appointmentDate).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #F59E0B; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f8f9fa; }
        .appointment-details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Dr. Anjali Dental Care</h1>
          <p>Appointment Reminder</p>
        </div>
        
        <div class="content">
          <h2>Hello ${user.firstName || 'Patient'},</h2>
          
          <p>This is a friendly reminder about your upcoming appointment:</p>
          
          <div class="appointment-details">
            <h3>Tomorrow's Appointment</h3>
            <p><strong>Service:</strong> ${service.name}</p>
            <p><strong>Date:</strong> ${appointmentDate}</p>
            <p><strong>Time:</strong> ${appointment.appointmentTime}</p>
            <p><strong>Duration:</strong> ${service.duration} minutes</p>
          </div>
          
          <p>Please remember to arrive 15 minutes early and bring any necessary documents.</p>
          
          <p>If you need to reschedule, please contact us immediately at +91 98765 43210.</p>
        </div>
        
        <div class="footer">
          <p>Dr. Anjali Dental Care</p>
          <p>contact@dranjalidental.clinic | +91 98765 43210</p>
        </div>
      </div>
    </body>
    </html>
    `;

    await mailService.send({
      to: user.email!,
      from: {
        email: 'noreply@dranjalidental.clinic',
        name: 'Dr. Anjali Dental Care'
      },
      subject: `Reminder: Your appointment tomorrow at ${appointment.appointmentTime}`,
      html,
    });

    console.log('Appointment reminder email sent successfully to:', user.email);
    return true;
  } catch (error) {
    console.error('SendGrid reminder email error:', error);
    return false;
  }
}