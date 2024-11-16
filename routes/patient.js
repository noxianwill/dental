// /routes/patient.js
const express = require('express');
const { ensureAuthenticated } = require('../middlewares/auth');
const { addNewPatient, getAllPatientsData, getPatientByIdController, renderDashboard, deletePatient, updatePatientData } = require('../controllers/patientController');
const router = express.Router();

// Define a GET route for the dashboard
router.get('/dashboard', ensureAuthenticated, renderDashboard);

// Define a POST route for adding new patients
router.post('/patients', addNewPatient);

// Define a GET route for retrieving all patients
router.get('/patients', getAllPatientsData);

// Define a GET route for getting a patient by ID
router.get('/patients/:id', getPatientByIdController);

// Define a DELETE route for deleting a patient by ID
router.delete('/patients/:id', deletePatient);

// Define a PUT route for updating a patient by ID
router.put('/patients/:id', updatePatientData);

module.exports = router;
