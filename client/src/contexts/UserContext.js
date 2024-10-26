import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the context
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(''); 

  // Function to fetch the logged-in user
  const fetchLoggedInUser = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/users/loggedinuser', { withCredentials: true });
      setLoggedInUser(response.data.userProfile);
      console.log('Logged in user data: ', response.data.userProfile)
    } catch (error) {
      console.log(error);
      setLoggedInUser(null); // Clear logged-in user if there’s an error
    }
  };

  useEffect(() => {
    fetchLoggedInUser(); // Fetch user on initial load
  }, []); // Only on component mount

  return (
    <UserContext.Provider value={{ loggedInUser, setLoggedInUser, fetchLoggedInUser }}>
      {children}
    </UserContext.Provider>
  );
};

