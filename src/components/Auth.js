import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import './Auth.css';

const Auth = ({ setToken }) => {
    const [showSkillLevel, setShowSkillLevel] = useState(false);
    const [skillLevel, setSkillLevel] = useState('');
    const [userId, setUserId] = useState(null);

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            console.log('Google Sign-in response:', credentialResponse);

            // Make sure we have a credential
            if (!credentialResponse.credential) {
                throw new Error('No credential received');
            }

            const response = await fetch('http://localhost:5000/api/google-auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    credential: credentialResponse.credential
                }),
                credentials: 'include'
            });

            const data = await response.json();
            console.log('Server response:', data);
            
            if (response.ok) {
                setUserId(data.userId);
                setShowSkillLevel(true);
            } else {
                throw new Error(data.message || 'Failed to authenticate');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to sign in. Please try again.');
        }
    };

    const handleSkillLevelSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Submitting skill level:', { skillLevel, userId });

            if (!userId) {
                throw new Error('No user ID available');
            }

            if (!skillLevel) {
                throw new Error('Please select a skill level');
            }

            const response = await fetch('http://localhost:5000/api/update-skill-level', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    skillLevel,
                    userId
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update skill level');
            }

            const data = await response.json();
            console.log('Skill level update response:', data);
            
            setToken(data.token);
            alert('Successfully set skill level!');
        } catch (error) {
            console.error('Error updating skill level:', error);
            alert('Failed to set skill level: ' + error.message);
        }
    };

    return (
        <div className="auth-container">
            {!showSkillLevel ? (
                <>
                    <h2>Sign in with Google</h2>
                    <div className="google-signin-button">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={(error) => {
                                console.error('Login Failed:', error);
                                alert('Google Sign In failed. Please try again.');
                            }}
                            type="standard"
                            theme="filled_blue"
                            size="large"
                            text="signin_with"
                            shape="rectangular"
                            width="300"
                        />
                    </div>
                </>
            ) : (
                <div className="skill-level-form">
                    <h2>Select Your Skill Level</h2>
                    <form onSubmit={handleSkillLevelSubmit}>
                        <div className="skill-options">
                            <label>
                                <input
                                    type="radio"
                                    value="beginner"
                                    checked={skillLevel === 'beginner'}
                                    onChange={(e) => setSkillLevel(e.target.value)}
                                />
                                Beginner
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="intermediate"
                                    checked={skillLevel === 'intermediate'}
                                    onChange={(e) => setSkillLevel(e.target.value)}
                                />
                                Intermediate
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="advanced"
                                    checked={skillLevel === 'advanced'}
                                    onChange={(e) => setSkillLevel(e.target.value)}
                                />
                                Advanced
                            </label>
                        </div>
                        <button type="submit" className="submit-button">
                            Continue
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Auth; 