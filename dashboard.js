import { supabase } from './supabase-client.js';

const logoutBtn = document.getElementById('logout-btn');

// Check if user is logged in
const { data: { user } } = await supabase.auth.getUser();
if (!user) {
    window.location.href = '/auth.html';
}

logoutBtn.addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = '/auth.html';
});

async function loadDashboard() {
    // RLS will automatically filter data for the logged-in user
    const { data: allSales, error } = await supabase.from('sales').select('*');
    if (error) {
        console.error('Error fetching sales:', error);
        return;
    }
    // ... the rest of the dashboard logic (no change) ...
}

document.addEventListener('DOMContentLoaded', loadDashboard);
