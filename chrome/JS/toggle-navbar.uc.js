// ==UserScript==
// @name           Toggle Floating Navbar
// @description    F2 per mostrare/nascondere navbar
// @author         Paolo
// ==/UserScript==

(function() {
    'use strict';
    
    const toolbox = document.getElementById('navigator-toolbox');
    const urlbar = document.getElementById('urlbar');
    let isVisible = false;

    function toggleNavbar() {
        isVisible = !isVisible;
        
        if (isVisible) {
            // Mostra tutto
            toolbox.style.setProperty('transform', 'rotateX(0deg)', 'important');
            toolbox.style.setProperty('opacity', '1', 'important');
            toolbox.style.setProperty('pointer-events', 'auto', 'important');
            
            if (urlbar) {
                urlbar.style.setProperty('transform', 'rotateX(0deg)', 'important');
                urlbar.style.setProperty('opacity', '1', 'important');
                urlbar.style.setProperty('pointer-events', 'auto', 'important');
            }
        } else {
            // Nascondi tutto
            toolbox.style.setProperty('transform', 'rotateX(82deg)', 'important');
            toolbox.style.setProperty('opacity', '0', 'important');
            toolbox.style.setProperty('pointer-events', 'none', 'important');
            
            if (urlbar) {
                urlbar.style.setProperty('transform', 'rotateX(89.9deg)', 'important');
                urlbar.style.setProperty('opacity', '0', 'important');
                urlbar.style.setProperty('pointer-events', 'none', 'important');
            }
        }
        
        console.log('Navbar toggled:', isVisible ? 'visible' : 'hidden');
    }

    // Nascondi all'avvio
    if (urlbar) {
        urlbar.style.setProperty('transform', 'rotateX(89.9deg)', 'important');
        urlbar.style.setProperty('opacity', '0', 'important');
        urlbar.style.setProperty('pointer-events', 'none', 'important');
    }

    // Listener per F2
    window.addEventListener('keydown', (e) => {
        if (e.key === 'F2') {
            e.preventDefault();
            e.stopPropagation();
            toggleNavbar();
        }
    }, true);

    console.log('Toggle Navbar script loaded - Press F2 to toggle');

})();
