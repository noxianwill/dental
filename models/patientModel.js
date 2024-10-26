// /models/patientModel.js

const db = require('./db');
<<<<<<< HEAD
const Joi = require('joi');

// Define the validation schema for patient data
const patientSchema = Joi.object({
    patient_pronounce: Joi.string().valid('Mr.', 'Ms.', 'Mrs.', 'Dr.').required(),
    first_name: Joi.string().min(1).max(50).required(),
    last_name: Joi.string().min(1).max(50).required(),
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    date_of_birth: Joi.date().iso().less('now').required(),
    address: Joi.string().max(100).required(),
    state: Joi.string().max(50).required(),
    city: Joi.string().max(50).required(),
    zip_code: Joi.alternatives().try(Joi.string().regex(/^\d{1,5}$/),Joi.number().integer().min(1).max(99999)).required(),
    phone_number: Joi.string().regex(/^\+?[1-9]\d{1,14}$/).required(),
    insurance: Joi.string().min(1).max(50).required(),
    private_insurance: Joi.string().min(1).max(50).required(),
    insurance_personal_number: Joi.string().regex(/^\+?[1-9]\d{1,14}$/).required(),
    bill_address: Joi.string().max(100).optional(),
    cabin: Joi.string().max(50).optional()
});

// Function to add a new patient with validation
function addPatient(patientData) {
    // Validate patient data against schema
    const { error } = patientSchema.validate(patientData);
    if (error) {
        // If validation fails, reject with the error message
        return Promise.reject(new Error(`Validation error: ${error.details[0].message}`));
    }

    // If validation passes, proceed with inserting into the database
=======

// Function to add a new patient
function addPatient(patientData) {
>>>>>>> 29a635facd77f7f79cfce0081b686c0db20d72b1
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO patients (
                patient_pronounce, first_name, last_name, email, date_of_birth, address, 
                state, city, zip_code, phone_number, insurance, 
                private_insurance, insurance_personal_number, bill_address, cabin
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        db.query(sql, [
            patientData.patient_pronounce,
            patientData.first_name,
            patientData.last_name,
<<<<<<< HEAD
            patientData.email,
=======
			patientData.email,
>>>>>>> 29a635facd77f7f79cfce0081b686c0db20d72b1
            patientData.date_of_birth,
            patientData.address,
            patientData.state,
            patientData.city,
            patientData.zip_code,
            patientData.phone_number,
            patientData.insurance,
            patientData.private_insurance,
            patientData.insurance_personal_number,
            patientData.bill_address,
            patientData.cabin
        ], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result.insertId);
        });
    });
}

// Function to retrieve all patients
function getAllPatients() {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM patients';
        db.query(sql, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
}

<<<<<<< HEAD
// Function to get patient by ID
function getPatientById(id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM patients WHERE id = ?';
        db.query(sql, [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results[0]); // Return the first (and only) result
        });
    });
}

module.exports = {
    addPatient,
    getAllPatients,
	getPatientById
=======
module.exports = {
    addPatient,
    getAllPatients
>>>>>>> 29a635facd77f7f79cfce0081b686c0db20d72b1
};