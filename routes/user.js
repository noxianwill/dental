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

function capitalizeName(name) {
    return name.replace(/\b\w/g, char => char.toUpperCase());
}

router.get('/dashboard', checkAuthenticated, (req, res) => {
    const formattedName = capitalizeName(req.user.name);
    res.render('dashboard.ejs', {
        name: formattedName
    });
});

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