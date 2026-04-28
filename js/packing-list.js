document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const tripId = params.get('id');

    if (!tripId || !window.supabaseClientInstance) {
        // If no tripId, we just setup the UI toggles and exit
        setupToggles();
        return;
    }

    const { data: { session } } = await window.supabaseClientInstance.auth.getSession();
    const userId = session?.user?.id;

    if (!userId) return;

    // Fetch existing items
    async function loadItems() {
        try {
            const { data, error } = await window.supabaseClientInstance
                .from('packing_items')
                .select('*')
                .eq('trip_id', tripId)
                .order('created_at', { ascending: true });
            
            if (error) throw error;

            // Clear existing lists
            document.querySelectorAll('.pack-category__items').forEach(list => list.innerHTML = '');

            if (data && data.length > 0) {
                data.forEach(item => renderItem(item));
            } else {
                // Initial defaults can be added here if needed
            }
            updateProgressLocal();
        } catch (err) {
            console.error('Error loading packing items:', err);
        }
    }

    function renderItem(item) {
        let list = Array.from(document.querySelectorAll('.pack-category')).find(c => c.querySelector('span').textContent.trim().toLowerCase() === (item.category || 'essentials').toLowerCase());
        
        if (!list) {
            list = document.querySelector('.pack-category');
        }

        const itemsContainer = list?.querySelector('.pack-category__items');
        if (!itemsContainer) return;

        const itemLabel = document.createElement('label');
        itemLabel.className = 'pack-item';
        itemLabel.style.display = 'flex';
        itemLabel.style.alignItems = 'center';
        itemLabel.style.gap = '8px';
        itemLabel.style.marginBottom = '8px';
        itemLabel.dataset.id = item.id;

        const isChecked = item.is_packed ? 'checked' : '';

        itemLabel.innerHTML = `
            <input type="checkbox" class="pack-check" ${isChecked} onchange="toggleItem('${item.id}', this.checked)">
            <span class="pack-item__name" style="flex:1;">${item.name}</span>
            <button type="button" class="btn-icon btn--xs" style="width:24px;height:24px;border:none;background:transparent;cursor:pointer;" onclick="deleteItemHandler('${item.id}')">✕</button>
        `;

        itemsContainer.appendChild(itemLabel);
    }

    window.toggleItem = async function (itemId, isPacked) {
        updateProgressLocal(); // Optimistic
        try {
            const { error } = await window.supabaseClientInstance
                .from('packing_items')
                .update({ is_packed: isPacked })
                .eq('id', itemId);
            if (error) throw error;
        } catch (err) {
            console.error('Error updating item:', err);
            const cb = document.querySelector(`.pack-item[data-id="${itemId}"] .pack-check`);
            if (cb) cb.checked = !isPacked;
            updateProgressLocal();
        }
    };

    window.addItem = async function () {
        const input = document.getElementById('new-item');
        const name = input?.value.trim();
        if (!name) return;

        try {
            const { data, error } = await window.supabaseClientInstance
                .from('packing_items')
                .insert([{
                    trip_id: tripId,
                    user_id: userId,
                    name: name,
                    category: 'essentials',
                    is_packed: false
                }])
                .select();
                
            if (error) throw error;
            
            if (data && data[0]) {
                renderItem(data[0]);
                input.value = '';
                updateProgressLocal();
            }
        } catch (err) {
            console.error('Error adding item:', err);
            if (window.showToast) window.showToast('Failed to add item', 'error');
        }
    };

    window.deleteItemHandler = async function (itemId) {
        const itemEl = document.querySelector(`.pack-item[data-id="${itemId}"]`);
        if (itemEl) itemEl.style.display = 'none'; // Optimistic

        try {
            const { error } = await window.supabaseClientInstance
                .from('packing_items')
                .delete()
                .eq('id', itemId);
            if (error) throw error;
            if (itemEl) itemEl.remove();
            updateProgressLocal();
        } catch (err) {
            console.error('Error deleting item:', err);
            if (itemEl) itemEl.style.display = 'flex'; // Revert
        }
    };

    function updateProgressLocal() {
        const all = document.querySelectorAll('.pack-check');
        const checked = document.querySelectorAll('.pack-check:checked');
        const pct = all.length ? (checked.length / all.length) * 100 : 0;

        const progressEl = document.getElementById('packing-progress');
        const countEl = document.getElementById('packing-count');

        if (progressEl) progressEl.style.width = pct + '%';
        if (countEl) countEl.textContent = `${checked.length} / ${all.length} packed`;

        all.forEach(cb => {
            const item = cb.closest('.pack-item');
            if (item) {
                item.classList.toggle('pack-item--done', cb.checked);
                if (cb.checked) {
                    item.style.opacity = '0.5';
                    item.style.textDecoration = 'line-through';
                } else {
                    item.style.opacity = '1';
                    item.style.textDecoration = 'none';
                }
            }
        });
    }

    function setupToggles() {
        document.querySelectorAll('.pack-category__toggle').forEach(btn => {
            btn.addEventListener('click', () => {
                const items = btn.nextElementSibling;
                if (items) {
                    items.classList.toggle('hidden');
                }
                const chevron = btn.querySelector('.chevron');
                if (chevron) chevron.classList.toggle('rotated');
            });
        });
    }

    setupToggles();
    loadItems();
});
