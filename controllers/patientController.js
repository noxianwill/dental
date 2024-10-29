// /controllers/patientController.js
const { addPatient, getPatientById, getAllPatients, deletePatientById, updatePatient } = require('../models/patientModel');

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

const getPatientByIdController = async (req, res) => {
    const patientId = req.params.id; // Capture the patient ID from the request parameters

    try {
        const patient = await getPatientById(patientId); // Call the model function to get the patient by ID
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' }); // If no patient is found, return 404
        }
        res.status(200).json(patient); // Send the patient data as JSON response
    } catch (error) {
        console.error('Error retrieving patient:', error);
        res.status(500).json({ message: 'Error retrieving patient' }); // Handle errors
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

// Controller to handle updating a patient by ID
const updatePatientData = async (req, res) => {
    const patientId = req.params.id; // Capture the patient ID from the request parameters
    const patientData = req.body; // Capture the updated patient data from the request

    try {
        await updatePatient(patientId, patientData); // Call the model function to update the patient
        const updatedPatient = await getPatientById(patientId); // Fetch the updated patient details
        console.log(`Patient updated successfully: ${updatedPatient}`);
        res.status(200).json({ message: 'Patient updated successfully', patient: updatedPatient }); // Send success response
    } catch (error) {
        console.error('Error updating patient:', error);
        if (error.message.startsWith('Validation error:')) {
            return res.status(400).json({ message: error.message }); // Handle validation errors
        }
        if (error.message === 'Patient not found') {
            return res.status(404).json({ message: 'Patient not found' }); // Handle not found case
        }
        res.status(500).json({ message: 'Error updating patient' }); // Handle other errors
    }
};

module.exports = { addNewPatient, getAllPatientsData, getPatientByIdController, renderDashboard, deletePatient, updatePatientData };
