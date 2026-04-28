// Flight Search Logic

window.toggleReturnDate = function() {
    const tripType = document.querySelector('input[name="trip-type"]:checked').value;
    const returnGroup = document.getElementById('return-date-group');
    const returnInput = document.getElementById('flight-return');
    
    if (tripType === 'one-way') {
        returnGroup.style.display = 'none';
        returnInput.removeAttribute('required');
    } else {
        returnGroup.style.display = 'block';
        returnInput.setAttribute('required', 'true');
    }
}

window.searchFlights = async function(e) {
    e.preventDefault();
    
    const fromVal = document.getElementById('flight-from').value.toUpperCase();
    const toVal = document.getElementById('flight-to').value.toUpperCase();
    const departDate = document.getElementById('flight-depart').value;
    const tripType = document.querySelector('input[name="trip-type"]:checked').value;
    const returnDate = document.getElementById('flight-return').value;
    
    const btn = document.getElementById('flight-search-btn');
    const btnText = document.getElementById('flight-search-text');
    const resultsSection = document.getElementById('flight-results-section');
    const resultsContainer = document.getElementById('flight-results-container');
    const resultsMeta = document.getElementById('flight-results-meta');

    // Loading State
    btn.disabled = true;
    const originalText = btnText.innerHTML;
    btnText.innerHTML = 'Searching Airlines... <i data-lucide="loader" class="lucide-spin" style="width:16px;"></i>';
    lucide.createIcons();
    resultsSection.classList.add('hidden');
    
    // Smooth scroll to loading section (if needed)
    
    // Simulate API Fetch Delay (e.g. SerpApi / Amadeus)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock Flight Data Generator
    const mockAirlines = ['IndiGo', 'Air India', 'Vistara', 'SpiceJet', 'Akasa Air'];
    const resultsCount = Math.floor(Math.random() * 5) + 3; // 3 to 7 flights
    
    let html = '';
    
    for(let i = 0; i < resultsCount; i++) {
        const airline = mockAirlines[Math.floor(Math.random() * mockAirlines.length)];
        const price = Math.floor(Math.random() * 8000) + 3500;
        
        // Random times
        const deptH = Math.floor(Math.random() * 24);
        const deptM = Math.floor(Math.random() * 60);
        const durH = Math.floor(Math.random() * 3) + 1;
        const durM = Math.floor(Math.random() * 60);
        
        let arrH = deptH + durH;
        let arrM = deptM + durM;
        if(arrM >= 60) { arrM -= 60; arrH += 1; }
        if(arrH >= 24) { arrH -= 24; }
        
        const pad = (n) => n.toString().padStart(2, '0');
        const deptTime = `${pad(deptH)}:${pad(deptM)}`;
        const arrTime = `${pad(arrH)}:${pad(arrM)}`;
        const duration = `${durH}h ${durM}m`;
        const stops = Math.random() > 0.7 ? '1 Stop' : 'Non-stop';
        
        html += `
            <div style="background: var(--bg-card); padding: var(--sp-md); border-radius: var(--r-md); border: 1px solid var(--border); display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: var(--sp-md);">
                <div style="display: flex; align-items: center; gap: var(--sp-sm); flex: 1; min-width: 200px;">
                    <div style="width: 40px; height: 40px; background: var(--clr-accent-glow); color: var(--clr-accent); border-radius: 50%; display: grid; place-items: center;">
                        <i data-lucide="plane" style="width: 20px;"></i>
                    </div>
                    <div>
                        <div style="font-weight: 600;">${airline}</div>
                        <div style="font-size: var(--text-xs); color: var(--text-muted);">${fromVal} - ${toVal}</div>
                    </div>
                </div>
                
                <div style="text-align: center; flex: 1; min-width: 150px;">
                    <div style="font-weight: 600; font-size: var(--text-lg); font-family: var(--font-mono);">${deptTime} - ${arrTime}</div>
                    <div style="font-size: var(--text-xs); color: var(--text-muted);">${duration} • ${stops}</div>
                </div>
                
                <div style="text-align: right; flex: 1; min-width: 150px; display: flex; flex-direction: column; align-items: flex-end; gap: var(--sp-xs);">
                    <div style="font-size: var(--text-xl); font-weight: 700; color: var(--clr-accent);">₹${price.toLocaleString('en-IN')}</div>
                    <button class="btn btn--outline btn--sm" onclick="window.location.href='plan-trip.html?dest=${encodeURIComponent(toVal)}'">Select Flight</button>
                </div>
            </div>
        `;
    }
    
    resultsContainer.innerHTML = html;
    
    // Set Metadata
    let metaText = `Showing ${resultsCount} flights from ${fromVal} to ${toVal} on ${new Date(departDate).toLocaleDateString()}`;
    if (tripType === 'round-trip') {
        metaText += ` returning ${new Date(returnDate).toLocaleDateString()}`;
    }
    resultsMeta.textContent = metaText;
    
    // Reset Button and show results
    btnText.innerHTML = originalText;
    btn.disabled = false;
    resultsSection.classList.remove('hidden');
    lucide.createIcons();
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
