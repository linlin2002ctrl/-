import { supabase } from './supabase-client.js';

const saleForm = document.getElementById('sale-form');
const saleDateInput = document.getElementById('sale-date');
// ... datalist variables ...

// Check if user is logged in
const { data: { user } } = await supabase.auth.getUser();
if (!user) {
    window.location.href = '/auth.html';
}

// ... populateDatalists function (no change) ...

saleForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const quantity = parseInt(document.getElementById('quantity').value);
    const unitPrice = parseFloat(document.getElementById('unit-price').value);
    
    const newSale = {
        sale_id: Date.now(),
        customer: document.getElementById('customer-name').value.trim(),
        product: document.getElementById('product-name').value.trim(),
        quantity,
        unitPrice,
        totalPrice: quantity * unitPrice,
        date: saleDateInput.value,
        user_id: user.id // Logged in user's ID
    };

    const { error } = await supabase.from('sales').insert(newSale);

    if (error) {
        alert('Error saving sale: ' + error.message);
    } else {
        alert('စာရင်းသွင်းပြီးပါပြီ။');
        saleForm.reset();
        saleDateInput.value = new Date().toISOString().split('T')[0];
        // populateDatalists();
    }
});

// ... DOMContentLoaded event listener ...
