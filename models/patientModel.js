// /models/patientModel.js

const db = require('./db');
const Joi = require('joi');

// Define the validation schema for patient data
const patientSchema = Joi.object({
    patient_pronounce: Joi.string().valid('Mr.', 'Ms.', 'Mrs.', 'Dr.').required(),
    first_name: Joi.string().min(1).max(50).required(),
    last_name: Joi.string().min(1).max(50).required(),
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    date_of_birth: Joi.string()
        .pattern(/^([0-2][0-9]|(3)[0-1])\/([0]?[1-9]|1[0-2])\/(\d{4})$/) // Matches DD/MM/YYYY format
        .required()
        .custom((value, helpers) => {
            const [day, month, year] = value.split('/').map(Number);
            const date = new Date(year, month - 1, day);
            if (date > new Date()) {
                return helpers.message("Date of birth must be in the past.");
            }
            return value;
        })
        .messages({
            "string.pattern.base": "Date of birth must be in DD/MM/YYYY format.",
        }),
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
            patientData.email,
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

// Function to delete patient by ID
function deletePatientById(id) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM patients WHERE id = ?';
        db.query(sql, [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            // Check if any rows were affected (i.e., patient was found and deleted)
            if (results.affectedRows === 0) {
                return reject(new Error('Patient not found'));
            }
            resolve(results); // Return the results
        });
    });
}

// Function to update a patient by ID
function updatePatient(id, patientData) {
    // Use the same validation schema for updating
    const { error } = patientSchema.validate(patientData);
    if (error) {
        return Promise.reject(new Error(`Validation error: ${error.details[0].message}`));
    }

    return new Promise((resolve, reject) => {
        const sql = `
            UPDATE patients SET
                patient_pronounce = ?, first_name = ?, last_name = ?, email = ?, 
                date_of_birth = ?, address = ?, state = ?, city = ?, 
                zip_code = ?, phone_number = ?, insurance = ?, 
                private_insurance = ?, insurance_personal_number = ?, 
                bill_address = ?, cabin = ?
            WHERE id = ?`;

        db.query(sql, [
            patientData.patient_pronounce,
            patientData.first_name,
            patientData.last_name,
            patientData.email,
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
            patientData.cabin,
            id // Patient ID to update
        ], (err, result) => {
            if (err) {
                return reject(err);
            }
            // Check if any rows were affected (i.e., patient was found and updated)
            if (result.affectedRows === 0) {
                return reject(new Error('Patient not found'));
            }
            resolve(result);
        });
    });
}

module.exports = {
    addPatient,
    getAllPatients,
	getPatientById,
	deletePatientById,
	updatePatient
};