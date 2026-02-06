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
        } else if (e.ctrlKey && e.key === 't') {
            // Ctrl+T - nuova scheda
            console.log('Ctrl+T detected, showing navbar');
            setTimeout(() => {
                showNavbar();
                // Focus sulla urlbar
                setTimeout(() => {
                    if (urlbar) {
                        urlbar.focus();
                    }
                }, 150);
            }, 50);
        }
    }, true);

    // Listener per click fuori dalla toolbar - versione "safe"
    document.addEventListener('click', (e) => {
        if (isVisible) {
            let target = e.target;
            let isInPopupOrExtension = false;
            
            // Controlla se siamo in toolbox o in qualsiasi popup/panel
            while (target && target !== document.documentElement) {
                // Toolbox stesso
                if (target === toolbox) {
                    return; // Non fare nulla
                }
                
                // Qualsiasi panel o popup
                if (target.tagName && (
                    target.tagName.toLowerCase() === 'panel' ||
                    target.tagName.toLowerCase() === 'panelview' ||
                    target.tagName.toLowerCase() === 'menupopup' ||
                    target.tagName.toLowerCase() === 'tooltip' ||
                    target.tagName.toLowerCase() === 'popupset'
                )) {
                    isInPopupOrExtension = true;
                    break;
                }
                
                target = target.parentElement;
            }
            
            // Chiudi solo se click è sulla PAGINA (browser content)
            if (!isInPopupOrExtension && !toolbox.contains(e.target)) {
                // Verifica che sia davvero nel content della pagina
                const browserContainer = document.getElementById('browser');
                if (browserContainer && browserContainer.contains(e.target)) {
                    hideNavbar();
                }
            }
        }
    }, true);


    // Prova alternativa: usa MutationObserver per monitorare nuove tab
    setTimeout(() => {
        try {
            const tabBrowser = document.getElementById('tabbrowser-tabs');
            if (tabBrowser) {
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.addedNodes.length > 0) {
                            mutation.addedNodes.forEach((node) => {
                                if (node.nodeName === 'tab') {
                                    console.log('New tab detected via MutationObserver, showing navbar');
                                    showNavbar();
                                    setTimeout(() => {
                                        if (urlbar) {
                                            urlbar.focus();
                                        }
                                    }, 100);
                                }
                            });
                        }
                    });
                });
                
                observer.observe(tabBrowser, {
                    childList: true,
                    subtree: true
                });
                
                console.log('Tab observer initialized');
            }
        } catch (e) {
            console.error('Error setting up tab observer:', e);
        }
    }, 1000);

    console.log('Toggle Navbar script loaded - Press F2 to toggle, Esc or click outside to close');

})();
