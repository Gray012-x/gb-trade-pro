// DOM Elements
const loadingScreen = document.getElementById('loadingScreen');
const loginPage = document.getElementById('loginPage');
const registerPage = document.getElementById('registerPage');
const verificationPage = document.getElementById('verificationPage');
const dashboardPage = document.getElementById('dashboardPage');
const loginForm = document.getElementById('loginForm');
const registrationForm = document.getElementById('registrationForm');

// Hide loading screen after animation
setTimeout(() => {
    loadingScreen.style.display = 'none';
}, 3500);

// Page Navigation
function switchPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

// Login Form Handler
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Basic validation
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }

    // Simulate login
    console.log('Logging in:', email);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userName', email.split('@')[0]);

    switchPage('dashboardPage');
    updateDashboard();
});

// Registration Form - Multi-step
let currentStep = 1;
const totalSteps = 3;

const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');

nextBtn.addEventListener('click', () => {
    if (currentStep < totalSteps) {
        if (validateStep(currentStep)) {
            currentStep++;
            updateSteps();
        }
    } else {
        if (validateStep(currentStep)) {
            submitRegistration();
        }
    }
});

prevBtn.addEventListener('click', () => {
    if (currentStep > 1) {
        currentStep--;
        updateSteps();
    }
});

function updateSteps() {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });

    // Show current step
    document.getElementById(`step${currentStep}`).classList.add('active');

    // Update progress
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        step.classList.remove('active');
        if (index + 1 <= currentStep) {
            step.classList.add('active');
        }
    });

    // Update buttons
    prevBtn.style.display = currentStep > 1 ? 'block' : 'none';
    nextBtn.textContent = currentStep === totalSteps ? 'Complete Registration' : 'Next';
}

function validateStep(step) {
    const errors = {};

    switch (step) {
        case 1:
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const regEmail = document.getElementById('regEmail').value;
            const phone = document.getElementById('phone').value;
            const dob = document.getElementById('dob').value;
            const nationality = document.getElementById('nationality').value;

            if (!firstName) errors.firstName = 'First name is required';
            if (!lastName) errors.lastName = 'Last name is required';
            if (!regEmail) errors.regEmail = 'Email is required';
            if (!phone) errors.phone = 'Phone is required';
            if (!dob) errors.dob = 'Date of birth is required';
            if (!nationality) errors.nationality = 'Nationality is required';
            if (regEmail && !isValidEmail(regEmail)) errors.regEmail = 'Invalid email';

            break;
        case 2:
            const address = document.getElementById('address').value;
            const city = document.getElementById('city').value;
            const state = document.getElementById('state').value;
            const zipcode = document.getElementById('zipcode').value;
            const country = document.getElementById('country').value;
            const occupation = document.getElementById('occupation').value;

            if (!address) errors.address = 'Address is required';
            if (!city) errors.city = 'City is required';
            if (!state) errors.state = 'State is required';
            if (!zipcode) errors.zipcode = 'ZIP code is required';
            if (!country) errors.country = 'Country is required';
            if (!occupation) errors.occupation = 'Occupation is required';

            break;
        case 3:
            const idFile = document.getElementById('idFile').files[0];
            const addressFile = document.getElementById('addressFile').files[0];
            const regPassword = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const acceptTerms = document.getElementById('acceptTerms').checked;

            if (!idFile) errors.idFile = 'Please upload your ID';
            if (!addressFile) errors.addressFile = 'Please upload proof of address';
            if (!regPassword) errors.regPassword = 'Password is required';
            if (regPassword.length < 8) errors.regPassword = 'Password must be at least 8 characters';
            if (regPassword !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
            if (!acceptTerms) errors.acceptTerms = 'You must accept the terms';

            break;
    }

    displayErrors(errors);
    return Object.keys(errors).length === 0;
}

function displayErrors(errors) {
    // Clear all errors first
    document.querySelectorAll('.form-error').forEach(error => {
        error.textContent = '';
    });

    // Display new errors
    Object.keys(errors).forEach(field => {
        const errorElement = document.getElementById(`${field}Error`);
        if (errorElement) {
            errorElement.textContent = errors[field];
        }
    });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// File Upload Handlers
setupFileUpload('idUploadArea', 'idFile', 'idPreview');
setupFileUpload('addressUploadArea', 'addressFile', 'addressPreview');

function setupFileUpload(areaId, fileInputId, previewId) {
    const uploadArea = document.getElementById(areaId);
    const fileInput = document.getElementById(fileInputId);
    const preview = document.getElementById(previewId);

    uploadArea.addEventListener('click', () => fileInput.click());

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#1e40af';
        uploadArea.style.backgroundColor = 'rgba(30, 64, 175, 0.05)';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '#e5e7eb';
        uploadArea.style.backgroundColor = '#f9fafb';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            updateFilePreview(fileInput, preview);
        }
    });

    fileInput.addEventListener('change', () => {
        updateFilePreview(fileInput, preview);
    });
}

