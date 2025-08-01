import { supabase } from './supabase-client.js';

// --- Main function to run after the page is fully loaded ---
async function main() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        window.location.href = '/auth.html';
        return; 
    }

    setupEventListeners();
    loadDashboardData();
    initializeScrollAnimations(); // <-- New function call for animations
}

function setupEventListeners() {
    document.getElementById('logout-btn').addEventListener('click', async () => {
        await supabase.auth.signOut();
        window.location.href = '/auth.html';
    });
}

async function loadDashboardData() {
    const { data: allSales, error } = await supabase.from('sales').select('*');
    if (error) {
        console.error('Error fetching sales:', error);
        return;
    }
    updateStatCards(allSales);
    const monthlySalesData = calculateMonthlySales(allSales);
    displayMonthlySummaryTable(monthlySalesData);
    setupChartToggleButton(monthlySalesData);
}

function updateStatCards(salesData) {
    // ... (This function remains unchanged) ...
    const totalRevenue = salesData.reduce((sum, sale) => sum + (sale.totalPrice || 0), 0);
    const totalSalesCount = salesData.length;
    const avgSaleValue = totalSalesCount > 0 ? totalRevenue / totalSalesCount : 0;
    const currentMonth = new Date().toISOString().slice(0, 7);
    const salesThisMonthValue = salesData.filter(sale => sale.date && sale.date.startsWith(currentMonth)).reduce((sum, sale) => sum + (sale.totalPrice || 0), 0);
    document.getElementById('total-revenue').textContent = totalRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 });
    document.getElementById('total-sales-count').textContent = totalSalesCount;
    document.getElementById('avg-sale-value').textContent = avgSaleValue.toLocaleString('en-US', { maximumFractionDigits: 0 });
    document.getElementById('sales-this-month').textContent = salesThisMonthValue.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

function calculateMonthlySales(salesData) {
    // ... (This function remains unchanged) ...
    const salesByMonth = salesData.reduce((acc, sale) => { if (sale.date) { const month = sale.date.substring(0, 7); if (!acc[month]) acc[month] = 0; acc[month] += (sale.totalPrice || 0); } return acc; }, {});
    return Object.entries(salesByMonth).sort().reverse();
}

function displayMonthlySummaryTable(monthlySalesData) {
    // ... (This function remains unchanged) ...
    const tableContainer = document.getElementById('monthly-summary-table');
    if (monthlySalesData.length === 0) { tableContainer.innerHTML = `<p class="text-muted text-center">လအလိုက် ရောင်းအားမှတ်တမ်း မရှိသေးပါ။</p>`; return; }
    let tableHTML = `<table class="table table-sm"><tbody>`;
    monthlySalesData.forEach(([month, total]) => { const [year, m] = month.split('-'); const monthName = new Date(year, m - 1).toLocaleString('my-MM', { month: 'long', year: 'numeric' }); tableHTML += `<tr><td>${monthName}</td><td class="text-end fw-bold">${total.toLocaleString()} ကျပ်</td></tr>`; });
    tableHTML += `</tbody></table>`;
    tableContainer.innerHTML = tableHTML;
}

function setupChartToggleButton(monthlySalesData) {
    // ... (This function remains unchanged) ...
    const toggleBtn = document.getElementById('toggle-chart-btn'); const chartContainer = document.getElementById('chart-container'); const summaryTable = document.getElementById('monthly-summary-table'); let isChartVisible = false;
    toggleBtn.addEventListener('click', () => { isChartVisible = !isChartVisible; if (isChartVisible) { summaryTable.style.display = 'none'; chartContainer.style.display = 'block'; toggleBtn.textContent = 'ဇယားဖြင့်ကြည့်ရန်'; if (!window.salesLineChart) { drawSalesOverTimeChart(monthlySalesData); } } else { summaryTable.style.display = 'block'; chartContainer.style.display = 'none'; toggleBtn.textContent = 'Chart ဖြင့်ကြည့်ရန်'; } });
}

function drawSalesOverTimeChart(monthlySalesData) {
    // ... (This function remains unchanged) ...
    const salesOverTimeCtx = document.getElementById('salesOverTimeChart').getContext('2d'); const sortedData = monthlySalesData.slice().reverse(); const lineChartLabels = sortedData.map(([month, total]) => { const [year, m] = month.split('-'); return new Date(year, m - 1).toLocaleString('my-MM', { month: 'short', year: 'numeric' }); }); const lineChartData = sortedData.map(([month, total]) => total); if(window.salesLineChart) window.salesLineChart.destroy();
    window.salesLineChart = new Chart(salesOverTimeCtx, { type: 'line', data: { labels: lineChartLabels, datasets: [{ label: 'ရောင်းရငွေ', data: lineChartData, borderColor: 'var(--brand-primary)', backgroundColor: 'rgba(37, 99, 235, 0.1)', fill: true, tension: 0.3 }] }, options: { responsive: true, maintainAspectRatio: false } });
}

// =========================================================
//            NEW: Animation Setup Function
// =========================================================
function initializeScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    // Observe all elements with the .animate-on-scroll class
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    elementsToAnimate.forEach((el, index) => {
        // Apply staggered delay for a nicer effect
        el.style.transitionDelay = `${index * 100}ms`;
        observer.observe(el);
    });
}


// --- Run the main function when the page content is ready ---
document.addEventListener('DOMContentLoaded', main);
