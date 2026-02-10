/**
 * AboutAnimation - Handles technical attribute bar animations
 * Uses Intersection Observer to trigger progress bar fills and number counting
 */

import gsap from 'gsap';

class AboutAnimation {
    constructor() {
        this.section = null;
        this.attributes = [];
        this.observer = null;
        this.isInitialized = false;
    }

    /**
     * Initialize about section animations
     */
    init() {
        if (this.isInitialized) return this;

        this.section = document.querySelector('.section--about');
        this.attributes = document.querySelectorAll('.attribute');

        if (!this.section || this.attributes.length === 0) return null;

        this.createObserver();
        this.observeSection();

        this.isInitialized = true;
        return this;
    }

    /**
     * Create intersection observer
     */
    createObserver() {
        const options = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.2
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.animateAttributes();
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);
    }

    /**
     * Start observing the section
     */
    observeSection() {
        this.observer.observe(this.section);
    }

    /**
     * Animate all attribute bars and values
     */
    animateAttributes() {
        this.attributes.forEach((attr, index) => {
            const fill = attr.querySelector('.attribute__fill');
            const valueDisplay = attr.querySelector('.attribute__value');
            const targetValue = parseInt(valueDisplay.dataset.value) || 0;

            // Animate Bar Fill with staggered delay
            gsap.to(fill, {
                width: `${targetValue}%`,
                duration: 1.5,
                delay: index * 0.1,
                ease: 'power2.out'
            });

            // Animate Numerical Value
            const counter = { val: 0 };
            gsap.to(counter, {
                val: targetValue,
                duration: 1.5,
                delay: index * 0.1,
                ease: 'power2.out',
                onUpdate: () => {
                    valueDisplay.textContent = `${Math.floor(counter.val)}%`;
                }
            });
        });
    }

    /**
     * Cleanup
     */
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.isInitialized = false;
    }
}

export const aboutAnimation = new AboutAnimation();
export default AboutAnimation;
