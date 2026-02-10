// ==UserScript==
// @name           Lock Sidebar on Drag
// @description    F3 per bloccare/sbloccare sidebar durante drag tab
// @author         Paolo
// ==/UserScript==

(function() {
    'use strict';
    
    const sidebarBox = document.getElementById('sidebar-box');
    const root = document.documentElement;
    
    let isManuallyLocked = false;
    let dragTimeout = null;

    function lockSidebar() {
        if (!sidebarBox) return;
        
        isManuallyLocked = true;
        root.setAttribute('sidebar-locked', 'true');
        
        console.log('✓ Sidebar locked manually (F3)');
    }

    function unlockSidebar() {
        if (!sidebarBox) return;
        
        isManuallyLocked = false;
        root.removeAttribute('sidebar-locked');
        
        console.log('✓ Sidebar unlocked (F3)');
    }

    function toggleLock() {
        if (isManuallyLocked) {
            unlockSidebar();
        } else {
            lockSidebar();
        }
    }

    function enableDragLock() {
        root.setAttribute('tab-dragging', 'true');
        console.log('✓ Drag detected, sidebar locked');
    }

    function disableDragLock() {
        // Usa timeout per evitare flickering
        if (dragTimeout) clearTimeout(dragTimeout);
        dragTimeout = setTimeout(() => {
            root.removeAttribute('tab-dragging');
            console.log('✓ Drag ended, sidebar unlocked');
        }, 300);
    }

    // Listener per F3 (toggle manuale)
    window.addEventListener('keydown', (e) => {
        if (e.key === 'F3') {
            e.preventDefault();
            e.stopPropagation();
            toggleLock();
        }
    }, true);

    // Monitora eventi drag a livello window - QUALSIASI drag
    window.addEventListener('dragstart', (e) => {
        console.log('dragstart event, target:', e.target.localName, e.target.className);
        // Blocca SEMPRE durante qualsiasi drag (troppo aggressivo ma funzionale)
        enableDragLock();
    }, true);

    window.addEventListener('dragend', (e) => {
        console.log('dragend event');
        disableDragLock();
    }, true);

    window.addEventListener('drop', (e) => {
        console.log('drop event');
        disableDragLock();
    }, true);

    console.log('✓ Sidebar lock script loaded - F3 to toggle, drag events monitored');

})();
