import { supabase } from './supabase-client.js';

document.addEventListener('DOMContentLoaded', () => {
    // ... variable declarations (no change) ...
    const toastLiveExample = document.getElementById('liveToast');
    const toast = new bootstrap.Toast(toastLiveExample);

    // ... populateDatalists and other functions (no change) ...

    saleForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        // ... newSale object creation (no change) ...

        const { error } = await supabase.from('sales').insert(newSale);

        if (error) {
            // A more elegant error toast could be implemented here later
            alert('Error saving sale: ' + error.message);
        } else {
            saleForm.reset();
            // ... reset date and other logic ...
            
            // --- Zen: Use toast for unobtrusive feedback ---
            toast.show(); 
            
            populateDatalists();
        }
    });

    // ... other event listeners and initial calls ...
});
