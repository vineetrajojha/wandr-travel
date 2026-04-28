// AI Chat Assistant Widget
document.addEventListener('DOMContentLoaded', () => {
    const bubble = document.getElementById('chat-bubble');
    const windowEl = document.getElementById('chat-window');
    const closeBtn = document.getElementById('chat-close');
    const inputEl = document.getElementById('chat-input');
    const msgsEl = document.getElementById('chat-messages');

    if (bubble && windowEl) {
        bubble.addEventListener('click', () => {
            windowEl.classList.add('open');
            inputEl?.focus();
        });
    }

    if (closeBtn && windowEl) {
        closeBtn.addEventListener('click', () => {
            windowEl.classList.remove('open');
        });
    }

    window.sendChat = function () {
        if (!inputEl || !msgsEl) return;
        const msg = inputEl.value.trim();
        if (!msg) return;

        addMessage(msg, 'user');
        inputEl.value = '';

        // Simulate bot typing delay
        setTimeout(() => {
            addMessage(getBotResponse(msg), 'bot');
        }, 800);
    };

    window.addMessage = function (text, type) {
        if (!msgsEl) return;
        const div = document.createElement('div');
        div.className = `chat-msg chat-msg--${type}`;
        div.innerHTML = `
      ${type === 'bot' ? '<div class="chat-msg__avatar" style="background: var(--bg-card); color: var(--clr-accent); display: grid; place-items: center; border-radius: 50%;"><i data-lucide="bot" style="width:16px; height:16px;"></i></div>' : ''}
      <div class="chat-msg__bubble">${text}</div>
      ${type === 'user' ? '<div class="chat-msg__avatar" style="background: var(--bg-card); color: var(--clr-accent); display: grid; place-items: center; border-radius: 50%;"><i data-lucide="user" style="width:16px; height:16px;"></i></div>' : ''}
    `;
        msgsEl.appendChild(div);
        msgsEl.scrollTop = msgsEl.scrollHeight;
        if (window.lucide) window.lucide.createIcons();
    };

    window.getBotResponse = function (msg) {
        const text = msg.toLowerCase();
        
        // Rule-based NLP Logic
        if (text.includes('hello') || text.includes('hi') || text.includes('hey')) {
            return "Hello there! 👋 I'm Wandr's AI assistant. I can help you find destinations, plan itineraries, or check flight budgets. What's on your mind?";
        }
        
        if (text.includes('book') || text.includes('flight') || text.includes('ticket')) {
            return "Looking to book a flight? You can use our new Flight Search widget right on the Home page to find the best deals! ✈️";
        }
        
        if (text.includes('budget') || text.includes('cost') || text.includes('cheap') || text.includes('expensive')) {
            return "We have destinations for every budget! If you're looking for budget-friendly options in India, consider Rishikesh, Varanasi, or Hampi. You can filter by 'Budget' on our Destinations page! 💰";
        }

        if (text.includes('plan') || text.includes('itinerary') || text.includes('days') || text.includes('trip')) {
            return "I can help you build an itinerary! Click the 'Plan Trip' button in the navigation bar to use our AI itinerary generator. Just tell us where you want to go and for how long! 🗺️";
        }
        
        if (text.includes('goa') || text.includes('beach') || text.includes('andaman')) {
            return "Goa is fantastic for beaches! 🏖️ We also highly recommend the Andaman Islands for crystal clear waters. Want to see an itinerary for either?";
        }
        
        if (text.includes('mountain') || text.includes('snow') || text.includes('leh') || text.includes('manali') || text.includes('darjeeling')) {
            return "The mountains are calling! 🏔️ Leh Ladakh, Manali, and Darjeeling are breathtaking. Remember to pack warm layers! Head to the Destinations page to save them to your list.";
        }
        
        if (text.includes('kerala') || text.includes('munnar') || text.includes('nature')) {
            return "Ah, 'God's Own Country'! 🌿 Kerala is perfect for nature lovers. You'll love the tea gardens in Munnar and the backwaters in Alleppey.";
        }

        if (text.includes('culture') || text.includes('varanasi') || text.includes('agra') || text.includes('udaipur')) {
            return "India has immense cultural heritage. 🏛️ From the Taj Mahal in Agra to the sacred ghats of Varanasi and palaces of Udaipur, you'll be amazed.";
        }

        // Fallback response
        const fallbacks = [
            "That sounds interesting! Tell me more about what kind of trip you're looking for (e.g. beaches, mountains, budget-friendly).",
            "I'm still learning! Could you specify if you need help with flights, itineraries, or finding a destination?",
            "I can certainly help you plan your travel. Are you looking for flights within India or exploring a specific state?"
        ];
        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    };

    window.sendQuick = function (btn) {
        if (!windowEl || !inputEl) return;
        windowEl.classList.add('open');
        inputEl.value = btn.textContent.trim().replace(/^[\u{1F300}-\u{1F9FF}\s]+/u, ''); // remove emoji
        sendChat();
    };
});
