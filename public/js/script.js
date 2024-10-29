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

                if (section === 'patient-management') {
                    loadPatients(); // Load patients when the Patient Management section is shown
                }
            }
        });
    });

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
            <td>${patient.first_name || 'N/A'}</td>
            <td>${patient.last_name || 'N/A'}</td>
            <td>${patient.phone_number || 'N/A'}</td>
            <td>${patient.insurance || 'N/A'}</td>
            <td>${patient.private_insurance || 'N/A'}</td>
            <td>${patient.insurance_personal_number || 'N/A'}</td>
            <td>${patient.bill_address || 'N/A'}</td>
            <td>${patient.cabin || 'N/A'}</td>
            <td><button class="delete-button" data-id="${patient.id}">Delete</button></td>
        </tr>
    `;

    tableBody.insertAdjacentHTML('beforeend', newRow); // Append the new row

    // Reattach delete listeners after adding the new row
    attachDeleteListeners();
}

// Function to load patients and their corresponding delete buttons
async function loadPatients() {
    try {
        const response = await fetch('/patients');
        const patients = await response.json();
        
        const patientsList = document.getElementById('patientsList');
        if (patientsList) {
            patientsList.innerHTML = ''; // Clear current list

            if (patients.length === 0) {
                // No patients found
                patientsList.innerHTML = `<tr><td colspan="15" class="text-center">No patients found.</td></tr>`;
            } else {
                // Loop through and display patients
                patients.forEach(patient => {
                    const newRow = `
                        <tr>
                            <td>${patient.id || 'N/A'}</td>
                            <td>${patient.first_name || 'N/A'}</td>
                            <td>${patient.last_name || 'N/A'}</td>
                            <td>${patient.phone_number || 'N/A'}</td>
                            <td>${patient.insurance || 'N/A'}</td>
                            <td>${patient.private_insurance || 'N/A'}</td>
                            <td>${patient.insurance_personal_number || 'N/A'}</td>
                            <td>${patient.bill_address || 'N/A'}</td>
                            <td>${patient.cabin || 'N/A'}</td>
                            <td><button class="delete-button" data-id="${patient.id}">Delete</button></td>
                        </tr>
                    `;
                    patientsList.insertAdjacentHTML('beforeend', newRow);
                });
            }

            // Attach event listeners to the delete buttons
            attachDeleteListeners();
        }
    } catch (error) {
        console.error('Error loading patients:', error);
    }
}

// Function to attach delete event listeners to each delete button
function attachDeleteListeners() {
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const patientId = button.getAttribute('data-id');
            if (confirm(`Are you sure you want to delete patient with ID: ${patientId}?`)) {
                try {
                    const response = await fetch(`/patients/${patientId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        console.log(data.message); // Log success message
                        // Reload patients to reflect changes
                        loadPatients();
                    } else {
                        const errorData = await response.json();
                        console.error('Error deleting patient:', errorData.message);
                        alert('Error deleting patient: ' + errorData.message);
                    }
                } catch (error) {
                    console.error('Network error:', error);
                    alert('Network error occurred while deleting patient.');
                }
            }
        });
    });
}

// Call loadPatients when the page loads or when the relevant section is shown
loadPatients();

});