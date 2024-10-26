// /routes/patient.js

const express = require('express');
const { addPatient , getPatientById , getAllPatients } = require('../models/patientModel');
const { ensureAuthenticated } = require('../middlewares/auth');
const router = express.Router();

// Route to add a new patient (protected)
router.post('/patients', ensureAuthenticated, async (req, res) => {
    try {
        const patientData = req.body; // Get patient data from request body
        const patientId = await addPatient(patientData); // Validate and add the patient
        const newPatient = await getPatientById(patientId);
        console.log('New patient added:', newPatient);
        res.status(201).json({ message: 'Patient added successfully', patient: newPatient });
    } catch (error) {
        console.error('Error adding patient:', error);
        if (error.message.startsWith('Validation error:')) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error adding patient' });
    }
});

// Route to retrieve all patients
router.get('/patients', async (req, res) => {
    try {
        const patients = await getAllPatients();
        res.json(patients);
    } catch (error) {
        console.error('Error retrieving patients:', error);
        res.status(500).json({ message: 'Error retrieving patients' });
    }
});

// Dashboard route to display patients

router.get('/dashboard', async (req, res) => {
    try {
        const patients = await getAllPatients(); // Retrieve all patients
        const name = req.user ? req.user.name : 'Guest'; // Retrieve the user's name, default to 'Guest' if not logged in
        res.render('dashboard', { patients, name }); // Render the dashboard with patients and name data
    } catch (error) {
        console.error('Error retrieving patients for dashboard:', error);
        res.status(500).send('Error retrieving patients');
    }
});


module.exports = router;