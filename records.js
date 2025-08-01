document.addEventListener('DOMContentLoaded', () => {
    const salesList = document.getElementById('sales-list');
    const totalAmountEl = document.getElementById('total-amount');
    const monthFilter = document.getElementById('month-filter');
    const searchInput = document.getElementById('search-input');
    const tableContainer = document.getElementById('table-container');
    const emptyState = document.getElementById('empty-state');
    
    let allSales = JSON.parse(localStorage.getItem('sales')) || [];
    let sortState = { column: 'date', direction: 'desc' };

    // --- Event Listeners ---
    monthFilter.addEventListener('change', renderSales);
    searchInput.addEventListener('input', renderSales);
    document.querySelectorAll('.sortable').forEach(header => {
        header.addEventListener('click', () => {
            const column = header.dataset.sort;
            if (sortState.column === column) {
                sortState.direction = sortState.direction === 'asc' ? 'desc' : 'asc';
            } else {
                sortState.column = column;
                sortState.direction = 'asc';
            }
            renderSales();
        });
    });

    function renderSales() {
        let grandTotal = 0;
        const selectedMonth = monthFilter.value;
        const searchTerm = searchInput.value.toLowerCase();

        // 1. Filter by Month
        let filteredSales = allSales.filter(sale => {
            if (selectedMonth === 'all') return true;
            return sale.date.substring(0, 7) === selectedMonth;
        });

        // 2. Filter by Search Term
        if (searchTerm) {
            filteredSales = filteredSales.filter(sale => 
                sale.customer.toLowerCase().includes(searchTerm) || 
                sale.product.toLowerCase().includes(searchTerm)
            );
        }

        // 3. Sort Data
        filteredSales.sort((a, b) => {
            const valA = a[sortState.column];
            const valB = b[sortState.column];
            const direction = sortState.direction === 'asc' ? 1 : -1;

            if (typeof valA === 'string') {
                return valA.localeCompare(valB) * direction;
            }
            return (valA - valB) * direction;
        });

        // Check for Empty State
        if (filteredSales.length === 0) {
            tableContainer.style.display = 'none';
            emptyState.style.display = 'block';
        } else {
            tableContainer.style.display = 'block';
            emptyState.style.display = 'none';
        }

        // 4. Render Table
        salesList.innerHTML = '';
        filteredSales.forEach(sale => {
            grandTotal += sale.totalPrice;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="text-center">${sale.date}</td>
                <td><a href="customer-details.html?name=${encodeURIComponent(sale.customer)}">${sale.customer}</a></td>
                <td>${sale.product}</td>
                <td class="text-center">${sale.quantity.toLocaleString()}</td>
                <td class="text-end">${sale.unitPrice.toLocaleString()}</td>
                <td class="text-end"><strong>${sale.totalPrice.toLocaleString()}</strong></td>
                <td class="text-center"><button class="btn btn-danger btn-sm delete-btn" data-id="${sale.id}">ဖျက်</button></td>
            `;
            salesList.appendChild(row);
        });

        totalAmountEl.textContent = `${grandTotal.toLocaleString()} ကျပ်`;
        addDeleteListeners();
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

    function populateMonths() {
        const months = [...new Set(allSales.map(sale => sale.date.substring(0, 7)))];
        months.sort().reverse();
        monthFilter.innerHTML = '<option value="all">လအားလုံး</option>';
        months.forEach(month => {
            const option = document.createElement('option');
            option.value = month;
            const [year, m] = month.split('-');
            const date = new Date(year, m - 1);
            option.textContent = date.toLocaleString('my-MM', { month: 'long', year: 'numeric' });
            monthFilter.appendChild(option);
        });
    }

    // Initial Render
    populateMonths();
    renderSales();
});
