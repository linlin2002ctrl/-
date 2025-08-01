document.addEventListener('DOMContentLoaded', () => {
    const salesList = document.getElementById('sales-list');
    const totalAmountEl = document.getElementById('total-amount');
    const monthFilter = document.getElementById('month-filter');

    let allSales = JSON.parse(localStorage.getItem('sales')) || [];

    monthFilter.addEventListener('change', renderSales);

    function renderSales() {
        salesList.innerHTML = '';
        let totalAmount = 0;
        const selectedMonth = monthFilter.value;

        const filteredSales = allSales.filter(sale => {
            if (selectedMonth === 'all') return true;
            return sale.date.substring(0, 7) === selectedMonth;
        });

        filteredSales.forEach(sale => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${sale.date}</td>
                <td>${sale.customer}</td>
                <td>${sale.product}</td>
                <td>${sale.price.toLocaleString()} ကျပ်</td>
                <td><button class="btn btn-danger btn-sm delete-btn" data-id="${sale.id}">ဖျက်</button></td>
            `;
            salesList.appendChild(row);
            totalAmount += sale.price;
        });

        totalAmountEl.textContent = `${totalAmount.toLocaleString()} ကျပ်`;
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
                allSales = allSales.filter(sale => sale.id !== idToDelete);
                localStorage.setItem('sales', JSON.stringify(allSales));
                populateMonths();
                renderSales();
            });
        });
    }

    populateMonths();
    renderSales();
});
