let _debug = false;
let _speedup = false;
let _pushAdsToEnd = false;
let _skipTo = 0;
let _isPaused = false;
let _autoplay = false;
let _lastUrl = null;
let _playerVisible = true; // Default true since we don't store it
let _userPausedVideo = false; // Track if user intentionally paused the video

// Load settings
chrome.storage.sync.get(['isPaused', 'autoplay'], function (result) {
    _isPaused = result.isPaused || false;
    _autoplay = result.autoplay || false;

    if (_debug) console.log('Settings loaded:', result);

    if (!_isPaused) {
        startObserver();
        warmUp(); // Run initial cleanup
    }
    updatePlayerState();
});

function updatePlayerState() {
    // No longer using custom embed, just handle ad skipping
    if (_debug) console.log('Player state updated, ad blocking:', !_isPaused);
}

function skipVideoAds() {
    if (_isPaused) return;

    // Skip video ads using YouTube's native player
    const video = document.querySelector('video.video-stream');
    if (!video) return;

    // Comprehensive ad detection
    const skipButton = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button');
    const adOverlay = document.querySelector('.ytp-ad-overlay-close-button');

    // More comprehensive ad detection selectors
    const adContainer = document.querySelector('.ad-showing, .ad-interrupting');
    const adBadge = document.querySelector('.ytp-ad-badge, .ytp-ad-player-overlay');
    const adText = document.querySelector('.ytp-ad-text');
    const adModule = document.querySelector('.ytp-ad-module');
    const adPreviewText = document.querySelector('.ytp-ad-preview-text');

    // Check if video element has ad-related classes or if player container shows ad
    const playerAd = document.querySelector('.html5-video-player.ad-showing, .html5-video-player.ad-interrupting');

    // More strict ad detection - require multiple indicators
    const adIndicatorCount = [adContainer, adBadge, adText, adModule, adPreviewText, playerAd].filter(Boolean).length;
    const isAdPlaying = adIndicatorCount >= 2; // Require at least 2 indicators to confirm ad

    if (_debug) console.log('Ad indicators found:', adIndicatorCount, 'Is ad playing:', isAdPlaying);

    // Click skip button if available - this is the most reliable method
    if (skipButton && skipButton.offsetParent !== null) {
        skipButton.click();
        if (_debug) console.log('Clicked skip button');
        // After clicking skip, restore normal playback immediately
        if (video.playbackRate !== 1) {
            video.playbackRate = 1;
        }
        if (video.muted) {
            video.muted = false;
        }
        return; // Exit after clicking skip button
    }

    // Close overlay ads
    if (adOverlay && adOverlay.offsetParent !== null) {
        adOverlay.click();
        if (_debug) console.log('Closed overlay ad');
    }

    if (isAdPlaying && video) {
        // First try to click any available skip button (including countdown ones)
        const allSkipButtons = document.querySelectorAll('[class*="ytp-ad-skip"], [class*="ytp-skip"], .ytp-ad-skip-button-container button, .ytp-skip-ad-button');
        for (const button of allSkipButtons) {
            if (button && button.offsetParent !== null) { // Check if visible
                button.click();
                if (_debug) console.log('Clicked alternative skip button');
                // Restore normal playback after clicking skip
                if (video.playbackRate !== 1) {
                    video.playbackRate = 1;
                }
                if (video.muted) {
                    video.muted = false;
                }
                return;
            }
        }

        // Enhanced mid-roll ad skip strategy
        // Store the current time before ad to resume properly
        const currentTime = video.currentTime;

        // For mid-roll ads that cause black screens, we need a different approach
        // Instead of jumping to end, speed through the ad
        video.muted = true;
        video.playbackRate = 16; // Maximum speed

        // Try to trigger play if video is paused (happens after ad interruption)
        if (video.paused) {
            video.play().catch(e => {
                if (_debug) console.log('Could not play ad video:', e);
            });
        }

        if (_debug) console.log('Ad detected - speeding through at 16x, current time:', currentTime);
    } else {
        // No ad detected, restore normal playback settings
        // Always restore playback rate to 1 when no ad is detected
        if (video.playbackRate !== 1) {
            video.playbackRate = 1;
            if (_debug) console.log('Restored normal playback rate');
        }

        // Always unmute when no ad is detected
        if (video.muted) {
            video.muted = false;
            if (_debug) console.log('Unmuted video after ad');
        }

        // DO NOT auto-play the video after ad skip - let user control playback
        // The video will naturally resume if it was playing before the ad
    }
}

