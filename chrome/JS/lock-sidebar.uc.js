// ==UserScript==
// @name           Lock Sidebar Toggle
// @description    F3 per bloccare/sbloccare sidebar, click fuori per sbloccare
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

    // Listener per F3 - Toggle
    window.addEventListener('keydown', (e) => {
        if (e.key === 'F3') {
            e.preventDefault();
            e.stopPropagation();
            toggleLock();
        }
    }, true);

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

    console.log('✓ Sidebar lock script loaded - F3 to toggle, click outside to unlock');

})();
