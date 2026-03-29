document.addEventListener('DOMContentLoaded', function () {
    try {
        // Hide the iOS Quick Look static fallback since JavaScript works
        const fallback = document.getElementById('quicklook-fallback');
        if (fallback) fallback.style.display = 'none';
        
        // Restore full 3D viewport constraints
        document.body.style.overflow = 'hidden';
        document.body.style.height = '100%';
        document.documentElement.style.height = '100%';
        
        const bookEl = document.getElementById('book');

        if (window.bookConfig) {
            const titleText = window.bookConfig.title || 'Digital Book';
            document.title = titleText;
            try { if (window.top) window.top.document.title = titleText; } catch (e) { }

            if (window.bookConfig.headerText) {
                const logo = document.querySelector('.logo-area');
                if (logo) logo.innerText = window.bookConfig.headerText;
            }

            if (window.bookConfig.favicon) {
                const addFavicon = (doc) => {
                    let link = doc.querySelector("link[rel~='icon']");
                    if (!link) {
                        link = doc.createElement('link');
                        link.rel = 'icon';
                        doc.head.appendChild(link);
                    }
                    link.href = window.bookConfig.favicon;
                };
                addFavicon(document);
                try { if (window.top) addFavicon(window.top.document); } catch (e) { }
            }
        }

        if (window.bookConfig && window.bookConfig.pages) {
            window.bookConfig.pages.forEach(page => {
                const div = document.createElement('div');
                div.className = 'my-page';

                div.style.border = 'none';
                div.style.background = '#1e293b';

                if (page.type === 'cover' || page.type === 'back-cover' || page.type === 'blank-hard') {
                    div.setAttribute('data-density', 'hard');
                }


                let innerContent = `<div class="page-content" style="position: absolute; top:0; left:0; right: 0; bottom: 0; padding: 0; margin: 0; overflow: hidden;">`;

                if (page.src) {
                    innerContent += `<img src="${page.src}" style="position: absolute; top:0; left:0; width: 100%; height: 100%; object-fit: fill; z-index: 1;">`;

                    if (page.type === 'cover' || page.type === 'back-cover') {
                        innerContent += `<div style="position: absolute; top:0; left:0; width: 100%; height: 100%; z-index: 2; box-shadow: inset 3px 0 10px rgba(0,0,0,0.1); pointer-events: none;"></div>`;
                    } else {
                        innerContent += `<div style="position: absolute; top:0; left:0; width: 100%; height: 100%; z-index: 2; box-shadow: inset 0 0 20px rgba(0,0,0,0.03); background-image: linear-gradient(to right, rgba(0,0,0,0.03) 0%, transparent 5%, transparent 95%, rgba(0,0,0,0.03) 100%); pointer-events: none;"></div>`;
                    }
                }

                innerContent += `</div>`;
                div.innerHTML = innerContent;

                bookEl.appendChild(div);
            });
        }

        const pageFlip = new St.PageFlip(
            bookEl,
            {
                width: 445, // base page width
                height: 650, // base page height

                size: "stretch", // Automatically stretch to container size
                minWidth: 300,
                maxWidth: 600,
                minHeight: 400,
                maxHeight: 850,

                showCover: true,       // Hard cover behavior
                mobileScrollSupport: true, // Handle swipe

                // Physics / Animation settings
                flippingTime: 1000,    // Milliseconds per turn
                startZIndex: 0,
                autoSize: true,
                drawShadow: true,
                usePortrait: window.matchMedia("(max-width: 768px)").matches, // Explicitly force 1-page mode tracking for mobile
            }
        );

        // Initialize the book by loading elements with the .my-page class
        pageFlip.loadFromHTML(document.querySelectorAll('.my-page'));

        // --- UI Toolbar Event Listeners ---
        const DOM = {
            btnStart: document.getElementById('btn-start'),
            btnPrev: document.getElementById('btn-prev'),
            btnNext: document.getElementById('btn-next'),
            btnEnd: document.getElementById('btn-end'),
            navLeft: document.querySelector('.nav-prev'),
            navRight: document.querySelector('.nav-next'),
            currentPage: document.getElementById('current-page'),
            totalPages: document.getElementById('total-pages'),
            btnSound: document.getElementById('btn-sound'),
            btnAutoscroll: document.getElementById('btn-autoscroll'),
            btnZoomIn: document.getElementById('btn-zoom-in'),
            btnZoomOut: document.getElementById('btn-zoom-out'),
        };

        const bookContainer = document.querySelector('.book-container');

        // Flawless simultaneous camera pan: bound strictly to target page commitment
        const alignCovers = (targetPage) => {
            // Do not run on mobile devices as they use native 1-page portrait mode
            if (window.matchMedia("(max-width: 768px)").matches) return;

            if (targetPage === 0) {
                bookContainer.classList.add('center-cover');
                bookContainer.classList.remove('center-back-cover');
            } else if (targetPage === pageFlip.getPageCount() - 1 || targetPage === pageFlip.getPageCount() - 2) {
                bookContainer.classList.add('center-back-cover');
                bookContainer.classList.remove('center-cover');
            } else {
                bookContainer.classList.remove('center-cover', 'center-back-cover');
            }
        };

        pageFlip.on('init', (e) => {
            DOM.totalPages.innerText = pageFlip.getPageCount();
            DOM.currentPage.innerText = pageFlip.getCurrentPageIndex() + 1;
            alignCovers(pageFlip.getCurrentPageIndex());
        });

        // Sound Logic
        let soundEnabled = true;

        const defaultSndPath = (window.bookConfig && window.bookConfig.defaultFlipSound) ? window.bookConfig.defaultFlipSound : 'Audio/page-flip-01a.mp3';
        const defaultFlipAudio = new Audio(defaultSndPath);
        
        let globalBgAudio = null;
        if (window.bookConfig && window.bookConfig.globalBackgroundAudio) {
            globalBgAudio = new Audio(window.bookConfig.globalBackgroundAudio);
            globalBgAudio.loop = true;
        }

        let activePageAudio = null;
        let activePageAudioSrc = null;
        
        const pageAudios = {};
        if (window.bookConfig && window.bookConfig.pages) {
            window.bookConfig.pages.forEach((p) => {
                if (p.audio && !pageAudios[p.audio]) {
                    pageAudios[p.audio] = new Audio(p.audio);
                }
            });
        }
        
        const updateAudioState = (pageIndex) => {
            if (!soundEnabled) return;
            const pageDef = window.bookConfig.pages[pageIndex];
            
            // 1. Process Page Specific Audio
            if (pageDef && pageDef.audio) {
                if (activePageAudioSrc !== pageDef.audio) {
                    if (activePageAudio) {
                        activePageAudio.pause();
                        activePageAudio.currentTime = 0;
                    }
                    activePageAudioSrc = pageDef.audio;
                    activePageAudio = pageAudios[pageDef.audio];
                    activePageAudio.play().catch(e => console.log(e));
                } else {
                    // It's the same continuous audio streaming across pages
                    if (activePageAudio && activePageAudio.paused) {
                        activePageAudio.play().catch(e => console.log(e));
                    }
                }
                
                // 2. Global background overlap logic
                if (globalBgAudio) {
                    if (pageDef.overlapGlobalAudio === true) {
                        if (globalBgAudio.paused) globalBgAudio.play().catch(e => {});
                    } else {
                        if (!globalBgAudio.paused) globalBgAudio.pause();
                    }
                }
            } else {
                // No specific audio. Stop specific, resume global.
                if (activePageAudio) {
                    activePageAudio.pause();
                    activePageAudio.currentTime = 0;
                    activePageAudio = null;
                    activePageAudioSrc = null;
                }
                if (globalBgAudio && globalBgAudio.paused) {
                    globalBgAudio.play().catch(e => console.log(e));
                }
            }
        };

        DOM.btnSound.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            const icon = DOM.btnSound.querySelector('i');
            icon.className = soundEnabled ? 'ph ph-speaker-high' : 'ph ph-speaker-slash';

            if (!soundEnabled) {
                if (activePageAudio) activePageAudio.pause();
                if (globalBgAudio) globalBgAudio.pause();
            } else {
                updateAudioState(pageFlip.getCurrentPageIndex());
            }
        });

        // Autoplay bypass logic: Try to start audio on the very first user interaction
        const startInitialAudio = () => {
            if (soundEnabled) {
                updateAudioState(pageFlip.getCurrentPageIndex());
            }
            document.removeEventListener('click', startInitialAudio);
            document.removeEventListener('touchstart', startInitialAudio);
            document.removeEventListener('keydown', startInitialAudio);
        };
        
        // Attach to document to catch the first swipe, click, or tap
        document.addEventListener('click', startInitialAudio);
        document.addEventListener('touchstart', startInitialAudio);
        document.addEventListener('keydown', startInitialAudio);
        setTimeout(startInitialAudio, 500); // Attempt immediately just in case browser allows it

        // Zoom and Gesture Panning Logic
        let currentZoom = 1;
        let panX = 0;
        let panY = 0;
        let isDraggingZoom = false;
        let startX, startY;

        const zoomOverlay = document.createElement('div');
        zoomOverlay.className = 'zoom-overlay';
        bookContainer.appendChild(zoomOverlay);

        const updateZoomState = () => {
            bookContainer.style.setProperty('--zoom', currentZoom);
            if (currentZoom > 1) {
                bookContainer.classList.add('zoomed');
            } else {
                bookContainer.classList.remove('zoomed');
                panX = 0; panY = 0;
                bookContainer.style.setProperty('--pan-x', '0px');
                bookContainer.style.setProperty('--pan-y', '0px');
            }
        };

        DOM.btnZoomIn.addEventListener('click', () => {
            currentZoom = Math.min(currentZoom + 0.2, 3);
            updateZoomState();
        });

        DOM.btnZoomOut.addEventListener('click', () => {
            currentZoom = Math.max(currentZoom - 0.2, 1); // Prevent shrinking below 1x to avoid layout break
            updateZoomState();
        });

        // Mouse Panning
        zoomOverlay.addEventListener('mousedown', (e) => {
            isDraggingZoom = true;
            startX = e.clientX - panX;
            startY = e.clientY - panY;
        });
        window.addEventListener('mousemove', (e) => {
            if (!isDraggingZoom) return;
            panX = e.clientX - startX;
            panY = e.clientY - startY;
            bookContainer.style.setProperty('--pan-x', panX + 'px');
            bookContainer.style.setProperty('--pan-y', panY + 'px');
        });
        window.addEventListener('mouseup', () => {
            isDraggingZoom = false;
        });

        // Touch Panning
        zoomOverlay.addEventListener('touchstart', (e) => {
            isDraggingZoom = true;
            startX = e.touches[0].clientX - panX;
            startY = e.touches[0].clientY - panY;
        });
        window.addEventListener('touchmove', (e) => {
            if (!isDraggingZoom) return;
            e.preventDefault(); // Prevent native mobile scrolling while panning
            panX = e.touches[0].clientX - startX;
            panY = e.touches[0].clientY - startY;
            bookContainer.style.setProperty('--pan-x', panX + 'px');
            bookContainer.style.setProperty('--pan-y', panY + 'px');
        }, { passive: false });
        window.addEventListener('touchend', () => {
            isDraggingZoom = false;
        });

        // Autoscroll Logic
        let autoscrollInterval = null;
        DOM.btnAutoscroll.addEventListener('click', () => {
            const icon = DOM.btnAutoscroll.querySelector('i');
            if (autoscrollInterval) {
                clearInterval(autoscrollInterval);
                autoscrollInterval = null;
                icon.className = 'ph ph-play';
            } else {
                const flipDelay = (window.bookConfig && window.bookConfig.autoFlipDelay) ? window.bookConfig.autoFlipDelay : 3000;
                autoscrollInterval = setInterval(() => {
                    const maxPage = pageFlip.getPageCount() - (pageFlip.getOrientation() === 'landscape' ? 2 : 1);
                    if (pageFlip.getCurrentPageIndex() >= maxPage) {
                        clearInterval(autoscrollInterval);
                        autoscrollInterval = null;
                        icon.className = 'ph ph-play';
                    } else {
                        pageFlip.flipNext();
                    }
                }, flipDelay);
                icon.className = 'ph ph-pause';
            }
        });

        pageFlip.on('flip', (e) => {
            DOM.currentPage.innerText = e.data + 1;
            alignCovers(e.data); // Slides exactly as the dropping animation plays
            
            // Play the physical page turn flap sound (overlapping for rapid flips)
            if (soundEnabled && defaultSndPath) {
                const flipSoundInstance = new Audio(defaultSndPath);
                flipSoundInstance.play().catch(err => {});
            }
            
            // Re-route the background and narration playback based on current page
            updateAudioState(e.data);
        });

        const turnPrev = () => pageFlip.flipPrev();
        const turnNext = () => pageFlip.flipNext();
        const turnStart = () => pageFlip.turnToPage(0);
        const turnEnd = () => pageFlip.turnToPage(pageFlip.getPageCount() - 1);

        DOM.btnPrev.addEventListener('click', turnPrev);
        DOM.navLeft.addEventListener('click', turnPrev);
        DOM.btnNext.addEventListener('click', turnNext);
        DOM.navRight.addEventListener('click', turnNext);
        DOM.btnStart.addEventListener('click', turnStart);
        DOM.btnEnd.addEventListener('click', turnEnd);

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === "ArrowRight") turnNext();
            else if (e.key === "ArrowLeft") turnPrev();
        });

    } catch (error) {
        console.error("PageFlip Initialization Error:", error);
        document.body.innerHTML += `<div style="position: absolute; top:0; left:0; z-index:9999; background: red; color: white; padding: 20px;"><h2>ERROR</h2><p>${error.message}</p><pre>${error.stack}</pre></div>`;
    }
});
