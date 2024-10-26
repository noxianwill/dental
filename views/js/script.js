<<<<<<< HEAD
=======
// /views/js/script.js:

>>>>>>> 29a635facd77f7f79cfce0081b686c0db20d72b1
document.addEventListener('DOMContentLoaded', function() {
    // Section references
    const sections = {
        'patient-management': document.getElementById('patient-management-section'),
        'clinical-documentation': document.getElementById('clinical-documentation-section'),
        'billing-invoicing': document.getElementById('billing-invoicing-section'),
        'appointment-management': document.getElementById('appointment-management-section'),
        'patient-communication': document.getElementById('patient-communication-section'),
        'inventory-management': document.getElementById('inventory-management-section'),
        'analytics-reporting': document.getElementById('analytics-reporting-section'),
        'compliance-security': document.getElementById('compliance-security-section'),
        'workflow-automation': document.getElementById('workflow-automation-section'),
        'marketing-patient-acquisition': document.getElementById('marketing-patient-acquisition-section'),
        'manage-users': document.getElementById('manage-users-section')
    };

    // Function to hide all sections
    function hideAllSections() {
        for (let key in sections) {
            sections[key].style.display = 'none';
        }
    }

    // Event listeners for each link using data-section
    document.querySelectorAll('.list-group-item a').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent URL from changing

            // Hide all sections
            hideAllSections();

            // Get the section to display from the data-section attribute
            const section = this.getAttribute('data-section');
            if (section && sections[section]) {
                sections[section].style.display = 'block'; // Show the selected section
<<<<<<< HEAD

                if (section === 'patient-management') {
                    loadPatients(); // Load patients when the Patient Management section is shown
                }
=======
>>>>>>> 29a635facd77f7f79cfce0081b686c0db20d72b1
            }
        });
    });

<<<<<<< HEAD
const addPatientBtn = document.getElementById('addPatientBtn');
const addPatientModalEl = document.getElementById('addPatientModal');

let addPatientModal;

// Only initialize the modal if the element exists
if (addPatientBtn && addPatientModalEl) {
    addPatientModal = new bootstrap.Modal(addPatientModalEl);

    addPatientBtn.addEventListener('click', function() {
        addPatientModal.show();
    });
}

// Form submission
const addPatientForm = document.getElementById('addPatientForm');
if (addPatientForm) {
    addPatientForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = new FormData(this);
        const patientData = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/patients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(patientData),
            });

            if (response.ok) {
                const newPatient = await response.json();
                console.log(newPatient);  // Log the patient data to verify
                alert('Patient added successfully!');
                this.reset();
                addPatientModal.hide(); // Use the modal instance to hide it
                addPatientToTable(newPatient.patient); // Add new patient to the table
            } else {
                const errorText = await response.text();
                alert('Failed to add patient. Error: ' + errorText);
            }
        } catch (error) {
            console.error('Error during form submission:', error);
        }
    });
}

    // Function to append a new patient row to the table
    function addPatientToTable(patient) {
        const tableBody = document.querySelector('#patientsList'); // Ensure this targets the correct tbody

        if (!tableBody) {
            console.error('Could not find the table body with id "patientsList"');
            return;
        }

        // Check and remove the "No patients found." row if it exists
        const noPatientsRow = tableBody.querySelector('tr td[colspan="15"]');
        if (noPatientsRow) {
            noPatientsRow.parentElement.remove();
        }

        const newRow = `
            <tr>
                <td>${patient.id || 'N/A'}</td>
                <td>${patient.patient_pronounce || 'N/A'}</td>
                <td>${patient.first_name || 'N/A'}</td>
                <td>${patient.last_name || 'N/A'}</td>
                <td>${patient.email || 'N/A'}</td>
                <td>${patient.date_of_birth || 'N/A'}</td>
                <td>${patient.address || 'N/A'}</td>
                <td>${patient.state || 'N/A'}</td>
                <td>${patient.city || 'N/A'}</td>
                <td>${patient.zip_code || 'N/A'}</td>
                <td>${patient.phone_number || 'N/A'}</td>
                <td>${patient.insurance || 'N/A'}</td>
                <td>${patient.private_insurance || 'N/A'}</td>
                <td>${patient.insurance_personal_number || 'N/A'}</td>
                <td>${patient.bill_address || 'N/A'}</td>
                <td>${patient.cabin || 'N/A'}</td>
            </tr>
        `;

        console.log("Appending new row to table: ", newRow); // Debugging log
        tableBody.insertAdjacentHTML('beforeend', newRow); // Append the new row
    }

    // Load patients when the patient management section is shown
