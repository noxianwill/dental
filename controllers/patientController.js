// /controllers/patientController.js
const { addPatient, getPatientById, getAllPatients, deletePatientById } = require('../models/patientModel');

// Controller to handle adding a new patient
const addNewPatient = async (req, res) => {
    try {
        const patientData = req.body; // Capture the patient data from the request
        const patientId = await addPatient(patientData); // Add the patient using the model function
        const newPatient = await getPatientById(patientId); // Fetch the newly added patient details
        console.log('New patient added:', newPatient);
        res.status(201).json({ message: 'Patient added successfully', patient: newPatient }); // Send success response
    } catch (error) {
        console.error('Error adding patient:', error);
        if (error.message.startsWith('Validation error:')) {
            return res.status(400).json({ message: error.message }); // Handle validation errors
        }
        res.status(500).json({ message: 'Error adding patient' }); // Handle other errors
    }
};

// Controller to retrieve all patients
const getAllPatientsData = async (req, res) => {
    try {
        const patients = await getAllPatients(); // Fetch all patients from the model
        res.json(patients); // Send the patients as JSON response
    } catch (error) {
        console.error('Error retrieving patients:', error);
        res.status(500).json({ message: 'Error retrieving patients' }); // Handle errors
    }
};

// Controller to render the dashboard
const renderDashboard = async (req, res) => {
    try {
        const patients = await getAllPatients(); // Fetch all patients for the dashboard
        const name = req.user ? req.user.name : 'Guest'; // Get the user name if authenticated
        res.render('dashboard', { patients, name }); // Render the dashboard view with patient data
    } catch (error) {
        console.error('Error retrieving patients for dashboard:', error);
        res.status(500).send('Error retrieving patients'); // Handle errors
    }
};

// Controller to handle deleting a patient by ID
const deletePatient = async (req, res) => {
    const patientId = req.params.id; // Capture the patient ID from the request parameters

    try {
        await deletePatientById(patientId); // Call the model function to delete the patient
		console.log(`Patient deleted successfully: ${patientId}`);
        res.status(200).json({ message: 'Patient deleted successfully', deletedPatientId: patientId}); // Send success response
    } catch (error) {
        console.error('Error deleting patient:', error);
        if (error.message === 'Patient not found') {
            return res.status(404).json({ message: 'Patient not found' }); // Handle not found case
        }
        res.status(500).json({ message: 'Error deleting patient' }); // Handle other errors
    }
};

module.exports = { addNewPatient, getAllPatientsData, renderDashboard, deletePatient };
