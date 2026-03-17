import React, { useState } from 'react';
import { addIssue } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { Issue } from '../types';
import { 
  AlertTriangle, 
  Camera, 
  CheckCircle, 
  X, 
  Upload,
  MapPin,
  Clock,
  Flag
} from 'lucide-react';

const ReportIssue: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: ''
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    { value: 'bin-full', label: 'Bin Full', icon: AlertTriangle, color: 'text-red-600 bg-red-100' },
    { value: 'access-blocked', label: 'Access Blocked', icon: MapPin, color: 'text-orange-600 bg-orange-100' },
    { value: 'hazard-safety', label: 'Hazard/Safety Risk', icon: Flag, color: 'text-red-600 bg-red-100' },
    { value: 'equipment-issue', label: 'Equipment Issue', icon: AlertTriangle, color: 'text-yellow-600 bg-yellow-100' },
    { value: 'other', label: 'Other', icon: Clock, color: 'text-gray-600 bg-gray-100' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    // Reset file input
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Issue title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Issue description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const newIssue: Issue = {
        id: Date.now().toString(),
        workerId: user?.workerId || '',
        title: formData.title,
        description: formData.description,
        category: formData.category,
        timestamp: new Date().toISOString(),
        photo: imagePreview || undefined
      };

      addIssue(newIssue);

      // Show success state
      setIsSubmitted(true);

      // Reset form after a delay
      setTimeout(() => {
        setFormData({ title: '', description: '', category: '' });
        setSelectedImage(null);
        setImagePreview(null);
        setIsSubmitted(false);
      }, 3000);

    } catch (error) {
      setErrors({ general: 'Failed to submit issue. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-500 via-teal-500 to-blue-600 rounded-2xl p-6 text-white">
          <h1 className="text-2xl sm:text-3xl font-bold">Issue Reported Successfully!</h1>
          <p className="text-green-100 mt-1">Your report has been submitted and will be reviewed shortly</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center">
          <div className="bg-green-100 p-4 rounded-full w-20 h-20 mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            Your issue has been logged and assigned a tracking ID. Our team will investigate and take appropriate action.
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-700">
              <strong>Tracking ID:</strong> ISS-{Date.now().toString().slice(-6)}
            </p>
            <p className="text-sm text-green-600 mt-1">
              You'll receive updates on the status of your report
            </p>
          </div>

          <button
            onClick={() => setIsSubmitted(false)}
            className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-600 hover:to-blue-700 transition-all duration-200"
          >
            Report Another Issue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 via-teal-500 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Report an Issue</h1>
            <p className="text-green-100 mt-1">Help us maintain a clean and safe environment</p>
          </div>
          <div className="hidden sm:block">
            <div className="bg-white bg-opacity-20 p-4 rounded-xl text-center">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-yellow-300" />
              <p className="text-sm text-green-100">Quick</p>
              <p className="text-xl font-bold">Report</p>
            </div>
          </div>
        </div>
      </div>

      {/* Report Form */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Issue Details</h2>
          <p className="text-sm text-gray-500 mt-1">Please provide as much detail as possible</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.general && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm">{errors.general}</span>
            </div>
          )}

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Issue Category *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {categories.map((category) => (
                <label
                  key={category.value}
                  className={`relative cursor-pointer rounded-lg border p-4 hover:bg-gray-50 transition-all duration-200 ${
                    formData.category === category.value
                      ? 'border-green-500 bg-green-50 ring-2 ring-green-500 ring-opacity-20'
                      : 'border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={category.value}
                    checked={formData.category === category.value}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${category.color}`}>
                      <category.icon className="h-5 w-5" />
                    </div>
                    <span className="font-medium text-gray-900">{category.label}</span>
                  </div>
                </label>
              ))}
            </div>
            {errors.category && <p className="mt-2 text-sm text-red-600">{errors.category}</p>}
          </div>

          {/* Issue Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Issue Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              placeholder="Brief description of the issue"
              className={`w-full px-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                errors.title
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
              }`}
              value={formData.title}
              onChange={handleInputChange}
            />
            {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Issue Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Description *
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              required
              placeholder="Provide detailed information about the issue, including location, urgency, and any relevant context..."
              className={`w-full px-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors resize-none ${
                errors.description
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
              }`}
              value={formData.description}
              onChange={handleInputChange}
            />
            {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description}</p>}
            <p className="mt-2 text-sm text-gray-500">
              {formData.description.length}/500 characters
            </p>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Photo (Optional)
            </label>
            
            {!imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <div className="bg-gray-100 p-3 rounded-full">
                    <Upload className="h-6 w-6 text-gray-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">Click to upload photo</p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                </label>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Issue preview"
                  className="w-full h-48 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-6">
            <p className="text-sm text-gray-500">
              * Required fields
            </p>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:from-green-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Submitting...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Submit Report</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Emergency Contact */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <div className="bg-red-100 p-2 rounded-full flex-shrink-0">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-red-900">Emergency Situations</h3>
            <p className="text-sm text-red-700 mt-1">
              For immediate safety hazards or emergencies, call the emergency hotline directly:
            </p>
            <p className="font-bold text-red-900 mt-2">📞 Emergency Hotline: +91-1234-567-890</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;