import { supabase } from './supabase-client.js';

// --- Main function to run after the page is fully loaded ---
async function main() {
    const logoutBtn = document.getElementById('logout-btn');

    // 1. Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        // If no user, redirect to login page
        window.location.href = '/auth.html';
        return; // Stop further execution
    }

    // 2. If user exists, set up the logout button
    logoutBtn.addEventListener('click', async () => {
        await supabase.auth.signOut();
        window.location.href = '/auth.html';
    });

    // 3. Load the dashboard data
    loadDashboardData();
}

// --- Function to fetch data and render the dashboard ---
async function loadDashboardData() {
    // RLS will automatically filter data for the logged-in user
    const { data: allSales, error } = await supabase.from('sales').select('*');
    if (error) {
        console.error('Error fetching sales:', error);
        alert('An error occurred while fetching your data.');
        return;
    }

    // --- Key Metrics ---
    const totalRevenueEl = document.getElementById('total-revenue');
    const totalSalesCountEl = document.getElementById('total-sales-count');
    const totalRevenue = allSales.reduce((sum, sale) => sum + (sale.totalPrice || 0), 0);
    totalRevenueEl.textContent = totalRevenue.toLocaleString();
    totalSalesCountEl.textContent = allSales.length.toLocaleString();

    // --- Charts ---
    // Line Chart
    const salesByMonth = allSales.reduce((acc, sale) => {
        const month = sale.date.substring(0, 7);
        if (!acc[month]) acc[month] = 0;
        acc[month] += (sale.totalPrice || 0);
        return acc;
    }, {});
    const sortedMonths = Object.keys(salesByMonth).sort();
    const lineChartLabels = sortedMonths.map(month => new Date(month + '-02').toLocaleString('my-MM', { month: 'short', year: 'numeric' }));
    const lineChartData = sortedMonths.map(month => salesByMonth[month]);
    const salesOverTimeCtx = document.getElementById('salesOverTimeChart').getContext('2d');
    if(window.salesLineChart) window.salesLineChart.destroy(); // Clear previous chart if exists
    window.salesLineChart = new Chart(salesOverTimeCtx, {
        type: 'line',
        data: { labels: lineChartLabels, datasets: [{ label: 'ရောင်းရငွေ', data: lineChartData, borderColor: 'rgba(54, 162, 235, 1)', backgroundColor: 'rgba(54, 162, 235, 0.2)', fill: true }] }
    });

    // Pie Chart
    const salesByProduct = allSales.reduce((acc, sale) => {
        const productName = sale.product;
        if (!acc[productName]) acc[productName] = 0;
        acc[productName] += (sale.totalPrice || 0);
        return acc;
    }, {});
    const topProductsCtx = document.getElementById('topProductsChart').getContext('2d');
    if(window.topProductsPieChart) window.topProductsPieChart.destroy(); // Clear previous chart
    window.topProductsPieChart = new Chart(topProductsCtx, {
        type: 'pie',
        data: {
            labels: Object.keys(salesByProduct),
            datasets: [{
                data: Object.values(salesByProduct),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
            }]
        }
    });
}

// --- Run the main function when the page content is ready ---
document.addEventListener('DOMContentLoaded', main);
