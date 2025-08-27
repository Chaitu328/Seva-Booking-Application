import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import { logout,setUser } from '../../store/slices/userSlice';
import UserAuth from '../UserAuth/UserAuth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Navbar = () => {
  const [showSlider, setShowSlider] = useState(false);
  const [showUserAuth, setShowUserAuth] = useState(false);
  const user = useSelector((state) => state.user.user);
  const orders = useSelector((state) => state.orders?.items || []);
  const dispatch = useDispatch();

  // Fetch latest user details from backend
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user) return;
      try {
        const res = await fetch(`${API_BASE_URL}/users/${user.id}`);
        if (!res.ok) throw new Error('Failed to fetch user details');
        const data = await res.json();
        dispatch(setUser(data));
      } catch (err) {
        console.error('Error fetching user details:', err);
      }
    };
    fetchUserDetails();
  }, [user?.id, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    setShowSlider(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <div className={styles.navLinks}>
          <Link to="/" className={styles.navLink}>Home</Link>
          <Link to="/cart" className={styles.navLink}>Cart</Link>

          {user ? (
            <>
              <button
                className={styles.navLink}
                onClick={() => setShowSlider(true)}
              >
                {user.name || 'User'}
              </button>

              {/* Slider for logged-in user */}
              <div
                className={`${styles.slider} ${showSlider ? styles.sliderOpen : ''}`}
              >
                <button
                  className={styles.closeBtn}
                  onClick={() => setShowSlider(false)}
                >
                  ×
                </button>

                <div className={styles.userInfo}>
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Contact:</strong> {user.contact}</p>
                </div>

                <ul className={styles.orderList}>
                  {orders.length > 0 ? (
                    orders.map((order, idx) => (
                      <li key={idx} className={styles.orderItem}>
                        Order #{order.orderId} - ${order.amountToPay}
                      </li>
                    ))
                  ) : (
                    <li className={styles.orderItem}>No recent orders</li>
                  )}
                </ul>

                <button className={styles.logoutBtn} onClick={handleLogout}>
                  Logout
                </button>
              </div>

              {/* Overlay */}
              {showSlider && (
                <div
                  className={styles.overlay}
                  onClick={() => setShowSlider(false)}
                />
              )}
            </>
          ) : (
            <>
              <button
                className={styles.navLink}
                onClick={() => setShowUserAuth(true)}
              >
                Login / Signup
              </button>

              {/* UserAuth modal */}
              {showUserAuth && (
                <UserAuth onClose={() => setShowUserAuth(false)} />
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;