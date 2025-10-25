import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheckIcon, 
  UserGroupIcon, 
  CloudIcon, 
  LockClosedIcon,
  ArrowRightIcon,
  CheckBadgeIcon,
  HeartIcon,
  DocumentTextIcon,
  UserIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Secure Healthcare Records on{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Blockchain
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Revolutionizing healthcare with immutable, secure, and patient-controlled medical records 
              powered by blockchain technology and decentralized storage.
            </p>
            
            {/* Animated Hero Illustration */}
            <div className="relative mb-12">
              <div className="flex justify-center items-center space-x-8">
                {/* Medical Records */}
                <div className="animate-pulse">
                  <div className="bg-white rounded-lg shadow-xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                    <DocumentTextIcon className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                    <div className="text-sm font-semibold text-gray-700">Medical Records</div>
                  </div>
                </div>
                
                {/* Blockchain Chain */}
                <div className="flex space-x-2">
                  {[1, 2, 3, 4].map((block) => (
                    <div 
                      key={block}
                      className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg animate-bounce"
                      style={{ animationDelay: `${block * 0.1}s` }}
                    />
                  ))}
                </div>
                
                {/* Patient Control */}
                <div className="animate-pulse">
                  <div className="bg-white rounded-lg shadow-xl p-6 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                    <UserIcon className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    <div className="text-sm font-semibold text-gray-700">Patient Control</div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Get Started
                <ArrowRightIcon className="inline-block w-5 h-5 ml-2" />
              </Link>
              <Link 
                to="#how-it-works" 
                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-600 hover:text-white transition-all duration-300"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built with cutting-edge blockchain technology to ensure the highest standards of security and privacy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="text-center group">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheckIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure & Immutable Records</h3>
              <p className="text-gray-600">
                Medical records are stored on blockchain, making them tamper-proof and permanently secure.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center group">
              <div className="bg-gradient-to-r from-green-500 to-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <LockClosedIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Patient Privacy & Control</h3>
              <p className="text-gray-600">
                Patients have complete control over their data and can grant access to healthcare providers.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center group">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <UserGroupIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Seamless Collaboration</h3>
              <p className="text-gray-600">
                Doctors, hospitals, and patients can collaborate efficiently with secure data sharing.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center group">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <CloudIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Decentralized Storage</h3>
              <p className="text-gray-600">
                Files and multimedia content are stored on IPFS for redundancy and accessibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, secure, and efficient process for managing healthcare records on the blockchain.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BuildingOfficeIcon className="h-8 w-8 text-white" />
                </div>
                <div className="bg-blue-100 text-blue-800 text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
                  Step 1
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Hospital Onboards Doctors</h3>
                <p className="text-gray-600">
                  Hospitals register and verify doctors, creating a trusted network of healthcare professionals.
                </p>
              </div>
              {/* Arrow */}
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                <ArrowRightIcon className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="bg-gradient-to-r from-green-500 to-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <DocumentTextIcon className="h-8 w-8 text-white" />
                </div>
                <div className="bg-green-100 text-green-800 text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
                  Step 2
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Doctors Create Patient Records</h3>
                <p className="text-gray-600">
                  Verified doctors create and update patient medical records with multimedia support.
                </p>
              </div>
              {/* Arrow */}
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                <ArrowRightIcon className="h-8 w-8 text-green-500" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <UserIcon className="h-8 w-8 text-white" />
                </div>
                <div className="bg-purple-100 text-purple-800 text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
                  Step 3
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Patients Access Complete History</h3>
                <p className="text-gray-600">
                  Patients can view their complete medical history and grant access to other healthcare providers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">Multimedia EHR</h3>
              <p className="text-gray-400 mb-6 max-w-md">
                Revolutionizing healthcare with blockchain technology. Secure, immutable, and patient-controlled medical records.
              </p>
              <div className="flex items-center space-x-2">
                <CheckBadgeIcon className="h-6 w-6 text-green-400" />
                <span className="text-sm text-gray-400">Blockchain Verified</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/login" className="text-gray-400 hover:text-white transition-colors">Login</Link></li>
                <li><Link to="/register" className="text-gray-400 hover:text-white transition-colors">Register</Link></li>
                <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 Multimedia EHR. All rights reserved.
              </p>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <div className="flex items-center space-x-2">
                  <HeartIcon className="h-5 w-5 text-red-500" />
                  <span className="text-sm text-gray-400">Made with care for healthcare</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
