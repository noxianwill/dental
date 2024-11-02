document.addEventListener('DOMContentLoaded', function () {
    // Check if the dashboard container exists
    const dashboardElement = document.querySelector('#patient-management-section');
    if (dashboardElement) {
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
            link.addEventListener('click', function (event) {
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

        // Modal Initialization
        const addPatientModalEl = document.getElementById('addPatientModal');
        const editPatientModalEl = document.getElementById('editPatientModal');
        let addPatientModal, editPatientModal;

        // Initialize modals
        if (addPatientModalEl) {
            addPatientModal = new bootstrap.Modal(addPatientModalEl);
            const addPatientBtn = document.getElementById('addPatientBtn');
            addPatientBtn.addEventListener('click', function () {
                addPatientModal.show();
            });
        }

        if (editPatientModalEl) {
            editPatientModal = new bootstrap.Modal(editPatientModalEl);
        }

        // Form Submission Handling
        const addPatientForm = document.getElementById('addPatientForm');
        const editPatientForm = document.getElementById('editPatientForm');

        // Add Patient Form Submission
        if (addPatientForm) {
            addPatientForm.addEventListener('submit', async function (e) {
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
                        alert('Patient added successfully!');
                        this.reset();
                        addPatientModal.hide();
                        loadPatients(); // Reload patients
                    } else {
                        const errorText = await response.text();
                        alert('Failed to save patient. Error: ' + errorText);
                    }
                } catch (error) {
                    console.error('Error during form submission:', error);
                }
            });
        }

        // Edit Patient Form Submission
        if (editPatientForm) {
            editPatientForm.addEventListener('submit', async function (e) {
                e.preventDefault();
                const formData = new FormData(this);
                const patientData = Object.fromEntries(formData.entries());
                const patientId = this.dataset.patientId; // Get patient ID for editing

                try {
                    const response = await fetch(`/patients/${patientId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(patientData),
                    });

                    if (response.ok) {
                        alert('Patient updated successfully!');
                        this.reset();
                        delete this.dataset.patientId; // Clear the patient ID
                        editPatientModal.hide(); // Hide the edit modal
                        loadPatients(); // Reload patients
                    } else {
                        const errorText = await response.text();
                        alert('Failed to update patient. Error: ' + errorText);
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
                                loadPatients(); // Reload patients to reflect changes
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
                    attachPatientListeners(); // Attach edit listeners after loading patients
                }
            } catch (error) {
                console.error('Error loading patients:', error);
            }
        }

        // Function to attach edit event listeners
		function attachPatientListeners() {
			const editButtons = document.querySelectorAll('.edit-button');

			editButtons.forEach(button => {
				button.addEventListener('click', async (event) => {
					const patientId = button.getAttribute('data-id');

					try {
						const response = await fetch(`/patients/${patientId}`);
						const patient = await response.json();

						// Populate the edit modal fields with patient data
						const editForm = document.getElementById('editPatientForm');
						editForm.dataset.patientId = patientId; // Store the patient ID for submission
						
						// Populate each field individually
							document.getElementById('edit_patient_pronounce').value = patient.patient_pronounce || '';
							document.getElementById('edit_first_name').value = patient.first_name || '';
							document.getElementById('edit_last_name').value = patient.last_name || '';
							document.getElementById('edit_email').value = patient.email || '';
							document.getElementById('edit_date_of_birth').value = patient.edit_date_of_birth || '';
							document.getElementById('edit_address').value = patient.address || '';
							document.getElementById('edit_state').value = patient.state || '';
							document.getElementById('edit_city').value = patient.city || '';
							document.getElementById('edit_zip_code').value = patient.zip_code || '';
							document.getElementById('edit_phone_number').value = patient.phone_number || '';
							document.getElementById('edit_insurance').value = patient.insurance || '';
							document.getElementById('edit_private_insurance').value = patient.private_insurance || '';
							document.getElementById('edit_insurance_personal_number').value = patient.insurance_personal_number || '';
							document.getElementById('edit_bill_address').value = patient.bill_address || '';
							document.getElementById('edit_cabin').value = patient.cabin || '';

						// Show the edit modal
						editPatientModal.show();
					} catch (error) {
						console.error('Error loading patient data for editing:', error);
					}
				});
			});
		}

        // Call loadPatients when the page loads or when the relevant section is shown
        loadPatients();
    }

    // Date Picker Initialization
    $(document).ready(function () {
        const dateInput = $("#date_of_birth");

        const datePicker = flatpickr(dateInput[0], {
            dateFormat: "d/m/Y",  // DD/MM/YYYY format
            maxDate: "today",     // Disable future dates
            allowInput: true,     // Allows users to type the date
            clickOpens: true,     // Prevents automatic calendar pop-up when typing
            yearRange: [1900, new Date().getFullYear()], // Optional range for years
        });

        // Attach the focus event after initialization
        dateInput.on("focus", function () {
            if (!datePicker.isOpen) {  // Use the datePicker instance directly
                datePicker.open();
            }
        });

        // Automatically insert slashes as the user types
        dateInput.on("input", function () {
            // Get the current input value
            let value = dateInput.val().replace(/\D/g, ''); // Remove non-digit characters

            // Format the input value as DD/MM/YYYY
            if (value.length >= 2) {
                value = value.slice(0, 2) + (value.length > 2 ? '/' : '') + value.slice(2);
            }
            if (value.length >= 5) {
                value = value.slice(0, 5) + (value.length > 5 ? '/' : '') + value.slice(5);
            }

            dateInput.val(value); // Update the input value
        });
    });
});