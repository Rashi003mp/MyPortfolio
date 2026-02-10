/**
 * SideNavigation
 * Handles toggle menu, active state tracking and smooth scroll navigation
 */

class SideNavigation {
    constructor() {
        this.nav = null;
        this.navItems = [];
        this.sections = [];
        this.isInitialized = false;
        this.isOpen = false;
        this.activeIndex = 0;
    }

    /**
     * Initialize side navigation
     */
    init() {
        if (this.isInitialized) return this;

        this.nav = document.getElementById('side-nav');
        if (!this.nav) return null;

        this.navItems = Array.from(this.nav.querySelectorAll('.side-nav__item'));
        this.sections = this.navItems.map(item => {
            const sectionId = item.getAttribute('data-section');
            return document.getElementById(sectionId);
        }).filter(Boolean);

        if (this.navItems.length === 0) return null;

        this.initToggle();
        this.initScrollTracking();
        this.initClickHandlers();

        this.isInitialized = true;
        console.log('🧭 SideNavigation initialized');
        return this;
    }

    /**
     * Handle box toggle on click
     */
    initToggle() {
        // Click on the nav box itself to toggle
        this.nav.addEventListener('click', (e) => {
            // If clicking the nav container (not an item), toggle
            if (e.target === this.nav || e.target.tagName !== 'A') {
                if (!this.isOpen) {
                    this.open();
                }
            }
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.nav.contains(e.target)) {
                this.close();
            }
        });
    }

    /**
     * Open navigation menu
     */
    open() {
        this.isOpen = true;
        this.nav.classList.add('is-open');
    }

    /**
     * Close navigation menu
     */
    close() {
        this.isOpen = false;
        this.nav.classList.remove('is-open');
    }

    /**
     * Track scroll position and update active state
     */
    initScrollTracking() {
        let ticking = false;

        const updateActiveSection = () => {
            const scrollPos = window.scrollY + window.innerHeight / 2;

            for (let i = this.sections.length - 1; i >= 0; i--) {
                const section = this.sections[i];
                if (!section) continue;

                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;

                if (scrollPos >= sectionTop && scrollPos <= sectionBottom) {
                    if (this.activeIndex !== i) {
                        this.setActiveItem(i);
                    }
                    break;
                }
            }

            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateActiveSection);
                ticking = true;
            }
        }, { passive: true });

        // Initial check
        updateActiveSection();
    }

    /**
     * Handle smooth scroll on click
     */
    initClickHandlers() {
        this.navItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const section = this.sections[index];
                if (!section) return;

                // Smooth scroll to section
                section.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                this.setActiveItem(index);

                // Close menu after clicking
                setTimeout(() => this.close(), 300);
            });
        });
    }

    /**
     * Set active navigation item
     */
    setActiveItem(index) {
        this.activeIndex = index;

        this.navItems.forEach((item, i) => {
            if (i === index) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    /**
     * Cleanup
     */
    destroy() {
        this.isInitialized = false;
    }
}

export const sideNavigation = new SideNavigation();
export default SideNavigation;
