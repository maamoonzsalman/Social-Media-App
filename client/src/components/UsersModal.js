import React, {useState, useEffect, useContext} from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import '../styles/UsersModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons'; // Import the "times" icon
import { UserContext } from "../contexts/UserContext";

const UsersModal = ({onClose, type, usersArray, handleRemoveFollow }) => {

    const {loggedInUser, setLoggedInUser} = useContext(UserContext)
    const {username} = useParams();
        
    return (
        <div className='modal-overlay'>
            <div className='modal'>
                <div className='modal-title'>
                    <div className='modal-type'>
                        {type}
                    </div>
                    <div className='modal-close-btn-container'>
                        <button className='modal-close-btn' onClick={onClose}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                </div>
                <div className='modal-list'>
                    
                    
                    {usersArray.map((user) => {
                        
                        const profile = type === 'Followers' ? user.follower : user.following;
                        
                        return (
                        <div className='modal-user-container' key={profile.id}>
                            <div className='modal-list-left'>
                                <Link to={`/${profile.username}`} onClick={onClose}>
                                    <div className='modal-profile-picture-container'>
                                        <img className='modal-profile-picture'
                                        src={profile.profilePic}
                                        alt={`${profile.username}'s profile`}  
                                        />
                                    </div>
                                </Link>
                                <Link to={`/${profile.username}`} onClick={onClose}>
                                    <div className='modal-user-name'>
                                       {profile.username}
                                    </div>
                                </Link>
                            </div>
                            <div className='modal-list-right'>
                                {username === loggedInUser.username && (
                                    <div className='modal-remove-btn-container'>
                                        <button
                                         className='modal-remove-btn' 
                                         onClick={() => 
                                         type==='Followers'
                                         ? handleRemoveFollow(loggedInUser.id, profile.id)
                                         : handleRemoveFollow(profile.id, loggedInUser.id)
                                            
                                         }     
                                         >Remove
                                         </button>
                                    </div>
                                )}
                            </div>
                        
                        </div >
                        ); 
                    })}    

                </div>
            </div>
        </div>
    )
}


export default UsersModal;