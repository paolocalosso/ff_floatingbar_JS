// ==UserScript==
// @name           Toggle Floating Navbar
// @description    F2 per mostrare/nascondere navbar, click fuori per chiudere
// @author         Paolo
// ==/UserScript==

(function() {
    'use strict';
    
    const toolbox = document.getElementById('navigator-toolbox');
    const urlbar = document.getElementById('urlbar');
    let isVisible = true;  // Inizia visibile

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

    // Nascondere il toolbox NON chiude il pannello dei risultati: per Firefox
    // resta logicamente aperto, e da FF157 rimane anche dipinto (fantasma che
    // non risponde ai click). Va chiuso esplicitamente via API.
    function urlbarViewIsOpen() {
        try {
            return !!(window.gURLBar && window.gURLBar.view && window.gURLBar.view.isOpen);
        } catch (e) {
            return false;
        }
    }

    function closeUrlbarView() {
        try {
            if (!window.gURLBar) return;
            if (window.gURLBar.view && window.gURLBar.view.isOpen) {
                window.gURLBar.view.close();
            }
            if (window.gURLBar.focused) {
                window.gURLBar.blur();
            }
        } catch (e) {
            console.error('closeUrlbarView failed:', e);
        }
    }

    // Mostra esplicitamente all'avvio
    setTimeout(() => {
        showNavbar();
    }, 100);

    // Listener per F2 ed Esc
    window.addEventListener('keydown', (e) => {
        if (e.key === 'F2') {
            e.preventDefault();
            e.stopPropagation();
            toggleNavbar();
        } else if (e.key === 'Escape') {
            // Se il pannello risultati e' aperto, la priorita' e' chiuderlo.
            // NON intercettiamo l'evento (niente preventDefault/stopPropagation),
            // altrimenti Firefox non lo riceve e il pannello resta aperto:
            // era questo il motivo per cui Esc nascondeva la barra ma lasciava
            // il pannello dietro.
            if (urlbarViewIsOpen()) {
                closeUrlbarView();
                return;
            }
            if (isVisible) {
                e.preventDefault();
                e.stopPropagation();
                hideNavbar();
            }
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

    // Listener per click fuori dalla toolbar (con esclusione popup addon)
    document.addEventListener('click', (e) => {
        {
            let target = e.target;
            let isInPopup = false;

            // Risali l'albero DOM per vedere se siamo in un elemento da ignorare
            while (target && target !== document.documentElement) {
                // Popup estensioni (hanno questi attributi)
                if (target.id && (
                    target.id.includes('webextension') ||
                    target.id.includes('addon') ||
                    target.id.includes('extension')
                )) {
                    isInPopup = true;
                    break;
                }
                
                // Panel view/popup delle estensioni
                if (target.tagName && (
                    target.tagName.toLowerCase() === 'panel' ||
                    target.tagName.toLowerCase() === 'panelview' ||
                    target.tagName.toLowerCase() === 'menupopup'
                )) {
                    isInPopup = true;
                    break;
                }
                
                // Class che indica popup estensione
                if (target.classList && (
                    target.classList.contains('panel-subview-body') ||
                    target.classList.contains('webextension-popup-browser') ||
                    target.classList.contains('webextension-popup-stack')
                )) {
                    isInPopup = true;
                    break;
                }
                
                target = target.parentElement;
            }
            
            // Chiudi solo se NON sei in un popup E NON sei nel toolbox.
            // NB: la chiusura del pannello va fatta SEMPRE, anche a navbar
            // gia' nascosta: e' il caso in cui prima restava il fantasma
            // incliccabile, perche' il ramo girava solo con isVisible true.
            if (!isInPopup && !toolbox.contains(e.target)) {
                closeUrlbarView();
                if (isVisible) {
                    hideNavbar();
                }
            }
        }
    }, true);

    // MutationObserver per nuove tab
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

        // Mostra navbar quando inizi a scrivere nella urlbar (anche da newtab)
    if (urlbar) {
        urlbar.addEventListener('focus', () => {
            if (!isVisible) {
                console.log('Urlbar focused, showing navbar');
                showNavbar();
            }
        }, true);
    }

    console.log('Toggle Navbar script loaded - Navbar visible at startup, press F2 to toggle, Esc or click outside to close');

})();
