/**
 * ScrollOrchestrator - Master scroll animation controller
 * Coordinates section triggers, parallax, and velocity-based animations
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { state } from '../core/StateManager.js';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

class ScrollOrchestrator {
    constructor() {
        this.triggers = [];
        this.parallaxElements = [];
        this.sections = [];
        this.isInitialized = false;
    }

    /**
     * Initialize scroll orchestration
     */
    init() {
        if (this.isInitialized) return;

        // Collect sections
        this.sections = Array.from(document.querySelectorAll('[data-section]'));

        // Setup animations
        this.setupSectionTriggers();
        this.setupParallax();
        this.setupRevealAnimations();
        this.setupVelocityEffects();

        this.isInitialized = true;

        return this;
    }

    /**
     * Setup section enter/leave triggers
     */
    setupSectionTriggers() {
        this.sections.forEach((section, index) => {
            const sectionName = section.dataset.section;

            const trigger = ScrollTrigger.create({
                trigger: section,
                start: 'top center',
                end: 'bottom center',
                onEnter: () => this.onSectionEnter(sectionName, index),
                onEnterBack: () => this.onSectionEnter(sectionName, index),
                onLeave: () => this.onSectionLeave(sectionName, index),
                onLeaveBack: () => this.onSectionLeave(sectionName, index),
                onUpdate: (self) => this.onSectionProgress(sectionName, self.progress)
            });

            this.triggers.push(trigger);
        });
    }

    /**
     * Handle section enter
     */
    onSectionEnter(sectionName, index) {
        const previous = state.get('section.current');

        state.batch({
            'section.previous': previous,
            'section.current': sectionName,
            'section.index': index,
            'transition.phase': 'entering',
            'transition.from': previous,
            'transition.to': sectionName
        });

        // Update body attribute for CSS styling
        document.body.setAttribute('data-active-section', sectionName);

        // Transition complete
        setTimeout(() => {
            state.set('transition.phase', 'active');
        }, 600);
    }

    /**
     * Handle section leave
     */
    onSectionLeave(sectionName, index) {
        state.set('transition.phase', 'exiting');
    }

    /**
     * Handle section scroll progress
     */
    onSectionProgress(sectionName, progress) {
        if (state.get('section.current') === sectionName) {
            state.set('section.progress', progress);
        }
    }

    /**
     * Setup parallax effects
     */
    setupParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');

        parallaxElements.forEach((element) => {
            const speed = parseFloat(element.dataset.parallax) || 0.3;

            gsap.to(element, {
                yPercent: -100 * speed,
                ease: 'none',
                scrollTrigger: {
                    trigger: element.closest('.section'),
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });

            this.parallaxElements.push(element);
        });
    }

    /**
     * Setup reveal animations
     */
    setupRevealAnimations() {
        // Title reveals
        const titleElements = document.querySelectorAll('[data-animate="title"]');
        titleElements.forEach((el) => {
            gsap.fromTo(el,
                { yPercent: 100, opacity: 0 },
                {
                    yPercent: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: 'expo.out',
                    scrollTrigger: {
                        trigger: el.closest('.section'),
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });

        // Fade reveals
        const fadeElements = document.querySelectorAll('[data-animate="fade"]');
        fadeElements.forEach((el) => {
            gsap.fromTo(el,
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: 'expo.out',
                    delay: 0.2,
                    scrollTrigger: {
                        trigger: el.closest('.section'),
                        start: 'top 75%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });

        // Text reveals with clip-path
        const revealElements = document.querySelectorAll('[data-animate="reveal"]');
        revealElements.forEach((el) => {
            gsap.fromTo(el,
                { clipPath: 'inset(0 100% 0 0)' },
                {
                    clipPath: 'inset(0 0% 0 0)',
                    duration: 1.2,
                    ease: 'expo.inOut',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });

        // Card reveals
        const cardElements = document.querySelectorAll('[data-animate="card"]');
        cardElements.forEach((el, index) => {
            gsap.fromTo(el,
                { y: 60, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: 'expo.out',
                    delay: index * 0.15,
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });

        // Stagger reveals
        const staggerContainers = document.querySelectorAll('[data-animate="stagger"]');
        staggerContainers.forEach((container) => {
            const children = container.children;

            gsap.fromTo(children,
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    ease: 'expo.out',
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: container,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });
    }

    /**
     * Setup velocity-based effects
     */
    setupVelocityEffects() {
        // Subscribe to scroll velocity changes
        state.on('scroll.velocity', (velocity) => {
            // Skew effect based on velocity
            const skewAmount = Math.min(Math.max(velocity * 0.5, -5), 5);

            document.querySelectorAll('[data-velocity-skew]').forEach((el) => {
                gsap.to(el, {
                    skewY: skewAmount,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            // Scale effect based on velocity
            const scaleAmount = 1 + Math.abs(velocity) * 0.02;

            document.querySelectorAll('[data-velocity-scale]').forEach((el) => {
                gsap.to(el, {
                    scale: Math.min(scaleAmount, 1.1),
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });
    }

    /**
     * Refresh all triggers (call after DOM changes)
     */
    refresh() {
        ScrollTrigger.refresh();
    }

    /**
     * Destroy all triggers
     */
    destroy() {
        this.triggers.forEach(trigger => trigger.kill());
        this.triggers = [];
        this.parallaxElements = [];
        this.sections = [];
        this.isInitialized = false;
    }
}

// Singleton instance
export const scrollOrchestrator = new ScrollOrchestrator();
export default ScrollOrchestrator;
