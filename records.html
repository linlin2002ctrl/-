import { supabase } from './supabase-client.js';

// --- Global variables ---
const salesList = document.getElementById('sales-list');
const totalAmountEl = document.getElementById('total-amount');
const monthFilter = document.getElementById('month-filter');
const searchInput = document.getElementById('search-input');
const tableContainer = document.getElementById('table-container');
const emptyState = document.getElementById('empty-state');

let allSales = []; // This will store all sales data fetched from Supabase
let sortState = { column: 'date', direction: 'desc' }; // Default sort order

// --- Main function to fetch data and initialize the page ---
async function initializePage() {
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (!user.user) {
        window.location.href = '/auth.html';
        return;
    }
    await fetchAllSales();
}

async function fetchAllSales() {
    const { data, error } = await supabase.from('sales').select('*');
    if (error) {
        console.error('Error fetching records:', error);
        emptyState.innerHTML = '<h4>Error loading data</h4>';
        emptyState.style.display = 'block';
        return;
    }
    allSales = data;
    populateMonths(); // <-- The missing function call
    renderSales();    // Render the data
}

// --- Function to populate the month filter dropdown --- (The missing function)
function populateMonths() {
    const months = [...new Set(allSales.map(sale => sale.date.substring(0, 7)))];
    months.sort().reverse();
    
    // Keep the current selection if it still exists
    const currentSelection = monthFilter.value;
    
    monthFilter.innerHTML = '<option value="all">လအားလုံး</option>';
    months.forEach(month => {
        const option = document.createElement('option');
        option.value = month;
        const [year, m] = month.split('-');
        const date = new Date(year, m - 1);
        option.textContent = date.toLocaleString('my-MM', { month: 'long', year: 'numeric' });
        monthFilter.appendChild(option);
    });

    if (months.includes(currentSelection)) {
        monthFilter.value = currentSelection;
    }
}

// --- Function to render the sales data into the table ---
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
        if (valA === null) return 1 * direction;
        if (valB === null) return -1 * direction;
        if (typeof valA === 'string') {
            return valA.localeCompare(valB) * direction;
        }
        return (valA - valB) * direction;
    });
    
    // Update sort indicators in table headers
    document.querySelectorAll('.sortable').forEach(header => {
        if (header.dataset.sort === sortState.column) {
            header.innerHTML = `${header.textContent.replace(/ (↑|↓)$/, '')} ${sortState.direction === 'asc' ? '↑' : '↓'}`;
        } else {
            header.innerHTML = header.textContent.replace(/ (↑|↓)$/, '');
        }
    });

    // Check for Empty State
    if (filteredSales.length === 0) {
        tableContainer.style.display = 'none';
        emptyState.style.display = 'block';
    } else {
        tableContainer.style.display = 'block';
        emptyState.style.display = 'none';
    }

    // 4. Render Table Rows
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
            <td class="text-center"><button class="btn btn-danger btn-sm delete-btn" data-id="${sale.sale_id}">ဖျက်ရန်</button></td>
        `;
        salesList.appendChild(row);
    });

    totalAmountEl.textContent = `${grandTotal.toLocaleString()} ကျပ်`;
    addDeleteListeners();
}
    
// --- Function to add listeners to delete buttons ---
async function addDeleteListeners() {
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
            const idToDelete = parseInt(e.target.getAttribute('data-id'));
            const confirmed = confirm('ဤစာရင်းကို ဖျက်မည်မှာ သေချာပါသလား?');
            if(confirmed){
                const { error } = await supabase.from('sales').delete().eq('sale_id', idToDelete);
                if(error){
                    alert('Error deleting sale: ' + error.message);
                } else {
                    // Re-fetch all data to ensure consistency
                    await fetchAllSales();
                }
            }
        });
    });
}

// --- Event Listeners for search and sort ---
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

monthFilter.addEventListener('change', renderSales);

// --- Run the main function when the page is ready ---
document.addEventListener('DOMContentLoaded', initializePage);
