/**
 * SceneManager - Three.js scene controller
 * Manages WebGL canvas, renderer, and render loop
 */

import * as THREE from 'three';
import { state } from '../core/StateManager.js';
import { deviceCapability } from '../core/DeviceCapability.js';

class SceneManager {
    constructor() {
        this.canvas = null;
        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.clock = null;
        this.rafId = null;
        this.isRunning = false;
        this.objects = new Map();
        this.uniforms = {};
    }

    /**
     * Initialize Three.js scene
     */
    init(canvasId = 'webgl-canvas') {
        // Check WebGL support
        if (!deviceCapability.shouldEnable('webgl')) {
            console.log('WebGL disabled based on device capabilities');
            return null;
        }

        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error('Canvas not found:', canvasId);
            return null;
        }

        // Get quality settings
        const quality = deviceCapability.getQualitySettings();

        // Setup renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: quality.shaderComplexity === 'high',
            alpha: true,
            powerPreference: 'high-performance'
        });

        const pixelRatio = Math.min(deviceCapability.capabilities.pixelRatio, 2);
        this.renderer.setPixelRatio(pixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x0a0a0f, 0);

        // Setup scene
        this.scene = new THREE.Scene();

        // Setup camera (orthographic for 2D effects)
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
        this.camera.position.z = 1;

        // Clock for animations
        this.clock = new THREE.Clock();

        // Setup resize handler
        this.handleResize = this.handleResize.bind(this);
        window.addEventListener('resize', this.handleResize);

        // Start render loop
        this.start();

        return this;
    }

    /**
     * Add object to scene
     */
    add(name, object) {
        this.objects.set(name, object);
        this.scene.add(object);
        return this;
    }

    /**
     * Remove object from scene
     */
    remove(name) {
        const object = this.objects.get(name);
        if (object) {
            this.scene.remove(object);
            this.objects.delete(name);

            // Dispose geometry and materials
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(m => m.dispose());
                } else {
                    object.material.dispose();
                }
            }
        }
        return this;
    }

    /**
     * Get object by name
     */
    get(name) {
        return this.objects.get(name);
    }

    /**
     * Handle window resize
     */
    handleResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Update renderer
        this.renderer.setSize(width, height);

        // Update camera
        const aspect = width / height;
        this.camera.left = -1;
        this.camera.right = 1;
        this.camera.top = 1;
        this.camera.bottom = -1;
        this.camera.updateProjectionMatrix();

        // Update resolution uniform if exists
        if (this.uniforms.resolution) {
            this.uniforms.resolution.value.set(width, height);
        }
    }

    /**
     * Main render loop
     */
    render() {
        if (!this.isRunning) return;

        this.rafId = requestAnimationFrame(this.render.bind(this));

        const delta = this.clock.getDelta();
        const elapsed = this.clock.getElapsedTime();

        // Update time uniform
        if (this.uniforms.time) {
            this.uniforms.time.value = elapsed;
        }

        // Update scroll uniform
        if (this.uniforms.scrollProgress) {
            this.uniforms.scrollProgress.value = state.get('scroll.progress') || 0;
        }

        // Update mouse uniform
        if (this.uniforms.mouse) {
            const mousePos = state.get('ui.mousePosition') || { x: 0, y: 0 };
            this.uniforms.mouse.value.set(
                mousePos.x / window.innerWidth,
                1.0 - mousePos.y / window.innerHeight
            );
        }

        // Render scene
        this.renderer.render(this.scene, this.camera);
    }

    /**
     * Start render loop
     */
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.clock.start();
        this.render();
    }

    /**
     * Stop render loop
     */
    stop() {
        this.isRunning = false;
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }

    /**
     * Set shared uniforms
     */
    setUniforms(uniforms) {
        this.uniforms = { ...this.uniforms, ...uniforms };
    }

    /**
     * Destroy scene and cleanup
     */
    destroy() {
        this.stop();

        // Remove resize listener
        window.removeEventListener('resize', this.handleResize);

        // Dispose all objects
        this.objects.forEach((object, name) => {
            this.remove(name);
        });

        // Dispose renderer
        if (this.renderer) {
            this.renderer.dispose();
            this.renderer = null;
        }

        this.scene = null;
        this.camera = null;
    }
}

// Singleton instance
export const sceneManager = new SceneManager();
export default SceneManager;
