import React, { useState } from 'react';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  AcademicCapIcon,
  IdentificationIcon,
  WalletIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Button from '../common/Button';

const AddDoctor = ({ onDoctorAdded, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialty: '',
    licenseNumber: '',
    walletAddress: '',
    experience: '',
    qualifications: '',
    bio: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const specialties = [
    'Cardiology',
    'Dermatology',
    'Endocrinology',
    'Gastroenterology',
    'Hematology',
    'Infectious Disease',
    'Internal Medicine',
    'Nephrology',
    'Neurology',
    'Oncology',
    'Orthopedics',
    'Pediatrics',
    'Psychiatry',
    'Pulmonology',
    'Radiology',
    'Surgery',
    'Urology',
    'Other'
  ];

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (!formData.specialty) {
      newErrors.specialty = 'Specialty is required';
    }
    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = 'License number is required';
    }
    if (!formData.walletAddress.trim()) {
      newErrors.walletAddress = 'Wallet address is required';
    } else if (!/^0x[a-fA-F0-9]{40}$/.test(formData.walletAddress)) {
      newErrors.walletAddress = 'Invalid Ethereum wallet address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const doctorData = {
        ...formData,
        id: `doc_${Date.now()}`,
        status: 'Active',
        joinDate: new Date().toISOString(),
        totalPatients: 0,
        totalRecords: 0,
        rating: 0
      };

      onDoctorAdded(doctorData);
    } catch (error) {
      console.error('Error adding doctor:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const InputField = ({ 
    name, 
    label, 
    type = 'text', 
    placeholder, 
    icon: Icon, 
    required = false,
    options = null 
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        
        {options ? (
          <select
            name={name}
            value={formData[name]}
            onChange={handleInputChange}
            className={`
              block w-full rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
              ${Icon ? 'pl-10 pr-4' : 'px-4'}
              ${errors[name] 
                ? 'border-red-300 focus:border-red-500' 
                : 'border-gray-300 focus:border-blue-500'
              }
              py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white
            `}
          >
            <option value="">Select {label}</option>
            {options.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={formData[name]}
            onChange={handleInputChange}
            placeholder={placeholder}
            className={`
              block w-full rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
              ${Icon ? 'pl-10 pr-4' : 'px-4'}
              ${errors[name] 
                ? 'border-red-300 focus:border-red-500' 
                : 'border-gray-300 focus:border-blue-500'
              }
              py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white
            `}
          />
        )}
      </div>
      
      {errors[name] && (
        <div className="flex items-center space-x-1 text-red-600 text-sm">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <span>{errors[name]}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
          <UserIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Add New Doctor
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Fill in the doctor's information to register them in the system
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Personal Information
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              name="firstName"
              label="First Name"
              placeholder="Enter first name"
              icon={UserIcon}
              required
            />
            <InputField
              name="lastName"
              label="Last Name"
              placeholder="Enter last name"
              icon={UserIcon}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              name="email"
              label="Email Address"
              type="email"
              placeholder="doctor@hospital.com"
              icon={EnvelopeIcon}
              required
            />
            <InputField
              name="phone"
              label="Phone Number"
              type="tel"
              placeholder="+1 (555) 123-4567"
              icon={PhoneIcon}
              required
            />
          </div>
        </div>

        {/* Professional Information */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Professional Information
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              name="specialty"
              label="Specialty"
              options={specialties}
              required
            />
            <InputField
              name="licenseNumber"
              label="License Number"
              placeholder="MD-2024-001"
              icon={IdentificationIcon}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              name="experience"
              label="Years of Experience"
              type="number"
              placeholder="5"
              icon={AcademicCapIcon}
            />
            <InputField
              name="walletAddress"
              label="Wallet Address"
              placeholder="0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
              icon={WalletIcon}
              required
            />
          </div>

          <InputField
            name="qualifications"
            label="Qualifications"
            placeholder="MD, PhD, Board Certified..."
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Brief professional biography..."
              rows={3}
              className="block w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors focus:outline-none"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isSubmitting}
            icon={isSubmitting ? null : <CheckCircleIcon className="w-5 h-5" />}
          >
            {isSubmitting ? 'Adding Doctor...' : 'Add Doctor'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddDoctor;
