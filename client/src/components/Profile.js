import React, {useState, useEffect, useContext} from "react";
import {useNavigate, useParams, Link} from 'react-router-dom';
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
    const [isFollowing, setIsFollowing] = useState(null)
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

    useEffect(() => {
        const getFollowingStatus = async () => {    
            if (username !== loggedInUser.username) {
                try {
                    for (let i = 0; i < loggedInUser.following.length; i++) {
                        if (loggedInUser.following[i].followingId === profileData.id) {
                            setIsFollowing(true)
                            return;
                        } 
                    }
                    setIsFollowing(false);
                } catch (error) {
                    console.log('Error fetching following status')
                }
            }
        }

        getFollowingStatus()
    }, [profileData.id, loggedInUser.following])

    const handleFollow = async () => {
        try {
            const response = await axios.post(`http://localhost:4000/api/follows/addfollow/${profileData.id}/${loggedInUser.id}`)
            setIsFollowing(true);
            
        } catch (error) {
            console.log('error following user: ', error)
        }
             
    }

    const handleRemoveFollow = async(followingId, followerId) => {
        try {
            const response = await axios.delete(`http://localhost:4000/api/follows/removefollow/${followingId}/${followerId}`)
            setIsFollowing(false);
        } catch (error) {
            console.log('Error removing follower')
        }

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
                            <div className='edit-profile-btn-container'><Link to={`/users/${loggedInUser.username}/editprofile`}><button className='edit-profile-btn'>Edit Profile</button></Link></div>
                           <Link to={`/${loggedInUser.username}/settings`}><div className='settings-btn-container'><button className='settings-btn'>Settings</button></div> </Link>
                            </>
                            ) : (
                                isFollowing ? ( 
                                <div className='unfollow-btn-container'><button className='unfollow-btn' onClick={() => handleRemoveFollow(profileData.id, loggedInUser.id)}>Unfollow</button></div>
                                ) : (
                                    <div className='follow-btn-container'><button className='follow-btn' onClick={handleFollow}>Follow</button></div>
                                )
                            )}
                        </div>
                        <div className='user-info-middle'>
                            <div className='user-metric posts-count'>{profileData.posts.length} posts</div>
                            <div className='user-metric followers-count' onClick={openFollowersModal}>{profileData.followers.length} followers</div>
                            <div className='user-metric following-count' onClick={openFollowingModal}>{profileData.following.length} following</div>
                        </div>
                        <div className='user-info-botom'>
                            <div className='user-bio'>{profileData.bio}</div>
                        </div>
                    </div>
                </div>
                <div className='profile-posts-container'>
                    {profileData.posts.map((post) => {
                        return (
                            <Link to={`/${username}/${post.id}`}>
                                <div className='profile-post-container'>
                                    <img
                                    className='profile-post-img'    
                                    src={post.image}
                                    > 
                                    </img>
                                </div>
                            </Link>
                        )
                    })}

                    
                </div>
            </div>

            ) : (
                <div> Fetching Profile Data... </div>
            )}
            
            {followersModalStatus && (
                <UsersModal onClose={closeFollowersModal} type='Followers' usersArray={profileData.followers} handleRemoveFollow={handleRemoveFollow}/>
            )}

            {followingModalStatus && (
                <UsersModal onClose={closeFollowingModal} type='Following' usersArray={profileData.following} handleRemoveFollow={handleRemoveFollow}/>
            )}

        </div>
    )
}

export default Profile;