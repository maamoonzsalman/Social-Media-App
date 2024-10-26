import React, {useState, useEffect, useContext} from "react";
import '../styles/UsersModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons'; // Import the "times" icon
import { UserContext } from "../contexts/UserContext";

const UsersModal = ({onClose, type }) => {

    const {currentUser, setCurrentUser} = useContext(UserContext)

    const users = [{username: 'Moon', profilePic: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}, 
                   {username: 'John', profilePic: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"},
                   {username: 'John', profilePic: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"},
                   {username: 'John', profilePic: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"},
                   {username: 'John', profilePic: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"},
                   {username: 'John', profilePic: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"},
                   {username: 'John', profilePic: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"},
                   {username: 'John', profilePic: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"},
                   {username: 'John', profilePic: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"},]

    

        
    return (
        <div className='modal-overlay'>
            <div className='modal'>
                <div className='modal-title'>
                    <div className='modal-type'>
                        {type}
                        {currentUser}
                    </div>
                    <div className='modal-close-btn-container'>
                        <button className='modal-close-btn' onClick={onClose}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                </div>
                <div className='modal-list'>
                    
                    
                    {users.map((user, index) => (
                        <div className='modal-user-container' key={index}>
                            <div className='modal-list-left'>
                                <div className='modal-profile-picture-container'>
                                    <img className='modal-profile-picture'
                                    src={user.profilePic}
                                    alt={`${user.username}'s profile`}
                                    
                                    />
                                </div>
                                <div className='modal-user-name'>
                                    {user.username}
                                </div>
                            </div>
                            <div className='modal-list-right'>
                                <div className='modal-remove-btn-container'>
                                    <button className='modal-remove-btn'>Remove</button>
                                </div>
                            </div>
                        
                        </div >
                    ))}    


                </div>
            </div>
        </div>
    )
}

export default UsersModal;