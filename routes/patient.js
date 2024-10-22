// /routes/patient.js

const express = require('express');
const { addPatient } = require('../models/patientModel');
const { getAllPatients } = require('../models/patientModel');
const router = express.Router();

// Route to add a new patient
router.post('/patients', async (req, res) => {
    try {
        const patientData = req.body; // Get patient data from request body
        const patientId = await addPatient(patientData); // Call the addPatient function
        res.status(201).json({ message: 'Patient added successfully', patientId });
    } catch (error) {
        console.error('Error adding patient:', error);
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