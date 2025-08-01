import { supabase } from './supabase-client.js';

const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const authErrorEl = document.getElementById('auth-error');

// Check if user is already logged in
const { data: { session } } = await supabase.auth.getSession();
if (session) {
    window.location.href = '/index.html';
}

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    authErrorEl.textContent = '';
    const { data, error } = await supabase.auth.signInWithPassword({
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
    const { data, error } = await supabase.auth.signUp({
        email: document.getElementById('signup-email').value,
        password: document.getElementById('signup-password').value,
    });
    if (error) {
        authErrorEl.textContent = 'Error: ' + error.message;
    } else {
        alert('Signup အောင်မြင်ပါသည်။ သင့် Email သို့ သွား၍ အတည်ပြုပေးပါ။ ပြီးလျှင် Login ဝင်နိုင်ပါပြီ။');
        // Optionally redirect or show success message
    }
});
