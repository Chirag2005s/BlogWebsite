import React, { useState, useEffect } from 'react';
import { Save, Image as ImageIcon, Video, Type } from 'lucide-react';
import api from '../../services/api';

const ManageAdvertisement = () => {
  const [adData, setAdData] = useState({
    text: '',
    mediaUrl: '',
    mediaType: 'image',
    isActive: true,
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const { data } = await api.get('/advertisement');
        if (data) {
          setAdData({
            text: data.text || '',
            mediaUrl: data.mediaUrl || '',
            mediaType: data.mediaType || 'image',
            isActive: data.isActive !== undefined ? data.isActive : true,
          });
        }
      } catch (err) {
        console.log("No ad found or error fetching ad");
      }
    };
    fetchAd();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAdData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/advertisement', adData);
      
      // Still dispatch custom event so the Home page updates if open in same window
      window.dispatchEvent(new Event('advertisementUpdated'));
      
      setMessage('Advertisement saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('Error saving advertisement.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Control Advertisement</h1>
        <p className="text-text-muted text-sm">Manage the advertisement section displayed on the home page.</p>
      </div>

      <div className="surface-card p-6 rounded-2xl border border-line">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Status */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={adData.isActive}
              onChange={handleChange}
              className="w-5 h-5 rounded border-line bg-surface-900 text-primary-500 focus:ring-primary-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-white cursor-pointer">
              Enable Advertisement Section
            </label>
          </div>

          {/* Text Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-text-secondary">
              <Type size={16} /> Advertisement Text
            </label>
            <textarea
              name="text"
              value={adData.text}
              onChange={handleChange}
              rows="4"
              placeholder="Enter advertisement text here..."
              className="w-full bg-surface-900 border border-line rounded-xl px-4 py-3 text-white placeholder-text-muted/50 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all resize-y"
              required
            ></textarea>
          </div>

          {/* Media Type Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary block">Media Type</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mediaType"
                  value="image"
                  checked={adData.mediaType === 'image'}
                  onChange={handleChange}
                  className="text-primary-500 bg-surface-900 border-line"
                />
                <span className="flex items-center gap-1.5 text-sm text-white">
                  <ImageIcon size={16} className="text-cyan-500" /> Image
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mediaType"
                  value="video"
                  checked={adData.mediaType === 'video'}
                  onChange={handleChange}
                  className="text-primary-500 bg-surface-900 border-line"
                />
                <span className="flex items-center gap-1.5 text-sm text-white">
                  <Video size={16} className="text-purple-500" /> Video
                </span>
              </label>
            </div>
          </div>

          {/* Media URL Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-text-secondary">
              {adData.mediaType === 'image' ? <ImageIcon size={16} /> : <Video size={16} />} 
              {adData.mediaType === 'image' ? 'Image URL' : 'Video URL'}
            </label>
            <input
              type="url"
              name="mediaUrl"
              value={adData.mediaUrl}
              onChange={handleChange}
              placeholder={`Enter ${adData.mediaType} URL...`}
              className="w-full bg-surface-900 border border-line rounded-xl px-4 py-3 text-white placeholder-text-muted/50 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
              required
            />
          </div>

          {message && (
            <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-sm">
              {message}
            </div>
          )}

          <div className="pt-4 border-t border-line flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary-500/20 active:scale-95"
            >
              <Save size={18} />
              Save Advertisement
            </button>
          </div>
        </form>
      </div>

      {/* Preview Section */}
      {adData.isActive && adData.text && adData.mediaUrl && (
        <div className="mt-8 space-y-4">
          <h2 className="text-lg font-semibold text-white">Live Preview</h2>
          <div className="border border-line rounded-2xl overflow-hidden bg-surface-800">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 flex flex-col justify-center">
                <p className="text-lg text-white font-medium leading-relaxed whitespace-pre-wrap">
                  {adData.text}
                </p>
              </div>
              <div className="bg-surface-900 flex items-center justify-center relative min-h-[250px]">
                {adData.mediaType === 'image' ? (
                  <img src={adData.mediaUrl} alt="Ad Preview" className="w-full h-full object-cover max-h-[300px]" />
                ) : (
                  <video src={adData.mediaUrl} controls className="w-full h-full object-cover max-h-[300px]" />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAdvertisement;
