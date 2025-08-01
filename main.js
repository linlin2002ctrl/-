document.addEventListener('DOMContentLoaded', () => {
    const saleForm = document.getElementById('sale-form');
    const saleDateInput = document.getElementById('sale-date');
    const customerList = document.getElementById('customer-list');
    const productList = document.getElementById('product-list');
    const toastLiveExample = document.getElementById('liveToast');
    const toast = new bootstrap.Toast(toastLiveExample);

    // Initial load
    populateDatalists();
    saleDateInput.value = new Date().toISOString().split('T')[0];

    function populateDatalists() {
        const sales = JSON.parse(localStorage.getItem('sales')) || [];
        const uniqueCustomers = [...new Set(sales.map(sale => sale.customer))];
        const uniqueProducts = [...new Set(sales.map(sale => sale.product))];

        customerList.innerHTML = uniqueCustomers.map(c => `<option value="${c}">`).join('');
        productList.innerHTML = uniqueProducts.map(p => `<option value="${p}">`).join('');
    }

    saleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const quantity = parseInt(document.getElementById('quantity').value);
        const unitPrice = parseFloat(document.getElementById('unit-price').value);
        const newSale = {
            id: Date.now(),
            customer: document.getElementById('customer-name').value.trim(),
            product: document.getElementById('product-name').value.trim(),
            quantity,
            unitPrice,
            totalPrice: quantity * unitPrice,
            date: saleDateInput.value,
        };
        const sales = JSON.parse(localStorage.getItem('sales')) || [];
        sales.push(newSale);
        localStorage.setItem('sales', JSON.stringify(sales));
        
        saleForm.reset();
        saleDateInput.value = new Date().toISOString().split('T')[0];
        
        toast.show(); // Show toast notification
        populateDatalists(); // Update datalists with new entry
    });
});
