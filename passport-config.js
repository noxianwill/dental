// /passport-config.js

const LocalStrategy = require('passport-local').Strategy;
const bcryptjs = require('bcryptjs');
const {
    getUserByEmail,
    getUserById
} = require('./models/userModel');

function initialize(passport) {
    const authenticateUser = async (email, password, done) => {
        const user = await getUserByEmail(email);
        if (!user) {
            return done(null, false, {
                message: 'No user found with this email.'
            });
        }

        try {
            if (await bcryptjs.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, {
                    message: 'Password incorrect.'
                });
            }
        } catch (e) {
            return done(e);
        }
    };

    passport.use(new LocalStrategy({
        usernameField: 'email'
    }, authenticateUser));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await getUserById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
}

module.exports = initialize;