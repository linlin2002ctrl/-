// At the top of main.js, after declaring variables
const quantityInput = document.getElementById('quantity');
const unitPriceInput = document.getElementById('unit-price');
const totalPriceDisplay = document.getElementById('total-price-display');

function calculateTotal() {
    const quantity = parseInt(quantityInput.value) || 0;
    const unitPrice = parseFloat(unitPriceInput.value) || 0;
    const total = quantity * unitPrice;
    totalPriceDisplay.textContent = `${total.toLocaleString()} ကျပ်`;
}

// Add event listeners for auto-calculation
quantityInput.addEventListener('input', calculateTotal);
unitPriceInput.addEventListener('input', calculateTotal);

// --- The rest of your main.js code (like the form submit listener) goes here ---
// --- Ensure you also call calculateTotal() when the page loads ---
document.addEventListener('DOMContentLoaded', () => {
    // ... existing DOMContentLoaded code ...
    calculateTotal(); 
});
