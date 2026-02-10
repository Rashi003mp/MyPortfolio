/**
 * ProjectCards Interaction
 * Simple scroll-based card reveal animation
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

class ProjectCards {
    constructor() {
        this.cards = [];
        this.isInitialized = false;
    }

    /**
     * Initialize project card interactions
     */
    init() {
        if (this.isInitialized) return this;

        this.cards = document.querySelectorAll('.game-card');

        if (this.cards.length === 0) return null;

        this.initScrollReveal();

        this.isInitialized = true;
        console.log('📋 ProjectCards initialized');
        return this;
    }

    /**
     * Simple fade-in animation on scroll
     */
    initScrollReveal() {
        gsap.from(this.cards, {
            scrollTrigger: {
                trigger: '.projects__grid',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power2.out',
            immediateRender: false  // THIS FIXES THE ISSUE - prevents hiding cards before trigger fires
        });
    }

    /**
     * Cleanup
     */
    destroy() {
        this.isInitialized = false;
    }
}

export const projectCards = new ProjectCards();
export default ProjectCards;
