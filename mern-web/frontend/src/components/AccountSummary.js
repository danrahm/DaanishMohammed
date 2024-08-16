import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function AccountSummary() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  axios.defaults.withCredentials= true;
  useEffect(() => {
    async function fetchUser() {
      try {
        // Retrieve userId from session storage
        const userId = sessionStorage.getItem('userId');

        // Extract email from location state or navigate to login if not present
        const email = location.state?.email;
        if (!email) {
          navigate('/login');
          return;
        }

        // Fetch user details based on email and userId
        const response = await axios.post('http://localhost:3000/account/user', { userId, email }, { withCredentials: true });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
        navigate('/login');
      }
    }

    fetchUser();
  }, [navigate, location.state]);

  return (
    <div>
      <h1>Account Summary</h1>
      <p>First Name: {user.firstName}</p>
      <p>Last Name: {user.lastName}</p>
      <p>Email: {user.email}</p>
      <p>Phone Number: {user.phoneNumber}</p>
    </div>
  );
}

export default AccountSummary;
