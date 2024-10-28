import React, {useState, useEffect, useContext} from 'react' 
import { useNavigate,Link } from 'react-router-dom'
import axios from 'axios'
import { UserContext } from "../contexts/UserContext";
import 'boxicons'
import '../styles/Sidebar.css'

function Sidebar() {
    const {loggedInUser, setLoggedInUser, fetchLoggedInUser} = useContext(UserContext)
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:3000/api/authorization/logout', {withCredentials: true})    
            setLoggedInUser('');
            fetchLoggedInUser();
            navigate('/login')
        } catch (error) {
            console.log('error logging out')
        }
    }

    return (
    
    <div className='sidebar-container'>
        {loggedInUser ? (
        <div className='sidebar-items'>
            <div className='sidebar-welcome'>Welcome to Moonbook, {loggedInUser.username}</div>
            <div className='sidebar-list'>
                <Link to='/' className='sidebar-link'><div className='sidebar-item'>Home</div><div><box-icon name='home'  color='white' type='solid'></box-icon></div></Link>           
                <Link to='/users/search' className='sidebar-link'><div className='sidebar-item'>Search</div><div><box-icon name='search-alt-2' color='white'></box-icon></div></Link>            
                <Link to={`/${loggedInUser.username}/create`} className='sidebar-link'><div className='sidebar-item'>Create</div><div><box-icon name='upload' color='white'></box-icon></div></Link>            
                <Link to={`/${loggedInUser.username}`} className='sidebar-link'><div className='sidebar-item'>Profile</div><div><box-icon name='user-account' color='white' type='solid'></box-icon></div></Link>            
                <Link className='sidebar-link' onClick={handleLogout}><div className='sidebar-item'>Logout</div><div><box-icon name='log-out-circle' color='white' type='solid'></box-icon></div></Link>                        
            </div>
        </div>

        ) : (
            <div>Fetching user data...</div>
        )}

    </div>     
    
    )
}

export default Sidebar;