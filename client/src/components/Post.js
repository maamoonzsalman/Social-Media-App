import React, {useState, useEffect, useContext} from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/Post.css';
import Sidebar from "./Sidebar";
import 'boxicons'
import { UserContext } from "../contexts/UserContext";

const Post = ({Post}) => {
    const postId = useParams().postId;
    const username = useParams().username
    const {loggedInUser, setLoggedInUser} = useContext(UserContext);
    const [postData, setPostData] = useState(null)
    const [likedPost, setLikedPost] = useState(null)
    
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/posts/${postId}`, {withCredentials: true})
                const post = response.data.post
                console.log('post data: ', post)
                setPostData(post)
            } catch (error) {   
                console.log('Error fetching post: ', error)
            }
        }
        fetchPost()
    }, [])

    useEffect(() => {
        const getLikedStatus = async () => {    
            console.log('hey')
            try {
                for (let i = 0; i < postData.likes.length; i++) {
                    if (postData.likes[i].userId === loggedInUser.id) {
                        console.log('post is liked')
                        setLikedPost(true)
                        return;
                    } 
                }
                console.log('not liked')
                setLikedPost(false);
            } catch (error) {
                console.log('Error fetching following status')
            }
            
        }

        getLikedStatus()
    }, [postData])

    const handleLike = async () => {
        try {
            const response = await axios.post(`http://localhost:4000/api/posts/${postData.id}/${loggedInUser.id}/likepost`)
        } catch(error) {
            console.log('error liking post: ', error)
        }
    }

    const handleUnlike = async () => {
        try {
            const response = await axios.delete(`http://localhost:4000/api/posts/${postData.id}/${loggedInUser.id}/unlikepost`)
        } catch(error) {
            console.log('error liking post: ', error)
        }
    }



    return (
        <div className='post-page'>
            <Sidebar/>
            {postData ? (
            <div className='post-container'>
                <div className='post-author'>
                    <div className='post-author-profilepic-container'>
                        <img
                        src={postData.user.profilePic}
                        className='post-author-profilepic'
                        >    
                        </img>
                    </div>
                    <div className='post-author-username'>
                        {postData.user.username}
                    </div>
                </div>
                <div className='post-image-container'>
                    <img
                    src={postData.image}
                    className='post-image'
                    >
                    </img>
                </div>
                <div className='post-info'>
                    <div className='post-caption-container'>
                        {postData.caption}
                    </div>
                    <div className='post-likes-container'>
                        <div className='post-heart-container'>
                            {(likedPost === true) ? (    
                                <box-icon name='heart' type='solid' onClick={handleUnlike} ></box-icon>
                            ) : (
                                <box-icon name='heart' onClick={handleLike}></box-icon>
                            )}
                        </div>
                        <div className='post-like-count'>
                        {postData.likes.length} Likes
                        </div>                        
                    </div>
                </div>
                <div className='post-comments'>
                    Comments
                </div>

            </div>
            ) : (
                <div>Fetching post data... </div>
            )}
        </div>
    )
}

export default Post;