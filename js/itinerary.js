// Day Tabs Toggle for Itinerary Page
document.addEventListener('DOMContentLoaded', async () => {
    // Fetch Trip Details
    const params = new URLSearchParams(window.location.search);
    const tripId = params.get('id');
    let currentTrip = null;

    if (tripId && window.supabaseClientInstance) {
        try {
            const { data, error } = await window.supabaseClientInstance
                .from('trips')
                .select('*')
                .eq('id', tripId)
                .single();
            
            if (error) throw error;
            currentTrip = data;

            // Populate UI
            const dest = data.destination;
            const titleEl = document.getElementById('itin-title');
            const weatherEl = document.getElementById('itin-weather-locale');
            const mapEl = document.getElementById('itin-map');

            if (titleEl) titleEl.textContent = dest;
            if (weatherEl) weatherEl.textContent = dest;
            if (mapEl) {
                mapEl.src = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY_HERE&q=${encodeURIComponent(dest)}`;
            }

            // Populate dates
            const datesEl = document.querySelector('.itin-header p.text-muted');
            if (datesEl) {
                const start = new Date(data.start_date);
                const end = new Date(data.end_date);
                datesEl.innerHTML = `<i data-lucide="calendar" style="width: 16px; display:inline-block"></i> ${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
            }

            // Populate tag
            const tagEl = document.querySelector('.itin-header .tag');
            if (tagEl) {
                const start = new Date(data.start_date);
                const end = new Date(data.end_date);
                const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
                tagEl.textContent = `${days} Days • ${data.travelers || 2} Travelers`;
            }

        } catch (err) {
            console.error('Error fetching trip:', err);
        }
    } else if (params.has('dest')) {
        // Fallback for mockup links
        const dest = params.get('dest');
        const titleEl = document.getElementById('itin-title');
        const weatherEl = document.getElementById('itin-weather-locale');
        if (titleEl) titleEl.textContent = dest;
        if (weatherEl) weatherEl.textContent = dest;
    }

    const tabs = document.querySelectorAll('.day-tab');
    if (tabs.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('day-tab--active'));
                tab.classList.add('day-tab--active');
                const dayContents = document.querySelectorAll('.day-content');
                dayContents.forEach(content => content.classList.add('hidden'));
                const targetDay = tab.dataset.day;
                const targetContent = document.getElementById(`day-${targetDay}`);
                if (targetContent) {
                    targetContent.classList.remove('hidden');
                }
            });
        });
    }

    // Interactive star rating for Reviews Section
    let selectedRating = 0;
    const stars = document.querySelectorAll('.star[data-val]');
    // Find the review input and button specifically within the util card for reviews
    const reviewCard = Array.from(document.querySelectorAll('.util-card')).find(card => card.innerHTML.includes('Rate this Itinerary') || card.innerHTML.includes('How did we do'));
    const reviewInput = reviewCard ? reviewCard.querySelector('.field__input') : null;
    const submitReviewBtn = reviewCard ? reviewCard.querySelector('button.btn--primary') : null;

    if (stars.length > 0) {
        stars.forEach(star => {
            star.addEventListener('mouseover', () => {
                const val = +star.dataset.val;
                stars.forEach((s, i) => {
                    s.classList.toggle('star--filled', i < val);
                });
            });

            star.addEventListener('click', () => {
                selectedRating = +star.dataset.val;
            });

            star.addEventListener('mouseleave', () => {
                stars.forEach((s, i) => {
                    s.classList.toggle('star--filled', i < selectedRating);
                });
            });
        });
    }

    if (submitReviewBtn) {
        submitReviewBtn.addEventListener('click', async () => {
            if (!selectedRating) {
                if (window.showToast) window.showToast('Please select a rating', 'warning');
                return;
            }
            if (!tripId || !currentTrip) {
                if (window.showToast) window.showToast('No trip associated with this review', 'error');
                return;
            }

            try {
                submitReviewBtn.disabled = true;
                submitReviewBtn.textContent = 'Submitting...';

                const comment = reviewInput ? reviewInput.value.trim() : '';
                
                const { error } = await window.supabaseClientInstance
                    .from('reviews')
                    .insert([{
                        user_id: window.currentUserSession?.user?.id,
                        trip_id: tripId,
                        rating: selectedRating,
                        comment: comment
                    }]);

                if (error) throw error;

                if (window.showToast) window.showToast('Review submitted successfully!', 'success');
                if (reviewInput) reviewInput.value = '';
                submitReviewBtn.textContent = 'Submitted';
                
            } catch (err) {
                console.error('Error submitting review:', err);
                if (window.showToast) window.showToast('Error submitting review', 'error');
                submitReviewBtn.disabled = false;
                submitReviewBtn.textContent = 'Submit Feedback';
            }
        });
    }
});
