// /routes/auth.js

const express = require('express');
const passport = require('passport');
const bcryptjs = require('bcryptjs');

module.exports = function(db) {
    const router = express.Router();

    router.post('/login', passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    }));

    router.post('/register', async (req, res) => {
        try {
            const {
                name,
                email,
                password
            } = req.body;
            if (!name || !email || !password) {
                throw new Error('Name, email, and password are required');
            }
            const hashedPassword = await bcryptjs.hash(password, 10);

            const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
            db.query(sql, [name, email, hashedPassword], (err, result) => {
                if (err) {
                    console.error('Error inserting user into database:', err);
                    return res.redirect('/register');
                }
                console.log('User added to database with ID:', result.insertId);
                res.redirect('/login');
            });
        } catch (e) {
            console.log(e);
            res.redirect('/register');
        }
    });

    router.get('/login', (req, res) => {
        res.render('login.ejs');
    });

    router.get('/register', (req, res) => {
        res.render('register.ejs');
    });

    router.get('/logout', (req, res) => {
        req.logout((err) => {
            if (err) {
                return next(err);
            }
            res.redirect('/login');
        });
    });

    return router;
};