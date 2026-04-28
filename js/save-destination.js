// Logic for saving and unsaving destinations
document.addEventListener('DOMContentLoaded', async () => {
    // We only proceed if there are save buttons on the page
    const saveBtns = document.querySelectorAll('.dest-card__save');
    if (saveBtns.length === 0) return;

    // Check if user is logged in
    const { data: { session } } = await window.supabaseClientInstance.auth.getSession();
    const userId = session?.user?.id;

    if (!userId) {
        // If not logged in, clicking save redirects to auth or shows toast
        saveBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // prevent clicking the card
                if (window.showToast) window.showToast('Please log in to save destinations', 'warning');
                setTimeout(() => window.location.href = 'auth.html', 1500);
            });
        });
        return;
    }

    // 1. Fetch user's saved destinations
    let savedDests = [];
    try {
        const { data, error } = await window.supabaseClientInstance
            .from('saved_destinations')
            .select('destination_name, id')
            .eq('user_id', userId);
        
        if (error) throw error;
        savedDests = data || [];
    } catch (err) {
        console.error('Error fetching saved destinations:', err);
    }

    // Helper to check if a destination is saved
    const isSaved = (destName) => savedDests.find(d => d.destination_name === destName);

    // 2. Initialize buttons state
    saveBtns.forEach(btn => {
        // Find the destination name from the card
        const card = btn.closest('.dest-card');
        const destName = card?.querySelector('.dest-card__name')?.textContent.trim();
        if (!destName) return;

        // Visual state
        const savedRecord = isSaved(destName);
        if (savedRecord) {
            btn.classList.add('saved');
            const icon = btn.querySelector('i');
            if (icon) {
                icon.style.fill = 'currentColor'; // solid heart
            }
        }

        // 3. Handle Click
        btn.addEventListener('click', async (e) => {
            e.stopPropagation(); // prevent navigation
            
            const currentlySaved = isSaved(destName);
            
            // Optimistic UI update
            btn.classList.toggle('saved');
            const icon = btn.querySelector('i');
            if (icon) {
                icon.style.fill = btn.classList.contains('saved') ? 'currentColor' : 'none';
            }

            try {
                if (currentlySaved) {
                    // Delete
                    const { error } = await window.supabaseClientInstance
                        .from('saved_destinations')
                        .delete()
                        .eq('id', currentlySaved.id);
                        
                    if (error) throw error;
                    savedDests = savedDests.filter(d => d.id !== currentlySaved.id);
                    if (window.showToast) window.showToast('Removed from saved places', 'info');
                } else {
                    // Insert
                    const { data, error } = await window.supabaseClientInstance
                        .from('saved_destinations')
                        .insert([{ user_id: userId, destination_name: destName }])
                        .select();
                        
                    if (error) throw error;
                    if (data && data[0]) savedDests.push(data[0]);
                    if (window.showToast) window.showToast('Destination saved!', 'success');
                }
            } catch (err) {
                console.error('Error toggling save state:', err);
                // Revert UI
                btn.classList.toggle('saved');
                if (icon) {
                    icon.style.fill = btn.classList.contains('saved') ? 'currentColor' : 'none';
                }
                if (window.showToast) window.showToast('Failed to update saved state', 'error');
            }
        });
    });
});
