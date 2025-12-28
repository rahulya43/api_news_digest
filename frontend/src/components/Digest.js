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
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-red-600 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Digest Available</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">Your Daily AI Digest</h1>
                <p className="text-blue-100">{formatDate(digest.date)}</p>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white"
              >
                Back to Dashboard
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Today's Top Stories</h2>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {digest.items.length} Articles
                </span>
              </div>
              
              <div className="space-y-6">
                {digest.items.map((item, index) => (
                  <div key={item.articleId} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {index + 1}. {item.title}
                        </h3>
                        
                        <div className="bg-gray-50 p-3 rounded-md mb-3">
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {item.summary}
                          </p>
                        </div>

                        {item.bullets && item.bullets.length > 0 && (
                          <div className="mb-3">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Points:</h4>
                            <ul className="space-y-1">
                              {item.bullets.map((bullet, bulletIndex) => (
                                <li key={bulletIndex} className="flex items-start">
                                  <span className="text-blue-600 mr-2 mt-1">•</span>
                                  <span className="text-sm text-gray-600">{bullet}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Read Full Article
                          <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">About Your Digest</h3>
                <p className="text-sm text-blue-800">
                  This digest was generated using AI to summarize the latest news articles based on your interests and keywords. 
                  The AI extracts key points and provides concise summaries to help you stay informed quickly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Digest;
