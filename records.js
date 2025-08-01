import { supabase } from './supabase-client.js';

// --- Global variables ---
const salesList = document.getElementById('sales-list');
const totalAmountEl = document.getElementById('total-amount');
// ... other global variables ...

async function initializePage() {
    // ... (no change) ...
}

async function fetchAllSales() {
    // ... (no change) ...
}

function renderSales() {
    // ... (no change in filtering and sorting) ...

    // --- Takumi: Update Row Rendering ---
    salesList.innerHTML = '';
    filteredSales.forEach(sale => {
        grandTotal += sale.totalPrice;
        const row = document.createElement('tr');
        row.dataset.customer = sale.customer; // For clickable row
        row.innerHTML = `
            <td class="text-center">${sale.date}</td>
            <td>${sale.customer}</td>
            <td>${sale.product} (${sale.quantity.toLocaleString()} ခု)</td>
            <td class="text-end"><strong>${sale.totalPrice.toLocaleString()}</strong></td>
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
    // --- Takumi: Safer Delete Confirmation ---
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
            e.stopPropagation(); // Prevent row click event
            const idToDelete = parseInt(e.target.getAttribute('data-id'));
            const confirmationText = "DELETE";
            const userInput = prompt(`ဤစာရင်းကို အပြီးတိုင်ဖျက်ရန် "${confirmationText}" ဟု ရိုက်ထည့်ပါ။`);
            
            if (userInput === confirmationText) {
                const { error } = await supabase.from('sales').delete().eq('sale_id', idToDelete);
                if(error) {
                    alert('Error deleting sale: ' + error.message);
                } else {
                    await fetchAllSales(); // Refresh data
                }
            } else if (userInput !== null) {
                alert('Confirmation text does not match.');
            }
        });
    });

    // --- Takumi: Clickable Rows ---
    document.querySelectorAll('#sales-list tr').forEach(row => {
        row.addEventListener('click', () => {
            const customerName = row.dataset.customer;
            window.location.href = `customer-details.html?name=${encodeURIComponent(customerName)}`;
        });
    });
}

// ... other functions (populateMonths, etc.) remain unchanged ...

document.addEventListener('DOMContentLoaded', initializePage);
