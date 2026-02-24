// Day Tabs Toggle for Itinerary Page
document.addEventListener('DOMContentLoaded', () => {
    // URL Param override
    const params = new URLSearchParams(window.location.search);
    if (params.has('dest')) {
        const dest = params.get('dest');
        const titleEl = document.getElementById('itin-title');
        const weatherEl = document.getElementById('itin-weather-locale');
        const mapEl = document.getElementById('itin-map');

        if (titleEl) titleEl.textContent = dest;
        if (weatherEl) weatherEl.textContent = dest;
        if (mapEl) {
            mapEl.src = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY_HERE&q=${encodeURIComponent(dest)}`;
            // (Note: To view actual map tiles, a valid API key would be required on production. We skip throwing error for mockup sake.)
        }
    }

    const tabs = document.querySelectorAll('.day-tab');

    if (tabs.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                tabs.forEach(t => t.classList.remove('day-tab--active'));
                // Add active class to clicked tab
                tab.classList.add('day-tab--active');

                // Hide all day contents
                const dayContents = document.querySelectorAll('.day-content');
                dayContents.forEach(content => content.classList.add('hidden'));

                // Show the target day content
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
});
