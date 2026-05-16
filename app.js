/**
 * @fileoverview Main Application Controller.
 * Handles Sidebar Navigation, Feature Cards, State Persistence (via HTML5 History API), 
 * Global Modals, and the Dark Mode Theme Toggle.
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initFeatureCards();
    initThemeToggle();
    initModalEvents();
    initSidebarToggle();
    
    // Check URL on load to restore the correct calculator page
    // 'true' indicates this is a fresh page load
    restorePageState(true);
});

/**
 * @brief Logic for handling the Sidebar open/close toggle.
 */
function initSidebarToggle() {
    const toggleBtn = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');

    const storedState = localStorage.getItem('sidebarState');
    
    // Only open the sidebar if the user explicitly left it open during a previous session.
    if (storedState === 'open') {
        sidebar.classList.add('open');
    }

    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        
        // Save the new state so it persists across refreshes
        if (sidebar.classList.contains('open')) {
            localStorage.setItem('sidebarState', 'open');
        } else {
            localStorage.setItem('sidebarState', 'collapsed');
        }
    });
}

/**
 * @brief Handles switching between calculator modules via the sidebar and top Home button.
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('#calculator-nav a');
    const homeBtn = document.getElementById('home-btn');

    // Sidebar navigation logic
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = e.target.getAttribute('data-target');
            
            if (window.location.hash === '#' + targetId) return;

            switchModule(targetId, true);
            history.pushState({ module: targetId }, '', '#' + targetId);
        });
    });

    // Top header Home button logic
    if (homeBtn) {
        homeBtn.addEventListener('click', () => {
            const targetId = 'home-page';
            
            // Do nothing if we are already explicitly on the home page
            if (window.location.hash === '#' + targetId) return;

            switchModule(targetId, true);
            history.pushState({ module: targetId }, '', '#' + targetId);
        });
    }

    // Listen for the Browser's Back and Forward buttons
    window.addEventListener('popstate', () => {
        restorePageState(false); 
    });
}

/**
 * @brief Handles clicking the feature cards on the Home Page.
 */
function initFeatureCards() {
    const cards = document.querySelectorAll('.feature-card');
    
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const targetId = card.getAttribute('data-link');
            
            if (targetId && window.location.hash !== '#' + targetId) {
                switchModule(targetId, true);
                history.pushState({ module: targetId }, '', '#' + targetId);
            }
        });
    });
}

/**
 * @brief Core logic to show a specific module and update sidebar styling.
 * @param {string} targetId The ID of the module to display.
 * @param {boolean} isFreshNavigation Determines if inputs should be wiped.
 */
function switchModule(targetId, isFreshNavigation = false) {
    const modules = document.querySelectorAll('.calculator-module');
    const navLinks = document.querySelectorAll('#calculator-nav a');

    if (isFreshNavigation) {
        resetModule(targetId);
    }

    navLinks.forEach(link => {
        if (link.getAttribute('data-target') === targetId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    modules.forEach(mod => {
        if (mod.id === targetId) {
            mod.style.display = 'block';
        } else {
            mod.style.display = 'none';
        }
    });

    window.scrollTo(0, 0);
}

/**
 * @brief Resets inputs, dropdowns, and hides results within a specific module.
 * @param {string} moduleId The ID of the module to reset.
 */
function resetModule(moduleId) {
    const module = document.getElementById(moduleId);
    if (!module) return;

    const inputs = module.querySelectorAll('input');
    inputs.forEach(input => {
        if (input.type === 'text' || input.type === 'number') {
            input.value = '';
        }
    });

    const selects = module.querySelectorAll('select');
    selects.forEach(select => {
        select.selectedIndex = 0;
        select.dispatchEvent(new Event('change'));
    });

    const results = module.querySelectorAll('.results-container');
    results.forEach(res => {
        res.style.display = 'none';
    });
}

/**
 * @brief Reads the URL hash on page load or back/forward to show the correct module.
 * @param {boolean} isInitialLoad Tells switchModule whether to wipe data.
 */
function restorePageState(isInitialLoad = false) {
    const currentHash = window.location.hash.replace('#', '');
    
    if (currentHash && document.getElementById(currentHash)) {
        switchModule(currentHash, isInitialLoad);
    } else {
        switchModule('home-page', isInitialLoad);
        if (isInitialLoad) {
            history.replaceState({ module: 'home-page' }, '', '#home-page');
        }
    }
}

/**
 * @brief Initializes and manages the Dark Mode toggle logic.
 */
function initThemeToggle() {
    const themeBtn = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

    const storedTheme = localStorage.getItem("theme");
    const currentTheme = storedTheme ? storedTheme : (prefersDarkScheme.matches ? "dark" : "light");

    if (currentTheme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
        themeBtn.textContent = "☀️ Light Mode";
    } else {
        document.documentElement.setAttribute("data-theme", "light");
        themeBtn.textContent = "🌙 Dark Mode";
    }

    themeBtn.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute("data-theme");
        
        if (theme === "dark") {
            document.documentElement.setAttribute("data-theme", "light");
            localStorage.setItem("theme", "light");
            themeBtn.textContent = "🌙 Dark Mode";
        } else {
            document.documentElement.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark");
            themeBtn.textContent = "☀️ Light Mode";
        }
    });
}

/**
 * @brief Global UI Error Modal logic. 
 */
function initModalEvents() {
    const modal = document.getElementById('custom-alert-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    const okBtn = document.getElementById('ok-modal-btn');

    function hideModal() {
        modal.style.display = 'none';
    }

    closeBtn.addEventListener('click', hideModal);
    okBtn.addEventListener('click', hideModal);

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            hideModal();
        }
    });

    window.showError = function(message) {
        document.getElementById('custom-alert-text').textContent = message;
        modal.style.display = 'flex';
    };
}