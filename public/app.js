// Global State Management
let currentUser = null;
let currentSection = 'home';
let activityChart = null;
let stepsChart = null;
let caloriesChart = null;
let goalsChart = null;
let authMode = 'login'; // 'login' or 'signup'

// Sample Data
const sampleUsers = [
    {
        id: 1,
        name: "Alex Johnson",
        email: "alex@example.com",
        age: 28,
        height: 175,
        weight: 70,
        gender: "male",
        joinDate: "2024-01-15"
    }
];

const sampleActivities = [
    {
        id: 1,
        userId: 1,
        type: "steps",
        value: 8500,
        date: "2024-10-14",
        category: "walking"
    },
    {
        id: 2,
        userId: 1,
        type: "water",
        value: 6,
        date: "2024-10-14",
        unit: "glasses"
    },
    {
        id: 3,
        userId: 1,
        type: "workout",
        value: 45,
        date: "2024-10-13",
        category: "cardio",
        unit: "minutes"
    },
    {
        id: 4,
        userId: 1,
        type: "calories",
        value: 2420,
        date: "2024-10-14",
        category: "burned"
    }
];

const sampleGoals = [
    {
        id: 1,
        userId: 1,
        type: "daily_steps",
        target: 10000,
        current: 8500,
        period: "daily",
        status: "active"
    },
    {
        id: 2,
        userId: 1,
        type: "weekly_workouts",
        target: 5,
        current: 3,
        period: "weekly",
        status: "active"
    },
    {
        id: 3,
        userId: 1,
        type: "daily_water",
        target: 8,
        current: 6,
        period: "daily",
        status: "active"
    }
];

const chartData = {
    weekly_steps: [
        { day: "Mon", steps: 7500 },
        { day: "Tue", steps: 9200 },
        { day: "Wed", steps: 8800 },
        { day: "Thu", steps: 10500 },
        { day: "Fri", steps: 8500 },
        { day: "Sat", steps: 12000 },
        { day: "Sun", steps: 6800 }
    ],
    monthly_calories: [
        { month: "Aug", calories: 2100 },
        { month: "Sep", calories: 2350 },
        { month: "Oct", calories: 2580 }
    ],
    weekly_water: [
        { day: "Mon", water: 6 },
        { day: "Tue", water: 7 },
        { day: "Wed", water: 5 },
        { day: "Thu", water: 8 },
        { day: "Fri", water: 6 },
        { day: "Sat", water: 9 },
        { day: "Sun", water: 7 }
    ]
};

const activityCategories = [
    { name: "Cardio", icon: "🏃‍♂️", color: "#FF6B6B" },
    { name: "Strength", icon: "💪", color: "#4ECDC4" },
    { name: "Yoga", icon: "🧘‍♀️", color: "#45B7D1" },
    { name: "Swimming", icon: "🏊‍♀️", color: "#96CEB4" }
];

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    
    // Set current date for activity form
    const activityDateInput = document.getElementById('activity-date');
    if (activityDateInput) {
        activityDateInput.value = new Date().toISOString().split('T')[0];
    }
});

function initializeApp() {
    // Check if user is logged in (simulation)
    const savedUser = sampleUsers[0]; // Simulate saved user
    if (savedUser) {
        currentUser = savedUser;
    }
    
    showSection('home');
}

function setupEventListeners() {
    // Auth forms
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const profileForm = document.getElementById('profile-form');
    const activityForm = document.getElementById('activity-form');
    const goalForm = document.getElementById('goal-form');
    const quickLogForm = document.getElementById('quick-log-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }
    if (activityForm) {
        activityForm.addEventListener('submit', handleActivityLog);
    }
    if (goalForm) {
        goalForm.addEventListener('submit', handleGoalCreation);
    }
    if (quickLogForm) {
        quickLogForm.addEventListener('submit', handleQuickLog);
    }
    
    // Chart controls
    const chartBtns = document.querySelectorAll('.chart-btn');
    chartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            chartBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            updateActivityChart(e.target.dataset.chart);
        });
    });
    
    // Profile form real-time BMI calculation
    const heightInput = document.getElementById('profile-height');
    const weightInput = document.getElementById('profile-weight');
    if (heightInput && weightInput) {
        [heightInput, weightInput].forEach(input => {
            input.addEventListener('input', updateBMIDisplay);
        });
    }
}

