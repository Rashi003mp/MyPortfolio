/**
 * RollingText - Signature dual-layer rolling character animation
 * Mechanical, precise, controlled — characters roll vertically with color transition
 */

import { gsap } from 'gsap';

class RollingText {
    constructor() {
        this.elements = [];
        this.isInitialized = false;
    }

    /**
     * Initialize rolling text on elements
     */
    init() {
        if (this.isInitialized) return;

        // Find all elements marked for rolling text
        const elements = document.querySelectorAll('[data-rolling-text]');

        elements.forEach((el) => {
            this.prepareElement(el);
        });

        this.isInitialized = true;

        return this;
    }

    /**
     * Prepare a single element for rolling animation
     */
    prepareElement(element) {
        const text = element.textContent.trim();
        const delay = parseFloat(element.dataset.rollingDelay) || 0;
        const stagger = parseFloat(element.dataset.rollingStagger) || 0.03;

        // Clear original content
        element.textContent = '';
        element.classList.add('rolling-text');

        // Create character wrappers
        const chars = text.split('');

        chars.forEach((char, index) => {
            const charWrapper = document.createElement('span');
            charWrapper.className = 'rolling-char';

            // Handle spaces
            if (char === ' ') {
                charWrapper.innerHTML = '&nbsp;';
                charWrapper.classList.add('rolling-char--space');
            } else {
                // Create dual-layer structure
                const currentChar = document.createElement('span');
                currentChar.className = 'rolling-char__current';
                currentChar.textContent = char;

                const nextChar = document.createElement('span');
                nextChar.className = 'rolling-char__next';
                nextChar.textContent = char;

                charWrapper.appendChild(currentChar);
                charWrapper.appendChild(nextChar);
            }

            element.appendChild(charWrapper);
        });

        // Store reference
        this.elements.push({
            element,
            chars: element.querySelectorAll('.rolling-char:not(.rolling-char--space)'),
            delay,
            stagger
        });
    }

    /**
     * Animate element with rolling effect
     */
    animate(element, options = {}) {
        const config = this.elements.find(e => e.element === element);
        if (!config) return;

        const { chars, delay, stagger } = config;
        const duration = options.duration || 0.8;

        // Timeline for precise control
        const tl = gsap.timeline({
            delay: options.delay || delay,
            onComplete: options.onComplete
        });

        chars.forEach((char, index) => {
            const current = char.querySelector('.rolling-char__current');
            const next = char.querySelector('.rolling-char__next');

            // Initial state
            gsap.set(current, { yPercent: 0, color: 'var(--color-text-muted)' });
            gsap.set(next, { yPercent: 100, color: 'var(--color-accent)' });

            // Roll animation
            tl.to(current, {
                yPercent: -100,
                duration: duration,
                ease: 'power3.inOut'
            }, index * stagger);

            tl.to(next, {
                yPercent: 0,
                duration: duration,
                ease: 'power3.inOut'
            }, index * stagger);

            // Color transition on current (fades out as muted)
            tl.to(current, {
                opacity: 0,
                duration: duration * 0.6
            }, index * stagger);
        });

        return tl;
    }

    /**
     * Animate all prepared elements in sequence
     */
    animateAll(options = {}) {
        const masterTl = gsap.timeline(options);

        this.elements.forEach((config, index) => {
            const tl = this.animate(config.element, {
                delay: 0,
                duration: options.duration
            });

            masterTl.add(tl, index * 0.2);
        });

        return masterTl;
    }

    /**
     * Reset element to initial state
     */
    reset(element) {
        const config = this.elements.find(e => e.element === element);
        if (!config) return;

        config.chars.forEach((char) => {
            const current = char.querySelector('.rolling-char__current');
            const next = char.querySelector('.rolling-char__next');

            gsap.set(current, { yPercent: 0, opacity: 1, color: 'var(--color-text-muted)' });
            gsap.set(next, { yPercent: 100, color: 'var(--color-accent)' });
        });
    }

    /**
     * Animate on scroll trigger
     */
    setupScrollTrigger(element, triggerOptions = {}) {
        import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
            gsap.registerPlugin(ScrollTrigger);

            ScrollTrigger.create({
                trigger: element,
                start: 'top 80%',
                once: true,
                ...triggerOptions,
                onEnter: () => {
                    this.animate(element);
                }
            });
        });
    }

    /**
     * Setup scroll triggers for all elements
     */
    setupAllScrollTriggers() {
        this.elements.forEach((config) => {
            const triggerType = config.element.dataset.rollingTrigger;

            if (triggerType !== 'manual') {
                this.setupScrollTrigger(config.element);
            }
        });
    }
}

// Singleton instance
export const rollingText = new RollingText();
export default RollingText;
