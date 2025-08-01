import { supabase } from './supabase-client.js';

async function main() {
    const logoutBtn = document.getElementById('logout-btn');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        window.location.href = '/auth.html';
        return;
    }
    logoutBtn.addEventListener('click', async () => {
        await supabase.auth.signOut();
        window.location.href = '/auth.html';
    });
    loadDashboardData();
}

async function loadDashboardData() {
    const { data: allSales, error } = await supabase.from('sales').select('*');
    if (error) {
        console.error('Error fetching sales:', error);
        return;
    }

    // --- Key Metrics Calculations ---
    const totalRevenue = allSales.reduce((sum, sale) => sum + (sale.totalPrice || 0), 0);
    const totalSalesCount = allSales.length;
    const avgSaleValue = totalSalesCount > 0 ? totalRevenue / totalSalesCount : 0;
    
    const currentMonth = new Date().toISOString().slice(0, 7);
    const salesThisMonth = allSales
        .filter(sale => sale.date.startsWith(currentMonth))
        .reduce((sum, sale) => sum + (sale.totalPrice || 0), 0);

    // --- Update Stat Cards ---
    document.getElementById('total-revenue').textContent = totalRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 });
    document.getElementById('total-sales-count').textContent = totalSalesCount;
    document.getElementById('avg-sale-value').textContent = avgSaleValue.toLocaleString('en-US', { maximumFractionDigits: 0 });
    document.getElementById('sales-this-month').textContent = salesThisMonth.toLocaleString('en-US', { maximumFractionDigits: 0 });
    
    // ... (The rest of the chart drawing logic remains the same) ...
    // ... You can copy the chart logic from the previous version of dashboard.js ...
}

document.addEventListener('DOMContentLoaded', main);
