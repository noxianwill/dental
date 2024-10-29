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

            const patientId = this.dataset.patientId; // Get patient ID for editing

            try {
                const response = await fetch(patientId ? `/patients/${patientId}` : '/patients', {
                    method: patientId ? 'PUT' : 'POST', // Use PUT if editing, otherwise POST
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(patientData),
                });

                if (response.ok) {
                    const updatedPatient = await response.json();
                    // console.log(updatedPatient); // Log the updated patient data to verify
                    alert(patientId ? 'Patient updated successfully!' : 'Patient added successfully!');
                    this.reset();
                    delete this.dataset.patientId; // Clear the patient ID for future submissions
                    addPatientModal.hide(); // Use the modal instance to hide it
                    loadPatients(); // Reload patients to reflect changes
                } else {
                    const errorText = await response.text();
                    alert('Failed to save patient. Error: ' + errorText);
                }
            } catch (error) {
                console.error('Error during form submission:', error);
            }
        });
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
                            // console.log(data.message); // Log success message
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
                    patientsList.innerHTML = `<tr><td colspan="10" class="text-center">No patients found.</td></tr>`;
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
                                <td>
                                    <div style="display: flex; flex-direction: column;">
                                        <button class="edit-button btn btn-primary" data-id="${patient.id}" style="margin-bottom: 5px;">Edit</button>
                                        <button class="delete-button btn btn-primary" data-id="${patient.id}">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        `;
                        patientsList.insertAdjacentHTML('beforeend', newRow);
                    });
                }

                // Attach event listeners to the delete buttons
                attachDeleteListeners();
                attachPatientListeners(); // Attach edit/delete listeners after loading patients
            }
        } catch (error) {
            console.error('Error loading patients:', error);
        }
    }

    // Function to attach edit event listeners to each edit button
    function attachPatientListeners() {
        const editButtons = document.querySelectorAll('.edit-button');

        editButtons.forEach(button => {
            button.addEventListener('click', async (event) => {
                const patientId = button.getAttribute('data-id');

                // Fetch the patient's data using the ID
                try {
                    const response = await fetch(`/patients/${patientId}`);
                    const patient = await response.json();

                    // Populate the modal fields with patient data
                    document.getElementById('first_name').value = patient.first_name;
                    document.getElementById('last_name').value = patient.last_name;
                    document.getElementById('email').value = patient.email;
                    document.getElementById('date_of_birth').value = patient.date_of_birth;
                    document.getElementById('address').value = patient.address;
                    document.getElementById('state').value = patient.state;
                    document.getElementById('city').value = patient.city;
                    document.getElementById('zip_code').value = patient.zip_code;
                    document.getElementById('phone_number').value = patient.phone_number;
                    document.getElementById('insurance').value = patient.insurance;
                    document.getElementById('private_insurance').value = patient.private_insurance;
                    document.getElementById('insurance_personal_number').value = patient.insurance_personal_number;
                    document.getElementById('bill_address').value = patient.bill_address;
                    document.getElementById('cabin').value = patient.cabin;

                    // Set a custom data attribute on the form for editing
                    addPatientForm.dataset.patientId = patientId;

                    addPatientModal.show(); // Show the modal
                } catch (error) {
                    console.error('Error loading patient data for editing:', error);
                }
            });
        });
    }

    // Call loadPatients when the page loads or when the relevant section is shown
    loadPatients();
});