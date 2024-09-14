
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

const LoginLogout = ({ authToken, setAuthToken }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decoded = jwtDecode(token);
      // Optional: Check token expiry
      if (decoded.exp * 1000 > Date.now()) {
        setAuthToken(token);
      } else {
        localStorage.removeItem('accessToken');
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('/api/user/logout').then((res) => {
        localStorage.removeItem('accessToken');
        setAuthToken(null);
        toast.success(res.data.message)
        console.log(res.data.message);
      })

      navigate('/login');
    } catch (err) {
      console.error(err.response.data.msg);
    }
  };
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav>
      {authToken ? (
        <div className='flex flex-col items-center'>
          <button onClick={toggleDropdown} className="focus:outline-none">
            <img
              src={jwtDecode(authToken).avatar || 'https://via.placeholder.com/50'} // Replace with default if avatar not present
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-gray-300 object-cover"
            />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute top-12 right-0 bg-white shadow-lg rounded-lg w-48">
              <Link
                to="/profile"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                onClick={() => setDropdownOpen(false)} // Close dropdown when navigating
              >
                Visit Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
              >
                Logout
              </button>
            </div>
          )}
          <div className=''>Welcome, {jwtDecode(authToken).fullname}</div>
        </div>
      ) : (
        <div className="flex items-center lg:order-2">
          <Link
            to="/login"
            className="text-gray-800 hover:bg-gray-200 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none border border-blue-800"
          >
            Log in
          </Link>
        </div>
      )}
    </nav>
  );
};

export default LoginLogout;
