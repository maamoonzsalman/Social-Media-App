import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar'; // Import Sidebar component
import '../styles/Search.css'; // Make sure to create a CSS file for custom styles
import { UserContext } from "../contexts/UserContext";


const Search = () => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (query.trim() !== '') {
      const fetchUsers = async () => {
        try {
          const response = await axios.get('http://localhost:4000/api/users/search', {
            params: { query },
            withCredentials: true,
          });
          setUsers(response.data);
        } catch (error) {
          console.error('Error searching users:', error);
        }
      };

      fetchUsers();
    } else {
      setUsers([]);
    }
  }, [query]);

  return (
    <div className="search-page">
      <Sidebar/> 
      <div className="search-container">
        <h2>Search Users</h2>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by username"
          className="search-bar"
        />
        <div className="user-list">
          {users.length > 0 ? (
            users.map(user => (
              <div key={user.id} className="user-item">
                <Link to={`/${user.username}`} className='user-link'>
                    <img
                      src={user.profilePic || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
                      alt={`${user.username}'s profile`}
                      className="user-profile-pic"
                    />
                      {user.username}
                </Link>
              </div>
            ))
          ) : (
            query && <p>No users found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;

