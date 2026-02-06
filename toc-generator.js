/**
 * TOC Generator für heiEDITIONS Guidelines
 * Erstellt ein Table of Contents und fügt Anker-Links zu Überschriften hinzu
 */

(function() {
    'use strict';

    /**
     * Erstellt einen Anker-Link neben der Überschrift
     */
    function addAnchorLink(heading) {
        const anchor = document.createElement('a');
        
        // Verwende ID aus data-section-id (parent div) oder aus heading selbst
        const targetId = heading.getAttribute('data-section-id') || heading.id;
        
        anchor.href = '#' + targetId;
        anchor.className = 'heading-anchor';
        anchor.innerHTML = '🔗';
        anchor.title = 'Link zu diesem Abschnitt';
        
        heading.appendChild(anchor);
    }

    /**
     * Erstellt das Table of Contents
     */
    function createTOC() {
        // Alle Überschriften finden (h2 bis h4, h1 wird ausgeschlossen)
        const headings = document.querySelectorAll('h2, h3, h4');
        
        if (headings.length === 0) {
            console.warn('Keine Überschriften gefunden, daher wird kein TOC erstellt.');
            return;
        }

        // Nur Überschriften mit parent div ID verarbeiten
        const validHeadings = [];
        headings.forEach(function(heading) {
            // Versuche ID aus parent div zu holen
            const parentDiv = heading.parentElement;
            if (parentDiv && parentDiv.tagName === 'DIV' && parentDiv.id) {
                heading.setAttribute('data-section-id', parentDiv.id);
                addAnchorLink(heading);
                validHeadings.push(heading);
            }
            // Wenn keine parent div ID vorhanden: nichts tun (wird übersprungen)
        });
        
        if (validHeadings.length === 0) {
            console.warn('Keine Überschriften gefunden, die in einem div-Element mit ID stehen.');
            return;
        }

        // TOC-Container erstellen
        const tocContainer = document.createElement('nav');
        tocContainer.id = 'table-of-contents';
        tocContainer.className = 'toc-container';

        // TOC-Überschrift
        const tocHeading = document.createElement('h2');
        tocHeading.textContent = 'Inhalt';
        tocHeading.className = 'toc-heading';
        tocContainer.appendChild(tocHeading);

        // TOC-Liste erstellen
        const tocList = document.createElement('ul');
        tocList.className = 'toc-list';

        let currentLevel = 2; // Startet bei h2
        let currentList = tocList;
        const listStack = [tocList];

        validHeadings.forEach(function(heading) {
            const level = parseInt(heading.tagName.substring(1));
            
            // Ebene anpassen
            while (level > currentLevel) {
                const newList = document.createElement('ul');
                newList.className = 'toc-sublist';
                if (currentList.lastElementChild) {
                    currentList.lastElementChild.appendChild(newList);
                }
                listStack.push(newList);
                currentList = newList;
                currentLevel++;
            }
            
            while (level < currentLevel && listStack.length > 1) {
                listStack.pop();
                currentList = listStack[listStack.length - 1];
                currentLevel--;
            }

            // List-Item erstellen
            const li = document.createElement('li');
            li.className = 'toc-item';

            const link = document.createElement('a');
            
            // Verwende ID aus data-section-id (parent div) oder aus heading selbst
            const targetId = heading.getAttribute('data-section-id') || heading.id;
            
            link.href = '#' + targetId;
            link.textContent = heading.textContent.replace('🔗', '').trim();
            link.className = 'toc-link';

            li.appendChild(link);
            currentList.appendChild(li);
        });

        tocContainer.appendChild(tocList);

        // TOC nach dem ersten h1 einfügen
        const firstH1 = document.querySelector('h1');
        if (firstH1 && firstH1.parentNode) {
            firstH1.parentNode.insertBefore(tocContainer, firstH1.nextSibling);
        } else {
            // Falls kein h1 gefunden, am Anfang des body einfügen
            const contentArea = document.querySelector('main') || document.body;
            contentArea.insertBefore(tocContainer, contentArea.firstChild);
        }

        // Smooth Scrolling für Anker-Links
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // URL aktualisieren
                    if (history.pushState) {
                        history.pushState(null, null, '#' + targetId);
                    }
                }
            });
        });
    }

    // Auf DOMContentLoaded warten
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createTOC);
    } else {
        createTOC();
    }
})();
