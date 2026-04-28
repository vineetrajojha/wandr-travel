// Global Auth Guard and Session Management
document.addEventListener('DOMContentLoaded', async () => {
    // Determine if the current page requires authentication
    const privateRoutes = ['dashboard.html', 'itinerary.html', 'plan-trip.html', 'admin.html', 'trip-summary.html'];
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const isPrivateRoute = privateRoutes.includes(currentPath);
    
    // Check session
    const { data: { session }, error } = await window.supabaseClientInstance.auth.getSession();
    
    window.currentUserSession = session;

    if (isPrivateRoute && !session) {
        // Redirect to auth if trying to access a private route without a session
        window.location.href = 'auth.html';
        return;
    }

    if (currentPath === 'auth.html' && session) {
        // Redirect away from auth page if already logged in
        window.location.href = 'index.html';
        return;
    }

    // Update Navbar UI if session exists
    if (session) {
        updateNavbarForLoggedInUser();
    }
});

function updateNavbarForLoggedInUser() {
    const navActions = document.querySelector('.nav__actions');
    const drawerLinks = document.querySelector('.drawer-links');
    const drawerActions = document.querySelector('.nav__drawer > div[style*="margin-top: auto"]');

    if (navActions) {
        // Remove Login/Signup buttons
        const loginBtn = navActions.querySelector('a[href="auth.html"]');
        const signupBtn = navActions.querySelector('a[href="auth.html#signup"]');
        if (loginBtn) loginBtn.remove();
        if (signupBtn) signupBtn.remove();

        // Add Logout button if it doesn't exist
        if (!navActions.querySelector('#logout-btn')) {
            const logoutBtn = document.createElement('button');
            logoutBtn.id = 'logout-btn';
            logoutBtn.className = 'btn btn--ghost';
            logoutBtn.textContent = 'Logout';
            logoutBtn.onclick = handleLogout;
            
            // Insert before hamburger if it exists, otherwise append
            const hamburger = document.getElementById('hamburger');
            if (hamburger) {
                navActions.insertBefore(logoutBtn, hamburger);
            } else {
                navActions.appendChild(logoutBtn);
            }
        }
    }

    if (drawerActions) {
        drawerActions.innerHTML = `
            <button class="btn btn--outline btn--full" onclick="handleLogout()">Logout</button>
        `;
    }
}

async function handleLogout() {
    try {
        const { error } = await window.supabaseClientInstance.auth.signOut();
        if (error) throw error;
        
        if (window.showToast) {
            window.showToast('Logged out successfully', 'success');
        }
        
        // Redirect to home
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 500);
    } catch (err) {
        console.error('Error logging out:', err.message);
        if (window.showToast) {
            window.showToast(err.message, 'error');
        }
    }
}
