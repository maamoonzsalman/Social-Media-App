import React, {useState, useEffect, useContext} from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import Post from "./Post";
import 'boxicons'
import { UserContext } from "../contexts/UserContext";
import '../styles/Feed.css'

const Feed = () => {
    const {loggedInUser, setLoggedInUser} = useContext(UserContext)
    const [followingPosts, setFollowingPosts] = useState(null)

   useEffect(() => {
    const fetchFeedPosts = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/api/posts/following/${loggedInUser.id}`)
            const posts = response.data.posts
            console.log('posts',posts)
            setFollowingPosts(posts)
        } catch (error) {
            console.log('error fetching posts for feed: ', error)
        }
    }
    fetchFeedPosts()
   },[loggedInUser])

    return (
        <div className='feed-page'>
            <Sidebar/>
            {followingPosts ? (
                <div className='feed-page-post-container'>
                    {followingPosts.map((post) => (
                        <Post Post={post}/>
                    ))}
                </div>
            ) : (
                <div className='loading'>
                    Fetching posts...
                </div>
            )}
        </div>
    )
}

export default Feed;