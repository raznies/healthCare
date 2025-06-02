import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Phone, Clock, CheckCircle, Users, Award, Star, Torus, Heart, Shield, Stethoscope } from "lucide-react";
import BookingModal from "@/components/BookingModal";

export default function Home() {
  const [showBookingModal, setShowBookingModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-primary/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Your Smile, Our Priority
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Experience exceptional dental care with Dr. Anjali Gupta. Over 15 years of expertise in modern dentistry, ensuring healthy smiles for the whole family.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={() => setShowBookingModal(true)}>
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Appointment
                </Button>
                <Button variant="outline" size="lg">
                  <Phone className="mr-2 h-5 w-5" />
                  Call Now
                </Button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">15+</div>
                  <div className="text-sm text-gray-600">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">5000+</div>
                  <div className="text-sm text-gray-600">Happy Patients</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">4.9★</div>
                  <div className="text-sm text-gray-600">Patient Rating</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Modern dental clinic interior" 
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
              <Card className="absolute -bottom-4 -left-4 bg-white shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Safe & Hygienic</div>
                      <div className="text-sm text-gray-600">Sterilized Equipment</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Booking Widget */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Book Your Appointment</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Choose your preferred date and time. Our team will confirm your appointment within 2 hours.</p>
          </div>

          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="p-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Ready to Schedule?</h3>
                <p className="text-gray-600 mb-6">Click below to open our booking system and select your preferred appointment time.</p>
                <Button size="lg" onClick={() => setShowBookingModal(true)}>
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Comprehensive dental care using the latest technology and techniques for optimal oral health.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Torus, title: "General Dentistry", desc: "Regular checkups, cleanings, and preventive care to maintain optimal oral health.", price: "₹800" },
              { icon: Stethoscope, title: "Root Canal Treatment", desc: "Pain-free root canal therapy using advanced techniques and modern equipment.", price: "₹5,000" },
              { icon: Heart, title: "Cosmetic Dentistry", desc: "Teeth whitening, veneers, and smile makeovers for a confident smile.", price: "₹3,000" },
              { icon: Shield, title: "Dental Implants", desc: "Permanent tooth replacement solutions with titanium implants.", price: "₹25,000" },
              { icon: Users, title: "Pediatric Dentistry", desc: "Gentle dental care for children in a friendly, comfortable environment.", price: "₹600" },
              { icon: Award, title: "Emergency Care", desc: "Immediate dental care for urgent situations and pain relief.", price: "24/7 Available" },
            ].map((service, index) => (
              <Card key={index} className="bg-white hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.desc}</p>
                  <Badge variant="secondary" className="text-primary">Starting from {service.price}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Patient Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Patients Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Read about the experiences of our satisfied patients who trust us with their dental care.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Priya Sharma", review: "Dr. Anjali made my root canal completely painless. The clinic is so clean and modern. Highly recommend!" },
              { name: "Rajesh Kumar", review: "Excellent service and very professional staff. My daughter feels comfortable during her checkups." },
              { name: "Meera Patel", review: "Amazing experience! The online booking made it so easy to schedule my appointment. Thank you!" },
            ].map((testimonial, index) => (
              <Card key={index} className="bg-white shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">"{testimonial.review}"</p>
                  <div className="flex items-center">
                    <div className="bg-gray-300 w-10 h-10 rounded-full mr-3"></div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">Verified Patient</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <BookingModal open={showBookingModal} onOpenChange={setShowBookingModal} />
    </div>
  );
}
