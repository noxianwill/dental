// /routes/user.js
const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middlewares/auth');

// Home page
router.get('/', (req, res) => {
    res.render('index.ejs');
});

// Help page (authentication optional)
router.get('/help', (req, res) => {
    res.render('help.ejs');
});

// Feedback page (authentication optional)
router.get('/feedback', (req, res) => {
    res.render('feedback.ejs');
});

module.exports = router;