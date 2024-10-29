// /routes/patient.js
const express = require('express');
const { ensureAuthenticated } = require('../middlewares/auth');
const { addNewPatient, getAllPatientsData, renderDashboard, deletePatient } = require('../controllers/patientController');
const router = express.Router();

// Define a POST route for adding new patients
router.post('/patients', ensureAuthenticated, addNewPatient);

// Define a GET route for retrieving all patients
router.get('/patients', ensureAuthenticated, getAllPatientsData);

// Define a GET route for the dashboard
router.get('/dashboard', ensureAuthenticated, renderDashboard);

// Define a DELETE route for deleting a patient by ID
router.delete('/patients/:id', ensureAuthenticated, deletePatient);

module.exports = router;
