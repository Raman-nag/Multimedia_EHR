import React, { useState } from 'react';
import { ClipboardDocumentListIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Button from '../common/Button';

const PrescriptionForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    patientWalletAddress: '',
    medication: '',
    dosage: '',
    instructions: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((r) => setTimeout(r, 800));
      if (onSubmit) onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-4">
          <ClipboardDocumentListIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Write Prescription</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Create and save a new prescription</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Patient Wallet Address</label>
          <input
            type="text"
            name="patientWalletAddress"
            value={formData.patientWalletAddress}
            onChange={handleChange}
            placeholder="0x..."
            className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Medication</label>
            <input
              type="text"
              name="medication"
              value={formData.medication}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Dosage</label>
            <input
              type="text"
              name="dosage"
              value={formData.dosage}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Instructions</label>
          <textarea
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            required
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button type="submit" loading={isSubmitting} icon={isSubmitting ? null : <CheckCircleIcon className="w-5 h-5" /> }>
            {isSubmitting ? 'Saving…' : 'Save Prescription'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PrescriptionForm;


