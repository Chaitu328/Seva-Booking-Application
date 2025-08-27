import React, { useState } from "react";
import styles from "./PaymentModal.module.css";

const PaymentModal = ({ order, onClose }) => {
  const [method, setMethod] = useState("card");
  const [form, setForm] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    upiId: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePay = () => {
    if (method === "card") {
      if (!form.cardNumber || !form.expiry || !form.cvv) {
        alert("Please fill card details");
        return;
      }
    } else {
      if (!form.upiId.includes("@")) {
        alert("Invalid UPI ID");
        return;
      }
    }

    alert(`✅ Payment successful for order #${order.orderId}`);
    onClose();
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <h2>Payment</h2>
        <div className={styles.tabs}>
          <button
            onClick={() => setMethod("card")}
            className={method === "card" ? styles.active : ""}
          >
            Card
          </button>
          <button
            onClick={() => setMethod("upi")}
            className={method === "upi" ? styles.active : ""}
          >
            UPI
          </button>
        </div>

        {method === "card" ? (
          <div className={styles.form}>
            <input
              name="cardNumber"
              value={form.cardNumber}
              onChange={handleChange}
              placeholder="Card Number"
            />
            <input
              name="expiry"
              value={form.expiry}
              onChange={handleChange}
              placeholder="Expiry (MM/YY)"
            />
            <input
              name="cvv"
              value={form.cvv}
              onChange={handleChange}
              placeholder="CVV"
              type="password"
            />
          </div>
        ) : (
          <div className={styles.form}>
            <input
              name="upiId"
              value={form.upiId}
              onChange={handleChange}
              placeholder="Enter UPI ID"
            />
          </div>
        )}

        <button className={styles.payBtn} onClick={handlePay}>
          Pay ₹{order.amountToPay}
        </button>
        <button className={styles.closeBtn} onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;
