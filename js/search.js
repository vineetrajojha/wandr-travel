// Filter chip logic for Destinations page
document.addEventListener('DOMContentLoaded', () => {
    const chips = document.querySelectorAll('.chip[data-filter]');
    const searchInput = document.getElementById('dest-search');
    const durationSelect = document.getElementById('filter-duration');

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const group = chip.dataset.filter;
            // Remove active from peers in the same group
            document.querySelectorAll(`[data-filter="${group}"]`).forEach(c => c.classList.remove('chip--active'));
            // Add to clicked
            chip.classList.add('chip--active');
            applyFilters();
        });
    });

    if (durationSelect) {
        durationSelect.addEventListener('change', applyFilters);
    }

    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);

        const clearBtn = document.getElementById('clear-search');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                searchInput.value = '';
                applyFilters();
            });
        }
    }

    function applyFilters() {
        const budget = document.querySelector('[data-filter="budget"].chip--active')?.dataset.val || 'all';
        const cat = document.querySelector('[data-filter="cat"].chip--active')?.dataset.val || 'all';
        const dur = durationSelect?.value || 'all';
        const q = searchInput?.value.toLowerCase() || '';

        let visibleCount = 0;

        document.querySelectorAll('.dest-card').forEach(card => {
            const name = card.querySelector('.dest-card__name')?.textContent.toLowerCase() || '';

            const match =
                (budget === 'all' || card.dataset.budget === budget) &&
                (cat === 'all' || card.dataset.cat === cat) &&
                (dur === 'all' || card.dataset.dur === dur) &&
                (name.includes(q));

            card.classList.toggle('hidden', !match);
            if (match) visibleCount++;
        });

        const countEl = document.getElementById('results-count');
        if (countEl) {
            countEl.innerHTML = `Showing <strong>${visibleCount}</strong> destinations`;
        }
    }

    // Load from URL params 
    const params = new URLSearchParams(window.location.search);
    if (params.has('q') && searchInput) {
        searchInput.value = params.get('q');
        applyFilters();
    }
});
