require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const bcryptjs = require('bcryptjs');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const path = require('path');
const mysql = require('mysql2');
const initializePassport = require('./passport-config');
const db = require('./models/db');

// Load PORT from the .env file
const PORT = process.env.PORT;

if (!PORT) {
    throw new Error('PORT environment variable is not defined in .env file');
}

const {
    getUserByEmail,
    getUserById
} = require('./models/userModel');

const app = express();

// Configure MySQL session store
const sessionStore = new MySQLStore({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    log: (message) => {
        console.log('MySQL Session Store Log:', message);
    },
    // Optionally, set these to see session operations
    clearExpired: true,
    checkExpirationInterval: 900000, // Check every 15 minutes
    expiration: 86400000 // 24 hours
});

// Middleware for session management
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
	cookie: { maxAge: 1000 * 60 * 60 // 1 hour
	}
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Set views directory and view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Serve static files from a public directory (if applicable)
app.use(express.static(path.join(__dirname, 'public'))); // Update if you move static files

// Initialize Passport
initializePassport(
    passport,
    async email => await getUserByEmail(email),
    async id => await getUserById(id)
);

// Import routes
const authRoutes = require('./routes/auth')(db);
const userRoutes = require('./routes/user');
const resetRoutes = require('./routes/reset')(db);
const patientRoutes = require('./routes/patient');

// Use routes
app.use('/', patientRoutes);
app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/', resetRoutes);

// 404 error handling
app.use((req, res, next) => {
    res.status(404).render('404');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
