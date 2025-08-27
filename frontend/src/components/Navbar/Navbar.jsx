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

  // Refresh user details from backend when user exists (keeps info up-to-date)
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch(`${API_BASE_URL}/users/${user.id}`);
        if (!res.ok) throw new Error('Failed to fetch user details');
        const fresh = await res.json();
        dispatch(setUser(fresh));
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

  const handleUserClick = () => {
    if (user) {
      // logged in -> toggle slider
      setShowSlider((s) => !s);
    } else {
      // not logged in -> open auth modal
      setShowUserAuth(true);
    }
  };

  // Called by UserAuth after successful login/signup with full user object
  const handleLoginSuccess = (userData) => {
    dispatch(setUser(userData));
    setShowUserAuth(false);
    setShowSlider(true); // open slider so user sees details immediately
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <div className={styles.navLinks}>
          <Link to="/" className={styles.navLink}>Home</Link>
          <Link to="/cart" className={styles.navLink}>Cart</Link>

          {/* Single User control (acts as link/button) */}
          <button
            className={`${styles.navLink} ${styles.userBtn}`}
            onClick={handleUserClick}
            aria-haspopup="true"
            aria-expanded={showSlider}
          >
            User
          </button>

          {/* Slider (shows only when user is logged in and toggled) */}
          {user && showSlider && (
            <>
              <div className={`${styles.slider} ${showSlider ? styles.sliderOpen : ''}`}>
                <button className={styles.closeBtn} onClick={() => setShowSlider(false)}>
                  ×
                </button>

                <div className={styles.userInfo}>
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Contact:</strong> {user.contact}</p>
                  {/* Show email if available */}
                  {user.email && <p><strong>Email:</strong> {user.email}</p>}
                </div>

                <div>
                  <p><strong>Latest 3 orders</strong></p>
                  <ul className={styles.orderList}>
                    {orders.length > 0 ? (
                      orders.slice(0, 3).map((order, idx) => (
                        <li key={idx} className={styles.orderItem}>
                          Order #{order.orderId} - ${order.amountToPay}
                        </li>
                      ))
                    ) : (
                      <li className={styles.orderItem}>No recent orders</li>
                    )}
                  </ul>
                </div>

                <button className={styles.logoutBtn} onClick={handleLogout}>
                  Logout
                </button>
              </div>

              {/* Overlay */}
              <div className={styles.overlay} onClick={() => setShowSlider(false)} />
            </>
          )}

          {/* UserAuth modal for login/signup */}
          {showUserAuth && !user && (
            <UserAuth
              onClose={() => setShowUserAuth(false)}
              onLoginSuccess={handleLoginSuccess}
            />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;