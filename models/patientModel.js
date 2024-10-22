// /models/patientModel.js

const db = require('./db');

// Function to add a new patient
function addPatient(patientData) {
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

module.exports = {
    addPatient,
    getAllPatients
};