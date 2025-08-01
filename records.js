import { supabase } from './supabase-client.js';

// --- Global variables (no change) ---
const salesList = document.getElementById('sales-list');
const totalAmountEl = document.getElementById('total-amount');
// ... other global variables

// --- Main function to fetch data and initialize the page (no change) ---
async function initializePage() {
    // ...
}

// ... other functions (fetchAllSales, populateMonths) remain unchanged ...

function renderSales() {
    let grandTotal = 0;
    // ... Filtering and Sorting logic (no change) ...
    let filteredSales = allSales.filter(/* ... */);


    // Check for Empty State
    if (filteredSales.length === 0) {
        tableContainer.style.display = 'none';
        emptyState.style.display = 'block';
    } else {
        tableContainer.style.display = 'block';
        emptyState.style.display = 'none';
    }

    // --- Takumi & Zen: Robust and Clear Row Rendering ---
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
        
        // CHANGED: Separated product and quantity into their own <td> cells
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
    
// ... other functions (addEventListeners, deleteSaleById) remain unchanged ...

// --- Run the main function when the page is ready ---
document.addEventListener('DOMContentLoaded', initializePage);
