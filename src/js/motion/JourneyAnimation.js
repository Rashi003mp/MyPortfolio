/**
 * JourneyAnimation - Scroll-triggered stage reveals
 * Uses Intersection Observer for performance
 */

class JourneyAnimation {
    constructor() {
        this.stages = [];
        this.observer = null;
        this.isInitialized = false;
    }

    /**
     * Initialize journey animations
     */
    init() {
        if (this.isInitialized) return this;

        this.stages = document.querySelectorAll('.journey-stage');

        if (this.stages.length === 0) {
            console.log('JourneyAnimation: No stages found');
            return null;
        }

        this.createObserver();
        this.observeStages();

        this.isInitialized = true;
        console.log('✨ JourneyAnimation initialized with', this.stages.length, 'stages');
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
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger the reveal based on stage number
                    const stage = entry.target;
                    const stageNum = parseInt(stage.dataset.journeyStage) || 1;
                    const delay = (stageNum - 1) * 150;

                    setTimeout(() => {
                        stage.classList.add('is-visible');
                    }, delay);

                    // Stop observing once revealed
                    this.observer.unobserve(stage);
                }
            });
        }, options);
    }

    /**
     * Start observing all stages
     */
    observeStages() {
        this.stages.forEach(stage => {
            this.observer.observe(stage);
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

export const journeyAnimation = new JourneyAnimation();
export default JourneyAnimation;
