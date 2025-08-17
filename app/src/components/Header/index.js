import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('user_id');
        if (userId) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user_id');
        localStorage.removeItem('username');
        localStorage.removeItem('name');
        setIsLoggedIn(false);
        navigate('/login');
    };

    return (
        <header className="app-header">
            <div className="logo">
                <Link to="/">Annaforces</Link>
            </div>
            <nav className="main-nav">
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/problems">Problems</Link>
                    </li>
                    {isLoggedIn ? (
                        <li>
                            <button onClick={handleLogout} className="logout-button">Logout</button>
                        </li>
                    ) : (
                        <li>
                            <Link to="/login">Login</Link>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Header;