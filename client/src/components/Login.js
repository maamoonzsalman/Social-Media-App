import React, {useState, useEffect} from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import '../styles/Login.css'

function Login() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })
    const [message, setMessage] = useState('')
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/api/authorization/login', {
                username: formData.username,   // Send formData directly
                password: formData.password
            }, { withCredentials: true });  // Use `withCredentials` for cookies/session support
            navigate(response.data.redirectTo)
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>

            <form className='page' onSubmit={handleLogin}>
                <div className='login-form'>
                    <div className="field-container">
                        <label>Username</label>
                        <input
                        required
                        type='text'
                        value = {formData.email}
                        onChange={(e) => setFormData((prevFormData) => ({
                            ...prevFormData,
                            username: e.target.value
                        }))}>
                        </input>
                    </div>
                
                    <div className="field-container">
                        <label>Password</label>
                        <input
                        required
                        type='password'
                        value={formData.password}
                        onChange={(e) => setFormData((prevFormData) => ({
                            ...prevFormData,
                            password: e.target.value
                        }))}>
                        </input>
                    </div>
                    
                    <div className="field-container">
                        <button className='login button' type="submit" required>Login</button>
                    </div>
                
                    <div className="field-container">
                        <Link to='/register' className="login button"><button>New? Click here to create an account.</button></Link>
                    </div>
                    {message && <p style={{ color: 'red' }}>{message}</p>}
                </div>
            </form>
            
        </div>
    )
}

export default Login;