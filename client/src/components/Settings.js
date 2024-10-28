import React, {useState, useEffect, useContext} from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/Settings.css';
import Sidebar from "./Sidebar";
import { UserContext } from "../contexts/UserContext";


const Settings = () => {
    const {loggedInUser, setLoggedInUser} = useContext(UserContext)
    const username = useParams().username;
    const navigate = useNavigate();
    
    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://localhost:4000/api/users/${loggedInUser.id}/delete`, {withCredentials: true})
            navigate(response.data.redirectTo)
        } catch (error) {
            console.log('error deleting account: ', error)
        }
     }

    return (
        <div className='settings-page'>
            <Sidebar/>
            <div className='settings-form-container'>
              {loggedInUser && username === loggedInUser.username ? (
                <div className='delete-account-btn-container'> 
                    <button className='delete-account-btn' onClick={handleDelete}>Delete Account</button>
                </div>
              ) : (
                <div className='settings-unauthorized'>You are unauthorized</div>
              )}
            </div>
        </div>
      );
}

export default Settings;

