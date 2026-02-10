/**
 * SpotlightReveal - Cursor-driven spotlight mask with content reveal
 * Premium, liquid motion with soft edges
 */

import { gsap } from 'gsap';

class SpotlightReveal {
    constructor() {
        this.container = null;
        this.surfaceLayer = null;
        this.revealLayer = null;
        this.spotlightMask = null;

        // Cursor tracking
        this.mouseX = 0;
        this.mouseY = 0;
        this.currentX = 0;
        this.currentY = 0;

        // Settings
        this.lerp = 0.1; // Liquid movement
        this.spotlightRadius = 180;
        this.isActive = false;
        this.rafId = null;
    }

    /**
     * Initialize the spotlight reveal system
     */
    init(containerSelector = '.spotlight-hero') {
        this.container = document.querySelector(containerSelector);
        if (!this.container) return null;

        this.surfaceLayer = this.container.querySelector('.spotlight-hero__surface');
        this.revealLayer = this.container.querySelector('.spotlight-hero__reveal');

        if (!this.surfaceLayer || !this.revealLayer) {
            console.warn('SpotlightReveal: Missing required layers');
            return null;
        }

        this.createSpotlightMask();
        this.bindEvents();
        this.startLoop();

        this.isActive = true;
        console.log('✨ SpotlightReveal initialized');
        return this;
    }

    /**
     * Create SVG mask with soft radial gradient
     */
    createSpotlightMask() {
        // Create SVG with soft-edge radial gradient mask
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'spotlight-mask-svg');
        svg.setAttribute('width', '0');
        svg.setAttribute('height', '0');
        svg.style.position = 'absolute';
        svg.style.pointerEvents = 'none';

        // Define the mask with radial gradient for soft edges
        svg.innerHTML = `
            <defs>
                <radialGradient id="spotlight-gradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="white" stop-opacity="1"/>
                    <stop offset="60%" stop-color="white" stop-opacity="1"/>
                    <stop offset="100%" stop-color="white" stop-opacity="0"/>
                </radialGradient>
                <mask id="spotlight-mask">
                    <rect width="100%" height="100%" fill="black"/>
                    <circle id="spotlight-circle" cx="0" cy="0" r="${this.spotlightRadius}" fill="url(#spotlight-gradient)"/>
                </mask>
            </defs>
        `;

        document.body.appendChild(svg);
        this.spotlightMask = svg;
        this.spotlightCircle = svg.querySelector('#spotlight-circle');

        // Apply mask to reveal layer
        this.revealLayer.style.maskImage = 'url(#spotlight-mask)';
        this.revealLayer.style.webkitMaskImage = 'url(#spotlight-mask)';
    }

    /**
     * Bind mouse/touch events
     */
    bindEvents() {
        this.container.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.container.addEventListener('mouseenter', this.onMouseEnter.bind(this));
        this.container.addEventListener('mouseleave', this.onMouseLeave.bind(this));
        this.container.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: true });
    }

    onMouseMove(e) {
        const rect = this.container.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
    }

    onTouchMove(e) {
        if (e.touches.length > 0) {
            const rect = this.container.getBoundingClientRect();
            this.mouseX = e.touches[0].clientX - rect.left;
            this.mouseY = e.touches[0].clientY - rect.top;
        }
    }

    onMouseEnter() {
        gsap.to(this, {
            spotlightRadius: 200,
            duration: 0.5,
            ease: 'power2.out',
            onUpdate: () => this.updateRadius()
        });
    }

    onMouseLeave() {
        gsap.to(this, {
            spotlightRadius: 150,
            duration: 0.5,
            ease: 'power2.out',
            onUpdate: () => this.updateRadius()
        });
    }

    updateRadius() {
        if (this.spotlightCircle) {
            this.spotlightCircle.setAttribute('r', this.spotlightRadius);
        }
    }

    /**
     * Animation loop - 60fps optimized
     */
    startLoop() {
        const animate = () => {
            // Smooth interpolation for liquid movement
            this.currentX += (this.mouseX - this.currentX) * this.lerp;
            this.currentY += (this.mouseY - this.currentY) * this.lerp;

            // Update spotlight position
            this.updateSpotlightPosition();

            this.rafId = requestAnimationFrame(animate);
        };

        this.rafId = requestAnimationFrame(animate);
    }

    /**
     * Update the spotlight mask position
     */
    updateSpotlightPosition() {
        if (!this.spotlightCircle) return;

        this.spotlightCircle.setAttribute('cx', this.currentX);
        this.spotlightCircle.setAttribute('cy', this.currentY);

        // Also update CSS custom properties for glow effects
        this.container.style.setProperty('--spotlight-x', `${this.currentX}px`);
        this.container.style.setProperty('--spotlight-y', `${this.currentY}px`);
    }

    /**
     * Cleanup
     */
    destroy() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
        if (this.spotlightMask && this.spotlightMask.parentNode) {
            this.spotlightMask.parentNode.removeChild(this.spotlightMask);
        }
        this.isActive = false;
    }
}

export const spotlightReveal = new SpotlightReveal();
export default SpotlightReveal;