// Section Navigation
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
        targetSection.classList.add('fade-in');
        currentSection = sectionId;
    }
    
    // Update navigation states
    updateNavigation(sectionId);
    
    // Initialize section-specific content
    initializeSection(sectionId);
}

function updateNavigation(sectionId) {
    // Show/hide navigation elements based on section
    const navbar = document.getElementById('navbar');
    const bottomNav = document.getElementById('bottom-nav');
    const fab = document.getElementById('fab');
    
    if (sectionId === 'home' || sectionId === 'auth') {
        if (navbar) navbar.style.display = 'block';
        if (bottomNav) bottomNav.style.display = 'none';
        if (fab) fab.style.display = 'none';
    } else {
        if (navbar) navbar.style.display = 'none';
        if (bottomNav) bottomNav.style.display = 'flex';
        if (fab) fab.style.display = 'block';
    }
    
    // Update bottom nav active state
    const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
    bottomNavItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('onclick').includes(sectionId)) {
            item.classList.add('active');
        }
    });
}

function initializeSection(sectionId) {
    switch(sectionId) {
        case 'dashboard':
            updateDashboard();
            break;
        case 'profile':
            updateProfile();
            break;
        case 'activity':
            updateActivitySection();
            break;
        case 'goals':
            updateGoalsSection();
            break;
        case 'progress':
            updateProgressSection();
            break;
        case 'history':
            updateHistorySection();
            break;
    }
}

// Authentication
function toggleAuthMode() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const authTitle = document.getElementById('auth-title');
    const authSubtitle = document.getElementById('auth-subtitle');
    const authToggleText = document.getElementById('auth-toggle-text');
    const authToggleLink = document.getElementById('auth-toggle-link');
    
    if (authMode === 'login') {
        // Switch to signup
        authMode = 'signup';
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        authTitle.textContent = 'Create Account';
        authSubtitle.textContent = 'Join us to start your health journey';
        authToggleText.innerHTML = 'Already have an account? <a href="#" id="auth-toggle-link" onclick="toggleAuthMode()">Sign in</a>';
    } else {
        // Switch to login
        authMode = 'login';
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        authTitle.textContent = 'Welcome Back';
        authSubtitle.textContent = 'Sign in to continue your health journey';
        authToggleText.innerHTML = 'Don\'t have an account? <a href="#" id="auth-toggle-link" onclick="toggleAuthMode()">Sign up</a>';
    }
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Simulate login validation
    if (email && password) {
        currentUser = sampleUsers.find(user => user.email === email) || sampleUsers[0];
        showToast('Login successful! Welcome back.', 'success');
        setTimeout(() => {
            showSection('dashboard');
        }, 1000);
    } else {
        showToast('Please enter valid credentials.', 'error');
    }
}

function handleSignup(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const age = parseInt(document.getElementById('signup-age').value);
    const height = parseInt(document.getElementById('signup-height').value);
    const weight = parseInt(document.getElementById('signup-weight').value);
    const gender = document.getElementById('signup-gender').value;
    
    if (name && email && password && age && height && weight && gender) {
        // Create new user
        currentUser = {
            id: Date.now(),
            name,
            email,
            age,
            height,
            weight,
            gender,
            joinDate: new Date().toISOString().split('T')[0]
        };
        
        showToast('Account created successfully! Welcome to HealthTracker.', 'success');
        setTimeout(() => {
            showSection('dashboard');
        }, 1000);
    } else {
        showToast('Please fill in all required fields.', 'error');
    }
}

function handleGoogleLogin() {
    showToast('Google Sign-in is not available in demo mode.', 'info');
}

function showDemoLogin() {
    document.getElementById('login-email').value = 'alex@example.com';
    document.getElementById('login-password').value = 'password123';
    showSection('auth');
    showToast('Demo credentials loaded. Click Sign In to continue.', 'info');
}

function logout() {
    currentUser = null;
    showToast('You have been logged out successfully.', 'info');
    setTimeout(() => {
        showSection('home');
    }, 1000);
}

