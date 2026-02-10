/**
 * PortalMask - Cursor-following SVG mask with layered text reveal
 * High-performance 60fps implementation using rAF
 */

import { gsap } from 'gsap';

class PortalMask {
    constructor() {
        this.container = null;
        this.mask = null;
        this.maskPath = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.currentX = 0;
        this.currentY = 0;
        this.isActive = false;
        this.rafId = null;
        this.lerp = 0.12; // Smooth following
    }

    /**
     * Initialize the portal mask effect
     */
    init(containerSelector = '.portal-text') {
        this.container = document.querySelector(containerSelector);
        if (!this.container) return null;

        this.createMaskSVG();
        this.setupLayers();
        this.bindEvents();
        this.startLoop();

        this.isActive = true;
        return this;
    }

    /**
     * Create the SVG mask with organic blob shape
     */
    createMaskSVG() {
        // Create SVG element for the clip mask
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'portal-mask-svg');
        svg.setAttribute('width', '0');
        svg.setAttribute('height', '0');
        svg.style.position = 'absolute';
        svg.style.pointerEvents = 'none';

        // Create clipPath with organic blob shape
        const clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
        clipPath.setAttribute('id', 'portal-clip');

        // Organic blob path - fluid squiggle shape
        this.maskPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.maskPath.setAttribute('d', this.generateBlobPath(0, 0, 80));

        clipPath.appendChild(this.maskPath);
        svg.appendChild(clipPath);
        document.body.appendChild(svg);

        this.mask = svg;
    }

    /**
     * Generate organic blob SVG path
     */
    generateBlobPath(cx, cy, radius) {
        const points = 8;
        const angleStep = (Math.PI * 2) / points;
        let path = '';

        for (let i = 0; i <= points; i++) {
            const angle = i * angleStep;
            const variation = 0.7 + Math.random() * 0.6; // Organic variation
            const r = radius * variation;
            const x = cx + Math.cos(angle) * r;
            const y = cy + Math.sin(angle) * r;

            if (i === 0) {
                path = `M ${x} ${y}`;
            } else {
                // Use quadratic curves for smooth organic shape
                const prevAngle = (i - 0.5) * angleStep;
                const cpR = radius * (0.8 + Math.random() * 0.4);
                const cpX = cx + Math.cos(prevAngle) * cpR;
                const cpY = cy + Math.sin(prevAngle) * cpR;
                path += ` Q ${cpX} ${cpY} ${x} ${y}`;
            }
        }

        return path + ' Z';
    }

    /**
     * Setup the layered text structure
     */
    setupLayers() {
        const textContent = this.container.querySelector('.portal-text__content');
        if (!textContent) return;

        // Layer A is already in DOM (visible text)
        // Layer B (reveal layer) needs the clip-path
        const revealLayer = this.container.querySelector('.portal-text__reveal');
        if (revealLayer) {
            revealLayer.style.clipPath = 'url(#portal-clip)';
        }
    }

    /**
     * Bind mouse/touch events
     */
    bindEvents() {
        this.container.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.container.addEventListener('mouseenter', this.onMouseEnter.bind(this));
        this.container.addEventListener('mouseleave', this.onMouseLeave.bind(this));

        // Touch support
        this.container.addEventListener('touchmove', this.onTouchMove.bind(this));
    }

    /**
     * Handle mouse movement
     */
    onMouseMove(e) {
        const rect = this.container.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
    }

    /**
     * Handle touch movement
     */
    onTouchMove(e) {
        if (e.touches.length > 0) {
            const rect = this.container.getBoundingClientRect();
            this.mouseX = e.touches[0].clientX - rect.left;
            this.mouseY = e.touches[0].clientY - rect.top;
        }
    }

    /**
     * Handle mouse enter - expand mask
     */
    onMouseEnter() {
        gsap.to(this, {
            lerp: 0.15,
            duration: 0.3,
            ease: 'power2.out'
        });
    }

    /**
     * Handle mouse leave - contract mask
     */
    onMouseLeave() {
        gsap.to(this, {
            lerp: 0.08,
            duration: 0.5,
            ease: 'power2.out'
        });
    }

    /**
     * Main animation loop - 60fps optimized
     */
    startLoop() {
        const animate = () => {
            // Smooth interpolation for buttery movement
            this.currentX += (this.mouseX - this.currentX) * this.lerp;
            this.currentY += (this.mouseY - this.currentY) * this.lerp;

            // Update mask position
            this.updateMaskPosition();

            this.rafId = requestAnimationFrame(animate);
        };

        this.rafId = requestAnimationFrame(animate);
    }

    /**
     * Update the SVG mask position
     */
    updateMaskPosition() {
        if (!this.maskPath) return;

        // Generate new blob at current position with slight animation
        const time = performance.now() * 0.001;
        const breathe = Math.sin(time * 2) * 5 + 80; // Breathing effect

        this.maskPath.setAttribute('d', this.generateAnimatedBlobPath(
            this.currentX,
            this.currentY,
            breathe,
            time
        ));
    }

    /**
     * Generate animated blob path with time-based distortion
     */
    generateAnimatedBlobPath(cx, cy, radius, time) {
        const points = 8;
        const angleStep = (Math.PI * 2) / points;
        let path = '';

        for (let i = 0; i <= points; i++) {
            const angle = i * angleStep;
            // Organic noise-like variation
            const noise = Math.sin(time * 1.5 + i * 0.8) * 0.15;
            const variation = 0.85 + noise;
            const r = radius * variation;
            const x = cx + Math.cos(angle) * r;
            const y = cy + Math.sin(angle) * r;

            if (i === 0) {
                path = `M ${x} ${y}`;
            } else {
                const prevAngle = (i - 0.5) * angleStep;
                const cpNoise = Math.sin(time * 1.2 + i * 1.1) * 0.1;
                const cpR = radius * (0.9 + cpNoise);
                const cpX = cx + Math.cos(prevAngle) * cpR;
                const cpY = cy + Math.sin(prevAngle) * cpR;
                path += ` Q ${cpX} ${cpY} ${x} ${y}`;
            }
        }

        return path + ' Z';
    }

    /**
     * Destroy and cleanup
     */
    destroy() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }

        if (this.mask && this.mask.parentNode) {
            this.mask.parentNode.removeChild(this.mask);
        }

        this.isActive = false;
    }
}

// Singleton export
export const portalMask = new PortalMask();
export default PortalMask;
