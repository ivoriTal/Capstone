import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css'; 

const Auth = ({ setToken }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const baseUrl = 'http://localhost:5000';
        const url = `${baseUrl}${isLogin ? '/api/login' : '/api/signup'}`;
        
        try {
            const response = await axios.post(url, { 
                username, 
                password 
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (isLogin) {
                setToken(response.data.token);
                alert('Login successful!');
            } else {
                alert('Sign up successful! You can now log in.');
                setIsLogin(true);
            }
            
            setUsername('');
            setPassword('');
        } catch (error) {
            console.error('Error during authentication:', error);
            const errorMessage = error.response?.data?.message || 'Authentication failed. Please try again.';
            alert(errorMessage);
        }
    };

    return (
        <div className="auth-container">
            <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
            <form onSubmit={handleSubmit} className="auth-form">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="auth-input"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="auth-input"
                />
                <button type="submit" className="auth-button">
                    {isLogin ? 'Login' : 'Sign Up'}
                </button>
            </form>
            <button 
                onClick={() => setIsLogin(!isLogin)} 
                className="auth-switch-button"
            >
                Switch to {isLogin ? 'Sign Up' : 'Login'}
            </button>
        </div>
    );
};

export default Auth; 