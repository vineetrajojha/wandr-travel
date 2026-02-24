// Static rates (dummy data — replace with API in prod)
// Base is USD for easy conversion math
const rates = { USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.5, INR: 83.2, AUD: 1.53, CAD: 1.36 };

window.convertCurrency = function () {
    const amountFromEl = document.getElementById('amount-from');
    const amountToEl = document.getElementById('amount-to');
    const fromSel = document.getElementById('from-currency');
    const toSel = document.getElementById('to-currency');

    if (!amountFromEl || !amountToEl || !fromSel || !toSel) return;

    const amount = parseFloat(amountFromEl.value) || 0;
    const from = fromSel.value;
    const to = toSel.value;

    const result = (amount / rates[from]) * rates[to];
    amountToEl.value = result.toFixed(2);

    // Update the rate hint text below
    const rateHint = document.querySelector('.currency-card__rate');
    if (rateHint) {
        const unitResult = (1 / rates[from]) * rates[to];
        // Keep internal update note intact
        rateHint.innerHTML = `1 ${from} = ${unitResult.toFixed(4)} ${to} <span class="currency-card__update" style="opacity:0.6;font-size:0.8em">· Updated today</span>`;
    }
};

window.setAmount = function (val) {
    const amountFromEl = document.getElementById('amount-from');
    if (amountFromEl) {
        amountFromEl.value = val;
        convertCurrency();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const amountFromEl = document.getElementById('amount-from');
    const fromSel = document.getElementById('from-currency');
    const toSel = document.getElementById('to-currency');
    const swapBtn = document.getElementById('swap-currencies');

    if (amountFromEl) amountFromEl.addEventListener('input', convertCurrency);
    if (fromSel) fromSel.addEventListener('change', convertCurrency);
    if (toSel) toSel.addEventListener('change', convertCurrency);

    if (swapBtn && fromSel && toSel) {
        swapBtn.addEventListener('click', () => {
            const temp = fromSel.value;
            fromSel.value = toSel.value;
            toSel.value = temp;
            convertCurrency();
        });
    }

    // Initial compute
    convertCurrency();
});
