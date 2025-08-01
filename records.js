document.addEventListener('DOMContentLoaded', () => {
    const salesList = document.getElementById('sales-list');
    const totalAmountEl = document.getElementById('total-amount');
    const monthFilter = document.getElementById('month-filter');

    let allSales = JSON.parse(localStorage.getItem('sales')) || [];

    monthFilter.addEventListener('change', renderSales);

    function renderSales() {
        salesList.innerHTML = '';
        let grandTotal = 0;
        const selectedMonth = monthFilter.value;

        const filteredSales = allSales.filter(sale => {
            if (selectedMonth === 'all') return true;
            return sale.date.substring(0, 7) === selectedMonth;
        });

        // နောက်ဆုံးစာရင်းကို အပေါ်ဆုံးကပြရန် reverse() လုပ်ခြင်း
        filteredSales.sort((a, b) => b.id - a.id);

        filteredSales.forEach(sale => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${sale.date}</td>
                <td>${sale.customer}</td>
                <td>${sale.product}</td>
                <td>${sale.quantity.toLocaleString()}</td>
                <td>${sale.unitPrice.toLocaleString()}</td>
                <td><strong>${sale.totalPrice.toLocaleString()}</strong></td>
                <td><button class="btn btn-danger btn-sm delete-btn" data-id="${sale.id}">ဖျက်</button></td>
            `;
            salesList.appendChild(row);
            grandTotal += sale.totalPrice; // စုစုပေါင်းငွေ ပေါင်းထည့်ခြင်း
        });

        totalAmountEl.textContent = `${grandTotal.toLocaleString()} ကျပ်`;
        addDeleteListeners();
    }

    function populateMonths() {
        const months = [...new Set(allSales.map(sale => sale.date.substring(0, 7)))];
        months.sort().reverse();

        monthFilter.innerHTML = '<option value="all">လအားလုံး</option>';

        months.forEach(month => {
            const option = document.createElement('option');
            option.value = month;
            const [year, m] = month.split('-');
            const date = new Date(year, m - 1);
            const monthName = date.toLocaleString('my-MM', { month: 'long', year: 'numeric' });
            option.textContent = monthName;
            monthFilter.appendChild(option);
        });
    }
    
    function addDeleteListeners() {
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const idToDelete = parseInt(e.target.getAttribute('data-id'));
                // allSales array ထဲမှ သက်ဆိုင်ရာ id ကို ဖယ်ရှားခြင်း
                allSales = allSales.filter(sale => sale.id !== idToDelete);
                // localStorage ကို update လုပ်ခြင်း
                localStorage.setItem('sales', JSON.stringify(allSales));
                // စာရင်းကို အသစ်ပြန်ဆွဲခြင်း
                populateMonths();
                renderSales();
            });
        });
    }

    // စာမျက်နှာ စတင်ဖွင့်ချိန်တွင် data များကို ပြသရန်
    populateMonths();
    renderSales();
});
