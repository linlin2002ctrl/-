document.addEventListener('DOMContentLoaded', () => {
    const saleForm = document.getElementById('sale-form');
    const saleDateInput = document.getElementById('sale-date');

    // ရက်စွဲကို auto ဖြည့်ပေးခြင်း
    saleDateInput.value = new Date().toISOString().split('T')[0];

    saleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newSale = {
            id: Date.now(),
            customer: document.getElementById('customer-name').value,
            product: document.getElementById('product-name').value,
            price: parseFloat(document.getElementById('price').value),
            date: saleDateInput.value,
        };
        const sales = JSON.parse(localStorage.getItem('sales')) || [];
        sales.push(newSale);
        localStorage.setItem('sales', JSON.stringify(sales));
        saleForm.reset();
        saleDateInput.value = new Date().toISOString().split('T')[0];
        alert('စာရင်းသွင်းပြီးပါပြီ!');
    });
});
