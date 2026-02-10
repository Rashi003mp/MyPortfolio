/**
 * MagneticCursor - Custom cursor with magnetic interactions
 * Smooth following, hover states, and magnetic pull effects
 */

import { gsap } from 'gsap';
import { state } from '../core/StateManager.js';
import { lerp } from '../motion/Tween.js';

class MagneticCursor {
    constructor() {
        this.cursor = null;
        this.dot = null;
        this.ring = null;
        this.position = { x: 0, y: 0 };
        this.targetPosition = { x: 0, y: 0 };
        this.magneticElements = [];
        this.isHovering = false;
        this.isEnabled = true;
        this.rafId = null;
    }

    /**
     * Initialize cursor
     */
    init() {
        // Check if touch device
        if ('ontouchstart' in window) {
            this.isEnabled = false;
            return null;
        }

        this.cursor = document.getElementById('cursor');
        if (!this.cursor) return null;

        this.dot = this.cursor.querySelector('.cursor__dot');
        this.ring = this.cursor.querySelector('.cursor__ring');

        // Setup event listeners
        this.setupEventListeners();

        // Collect magnetic elements
        this.collectMagneticElements();

        // Start animation loop
        this.animate();

        return this;
    }

    /**
     * Setup mouse event listeners
     */
    setupEventListeners() {
        // Mouse move
        document.addEventListener('mousemove', (e) => {
            this.targetPosition.x = e.clientX;
            this.targetPosition.y = e.clientY;

            // Update state
            state.set('ui.mousePosition', { x: e.clientX, y: e.clientY });
        });

        // Mouse down/up
        document.addEventListener('mousedown', () => {
            this.cursor.classList.add('is-clicking');
        });

        document.addEventListener('mouseup', () => {
            this.cursor.classList.remove('is-clicking');
        });

        // Mouse enter/leave window
        document.addEventListener('mouseenter', () => {
            gsap.to(this.cursor, { opacity: 1, duration: 0.3 });
        });

        document.addEventListener('mouseleave', () => {
            gsap.to(this.cursor, { opacity: 0, duration: 0.3 });
        });
    }

    /**
     * Collect elements with magnetic behavior
     */
    collectMagneticElements() {
        const elements = document.querySelectorAll('[data-magnetic]');

        elements.forEach((el) => {
            const strength = parseFloat(el.dataset.magneticStrength) || 0.3;

            el.addEventListener('mouseenter', () => this.onMagneticEnter(el));
            el.addEventListener('mouseleave', () => this.onMagneticLeave(el));
            el.addEventListener('mousemove', (e) => this.onMagneticMove(e, el, strength));

            this.magneticElements.push({ element: el, strength });
        });

        // Also handle general hover elements
        const hoverElements = document.querySelectorAll('a, button, [data-hover]');

        hoverElements.forEach((el) => {
            el.addEventListener('mouseenter', () => {
                this.cursor.classList.add('is-hovering');
                this.isHovering = true;
            });

            el.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('is-hovering');
                this.isHovering = false;
            });
        });
    }

    /**
     * Handle magnetic element enter
     */
    onMagneticEnter(element) {
        this.cursor.classList.add('is-hovering');
        this.isHovering = true;
    }

    /**
     * Handle magnetic element leave
     */
    onMagneticLeave(element) {
        this.cursor.classList.remove('is-hovering');
        this.isHovering = false;

        // Reset element position
        gsap.to(element, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: 'expo.out'
        });
    }

    /**
     * Handle magnetic movement
     */
    onMagneticMove(e, element, strength) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) * strength;
        const deltaY = (e.clientY - centerY) * strength;

        gsap.to(element, {
            x: deltaX,
            y: deltaY,
            duration: 0.3,
            ease: 'power2.out'
        });
    }

    /**
     * Animation loop for smooth cursor following
     */
    animate() {
        if (!this.isEnabled) return;

        // Smooth interpolation
        this.position.x = lerp(this.position.x, this.targetPosition.x, 0.15);
        this.position.y = lerp(this.position.y, this.targetPosition.y, 0.15);

        // Apply position
        this.dot.style.transform = `translate3d(${this.targetPosition.x}px, ${this.targetPosition.y}px, 0) translate(-50%, -50%)`;
        this.ring.style.transform = `translate3d(${this.position.x}px, ${this.position.y}px, 0) translate(-50%, -50%)`;

        this.rafId = requestAnimationFrame(this.animate.bind(this));
    }

    /**
     * Destroy cursor
     */
    destroy() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }

        this.magneticElements = [];
        this.isEnabled = false;
    }
}

// Singleton instance
export const magneticCursor = new MagneticCursor();
export default MagneticCursor;
