import React, {useEffect, useState} from 'react';
import axios from 'axios';

function App() {
  const [backendData, setBackendData] = useState([{}]) 
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: ''
  })

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

  const handleRegister = async () => {
    try {
        const response = await axios.post('http://localhost:4000/api/users', { withCredentials: true, formData });
    } catch (error) {
        console.error('Error registering user')
    }
  }
  
  return (
    <form onSubmit={handleRegister}>
        
        <label>Username</label>
        <input
        type="text"
        required
        value = {formData.username}
        onChange={(e) => setFormData((prevFormData) => ({
            ...prevFormData,
            username: e.target.value
        }))}>
        </input>
        
        <label>Password</label>
        <input 
        type="password" 
        required
        value = {formData.password}
        onChange={(e) => setFormData((prevFormData) => ({
            ...prevFormData,
            password: e.target.value
        }))}>
        
        </input>

        <label>Email</label>
        <input 
        type="email" 
        required
        onChange={(e) => setFormData((prevFormData) => ({
            ...prevFormData,
            email: e.target.value
        }))}>
        </input>

        <label>First Name</label>
        <input 
        type="text" 
        required
        onChange={(e) => setFormData((prevFormData) => ({
            ...prevFormData,
            firstName: e.target.value
        }))}>

        </input>

        <label>Last Name</label>
        <input 
        type="text" 
        required
        onChange={(e) => setFormData((prevFormData) => ({
            ...prevFormData,
            lastName: e.target.value
        }))}>
        </input>

        <button type="submit" required>Register</button>
    </form>
  );
}

export default App;
