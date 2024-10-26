// server.js:

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
    database: process.env.DB_NAME
});

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
	store: sessionStore
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initializePassport(
    passport,
    async email => await getUserByEmail(email),
        async id => await getUserById(id)
);

app.use(express.urlencoded({
    extended: false
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'views')));

const authRoutes = require('./routes/auth')(db);
const userRoutes = require('./routes/user');
const resetRoutes = require('./routes/reset')(db);
const patientRoutes = require('./routes/patient');

app.use('/', patientRoutes);
app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/', resetRoutes);

app.use((req, res, next) => {
    res.status(404).render('404');
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});