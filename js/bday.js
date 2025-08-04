// animations.js - External JavaScript file for THRD Clothing
// This file will be cached by the browser, reducing bandwidth usage

document.addEventListener('DOMContentLoaded', function() {
    // Create grid pattern
    const gridPattern = document.getElementById('gridPattern');
    for (let i = 0; i < 64; i++) {
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item';
        gridPattern.appendChild(gridItem);
    }
    
    // Font loading check
    document.fonts.ready.then(() => {
        // Check if the font is loaded
        if (document.fonts.check('italic 700 1em SplineSansMono')) {
            document.body.classList.remove('font-not-loaded');
        }
    });
});