function handleVideoAds() {
    if (_isPaused) return;

    // Handle pre-roll and mid-roll ads
    const adBadge = document.querySelector('.ytp-ad-badge');
    const adText = document.querySelector('.ytp-ad-text');
    const adPreview = document.querySelector('.ytp-ad-preview-container');
    const adPlayer = document.querySelector('.ytp-ad-player-overlay');

    if (adBadge || adText || adPreview || adPlayer) {
        skipVideoAds();
    }
}

function removeVideoAdElements() {
    if (_isPaused) return;

    // Remove ad containers
    const adContainers = [
        '.ytp-ad-module',
        '.ytp-ad-player-overlay',
        '.ytp-ad-image-overlay',
        '.video-ads',
        'ytd-promoted-sparkles-web-renderer',
        'ytd-companion-slot-renderer',
        'ytd-merch-shelf-renderer',
        '.ytp-ad-overlay-container',
        '.ytp-ad-text-overlay'
    ];

    adContainers.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.style.display = 'none';
            if (_debug) console.log('Hidden ad container:', selector);
        });
    });
}

function checkUrlChange() {
    if (_isPaused) return;
    const currentUrl = window.location.href;
    if (currentUrl !== _lastUrl || _lastUrl === null) {
        _lastUrl = currentUrl;
        // Re-run ad removal on page change
        setTimeout(() => {
            warmUp();
            skipVideoAds();
        }, 1000);
    }
}

setInterval(checkUrlChange, 1000);
setInterval(handleVideoAds, 200); // More frequent check for faster ad detection
setInterval(removeVideoAdElements, 2000);
setInterval(skipVideoAds, 200); // More frequent check for mid-roll ads

// -------------- Ad Removal + Warmup --------------
function removeAds() {
    const adSelectors = [
        'ytd-ad-slot-renderer',
        'ytd-banner-promo-renderer',
        'ytd-player-legacy-desktop-watch-ads-renderer',
        'ytd-action-companion-ad-renderer',
        'ytd-in-feed-ad-layout-renderer',
        'ytd-promoted-sparkles-text-search-renderer',
        'ytd-rich-item-renderer:has(ytd-display-ad-renderer)'
    ];

    for (const selector of adSelectors) {
        const adElements = document.querySelectorAll(selector);
        if (_debug) console.log('Found', adElements.length, 'ads matching', selector);

        adElements.forEach(el => {
            // Find the specific parent ytd-rich-item-renderer within ytd-rich-grid-renderer
            const richParent = el.closest('ytd-rich-item-renderer.style-scope.ytd-rich-grid-renderer');
            if (richParent) {
                if (_debug) console.log('Removing parent ytd-rich-item-renderer:', richParent);
                richParent.remove();
                return;
            }

            // Find the parent ytd-reel-video-renderer
            const reelParent = el.closest('ytd-reel-video-renderer');
            if (reelParent) {
                if (_debug) console.log('Removing parent ytd-reel-video-renderer:', reelParent);
                reelParent.style.display = 'none';
                return;
            }

            // If no specific parent found, remove the ad element itself
            if (_debug) console.log('Removing ad:', el);
            el.remove();
        });
    }

    // Special case for top-row home ad
    const topAd = document.querySelector('ytd-ad-slot-renderer');
    if (topAd) {
        const topAdParent = topAd.closest('ytd-reel-video-renderer') ||
                            topAd.closest('ytd-rich-item-renderer.style-scope.ytd-rich-grid-renderer');
        if (topAdParent) {
            if (_debug) console.log('Removing top-row ad parent:', topAdParent);
            topAdParent.remove();
        } else {
            if (_debug) console.log('Removing top-row ad directly:', topAd);
            topAd.remove();
        }
    }

    // Remove Engagement Panel Ads
    const adsEngagementPanel = document.querySelector('ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"]');
    if (adsEngagementPanel) {
        if (_debug) console.log('Removing ytd-engagement-panel-section-list-renderer with target-id="engagement-panel-ads":', adsEngagementPanel);
        adsEngagementPanel.remove();
    }
}

