
import React, { useState, useEffect } from 'react';
import { Link ,useNavigate} from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const LoginLogout = ({ authToken, setAuthToken }) => {
  const navigate = useNavigate();

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

  const handleLogout = async() => { 
    try {
        await axios.post('/api/user/logout').then((res)=>{
            localStorage.removeItem('accessToken');
            setAuthToken(null);
            console.log(res);
        })

        navigate('/login');
    } catch (err) {
        console.error(err.response.data.msg);
    }
  };

  return (
    <nav>
        {authToken ? (
          <div className='flex flex-col items-center'>
            <Link
                onClick={handleLogout}
                to="/login"
                className="text-gray-800 hover:bg-gray-200 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none border border-blue-800"
            >
                Logout
            </Link>
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
