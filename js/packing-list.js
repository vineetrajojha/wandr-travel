// Packing List Interactivity
window.updateProgress = function () {
    const all = document.querySelectorAll('.pack-check');
    const checked = document.querySelectorAll('.pack-check:checked');
    const pct = all.length ? (checked.length / all.length) * 100 : 0;

    const progressEl = document.getElementById('packing-progress');
    const countEl = document.getElementById('packing-count');

    if (progressEl) progressEl.style.width = pct + '%';
    if (countEl) countEl.textContent = `${checked.length} / ${all.length} packed`;

    // Strikethrough checked items
    all.forEach(cb => {
        const item = cb.closest('.pack-item');
        if (item) {
            item.classList.toggle('pack-item--done', cb.checked);
            if (cb.checked && item.style.opacity !== '0.5') {
                item.style.opacity = '0.5';
                item.style.textDecoration = 'line-through';
            } else if (!cb.checked) {
                item.style.opacity = '1';
                item.style.textDecoration = 'none';
            }
        }
    });
};

window.addItem = function () {
    const input = document.getElementById('new-item');
    const name = input?.value.trim();
    if (!name) return;

    // Add to the first category's items list
    const list = document.querySelector('.pack-category__items');
    if (!list) return;

    const itemLabel = document.createElement('label');
    itemLabel.className = 'pack-item';
    itemLabel.style.display = 'flex';
    itemLabel.style.alignItems = 'center';
    itemLabel.style.gap = '8px';
    itemLabel.style.marginBottom = '8px';

    itemLabel.innerHTML = `
    <input type="checkbox" class="pack-check" onchange="updateProgress()">
    <span class="pack-item__name" style="flex:1;">${name}</span>
    <button type="button" class="btn-icon btn--xs style="width:24px;height:24px" onclick="deleteItem(this)">✕</button>
  `;

    list.appendChild(itemLabel);
    input.value = '';
    updateProgress();
};

window.deleteItem = function (btn) {
    const item = btn.closest('.pack-item');
    if (item) {
        item.remove();
        updateProgress();
    }
};

window.clearAll = function () {
    document.querySelectorAll('.pack-check:checked').forEach(cb => {
        cb.checked = false;
    });
    updateProgress();
};

document.addEventListener('DOMContentLoaded', () => {
    // Collapsible categories
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

    // Initialize progress
    if (document.getElementById('packing-progress')) {
        updateProgress();
    }
});
