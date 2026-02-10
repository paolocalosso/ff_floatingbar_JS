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
    let dragStartTime = 0;
    let isDragging = false;

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
        isDragging = true;
        root.setAttribute('tab-dragging', 'true');
        console.log('✓ Drag detected, sidebar locked');
    }

    function disableDragLock() {
        // Calcola durata del drag
        const dragDuration = Date.now() - dragStartTime;
        
        // Ignora drag troppo brevi (< 100ms = probabilmente click accidentale)
        if (dragDuration < 100) {
            console.log('✗ Drag too short, ignored');
            root.removeAttribute('tab-dragging');
            isDragging = false;
            return;
        }
        
        // Usa timeout per evitare flickering
        if (dragTimeout) clearTimeout(dragTimeout);
        dragTimeout = setTimeout(() => {
            root.removeAttribute('tab-dragging');
            isDragging = false;
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

    // Monitora eventi drag a livello window
    window.addEventListener('dragstart', (e) => {
        dragStartTime = Date.now();
        
        // Ignora se già in drag (evita trigger multipli)
        if (isDragging) {
            console.log('Already dragging, ignoring duplicate event');
            return;
        }
        
        console.log('dragstart event, target:', e.target.localName);
        
        // Ritardo breve per verificare che sia un drag vero
        setTimeout(() => {
            // Verifica che il drag sia ancora attivo dopo 50ms
            if (Date.now() - dragStartTime >= 50) {
                enableDragLock();
            }
        }, 50);
    }, true);

    window.addEventListener('dragend', (e) => {
        console.log('dragend event');
        if (isDragging) {
            disableDragLock();
        }
    }, true);

    window.addEventListener('drop', (e) => {
        console.log('drop event');
        if (isDragging) {
            disableDragLock();
        }
    }, true);

    // Fallback: se il drag si "perde" (bug), sblocca dopo 5 secondi
    setInterval(() => {
        if (isDragging && Date.now() - dragStartTime > 5000) {
            console.log('⚠ Drag timeout, force unlock');
            root.removeAttribute('tab-dragging');
            isDragging = false;
        }
    }, 1000);

    console.log('✓ Sidebar lock script loaded - F3 to toggle, drag events monitored');

})();
