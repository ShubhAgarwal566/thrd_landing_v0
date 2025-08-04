// animations.js - External JavaScript file for THRD Clothing
// This file will be cached by the browser, reducing bandwidth usage

document.addEventListener('DOMContentLoaded', function() {
    const ctaButton = document.querySelector('.cta-button');
    
    // Only proceed if the button exists (defensive programming)
    if (!ctaButton) return;
    
    // Remove pulse animation after first interaction
    ctaButton.addEventListener('mouseenter', function() {
        this.classList.remove('pulse');
    });

    // Add click ripple effect
    ctaButton.addEventListener('click', function(e) {
        const ripple = document.createElement('div');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255,255,255,0.4)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.pointerEvents = 'none';
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });

    // Add touch feedback for mobile devices
    if ('ontouchstart' in window) {
        ctaButton.addEventListener('touchstart', function() {
            this.style.transform = 'translateX(-50%) scale(0.98)';
        });

        ctaButton.addEventListener('touchend', function() {
            this.style.transform = 'translateX(-50%) scale(1)';
        });
    }
});