function updateFilePreview(fileInput, previewElement) {
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        previewElement.textContent = `✓ ${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
    }
}

// Password Strength Indicator
const passwordInput = document.getElementById('regPassword');
passwordInput.addEventListener('input', updatePasswordStrength);

function updatePasswordStrength() {
    const password = passwordInput.value;
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');

    let strength = 'weak';
    let strength_value = 0;

    if (password.length >= 8) strength_value++;
    if (/[A-Z]/.test(password)) strength_value++;
    if (/[0-9]/.test(password)) strength_value++;
    if (/[^A-Za-z0-9]/.test(password)) strength_value++;

    if (strength_value < 2) {
        strength = 'weak';
        strengthBar.className = 'strength-bar';
        strengthText.textContent = 'Weak password';
    } else if (strength_value < 3) {
        strength = 'fair';
        strengthBar.className = 'strength-bar fair';
        strengthText.textContent = 'Fair password';
    } else if (strength_value < 4) {
        strength = 'good';
        strengthBar.className = 'strength-bar good';
        strengthText.textContent = 'Good password';
    } else {
        strength = 'strong';
        strengthBar.className = 'strength-bar strong';
        strengthText.textContent = 'Strong password';
    }
}

// Submit Registration
function submitRegistration() {
    // Collect form data
    const userData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('regEmail').value,
        phone: document.getElementById('phone').value,
        dob: document.getElementById('dob').value,
        nationality: document.getElementById('nationality').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zipcode: document.getElementById('zipcode').value,
        country: document.getElementById('country').value,
        occupation: document.getElementById('occupation').value
    };

    // Save to localStorage
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('userName', userData.firstName);

    console.log('Registration submitted:', userData);

    // Show verification page
    switchPage('verificationPage');

    // Auto-approve after 5 seconds for demo
    setTimeout(() => {
        localStorage.setItem('verified', 'true');
        alert('Your account has been verified! You can now login.');
        switchPage('loginPage');
        registrationForm.reset();
        currentStep = 1;
        updateSteps();
    }, 5000);
}

// Dashboard Functions
function updateDashboard() {
    const userName = localStorage.getItem('userName') || 'User';
    document.getElementById('userName').textContent = userName;
    document.getElementById('pageTitle').textContent = `Welcome, ${userName}!`;
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    document.getElementById(sectionId).classList.add('active');

    // Update page title
    const titles = {
        overview: 'Dashboard Overview',
        trading: 'Trading Platform',
        portfolio: 'Your Portfolio',
        deposits: 'Deposits & Withdrawals',
        settings: 'Account Settings'
    };

    document.getElementById('pageTitle').textContent = titles[sectionId] || 'Dashboard';

    // Update sidebar active state
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('.nav-item').classList.add('active');
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
}

function logout() {
    localStorage.clear();
    switchPage('loginPage');
    loginForm.reset();
}

// Initialize
updateSteps();