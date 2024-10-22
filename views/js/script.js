// /views/js/script.js:

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
            }
        });
    });



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
});