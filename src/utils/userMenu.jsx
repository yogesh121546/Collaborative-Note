import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { HiUser, HiUserCircle } from "react-icons/hi2"; 
import './userMenu.css'; 
import errorHandler from './errorhandler';
import axios from 'axios';
const UserMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    // Cookies.remove('token',{ path: '/' }); 
    axios.get(`${import.meta.env.VITE_BACKEND_SERVER_URI}/api/v1/logout`, {withCredentials: true})
    .then((res) => { alert("Logged out") ;window.location.reload();})
    .catch((err) => {console.log(err) ;errorHandler(err)});
  };


  return (
    <div className="user-menu">
      <div onClick={() => setMenuOpen(!menuOpen)} style={{ cursor: 'pointer' }}>
      <HiUser className='icon'/>
      </div>
      {menuOpen && (
        <div className="dropdown-user-menu">
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
