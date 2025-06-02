import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Services() {
  const serviceCategories = [
    {
      title: "General Dentistry",
      services: [
        { name: "Regular Dental Checkup", price: "₹800" },
        { name: "Professional Teeth Cleaning", price: "₹1,500" },
        { name: "Dental Filling (per tooth)", price: "₹1,200" },
        { name: "Tooth Extraction", price: "₹1,000" }
      ]
    },
    {
      title: "Cosmetic Dentistry",
      services: [
        { name: "Teeth Whitening", price: "₹8,000" },
        { name: "Dental Veneers (per tooth)", price: "₹15,000" },
        { name: "Smile Makeover", price: "₹50,000+" },
        { name: "Composite Bonding", price: "₹3,000" }
      ]
    },
    {
      title: "Restorative Dentistry",
      services: [
        { name: "Root Canal Treatment", price: "₹5,000" },
        { name: "Dental Crown", price: "₹8,000" },
        { name: "Dental Bridge", price: "₹15,000" },
        { name: "Dental Implant", price: "₹25,000" }
      ]
    },
    {
      title: "Specialized Care",
      services: [
        { name: "Pediatric Dental Checkup", price: "₹600" },
        { name: "Orthodontic Consultation", price: "₹1,000" },
        { name: "Emergency Treatment", price: "₹2,000" },
        { name: "Gum Treatment", price: "₹3,500" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Dental Services</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive dental care services using advanced technology and proven techniques to ensure optimal oral health for you and your family.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {serviceCategories.map((category, categoryIndex) => (
              <Card key={categoryIndex} className="bg-gray-50">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900">{category.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {category.services.map((service, serviceIndex) => (
                    <div key={serviceIndex} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
                      <span className="text-gray-700">{service.name}</span>
                      <Badge variant="secondary" className="text-primary font-semibold">
                        {service.price}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Advanced Equipment Showcase */}
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Advanced Technology</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  We use state-of-the-art equipment to ensure precise, comfortable, and effective treatment.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Digital X-Ray",
                    description: "Instant, high-quality images with 90% less radiation",
                    image: "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
                  },
                  {
                    title: "Laser Dentistry",
                    description: "Painless, precise treatment with faster healing",
                    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
                  },
                  {
                    title: "Intraoral Camera",
                    description: "Clear view of your teeth for better diagnosis",
                    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
                  }
                ].map((tech, index) => (
                  <div key={index} className="text-center">
                    <img 
                      src={tech.image} 
                      alt={tech.title} 
                      className="rounded-xl shadow-lg w-full h-48 object-cover mb-4"
                    />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{tech.title}</h3>
                    <p className="text-sm text-gray-600">{tech.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
