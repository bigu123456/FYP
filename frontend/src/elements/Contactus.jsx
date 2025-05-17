import React from "react";
<<<<<<< HEAD
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaLinkedin, FaClock } from "react-icons/fa";
=======
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Contact = () => {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 lg:px-16 py-16">
        <div className="text-center mb-12">
<<<<<<< HEAD
          <h2 className="text-4xl font-bold text-gray-800">Contact Us</h2>
          <p className="text-gray-600 mt-2 text-lg">
            Reach out to our team. We’re here to help you with anything.
=======
          <h2 className="text-3xl font-bold text-gray-800">Contact Us</h2>
          <p className="text-gray-600 mt-2">
            Have questions? Get in touch with us.
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
<<<<<<< HEAD
          {/* General Contact Info */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Head Office</h3>
            <div className="space-y-4 text-[17px]">
              <div className="flex items-center gap-4">
                <FaPhoneAlt className="text-[#F34900]" />
                <p className="text-gray-700">+977 9800000000 / 01-5555555</p>
              </div>
              <div className="flex items-center gap-4">
                <FaEnvelope className="text-[#F34900]" />
                <p className="text-gray-700">info@yourcompany.com</p>
              </div>
              <div className="flex items-start gap-4">
                <FaMapMarkerAlt className="text-[#F34900] mt-1" />
                <p className="text-gray-700">Sundhara, Kathmandu, Nepal</p>
              </div>
              <div className="flex items-center gap-4">
                <FaClock className="text-[#F34900]" />
                <p className="text-gray-700">Sunday - Friday: 9 AM to 6 PM</p>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-8">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Follow Us</h4>
              <div className="flex space-x-6">
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-[#F34900] hover:text-[#d93d00]">
                  <FaFacebook className="text-2xl" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-[#F34900] hover:text-[#d93d00]">
                  <FaTwitter className="text-2xl" />
                </a>
                <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[#F34900] hover:text-[#d93d00]">
=======
          {/* Contact Info */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Get in Touch</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <FaPhoneAlt className="text-[#F34900] text-xl" />
                <p className="text-gray-700">+977 9800000000</p>
              </div>
              <div className="flex items-center gap-4">
                <FaEnvelope className="text-[#F34900] text-xl" />
                <p className="text-gray-700">contact@yourwebsite.com</p>
              </div>
              <div className="flex items-start gap-4">
                <FaMapMarkerAlt className="text-[#F34900] text-xl" />
                <p className="text-gray-700">Kathmandu, Nepal</p>
              </div>

              {/* Social Media Links */}
              <div className="flex space-x-6 mt-6">
                <a href="https://www.facebook.com/yourprofile" className="text-[#F34900] hover:text-[#d93d00] transition-all">
                  <FaFacebook className="text-2xl" />
                </a>
                <a href="https://twitter.com/yourprofile" className="text-[#F34900] hover:text-[#d93d00] transition-all">
                  <FaTwitter className="text-2xl" />
                </a>
                <a href="https://www.linkedin.com/in/yourprofile" className="text-[#F34900] hover:text-[#d93d00] transition-all">
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
                  <FaLinkedin className="text-2xl" />
                </a>
              </div>
            </div>
          </div>

<<<<<<< HEAD
          {/* Department Contacts */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Department Contacts</h3>
            <div className="space-y-6 text-[17px]">
              <div>
                <p className="font-semibold text-gray-800">Customer Support</p>
                <p className="text-gray-700">support@yourcompany.com</p>
                <p className="text-gray-700">+977 9801111111</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Driver Services</p>
                <p className="text-gray-700">drivers@yourcompany.com</p>
                <p className="text-gray-700">+977 9802222222</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Vehicle Maintenance</p>
                <p className="text-gray-700">maintenance@yourcompany.com</p>
                <p className="text-gray-700">+977 9803333333</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Business Inquiries</p>
                <p className="text-gray-700">partners@yourcompany.com</p>
                <p className="text-gray-700">+977 9804444444</p>
              </div>
            </div>
          </div>
        </div>
      </div>
=======
          {/* Contact Form */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Send a Message</h3>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#F34900] outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#F34900] outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Message</label>
                <textarea
                  rows="4"
                  placeholder="Write your message..."
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#F34900] outline-none"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-[#F34900] text-white font-semibold py-2 rounded-md hover:bg-[#d93d00] transition-all"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
      <Footer />
    </div>
  );
};

export default Contact;
