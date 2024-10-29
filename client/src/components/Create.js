import React, {useState, useEffect, useContext} from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/Create.css';
import Sidebar from "./Sidebar";
import { UserContext } from "../contexts/UserContext";

const Create = () => {
    const {loggedInUser, setLoggedInUser} = useContext(UserContext)
    const username = useParams().username;
    const [postData, setProfileData] = useState({
        caption: '',
        image: ''
      });
    
    const navigate = useNavigate();
    const [fileName, setFileName] = useState('Choose file');

    const handleUploadPost = async (e) => {
        e.preventDefault();
        console.log(postData.caption)
        console.log(postData.image)
        console.log(loggedInUser.id)
        try {
            const formData = new FormData();
            formData.append('caption', postData.caption)
            formData.append('image', postData.image)
            formData.append('userId', loggedInUser.id)
            
            const response = await axios.post(`http://localhost:4000/api/posts/${loggedInUser.id}/uploadpost`, formData, {withCredentials: true, headers: {
            'Content-Type': 'multipart/form-data',
                }, 
            });
            

            navigate(`/${loggedInUser.username}`)
            
        } catch (error) {
            console.log('error updating profile: ', error )
        }
        
   }

   const handleCaptionChange = (e) => {
        const { name, value } = e.target;
        setProfileData({ ...postData, [name]: value });
   }

   const handleImageChange = (e) => {
        const file = e.target.files[0]
        setFileName(file ? file.name : "Choose file");
        setProfileData({ ...postData, image: file});
   }

    return (
        <div className='create-post-page'>
            <Sidebar/>
            <div className='create-post-form-container'>
              {loggedInUser && username === loggedInUser.username ? (
                <form className='create-post-form' onSubmit={handleUploadPost}>
                    <div className='caption-container'>
                        <label className='label-caption'>Caption:</label>
                        <textarea
                        type='text'
                        className='input-caption'
                        value={postData.caption || ''}
                        onChange={handleCaptionChange}
                        name='caption'
                        />
                        
                    </div>

                    <div className='post-pic-container'>
                        <label className='label-post-pic'>Upload Image:</label>
                        <label className="custom-file-label">
                                {fileName}
                                <input
                                    type="file"
                                    className="input-post-pic"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: "none" }}
                                    required
                                />
                            </label>
                    </div>

                    <div className='submit-post-container'>
                        <button type='submit' className='submit-upload-post'>Upload Post</button>
                    </div>
                </form>
              ) : (
                <div className='edit-profile-unauthorized'>You are unauthorized</div>
              )}
            </div>
        </div>
      );
}

export default Create;