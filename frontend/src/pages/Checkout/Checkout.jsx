import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { removeItem, clearCart } from "../../store/slices/cartSlice";
import { addOrder } from "../../store/slices/ordersSlice";
import PaymentModal from "../../components/PaymentModal/PaymentModal";
import styles from "./Checkout.module.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Checkout = () => {
  const dispatch = useAppDispatch();

  const cartItems = useAppSelector((state) => state.cart.items);
  const user = useAppSelector((state) => state.user.user);

  // form state
  const [form, setForm] = useState({
    name: user?.name || "",
    contact: user?.contact || "",
    email: user?.email || "",
    addrLine1: "",
    addrLine2: "",
    pincode: "",
    city: "",
    state: "",
    type: "Home",
  });

  const [errors, setErrors] = useState({});
  const [showPayment, setShowPayment] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errs = {};
    if (!form.name) errs.name = "Name required";
    if (!form.contact) errs.contact = "Phone required";
    if (!form.addrLine1) errs.addrLine1 = "Address line 1 required";
    if (!form.pincode) errs.pincode = "Pincode required";
    if (!form.city) errs.city = "City required";
    return errs;
  };

  const handlePayNow = async () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      const payload = {
        items: cartItems,
        address: {
          name: form.name,
          addrLine1: form.addrLine1,
          addrLine2: form.addrLine2,
          pincode: form.pincode,
          city: form.city,
          state: form.state,
          type: form.type,
          verified: true,
        },
      };

      const res = await fetch(`${API_BASE_URL}/api/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create order");

      const data = await res.json();
      setOrderDetails(data);

      // Save latest order to Redux
      dispatch(addOrder(data));
      // Clear cart after order creation
      dispatch(clearCart());

      // open payment modal
      setShowPayment(true);
    } catch (err) {
      console.error("Order error:", err);
      alert("Failed to create order. Please try again.");
    }
  };

  return (
    <div className={styles.checkoutContainer}>
      {/* Left - Cart Items */}
      <div className={styles.left}>
        <h2>Selected Sevas</h2>
        {cartItems.length === 0 ? (
          <p>No items in cart</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className={styles.cartItem}>
              <img src={item.media} alt={item.title} />
              <div className={styles.cartInfo}>
                <h4>{item.title}</h4>
                <p>₹{item.discountedPrice}</p>
                <button onClick={() => dispatch(removeItem(item.id))}>
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Right - User + Address */}
      <div className={styles.right}>
        <h2>User Details</h2>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
        />
        {errors.name && <span className={styles.error}>{errors.name}</span>}

        <input
          name="contact"
          value={form.contact}
          onChange={handleChange}
          placeholder="Phone"
        />
        {errors.contact && (
          <span className={styles.error}>{errors.contact}</span>
        )}

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
        />

        <h2>Address</h2>
        <select name="type" value={form.type} onChange={handleChange}>
          <option>Home</option>
          <option>Work</option>
          <option>Other</option>
        </select>

        <input
          name="addrLine1"
          value={form.addrLine1}
          onChange={handleChange}
          placeholder="Address Line 1"
        />
        {errors.addrLine1 && (
          <span className={styles.error}>{errors.addrLine1}</span>
        )}

        <input
          name="addrLine2"
          value={form.addrLine2}
          onChange={handleChange}
          placeholder="Address Line 2"
        />

        <input
          name="pincode"
          value={form.pincode}
          onChange={handleChange}
          placeholder="Pincode"
        />
        {errors.pincode && (
          <span className={styles.error}>{errors.pincode}</span>
        )}

        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder="City"
        />
        {errors.city && <span className={styles.error}>{errors.city}</span>}

        <input
          name="state"
          value={form.state}
          onChange={handleChange}
          placeholder="State"
          readOnly
        />

        <button
          className={styles.payBtn}
          onClick={handlePayNow}
          disabled={cartItems.length === 0}
        >
          Pay Now
        </button>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <PaymentModal
          order={orderDetails}
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>
  );
};

export default Checkout;
