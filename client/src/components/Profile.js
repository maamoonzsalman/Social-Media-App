import React, {useState, useEffect} from "react";
import Link, {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import Sidebar from "./Sidebar";
import '../styles/Profile.css'

const Profile = () => {
    
    const [profileData, setProfileData] = useState({})
    const [currentUser, setCurrentUser] = useState('')
    const {username} = useParams();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/users/${username}`, {withCredentials: true})
                setProfileData(response.data.userProfile)
                console.log(response.data.userProfile)
            } catch (error) {
                console.log('Error fetching user profile')
            }
        }
        
        fetchUserProfile()

    }, [username])

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/users/currentuser', {withCredentials: true})
                setCurrentUser(response.data.username)
                console.log(response.data.username)
            } catch(error) {
                console.log(error)
            }
        };
        fetchCurrentUser();
        
    }, [])

    return (
        <div className="profile-page">
            <Sidebar/>
            <div className="profile-container">
                <div className='user-info-container'>
                    <div className="profile-picture-container">
                        <img
                            src={profileData.profilePic}
                            alt={`{profileData.username}'s profile`}
                            className="profile-picture"
                        />
                    </div>
                    <div className='user-info'>
                        <div className='user-info-top'>
                            <div className='username'>{username}</div>
                            <div className='edit-profile-btn-container'><button className='edit-profile-btn'>Edit Profile</button></div>
                            <div className='settings-btn-container'><button className='settings-btn'>Settings</button></div>
                        </div>
                        <div className='user-info-middle'>
                            <div className='user-metric posts-count'>{profileData.posts.length} posts</div>
                            <div className='user-metric followers-count'>{profileData._count.followers} followers</div>
                            <div className='user-metric following-count'>{profileData._count.following} following</div>
                        </div>
                        <div className='user-info-botom'>
                            <div className='user-bio'>Bio: {profileData.bio}</div>
                        </div>
                    </div>
                </div>
                <div className='posts-container'>
                    Posts
                </div>
            </div>
        </div>
    )
}

export default Profile;