document.addEventListener('DOMContentLoaded', function() {
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

        // Modal Initialization
        const addPatientModalEl = document.getElementById('addPatientModal');
        const editPatientModalEl = document.getElementById('editPatientModal');
        let addPatientModal, editPatientModal;

        // Initialize modals
        if (addPatientModalEl) {
            addPatientModal = new bootstrap.Modal(addPatientModalEl);
            const addPatientBtn = document.getElementById('addPatientBtn');
            addPatientBtn.addEventListener('click', function() {
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
            editPatientForm.addEventListener('submit', async function(e) {
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
											<button class="view-button btn btn-primary" data-id="${patient.id}" style="margin-bottom: 5px;">View</button>
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
                    attachViewListeners();
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
                        document.getElementById('edit_date_of_birth').value = patient.date_of_birth || '';
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

        function attachViewListeners() {
            const viewButtons = document.querySelectorAll('.view-button');
            viewButtons.forEach(button => {
                button.addEventListener('click', async (event) => {
                    const patientId = button.getAttribute('data-id');

                    try {
                        const response = await fetch(`/patients/${patientId}`);
                        const patient = await response.json();

                        // Set desired width and height for the popup
                        const popupWidth = 640;
                        const popupHeight = 855;

                        // Calculate the center position
                        const left = (window.screen.width / 2) - (popupWidth / 2);
                        const top = (window.screen.height / 2) - (popupHeight / 2);

                        // Open the centered popup
                        const popup = window.open(
                            "",
                            "Patient Details",
                            `width=${popupWidth},height=${popupHeight},top=${top},left=${left},resizable=yes,scrollbars=yes`
                        );

                        // Write content to the popup window
                        popup.document.write(`
					<html>
					<head>
						<title>${patient.id || 'N/A'} - ${patient.patient_pronounce || 'N/A'} ${patient.first_name || 'N/A'} ${patient.last_name || 'N/A'}</title>
						<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet">
						<style>
							body { font-family: Arial, sans-serif; }
							.container { margin: 20px; max-width: 600px; }
							.card { box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); }
							.card-header { background-color: #007bff; color: white; }
							.detail-label { font-weight: bold; color: #333; }
						</style>
					</head>
					<body>
						<div class="container">
							<div class="card">
								<div class="card-header text-center">
									<h2>Patient Details</h2>
								</div>
								<div class="card-body">
									<div class="row mb-3">
										<div class="col-sm-5 detail-label">Patient Number:</div>
										<div class="col-sm-7">${patient.id || 'N/A'}</div>
									</div>
									<div class="row mb-3">
										<div class="col-sm-5 detail-label">Pronounce:</div>
										<div class="col-sm-7">${patient.patient_pronounce || 'N/A'}</div>
									</div>
									<div class="row mb-3">
										<div class="col-sm-5 detail-label">First Name:</div>
										<div class="col-sm-7">${patient.first_name || 'N/A'}</div>
									</div>
									<div class="row mb-3">
										<div class="col-sm-5 detail-label">Last Name:</div>
										<div class="col-sm-7">${patient.last_name || 'N/A'}</div>
									</div>
									<div class="row mb-3">
										<div class="col-sm-5 detail-label">Email:</div>
										<div class="col-sm-7">${patient.email || 'N/A'}</div>
									</div>
									<div class="row mb-3">
										<div class="col-sm-5 detail-label">Date of Birth:</div>
										<div class="col-sm-7">${patient.date_of_birth || 'N/A'}</div>
									</div>
									<div class="row mb-3">
										<div class="col-sm-5 detail-label">Address:</div>
										<div class="col-sm-7">${patient.address || 'N/A'}</div>
									</div>
									<div class="row mb-3">
										<div class="col-sm-5 detail-label">State:</div>
										<div class="col-sm-7">${patient.state || 'N/A'}</div>
									</div>
									<div class="row mb-3">
										<div class="col-sm-5 detail-label">City:</div>
										<div class="col-sm-7">${patient.city || 'N/A'}</div>
									</div>
									<div class="row mb-3">
										<div class="col-sm-5 detail-label">ZIP Code:</div>
										<div class="col-sm-7">${patient.zip_code || 'N/A'}</div>
									</div>
									<div class="row mb-3">
										<div class="col-sm-5 detail-label">Phone Number:</div>
										<div class="col-sm-7">${patient.phone_number || 'N/A'}</div>
									</div>
									<div class="row mb-3">
										<div class="col-sm-5 detail-label">Insurance:</div>
										<div class="col-sm-7">${patient.insurance || 'N/A'}</div>
									</div>
									<div class="row mb-3">
										<div class="col-sm-5 detail-label">Private Insurance:</div>
										<div class="col-sm-7">${patient.private_insurance || 'N/A'}</div>
									</div>
									<div class="row mb-3">
										<div class="col-sm-5 detail-label">Insurance Personal Number:</div>
										<div class="col-sm-7">${patient.insurance_personal_number || 'N/A'}</div>
									</div>
									<div class="row mb-3">
										<div class="col-sm-5 detail-label">Bill Address:</div>
										<div class="col-sm-7">${patient.bill_address || 'N/A'}</div>
									</div>
									<div class="row mb-3">
										<div class="col-sm-5 detail-label">Cabin:</div>
										<div class="col-sm-7">${patient.cabin || 'N/A'}</div>
									</div>
								</div>
								<div class="card-footer text-center">
									<button onclick="window.close()" class="btn btn-secondary">Close</button>
								</div>
							</div>
						</div>
					</body>
					</html>
                `);
                        popup.document.close();
                    } catch (error) {
                        console.error('Error fetching patient data:', error);
                        alert('Could not load patient data.');
                    }
                });
            });
        }

        // Call loadPatients when the page loads or when the relevant section is shown
        loadPatients();
    }

    // Date Picker Initialization for adding a new patient
    $(document).ready(function() {
        const dateInput = $("#date_of_birth");

        const datePicker = flatpickr(dateInput[0], {
            dateFormat: "d/m/Y", // DD/MM/YYYY format
            maxDate: "today", // Disable future dates
            allowInput: true, // Allows users to type the date
            clickOpens: true, // Prevents automatic calendar pop-up when typing
            yearRange: [1900, new Date().getFullYear()], // Optional range for years
        });

        // Attach the focus event after initialization
        dateInput.on("focus", function() {
            if (!datePicker.isOpen) { // Use the datePicker instance directly
                datePicker.open();
            }
        });

        // Automatically insert slashes as the user types
        dateInput.on("input", function() {
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
    // Date Picker Initialization for editing a patient
    $(document).ready(function() {
        const dateInput = $("#edit_date_of_birth");

        const datePicker = flatpickr(dateInput[0], {
            dateFormat: "d/m/Y", // DD/MM/YYYY format
            maxDate: "today", // Disable future dates
            allowInput: true, // Allows users to type the date
            clickOpens: true, // Prevents automatic calendar pop-up when typing
            yearRange: [1900, new Date().getFullYear()], // Optional range for years
        });

        // Attach the focus event after initialization
        dateInput.on("focus", function() {
            if (!datePicker.isOpen) { // Use the datePicker instance directly
                datePicker.open();
            }
        });

        // Automatically insert slashes as the user types
        dateInput.on("input", function() {
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

function limitZipCode(input) {
    if (input.value.length > 5) {
        input.value = input.value.slice(0, 5); // Trim the input to 5 digits
    }
}
document.getElementById('sidebarCollapse').addEventListener('click', function() {
    document.querySelector('.sidebar').classList.toggle('active');
    document.querySelector('.main-content').classList.toggle('active');
});

$(document).ready(function() {
    function updateDateTime() {
        var now = new Date();
        var date = now.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        var time = now.toLocaleTimeString(undefined, {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        });
        $('#currentDateTime').html('Welcome to the Dashboard! Today\'s Date And Time:<br>' + date + ' ' + time);
    }
    updateDateTime();
    setInterval(updateDateTime, 1000);
});