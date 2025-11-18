// server/middleware/authMiddleware.js

// ======= IMPORTS =======
const jwt = require('jsonwebtoken');
require('dotenv').config();
// =====================

// runs before protected route handlers to verify JWT token
module.exports = function(req, res, next) {
    
    // --- 1) get token from header ---
    // Get token from header
    const token = req.header('x-auth-token');

    // --- 2) check if token is provided ---
    // if a user request a private route without token
    //      - x-auth-token header will be empty
    if (!token) {
        return res.status(401).json({ error: 'No token, authorization denied' });
    }

    // --- 3) verify token ---
    try {
        // decodes token using key from environment variable
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // --- 4) Attach user data to the request ---
        // Add user from payload
        req.user = decoded.user;

        // now we can access the logged-in user's ID via 'req.user.id'.
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token is not valid' });
    }
};