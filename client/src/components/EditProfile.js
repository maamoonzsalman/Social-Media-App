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
    const [fileName, setFileName] = useState('Choose file');


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

        console.log('bio: ', profileData.bio)
        try {
            const formData = new FormData();
            formData.append('bio', profileData.bio)
            formData.append('profilePic', profileData.profilePic)
            formData.append('username', loggedInUser.username)
            console.log('formData: ', formData)
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
        setFileName(file ? file.name : "Choose file");
        setProfileData({ ...profileData, profilePic: file});
   }

    return (
        <div className='edit-profile-page'>
            <Sidebar/>
            <div className='edit-profile-form-container'>
              {loggedInUser && username === loggedInUser.username ? (
                <form className='edit-profile-form' onSubmit={handleSaveProfile}>
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
                        <label className="custom-file-label">
                                {fileName}
                                <input
                                    type="file"
                                    className="input-profile-pic"
                                    name="profilePic"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: "none" }} // Hide the original file input
                                />
                            </label>
                    </div>

                    <div className='submit-container'>
                        <button type='submit' className='submit-edit-profile'>Update Profile</button>
                    </div>
                </form>
              ) : (
                <div className='edit-profile-unauthorized'>You are unauthorized</div>
              )}
            </div>
        </div>
      );
}

export default EditProfile;