function removePromoPopups() {
    const popups = document.querySelectorAll('.yt-mealbar-promo-renderer, .ytmusic-mealbar-promo-renderer, tp-yt-paper-dialog');
    if (_debug) console.log('Found', popups.length, 'promo popups');
    popups.forEach(popup => {
        const dismissButton = popup.querySelector('#dismiss-button, .dismiss-button, .yt-spec-button-shape-next--mono');
        if (dismissButton) {
            if (_debug) console.log('Removing popup:', popup);
            dismissButton.click();
        } else {
            // Force close popup if no button found
            popup.style.display = 'none';
            if (_debug) console.log('Force hidden popup:', popup);
        }
    });
}

function warmUp() {
    if (_debug) console.log('Running warm-up functions...');
    removeAds();
    removePromoPopups();
    removeVideoAdElements();
}

// -------------- Mutation Observer Logic --------------
function handleMutations(mutationsList, observer) {
    if (_isPaused) {
        if (_debug) console.log('Observer is paused. Not handling mutations.');
        return;
    }

    for (const mutation of mutationsList) {
        for (const node of mutation.addedNodes) {
            if (node.nodeType === 1) { // element node
                if (node.matches && node.matches('[class*="ad-slot-renderer"], [class*="banner-promo-renderer"], [class*="ad-layout"]')) {
                    removeAds();
                } else if (node.matches && node.matches('.yt-mealbar-promo-renderer, .ytmusic-mealbar-promo-renderer, tp-yt-paper-dialog')) {
                    removePromoPopups();
                } else if (node.matches && node.matches('.ytp-ad-module, .ytp-ad-player-overlay')) {
                    skipVideoAds();
                }
            }
        }
    }
}

function startObserver() {
    if (_debug) console.log('Starting MutationObserver...');
    const observer = new MutationObserver(handleMutations);
    observer.observe(document.body, { childList: true, subtree: true });
}

// -------------- Message Handling --------------
chrome.runtime.onMessage.addListener(function (request) {
    if (_debug) console.log('Received message:', request);

    if (request.message === 'updateObserver') {
        window.location.reload();
    } else if (request.message === 'updateAutoplay') {
        _autoplay = request.autoplay;
        // Auto-play handled by native YouTube now
    } else if (request.message === 'toggleEmbed') {
        _playerVisible = request.visible;
        updatePlayerState();
    }
});

// -------------- Keyboard Shortcut --------------
document.addEventListener('keydown', function (event) {
    // Shortcut: Ctrl + B
    if (event.ctrlKey && event.code === 'KeyB') {
        _playerVisible = !_playerVisible; // Toggle visibility
        updatePlayerState();
        if (_debug) console.log(`Player visibility toggled: ${_playerVisible}`);
    }
});

// -------------- Extra: "Next" Button by the Title --------------
function addNextButtonNextToTitle() {
    const titleElement = document.querySelector("#title h1.style-scope.ytd-watch-metadata");

    if (!titleElement) {
        if (_debug) console.log("Title element not found!");
        return;
    }

    const existingButton = document.querySelector("#custom-next-button");
    if (existingButton) {
        if (_debug) console.log("Next button already exists!");
        return;
    }

    // Create new "Next" button
    const nextButton = document.createElement('button');
    nextButton.id = "custom-next-button";
    nextButton.textContent = "Next";
    nextButton.style.marginLeft = "10px";
    nextButton.style.cursor = "pointer";
    nextButton.style.padding = "5px 10px";
    nextButton.style.border = "none";
    nextButton.style.backgroundColor = "#cc0000";
    nextButton.style.color = "#fff";
    nextButton.style.borderRadius = "4px";
    nextButton.style.fontSize = "14px";
    nextButton.style.alignSelf = "center";

    // Wire the new button to the original YouTube "Next" control
    const originalNextButton = document.querySelector('.ytp-next-button.ytp-button');
    if (originalNextButton) {
        nextButton.addEventListener('click', () => {
            originalNextButton.click();
        });
    } else {
        if (_debug) console.log("Original 'Next' button not found!");
    }

    // Insert the button next to the title
    const parentContainer = titleElement.parentNode;
    if (parentContainer) {
        parentContainer.style.display = "flex";
        parentContainer.style.alignItems = "center";
        parentContainer.insertBefore(nextButton, titleElement.nextSibling);
    } else {
        if (_debug) console.log("Title's parent container not found!");
    }
}

// Repeatedly attempt to add the "Next" button until it succeeds
const intervalId = setInterval(() => {
    addNextButtonNextToTitle();
    if (document.querySelector("#custom-next-button")) {
        clearInterval(intervalId);
    }
}, 1000);