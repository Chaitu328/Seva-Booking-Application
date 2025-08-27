import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './UserAuth.module.css';
import { setUser, setError, clearError } from '../../store/slices/userSlice';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const UserAuth = ({ onClose }) => {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.user.error);

  const [step, setStep] = useState('mobile'); // 'mobile', 'otp', 'newUser'
  const [contact, setContact] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const validateMobile = (number) => /^[6-9]\d{9}$/.test(number);

  // --- Step 1: Mobile number ---
  const handleMobileSubmit = async () => {
    if (!validateMobile(contact)) {
      dispatch(setError('Enter a valid 10-digit mobile number starting with 6-9'));
      return;
    }

    dispatch(clearError());
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/users/identity-exist?contact=${contact}`);
      const data = await res.json();

      if (data.exists) {
        // Existing user → send OTP
        const otpRes = await fetch(`${API_BASE_URL}/users/otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contact }),
        });
        const otpData = await otpRes.json();

        // Log OTP for dev (Vite)
        if (import.meta.env.MODE === 'development') {
          console.log(`OTP for ${contact}: ${otpData.otp}`);
        }

        setStep('otp');
      } else {
        // New user → ask Name & Email
        setStep('newUser');
      }
    } catch (err) {
      console.error(err);
      dispatch(setError('Server error. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  // --- Step 2: OTP Verification ---
  const handleOtpSubmit = async () => {
    dispatch(clearError());
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/users/otp-verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact, otp }),
      });

      if (!res.ok) {
        dispatch(setError('Invalid OTP'));
        setLoading(false);
        return;
      }

      // Fetch user details (full details if backend supports)
      const userRes = await fetch(`${API_BASE_URL}/users/identity-exist?contact=${contact}`);
      const userData = await userRes.json();
      dispatch(setUser({ userData })); // Replace with full data if backend returns
      onClose();
    } catch (err) {
      console.error(err);
      dispatch(setError('Server error. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  // --- Step 3: New user creation ---
  const handleNewUserSubmit = async () => {
    if (!name || !email) {
      dispatch(setError('Name and Email are required'));
      return;
    }

    dispatch(clearError());
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact, name, email }),
      });

      if (!res.ok) {
        const errData = await res.json();
        dispatch(setError(errData.message || 'Failed to create user'));
        setLoading(false);
        return;
      }

      // Send OTP for new user
      const otpRes = await fetch(`${API_BASE_URL}/users/otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact }),
      });
      const otpData = await otpRes.json();

      // Log OTP for dev (Vite)
      if (import.meta.env.MODE === 'development') {
        console.log(`OTP for new user ${contact}: ${otpData.otp}`);
      }

      setStep('otp');
    } catch (err) {
      console.error(err);
      dispatch(setError('Server error. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>User Login / Signup</h2>

      {error && <p className={styles.error}>{error}</p>}

      {step === 'mobile' && (
        <>
          <input
            type="text"
            placeholder="Mobile Number"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className={styles.input}
          />
          <button onClick={handleMobileSubmit} disabled={loading} className={styles.btn}>
            {loading ? 'Checking...' : 'Next'}
          </button>
        </>
      )}

      {step === 'otp' && (
        <>
          <p>OTP sent to {contact}</p>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className={styles.input}
          />
          <button onClick={handleOtpSubmit} disabled={loading} className={styles.btn}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>

          {/* Dev hint */}
          {import.meta.env.MODE === 'development' && (
            <p style={{ color: 'blue', marginTop: '0.5rem' }}>
              Check console for OTP
            </p>
          )}
        </>
      )}

      {step === 'newUser' && (
        <>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
          <button onClick={handleNewUserSubmit} disabled={loading} className={styles.btn}>
            {loading ? 'Creating...' : 'Submit'}
          </button>
        </>
      )}
    </div>
  );
};

export default UserAuth;