import { Link } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux';

const Navbar = () => {
  const cartItems = useAppSelector((state) => state.cart.items);
  const user = useAppSelector((state) => state.user.user);

  return (
    <nav className="bg-white shadow-md py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-gray-800">
          Seva Platform
        </Link>
        
        <div className="flex gap-6 items-center">
          <Link to="/" className="text-gray-600 hover:text-gray-800">
            Home
          </Link>
          <Link to="/cart" className="text-gray-600 hover:text-gray-800 relative">
            Cart
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Link>
          <Link to="/user" className="text-gray-600 hover:text-gray-800">
            {user ? user.name : 'User'}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;