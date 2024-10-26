import { createContext, useState, useEffect } from 'react';
import axios from 'axios'

// Create the context
export const UserContext = createContext();



// Create the provider component
export const UserProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(''); // Default state for the logged in user

  useEffect(() => {
    const fetchLoggedInUser = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/users/loggedinuser', {withCredentials: true})
            console.log('This is the data of the logged in user: ', response.data.userProfile)
            console.log('This is the logged in username: ', response.data.userProfile.username)
            setLoggedInUser(response.data.userProfile)
        } catch(error) {
            console.log(error)
        }
    };
    fetchLoggedInUser();
    
}, [])

  return (
    <UserContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      {children}
    </UserContext.Provider>
  );
};
