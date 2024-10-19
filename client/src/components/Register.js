import React, {useEffect, useState} from 'react';
import axios from 'axios';

function App() {
  const [backendData, setBackendData] = useState([{}]) 
  

  useEffect(() => {
    const fetchBackend = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api", { withCredentials: true });
        setBackendData(response.data)
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching backend', error);
      }
    };

    fetchBackend();
  }, []);


  
  return (
    <form onSubmit={handleRegister}>
        <label>Username</label>
        <input type="text"></input>

        <label>Password</label>
        <input type="password"></input>

        <label>Email</label>
        <input type="email"></input>

        <label>First Name</label>
        <input type="text"></input>

        <label>Last Name</label>
        <input type="text"></input>

        <button type="submit">Register</button>
    </form>
  );
}

export default App;
