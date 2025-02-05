import React from 'react';
import { useNavigate } from 'react-router-dom';
import Auth from './Auth';
import './LoginPage.css';

function LoginPage() {
    const navigate = useNavigate();

    const handleLoginSuccess = (token) => {
        // Store the token
        localStorage.setItem('token', token);
        // Redirect to main page
        navigate('/home');
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h1>Welcome to Basketball Training</h1>
                <p>Sign in to start improving your game</p>
                <Auth setToken={handleLoginSuccess} />
            </div>
        </div>
    );
}

export default LoginPage; 