// Dashboard Functions
function updateDashboard() {
    if (!currentUser) return;
    
    // Update user name
    const userNameElement = document.getElementById('user-name');
    if (userNameElement) {
        userNameElement.textContent = currentUser.name.split(' ')[0];
    }
    
    // Update stats
    updateDashboardStats();
    
    // Update charts
    setTimeout(() => {
        initializeActivityChart();
    }, 100);
    
    // Update goals
    updateDashboardGoals();
}

function updateDashboardStats() {
    if (!currentUser) return;
    
    // Calculate BMI
    const bmi = calculateBMI(currentUser.height, currentUser.weight);
    const bmiElement = document.getElementById('user-bmi');
    const bmiStatusElement = document.getElementById('bmi-status');
    
    if (bmiElement && bmiStatusElement) {
        bmiElement.textContent = bmi.toFixed(1);
        const status = getBMICategory(bmi);
        bmiStatusElement.textContent = status;
        bmiStatusElement.className = `stat-status ${status.toLowerCase().replace(' ', '-')}`;
    }
    
    // Update today's activities
    const todayActivities = getTodayActivities();
    const stepsElement = document.getElementById('today-steps');
    const waterElement = document.getElementById('today-water');
    const caloriesElement = document.getElementById('today-calories');
    
    if (stepsElement) {
        const steps = todayActivities.find(a => a.type === 'steps');
        stepsElement.textContent = steps ? steps.value.toLocaleString() : '0';
    }
    
    if (waterElement) {
        const water = todayActivities.find(a => a.type === 'water');
        waterElement.textContent = water ? water.value : '0';
    }
    
    if (caloriesElement) {
        const calories = todayActivities.find(a => a.type === 'calories');
        caloriesElement.textContent = calories ? calories.value.toLocaleString() : '0';
    }
}

function updateDashboardGoals() {
    const goalsContainer = document.getElementById('dashboard-goals');
    if (!goalsContainer) return;
    
    goalsContainer.innerHTML = '';
    
    sampleGoals.forEach(goal => {
        const progressPercent = Math.min((goal.current / goal.target) * 100, 100);
        const goalCard = document.createElement('div');
        goalCard.className = 'goal-card';
        goalCard.innerHTML = `
            <div class="goal-header">
                <div class="goal-info">
                    <h4>${formatGoalType(goal.type)}</h4>
                    <p>${goal.current} / ${goal.target} ${getGoalUnit(goal.type)}</p>
                </div>
                <span class="goal-status">${Math.round(progressPercent)}%</span>
            </div>
            <div class="goal-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progressPercent}%"></div>
                </div>
            </div>
        `;
        goalsContainer.appendChild(goalCard);
    });
}

