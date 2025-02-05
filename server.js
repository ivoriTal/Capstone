const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

const googleClient = new OAuth2Client("353441536259-qov1gkv1voco092rst9vhda68cqemk5l.apps.googleusercontent.com");

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

// PostgreSQL connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'basketball_app',
    password: 'password',
    port: 5432,
});


pool.connect((err, client, release) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Successfully connected to database');
        release();
    }
});

// User registration
app.post('/api/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        
        const userExists = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id',
            [username, hashedPassword]
        );
        
        res.status(201).json({ 
            message: 'User created successfully',
            userId: result.rows[0].id 
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
});

// User login
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign(
            { userId: user.id },
            'your_jwt_secret',
            { expiresIn: '1h' }
        );
        
        res.json({ token, message: 'Login successful' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error during login' });
    }
});

app.post('/api/google-auth', async (req, res) => {
    try {
        const { credential } = req.body;
        console.log('Received credential request');
        
        if (!credential) {
            console.error('No credential provided');
            return res.status(400).json({ message: 'No credential provided' });
        }

        // Verify the Google token
        console.log('Verifying token...');
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: "353441536259-qov1gkv1voco092rst9vhda68cqemk5l.apps.googleusercontent.com"
        });
        
        console.log('Token verified successfully');
        const payload = ticket.getPayload();
        const { email, sub: googleId } = payload;

        // Check if user exists
        let result = await pool.query('SELECT * FROM users WHERE google_id = $1', [googleId]);
        
        if (result.rows.length === 0) {
            console.log('Creating new user...');
            // Create new user if doesn't exist
            result = await pool.query(
                'INSERT INTO users (email, google_id) VALUES ($1, $2) RETURNING id',
                [email, googleId]
            );
            console.log('New user created');
        } else {
            console.log('Existing user found');
        }

        const userId = result.rows[0].id;
        const token = jwt.sign(
            { userId: userId },
            'your_jwt_secret',
            { expiresIn: '1h' }
        );

        console.log('Authentication successful');
        res.json({ 
            token, 
            userId,
            message: 'Google authentication successful' 
        });
    } catch (error) {
        console.error('Google auth error:', error);
        res.status(500).json({ 
            message: 'Error during Google authentication',
            error: error.message 
        });
    }
});

// Add this endpoint to handle skill level updates
app.post('/api/update-skill-level', async (req, res) => {
    try {
        const { skillLevel, userId } = req.body;
        
        if (!skillLevel || !userId) {
            return res.status(400).json({ message: 'Skill level and user ID are required' });
        }

        // Update the user's skill level
        const result = await pool.query(
            'UPDATE users SET skill_level = $1 WHERE id = $2 RETURNING *',
            [skillLevel, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create new token with skill level
        const token = jwt.sign(
            { 
                userId: userId,
                skillLevel: skillLevel
            },
            'your_jwt_secret',
            { expiresIn: '1h' }
        );

        res.json({ 
            token,
            message: 'Skill level updated successfully',
            skillLevel 
        });
    } catch (error) {
        console.error('Error updating skill level:', error);
        res.status(500).json({ message: 'Error updating skill level' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
}); 