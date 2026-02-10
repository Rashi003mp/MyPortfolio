/**
 * LazyLoader - Intersection Observer based lazy loading
 * For images, videos, and heavy modules
 */

class LazyLoader {
    constructor() {
        this.observer = null;
        this.loadedElements = new Set();
    }

    /**
     * Initialize lazy loader
     */
    init(options = {}) {
        const defaultOptions = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };

        this.observer = new IntersectionObserver(
            this.handleIntersection.bind(this),
            { ...defaultOptions, ...options }
        );

        // Observe all lazy elements
        this.observe();

        return this;
    }

    /**
     * Observe elements with data-src attribute
     */
    observe() {
        const elements = document.querySelectorAll('[data-src]:not([data-loaded])');

        elements.forEach((el) => {
            this.observer.observe(el);
        });
    }

    /**
     * Handle intersection changes
     */
    handleIntersection(entries) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                this.loadElement(entry.target);
                this.observer.unobserve(entry.target);
            }
        });
    }

    /**
     * Load element content
     */
    loadElement(element) {
        const src = element.dataset.src;
        if (!src || this.loadedElements.has(element)) return;

        const tagName = element.tagName.toLowerCase();

        if (tagName === 'img') {
            this.loadImage(element, src);
        } else if (tagName === 'video') {
            this.loadVideo(element, src);
        } else if (element.classList.contains('project-card__image')) {
            this.loadBackgroundImage(element, src);
        } else {
            // Generic — assume background image
            this.loadBackgroundImage(element, src);
        }

        this.loadedElements.add(element);
        element.setAttribute('data-loaded', 'true');
    }

    /**
     * Load image element
     */
    loadImage(element, src) {
        const img = new Image();

        img.onload = () => {
            element.src = src;
            element.classList.add('is-loaded');
        };

        img.src = src;
    }

    /**
     * Load video element
     */
    loadVideo(element, src) {
        element.src = src;
        element.load();
        element.classList.add('is-loaded');
    }

    /**
     * Load background image
     */
    loadBackgroundImage(element, src) {
        const img = new Image();

        img.onload = () => {
            element.style.backgroundImage = `url(${src})`;
            element.classList.add('is-loaded');
        };

        img.src = src;
    }

    /**
     * Refresh observer (call after DOM updates)
     */
    refresh() {
        this.observe();
    }

    /**
     * Destroy observer
     */
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }

        this.loadedElements.clear();
    }
}

// Singleton instance
export const lazyLoader = new LazyLoader();
export default LazyLoader;
