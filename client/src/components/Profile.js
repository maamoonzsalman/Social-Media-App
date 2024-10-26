import React, {useState, useEffect, useContext} from "react";
import Link, {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import { UserContext } from "../contexts/UserContext";
import Sidebar from "./Sidebar";
import UsersModal from "./UsersModal";
import '../styles/Profile.css'

const Profile = () => {
    
    const [profileData, setProfileData] = useState({
        profilePic: '',
        bio: null,
        posts: [],
        followers: [],
        following: [],
      })

    const [followersModalStatus, setFollowersModalStatus] = useState(false)
    const [followingModalStatus, setFollowingModalStatus] = useState(false)
    const {loggedInUser, setLoggedInUser} = useContext(UserContext)

    const {username} = useParams();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/users/${username}`, {withCredentials: true})
                setProfileData(response.data.userProfile)
                console.log(`This is the user's profile: `, response.data.userProfile)
            } catch (error) {
                console.log('Error fetching user profile')
            }
        }
        
        fetchUserProfile()

    }, [username])

    const handleFollow = async () => {
        const response = await axios.post(`http://localhost:4000/api/followers/addfollow/${profileData.id}/${loggedInUser.id}`)
        console.log(response.data)
    }

    const openFollowersModal = () => {
        setFollowersModalStatus(true)
    }

    const closeFollowersModal = () => {
        setFollowersModalStatus(false)
    }

    const openFollowingModal = () => {
        setFollowingModalStatus(true)
    }

    const closeFollowingModal = () => {
        setFollowingModalStatus(false)
    }

    return (
        <div className="profile-page">
            <Sidebar/>
            {profileData ? (
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
                            {username === loggedInUser.username ? (
                            <>
                            <div className='edit-profile-btn-container'><button className='edit-profile-btn'>Edit Profile</button></div>
                            <div className='settings-btn-container'><button className='settings-btn'>Settings</button></div>
                            </>
                            ) : (
                                <div className='follow-btn-container'><button className='follow-btn' onClick={handleFollow}>Follow</button></div>
                            )}
                        </div>
                        <div className='user-info-middle'>
                            <div className='user-metric posts-count'>{profileData.posts.length} posts</div>
                            <div className='user-metric followers-count' onClick={openFollowersModal}>{profileData.followers.length} followers</div>
                            <div className='user-metric following-count' onClick={openFollowingModal}>{profileData.following.length} following</div>
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

            ) : (
                <div> Fetching Profile Data... </div>
            )}
            
            {followersModalStatus && (
                <UsersModal onClose={closeFollowersModal} type='Followers' usersArray={profileData.followers}/>
            )}

            {followingModalStatus && (
                <UsersModal onClose={closeFollowingModal} type='Following' usersArray={profileData.following}/>
            )}

        </div>
    )
}

export default Profile;