// /routes/auth.js
const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');

module.exports = function(db) {
    const router = express.Router();
    const { register, renderLogin, renderRegister } = authController(db);

    // Login route
    router.post('/login', passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    }));

    // Register route
    router.post('/register', register);
    router.get('/login', renderLogin);
    router.get('/register', renderRegister);

// Logout route
router.get('/logout', (req, res, next) => {
    console.log('Session ID before logout:', req.session.id); // Log session ID
    
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        
        // Destroy the session
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return next(err);
            }
            
            // Clear the session cookie
            res.clearCookie('session_cookie_name'); // Ensure this matches your session cookie name
            
            console.log('Session destroyed, redirecting to login.');
            res.redirect('/login');
        });
    });
});

    return router;
};
