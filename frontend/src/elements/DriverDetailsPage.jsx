import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const DriverDetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Destructure state safely (might be undefined if user lands here directly)
  const { driver, vehicle } = location.state || {};

  useEffect(() => {
    if (!driver || !vehicle) {
      alert("Missing driver or vehicle data.");
      navigate(-1); // Go back if state is missing
    }
  }, [driver, vehicle, navigate]);

  if (!driver || !vehicle) return null;

  const handleProceedToOrder = () => {
    navigate(`/order/${vehicle.id}`, {
      state: { vehicle, driver },
    });
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page (Select Driver)
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li>
                <button 
                  onClick={() => navigate(-1)}
                  className="hover:text-orange-600 transition-colors"
                >
                  ← Back to Driver Selection
                </button>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-900 font-medium">Driver Details</li>
            </ol>
          </nav>

          {/* Main Card */}
          <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100">
            <div className="flex flex-col lg:flex-row">
              {/* Left - Image Section */}
              <div className="lg:w-2/5 w-full relative">
                {driver.image ? (
                  <div className="relative h-96 lg:h-full">
                    <img
                      src={`http://localhost:5000/uploads/${driver.image}`}
                      alt={driver.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    {/* Availability Badge */}
                    <div className="absolute top-6 left-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                        driver.availability 
                          ? "bg-green-100 text-green-800 border border-green-200" 
                          : "bg-red-100 text-red-800 border border-red-200"
                      }`}>
                        <span className={`w-2 h-2 rounded-full mr-2 ${
                          driver.availability ? "bg-green-500" : "bg-red-500"
                        }`}></span>
                        {driver.availability ? "Available" : "Not Available"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-96 lg:h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <div className="text-center">
                      <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-gray-500 text-lg font-medium">No Image Available</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Right - Details Section */}
              <div className="lg:w-3/5 w-full p-8 lg:p-12">
                {/* Header */}
                <div className="mb-8">
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">{driver.name}</h1>
                  <p className="text-lg text-gray-600">Professional Driver</p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center mb-2">
                      <svg className="h-5 w-5 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-600">Phone Number</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{driver.phone}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center mb-2">
                      <svg className="h-5 w-5 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-600">License Number</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 font-mono">{driver.license_number}</p>
                  </div>

                  <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                    <div className="flex items-center mb-2">
                      <svg className="h-5 w-5 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      <span className="text-sm font-medium text-gray-600">Daily Rate</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-600">₹{driver.price_per_day}</p>
                    <p className="text-sm text-gray-500">per day</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center mb-2">
                      <svg className="h-5 w-5 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-600">Current Status</span>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                      driver.availability 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {driver.availability ? "Ready to Drive" : "Currently Unavailable"}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">About the Driver</h3>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {driver.description || "Professional and experienced driver with excellent driving record and customer service skills."}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleProceedToOrder}
                    disabled={!driver.availability}
                    className={`flex-1 py-3 px-6 rounded-md font-semibold transition ${
                      driver.availability
                        ? "bg-orange-500 text-white hover:bg-orange-600"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {driver.availability ? "Proceed with this Driver" : "Driver Not Available"}
                  </button>
                  
                  <button
                    onClick={handleCancel}
                    className="flex-1 py-3 px-6 rounded-md font-semibold bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>

                {/* Trust Indicators */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified License
                    </div>
                    <div className="flex items-center">
                      <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Background Checked
                    </div>
                    <div className="flex items-center">
                      <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Insured
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default DriverDetailsPage;