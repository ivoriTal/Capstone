import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ResponsePage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { skill } = location.state || {}; // Handle case where state might be undefined
    const [response, setResponse] = useState('');
    const [beginnerInfo, setBeginnerInfo] = useState('');
    const [intermediateInfo, setIntermediateInfo] = useState('');
    const [loading, setLoading] = useState(true); // Loading state

    const skillCache = {}; // Cache to store responses based on skill

    useEffect(() => {
        if (!skill) {
            setResponse('No skill provided!');
            setLoading(false);
            return;
        }

        const fetchResponse = async () => {
            // Check if the response for the skill is already cached
            if (skillCache[skill]) {
                console.log('Returning cached response for skill:', skill);
                setResponse(skillCache[skill]);
                setLoading(false);
                return; // Exit if the response is cached
            }

            let attempts = 0;
            const maxAttempts = 5;
            const retryDelay = 2000; // Start with a 2-second delay

            while (attempts < maxAttempts) {
                try {
                    const chatGptResponse = await axios.post(
                        process.env.REACT_APP_API_URL,
                        {
                            model: "gpt-3.5-turbo",
                            messages: [{ role: "user", content: `What is the improvement level for someone wanting to improve their ${skill}?` }],
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
                                'Content-Type': 'application/json',
                            },
                        }
                    );

                    // Process the response
                    const result = chatGptResponse.data.choices[0].message.content;
                    setResponse(result);
                    return; // Exit if successful
                } catch (error) {
                    if (error.response && error.response.status === 429) {
                        const waitTime = retryDelay * 2 ** attempts; // Exponential backoff
                        console.warn(`Rate limit exceeded. Retrying in ${waitTime}ms...`);
                        await new Promise((resolve) => setTimeout(resolve, waitTime));
                        attempts++; // Increment the attempt count
                    } else {
                        console.error('Error fetching response:', error);
                        setResponse('Error fetching response from the API.');
                        return; // Exit on other errors
                    }
                }
            }

            setResponse('Exceeded maximum retries. Please try again later.'); // Final message after max attempts
        };

        fetchResponse();
    }, [skill]);

    return (
        <div>
            <h1>Improvement Suggestions for {skill}</h1>
            {loading ? (
                <p>Loading...</p> // Show loading message
            ) : (
                <>
                    <p>{response || 'No response available.'}</p>
                    <h2>Beginner Tips</h2>
                    <p>{beginnerInfo}</p>
                    <h2>Intermediate Tips</h2>
                    <p>{intermediateInfo}</p>
                </>
            )}
            <button onClick={() => navigate('/')}>Back to Home</button>
        </div>
    );
}

export default ResponsePage;
