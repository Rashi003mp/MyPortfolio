/**
 * Preloader - Loading experience with progress and reveal
 */

import { gsap } from 'gsap';
import { state } from '../core/StateManager.js';

class Preloader {
    constructor() {
        this.preloader = null;
        this.bar = null;
        this.progress = 0;
        this.isComplete = false;
        this.onComplete = null;
    }

    /**
     * Initialize preloader
     */
    init(onComplete) {
        this.preloader = document.getElementById('preloader');
        this.bar = this.preloader?.querySelector('.preloader__bar');
        this.onComplete = onComplete;

        if (!this.preloader || !this.bar) {
            this.complete();
            return null;
        }

        // Start loading simulation (replace with actual asset loading)
        this.simulateLoading();

        return this;
    }

    /**
     * Simulate loading progress (replace with actual Promises)
     */
    simulateLoading() {
        const duration = 2000;
        const start = Date.now();

        const update = () => {
            const elapsed = Date.now() - start;
            this.progress = Math.min(elapsed / duration, 1);

            this.updateProgress(this.progress);

            if (this.progress < 1) {
                requestAnimationFrame(update);
            } else {
                setTimeout(() => this.complete(), 300);
            }
        };

        requestAnimationFrame(update);
    }

    /**
     * Load actual assets and track progress
     */
    async loadAssets(assets) {
        const total = assets.length;
        let loaded = 0;

        const promises = assets.map((asset) => {
            return new Promise((resolve) => {
                if (asset.type === 'image') {
                    const img = new Image();
                    img.onload = () => {
                        loaded++;
                        this.updateProgress(loaded / total);
                        resolve();
                    };
                    img.onerror = () => {
                        loaded++;
                        this.updateProgress(loaded / total);
                        resolve();
                    };
                    img.src = asset.src;
                } else {
                    // Generic asset
                    loaded++;
                    this.updateProgress(loaded / total);
                    resolve();
                }
            });
        });

        await Promise.all(promises);
        this.complete();
    }

    /**
     * Update progress bar
     */
    updateProgress(progress) {
        this.progress = progress;

        if (this.bar) {
            this.bar.style.width = `${progress * 100}%`;
        }
    }

    /**
     * Complete loading and reveal content
     */
    complete() {
        if (this.isComplete) return;
        this.isComplete = true;

        state.set('ui.isLoaded', true);

        // Animate out
        const tl = gsap.timeline({
            onComplete: () => {
                if (this.preloader) {
                    this.preloader.classList.add('is-hidden');
                }

                state.set('ui.isPreloaderVisible', false);

                if (this.onComplete) {
                    this.onComplete();
                }
            }
        });

        tl.to(this.preloader, {
            opacity: 0,
            duration: 0.6,
            ease: 'expo.inOut'
        });
    }

    /**
     * Force complete (skip animation)
     */
    skip() {
        if (this.preloader) {
            this.preloader.classList.add('is-hidden');
        }

        this.isComplete = true;
        state.batch({
            'ui.isLoaded': true,
            'ui.isPreloaderVisible': false
        });

        if (this.onComplete) {
            this.onComplete();
        }
    }
}

// Singleton instance
export const preloader = new Preloader();
export default Preloader;
