// ==UserScript==
// @name           Toggle Floating Navbar
// @description    F2 per mostrare/nascondere navbar, click fuori per chiudere
// @author         Paolo
// ==/UserScript==

(function() {
    'use strict';
    
    const toolbox = document.getElementById('navigator-toolbox');
    const urlbar = document.getElementById('urlbar');
    let isVisible = false;

    function showNavbar() {
        isVisible = true;
        
        const transitionSpeed = '0.3s';
        const transitionEasing = 'cubic-bezier(0.77, 0, 0.18, 1)';
        
        toolbox.style.setProperty('transition', `transform ${transitionSpeed} ${transitionEasing}, opacity ${transitionSpeed} ${transitionEasing}`, 'important');
        toolbox.style.setProperty('transform', 'rotateX(0deg)', 'important');
        toolbox.style.setProperty('opacity', '1', 'important');
        toolbox.style.setProperty('pointer-events', 'auto', 'important');
        
        if (urlbar) {
            urlbar.style.setProperty('transition', `transform ${transitionSpeed} ${transitionEasing}, opacity ${transitionSpeed} ${transitionEasing}`, 'important');
            urlbar.style.setProperty('transform', 'rotateX(0deg)', 'important');
            urlbar.style.setProperty('opacity', '1', 'important');
            urlbar.style.setProperty('pointer-events', 'auto', 'important');
        }
        
        console.log('Navbar shown');
    }

    function hideNavbar() {
        isVisible = false;
        
        const transitionSpeed = '0.3s';
        const transitionEasing = 'cubic-bezier(0.77, 0, 0.18, 1)';
        
        toolbox.style.setProperty('transition', `transform ${transitionSpeed} ${transitionEasing}, opacity ${transitionSpeed} ${transitionEasing}`, 'important');
        toolbox.style.setProperty('transform', 'rotateX(82deg)', 'important');
        toolbox.style.setProperty('opacity', '0', 'important');
        toolbox.style.setProperty('pointer-events', 'none', 'important');
        
        if (urlbar) {
            urlbar.style.setProperty('transition', `transform ${transitionSpeed} ${transitionEasing}, opacity ${transitionSpeed} ${transitionEasing}`, 'important');
            urlbar.style.setProperty('transform', 'rotateX(89.9deg)', 'important');
            urlbar.style.setProperty('opacity', '0', 'important');
            urlbar.style.setProperty('pointer-events', 'none', 'important');
        }
        
        console.log('Navbar hidden');
    }

    function toggleNavbar() {
        if (isVisible) {
            hideNavbar();
        } else {
            showNavbar();
        }
    }

    // Nascondi urlbar all'avvio
    if (urlbar) {
        urlbar.style.setProperty('transition', 'none', 'important');
        urlbar.style.setProperty('transform', 'rotateX(89.9deg)', 'important');
        urlbar.style.setProperty('opacity', '0', 'important');
        urlbar.style.setProperty('pointer-events', 'none', 'important');
    }

    // Listener per F2 ed Esc
    window.addEventListener('keydown', (e) => {
        if (e.key === 'F2') {
            e.preventDefault();
            e.stopPropagation();
            toggleNavbar();
        } else if (e.key === 'Escape' && isVisible) {
            e.preventDefault();
            e.stopPropagation();
            hideNavbar();
        }
    }, true);

        // Listener per click nell'area contenuto browser
    const browser = document.getElementById('browser');
    if (browser) {
        browser.addEventListener('click', (e) => {
            if (isVisible) {
                hideNavbar();
            }
        }, true);
    }

    console.log('Toggle Navbar script loaded - Press F2 to toggle, click outside to close');

})();
