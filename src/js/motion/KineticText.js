/**
 * KineticText - GSAP-powered staggered text entrance animation
 * Splits text into words and animates with eased-in entry
 */

import { gsap } from 'gsap';

class KineticText {
    constructor() {
        this.elements = [];
        this.isInitialized = false;
    }

    /**
     * Initialize kinetic text effect
     */
    init() {
        if (this.isInitialized) return this;

        const elements = document.querySelectorAll('[data-kinetic-text]');
        elements.forEach(el => this.prepareElement(el));

        this.isInitialized = true;
        return this;
    }

    /**
     * Prepare element by splitting into words
     */
    prepareElement(element) {
        const text = element.textContent.trim();
        const words = text.split(/\s+/);

        // Clear and rebuild with word spans
        element.innerHTML = '';
        element.classList.add('kinetic-text');

        words.forEach((word, index) => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'kinetic-word';
            wordSpan.textContent = word;

            // Add space after each word except last
            if (index < words.length - 1) {
                wordSpan.textContent += ' ';
            }

            element.appendChild(wordSpan);
        });

        // Store reference
        this.elements.push({
            element,
            words: element.querySelectorAll('.kinetic-word')
        });

        // Set initial state
        gsap.set(element.querySelectorAll('.kinetic-word'), {
            opacity: 0,
            y: 30,
            rotateX: -15,
            transformOrigin: 'center bottom'
        });
    }

    /**
     * Animate element entrance
     */
    animate(element, options = {}) {
        const config = this.elements.find(e => e.element === element);
        if (!config) return null;

        const defaults = {
            duration: 0.8,
            stagger: 0.08,
            ease: 'power3.out',
            delay: 0
        };

        const settings = { ...defaults, ...options };

        return gsap.to(config.words, {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: settings.duration,
            stagger: settings.stagger,
            ease: settings.ease,
            delay: settings.delay
        });
    }

    /**
     * Animate all prepared elements
     */
    animateAll(options = {}) {
        const masterTl = gsap.timeline();

        this.elements.forEach((config, index) => {
            masterTl.add(
                this.animate(config.element, { delay: 0 }),
                index * 0.15
            );
        });

        return masterTl;
    }

    /**
     * Highlight specific words (for reveal effect)
     */
    highlightWords(element, wordIndices, options = {}) {
        const config = this.elements.find(e => e.element === element);
        if (!config) return;

        const defaults = {
            color: 'var(--color-accent)',
            scale: 1.05,
            duration: 0.3
        };

        const settings = { ...defaults, ...options };

        wordIndices.forEach(index => {
            if (config.words[index]) {
                gsap.to(config.words[index], {
                    color: settings.color,
                    scale: settings.scale,
                    duration: settings.duration,
                    ease: 'power2.out'
                });
            }
        });
    }
}

// Singleton export
export const kineticText = new KineticText();
export default KineticText;
