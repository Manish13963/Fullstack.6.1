// server.js
const express = require('express');
const app = express();

// ===== Middleware 1: Logging =====
const loggerMiddleware = (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
    next();
};

// Apply logger middleware globally
app.use(loggerMiddleware);

// ===== Middleware 2: Token Authentication =====
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1]; // Expecting "Bearer <token>"
    if (token !== 'mysecrettoken') {
        return res.status(403).json({ error: 'Invalid token' });
    }

    next(); // Token is valid, proceed
};

// ===== Routes =====

// Public route (no authentication required)
app.get('/public', (req, res) => {
    res.json({ message: 'This is a public route, accessible by anyone.' });
});

// Protected route (requires valid token)
app.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: 'This is a protected route, you have access!' });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
