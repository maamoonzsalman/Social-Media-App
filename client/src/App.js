import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Routes instead of Switch
import './styles/App.css'
import Register from './components/Register'
import Login from './components/Login'
import Sidebar from './components/Sidebar';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path='/login' element ={<Login />} />
          <Route path='/' element ={<Sidebar />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
