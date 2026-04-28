// Flight Search Logic

const airports = [
    "DEL - Indira Gandhi International Airport, New Delhi",
    "BOM - Chhatrapati Shivaji Maharaj International Airport, Mumbai",
    "BLR - Kempegowda International Airport, Bengaluru",
    "HYD - Rajiv Gandhi International Airport, Hyderabad",
    "MAA - Chennai International Airport, Chennai",
    "CCU - Netaji Subhas Chandra Bose International Airport, Kolkata",
    "AMD - Sardar Vallabhbhai Patel International Airport, Ahmedabad",
    "PNQ - Pune Airport, Pune",
    "GOI - Dabolim Airport, Goa",
    "GOX - Manohar International Airport, Goa",
    "JAI - Jaipur International Airport, Jaipur",
    "LKO - Chaudhary Charan Singh International Airport, Lucknow",
    "COK - Cochin International Airport, Kochi",
    "TRV - Trivandrum International Airport, Thiruvananthapuram",
    "ATQ - Sri Guru Ram Dass Jee International Airport, Amritsar",
    "SXR - Sheikh ul-Alam International Airport, Srinagar",
    "IXB - Bagdogra International Airport, Siliguri",
    "GAU - Lokpriya Gopinath Bordoloi International Airport, Guwahati",
    "BBI - Biju Patnaik Airport, Bhubaneswar",
    "VNS - Lal Bahadur Shastri International Airport, Varanasi"
];

function setupAutocomplete(inputId, dropdownId) {
    const input = document.getElementById(inputId);
    const dropdown = document.getElementById(dropdownId);
    
    if (!input || !dropdown) return;

    input.addEventListener('input', function() {
        const val = this.value.toLowerCase();
        dropdown.innerHTML = '';
        
        if (!val) {
            dropdown.classList.add('hidden');
            return;
        }

        const matches = airports.filter(airport => airport.toLowerCase().includes(val));
        
        if (matches.length > 0) {
            matches.forEach(match => {
                const li = document.createElement('li');
                // Bold the matching text if desired, or just show text
                li.textContent = match;
                li.addEventListener('click', () => {
                    input.value = match.split(' - ')[0]; // Just use the 3-letter code
                    dropdown.classList.add('hidden');
                });
                dropdown.appendChild(li);
            });
            dropdown.classList.remove('hidden');
        } else {
            dropdown.classList.add('hidden');
        }
    });

    document.addEventListener('click', function(e) {
        if (e.target !== input && e.target !== dropdown) {
            dropdown.classList.add('hidden');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupAutocomplete('flight-from', 'flight-from-dropdown');
    setupAutocomplete('flight-to', 'flight-to-dropdown');
});

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
    
    // Loading State
    btn.disabled = true;
    const originalText = btnText.innerHTML;
    btnText.innerHTML = 'Redirecting to Google Flights... <i data-lucide="loader" class="lucide-spin" style="width:16px;"></i>';
    if(window.lucide) window.lucide.createIcons();
    
    let query = `flights from ${fromVal} to ${toVal} on ${departDate}`;
    if (tripType === 'round-trip' && returnDate) {
        query += ` returning ${returnDate}`;
    }
    
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    
    setTimeout(() => {
        window.open(url, '_blank');
        btnText.innerHTML = originalText;
        btn.disabled = false;
        if(window.lucide) window.lucide.createIcons();
    }, 1000);
}
