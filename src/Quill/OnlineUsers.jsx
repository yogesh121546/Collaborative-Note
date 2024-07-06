import React, { useState } from 'react';
import './OnlineUsers.css'; // Assuming you'll add the CSS here

const OnlineUsers = ({users}) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const USERS = users.current.map(user => <li className='dropdown-item'><div style={{backgroundColor: user.color}}></div><p>{user.name}</p></li>)
  return (
    <div className="dropdown">
      <button onClick={toggleDropdown} className="dropdown-toggle">
        {(users.current.length>0)?`${users.current.length}`:''} Online Users <span className="arrow">&#9660;</span>
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
           {USERS}
        </ul>
      )}
    </div>
  );
};

export default OnlineUsers;