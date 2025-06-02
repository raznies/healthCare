import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Service {
  id: number;
  name: string;
  price: string;
  duration: number;
}

export default function BookingModal({ open, onOpenChange }: BookingModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    patientName: "",
    patientEmail: "",
    patientPhone: "",
    serviceId: "",
    appointmentDate: "",
    appointmentTime: "",
    notes: "",
  });

  // Fetch services
  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["/api/services"],
    retry: false,
  });

  // Book appointment mutation
  const bookingMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await apiRequest("POST", "/api/appointments", {
        ...data,
        serviceId: parseInt(data.serviceId),
      });
    },
    onSuccess: () => {
      toast({
        title: "Appointment Booked",
        description: "Your appointment has been scheduled successfully. We'll confirm within 2 hours.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      onOpenChange(false);
      setFormData({
        patientName: "",
        patientEmail: "",
        patientPhone: "",
        serviceId: "",
        appointmentDate: "",
        appointmentTime: "",
        notes: "",
      });
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: "Failed to book appointment. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.patientName || !formData.patientEmail || !formData.patientPhone || 
        !formData.serviceId || !formData.appointmentDate || !formData.appointmentTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    bookingMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Generate time slots
  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
  ];

  // Get minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Book Appointment
          </DialogTitle>
          <DialogDescription>
            Fill in your details to schedule an appointment with Dr. Anjali Dental Care.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="patientName">Full Name *</Label>
              <Input 
                id="patientName"
                value={formData.patientName}
                onChange={(e) => handleInputChange("patientName", e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patientPhone">Phone Number *</Label>
              <Input 
                id="patientPhone"
                type="tel"
                value={formData.patientPhone}
                onChange={(e) => handleInputChange("patientPhone", e.target.value)}
                placeholder="+91 98765 43210"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="patientEmail">Email Address *</Label>
            <Input 
              id="patientEmail"
              type="email"
              value={formData.patientEmail}
              onChange={(e) => handleInputChange("patientEmail", e.target.value)}
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="serviceId">Select Service *</Label>
            <Select value={formData.serviceId} onValueChange={(value) => handleInputChange("serviceId", value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Choose a service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id.toString()}>
                    {service.name} - {service.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="appointmentDate">Preferred Date *</Label>
              <Input 
                id="appointmentDate"
                type="date"
                value={formData.appointmentDate}
                onChange={(e) => handleInputChange("appointmentDate", e.target.value)}
                min={minDate}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="appointmentTime">Preferred Time *</Label>
              <Select value={formData.appointmentTime} onValueChange={(value) => handleInputChange("appointmentTime", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea 
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Any specific concerns or requests..."
              rows={3}
            />
          </div>

          <div className="flex space-x-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={bookingMutation.isPending} className="flex-1">
              {bookingMutation.isPending ? "Booking..." : "Book Appointment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
