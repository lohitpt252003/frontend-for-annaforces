import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './index.css';

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    return (
        <header className="app-header">
            <div className="logo">
                <Link to="/welcome">Annaforces</Link>
            </div>
            <nav className="main-nav">
                <ul>
                    <li>
                        <Link to="/welcome">Home</Link>
                    </li>
                    <li>
                        <Link to="/problems">Problems</Link>
                    </li>
                    {isLoggedIn ? (
                        <li>
                            <Link to="/logout" className="logout-button">Logout</Link>
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