// /routes/patient.js

const express = require('express');
<<<<<<< HEAD
const { addPatient , getPatientById , getAllPatients } = require('../models/patientModel');
=======
const { addPatient } = require('../models/patientModel');
const { getAllPatients } = require('../models/patientModel');
>>>>>>> 29a635facd77f7f79cfce0081b686c0db20d72b1
const router = express.Router();

// Route to add a new patient
router.post('/patients', async (req, res) => {
    try {
        const patientData = req.body; // Get patient data from request body
<<<<<<< HEAD
        const patientId = await addPatient(patientData); // Validate and add the patient
        const newPatient = await getPatientById(patientId);
        console.log('New patient added:', newPatient);
        res.status(201).json({ message: 'Patient added successfully', patient: newPatient });
    } catch (error) {
        console.error('Error adding patient:', error);
        if (error.message.startsWith('Validation error:')) {
            return res.status(400).json({ message: error.message });
        }
=======
        const patientId = await addPatient(patientData); // Call the addPatient function
        res.status(201).json({ message: 'Patient added successfully', patientId });
    } catch (error) {
        console.error('Error adding patient:', error);
>>>>>>> 29a635facd77f7f79cfce0081b686c0db20d72b1
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