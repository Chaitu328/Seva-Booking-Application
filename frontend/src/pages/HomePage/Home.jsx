import React, { useState, useEffect } from 'react';
import { useAppDispatch,useAppSelector  } from '../../hooks/redux';
import { addItem, removeItem } from '../../store/slices/cartSlice';
import SevaCard from '../../components/SevaCard';
import styles from './Home.module.css';
import { logout } from '../../store/slices/userSlice';

const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;

const Home = () => {
  const [sevas, setSevas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
   const orders = useAppSelector((state) => state.orders.items);

//   useEffect(() => {
//   console.log('Orders from store:', orders);
// }, [orders]);
  
  useEffect(() => {
    fetchSevas();
  }, []);

  const fetchSevas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/sevas`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setSevas(data);
    } catch (err) {
      setError('Failed to load sevas. Please try again later.');
      console.error('Error fetching sevas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (seva) => dispatch(addItem(seva));
  const handleRemoveFromCart = (sevaId) => dispatch(removeItem(sevaId));

  if (loading) {
    return (
      <div className={styles.container}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
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
    <div className={styles.container}>
      {user && (
        <div className={styles.userDetails}>
          <h3>Name: {user.name || 'User'}</h3>
          <p><span className="font-medium">Phone:</span> {user.contact}</p>
          {user.email && <p><span className="font-medium">Email:</span> {user.email}</p>}

          <h2>Latest 3 orders:</h2>
            
            {orders.length === 0 ? (
              <p className={styles.noOrders}>No recent orders</p>
            ) : (
              <ul className={styles.ordersList}>
              {orders.slice(0, 3).map((o) => (
                <li key={o.orderId} className={styles.orderItem}>
                  order # {o.orderId}
                </li>
              ))}
              </ul>
            )}
            <button className={styles.logoutBtn} onClick={() => dispatch(logout())}>
            Logout
          </button>
        </div>
      )}

      <h1 className={styles.sevaTitle}>Available Sevas</h1>

       {sevas.length === 0 ? (
        <div className={styles.emptyState}>
          No sevas available at the moment.
        </div>
      ) : (
        <>
          <div className={styles.grid}>
            {sevas.slice(0, visibleCount).map((seva) => (   
              <SevaCard
                key={seva.id}
                seva={seva}
                onAddToCart={() => handleAddToCart(seva)}
                onRemoveFromCart={() => handleRemoveFromCart(seva.id)}
              />
            ))}
          </div>

          {visibleCount < sevas.length && (  
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setVisibleCount(visibleCount + 10)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
              >
                View More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;