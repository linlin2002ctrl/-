document.addEventListener('DOMContentLoaded', () => {
    const customerNameTitle = document.getElementById('customer-name-title');
    const customerSalesList = document.getElementById('customer-sales-list');
    const customerTotalAmountEl = document.getElementById('customer-total-amount');

    const params = new URLSearchParams(window.location.search);
    const customerName = params.get('name');

    if (!customerName) {
        customerNameTitle.textContent = "ဝယ်သူအမည် မတွေ့ပါ";
        return;
    }

    customerNameTitle.textContent = `${customerName} ၏ မှတ်တမ်း`;
    const allSales = JSON.parse(localStorage.getItem('sales')) || [];
    const customerSales = allSales.filter(sale => sale.customer === customerName);

    let customerTotal = 0;
    customerSalesList.innerHTML = '';
    customerSales.forEach(sale => {
        customerTotal += sale.totalPrice;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sale.date}</td>
            <td>${sale.product} (${sale.quantity} ခု)</td>
            <td class="text-end">${sale.totalPrice.toLocaleString()}</td>
        `;
        customerSalesList.appendChild(row);
    });

    customerTotalAmountEl.textContent = `${customerTotal.toLocaleString()} ကျပ်`;
});
