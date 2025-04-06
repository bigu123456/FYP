import React from 'react';
import Navbar from "../components/Navbar";
import Footer from '../components/Footer';

const AboutUs = () => {
  return (
    <div>
      <Navbar />
      <div className="bg-gray-100">
        {/* Header */}
        <header className="bg-[#FF7F32] text-white py-8 text-center">
          <h1 className="text-4xl font-bold">About Us</h1>
        </header>

        {/* Who We Are Section */}
        <section className="py-16 text-center">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-semibold mb-6">Who We Are</h2>
            <p className="text-lg text-[#333333]">
              We are a passionate team dedicated to delivering the best solutions in the industry. Our goal is to provide high-quality products and services that exceed our customers' expectations. With years of experience and a deep commitment to innovation, we aim to make a lasting impact on the market.
            </p>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className="bg-white py-16 text-center">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-semibold mb-6">Our Mission</h2>
            <p className="text-lg text-[#333333]">
              Our mission is to build meaningful relationships with our clients by providing exceptional services that meet their needs and enhance their experiences. We strive to be a trusted partner, ensuring each project we undertake is executed to perfection.
            </p>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 text-center">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-semibold mb-8">Meet Our Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Team Member 1 */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <img
                  src="https://via.placeholder.com/150"
                  alt="John Doe"
                  className="w-32 h-32 rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">John Doe</h3>
                <p className="text-[#333333]">CEO & Founder</p>
              </div>

              {/* Team Member 2 */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Jane Smith"
                  className="w-32 h-32 rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">Jane Smith</h3>
                <p className="text-[#333333]">Lead Developer</p>
              </div>

              {/* Team Member 3 */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Michael Johnson"
                  className="w-32 h-32 rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">Michael Johnson</h3>
                <p className="text-[#333333]">Marketing Manager</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default AboutUs;
