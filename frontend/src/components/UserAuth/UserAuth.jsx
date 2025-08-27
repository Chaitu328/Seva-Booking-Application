import React, { useState,useRef  } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './UserAuth.module.css';
import { setUser, setError, clearError } from '../../store/slices/userSlice';

const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;

export default function UserAuth({ onClose, onLoginSuccess }) {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.user.error);

  const [contact, setContact] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [step, setStep] = useState('enterContact'); // enterContact | enterOtp | enterName
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const latestOtpRef = useRef(null); // store last OTP (dev only)

  const isDev = import.meta.env.MODE === 'development';

  const normalizeContact = (c) => c.trim();

  // --- Send OTP ---
  const handleSendOtp = async () => {
    const trimmed = normalizeContact(contact);
    if (!/^[6-9]\d{9}$/.test(trimmed)) {
      dispatch(setError('Enter a valid 10-digit mobile number starting with 6-9'));
      return;
    }

    dispatch(clearError());
    setLoading(true);

    try {
      console.log('[UserAuth] Sending OTP request for contact:', trimmed);
      const res = await fetch(`${API_BASE_URL}/users/otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact: trimmed }),
      });

      const data = await res.json();
      console.log('[UserAuth] /users/otp response:', res.status, data);

      if (!res.ok) {
        dispatch(setError(data.message || 'Failed to send OTP'));
        return;
      }

      // Dev: store & show OTP in console (only dev)
      if (isDev) {
        latestOtpRef.current = String(data.otp);
        console.log(`[DEV] OTP for ${trimmed}:`, latestOtpRef.current);
      }

      setStep('enterOtp');

      // disable resend for 30s to avoid replacing OTP accidentally
      setResendDisabled(true);
      setTimeout(() => setResendDisabled(false), 30000);

    } catch (err) {
      console.error('[UserAuth] Network error sending OTP:', err);
      dispatch(setError('Server error. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  // --- Verify OTP ---
  const handleVerifyOtp = async () => {
    const trimmed = normalizeContact(contact);
    const entered = otp.trim();

    dispatch(clearError());
    setLoading(true);

    try {
      console.log('[UserAuth] Verifying OTP, payload:', { contact: trimmed, otp: entered });
      const res = await fetch(`${API_BASE_URL}/users/otp-verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact: trimmed, otp: entered }),
      });

      const data = await res.json();
      console.log('[UserAuth] /users/otp-verify response:', res.status, data);

      if (!res.ok) {
        // helpful debug messages
        const msg = data.message || 'Invalid OTP';
        dispatch(setError(msg));
        // in dev, show what last OTP was
        if (isDev && latestOtpRef.current) {
          console.log(`[DEV] Last OTP sent for ${trimmed}:`, latestOtpRef.current);
        }
        return;
      }

      // OTP verified successfully
      // Now check if user exists and fetch complete user data
      console.log('[UserAuth] OTP verified — checking identity-exist');
      const existRes = await fetch(`${API_BASE_URL}/users/identity-exist?contact=${trimmed}`);
      const existData = await existRes.json();
      console.log('[UserAuth] /users/identity-exist response:', existRes.status, existData);

      if (existRes.ok && existData.exists) {
        // Prefer backend returning the user id in existData.user.id
        if (existData.user && existData.user.id) {
          const userRes = await fetch(`${API_BASE_URL}/users/${existData.user.id}`);
          const userData = await userRes.json();
          console.log('[UserAuth] fetched full user by id:', userData);
          dispatch(setUser(userData));
          if (typeof onLoginSuccess === 'function') onLoginSuccess(userData);
          return;
        }

        // Fallback: if identity-exist returns only exists:true, attempt to find user by contact.
        // IMPORTANT: GET /users/:id expects id. If backend doesn't return id, you must modify backend to return it.
        // For now, try to find user by contact with the route you have (if any). Otherwise, show message.
        console.warn('[UserAuth] identity-exist returned exists:true but did not include user id. Backend should return user id so frontend can fetch details.');
        dispatch(setError('Login succeeded but failed to fetch user profile — backend must expose user id in identity-exist.'));
        // You could also set a minimal user with contact only:
        // dispatch(setUser({ contact: trimmed }));
        return;
      }

      // user does not exist -> ask their name to create account
      setStep('enterName');

    } catch (err) {
      console.error('[UserAuth] Error during OTP verification:', err);
      dispatch(setError('Server error. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  // --- Create user for new contact ---
  const handleCreateUser = async () => {
    const trimmed = normalizeContact(contact);
    if (!name || name.trim().length < 2) {
      dispatch(setError('Please enter a valid name'));
      return;
    }

    dispatch(clearError());
    setLoading(true);

    try {
      console.log('[UserAuth] Creating user:', { contact: trimmed, name });
      const res = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact: trimmed, name: name.trim() }),
      });

      const data = await res.json();
      console.log('[UserAuth] /users POST response:', res.status, data);

      if (!res.ok) {
        dispatch(setError(data.message || 'Failed to create user'));
        return;
      }

      // success: backend returns created user object
      dispatch(setUser(data));
      if (typeof onLoginSuccess === 'function') onLoginSuccess(data);
    } catch (err) {
      console.error('[UserAuth] Network error creating user:', err);
      dispatch(setError('Server error. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>
        <h2>User Authentication</h2>

        {error && <div className={styles.error}>{error}</div>}

        {step === 'enterContact' && (
          <>
            <input
              type="text"
              placeholder="Enter mobile number"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className={styles.input}
            />
            <button onClick={handleSendOtp} disabled={loading || resendDisabled} className={styles.btn}>
              {loading ? 'Sending...' : resendDisabled ? 'Wait...' : 'Send OTP'}
            </button>
          </>
        )}

        {step === 'enterOtp' && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className={styles.input}
            />
            <button onClick={handleVerifyOtp} disabled={loading} className={styles.btn}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            {isDev && (
              <p style={{ color: 'blue', marginTop: 8 }}>
                Dev: check console for last OTP. (Resend disabled for 30s)
              </p>
            )}

            <div style={{ marginTop: 8 }}>
              <button
                onClick={handleSendOtp}
                disabled={loading || resendDisabled}
                className={styles.linkBtn}
              >
                Resend OTP
              </button>
            </div>
          </>
        )}

        {step === 'enterName' && (
          <>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
            />
            <button onClick={handleCreateUser} disabled={loading} className={styles.btn}>
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}