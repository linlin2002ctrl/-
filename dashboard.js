document.addEventListener('DOMContentLoaded', () => {
    const allSales = JSON.parse(localStorage.getItem('sales')) || [];

    // 1. Key Metrics တွေကို حساب کردن
    const totalRevenueEl = document.getElementById('total-revenue');
    const totalSalesCountEl = document.getElementById('total-sales-count');

    const totalRevenue = allSales.reduce((sum, sale) => sum + sale.totalPrice, 0);
    const totalSalesCount = allSales.length;

    totalRevenueEl.textContent = totalRevenue.toLocaleString();
    totalSalesCountEl.textContent = totalSalesCount.toLocaleString();

    // 2. Line Chart (လအလိုက် ရောင်းအား) အတွက် Data ပြင်ဆင်ခြင်း
    const salesByMonth = allSales.reduce((acc, sale) => {
        const month = sale.date.substring(0, 7); // '2025-01'
        if (!acc[month]) {
            acc[month] = 0;
        }
        acc[month] += sale.totalPrice;
        return acc;
    }, {});

    const sortedMonths = Object.keys(salesByMonth).sort();
    const lineChartLabels = sortedMonths.map(month => {
        const [year, m] = month.split('-');
        return new Date(year, m - 1).toLocaleString('my-MM', { month: 'short', year: 'numeric' });
    });
    const lineChartData = sortedMonths.map(month => salesByMonth[month]);

    // Line Chart ကိုဆွဲခြင်း
    const salesOverTimeCtx = document.getElementById('salesOverTimeChart').getContext('2d');
    new Chart(salesOverTimeCtx, {
        type: 'line',
        data: {
            labels: lineChartLabels,
            datasets: [{
                label: 'ရောင်းရငွေ',
                data: lineChartData,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: true,
                tension: 0.1
            }]
        }
    });

    // 3. Pie Chart (ရောင်းအားအကောင်းဆုံး ပစ္စည်းများ) အတွက် Data ပြင်ဆင်ခြင်း
    const salesByProduct = allSales.reduce((acc, sale) => {
        const productName = sale.product;
        if (!acc[productName]) {
            acc[productName] = 0;
        }
        acc[productName] += sale.totalPrice;
        return acc;
    }, {});

    const productLabels = Object.keys(salesByProduct);
    const productData = Object.values(salesByProduct);

    // Pie Chart ကိုဆွဲခြင်း
    const topProductsCtx = document.getElementById('topProductsChart').getContext('2d');
    new Chart(topProductsCtx, {
        type: 'pie',
        data: {
            labels: productLabels,
            datasets: [{
                label: 'စုစုပေါင်း ရောင်းရငွေ',
                data: productData,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                    'rgba(255, 159, 64, 0.8)'
                ],
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
        }
    });
});
