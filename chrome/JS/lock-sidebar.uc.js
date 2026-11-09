// ==UserScript==
// @name           Lock Sidebar Toggle
// @description    Blocco sidebar (scorciatoia F3 disattivata: ora e' della navbar), click fuori per sbloccare
// @author         Paolo
// ==/UserScript==

(function() {
    'use strict';
    
    const sidebarBox = document.getElementById('sidebar-box');
    const root = document.documentElement;
    
    let isLocked = false;

    function lockSidebar() {
        if (!sidebarBox) return;
        
        isLocked = true;
        root.setAttribute('sidebar-locked', 'true');
        
        console.log('✓ Sidebar locked (F3)');
    }

    function unlockSidebar() {
        if (!sidebarBox) return;
        
        isLocked = false;
        root.removeAttribute('sidebar-locked');
        
        console.log('✓ Sidebar unlocked');
    }

    function toggleLock() {
        if (isLocked) {
            unlockSidebar();
        } else {
            lockSidebar();
        }
    }

    // Scorciatoia F3 DISATTIVATA: F3 ora mostra/nasconde la navbar
    // (toggle-navbar.uc.js). Lasciata commentata nel caso serva riassegnarla
    // a un altro tasto.
    /*
    window.addEventListener('keydown', (e) => {
        if (e.key === 'F3') {
            e.preventDefault();
            e.stopPropagation();
            toggleLock();
        }
    }, true);
    */

    // Click fuori dalla sidebar per sbloccare
    document.addEventListener('click', (e) => {
        if (isLocked && sidebarBox) {
            // Se click FUORI dalla sidebar
            if (!sidebarBox.contains(e.target)) {
                unlockSidebar();
                console.log('✓ Click outside sidebar, unlocked');
            }
        }
    }, true);

    console.log('✓ Sidebar lock script loaded - F3 shortcut disabled (used by navbar), click outside to unlock');

})();
