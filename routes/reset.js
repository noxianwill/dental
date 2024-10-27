// /routes/reset.js
const express = require('express');
const resetController = require('../controllers/resetController');

module.exports = function(db) {
    const router = express.Router();

    router.post('/reset-password', (req, res) => resetController.requestPasswordReset(req, res, db));
    router.get('/reset-password', (req, res) => res.render('reset-password.ejs', { error: req.flash('error'), success: req.flash('success') }));
    router.get('/reset/:token', (req, res) => resetController.resetPasswordForm(req, res, db));
    router.post('/reset/:token', (req, res) => resetController.resetPassword(req, res, db));

    return router;
};
