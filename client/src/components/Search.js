import React, {useState, useEffect, useContext} from 'react' 
import { useNavigate,Link } from 'react-router-dom'
import axios from 'axios'
import { UserContext } from "../contexts/UserContext";
import Sidebar from './Sidebar';
import 'boxicons'
import '../styles/Search.css'


const Search = () => {

    return (
        <Sidebar/>
    )
};

export default Search;
