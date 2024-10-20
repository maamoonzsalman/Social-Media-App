import React, {useEffect, useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function App() {
  
    const [message, setMessage] = useState('')
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        firstName: '',
        lastName: ''
    })
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post('http://localhost:4000/api/users', { withCredentials: true, formData });
        setMessage(response.data.message)
        navigate(response.data.redirectTo)
    } catch (error) {
        setMessage('Error registering user')
        console.error('Error registering user')
    }
  }
  
  return (
    <div>
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

        <Link to='/login'><button>Already have an account? Click here to login.</button></Link>
    </form>
            {message && <p style={{ color: 'red' }}>{message}</p>}
    </div>

  );
}

export default App;
