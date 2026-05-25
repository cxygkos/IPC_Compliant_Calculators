/**
 * @fileoverview Main Application Controller.
 * Handles Sidebar Navigation, Feature Cards, State Persistence (via HTML5 History API), 
 * Global Modals, Focus Management, and the Dark Mode Theme Toggle.
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initFeatureCards();
    initThemeToggle();
    initModalEvents();
    initSidebarToggle();
    initSkipLink(); // Initializes the Accessibility bypass link
    
    // Check URL on load to restore the correct calculator page
    // 'true' indicates this is a fresh page load
    restorePageState(true);
});

/**
 * @brief Accessibility: Handles the "Skip to main content" link without breaking the SPA router.
 */
function initSkipLink() {
    const skipLink = document.querySelector('.skip-nav-link');
    if (skipLink) {
        skipLink.addEventListener('click', (e) => {
            e.preventDefault(); // Stop the URL hash from changing and breaking the router

            // Find the currently visible calculator module
            const activeModule = Array.from(document.querySelectorAll('.calculator-module'))
                                      .find(mod => window.getComputedStyle(mod).display === 'block');
            
            if (activeModule) {
                // Focus the title of the active page for the screen reader
                const heading = activeModule.querySelector('h2');
                if (heading) {
                    heading.focus({ preventScroll: true });
                }
            }
        });
    }
}

/**
 * @brief Logic for handling the Sidebar open/close toggle & ARIA states.
 */
function initSidebarToggle() {
    const toggleBtn = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');

    const storedState = localStorage.getItem('sidebarState');
    
    if (storedState === 'open') {
        sidebar.classList.add('open');
        toggleBtn.setAttribute('aria-expanded', 'true');
    }

    toggleBtn.addEventListener('click', () => {
        const isOpen = sidebar.classList.toggle('open');
        toggleBtn.setAttribute('aria-expanded', isOpen);
        
        if (isOpen) {
            localStorage.setItem('sidebarState', 'open');
        } else {
            localStorage.setItem('sidebarState', 'collapsed');
        }
    });

    // Close sidebar on pressing Escape (Mobile UX & A11y)
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('open') && window.innerWidth <= 768) {
            sidebar.classList.remove('open');
            toggleBtn.setAttribute('aria-expanded', 'false');
            localStorage.setItem('sidebarState', 'collapsed');
            toggleBtn.focus({ preventScroll: true });
        }
    });
}

/**
 * @brief Handles switching between calculator modules via the sidebar and top Home button.
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('#calculator-nav a');
    const homeBtn = document.getElementById('home-btn');
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle');

    // Sidebar navigation logic
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = e.target.getAttribute('data-target');
            
            // Auto-collapse the sidebar & sync ARIA
            if (sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
                toggleBtn.setAttribute('aria-expanded', 'false');
                localStorage.setItem('sidebarState', 'collapsed');
            }
            
            if (window.location.hash === '#' + targetId) return;

            switchModule(targetId, true);
            history.pushState({ module: targetId }, '', '#' + targetId);
        });
    });

    // Top header Home button logic
    if (homeBtn) {
        homeBtn.addEventListener('click', () => {
            const targetId = 'home-page';
            if (window.location.hash === '#' + targetId) return;
            switchModule(targetId, true);
            history.pushState({ module: targetId }, '', '#' + targetId);
        });
    }

    window.addEventListener('popstate', () => {
        restorePageState(false); 
    });
}

/**
 * @brief Handles clicking the feature cards on the Home Page.
 */
function initFeatureCards() {
    const cards = document.querySelectorAll('.feature-card');
    const sidebar = document.getElementById('sidebar'); 
    const toggleBtn = document.getElementById('sidebar-toggle');
    
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const targetId = card.getAttribute('data-link');
            
            if (sidebar && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
                toggleBtn.setAttribute('aria-expanded', 'false');
                localStorage.setItem('sidebarState', 'collapsed');
            }
            
            if (targetId && window.location.hash !== '#' + targetId) {
                switchModule(targetId, true);
                history.pushState({ module: targetId }, '', '#' + targetId);
            }
        });
    });
}

/**
 * @brief Core logic to show a specific module, update sidebar styling, and shift focus.
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
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });

    let targetHeading = null;

    modules.forEach(mod => {
        if (mod.id === targetId) {
            mod.style.display = 'block';
            targetHeading = mod.querySelector('h2');
        } else {
            mod.style.display = 'none';
        }
    });

    // Override native browser anchor-jumping by pushing the scroll command to the back of the execution queue using a brief timeout.
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 10);

    // ACCESSIBILITY: Shift programmatic focus to the new page context heading
    if (targetHeading && isFreshNavigation) {
        // Prevent the browser from jerking the scrollbar down to the focused element
        targetHeading.focus({ preventScroll: true });
    }
}

/**
 * @brief Resets inputs, dropdowns, and hides results within a specific module.
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
 * @brief Global UI Error Modal logic with rigorous WCAG Focus Trapping.
 */
function initModalEvents() {
    const modal = document.getElementById('custom-alert-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    const okBtn = document.getElementById('ok-modal-btn');
    
    // Store the element that was focused before the modal opened
    let previousFocusElement = null;

    function hideModal() {
        modal.style.display = 'none';
        // Restore focus to original element when modal closes
        if (previousFocusElement) {
            previousFocusElement.focus({ preventScroll: true });
        }
    }

    closeBtn.addEventListener('click', hideModal);
    okBtn.addEventListener('click', hideModal);

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            hideModal();
        }
    });

    // Handle Keyboard Trapping and Escape
    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideModal();
            return;
        }

        // Trap TAB inside the modal
        if (e.key === 'Tab') {
            const focusableElements = modal.querySelectorAll('button');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) { // Shift + Tab
                if (document.activeElement === firstElement) {
                    lastElement.focus({ preventScroll: true });
                    e.preventDefault();
                }
            } else { // Tab
                if (document.activeElement === lastElement) {
                    firstElement.focus({ preventScroll: true });
                    e.preventDefault();
                }
            }
        }
    });

    window.showError = function(message) {
        previousFocusElement = document.activeElement;
        document.getElementById('custom-alert-text').textContent = message;
        modal.style.display = 'flex';
        // Immediately force focus to the close button so keyboard users aren't lost
        closeBtn.focus({ preventScroll: true });
    };
}
