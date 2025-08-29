import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <nav>
      <Link to="/">Problems</Link>
      
      <Link to="/users">Users</Link>
    </nav>
  );
};

export default Header;
