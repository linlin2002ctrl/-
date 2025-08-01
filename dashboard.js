import { supabase } from './supabase-client.js';

// --- Main function to run after the page is fully loaded ---
async function main() {
    const logoutBtn = document.getElementById('logout-btn');

    // 1. Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        window.location.href = '/auth.html';
        return; 
    }

    // 2. Set up the logout button
    logoutBtn.addEventListener('click', async () => {
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

    // --- Update Stat Cards UI ---
    updateStatCards(allSales);

    // --- Draw Charts ---
    // We will only draw the Line Chart for now to isolate the problem.
    drawSalesOverTimeChart(allSales);
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

function drawSalesOverTimeChart(salesData) {
    const salesOverTimeCtx = document.getElementById('salesOverTimeChart').getContext('2d');
    
    // Using a try...catch block to prevent the entire app from crashing if the chart fails
    try {
        const salesByMonth = salesData.reduce((acc, sale) => {
            // Ensure sale.date is not null or undefined before processing
            if (sale.date) {
                const month = sale.date.substring(0, 7);
                if (!acc[month]) acc[month] = 0;
                acc[month] += (sale.totalPrice || 0);
            }
            return acc;
        }, {});

        const sortedMonths = Object.keys(salesByMonth).sort();
        const lineChartLabels = sortedMonths.map(month => {
            const [year, m] = month.split('-');
            return new Date(year, m - 1).toLocaleString('my-MM', { month: 'short', year: 'numeric' });
        });
        const lineChartData = sortedMonths.map(month => salesByMonth[month]);
        
        // Clear any previous chart instance to prevent memory leaks
        if(window.salesLineChart) {
            window.salesLineChart.destroy();
        }

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
    } catch (chartError) {
        console.error("Failed to draw Sales Over Time chart:", chartError);
        // Optionally, display a user-friendly message on the canvas
        salesOverTimeCtx.font = "16px Inter";
        salesOverTimeCtx.fillStyle = "var(--text-secondary)";
        salesOverTimeCtx.textAlign = "center";
        salesOverTime-Ctx.fillText("Chart ကို ပြသရာတွင် အမှားအယွင်းဖြစ်နေပါသည်။", salesOverTimeCtx.canvas.width / 2, 50);
    }
}

// --- Run the main function when the page content is ready ---
document.addEventListener('DOMContentLoaded', main);
