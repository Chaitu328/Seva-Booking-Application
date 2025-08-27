import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../hooks/redux';
import { addItem, removeItem } from '../store/slices/cartSlice';
import SevaCard from '../components/SevaCard';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Home = () => {
  const [sevas, setSevas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchSevas();
  }, []);

  const fetchSevas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/sevas`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setSevas(data);
    } catch (err) {
      setError('Failed to load sevas. Please try again later.');
      console.error('Error fetching sevas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (seva) => {
    dispatch(addItem(seva));
  };

  const handleRemoveFromCart = (sevaId) => {
    dispatch(removeItem(sevaId));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600 bg-red-100 p-4 rounded-lg">
          {error}
          <button 
            onClick={fetchSevas}
            className="ml-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Available Sevas
      </h1>

      {sevas.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          No sevas available at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sevas.map((seva) => (
            <SevaCard
              key={seva.id}
              seva={seva}
              onAddToCart={() => handleAddToCart(seva)}
              onRemoveFromCart={() => handleRemoveFromCart(seva.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;