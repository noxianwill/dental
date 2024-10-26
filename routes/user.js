// /routes/user.js

const express = require('express');
const router = express.Router();
const db = require('../models/db'); // Ensure you're requiring your DB connection

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

router.get('/', (req, res) => {
    res.render('index.ejs');
});

router.get('/help', (req, res) => {
    res.render('help.ejs');
});

router.get('/feedback', (req, res) => {
    res.render('feedback.ejs');
});

module.exports = router;