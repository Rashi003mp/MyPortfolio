/**
 * Main Application Entry Point
 * Orchestrates initialization of all systems
 */

// Core
import { state } from './core/StateManager.js';
import { deviceCapability } from './core/DeviceCapability.js';

// Motion
import { smoothScroll } from './motion/SmoothScroll.js';
import { scrollOrchestrator } from './motion/ScrollOrchestrator.js';
import { kineticText } from './motion/KineticText.js';
import { journeyAnimation } from './motion/JourneyAnimation.js';
import { aboutAnimation } from './motion/AboutAnimation.js';

// WebGL
import { sceneManager } from './webgl/SceneManager.js';
import { backgroundShader } from './webgl/BackgroundShader.js';

// Interactions
import { magneticCursor } from './interactions/MagneticCursor.js';
import { hoverSystem } from './interactions/HoverSystem.js';
import { preloader } from './interactions/Preloader.js';
import { projectCards } from './interactions/ProjectCards.js';
import { sideNavigation } from './interactions/SideNavigation.js';
import { contactForm } from './interactions/ContactForm.js';

// Utils
import { lazyLoader } from './utils/LazyLoader.js';

class App {
    constructor() {
        this.isInitialized = false;
    }

    /**
     * Initialize the application
     */
    async init() {
        console.log('🚀 Initializing Portfolio...');

        // Detect device capabilities
        const capabilities = deviceCapability.detect();
        console.log('📱 Device capabilities:', capabilities);

        // Update state with device info
        state.batch({
            'device.isMobile': capabilities.isMobile,
            'device.isTouch': capabilities.isTouch,
            'device.supportsWebGL': capabilities.supportsWebGL,
            'device.gpuTier': capabilities.gpuTier,
            'device.reducedMotion': capabilities.reducedMotion
        });

        // Initialize preloader and wait for completion
        preloader.init(() => this.onLoadComplete());
    }

    /**
     * Called when preloader completes
     */
    onLoadComplete() {
        console.log('✅ Loading complete, initializing experience...');

        // Initialize systems in sequence
        this.initMotion();
        this.initWebGL();
        this.initInteractions();
        this.initUtils();

        // Run intro animations
        this.playIntro();

        this.isInitialized = true;
        console.log('🎉 Portfolio initialized!');
    }

    /**
     * Initialize motion systems
     */
    initMotion() {
        // Skip smooth scroll if reduced motion preferred
        if (!state.get('device.reducedMotion')) {
            smoothScroll.init();
        }

        // Initialize scroll animations
        scrollOrchestrator.init();

        // Initialize kinetic text for headlines
        kineticText.init();

        // Initialize journey section animations
        journeyAnimation.init();

        // Initialize about section attribute animations
        aboutAnimation.init();
    }

    /**
     * Initialize WebGL systems
     */
    initWebGL() {
        // Only init WebGL if supported and not low-end mobile
        if (deviceCapability.shouldEnable('webgl')) {
            sceneManager.init();
            backgroundShader.init();
        } else {
            // Apply CSS fallback
            document.body.classList.add('no-webgl');
            console.log('WebGL disabled, using CSS fallback');
        }
    }

    /**
     * Initialize interaction systems
     */
    initInteractions() {
        magneticCursor.init();
        hoverSystem.init();
        projectCards.init();
        sideNavigation.init();
        contactForm.init();
    }

    /**
     * Initialize utility systems
     */
    initUtils() {
        lazyLoader.init();
    }

    /**
     * Play intro animations
     */
    playIntro() {
        // Import GSAP dynamically
        import('gsap').then(({ gsap }) => {
            const tl = gsap.timeline({ delay: 0.3 });

            // Animate kinetic text headlines
            const kineticElements = document.querySelectorAll('[data-kinetic-text]');
            kineticElements.forEach((el, index) => {
                kineticText.animate(el, { delay: index * 0.1 });
            });

            // Animate scroll indicator
            tl.to('.hero__scroll-indicator', {
                y: 0,
                opacity: 1,
                duration: 0.6,
                ease: 'expo.out'
            }, '+=0.5');
        });
    }

    /**
     * Destroy all systems
     */
    destroy() {
        smoothScroll.destroy();
        scrollOrchestrator.destroy();
        sceneManager.destroy();
        magneticCursor.destroy();
        lazyLoader.destroy();

        this.isInitialized = false;
    }
}

// Initialize app when DOM is ready
const app = new App();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}

export default app;
