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
    const [newCommentData, setNewCommentData] = useState({
        text: '',
        userId: loggedInUser.id
    })

    useEffect(() => {
        if (loggedInUser) {
            setNewCommentData((prevData) => ({
                ...prevData,
                userId: loggedInUser.id
            }));
        }
    }, [loggedInUser]);
    
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
                        setLikedPost(true)
                        return;
                    } 
                }
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

    const handleCommentChange = (e) => {
        const { name, value } = e.target;
        setNewCommentData({ ...newCommentData, [name]: value });
    }

    const handlePostComment = async (e) => {
        e.preventDefault();
        console.log('new',newCommentData)
        try {
            const response = await axios.post(`http://localhost:4000/api/comments/${postData.id}`, {withCredentials: true, commentData: newCommentData})
            console.log(response.data.comment)
        } catch (error) {
            console.log('Error posting comment: ', error)
        }
    }

    const handleDeleteComment = async (commentId) => {
        try {
            const response = await axios.delete(`http://localhost:4000/api/comments/${commentId}`, {withCredentials: true})
        } catch (error) {
            console.log('Error deleting comment: ', error)
        }
    }

    const handleDeletePost = async () => {
        try {
            const response = await axios.delete(`http://localhost:4000/api/posts/${postData.id}`, {withCredentials: true})
        } catch(error) {
            console.log('Error deleting post ' , error)
        }
    }    

    return (
        <div className='post-page'>
            <Sidebar/>
            {postData ? (
            <div className='post-container'>
                <div className='post-author'>
                    <div className='post-author-data-container'>
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
                    {(loggedInUser.username === postData.user.username) && (
                        <div>
                            <button className='delete-post-btn' onClick={handleDeletePost}>Delete Post</button>
                        </div>
                    )}
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
                <div className='post-comments-container'>
                    <div className='comments-title'> 
                            Comments
                    </div>
                    <div className='comments-container'>
                            
                            {postData.comments.map((comment) => {
                                return (
                                    <div className='comment-container'>
                                        <Link to={`/${comment.user.username}`} className='comment-author-link'>
                                            <div className='comment-author-container'>
                                                <div className='comment-username-container'> 
                                                    {comment.user.username}
                                                </div>
                                                <div className='comment-profilepic-container'> 
                                                    <img
                                                        src={comment.user.profilePic}
                                                        className='comment-profilepic'
                                                    >
                                                    </img>
                                                </div>
                                            </div>
                                        </Link>
                                        <div className='comment-text-container'> 
                                            {comment.text}
                                        </div>
                                    
                                        <div className='comment-delete-btn-container'>
                                        {(loggedInUser.username === postData.user.username || loggedInUser.username === comment.user.username) && (    
                                            <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                                        )}
                                        </div>
                                    </div>
                                )
                            })}

                    </div>
                    <div className='add-comment-container'>
                            <form className='add-comment-form' onSubmit={handlePostComment}>
                                <textarea
                                placeholder='Add a comment...'
                                type='text'
                                value={newCommentData.text}
                                onChange={handleCommentChange}
                                name='text'
                                className='comment-text-area'
                                >
                                </textarea>
                                <button type='submit'>Post</button>
                            </form>
                    </div>
                </div>

            </div>
            ) : (
                <div>Fetching post data... </div>
            )}
        </div>
    )
}

export default Post;