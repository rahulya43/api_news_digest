import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Onboarding = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    interests: [],
    keywords: '',
    delivery: 'email',
    digestTime: '08:00'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const interestOptions = [
    'Technology', 'Business', 'Science', 'Health', 'Politics', 
    'Sports', 'Entertainment', 'Environment', 'Finance', 'Education'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const keywordsArray = formData.keywords.split(',').map(k => k.trim()).filter(k => k);
      
      const response = await axios.post('http://localhost:4000/api/user', {
        ...formData,
        keywords: keywordsArray
      });
      
      if (response.data.success) {
        localStorage.setItem('userId', response.data.user._id);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error creating account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Your News Digest</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Your Interests
            </label>
            <div className="grid grid-cols-2 gap-2">
              {interestOptions.map(interest => (
                <label key={interest} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.interests.includes(interest)}
                    onChange={() => handleInterestToggle(interest)}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{interest}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Keywords (comma-separated)
            </label>
            <input
              type="text"
              name="keywords"
              value={formData.keywords}
              onChange={handleInputChange}
              placeholder="AI, machine learning, startups"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Method
            </label>
            <select
              name="delivery"
              value={formData.delivery}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="email">Email</option>
              <option value="web">Web Only</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Digest Time
            </label>
            <input
              type="time"
              name="digestTime"
              value={formData.digestTime}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
