import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Car, Clock, Users, ShieldCheck } from "lucide-react";

// Local image imports
import serviceHero from "../images/service-hero.jpg";
import selfDriveImg from "../images/self-drive.jpg";
import chauffeurImg from "../images/chauffeur.jpg";
import flexibleImg from "../images/flexible.jpg";
import maintenanceImg from "../images/maintenance.jpg";

const services = [
  {
    icon: <Car className="h-10 w-10 text-orange-500" />,
    title: "Self-Drive Rentals",
    description: "Rent a vehicle and drive it yourself for ultimate flexibility and convenience.",
    image: selfDriveImg,
  },
  {
    icon: <Users className="h-10 w-10 text-orange-500" />,
    title: "Chauffeur Service",
    description: "Enjoy a stress-free ride with our professional and experienced drivers.",
    image: chauffeurImg,
  },
  {
    icon: <Clock className="h-10 w-10 text-orange-500" />,
    title: " Daily / Long-term",
    description: "Flexible rental durations to suit your short trips or extended vacations.",
    image: flexibleImg,
  },
  {
    icon: <ShieldCheck className="h-10 w-10 text-orange-500" />,
    title: "Well-Maintained Vehicles",
    description: "All our vehicles go through regular maintenance checks for your safety and comfort.",
    image: maintenanceImg,
  },
];

const ServicePage = () => {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[40vh] bg-cover bg-center mb-8" style={{ backgroundImage: `url(${serviceHero})` }}>
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white">Our Services</h1>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <p className="text-gray-600 text-lg">
            Explore the range of services we offer to make your journey smooth and enjoyable.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition"
            >
              <img
                src={service.image}
                alt={service.title}
                className="rounded-lg mb-4 h-32 w-full object-cover"
              />
              <div className="flex justify-center mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                {service.title}
              </h3>
              <p className="text-sm text-gray-600 text-center">{service.description}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ServicePage;
