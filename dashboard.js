document.addEventListener('DOMContentLoaded', () => {
    const allSales = JSON.parse(localStorage.getItem('sales')) || [];

    // --- Key Metrics & Charts (ယခင်အတိုင်း) ---
    const totalRevenueEl = document.getElementById('total-revenue');
    const totalSalesCountEl = document.getElementById('total-sales-count');
    const totalRevenue = allSales.reduce((sum, sale) => sum + (sale.totalPrice || 0), 0);
    totalRevenueEl.textContent = totalRevenue.toLocaleString();
    totalSalesCountEl.textContent = allSales.length.toLocaleString();
    
    // ... (Chart ဆွဲတဲ့ကုဒ်တွေက ဒီနေရာမှာရှိပါတယ်၊ ပြောင်းလဲမှုမရှိပါ)
    // ... (သင်နားလည်လွယ်အောင် တမင်ချန်လှပ်ထားခြင်းဖြစ်ပြီး အမှန်တကယ်တွင် ယခင်ကုဒ်များအတိုင်း ပြည့်စုံစွာရှိနေပါသည်)
    
    // --- Data Management ---
    const exportBtn = document.getElementById('export-data-btn');
    const importBtn = document.getElementById('import-data-btn');
    const importFileInput = document.getElementById('import-file-input');

    // Export Data
    exportBtn.addEventListener('click', () => {
        if (allSales.length === 0) {
            alert('Backup လုပ်ရန် ဒေတာမရှိသေးပါ။');
            return;
        }
        const dataStr = JSON.stringify(allSales, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const today = new Date().toISOString().slice(0, 10);
        a.download = `sales-backup-${today}.json`;
        a.click();
        URL.revokeObjectURL(url);
    });

    // Import Data
    importBtn.addEventListener('click', () => {
        importFileInput.click();
    });

    importFileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedSales = JSON.parse(e.target.result);
                if (Array.isArray(importedSales)) {
                   const confirmed = confirm('လက်ရှိဒေတာများအားလုံးကို ဖျက်ပြီး ဒေတာအသစ်ဖြင့် အစားထိုးမည်မှာ သေချာပါသလား?');
                   if (confirmed) {
                       localStorage.setItem('sales', JSON.stringify(importedSales));
                       alert('Data များ အောင်မြင်စွာထည့်သွင်းပြီးပါပြီ။ စာမျက်နှာကို အသစ်ပြန်ဖွင့်ပါမည်။');
                       location.reload();
                   }
                } else {
                    alert('Error: JSON file is not a valid sales array.');
                }
            } catch (error) {
                alert('Error reading or parsing file: ' + error.message);
            }
        };
        reader.readAsText(file);
        importFileInput.value = ''; // Reset the input
    });
     // (Chart ဆွဲတဲ့ကုဒ်အပြည့်အစုံ)
    const salesByMonth = allSales.reduce((acc, sale) => {
        const month = sale.date.substring(0, 7); if (!acc[month]) { acc[month] = 0; }
        acc[month] += (sale.totalPrice || 0); return acc;
    }, {});
    const sortedMonths = Object.keys(salesByMonth).sort();
    const lineChartLabels = sortedMonths.map(month => new Date(month + '-02').toLocaleString('my-MM', { month: 'short', year: 'numeric' }));
    const lineChartData = sortedMonths.map(month => salesByMonth[month]);
    const salesOverTimeCtx = document.getElementById('salesOverTimeChart').getContext('2d');
    if(window.salesLineChart) window.salesLineChart.destroy();
    window.salesLineChart = new Chart(salesOverTimeCtx, { type: 'line', data: { labels: lineChartLabels, datasets: [{ label: 'ရောင်းရငွေ', data: lineChartData, borderColor: 'rgba(54, 162, 235, 1)', fill: true }] } });
    const salesByProduct = allSales.reduce((acc, sale) => {
        const productName = sale.product; if (!acc[productName]) { acc[productName] = 0; }
        acc[productName] += (sale.totalPrice || 0); return acc;
    }, {});
    const topProductsCtx = document.getElementById('topProductsChart').getContext('2d');
    if(window.topProductsPieChart) window.topProductsPieChart.destroy();
    window.topProductsPieChart = new Chart(topProductsCtx, { type: 'pie', data: { labels: Object.keys(salesByProduct), datasets: [{ data: Object.values(salesByProduct), backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'] }] } });

});
