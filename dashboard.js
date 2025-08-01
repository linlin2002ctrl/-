import { supabase } from './supabase-client.js';

// --- Main function to run after the page is fully loaded ---
async function main() {
    // 1. Check user login status
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        window.location.href = '/auth.html';
        return; 
    }

    // 2. Set up event listeners
    document.getElementById('logout-btn').addEventListener('click', async () => {
        await supabase.auth.signOut();
        window.location.href = '/auth.html';
    });

    // 3. Load the dashboard data
    loadDashboardData();
}

// --- Function to fetch data and render the dashboard ---
async function loadDashboardData() {
    const { data: allSales, error } = await supabase.from('sales').select('*');
    if (error) {
        console.error('Error fetching sales:', error);
        alert('An error occurred while fetching your data.');
        return;
    }

    updateStatCards(allSales);

    // --- The Rosetta Stone Method Implementation ---
    const monthlySalesData = calculateMonthlySales(allSales);
    
    // 1. Display simple summary table by default
    displayMonthlySummaryTable(monthlySalesData);

    // 2. Set up the toggle button to show/hide the chart
    const toggleBtn = document.getElementById('toggle-chart-btn');
    const chartContainer = document.getElementById('chart-container');
    const summaryTable = document.getElementById('monthly-summary-table');
    let isChartVisible = false;

    toggleBtn.addEventListener('click', () => {
        isChartVisible = !isChartVisible;
        if (isChartVisible) {
            summaryTable.style.display = 'none';
            chartContainer.style.display = 'block';
            toggleBtn.textContent = 'ဇယားဖြင့်ကြည့်ရန်';
            // Draw chart only when it's requested for the first time
            if (!window.salesLineChart) {
                drawSalesOverTimeChart(monthlySalesData);
            }
        } else {
            summaryTable.style.display = 'block';
            chartContainer.style.display = 'none';
            toggleBtn.textContent = 'Chart ဖြင့်ကြည့်ရန်';
        }
    });
}

function updateStatCards(salesData) {
    const totalRevenue = salesData.reduce((sum, sale) => sum + (sale.totalPrice || 0), 0);
    const totalSalesCount = salesData.length;
    const avgSaleValue = totalSalesCount > 0 ? totalRevenue / totalSalesCount : 0;
    
    const currentMonth = new Date().toISOString().slice(0, 7);
    const salesThisMonthValue = salesData
        .filter(sale => sale.date && sale.date.startsWith(currentMonth))
        .reduce((sum, sale) => sum + (sale.totalPrice || 0), 0);

    document.getElementById('total-revenue').textContent = totalRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 });
    document.getElementById('total-sales-count').textContent = totalSalesCount;
    document.getElementById('avg-sale-value').textContent = avgSaleValue.toLocaleString('en-US', { maximumFractionDigits: 0 });
    document.getElementById('sales-this-month').textContent = salesThisMonthValue.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

function calculateMonthlySales(salesData) {
    const salesByMonth = salesData.reduce((acc, sale) => {
        if (sale.date) {
            const month = sale.date.substring(0, 7);
            if (!acc[month]) acc[month] = 0;
            acc[month] += (sale.totalPrice || 0);
        }
        return acc;
    }, {});
    return Object.entries(salesByMonth).sort().reverse(); // Sort by month, descending
}

function displayMonthlySummaryTable(monthlySalesData) {
    const tableContainer = document.getElementById('monthly-summary-table');
    if (monthlySalesData.length === 0) {
        tableContainer.innerHTML = `<p class="text-muted text-center">လအလိုက် ရောင်းအားမှတ်တမ်း မရှိသေးပါ။</p>`;
        return;
    }
    
    let tableHTML = `<table class="table table-sm"><tbody>`;
    monthlySalesData.forEach(([month, total]) => {
        const [year, m] = month.split('-');
        const monthName = new Date(year, m - 1).toLocaleString('my-MM', { month: 'long', year: 'numeric' });
        tableHTML += `
            <tr>
                <td>${monthName}</td>
                <td class="text-end fw-bold">${total.toLocaleString()} ကျပ်</td>
            </tr>
        `;
    });
    tableHTML += `</tbody></table>`;
    tableContainer.innerHTML = tableHTML;
}

function drawSalesOverTimeChart(monthlySalesData) {
    const salesOverTimeCtx = document.getElementById('salesOverTimeChart').getContext('2d');
    
    const sortedData = monthlySalesData.slice().reverse(); // re-sort ascending for chart
    const lineChartLabels = sortedData.map(([month, total]) => {
        const [year, m] = month.split('-');
        return new Date(year, m - 1).toLocaleString('my-MM', { month: 'short', year: 'numeric' });
    });
    const lineChartData = sortedData.map(([month, total]) => total);
    
    if(window.salesLineChart) window.salesLineChart.destroy();

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
}

// --- Run the main function when the page content is ready ---
document.addEventListener('DOMContentLoaded', main);
