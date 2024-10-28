import React, {useState, useEffect, useContext} from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/EditProfile.css';
import Sidebar from "./Sidebar";
import { UserContext } from "../contexts/UserContext";


const EditProfile = () => {
    const {loggedInUser, setLoggedInUser} = useContext(UserContext)
    const username = useParams().username;
    const [image, setImage] = useState('')
    const [profileData, setProfileData] = useState({
        bio: loggedInUser.bio,
        profilePic: loggedInUser.profilePic || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
        username: loggedInUser.username
      });
    
   
    const navigate = useNavigate();

    useEffect(() => {
        if (loggedInUser) {
            setProfileData({
                bio: loggedInUser.bio,
                profilePic: loggedInUser.profilePic || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
                username: loggedInUser.username
            });
        }
    }, [loggedInUser]);

    const handleSaveProfile = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('bio', profileData.bio)
            formData.append('profilePic', profileData.profilePic)
            formData.append('username', loggedInUser.username)

            const response = await axios.put(`http://localhost:4000/api/users/${username}/editprofile`, formData, {withCredentials: true, headers: {
            'Content-Type': 'multipart/form-data',
                }, 
            });

            navigate(response.data.redirectTo)
        } catch (error) {
            console.log('error updating profile: ', error )
        }
        
   }

   const handleBioChange = (e) => {
        const { name, value } = e.target;
        setProfileData({ ...profileData, [name]: value });
   }

   const handleImageChange = (e) => {
        const file = e.target.files[0]
        setProfileData({ ...profileData, profilePic: file});
   }

    return (
        <div className='edit-profile-page'>
            <Sidebar/>
            <>
              {loggedInUser && username === loggedInUser.username ? (
                <form onSubmit={handleSaveProfile}>
                    <div className='bio-container'>
                        <label className='label-bio'>Bio:</label>
                        <textarea
                        type='text'
                        className='input-bio'
                        value={profileData.bio || ''}
                        onChange={handleBioChange}
                        name='bio'
                        />
                        
                    </div>

                    <div className='profile-pic-container'>
                        <label className='label-profile-pic'>Upload Profile Picture:</label>
                        <input
                        type='file'
                        className='input-profile-pic'
                        name='profilePic'
                        accept='image/*'
                        onChange={handleImageChange}
                        >
                        </input>
                    </div>

                    <div className='submit-container'>
                        <button type='submit'>Update Profile</button>
                    </div>
                </form>
              ) : (
                <div className='edit-profile-unauthorized'>You are unauthorized</div>
              )}
            </>
        </div>
      );
}

export default EditProfile;

