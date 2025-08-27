# Seva Booking Application

A full-stack web application that allows users to browse **Sevas (donation services)**, add them to cart, and complete payments. Built with **React (frontend)**, **Node.js/Express (backend)**, **MongoDB (database)**, deployed on **Vercel** (frontend) and **Render** (backend).

---

## Features

* **Mobile OTP Authentication**

  * User enters mobile number.
  * OTP verification performed.
  * If user exists → load user profile and order history.
  * If new user → create user in DB and proceed.

* **User Profile**

  * Displays name, phone, email.
  * Shows latest orders with order IDs.
  * Logout option.

* **Orders Flow**

  * Sevas can be added/removed from cart.
  * At checkout, user fills details (user + address).
  * Order created in backend → returns an `orderId`.
  * Orders are persisted and tied to logged-in user.

* **Payment Page**

  * Supports **Card (Number, Expiry, CVV)**.
  * Supports **UPI (ID with validation)**.
  * Pay button enabled only on valid inputs.

* **Redux for State Management**

  * Global state for **user, cart, orders**.
  * Easier management across multiple pages.

* **Pagination**

  * Sevas list shows **10 per page**.
  * “View More” loads more.

---

## Routing Table

| Route       | Page / Component | Purpose                                                          |
| ----------- | ---------------- | ---------------------------------------------------------------- |
| `/`         | `HomePage`       | Show user details, latest orders, list of sevas with pagination. |
| `/cart`     | `Cart`           | Review selected sevas before checkout.                           |
| `/checkout` | `Checkout`       | Enter user + address details, place order.                       |
| `/payment`  | `Payment`        | Card / UPI payment entry.                                        |
| `/user`     | `UserProfile`    | Show logged-in user details and order history.                   |

---

## Tech Stack

* **Frontend**: React + Vite
* **Styling**: Tailwind + CSS Modules
* **State Management**: Redux Toolkit
* **Backend**: Node.js + Express
* **Database**: MongoDB (orders, sevas, users)
* **Deployments**:

  * Frontend → Vercel
  * Backend → Render

---

## Challenges & Solutions

1. **User Authentication Flow**

   * Challenge: Handling OTP verification & conditionally creating/loading user.
   * Solution: Created unified user API → check user by phone, if not found, create new user.

2. **Order Management**

   * Challenge: Linking order with specific user and persisting across sessions.
   * Solution: Used backend API to generate `orderId` and store in DB, displayed in Home/UserProfile.

3. **Routing Decisions**

   * Challenge: Deciding whether to create new routes for checkout/payment or reuse existing ones.
   * Solution: Kept routes minimal (`/checkout`, `/payment`) and avoided unnecessary additions.

4. **Pagination**

   * Challenge: Large seva list handling.
   * Solution: Implemented frontend “View More” pagination (10 items per page).

5. **State Consistency**

   * Challenge: Syncing user, cart, orders across pages.
   * Solution: Implemented Redux global store.

---

## Setup & Run Locally

```bash
# Clone repo
git clone <repo-url>

# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
npm install
npm run dev
```

* Update `.env` files for both frontend & backend with API URLs and MongoDB credentials.

---

## Deployment

* **Frontend (Vercel)**: Auto-deploys on push to main branch.
* **Backend (Render)**: Hosted with persistent MongoDB cluster.
