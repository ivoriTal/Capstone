import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
    const [skill, setSkill] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/response', { state: { skill } }); 
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="homepage">
            <header className="homepage-header">
                <h1>Welcome to Basketball Training</h1>
                <p>Your mission is to improve your skills and reach your full potential.</p>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </header>
            <div className="hero-image">
                <img src="hero-image.jpg" alt="Basketball Training" />
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter skill to improve"
                    value={skill}
                    onChange={(e) => setSkill(e.target.value)}
                    required
                />
                <button type="submit">Get Improvement Level</button>
            </form>
            <div className="featured-content">
                <h2>Inspirational Quotes</h2>
                <blockquote>
                    "Success is no accident. It is hard work, perseverance, learning, studying, sacrifice, and most of all, love of what you are doing or learning to do." - Pelé
                </blockquote>
                <blockquote>
                    "You miss 100% of the shots you don't take." - Wayne Gretzky
                </blockquote>
            </div>
        </div>
    );
}

export default HomePage;
