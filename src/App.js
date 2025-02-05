import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import ResponsePage from './components/ResponsePage';

// Protected Route component
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/" replace />;
    }
    return children;
};

function App() {
    const clientId = "353441536259-qov1gkv1voco092rst9vhda68cqemk5l.apps.googleusercontent.com";

    return (
        <GoogleOAuthProvider 
            clientId={clientId}
            onScriptLoadError={(error) => console.error('Google Script load error:', error)}
            onScriptLoadSuccess={() => console.log('Google Sign-In ready')}
        >
            <Router>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route 
                        path="/home" 
                        element={
                            <ProtectedRoute>
                                <HomePage />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/response" 
                        element={
                            <ProtectedRoute>
                                <ResponsePage />
                            </ProtectedRoute>
                        } 
                    />
                </Routes>
            </Router>
        </GoogleOAuthProvider>
    );
}

export default App;
