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

    // --- Key Metrics Calculations ---
    const totalRevenue = allSales.reduce((sum, sale) => sum + (sale.totalPrice || 0), 0);
    const totalSalesCount = allSales.length;
    const avgSaleValue = totalSalesCount > 0 ? totalRevenue / totalSalesCount : 0;
    
    const currentMonth = new Date().toISOString().slice(0, 7);
    const salesThisMonthValue = allSales
        .filter(sale => sale.date.startsWith(currentMonth))
        .reduce((sum, sale) => sum + (sale.totalPrice || 0), 0);

    // --- Update Stat Cards UI ---
    document.getElementById('total-revenue').textContent = totalRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 });
    document.getElementById('total-sales-count').textContent = totalSalesCount;
    document.getElementById('avg-sale-value').textContent = avgSaleValue.toLocaleString('en-US', { maximumFractionDigits: 0 });
    document.getElementById('sales-this-month').textContent = salesThisMonthValue.toLocaleString('en-US', { maximumFractionDigits: 0 });
    
    // =========================================================
    //               CHART DRAWING LOGIC (THE FIX)
    // =========================================================

    // --- Line Chart: Sales Over Time ---
    const salesByMonth = allSales.reduce((acc, sale) => {
        const month = sale.date.substring(0, 7); // e.g., "2025-01"
        if (!acc[month]) acc[month] = 0;
        acc[month] += (sale.totalPrice || 0);
        return acc;
    }, {});

    const sortedMonths = Object.keys(salesByMonth).sort();
    const lineChartLabels = sortedMonths.map(month => {
        const [year, m] = month.split('-');
        return new Date(year, m - 1).toLocaleString('my-MM', { month: 'short', year: 'numeric' });
    });
    const lineChartData = sortedMonths.map(month => salesByMonth[month]);
    
    const salesOverTimeCtx = document.getElementById('salesOverTimeChart').getContext('2d');
    if(window.salesLineChart) window.salesLineChart.destroy(); // Clear previous chart if exists
    window.salesLineChart = new Chart(salesOverTimeCtx, {
        type: 'line',
        data: {
            labels: lineChartLabels,
            datasets: [{
                label: 'ရောင်းရငွေ',
                data: lineChartData,
                borderColor: 'var(--brand-primary)',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // --- Pie Chart: Top Products (This was also missing) ---
    const salesByProduct = allSales.reduce((acc, sale) => {
        const productName = sale.product;
        if (!acc[productName]) acc[productName] = 0;
        acc[productName] += (sale.totalPrice || 0);
        return acc;
    }, {});

    const topProductsCtx = document.getElementById('topProductsChart');
    // Check if the element exists before creating the chart
    if (topProductsCtx) {
        if(window.topProductsPieChart) window.topProductsPieChart.destroy(); // Clear previous chart
        window.topProductsPieChart = new Chart(topProductsCtx.getContext('2d'), {
            type: 'pie',
            data: {
                labels: Object.keys(salesByProduct),
                datasets: [{
                    data: Object.values(salesByProduct),
                    backgroundColor: ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#7C3AED', '#6B7280'],
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
}

// --- Run the main function when the page content is ready ---
document.addEventListener('DOMContentLoaded', main);
