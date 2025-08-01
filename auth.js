import { supabase } from './supabase-client.js';

// --- Element References ---
const loginView = document.getElementById('login-view');
const signupView = document.getElementById('signup-view');
const showSignupLink = document.getElementById('show-signup-link');
const showLoginLink = document.getElementById('show-login-link');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const authErrorEl = document.getElementById('auth-error');

// --- Check if user is already logged in ---
async function checkSession() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        window.location.href = '/index.html';
    }
}
checkSession();

// --- View Toggling Logic ---
showSignupLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginView.style.display = 'none';
    signupView.style.display = 'block';
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    signupView.style.display = 'none';
    loginView.style.display = 'block';
});

// --- Form Submission Logic ---
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    authErrorEl.textContent = '';
    const { error } = await supabase.auth.signInWithPassword({
        email: document.getElementById('login-email').value,
        password: document.getElementById('login-password').value,
    });
    if (error) {
        authErrorEl.textContent = 'Error: ' + error.message;
    } else {
        window.location.href = '/index.html';
    }
});

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    authErrorEl.textContent = '';
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                full_name: name, // Save the name to user metadata
            }
        }
    });
    if (error) {
        authErrorEl.textContent = 'Error: ' + error.message;
    } else {
        alert('Signup အောင်မြင်ပါသည်။ သင့် Email သို့ သွား၍ အတည်ပြုပေးပါ။ ပြီးလျှင် Login ဝင်နိုင်ပါပြီ။');
        // Switch back to login view after successful signup
        signupView.style.display = 'none';
        loginView.style.display = 'block';
    }
});
