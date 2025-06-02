import { Card, CardContent } from "@/components/ui/card";
import { Award, GraduationCap, Users, CheckCircle } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold text-gray-900">About Dr. Anjali Gupta</h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                With over 15 years of dedicated service in dentistry, Dr. Anjali Gupta has established herself as a trusted dental professional in the community. She completed her Bachelor of Dental Surgery (BDS) from the prestigious Delhi University and further specialized in Endodontics.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Dr. Anjali believes in providing personalized, gentle care to each patient. Her practice focuses on preventive dentistry while offering comprehensive treatment options using the latest technology and techniques.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Dr. Anjali Gupta - Professional Dentist" 
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto mb-4">
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Education</h3>
                <p className="text-gray-600">BDS from Delhi University<br />Post-graduation in Endodontics</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Experience</h3>
                <p className="text-gray-600">15+ Years of Practice<br />5000+ Satisfied Patients</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Specializations</h3>
                <p className="text-gray-600">Root Canal Treatment<br />Cosmetic Dentistry</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Clinic Information */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Modern Clinic</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Experience dental care in a state-of-the-art facility designed for your comfort and safety.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Modern dental clinic reception" 
                className="rounded-2xl shadow-lg w-full h-auto"
              />
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">State-of-the-Art Facility</h3>
              <p className="text-gray-600 leading-relaxed">
                Our clinic features the latest dental technology including digital X-rays, intraoral cameras, and laser dentistry equipment. Every treatment room is equipped with modern dental units and sterilization systems to ensure the highest standards of care and safety.
              </p>
              <ul className="space-y-3">
                {[
                  "Digital X-ray Systems",
                  "Laser Dentistry Equipment",
                  "Advanced Sterilization",
                  "Comfortable Patient Areas"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
