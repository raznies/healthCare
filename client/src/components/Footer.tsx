import { Link } from "wouter";
import { Torus, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-primary text-white p-2 rounded-lg">
                <Torus className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold">Dr. Anjali Dental Care</span>
            </div>
            <p className="text-gray-400">
              Providing exceptional dental care with advanced technology and a patient-centered approach.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/services" className="hover:text-white transition-colors">General Dentistry</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Root Canal</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Cosmetic Dentistry</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Dental Implants</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/patient-portal" className="hover:text-white transition-colors">Book Appointment</Link></li>
              <li><Link href="/patient-portal" className="hover:text-white transition-colors">Patient Portal</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Emergency Care</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>123 Main Street, Sector 15, Gurgaon</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>info@dranjali.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Dr. Anjali Dental Care. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
