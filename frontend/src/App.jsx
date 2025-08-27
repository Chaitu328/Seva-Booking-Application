import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/HomePage/Home';
import Checkout from './pages/Checkout';
import UserProfile from './pages/UserProfile';
import Cart from './pages/Cart';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/user" element={<UserProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;