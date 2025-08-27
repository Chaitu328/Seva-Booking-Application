import React from 'react';
import { useAppSelector } from '../hooks/redux';

const SevaCard = ({ seva, onAddToCart, onRemoveFromCart }) => {
  const cartItems = useAppSelector((state) => state.cart.items);
  const isInCart = cartItems.some(item => item.id === seva.id);

  return (
    <div className="border rounded-xl shadow-lg p-4 flex flex-col items-center hover:shadow-xl transition-shadow">
      {/* Image */}
      <div 
        className="w-full h-48 bg-gray-200 mb-4 rounded-lg bg-cover bg-center"
        style={{ backgroundImage: `url(${seva.media || '/placeholder-image.jpg'})` }}
      />

      <h2 className="font-semibold text-lg text-center mb-2">{seva.title}</h2>
      <p className="text-gray-600 text-sm text-center mb-2 line-clamp-2">
        {seva.description}
      </p>
      
      <div className="flex gap-2 mb-3">
        <span className="text-gray-500 line-through">₹{seva.marketPrice}</span>
        <span className="text-green-600 font-bold">₹{seva.discountedPrice}</span>
      </div>

      {isInCart ? (
        <button
          onClick={onRemoveFromCart}
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors"
        >
          Remove from Cart
        </button>
      ) : (
        <button
          onClick={onAddToCart}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors"
        >
          Add to Cart
        </button>
      )}
    </div>
  );
};

export default SevaCard;