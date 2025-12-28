import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchingArticles, setFetchingArticles] = useState(false);
  const [summarizingArticles, setSummarizingArticles] = useState(false);
  const [generatingDigest, setGeneratingDigest] = useState(false);
  const [resettingSummaries, setResettingSummaries] = useState(false);
  const [clearingArticles, setClearingArticles] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/');
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/user/${userId}`);
        if (response.data.success) {
          setUser(response.data.user);
          localStorage.setItem('userId', response.data.user._id);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleFetchArticles = async () => {
    setFetchingArticles(true);
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.post('http://localhost:4000/api/article/fetch', { userId });
      if (response.data.success) {
        const saved = response.data.savedCount ?? 0;
        const fetched = response.data.fetchedCount ?? 0;
        const skipped = response.data.skippedCount ?? 0;
        const errors = response.data.errorCount ?? 0;
        alert(`Fetched ${fetched}. Saved ${saved}. Skipped ${skipped}. Errors ${errors}.`);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      alert('Error fetching articles');
    } finally {
      setFetchingArticles(false);
    }
  };

  const handleSummarizeArticles = async () => {
    setSummarizingArticles(true);
    try {
      const response = await axios.post('http://localhost:4000/api/article/summarize');
      if (response.data.success) {
        const pending = response.data.pending ?? 0;
        const summarized = response.data.summarized ?? 0;
        if (pending === 0) {
          alert('0 articles summarized (everything is already summarized).');
        } else {
          alert(`${summarized} / ${pending} articles summarized!`);
        }
      }
    } catch (error) {
      console.error('Error summarizing articles:', error);
      alert('Error summarizing articles');
    } finally {
      setSummarizingArticles(false);
    }
  };

  const handleGenerateDigest = async () => {
    const userId = localStorage.getItem('userId');
    setGeneratingDigest(true);
    try {
      const response = await axios.post(`http://localhost:4000/api/digest/regenerate/${userId}`);
      if (response.data.success) {
        if (!response.data.digest) {
          alert(response.data.message || 'No digest generated for today.');
          return;
        }
        const count = response.data.count ?? (response.data.digest?.items?.length ?? 0);
        alert(`Digest regenerated with ${count} articles!`);
        navigate(`/digest/${userId}`);
      }
    } catch (error) {
      console.error('Error generating digest:', error);
      alert('Error generating digest');
    } finally {
      setGeneratingDigest(false);
    }
  };

  const handleResetSummaries = async () => {
    setResettingSummaries(true);
    try {
      const response = await axios.post('http://localhost:4000/api/article/reset-summaries');
      if (response.data.success) {
        alert(`Reset ${response.data.resetCount} article summaries!`);
      }
    } catch (error) {
      console.error('Error resetting summaries:', error);
      alert('Error resetting summaries');
    } finally {
      setResettingSummaries(false);
    }
  };

  const handleClearArticles = async () => {
    setClearingArticles(true);
    try {
      const response = await axios.post('http://localhost:4000/api/article/clear-articles');
      if (response.data.success) {
        alert(`Cleared ${response.data.deletedCount} articles from database!`);
      }
    } catch (error) {
      console.error('Error clearing articles:', error);
      alert('Error clearing articles');
    } finally {
      setClearingArticles(false);
    }
  };

  const handleViewDigest = () => {
    const userId = localStorage.getItem('userId');
    navigate(`/digest/${userId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 flex flex-col">
      <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
              <p className="text-gray-600">Manage your AI news digest</p>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('userId');
                navigate('/');
              }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Sign Out
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Your Interests</h3>
              <div className="flex flex-wrap gap-2">
                {user?.interests.map(interest => (
                  <span key={interest} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {user?.keywords.map(keyword => (
                  <span key={keyword} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">Delivery Info</h3>
              <p className="text-sm text-purple-800">
                <strong>Email:</strong> {user?.email}<br/>
                <strong>Method:</strong> {user?.delivery}<br/>
                <strong>Time:</strong> {user?.digestTime}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Digest Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <button
              onClick={handleFetchArticles}
              disabled={fetchingArticles}
              className="bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {fetchingArticles ? 'Fetching...' : 'Fetch Latest Articles'}
            </button>

            <button
              onClick={handleSummarizeArticles}
              disabled={summarizingArticles}
              className="bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {summarizingArticles ? 'Summarizing...' : 'Summarize Articles'}
            </button>

            <button
              onClick={handleGenerateDigest}
              disabled={generatingDigest}
              className="bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generatingDigest ? 'Generating...' : 'Generate Today\'s Digest'}
            </button>

            <button
              onClick={handleViewDigest}
              className="bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              View Today's Digest
            </button>

            <button
              onClick={handleResetSummaries}
              disabled={resettingSummaries}
              className="bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resettingSummaries ? 'Resetting...' : 'Reset Summaries'}
            </button>

            <button
              onClick={handleClearArticles}
              disabled={clearingArticles}
              className="bg-orange-600 text-white py-3 px-4 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {clearingArticles ? 'Clearing...' : 'Clear All Articles'}
            </button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">How it works:</h3>
            <ol className="text-sm text-gray-600 space-y-1">
              <li>1. Fetch latest articles from News API</li>
              <li>2. Use AI to summarize articles</li>
              <li>3. Generate personalized digest based on your interests</li>
              <li>4. View your daily news digest</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
