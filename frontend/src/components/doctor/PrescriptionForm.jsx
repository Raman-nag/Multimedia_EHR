import React, { useState } from 'react';
import { ClipboardDocumentListIcon, CheckCircleIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Button from '../common/Button';
import doctorService from '../../services/doctorService';

const PrescriptionForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    patientWalletAddress: '',
    title: '',
    notes: ''
  });
  const [items, setItems] = useState([{
    type: 'Tablet',
    customType: '',
    name: '',
    dosage: '',
    unit: 'mg',
    frequency: '',
    duration: '',
    instructions: ''
  }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payloadItems = items.map((it) => ({
        type: it.type === 'Other' ? (it.customType || 'Other') : it.type,
        name: it.name,
        dosage: it.dosage,
        unit: it.unit,
        frequency: it.frequency,
        duration: it.duration,
        instructions: it.instructions,
      }));
      const recordData = {
        diagnosis: formData.title || 'Prescription',
        symptoms: [],
        prescription: JSON.stringify(payloadItems),
        treatmentPlan: formData.notes || '',
        ipfsHash: JSON.stringify([]),
      };
      const res = await doctorService.createRecord(formData.patientWalletAddress, recordData, []);
      if (onSubmit) onSubmit({ ...formData, items: payloadItems, result: res });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addItem = () => {
    setItems((prev) => ([...prev, { type: 'Tablet', customType: '', name: '', dosage: '', unit: 'mg', frequency: '', duration: '', instructions: '' }]));
  };
  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };
  const updateItem = (index, field, value) => {
    setItems((prev) => prev.map((it, i) => i === index ? { ...it, [field]: value } : it));
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title (Diagnosis/Reason)</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Diagnosis or purpose of prescription"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes (optional)</label>
            <input
              type="text"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          {items.map((it, idx) => (
            <div key={idx} className="p-4 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium text-gray-900 dark:text-white">Item #{idx + 1}</div>
                {items.length > 1 && (
                  <button type="button" onClick={() => removeItem(idx)} className="inline-flex items-center px-2 py-1 text-xs border rounded-md text-red-600 border-red-300 hover:bg-red-50">
                    <TrashIcon className="w-4 h-4 mr-1" /> Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                  <select value={it.type} onChange={(e)=>updateItem(idx,'type',e.target.value)} className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2">
                    <option>Tablet</option>
                    <option>Capsule</option>
                    <option>Injection</option>
                    <option>Syrup</option>
                    <option>Tonic</option>
                    <option>Other</option>
                  </select>
                </div>
                {it.type === 'Other' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Custom Type</label>
                    <input value={it.customType} onChange={(e)=>updateItem(idx,'customType',e.target.value)} className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2" />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                  <input value={it.name} onChange={(e)=>updateItem(idx,'name',e.target.value)} className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-3">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Dosage</label>
                  <input value={it.dosage} onChange={(e)=>updateItem(idx,'dosage',e.target.value)} placeholder="500" className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Unit</label>
                  <select value={it.unit} onChange={(e)=>updateItem(idx,'unit',e.target.value)} className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2">
                    <option>mg</option>
                    <option>ml</option>
                    <option>IU</option>
                    <option>g</option>
                    <option>mcg</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Frequency</label>
                  <input value={it.frequency} onChange={(e)=>updateItem(idx,'frequency',e.target.value)} placeholder="2 times/day" className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Duration</label>
                  <input value={it.duration} onChange={(e)=>updateItem(idx,'duration',e.target.value)} placeholder="7 days" className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2" />
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Instructions</label>
                <textarea value={it.instructions} onChange={(e)=>updateItem(idx,'instructions',e.target.value)} rows={2} className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 resize-none" />
              </div>
            </div>
          ))}

          <button type="button" onClick={addItem} className="inline-flex items-center px-3 py-2 border border-dashed border-purple-300 rounded-lg text-sm font-medium text-purple-700 hover:bg-purple-50">
            <PlusIcon className="w-4 h-4 mr-2" /> Add Another Item
          </button>
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


