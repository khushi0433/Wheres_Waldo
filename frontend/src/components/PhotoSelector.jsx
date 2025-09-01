import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

const PhotoSelector = ({ onPhotoSelect }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      // For now, we'll use the actual photo from your database
      // In a real app, you'd have an endpoint to get all photos
      const defaultPhoto = {
        id: 'b033f90a-ecbd-49b6-b8cb-7739944b108e',
        title: 'Sample Beach Scene',
        imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'
      };
      setPhotos([defaultPhoto]);
    } catch (err) {
      setError('Failed to load photos');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoSelect = (photo) => {
    onPhotoSelect(photo);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-white">
        <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
        <span>Loading photos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-white text-center p-5">
        <h2 className="text-2xl font-bold mb-4">Failed to load photos</h2>
        <p className="mb-6 opacity-90">{error}</p>
        <button 
          onClick={loadPhotos}
          className="px-6 py-3 bg-white/20 text-white border-2 border-white/30 rounded-xl text-lg font-medium cursor-pointer transition-all duration-300 backdrop-blur-sm hover:bg-white/30 hover:transform hover:-translate-y-0.5"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-5">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Choose a Photo to Play</h2>
        <p className="text-white/80 text-lg">Select an image to start your Where's Waldo adventure!</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo) => (
          <div 
            key={photo.id}
            className="bg-white rounded-xl shadow-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-3xl"
            onClick={() => handlePhotoSelect(photo)}
          >
            <div className="aspect-video overflow-hidden">
              <img 
                src={photo.imageUrl} 
                alt={photo.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{photo.title}</h3>
              <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium transition-all duration-300 hover:from-blue-600 hover:to-purple-700">
                Play This Photo
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoSelector;
