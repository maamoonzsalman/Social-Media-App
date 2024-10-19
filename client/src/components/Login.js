import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const [backendData, setBackendData] = useState([{}]) 

  useEffect(() => {
    const fetchBackend = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api", { withCredentials: true });
        setBackendData(response.data)
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching backend', error);
      }
    };

    fetchBackend();
  }, []);
  
  return (
    <div>
      Hello
    </div>
  );
}

export default App;
