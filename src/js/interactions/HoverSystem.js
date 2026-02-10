/**
 * HoverSystem - Advanced hover state management
 * Link underlines, image effects, text animations
 */

import { gsap } from 'gsap';

class HoverSystem {
    constructor() {
        this.isInitialized = false;
    }

    /**
     * Initialize hover system
     */
    init() {
        if (this.isInitialized) return;

        this.setupLinkHovers();
        this.setupCardHovers();
        this.setupButtonHovers();

        this.isInitialized = true;

        return this;
    }

    /**
     * Setup link hover effects
     */
    setupLinkHovers() {
        const links = document.querySelectorAll('.contact__link, [data-hover="underline"]');

        links.forEach((link) => {
            // Create underline element if not exists
            if (!link.querySelector('.link__underline')) {
                const underline = document.createElement('span');
                underline.className = 'link__underline';
                underline.style.cssText = `
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 1px;
          background-color: currentColor;
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        `;
                link.style.position = 'relative';
                link.appendChild(underline);
            }

            const underline = link.querySelector('.link__underline');

            link.addEventListener('mouseenter', () => {
                underline.style.transformOrigin = 'left';
                underline.style.transform = 'scaleX(1)';
            });

            link.addEventListener('mouseleave', () => {
                underline.style.transformOrigin = 'right';
                underline.style.transform = 'scaleX(0)';
            });
        });
    }

    /**
     * Setup card hover effects
     */
    setupCardHovers() {
        const cards = document.querySelectorAll('.project-card');

        cards.forEach((card) => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / centerY * -5;
                const rotateY = (x - centerX) / centerX * 5;

                gsap.to(card, {
                    rotateX: rotateX,
                    rotateY: rotateY,
                    transformPerspective: 1000,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotateX: 0,
                    rotateY: 0,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            });
        });
    }

    /**
     * Setup button hover effects
     */
    setupButtonHovers() {
        const buttons = document.querySelectorAll('.magnetic-btn');

        buttons.forEach((btn) => {
            const text = btn.querySelector('.magnetic-btn__text');
            const arrow = btn.querySelector('.magnetic-btn__arrow');

            btn.addEventListener('mouseenter', () => {
                if (arrow) {
                    gsap.to(arrow, {
                        x: 5,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            });

            btn.addEventListener('mouseleave', () => {
                if (arrow) {
                    gsap.to(arrow, {
                        x: 0,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            });
        });
    }

    /**
     * Refresh hover listeners (call after DOM updates)
     */
    refresh() {
        this.isInitialized = false;
        this.init();
    }
}

// Singleton instance
export const hoverSystem = new HoverSystem();
export default HoverSystem;
