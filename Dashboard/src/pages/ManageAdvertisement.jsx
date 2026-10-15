import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import AdHeader from '../components/advertisement/AdHeader';
import AdForm from '../components/advertisement/AdForm';
import AdPreview from '../components/advertisement/AdPreview';

const ManageAdvertisement = () => {
  const [adData, setAdData] = useState({
    text: '',
    mediaUrl: '',
    mediaType: 'image',
    isActive: true,
    buttonLink: '',
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

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
            buttonLink: data.buttonLink || data.link || '',
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

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('media', file);
    setUploading(true);

    try {
      const { data } = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const serverUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const fullUrl = data.url.startsWith('http') ? data.url : `${serverUrl}${data.url}`;
      
      setAdData(prev => ({ ...prev, mediaUrl: fullUrl }));
      toast.success('File uploaded successfully!');
    } catch (error) {
      console.error(error);
      toast.error('File upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/advertisement', adData);
      toast.success('Advertisement saved successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Error saving advertisement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease', paddingBottom: '40px' }}>
      <AdHeader />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', alignItems: 'stretch' }}>
        <AdForm 
          adData={adData} 
          handleChange={handleChange} 
          handleSubmit={handleSubmit} 
          uploadFileHandler={uploadFileHandler} 
          loading={loading} 
          uploading={uploading} 
        />
        
        <AdPreview adData={adData} />
      </div>
    </div>
  );
};

export default ManageAdvertisement;
