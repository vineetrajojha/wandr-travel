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
      ${type === 'bot' ? '<div class="chat-msg__avatar">🤖</div>' : ''}
      <div class="chat-msg__bubble">${text}</div>
      ${type === 'user' ? '<div class="chat-msg__avatar">👤</div>' : ''}
    `;
        msgsEl.appendChild(div);
        msgsEl.scrollTop = msgsEl.scrollHeight;
    };

    window.getBotResponse = function (msg) {
        const responses = [
            "Great choice! Kyoto is stunning in spring — cherry blossoms typically peak in late March. 🌸",
            "I recommend staying in the Gion or Higashiyama district for the most authentic experience!",
            "For a 7-day trip, a budget of $1,500–$2,500 per person is comfortable for Kyoto.",
            "Don't miss the Arashiyama Bamboo Grove — best visited at dawn to beat the crowds!"
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    };

    window.sendQuick = function (btn) {
        if (!windowEl || !inputEl) return;
        windowEl.classList.add('open');
        inputEl.value = btn.textContent.trim().replace(/^[\u{1F300}-\u{1F9FF}\s]+/u, ''); // remove emoji
        sendChat();
    };
});