// Load patients when the patient management section is shown
async function loadPatients() {
    try {
        const response = await fetch('/patients');
        const patients = await response.json();

        const patientsList = document.getElementById('patientsList');
        if (patientsList) {
            patientsList.innerHTML = ''; // Clear the current list

            if (patients.length === 0) {
                // If no patients are returned, display a "No patients found." message
                patientsList.innerHTML = `
                    <tr>
                        <td colspan="15" class="text-center">No patients found.</td>
                    </tr>`;
            } else {
                // If patients exist, loop through and display them
                patients.forEach(patient => {
                    const newRow = `
                        <tr>
                            <td>${patient.id || 'N/A'}</td>
                            <td>${patient.patient_pronounce || 'N/A'}</td>
                            <td>${patient.first_name || 'N/A'}</td>
                            <td>${patient.last_name || 'N/A'}</td>
                            <td>${patient.email || 'N/A'}</td>
                            <td>${patient.date_of_birth || 'N/A'}</td>
                            <td>${patient.address || 'N/A'}</td>
                            <td>${patient.state || 'N/A'}</td>
                            <td>${patient.city || 'N/A'}</td>
                            <td>${patient.zip_code || 'N/A'}</td>
                            <td>${patient.phone_number || 'N/A'}</td>
                            <td>${patient.insurance || 'N/A'}</td>
                            <td>${patient.private_insurance || 'N/A'}</td>
                            <td>${patient.insurance_personal_number || 'N/A'}</td>
                            <td>${patient.bill_address || 'N/A'}</td>
                            <td>${patient.cabin || 'N/A'}</td>
                        </tr>
                    `;
                    patientsList.insertAdjacentHTML('beforeend', newRow);
                });
            }
        } else {
            console.error('Element with id "patientsList" not found.');
        }
    } catch (error) {
        console.error('Error loading patients:', error);
    }
}
=======


    async function loadPatients() {
        const response = await fetch('/patients');
        const patients = await response.json();

        const patientsList = document.getElementById('patientsList');
        patientsList.innerHTML = '<h3>Patient List</h3>';
        patients.forEach(patient => {
            patientsList.innerHTML += `<p>${patient.first_name} ${patient.last_name} - ${patient.insurance}</p>`;
        });
    }

    // Call loadPatients on section show
    document.getElementById('managePatientsButton').addEventListener('click', function() {
        const section = document.getElementById('patient-management-section');
        section.style.display = section.style.display === 'none' ? 'block' : 'none';
        if (section.style.display === 'block') {
            loadPatients();
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Button to open the modal
    const addPatientBtn = document.getElementById('addPatientBtn');
    const addPatientModal = new bootstrap.Modal(document.getElementById('addPatientModal'));

    addPatientBtn.addEventListener('click', function() {
        addPatientModal.show(); // Show the modal when "Add Patient" is clicked
    });

    // Form submission
    document.getElementById('addPatientForm').addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = new FormData(this);
        const patientData = Object.fromEntries(formData.entries());

        const response = await fetch('/patients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(patientData),
        });

        if (response.ok) {
            alert('Patient added successfully!');
            this.reset(); // Reset the form
            addPatientModal.hide(); // Hide the modal
            loadPatients(); // Load updated patient list
        } else {
            alert('Failed to add patient. Please try again.');
        }
    });
>>>>>>> 29a635facd77f7f79cfce0081b686c0db20d72b1
});