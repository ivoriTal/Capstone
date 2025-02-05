import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ResponsePage.css';

function ResponsePage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { skill } = location.state || {};
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!skill) {
            setError('No skill provided!');
            setLoading(false);
            return;
        }

        const fetchResponse = async () => {
            try {
                console.log('Fetching response for skill:', skill);
                const chatGptResponse = await axios.post(
                    'https://api.openai.com/v1/chat/completions',
                    {
                        model: "gpt-3.5-turbo",
                        messages: [
                            {
                                role: "user",
                                content: `What are specific improvement suggestions for ${skill} in basketball? Please provide detailed, actionable tips.`,
                            },
                        ],
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${process.env.REACT_APP_API_KEY}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (chatGptResponse.data && chatGptResponse.data.choices && chatGptResponse.data.choices[0]) {
                    const result = chatGptResponse.data.choices[0].message.content;
                    setResponse(result);
                    setError(null);
                } else {
                    throw new Error('Invalid response format from OpenAI');
                }
            } catch (error) {
                console.error('Error details:', error);
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.error('API Error Response:', error.response.data);
                    setError(`API Error: ${error.response.data.error?.message || 'Unknown error'}`);
                } else if (error.request) {
                    // The request was made but no response was received
                    console.error('No response received:', error.request);
                    setError('No response received from the server. Please try again.');
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.error('Error setting up request:', error.message);
                    setError('Error setting up the request. Please try again.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchResponse();
    }, [skill]);

    return (
        <div className="response-page">
            <h1>Improvement Suggestions for {skill}</h1>
            {loading ? (
                <div className="loading-text">Loading your personalized suggestions...</div>
            ) : error ? (
                <div className="error-message">
                    <p>{error}</p>
                    <button onClick={() => navigate('/home')} className="back-button">
                        Try Again
                    </button>
                </div>
            ) : (
                <>
                    <div className="suggestions">
                        <p>{response || 'No suggestions available.'}</p>
                    </div>
                    <button onClick={() => navigate('/home')} className="back-button">
                        Back to Home
                    </button>
                </>
            )}
        </div>
    );
}

export default ResponsePage;
