import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import ResponsePage from './components/ResponsePage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/response" element={<ResponsePage />} />
            </Routes>
        </Router>
    );
}

export default App;
