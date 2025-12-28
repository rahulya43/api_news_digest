import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Digest = () => {
  const [digest, setDigest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDigest = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/digest/today/${userId}`);
        if (response.data.success) {
          setDigest(response.data.digest);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setError('No digest found for today. Please generate a digest first.');
        } else {
          setError('Error fetching digest. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchDigest();
    }
  }, [userId]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your digest...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">{error}</div>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!digest) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 text-xl mb-4">No digest available for today</div>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Your Daily News Digest</h1>
              <p className="text-gray-600">{formatDate(digest.date)}</p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Back to Dashboard
            </button>
          </div>

          <div className="space-y-6">
            {digest.items.map((item, index) => (
              <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {item.title}
                  </a>
                </h3>
                
                {item.summary && (
                  <p className="text-gray-700 mb-3">{item.summary}</p>
                )}
                
                {item.bullets && item.bullets.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    {item.bullets.map((bullet, bulletIndex) => (
                      <li key={bulletIndex}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">About this Digest</h3>
          <p className="text-sm text-blue-800">
            This digest was generated using AI to summarize the latest news articles based on your interests and keywords. 
            The AI extracts key points and provides concise summaries to help you stay informed quickly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Digest;
