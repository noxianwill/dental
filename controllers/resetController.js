// /controllers/resetController.js
const crypto = require('crypto');
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const { getUserByEmail } = require('../models/userModel');

const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/;
    return passwordRegex.test(password);
};

const sendResetEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        sendmail: true,
        newline: 'unix',
        path: '/usr/sbin/sendmail'
    });

    const mailOptions = {
        from: 'dental-application@cs2demos.theworkpc.com',
        to: email,
        subject: 'Your Password Reset Link',
        html: `
            <p>You are receiving this email because a password reset request was made for your account.</p>
            <p>Please click <a target="_blank" href="https://cs2demos.theworkpc.com/reset/${token}">here</a> to reset your password.</p>
            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent successfully.');
    } catch (error) {
        console.error('Error sending password reset email:', error);
    }
};

const requestPasswordReset = async (req, res, db) => {
    const { email } = req.body;
    try {
        const user = await getUserByEmail(email);
        if (!user) {
            req.flash('error', `The entered email address ${email} was not found, please try again.`);
            return res.redirect('/reset-password');
        }

        const token = crypto.randomBytes(20).toString('hex');
        const expires = new Date();
        expires.setHours(expires.getHours() + 1);

        const insertSql = 'INSERT INTO password_resets (email, token, expires) VALUES (?, ?, ?)';
        db.query(insertSql, [email, token, expires], (err) => {
            if (err) {
                console.error('Error inserting password reset token:', err);
                req.flash('error', 'Failed to generate password reset link. Please try again later.');
                return res.redirect('/reset-password');
            }

            sendResetEmail(email, token);
            req.flash('success', `A password reset link has been sent to your email ${email}`);
            res.redirect('/reset-password');
        });
    } catch (error) {
        console.error('Error processing password reset request:', error);
        req.flash('error', 'Failed to process password reset request. Please try again later.');
        res.redirect('/reset-password');
    }
};

const resetPasswordForm = async (req, res, db) => {
    const { token } = req.params;
    const sql = 'SELECT * FROM password_resets WHERE token = ? AND expires > NOW()';
    db.query(sql, [token], (err, results) => {
        if (err || results.length === 0) {
            console.error('Invalid or expired token');
            req.flash('error', 'Invalid or expired token');
            return res.redirect('/reset-password');
        }
        res.render('reset-password-form.ejs', { token });
    });
};

const resetPassword = async (req, res, db) => {
    const { token } = req.params;
    const { password } = req.body;

    const sql = 'SELECT email FROM password_resets WHERE token = ? AND expires > NOW()';
    db.query(sql, [token], async (err, results) => {
        if (err || results.length === 0) {
            console.error('Invalid or expired token');
            req.flash('error', 'Invalid or expired token');
            return res.redirect('/reset-password');
        }

        const email = results[0].email;
        try {
            const hashedPassword = await bcryptjs.hash(password, 10);
            const updateSql = 'UPDATE users SET password = ? WHERE email = ?';
            db.query(updateSql, [hashedPassword, email], (updateErr) => {
                if (updateErr) {
                    console.error('Error updating password:', updateErr);
                    req.flash('error', 'Failed to reset password. Please try again later.');
                    return res.redirect(`/reset/${token}`);
                }

                const deleteTokenSql = 'DELETE FROM password_resets WHERE token = ?';
                db.query(deleteTokenSql, [token], (deleteErr) => {
                    if (deleteErr) {
                        console.error('Error deleting used token:', deleteErr);
                    }
                });

                req.flash('success', 'Your password has been reset successfully. You will be redirected to the login page shortly.');
                res.render('reset-password-form.ejs', { token, success: req.flash('success'), error: req.flash('error') });
            });
        } catch (error) {
            console.error('Error hashing password:', error);
            req.flash('error', 'Failed to reset password. Please try again later.');
            res.redirect(`/reset/${token}`);
        }
    });
};

module.exports = { requestPasswordReset, resetPasswordForm, resetPassword };
