import { supabase } from './supabase-client.js';

// --- Global variables ---
const salesList = document.getElementById('sales-list');
const totalAmountEl = document.getElementById('total-amount');
const monthFilter = document.getElementById('month-filter');
const searchInput = document.getElementById('search-input');
const tableContainer = document.getElementById('table-container');
const emptyState = document.getElementById('empty-state');

let allSales = []; 
let sortState = { column: 'date', direction: 'desc' }; 

// --- Main function to fetch data and initialize the page ---
async function initializePage() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
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
        tableContainer.style.display = 'none';
        return;
    }
    allSales = data || [];
    populateMonths();
    renderSales();
}

function populateMonths() {
    const months = [...new Set(allSales.map(sale => sale.date ? sale.date.substring(0, 7) : null).filter(Boolean))];
    months.sort().reverse();
    
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

function renderSales() {
    let grandTotal = 0;
    const selectedMonth = monthFilter.value;
    const searchTerm = searchInput.value.toLowerCase();

    // =========================================================
    //               THE BUG FIX IS HERE (Restored Logic)
    // =========================================================
    // 1. Filter by Month
    let filteredSales = allSales.filter(sale => {
        if (selectedMonth === 'all') {
            return true;
        }
        return sale.date && sale.date.substring(0, 7) === selectedMonth;
    });

    // 2. Filter by Search Term
    if (searchTerm) {
        filteredSales = filteredSales.filter(sale => 
            (sale.customer && sale.customer.toLowerCase().includes(searchTerm)) || 
            (sale.product && sale.product.toLowerCase().includes(searchTerm))
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

    // Check for Empty State
    if (filteredSales.length === 0) {
        tableContainer.style.display = 'none';
        emptyState.style.display = 'block';
    } else {
        tableContainer.style.display = 'block';
        emptyState.style.display = 'none';
    }

    // --- Takumi: Robust and Clear Row Rendering ---
    salesList.innerHTML = '';
    filteredSales.forEach(sale => {
        grandTotal += (sale.totalPrice || 0);
        const row = document.createElement('tr');
        row.dataset.customer = sale.customer || '';

        const displayDate = sale.date || 'N/A';
        const displayCustomer = sale.customer || 'Unknown Customer';
        const displayProduct = sale.product || 'Unknown Product';
        const displayQuantity = (sale.quantity || 0).toLocaleString();
        const displayTotalPrice = (sale.totalPrice || 0).toLocaleString();
        
        row.innerHTML = `
            <td class="text-center">${displayDate}</td>
            <td>${displayCustomer}</td>
            <td>${displayProduct}</td>
            <td class="text-center">${displayQuantity}</td>
            <td class="text-end"><strong>${displayTotalPrice}</strong></td>
            <td class="text-center">
                <button class="btn btn-danger-soft btn-sm delete-btn" data-id="${sale.sale_id}">ဖျက်ရန်</button>
            </td>
        `;
        salesList.appendChild(row);
    });

    totalAmountEl.textContent = `${grandTotal.toLocaleString()} ကျပ်`;
    addEventListeners();
}
    
function addEventListeners() {
    // Safer Delete Confirmation
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); 
            const idToDelete = parseInt(e.target.getAttribute('data-id'));
            const confirmationText = "DELETE";
            const userInput = prompt(`ဤစာရင်းကို အပြီးတိုင်ဖျက်ရန် "${confirmationText}" ဟု ရိုက်ထည့်ပါ။`);
            
            if (userInput === confirmationText) {
                deleteSaleById(idToDelete);
            } else if (userInput !== null) {
                alert('Confirmation text does not match.');
            }
        });
    });

    // Clickable Rows
    document.querySelectorAll('#sales-list tr').forEach(row => {
        row.addEventListener('click', () => {
            const customerName = row.dataset.customer;
            if (customerName) {
                window.location.href = `customer-details.html?name=${encodeURIComponent(customerName)}`;
            }
        });
    });
}

async function deleteSaleById(id) {
    const { error } = await supabase.from('sales').delete().eq('sale_id', id);
    if(error){
        alert('Error deleting sale: ' + error.message);
    } else {
        await fetchAllSales(); // Refresh data
    }
}

// Event Listeners for search, sort, and filter
searchInput.addEventListener('input', renderSales);
monthFilter.addEventListener('change', renderSales);
document.querySelectorAll('.sortable').forEach(header => {
    header.addEventListener('click', () => {
        const column = header.dataset.sort;
        if (sortState.column === column) {
            sortState.direction = sort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            sortState.column = column;
            sortState.direction = 'asc';
        }
        renderSales();
    });
});

// --- Run the main function when the page is ready ---
document.addEventListener('DOMContentLoaded', initializePage);
