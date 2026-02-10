/**
 * StateManager - Centralized application state
 * Manages scroll, sections, transitions, and shader parameters
 */

class StateManager {
    constructor() {
        this.state = {
            // Scroll state
            scroll: {
                position: 0,
                velocity: 0,
                direction: 1,
                progress: 0,
                isScrolling: false
            },

            // Section state
            section: {
                current: 'hero',
                previous: null,
                index: 0,
                progress: 0
            },

            // Transition state
            transition: {
                phase: 'idle', // idle, entering, active, exiting
                from: null,
                to: null,
                progress: 0
            },

            // Shader state
            shader: {
                intensity: 1.0,
                colorShift: 0.0,
                noiseScale: 1.0,
                flowSpeed: 0.5
            },

            // UI state
            ui: {
                isLoaded: false,
                isPreloaderVisible: true,
                cursorState: 'default',
                mousePosition: { x: 0, y: 0 }
            },

            // Device capabilities
            device: {
                isMobile: false,
                isTouch: false,
                supportsWebGL: true,
                gpuTier: 'high',
                reducedMotion: false
            }
        };

        this.listeners = new Map();
        this.previousState = null;
    }

    /**
     * Get current state or nested property
     */
    get(path = null) {
        if (!path) return { ...this.state };

        const keys = path.split('.');
        let value = this.state;

        for (const key of keys) {
            if (value === undefined) return undefined;
            value = value[key];
        }

        return value;
    }

    /**
     * Update state with partial updates
     */
    set(path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        let target = this.state;

        for (const key of keys) {
            if (!(key in target)) target[key] = {};
            target = target[key];
        }

        const oldValue = target[lastKey];
        target[lastKey] = value;

        // Notify listeners
        this.emit(path, value, oldValue);

        return this;
    }

    /**
     * Batch update multiple values
     */
    batch(updates) {
        for (const [path, value] of Object.entries(updates)) {
            this.set(path, value);
        }
        return this;
    }

    /**
     * Subscribe to state changes
     */
    on(path, callback) {
        if (!this.listeners.has(path)) {
            this.listeners.set(path, new Set());
        }
        this.listeners.get(path).add(callback);

        return () => this.off(path, callback);
    }

    /**
     * Unsubscribe from state changes
     */
    off(path, callback) {
        if (this.listeners.has(path)) {
            this.listeners.get(path).delete(callback);
        }
    }

    /**
     * Emit state change to listeners
     */
    emit(path, newValue, oldValue) {
        // Exact path listeners
        if (this.listeners.has(path)) {
            this.listeners.get(path).forEach(cb => cb(newValue, oldValue, path));
        }

        // Parent path listeners (e.g., 'scroll' listens to 'scroll.position')
        const parts = path.split('.');
        let parentPath = '';

        for (let i = 0; i < parts.length - 1; i++) {
            parentPath += (parentPath ? '.' : '') + parts[i];
            if (this.listeners.has(parentPath)) {
                this.listeners.get(parentPath).forEach(cb => cb(this.get(parentPath), null, path));
            }
        }

        // Global listeners
        if (this.listeners.has('*')) {
            this.listeners.get('*').forEach(cb => cb(this.state, path));
        }
    }

    /**
     * Reset to initial state
     */
    reset() {
        this.state.scroll = { position: 0, velocity: 0, direction: 1, progress: 0, isScrolling: false };
        this.state.section = { current: 'hero', previous: null, index: 0, progress: 0 };
        this.state.transition = { phase: 'idle', from: null, to: null, progress: 0 };
        this.emit('*', this.state, 'reset');
    }
}

// Singleton instance
export const state = new StateManager();
export default StateManager;
