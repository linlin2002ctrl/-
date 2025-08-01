import { supabase } from './supabase-client.js';

document.addEventListener('DOMContentLoaded', async () => {
    // --- Check if user is logged in ---
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        window.location.href = '/auth.html';
        return;
    }

    // --- Element References ---
    const saleForm = document.getElementById('sale-form');
    const saleDateInput = document.getElementById('sale-date');
    const customerList = document.getElementById('customer-list');
    const productList = document.getElementById('product-list');
    const quantityInput = document.getElementById('quantity');
    const unitPriceInput = document.getElementById('unit-price');
    const totalPriceDisplay = document.getElementById('total-price-display');
    const toastLiveExample = document.getElementById('liveToast');
    const toast = new bootstrap.Toast(toastLiveExample);

    // --- Initial Setup ---
    populateDatalists();
    saleDateInput.value = new Date().toISOString().split('T')[0];
    calculateTotal();

    // --- Functions ---
    async function populateDatalists() {
        const { data: sales, error } = await supabase.from('sales').select('customer, product');
        if (error) {
            console.error('Error fetching data for datalists:', error);
            return;
        }
        const uniqueCustomers = [...new Set(sales.map(sale => sale.customer))];
        const uniqueProducts = [...new Set(sales.map(sale => sale.product))];

        customerList.innerHTML = uniqueCustomers.map(c => `<option value="${c}">`).join('');
        productList.innerHTML = uniqueProducts.map(p => `<option value="${p}">`).join('');
    }
    
    function calculateTotal() {
        const quantity = parseInt(quantityInput.value) || 0;
        const unitPrice = parseFloat(unitPriceInput.value) || 0;
        const total = quantity * unitPrice;
        totalPriceDisplay.textContent = `${total.toLocaleString()} ကျပ်`;
    }

    // --- Event Listeners ---
    quantityInput.addEventListener('input', calculateTotal);
    unitPriceInput.addEventListener('input', calculateTotal);

    saleForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const quantity = parseInt(quantityInput.value);
        const unitPrice = parseFloat(unitPriceInput.value);
        
        const newSale = {
            sale_id: Date.now(),
            customer: document.getElementById('customer-name').value.trim(),
            product: document.getElementById('product-name').value.trim(),
            quantity,
            unitPrice,
            totalPrice: quantity * unitPrice,
            date: saleDateInput.value,
            user_id: user.id
        };

        const { error } = await supabase.from('sales').insert(newSale);

        if (error) {
            alert('Error saving sale: ' + error.message);
        } else {
            // =========================================================
            //            ZEN & TAKUMI: Provide immediate feedback
            // =========================================================
            // Instead of just showing a toast, redirect the user to see their new entry.
            // This is the best confirmation.
            window.location.href = 'records.html';
        }
    });
});
