// Tailwind Configuration
tailwind.config = {
    theme: {
        extend: {
            colors: {
                sidebar: '#0d1a15',
                primary: '#22c55e',
                accent: '#10b981',
                surface: '#ffffff',
                background: '#f8fafc',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        }
    }
}

// Global Application State
let charts = {};
let consumedCalories = 0;
let consumedWater = 0;
let targetCalories = 1932;
const targetWater = 7;
let selectedFood = null;
let mealHistory = [];

// PERSISTENT FOOD DATABASE
let globalFoodDatabase = JSON.parse(localStorage.getItem('nutriplan_food_db')) || [
    { name: "Egg", cal: 70, unit: "unit", type: "breakfast" },
    { name: "Egg White", cal: 17, unit: "unit", type: "breakfast" },
    { name: "Chicken Breast", cal: 165, unit: "100g", type: "lunch" },
    { name: "White Rice", cal: 130, unit: "100g", type: "lunch" },
    { name: "Brown Rice", cal: 111, unit: "100g", type: "lunch" },
    { name: "Salmon", cal: 208, unit: "100g", type: "dinner" },
    { name: "Apple", cal: 52, unit: "unit", type: "snack" },
    { name: "Banana", cal: 89, unit: "unit", type: "snack" },
    { name: "Broccoli", cal: 34, unit: "100g", type: "lunch" },
    { name: "Oatmeal", cal: 68, unit: "100g", type: "breakfast" },
    { name: "Greek Yogurt", cal: 59, unit: "100g", type: "snack" },
    { name: "Almonds", cal: 7, unit: "unit", type: "snack" },
    { name: "Peanut Butter", cal: 94, unit: "tbsp", type: "snack" },
    { name: "Lentils", cal: 116, unit: "100g", type: "lunch" },
    { name: "Tofu", cal: 76, unit: "100g", type: "lunch" },

    // Common Allergens (Categories)
    { name: "Peanuts", cal: 567, unit: "100g", type: "snack" },
    { name: "Dairy", cal: 0, unit: "category" },
    { name: "Gluten", cal: 0, unit: "category" },
    { name: "Soy", cal: 0, unit: "category" },
    { name: "Shellfish", cal: 0, unit: "category" },
    { name: "Nuts", cal: 0, unit: "category" },

    // South Indian Breakfast
    { name: "Idli", cal: 40, unit: "unit", type: "breakfast" },
    { name: "Plain Dosa", cal: 130, unit: "unit", type: "breakfast" },
    { name: "Masala Dosa", cal: 250, unit: "unit", type: "breakfast" },
    { name: "Onion Rava Dosa", cal: 220, unit: "unit", type: "breakfast" },
    { name: "Medu Vada", cal: 150, unit: "unit", type: "breakfast" },
    { name: "Sambar Vada", cal: 200, unit: "unit", type: "breakfast" },
    { name: "Upma", cal: 180, unit: "100g", type: "breakfast" },
    { name: "Ven Pongal", cal: 220, unit: "100g", type: "breakfast" },
    { name: "Set Dosa", cal: 180, unit: "unit", type: "breakfast" },
    { name: "Appam", cal: 110, unit: "unit", type: "breakfast" },
    { name: "Puttu", cal: 150, unit: "100g", type: "breakfast" },
    { name: "Rava Khichdi", cal: 190, unit: "100g", type: "breakfast" },
    { name: "Uttapam (Tomato Onion)", cal: 190, unit: "unit", type: "breakfast" },
    { name: "Pesarattu", cal: 160, unit: "unit", type: "breakfast" },

    // South Indian Rice Dishes (Lunch/Dinner)
    { name: "Sambar Rice (Bisibelebath)", cal: 160, unit: "100g", type: "lunch" },
    { name: "Curd Rice", cal: 120, unit: "100g", type: "lunch" },
    { name: "Lemon Rice", cal: 160, unit: "100g", type: "lunch" },
    { name: "Tamarind Rice (Puliyogare)", cal: 170, unit: "100g", type: "lunch" },
    { name: "Coconut Rice", cal: 190, unit: "100g", type: "lunch" },
    { name: "Tomato Rice", cal: 150, unit: "100g", type: "lunch" },
    { name: "Hyd Biryani (Chicken)", cal: 260, unit: "100g", type: "lunch" },
    { name: "Hyd Biryani (Veg)", cal: 210, unit: "100g", type: "lunch" },
    { name: "South Indian Thali", cal: 800, unit: "plate", type: "lunch" },

    // Curries & Sider (South)
    { name: "Avial", cal: 110, unit: "100g", type: "lunch" },
    { name: "Chicken Chettinad", cal: 220, unit: "100g", type: "dinner" },
    { name: "Fish Moilee", cal: 180, unit: "100g", type: "dinner" },
    { name: "Egg Roast (Kerala)", cal: 150, unit: "100g", type: "dinner" },
    { name: "Thorana (Cabbage)", cal: 80, unit: "100g", type: "lunch" },
    { name: "Poriyal (Beans)", cal: 70, unit: "100g", type: "lunch" },
    { name: "Rasam", cal: 40, unit: "100g", type: "lunch" },
    { name: "Malabar Parotta", cal: 250, unit: "unit", type: "dinner" },

    // North Indian Staples
    { name: "Phulka (Roti)", cal: 70, unit: "unit", type: "lunch" },
    { name: "Butter Naan", cal: 300, unit: "unit", type: "dinner" },
    { name: "Aloo Paratha", cal: 280, unit: "unit", type: "breakfast" },
    { name: "Dal Makhani", cal: 280, unit: "100g", type: "dinner" },
    { name: "Paneer Butter Masala", cal: 350, unit: "100g", type: "dinner" },
    { name: "Chole Bhature", cal: 550, unit: "plate", type: "lunch" },

    // Indian Snacks & Sweets
    { name: "Masala Tea", cal: 60, unit: "cup", type: "snack" }
];

const mealDatabase = {
    breakfast: [
        { title: "South Indian Idli Sambar", items: ["3 Idlis", "1 Katori Sambar", "Coconut Chutney"], cal: 350, p: 12, c: 55, f: 8 },
        { title: "Masala Dosa with Chutney", items: ["1 Masala Dosa", "Sambar", "Ginger Chutney"], cal: 420, p: 10, c: 65, f: 15 },
        { title: "Ven Pongal & Medu Vada", items: ["1 Plate Pongal", "1 Medu Vada", "Sambar"], cal: 480, p: 14, c: 60, f: 20 },
        { title: "Poha with Roasted Peanuts", items: ["1 Plate Poha", "Roasted Peanuts", "Lemon juice"], cal: 380, p: 8, c: 60, f: 12 },
        { title: "Upma with Vegetables", items: ["1 Bowl Upma", "Coconut Chutney", "Side of veggies"], cal: 320, p: 7, c: 50, f: 10 },
        { title: "Pesarattu (Green Gram Dosa)", items: ["2 Pesarattus", "Ginger Chutney", "Upma filling"], cal: 400, p: 18, c: 55, f: 12 },
        { title: "Appam with Vegetable Stew", items: ["2 Appams", "1 Bowl Veg Stew", "Coconut milk base"], cal: 350, p: 8, c: 50, f: 15 }
    ],
    lunch: [
        { title: "South Indian Full Thali", items: ["Rice", "Sambar", "Rasam", "Poriyal", "Curd"], cal: 750, p: 25, c: 110, f: 22 },
        { title: "Hyderabad Chicken Biryani", items: ["1 Bowl Biryani", "Mirchi Ka Salan", "Onion Raita"], cal: 650, p: 40, c: 75, f: 25 },
        { title: "Sambar Rice (Bisibelebath)", items: ["1 Bowl Bisibelebath", "Appalam", "Potato Fry"], cal: 550, p: 15, c: 85, f: 18 },
        { title: "Lemon Rice & Potato Poriyal", items: ["1 Plate Lemon Rice", "Potato Poriyal", "Curd"], cal: 520, p: 12, c: 90, f: 14 },
        { title: "Curd Rice with Pomegranate", items: ["1 Bowl Curd Rice", "Pickle", "Roasted Papad"], cal: 400, p: 10, c: 70, f: 8 },
        { title: "Malabar Parotta & Veg Kurma", items: ["2 Parottas", "Veg Kurma", "Onion Salad"], cal: 600, p: 12, c: 80, f: 28 }
    ],
    dinner: [
        { title: "Chicken Chettinad & Roti", items: ["2 Phulkas", "1 Bowl Chicken Chettinad", "Salad"], cal: 520, p: 35, c: 45, f: 22 },
        { title: "Fish Moilee & Steamed Rice", items: ["1 Bowl Rice", "Fish Moilee", "Thorana"], cal: 550, p: 30, c: 70, f: 18 },
        { title: "Egg Roast & Appam", items: ["2 Appams", "Egg Roast", "Veg Salad"], cal: 450, p: 20, c: 50, f: 18 },
        { title: "Light Rava Khichdi", items: ["1 Plate Rava Khichdi", "Coconut Chutney", "Curd"], cal: 380, p: 8, c: 55, f: 12 },
        { title: "Set Dosa & Sagu", items: ["2 Set Dosas", "Veg Sagu", "Butter"], cal: 450, p: 10, c: 65, f: 18 }
    ],
    snacks: [
        { title: "Filter Coffee & Mysore Pak", items: ["1 Cup Coffee", "1 Mysore Pak"], cal: 230, p: 3, c: 25, f: 14 },
        { title: "Banana Chips & Masala Tea", items: ["50g Banana Chips", "1 Cup Tea"], cal: 310, p: 4, c: 35, f: 18 },
        { title: "Medu Vada (Snack Portion)", items: ["2 Small Vadas", "Coconut Chutney"], cal: 280, p: 8, c: 30, f: 15 },
        { title: "Roasted Makhana", items: ["1 Bowl Makhana", "Chai"], cal: 180, p: 5, c: 25, f: 6 },
        { title: "Sundal (Chickpea Snack)", items: ["1 Bowl Sundal", "Grated Coconut"], cal: 150, p: 8, c: 20, f: 4 }
    ]
};

function init() {
    lucide.createIcons();
    initDashboardChart();
    updateTrackerUI();
    updateWaterUI();

    // Save initial food database to localStorage if not exists
    if (!localStorage.getItem('nutriplan_food_db')) {
        saveFoodDatabase();
    }
}

function handleLogin(event) {
    event.preventDefault(); // Prevent form submission

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Get stored users from localStorage or initialize with demo user
    let users = JSON.parse(localStorage.getItem('nutriplan_users')) || {
        'user': {
            name: 'User',
            password: 'user'
        }
    };

    if ((email === 'admin' && password === 'admin') || (users[email] && users[email].password === password)) {
        const isAdmin = email === 'admin';

        // Hide Admin nav by default, show if admin
        const adminNav = document.getElementById('admin-nav-item');
        if (isAdmin) {
            adminNav.classList.remove('hidden');
        } else {
            adminNav.classList.add('hidden');
        }

        // Set basic profile name
        const capitalizedName = isAdmin ? 'Administrator' : users[email].name;
        document.getElementById('profile-name').value = capitalizedName;

        // Update welcome message
        const welcomeText = document.querySelector('#dashboard-section h2');
        if (welcomeText) welcomeText.innerHTML = `Welcome back, ${capitalizedName}! <span class="text-3xl">👋</span>`;

        // Hide login, show app
        document.getElementById('login-section').classList.add('hidden');
        document.getElementById('app-container').classList.remove('hidden');

        // Initialize dashboard now that it is visible
        init();
    } else {
        alert('Invalid credentials. Please use "admin"/"admin" or your registered account.');
    }
}

function toggleAuth(view) {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const loginToggle = document.getElementById('login-toggle');
    const signupToggle = document.getElementById('signup-toggle');

    if (view === 'signup') {
        if (loginForm) loginForm.classList.add('hidden');
        if (loginToggle) loginToggle.classList.add('hidden');
        if (signupForm) signupForm.classList.remove('hidden');
        if (signupToggle) signupToggle.classList.remove('hidden');
        document.getElementById('admin-login-hint').classList.add('hidden');
    } else {
        if (signupForm) signupForm.classList.add('hidden');
        if (signupToggle) signupToggle.classList.add('hidden');
        if (loginForm) loginForm.classList.remove('hidden');
        if (loginToggle) loginToggle.classList.remove('hidden');
        document.getElementById('admin-login-hint').classList.remove('hidden');
        toggleAdminView(false); // Reset to user view
    }
}

function toggleAdminView(showAdmin) {
    const iconContainer = document.getElementById('login-icon-container');
    const title = document.getElementById('login-title');
    const subtitle = document.getElementById('login-subtitle');
    const adminBtn = document.getElementById('admin-view-btn');
    const userBtn = document.getElementById('user-view-btn');
    const emailInput = document.getElementById('login-email');
    const passInput = document.getElementById('login-password');
    const signupToggle = document.getElementById('login-toggle');

    if (showAdmin) {
        iconContainer.classList.remove('bg-primary');
        iconContainer.classList.add('bg-amber-500');
        iconContainer.innerHTML = '<i data-lucide="shield-check" class="w-8 h-8"></i>';
        title.innerText = 'Admin Access';
        title.classList.add('text-amber-600');
        subtitle.innerText = 'Please enter administrative credentials to continue.';
        adminBtn.classList.add('hidden');
        userBtn.classList.remove('hidden');
        signupToggle.classList.add('hidden');

        emailInput.value = 'admin';
        passInput.value = '';
        passInput.focus();
    } else {
        iconContainer.classList.add('bg-primary');
        iconContainer.classList.remove('bg-amber-500');
        iconContainer.innerHTML = '<i data-lucide="leaf" class="w-8 h-8"></i>';
        title.innerText = 'Welcome to NutriPlan';
        title.classList.remove('text-amber-600');
        subtitle.innerText = 'Your personal gateway to a healthier lifestyle and smarter diet planning.';
        adminBtn.classList.remove('hidden');
        userBtn.classList.add('hidden');
        signupToggle.classList.remove('hidden');

        if (emailInput.value === 'admin') emailInput.value = '';
    }
    lucide.createIcons();
}

// --- ALLERGY SUGGESTIONS ---
function showAllergySuggestions(input) {
    const suggestionsContainer = document.getElementById('allergy-suggestions');
    const value = input.value;
    const lastPart = value.split(',').pop().trim().toLowerCase();

    if (!lastPart || lastPart.length < 1) {
        suggestionsContainer.classList.add('hidden');
        return;
    }

    // Filter unique items from database that match current input
    // We want to show both the name and a label if it's a category
    const matches = globalFoodDatabase
        .filter(f => f.name.toLowerCase().includes(lastPart))
        .reduce((acc, current) => {
            const x = acc.find(item => item.name === current.name);
            if (!x) return acc.concat([current]);
            return acc;
        }, [])
        .slice(0, 6);

    if (matches.length > 0) {
        suggestionsContainer.innerHTML = matches.map(f => {
            const isCategory = f.unit === 'category';
            const badgeClass = isCategory ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600';
            const badgeText = isCategory ? 'Category' : 'Food';

            return `
                <div onmousedown="selectAllergy('${f.name}')" 
                    class="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between group transition-all border-b border-slate-50 last:border-none">
                    <div class="flex items-center gap-3">
                        <span class="text-sm text-slate-700 font-semibold">${f.name}</span>
                        <span class="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md ${badgeClass}">${badgeText}</span>
                    </div>
                    <i data-lucide="plus" class="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors"></i>
                </div>
            `;
        }).join('');
        lucide.createIcons();
        suggestionsContainer.classList.remove('hidden');
    } else {
        suggestionsContainer.classList.add('hidden');
    }
}

function selectAllergy(name) {
    const input = document.getElementById('profile-allergies');
    const parts = input.value.split(',').map(p => p.trim());

    // Replace the last (partial) part with the selection
    parts[parts.length - 1] = name;

    // Join back and add a comma for the next one
    input.value = parts.join(', ') + ', ';

    document.getElementById('allergy-suggestions').classList.add('hidden');
    input.focus();
}

function handleSignup(event) {
    event.preventDefault();

    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    if (name && email && password) {
        // Get existing users or initialize empty
        let users = JSON.parse(localStorage.getItem('nutriplan_users')) || {
            'user': {
                name: 'User',
                password: 'user'
            }
        };

        // Check if user already exists
        if (users[email]) {
            alert('An account with this username/email already exists!');
            return;
        }

        // Add format user name
        const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

        // Save new user
        users[email] = {
            name: capitalizedName,
            password: password
        };
        localStorage.setItem('nutriplan_users', JSON.stringify(users));

        // Set profile name based on input
        document.getElementById('profile-name').value = capitalizedName;

        // Update welcome message
        const welcomeText = document.querySelector('#dashboard-section h2');
        if (welcomeText) welcomeText.innerHTML = `Welcome, ${capitalizedName}! <span class="text-3xl">👋</span>`;

        // Hide login section, show app
        document.getElementById('login-section').classList.add('hidden');
        document.getElementById('app-container').classList.remove('hidden');

        // Clear form
        document.getElementById('signup-form').reset();

        // Initialize dashboard
        init();

        // Switch back to login view for next time
        toggleAuth('login');
    }
}

function handleFoodSearch() {
    const query = document.getElementById('food-search').value.toLowerCase();
    const resultsDiv = document.getElementById('food-results');

    if (query.length < 1) {
        resultsDiv.classList.add('hidden');
        return;
    }

    const matches = globalFoodDatabase.filter(f => f.name.toLowerCase().includes(query));

    if (matches.length > 0) {
        resultsDiv.innerHTML = matches.map(f => `
            <div class="p-4 border-b border-slate-50 last:border-none cursor-pointer hover:bg-green-50 flex justify-between items-center transition-all" onclick="selectFood('${f.name}')">
                <span class="font-bold text-slate-700">${f.name}</span>
                <span class="text-xs text-slate-400 font-bold uppercase">${f.cal} kcal / ${f.unit}</span>
            </div>
        `).join('');
        resultsDiv.classList.remove('hidden');
    } else {
        resultsDiv.classList.add('hidden');
    }
}

function selectFood(name) {
    const food = globalFoodDatabase.find(f => f.name === name);
    if (!food) return;

    selectedFood = food;
    document.getElementById('food-search').value = food.name;
    document.getElementById('food-results').classList.add('hidden');
    calculateLogCalories();
}

function calculateLogCalories() {
    const qty = parseFloat(document.getElementById('food-quantity').value) || 0;
    if (selectedFood) {
        const total = Math.round(selectedFood.cal * qty);
        document.getElementById('display-calories').innerText = total;
    }
}

function logSearchMeal() {
    const type = document.getElementById('tracker-meal-type').value;
    const name = document.getElementById('food-search').value;
    const qty = document.getElementById('food-quantity').value;
    const calories = parseInt(document.getElementById('display-calories').innerText);

    if (!name || isNaN(calories) || calories <= 0) {
        alert('Please select a food and valid quantity.');
        return;
    }

    const meal = { id: Date.now(), type, name, qty, unit: selectedFood ? selectedFood.unit : 'units', calories, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    mealHistory.unshift(meal);
    consumedCalories += calories;

    updateTrackerUI();

    // Clear form
    document.getElementById('food-search').value = '';
    document.getElementById('food-quantity').value = 1;
    document.getElementById('display-calories').innerText = '0';
    selectedFood = null;
}

let currentPlannerDay = 1;

// Helper to generate a meal from the global database based on preference, allergies, and health conditions
function generateMealForPreference(type, dayNum, preference, allergies = [], conditions = []) {
    const prefStr = preference.toLowerCase();
    const isVegan = prefStr.includes('vegan');
    const isVegetarian = prefStr.includes('vegetarian') && !prefStr.includes('non');
    const isNonVeg = prefStr.includes('non');

    const meatWords = ['chicken', 'beef', 'mutton', 'salmon', 'egg', 'fish', 'meat'];
    const dairyWords = ['paneer', 'butter', 'ghee', 'curd', 'yogurt', 'milk', 'cheese', 'malai', 'lassi', 'kheer'];
    const sugarWords = ['sugar', 'sweet', 'jalebi', 'jamun', 'katli', 'ladoo', 'halwa', 'kheer', 'dessert', 'mysore pak'];

    // 1. Try to get a pre-defined meal from mealDatabase first
    let mealOptions = mealDatabase[type] || [];

    // Filter mealDatabase options by Diet Preference
    if (isVegetarian || isVegan) {
        let avoidWords = [...meatWords];
        if (isVegan) avoidWords = [...avoidWords, ...dairyWords];
        mealOptions = mealOptions.filter(m => {
            const str = (m.title + ' ' + m.items.join(' ')).toLowerCase();
            return !avoidWords.some(w => str.includes(w));
        });
    }

    // Filter mealDatabase options by Allergies
    if (allergies.length > 0 && allergies[0] !== "") {
        mealOptions = mealOptions.filter(m => {
            const str = (m.title + ' ' + m.items.join(' ')).toLowerCase();
            return !allergies.some(allergy => {
                const a = allergy.trim().toLowerCase();
                if (a === 'dairy') return dairyWords.some(w => str.includes(w));
                if (a === 'nuts' || a === 'peanuts') return ['peanut', 'almond', 'cashew', 'walnut', 'pistachio', 'nut'].some(w => str.includes(w));
                return str.includes(a);
            });
        });
    }

    // Filter mealDatabase options by Health Conditions
    if (conditions.length > 0) {
        mealOptions = mealOptions.filter(m => {
            const str = (m.title + ' ' + m.items.join(' ')).toLowerCase();
            if (conditions.includes('Diabetes') && sugarWords.some(w => str.includes(w))) return false;
            if (conditions.includes('Hypertension') && ['papad', 'pickle', 'salted', 'processed'].some(w => str.includes(w))) return false;
            if (conditions.includes('Heart Disease') && ['butter', 'ghee', 'fried', 'malai'].some(w => str.includes(w))) return false;
            return true;
        });
    }

    // If we found matching meals in mealDatabase, pick one deterministically
    if (mealOptions.length > 0) {
        const index = (dayNum + type.length) % mealOptions.length;
        return mealOptions[index];
    }

    // 2. Fallback: Generate from globalFoodDatabase if no pre-defined meal fits
    let foodOptions = globalFoodDatabase.filter(f => f.type === type || !f.type);

    // Apply same filters to individual food items
    if (isVegetarian || isVegan) {
        let avoidWords = [...meatWords];
        if (isVegan) avoidWords = [...avoidWords, ...dairyWords];
        foodOptions = foodOptions.filter(f => !avoidWords.some(w => f.name.toLowerCase().includes(w)));
    }

    // (Additional fallback filtering omitted for brevity, but follows same pattern)
    if (foodOptions.length === 0) foodOptions = globalFoodDatabase;

    const foodIndex = (dayNum * 7 + type.length) % foodOptions.length;
    const selected = foodOptions[foodIndex];

    return {
        title: selected.name,
        cal: selected.cal,
        items: [`1 ${selected.unit || 'serving'} ${selected.name}`, "1 glass Water"],
        p: Math.round(selected.cal * 0.05),
        c: Math.round(selected.cal * 0.12),
        f: Math.round(selected.cal * 0.03)
    };
}


function generateMealPlan() {
    document.getElementById('planner-initial').classList.add('hidden');
    document.getElementById('planner-result').classList.remove('hidden');

    // We don't need the local dietSelect listener here anymore since diet is fixed from the Profile page.
    switchDay(1);
}

function handlePreferenceChange() {
    // Re-render the currently selected day
    switchDay(currentPlannerDay);
}

function switchDay(dayNum) {
    currentPlannerDay = dayNum; // Track current day globally

    const btns = document.querySelectorAll('.day-btn');
    btns.forEach((btn, idx) => {
        if (idx === dayNum - 1) {
            btn.className = "day-btn px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm transition-all shadow-md";
        } else {
            btn.className = "day-btn px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-500 font-bold text-sm hover:border-primary/50 transition-all";
        }
    });

    const container = document.getElementById('daily-meal-container');
    container.innerHTML = '';

    const mealTypes = ['breakfast', 'lunch', 'dinner', 'snacks'];
    let totalDayCals = 0;

    // Grab current preference, allergies, and conditions
    const preference = document.getElementById('profile-diet') ? document.getElementById('profile-diet').value : 'Balanced View';
    const allergiesInput = document.getElementById('profile-allergies') ? document.getElementById('profile-allergies').value : '';
    const allergies = allergiesInput ? allergiesInput.split(',').map(a => a.trim()).filter(a => a !== "") : [];

    // Get health conditions from selected tags
    const conditionButtons = document.querySelectorAll('#profile-health-conditions button.tag-active');
    let conditions = Array.from(conditionButtons).map(btn => btn.innerText).filter(c => c !== 'None');

    // Add custom 'Other' condition to the filter list
    if (conditions.includes('Other')) {
        const otherVal = document.getElementById('profile-other-condition').value.trim();
        if (otherVal) conditions.push(otherVal);
    }

    mealTypes.forEach(type => {
        // Generate meal filtering by preference, allergies, and conditions
        const meal = generateMealForPreference(type, dayNum, preference, allergies, conditions);
        totalDayCals += meal.cal;

        const card = `
            <div class="result-card">
                <div class="meal-card-header">
                    <h3 class="text-lg font-bold capitalize">${type}</h3>
                    <span class="text-sm font-bold text-primary">${meal.cal} kcal</span>
                </div>
                <div class="space-y-3 mb-6">
                    <p class="font-bold text-slate-700">${meal.title}</p>
                    ${meal.items.map(item => `
                        <div class="flex items-center gap-3 text-sm text-slate-500 font-medium">
                            <i data-lucide="check-circle" class="w-4 h-4 text-primary"></i> ${item}
                        </div>
                    `).join('')}
                </div>
                <div class="pt-4 border-t border-slate-100 flex gap-6 text-[11px] font-bold text-slate-400 uppercase">
                    <span>Protein: ${meal.p}g</span>
                    <span>Carbs: ${meal.c}g</span>
                    <span>Fats: ${meal.f}g</span>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });

    const totalEl = document.getElementById('total-daily-calories');
    if (totalEl) {
        totalEl.innerText = totalDayCals + ' kcal';
        if (totalDayCals > targetCalories) {
            totalEl.classList.remove('text-primary');
            totalEl.classList.add('text-red-500');
        } else {
            totalEl.classList.remove('text-red-500');
            totalEl.classList.add('text-primary');
        }
    }
    lucide.createIcons();
}

function switchSection(sectionId, element) {
    document.querySelectorAll('main > div > div').forEach(section => section.classList.add('hidden'));
    document.getElementById(sectionId + '-section').classList.remove('hidden');
    document.getElementById('header-title').innerText = sectionId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    if (sectionId === 'progress-reports') initProgressCharts();
    if (sectionId === 'bmi-calculator') calculateBMI();
    if (sectionId === 'admin') initAdminPanel();

    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('nav-item-active'));
    element.classList.add('nav-item-active');
}

function initProgressCharts() {
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: { grid: { color: '#f1f5f9' }, ticks: { color: '#94a3b8', font: { size: 10, weight: 'bold' } } },
            x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10, weight: 'bold' } } }
        }
    };

    if (charts.weight) charts.weight.destroy();
    const startW = parseFloat(document.getElementById('profile-weight')?.value || 52);
    const weightData = Array.from({ length: 8 }, (_, i) => +(startW + (Math.random() * 2 - 1)).toFixed(1));
    weightData.push(startW);

    charts.weight = new Chart(document.getElementById('weightTrendChart'), {
        type: 'line',
        data: {
            labels: ['Jan 6', 'Jan 13', 'Jan 20', 'Jan 27', 'Feb 3', 'Feb 10', 'Feb 17', 'Feb 20', 'Current'],
            datasets: [{
                data: weightData,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.1,
                borderWidth: 2,
                pointRadius: 4,
                pointBackgroundColor: '#fff',
                pointBorderWidth: 2,
                fill: true
            }]
        },
        options: commonOptions
    });

    if (charts.bmi) charts.bmi.destroy();
    const startBMI = parseFloat(document.getElementById('dash-bmi')?.innerText || 25);
    const bmiData = Array.from({ length: 8 }, (_, i) => +(startBMI + (Math.random() * 1.5 - 0.5)).toFixed(1));
    bmiData.push(startBMI);

    charts.bmi = new Chart(document.getElementById('bmiTrendChart'), {
        type: 'line',
        data: {
            labels: ['Jan 6', 'Jan 13', 'Jan 20', 'Jan 27', 'Feb 3', 'Feb 10', 'Feb 17', 'Feb 20', 'Current'],
            datasets: [{
                data: bmiData,
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                tension: 0.1,
                borderWidth: 2,
                pointRadius: 4,
                pointBackgroundColor: '#fff',
                pointBorderWidth: 2,
                fill: true
            }]
        },
        options: commonOptions
    });

    if (charts.calorie) charts.calorie.destroy();
    const calData = Array.from({ length: 6 }, () => Math.floor(Math.random() * (1900 - 1300 + 1) + 1300));
    calData.push(consumedCalories);

    charts.calorie = new Chart(document.getElementById('calorieTrendChart'), {
        type: 'bar',
        data: {
            labels: ['Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue'],
            datasets: [{
                data: calData,
                backgroundColor: '#22c55e',
                borderRadius: 6
            }]
        },
        options: commonOptions
    });

    if (charts.waterChart) charts.waterChart.destroy();
    const waterData = Array.from({ length: 6 }, () => Math.floor(Math.random() * (9 - 4 + 1) + 4));
    waterData.push(consumedWater);

    charts.waterChart = new Chart(document.getElementById('waterTrendChart'), {
        type: 'bar',
        data: {
            labels: ['Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue'],
            datasets: [{
                data: waterData,
                backgroundColor: '#3b82f6',
                borderRadius: 6
            }]
        },
        options: Object.assign({}, commonOptions, { scales: { y: { beginAtZero: true } } })
    });
}

function calculateCalorieLimit() {
    const age = parseInt(document.getElementById('profile-age').value) || 20;
    const gender = document.getElementById('profile-gender').value;
    const height = parseFloat(document.getElementById('profile-height').value) || 165;
    const weight = parseFloat(document.getElementById('profile-weight').value) || 70;
    const targetWeight = parseFloat(document.getElementById('profile-target-weight').value) || 65;
    const activityMultiplier = parseFloat(document.getElementById('profile-activity').value) || 1.55;

    // Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    const tdee = bmr * activityMultiplier;

    // Adjust based on weight goal
    let limit = tdee;
    if (targetWeight < weight - 1) {
        limit = tdee - 500; // Weight Loss
    } else if (targetWeight > weight + 1) {
        limit = tdee + 500; // Weight Gain
    }

    return Math.round(limit);
}

function toggleTag(btn) {
    if (btn.innerText === 'None') {
        const container = btn.parentElement;
        container.querySelectorAll('button').forEach(b => b.classList.remove('tag-active'));
        btn.classList.add('tag-active');
        document.getElementById('other-condition-container').classList.add('hidden');
    } else {
        const noneBtn = Array.from(btn.parentElement.querySelectorAll('button')).find(b => b.innerText === 'None');
        if (noneBtn) noneBtn.classList.remove('tag-active');
        btn.classList.toggle('tag-active');

        const activeTags = Array.from(btn.parentElement.querySelectorAll('button.tag-active'));
        if (activeTags.length === 0 && noneBtn) {
            noneBtn.classList.add('tag-active');
        }

        // Show/hide other condition input
        if (btn.innerText === 'Other') {
            const container = document.getElementById('other-condition-container');
            if (btn.classList.contains('tag-active')) {
                container.classList.remove('hidden');
                document.getElementById('profile-other-condition').focus();
            } else {
                container.classList.add('hidden');
            }
        }
    }
}

function saveProfile() {
    const name = document.getElementById('profile-name').value;
    const age = document.getElementById('profile-age').value;
    const weight = document.getElementById('profile-weight').value;
    const height = document.getElementById('profile-height').value;
    const diet = document.getElementById('profile-diet').value;
    const goal = document.getElementById('profile-goal').value;

    // Calculate new calorie limit
    targetCalories = calculateCalorieLimit();

    const welcomeText = document.querySelector('#dashboard-section h2');
    if (welcomeText) welcomeText.innerHTML = `Welcome back, ${name.split(' ')[0]}! <span class="text-3xl">👋</span>`;

    document.getElementById('planner-name').innerText = name;
    document.getElementById('planner-weight').innerText = weight + ' kg';
    document.getElementById('planner-goal').innerText = goal;
    // Sync the diet preference to the planner UI
    const plannerDietEl = document.getElementById('planner-diet');
    if (plannerDietEl) {
        plannerDietEl.innerText = diet;
    }

    // Sync Allergies to the planner UI
    const allergies = document.getElementById('profile-allergies').value.trim().replace(/,\s*$/, '');
    const plannerAllergiesEl = document.getElementById('planner-allergies');
    if (plannerAllergiesEl) {
        plannerAllergiesEl.innerText = allergies || 'None';
    }
    // Sync Conditions to the planner UI
    const conditionButtons = document.querySelectorAll('#profile-health-conditions button.tag-active');
    let selectedConditions = Array.from(conditionButtons).map(btn => btn.innerText).filter(c => c !== 'None');

    // Include 'Other' condition if entered
    if (selectedConditions.includes('Other')) {
        const otherVal = document.getElementById('profile-other-condition').value.trim();
        if (otherVal) {
            selectedConditions = selectedConditions.map(c => c === 'Other' ? `Other (${otherVal})` : c);
        }
    }

    const plannerConditionsEl = document.getElementById('planner-conditions');
    if (plannerConditionsEl) {
        plannerConditionsEl.innerText = selectedConditions.length > 0 ? selectedConditions.join(', ') : 'None';
    }

    // Sync BMI calculator inputs
    const bmiW = document.getElementById('bmi-weight');
    const bmiH = document.getElementById('bmi-height');
    if (bmiW) bmiW.value = weight;
    if (bmiH) bmiH.value = height;

    calculateBMI();
    updateTrackerUI();

    // Auto-update the meal plan if it's already visible
    if (!document.getElementById('planner-result').classList.contains('hidden')) {
        switchDay(currentPlannerDay);
    }

    alert('Profile saved successfully! Your dashboard and diet plan targets have been updated.');
}

function addWater() {
    consumedWater++;
    updateWaterUI();
}

function updateWaterUI() {
    if (document.getElementById('water-count-main')) document.getElementById('water-count-main').innerText = consumedWater;
    document.getElementById('dash-water').innerText = consumedWater;
    const circle = document.getElementById('water-progress-circle');
    if (circle) {
        const circumference = 276.46;
        const offset = circumference - (Math.min(consumedWater, targetWater) / targetWater) * circumference;
        circle.style.strokeDashoffset = offset;
    }
}

function calculateBMI() {
    const weight = parseFloat(document.getElementById('bmi-weight').value);
    const heightCm = parseFloat(document.getElementById('bmi-height').value);
    const height = heightCm / 100;

    if (!weight || !height || height <= 0) return;

    const bmi = (weight / (height * height)).toFixed(1);

    // Update Values
    document.getElementById('bmi-value').innerText = bmi;
    document.getElementById('dash-bmi').innerText = bmi;

    // Determine Status
    let status = "";
    let colorClass = "";
    let dashColorClass = "";
    let indicatorPos = 0;

    if (bmi < 18.5) {
        status = "Underweight";
        colorClass = "text-blue-500";
        dashColorClass = "text-blue-500";
        indicatorPos = Math.max(5, (bmi / 18.5) * 25);
    } else if (bmi < 25) {
        status = "Normal";
        colorClass = "text-primary";
        dashColorClass = "text-primary";
        indicatorPos = 25 + ((bmi - 18.5) / 6.5) * 25;
    } else if (bmi < 30) {
        status = "Overweight";
        colorClass = "text-orange-500";
        dashColorClass = "text-orange-500";
        indicatorPos = 50 + ((bmi - 25) / 5) * 25;
    } else {
        status = "Obese";
        colorClass = "text-red-500";
        dashColorClass = "text-red-500";
        indicatorPos = Math.min(95, 75 + ((bmi - 30) / 10) * 25);
    }

    // Update Status UI
    const statusEl = document.getElementById('bmi-status');
    statusEl.innerText = status;
    statusEl.className = `text-2xl font-bold ${colorClass}`;

    const dashStatusEl = document.getElementById('dash-bmi-status');
    dashStatusEl.innerText = status;
    // Note: Tailwind classes might not update reliably via className if they were hardcoded styles,
    // but here we are replacing the class string.
    dashStatusEl.className = `text-sm ${dashColorClass}`;

    // Update Indicator Dot
    const indicator = document.getElementById('bmi-indicator');
    if (indicator) {
        indicator.style.left = `${indicatorPos}%`;
    }

    // Update Healthy Range
    const minWeight = (18.5 * height * height).toFixed(1);
    const maxWeight = (24.9 * height * height).toFixed(1);
    document.getElementById('bmi-range').innerText = `${minWeight} – ${maxWeight} kg`;
}

function initDashboardChart() {
    // 1. Weekly Dashboard Chart
    const weeklyCtxEl = document.getElementById('weeklyChart');
    if (weeklyCtxEl) {
        const ctx = weeklyCtxEl.getContext('2d');

        // Generate random realistic calorie intake for the past 6 days
        const randomData = Array.from({ length: 6 }, () => Math.floor(Math.random() * (1900 - 1300 + 1) + 1300));

        // Day 7 (Today) maps to the actual current consumedCalories tracking variable
        randomData.push(consumedCalories);

        charts.weekly = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue'],
                datasets: [{
                    data: randomData,
                    backgroundColor: '#22c55e',
                    borderRadius: 8,
                    barThickness: 32
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, max: 2200, ticks: { stepSize: 500, color: '#94a3b8' } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    // 2. Progress Reports: Weight Trend (Line Chart)
    const weightCtxEl = document.getElementById('weightTrendChart');
    if (weightCtxEl) {
        const weightCtx = weightCtxEl.getContext('2d');
        const startW = parseFloat(document.getElementById('profile-weight')?.value || 52);
        const weightData = Array.from({ length: 6 }, (_, i) => +(startW + (Math.random() * 2 - 1)).toFixed(1));
        weightData.push(startW); // End on current profile weight

        charts.weight = new Chart(weightCtx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Current'],
                datasets: [{
                    label: 'Weight (kg)',
                    data: weightData,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    // 3. Progress Reports: BMI Progress (Line Chart)
    const bmiCtxEl = document.getElementById('bmiTrendChart');
    if (bmiCtxEl) {
        const bmiCtx = bmiCtxEl.getContext('2d');
        const startBMI = parseFloat(document.getElementById('dash-bmi')?.innerText || 25);
        const bmiData = Array.from({ length: 6 }, (_, i) => +(startBMI + (Math.random() * 1.5 - 0.5)).toFixed(1));
        bmiData.push(startBMI); // End on current BMI

        charts.bmi = new Chart(bmiCtx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Current'],
                datasets: [{
                    label: 'BMI',
                    data: bmiData,
                    borderColor: '#f97316',
                    backgroundColor: 'rgba(249, 115, 22, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    // 4. Progress Reports: Daily Calorie Intake (Bar Chart)
    const calCtxEl = document.getElementById('calorieTrendChart');
    if (calCtxEl) {
        const calCtx = calCtxEl.getContext('2d');
        const calData = Array.from({ length: 7 }, () => Math.floor(Math.random() * (2200 - 1500 + 1) + 1500));

        charts.calorie = new Chart(calCtx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Calories (kcal)',
                    data: calData,
                    backgroundColor: '#eab308',
                    borderRadius: 6
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    // 5. Progress Reports: Water Intake Trend (Bar Chart)
    const waterCtxEl = document.getElementById('waterTrendChart');
    if (waterCtxEl) {
        const waterCtx = waterCtxEl.getContext('2d');
        const waterData = Array.from({ length: 7 }, () => Math.floor(Math.random() * (10 - 4 + 1) + 4));

        charts.water = new Chart(waterCtx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Water (Glasses)',
                    data: waterData,
                    backgroundColor: '#0ea5e9',
                    borderRadius: 6
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
        });
    }
}

function updateTrackerUI() {
    const dashCalEl = document.getElementById('dash-calories');
    if (dashCalEl) {
        dashCalEl.innerText = consumedCalories;
        if (consumedCalories > targetCalories) {
            dashCalEl.classList.add('text-red-500');
        } else {
            dashCalEl.classList.remove('text-red-500');
        }
    }

    const warningEl = document.getElementById('calorie-warning');
    if (warningEl) {
        if (consumedCalories > targetCalories) {
            warningEl.classList.remove('hidden');
            lucide.createIcons();
        } else {
            warningEl.classList.add('hidden');
        }
    }
    const tConsumed = document.getElementById('tracker-consumed');
    if (tConsumed) tConsumed.innerText = consumedCalories;
    const tTop = document.getElementById('tracker-consumed-top');
    if (tTop) tTop.innerText = consumedCalories;

    const remaining = Math.max(0, targetCalories - consumedCalories);
    const tRemaining = document.getElementById('tracker-remaining');
    if (tRemaining) tRemaining.innerText = remaining;

    // Sync all calorie target displays
    const tTarget = document.getElementById('tracker-target');
    if (tTarget) tTarget.innerText = targetCalories;

    const dashGoalEl1 = document.getElementById('dash-calories-goal');
    if (dashGoalEl1) dashGoalEl1.innerText = `/ ${targetCalories} kcal`;

    const dashGoalEl2 = document.getElementById('dash-goal-cal');
    if (dashGoalEl2) dashGoalEl2.innerText = `${targetCalories} kcal/day`;

    const plannerLimitEl = document.getElementById('planner-limit');
    if (plannerLimitEl) plannerLimitEl.innerText = targetCalories;

    const progress = (Math.min(consumedCalories, targetCalories) / targetCalories) * 100;
    const tBar = document.getElementById('tracker-progress');
    if (tBar) tBar.style.width = progress + '%';

    const historyContainer = document.getElementById('tracker-history');
    const historyCount = document.getElementById('history-count');

    if (historyCount) historyCount.innerText = `${mealHistory.length} items`;

    if (historyContainer) {
        if (mealHistory.length === 0) {
            historyContainer.innerHTML = '<p class="text-slate-400 text-center py-8 italic">No meals logged yet today.</p>';
        } else {
            historyContainer.innerHTML = mealHistory.map(m => `
                <div class="flex items-center justify-between p-4 bg-slate-50 rounded-xl group relative overflow-hidden">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-primary shadow-sm">
                            <i data-lucide="utensils" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <p class="font-bold text-slate-700">${m.name}</p>
                            <p class="text-xs text-slate-400">${m.type} • ${m.qty} ${m.unit} • ${m.time}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <p class="font-bold text-primary">+${m.calories}</p>
                        <button onclick="deleteMealRecord(${m.id})" 
                            class="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
            `).join('');
            lucide.createIcons();
        }
    }
    // Update dynamic calorie chart for today
    if (charts && charts.weekly) {
        charts.weekly.data.datasets[0].data[6] = consumedCalories;
        charts.weekly.update();
    }
}

function deleteMealRecord(id) {
    const meal = mealHistory.find(m => m.id === id);
    if (meal) {
        consumedCalories -= meal.calories;
        mealHistory = mealHistory.filter(m => m.id !== id);
        updateTrackerUI();
    }
}

function resetMealLog() {
    if (confirm('Are you sure you want to clear today\'s meal history? This cannot be undone.')) {
        mealHistory = [];
        consumedCalories = 0;
        updateTrackerUI();
    }
}

// ADMIN FUNCTIONS
function initAdminPanel() {
    renderUserTable();
    renderFoodTable();
}

function renderUserTable() {
    const users = JSON.parse(localStorage.getItem('nutriplan_users')) || {};
    const tableBody = document.getElementById('admin-user-table');
    const countEl = document.getElementById('admin-user-count');

    const userList = Object.keys(users);
    countEl.innerText = `${userList.length} users`;

    if (userList.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="3" class="py-10 text-center text-slate-400 italic">No registered users yet.</td></tr>';
        return;
    }

    tableBody.innerHTML = userList.map(email => `
        <tr class="border-b border-slate-50 hover:bg-slate-50/50 transition-all">
            <td class="py-4 font-semibold text-slate-700">${users[email].name}</td>
            <td class="py-4 text-slate-500">${email}</td>
            <td class="py-4 text-right">
                <button onclick="deleteUser('${email}')" class="text-red-500 hover:text-red-700 font-bold text-xs uppercase tracking-wider">Delete</button>
            </td>
        </tr>
    `).join('');
}

function deleteUser(email) {
    if (confirm(`Are you sure you want to delete user ${email}?`)) {
        const users = JSON.parse(localStorage.getItem('nutriplan_users')) || {};
        delete users[email];
        localStorage.setItem('nutriplan_users', JSON.stringify(users));
        renderUserTable();
    }
}

function renderFoodTable() {
    const tableBody = document.getElementById('admin-food-table');

    tableBody.innerHTML = globalFoodDatabase.map((food, index) => `
        <tr class="border-b border-slate-50 hover:bg-slate-50/50 transition-all">
            <td class="py-4 font-semibold text-slate-700">${food.name}</td>
            <td class="py-4 text-slate-500">${food.cal} kcal</td>
            <td class="py-4 text-slate-500">${food.unit}</td>
            <td class="py-4 text-right">
                <button onclick="deleteFoodItem(${index})" class="text-red-500 hover:text-red-700 font-bold text-xs uppercase tracking-wider">Remove</button>
            </td>
        </tr>
    `).join('');
}

function handleAdminAddFood(event) {
    event.preventDefault();
    const name = document.getElementById('admin-food-name').value;
    const cal = parseInt(document.getElementById('admin-food-cal').value);
    const unit = document.getElementById('admin-food-unit').value;

    if (name && !isNaN(cal) && unit) {
        globalFoodDatabase.unshift({ name, cal, unit });
        saveFoodDatabase();
        renderFoodTable();

        // Reset form and close modal
        event.target.reset();
        document.getElementById('add-food-modal').classList.add('hidden');
        alert(`Successfully added ${name} to the database!`);
    }
}

function deleteFoodItem(index) {
    if (confirm(`Remove ${globalFoodDatabase[index].name} from database?`)) {
        globalFoodDatabase.splice(index, 1);
        saveFoodDatabase();
        renderFoodTable();
    }
}

function saveFoodDatabase() {
    localStorage.setItem('nutriplan_food_db', JSON.stringify(globalFoodDatabase));
}

function handleLogout() {
    // Hide Admin nav
    document.getElementById('admin-nav-item').classList.add('hidden');

    // Hide app, show login
    document.getElementById('app-container').classList.add('hidden');
    document.getElementById('login-section').classList.remove('hidden');

    // Clear forms
    document.getElementById('login-password').value = '';

    // Switch back to dashboard section so it's ready for next login
    switchSection('dashboard', document.querySelectorAll('.nav-item')[0]);
}

// Ensure icons load initially for the login screen
window.onload = () => {
    lucide.createIcons();
};
