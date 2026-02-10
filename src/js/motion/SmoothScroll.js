/**
 * SmoothScroll - Lenis smooth scrolling integration
 * Provides buttery smooth scroll with velocity tracking
 */

import Lenis from 'lenis';
import { state } from '../core/StateManager.js';

class SmoothScroll {
    constructor() {
        this.lenis = null;
        this.isEnabled = true;
        this.rafId = null;
        this.velocityThreshold = 0.01;
        this.scrollTimeout = null;
    }

    /**
     * Initialize Lenis smooth scrolling
     */
    init(options = {}) {
        const defaultOptions = {
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
            infinite: false
        };

        this.lenis = new Lenis({
            ...defaultOptions,
            ...options
        });

        // Bind scroll event
        this.lenis.on('scroll', this.onScroll.bind(this));

        // Start animation loop
        this.animate();

        // Expose for GSAP ScrollTrigger
        this.setupScrollTrigger();

        return this;
    }

    /**
     * Animation frame loop
     */
    animate(time) {
        this.lenis?.raf(time);
        this.rafId = requestAnimationFrame(this.animate.bind(this));
    }

    /**
     * Handle scroll events
     */
    onScroll({ scroll, limit, velocity, direction, progress }) {
        // Update state
        state.batch({
            'scroll.position': scroll,
            'scroll.velocity': velocity,
            'scroll.direction': direction,
            'scroll.progress': progress,
            'scroll.isScrolling': Math.abs(velocity) > this.velocityThreshold
        });

        // Clear previous timeout
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
        }

        // Set scrolling to false after scroll stops
        this.scrollTimeout = setTimeout(() => {
            state.set('scroll.isScrolling', false);
        }, 150);
    }

    /**
     * Setup GSAP ScrollTrigger integration
     */
    setupScrollTrigger() {
        // Import GSAP dynamically to avoid issues
        import('gsap').then(({ gsap }) => {
            import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
                gsap.registerPlugin(ScrollTrigger);

                // Connect Lenis to ScrollTrigger
                this.lenis.on('scroll', ScrollTrigger.update);

                // Use Lenis for ScrollTrigger's scroller
                gsap.ticker.add((time) => {
                    this.lenis?.raf(time * 1000);
                });

                // Disable GSAP's default lag smoothing
                gsap.ticker.lagSmoothing(0);
            });
        });
    }

    /**
     * Scroll to target
     */
    scrollTo(target, options = {}) {
        if (!this.lenis) return;

        const defaultOptions = {
            offset: 0,
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            immediate: false,
            lock: false
        };

        this.lenis.scrollTo(target, { ...defaultOptions, ...options });
    }

    /**
     * Stop smooth scrolling
     */
    stop() {
        this.lenis?.stop();
        this.isEnabled = false;
    }

    /**
     * Resume smooth scrolling
     */
    start() {
        this.lenis?.start();
        this.isEnabled = true;
    }

    /**
     * Destroy instance
     */
    destroy() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }

        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
        }

        this.lenis?.destroy();
        this.lenis = null;
    }

    /**
     * Get current scroll position
     */
    get position() {
        return this.lenis?.scroll || 0;
    }

    /**
     * Get scroll velocity
     */
    get velocity() {
        return this.lenis?.velocity || 0;
    }
}

// Singleton instance
export const smoothScroll = new SmoothScroll();
export default SmoothScroll;