// Charts
function initializeActivityChart() {
    const chartCanvas = document.getElementById('activity-chart');
    if (!chartCanvas) return;
    
    if (activityChart) {
        activityChart.destroy();
    }
    
    const ctx = chartCanvas.getContext('2d');
    
    activityChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.weekly_steps.map(d => d.day),
            datasets: [{
                label: 'Steps',
                data: chartData.weekly_steps.map(d => d.steps),
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function updateActivityChart(type) {
    if (!activityChart) return;
    
    let data, label;
    switch(type) {
        case 'steps':
            data = chartData.weekly_steps.map(d => d.steps);
            label = 'Steps';
            break;
        case 'calories':
            data = [2100, 2350, 2200, 2580, 2420, 2680, 2150];
            label = 'Calories';
            break;
        case 'water':
            data = chartData.weekly_water.map(d => d.water);
            label = 'Glasses of Water';
            break;
        default:
            return;
    }
    
    activityChart.data.datasets[0].data = data;
    activityChart.data.datasets[0].label = label;
    activityChart.update();
}

function initializeProgressCharts() {
    // Steps Chart
    const stepsCanvas = document.getElementById('steps-chart');
    if (stepsCanvas && !stepsChart) {
        const ctx = stepsCanvas.getContext('2d');
        stepsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.weekly_steps.map(d => d.day),
                datasets: [{
                    label: 'Daily Steps',
                    data: chartData.weekly_steps.map(d => d.steps),
                    borderColor: '#4facfe',
                    backgroundColor: 'rgba(79, 172, 254, 0.1)',
                    borderWidth: 3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
    
    // Calories Chart
    const caloriesCanvas = document.getElementById('calories-chart');
    if (caloriesCanvas && !caloriesChart) {
        const ctx = caloriesCanvas.getContext('2d');
        caloriesChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData.monthly_calories.map(d => d.month),
                datasets: [{
                    label: 'Monthly Calories',
                    data: chartData.monthly_calories.map(d => d.calories),
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
    
    // Goals Chart
    const goalsCanvas = document.getElementById('goals-chart');
    if (goalsCanvas && !goalsChart) {
        const ctx = goalsCanvas.getContext('2d');
        goalsChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'In Progress', 'Not Started'],
                datasets: [{
                    data: [65, 25, 10],
                    backgroundColor: ['#43e97b', '#f093fb', '#ECEBD5']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
}

// Profile Functions
function updateProfile() {
    if (!currentUser) return;
    
    // Populate form fields
    const fields = ['name', 'age', 'email', 'height', 'weight', 'gender'];
    fields.forEach(field => {
        const element = document.getElementById(`profile-${field}`);
        if (element && currentUser[field]) {
            element.value = currentUser[field];
        }
    });
    
    // Update BMI display
    updateBMIDisplay();
}

function updateBMIDisplay() {
    const heightElement = document.getElementById('profile-height');
    const weightElement = document.getElementById('profile-weight');
    const bmiElement = document.getElementById('profile-bmi');
    const categoryElement = document.getElementById('profile-bmi-category');
    
    if (heightElement && weightElement && bmiElement && categoryElement) {
        const height = parseInt(heightElement.value);
        const weight = parseInt(weightElement.value);
        
        if (height && weight) {
            const bmi = calculateBMI(height, weight);
            const category = getBMICategory(bmi);
            
            bmiElement.textContent = bmi.toFixed(1);
            categoryElement.textContent = category;
            
            // Update category styling
            categoryElement.className = 'bmi-category';
            if (category === 'Normal') categoryElement.style.color = '#2ECC71';
            else if (category === 'Overweight') categoryElement.style.color = '#F39C12';
            else if (category === 'Underweight') categoryElement.style.color = '#3498DB';
            else categoryElement.style.color = '#E74C3C';
        }
    }
}

function handleProfileUpdate(e) {
    e.preventDefault();
    
    const name = document.getElementById('profile-name').value;
    const age = parseInt(document.getElementById('profile-age').value);
    const email = document.getElementById('profile-email').value;
    const height = parseInt(document.getElementById('profile-height').value);
    const weight = parseInt(document.getElementById('profile-weight').value);
    const gender = document.getElementById('profile-gender').value;
    
    if (currentUser) {
        currentUser.name = name;
        currentUser.age = age;
        currentUser.email = email;
        currentUser.height = height;
        currentUser.weight = weight;
        currentUser.gender = gender;
        
        showToast('Profile updated successfully!', 'success');
        updateDashboardStats();
    }
}

// Activity Functions
function updateActivitySection() {
    updateRecentActivities();
}

function updateRecentActivities() {
    const activitiesContainer = document.getElementById('recent-activities');
    if (!activitiesContainer) return;
    
    activitiesContainer.innerHTML = '';
    
    const recentActivities = sampleActivities.slice(-5).reverse();
    
    recentActivities.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <div class="activity-info">
                <h4>${formatActivityType(activity.type)}</h4>
                <p>${formatActivityValue(activity)} • ${formatDate(activity.date)}</p>
            </div>
            <div class="activity-actions">
                <button class="btn-icon" onclick="editActivity(${activity.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon" onclick="deleteActivity(${activity.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        activitiesContainer.appendChild(activityItem);
    });
}

function handleActivityLog(e) {
    e.preventDefault();
    
    const type = document.getElementById('activity-type').value;
    const date = document.getElementById('activity-date').value;
    const value = parseInt(document.getElementById('activity-value').value);
    const category = document.getElementById('activity-category').value;
    
    if (type && date && value) {
        const newActivity = {
            id: Date.now(),
            userId: currentUser?.id || 1,
            type,
            value,
            date,
            category: category || undefined
        };
        
        sampleActivities.push(newActivity);
        
        showToast('Activity logged successfully!', 'success');
        updateRecentActivities();
        updateDashboardStats();
        
        // Reset form
        e.target.reset();
        document.getElementById('activity-date').value = new Date().toISOString().split('T')[0];
    } else {
        showToast('Please fill in all required fields.', 'error');
    }
}

// Goals Functions
function updateGoalsSection() {
    updateActiveGoals();
}

function updateActiveGoals() {
    const goalsContainer = document.getElementById('active-goals');
    if (!goalsContainer) return;
    
    goalsContainer.innerHTML = '';
    
    sampleGoals.forEach(goal => {
        const progressPercent = Math.min((goal.current / goal.target) * 100, 100);
        const goalItem = document.createElement('div');
        goalItem.className = 'goal-item';
        goalItem.innerHTML = `
            <div class="goal-info">
                <h4>${formatGoalType(goal.type)}</h4>
                <p>${goal.current} / ${goal.target} ${getGoalUnit(goal.type)} • ${goal.period}</p>
                <div class="goal-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progressPercent}%"></div>
                    </div>
                    <div class="progress-text">
                        <span>${Math.round(progressPercent)}% Complete</span>
                    </div>
                </div>
            </div>
            <div class="goal-actions">
                <button class="btn-icon" onclick="editGoal(${goal.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon" onclick="deleteGoal(${goal.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        goalsContainer.appendChild(goalItem);
    });
}

function handleGoalCreation(e) {
    e.preventDefault();
    
    const type = document.getElementById('goal-type').value;
    const target = parseInt(document.getElementById('goal-target').value);
    const period = document.getElementById('goal-period').value;
    
    if (type && target && period) {
        const newGoal = {
            id: Date.now(),
            userId: currentUser?.id || 1,
            type,
            target,
            current: 0,
            period,
            status: 'active'
        };
        
        sampleGoals.push(newGoal);
        
        showToast('Goal created successfully!', 'success');
        updateActiveGoals();
        updateDashboardGoals();
        
        // Reset form
        e.target.reset();
    } else {
        showToast('Please fill in all required fields.', 'error');
    }
}

// Progress Functions
function updateProgressSection() {
    setTimeout(() => {
        initializeProgressCharts();
    }, 100);
}

// History Functions
function updateHistorySection() {
    updateHistoryList();
}

function updateHistoryList(filteredActivities = null) {
    const historyContainer = document.getElementById('history-list');
    if (!historyContainer) return;
    
    const activities = filteredActivities || sampleActivities;
    historyContainer.innerHTML = '';
    
    activities.reverse().forEach(activity => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="history-icon">
                <i class="${getActivityIcon(activity.type)}"></i>
            </div>
            <div class="history-info">
                <h4>${formatActivityType(activity.type)}</h4>
                <p>${formatDate(activity.date)} ${activity.category ? '• ' + activity.category : ''}</p>
            </div>
            <div class="history-value">
                ${formatActivityValue(activity)}
            </div>
            <div class="history-actions">
                <button class="btn-icon" onclick="editActivity(${activity.id})">
                    <i class="fas fa-edit"></i>
                </button>
            </div>
        `;
        historyContainer.appendChild(historyItem);
    });
}

function applyHistoryFilters() {
    const typeFilter = document.getElementById('history-filter-type').value;
    const dateFilter = document.getElementById('history-filter-date').value;
    
    let filteredActivities = [...sampleActivities];
    
    if (typeFilter !== 'all') {
        filteredActivities = filteredActivities.filter(activity => activity.type === typeFilter);
    }
    
    // Date filtering logic would go here
    // For demo purposes, we'll just use all activities
    
    updateHistoryList(filteredActivities);
    showToast('Filters applied successfully!', 'info');
}

// Quick Log Functions
function showLogActivity(type) {
    const modal = document.getElementById('quick-log-modal');
    const modalTitle = document.getElementById('modal-title');
    const quickValue = document.getElementById('quick-value');
    const quickUnit = document.getElementById('quick-unit');
    
    if (modal && modalTitle && quickValue && quickUnit) {
        modalTitle.textContent = `Log ${formatActivityType(type)}`;
        quickValue.value = '';
        quickValue.dataset.type = type;
        quickUnit.textContent = getActivityUnit(type);
        modal.style.display = 'flex';
        quickValue.focus();
    }
}

function handleQuickLog(e) {
    e.preventDefault();
    
    const quickValue = document.getElementById('quick-value');
    const type = quickValue.dataset.type;
    const value = parseInt(quickValue.value);
    
    if (type && value) {
        const newActivity = {
            id: Date.now(),
            userId: currentUser?.id || 1,
            type,
            value,
            date: new Date().toISOString().split('T')[0]
        };
        
        sampleActivities.push(newActivity);
        
        showToast(`${formatActivityType(type)} logged successfully!`, 'success');
        closeModal('quick-log-modal');
        updateDashboardStats();
        updateRecentActivities();
    } else {
        showToast('Please enter a valid value.', 'error');
    }
}

// Utility Functions
function calculateBMI(height, weight) {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
}

function getBMICategory(bmi) {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
}

function formatActivityType(type) {
    const types = {
        steps: 'Steps',
        water: 'Water Intake',
        workout: 'Workout',
        calories: 'Calories Burned'
    };
    return types[type] || type;
}

function formatGoalType(type) {
    const types = {
        daily_steps: 'Daily Steps',
        weekly_workouts: 'Weekly Workouts',
        daily_water: 'Daily Water',
        weight_loss: 'Weight Target',
        daily_calories: 'Daily Calories'
    };
    return types[type] || type;
}

function getGoalUnit(type) {
    const units = {
        daily_steps: 'steps',
        weekly_workouts: 'workouts',
        daily_water: 'glasses',
        weight_loss: 'kg',
        daily_calories: 'calories'
    };
    return units[type] || '';
}

function getActivityUnit(type) {
    const units = {
        steps: 'steps',
        water: 'glasses',
        workout: 'minutes',
        calories: 'calories'
    };
    return units[type] || '';
}

function getActivityIcon(type) {
    const icons = {
        steps: 'fas fa-walking',
        water: 'fas fa-tint',
        workout: 'fas fa-dumbbell',
        calories: 'fas fa-fire'
    };
    return icons[type] || 'fas fa-chart-line';
}

function formatActivityValue(activity) {
    const unit = getActivityUnit(activity.type);
    return `${activity.value.toLocaleString()} ${unit}`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
    });
}

function getTodayActivities() {
    const today = new Date().toISOString().split('T')[0];
    return sampleActivities.filter(activity => activity.date === today);
}

// Modal Functions
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// FAB Functions
function toggleFabMenu() {
    const fabMenu = document.getElementById('fab-menu');
    if (fabMenu) {
        fabMenu.classList.toggle('active');
    }
}

// Toast Notifications
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="${icons[type]}"></i>
        </div>
        <div class="toast-message">${message}</div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 5000);
}

// Edit/Delete Functions (Placeholder implementations)
function editActivity(id) {
    showToast('Edit functionality would be implemented here.', 'info');
}

function deleteActivity(id) {
    const index = sampleActivities.findIndex(activity => activity.id === id);
    if (index !== -1) {
        sampleActivities.splice(index, 1);
        showToast('Activity deleted successfully!', 'success');
        updateRecentActivities();
        updateHistoryList();
    }
}

function editGoal(id) {
    showToast('Edit functionality would be implemented here.', 'info');
}

function deleteGoal(id) {
    const index = sampleGoals.findIndex(goal => goal.id === id);
    if (index !== -1) {
        sampleGoals.splice(index, 1);
        showToast('Goal deleted successfully!', 'success');
        updateActiveGoals();
        updateDashboardGoals();
    }
}

// Click outside to close modals
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
    
    // Close FAB menu when clicking outside
    if (!e.target.closest('.fab')) {
        const fabMenu = document.getElementById('fab-menu');
        if (fabMenu) {
            fabMenu.classList.remove('active');
        }
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Escape key closes modals
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (modal.style.display === 'flex') {
                modal.style.display = 'none';
            }
        });
        
        // Close FAB menu
        const fabMenu = document.getElementById('fab-menu');
        if (fabMenu) {
            fabMenu.classList.remove('active');
        }
    }
});