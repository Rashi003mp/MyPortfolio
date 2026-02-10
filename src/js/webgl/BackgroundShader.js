/**
 * BackgroundShader - WebGL background effect controller
 * Creates abstract noise-based liquid background
 */

import * as THREE from 'three';
import { sceneManager } from './SceneManager.js';
import { state } from '../core/StateManager.js';
import vertexShader from '../../shaders/background.vert';
import fragmentShader from '../../shaders/background.frag';

class BackgroundShader {
    constructor() {
        this.mesh = null;
        this.uniforms = null;
        this.isInitialized = false;
    }

    /**
     * Initialize background shader
     */
    init() {
        if (this.isInitialized || !sceneManager.renderer) return null;

        // Create uniforms
        this.uniforms = {
            time: { value: 0 },
            resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            mouse: { value: new THREE.Vector2(0.5, 0.5) },
            scrollProgress: { value: 0 },
            intensity: { value: 1.0 }
        };

        // Share uniforms with scene manager
        sceneManager.setUniforms(this.uniforms);

        // Create fullscreen quad
        const geometry = new THREE.PlaneGeometry(2, 2);

        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: this.uniforms,
            depthWrite: false,
            depthTest: false
        });

        this.mesh = new THREE.Mesh(geometry, material);
        sceneManager.add('background', this.mesh);

        // Setup state listeners
        this.setupStateListeners();

        this.isInitialized = true;

        return this;
    }

    /**
     * Setup reactive state listeners
     */
    setupStateListeners() {
        // Listen to shader state changes
        state.on('shader.intensity', (value) => {
            if (this.uniforms) {
                this.uniforms.intensity.value = value;
            }
        });
    }

    /**
     * Update uniforms (called from render loop if needed)
     */
    update(delta) {
        if (!this.uniforms) return;

        // Time is updated by SceneManager
        // Additional per-frame updates can go here
    }

    /**
     * Destroy and cleanup
     */
    destroy() {
        if (this.mesh) {
            sceneManager.remove('background');
            this.mesh = null;
        }

        this.uniforms = null;
        this.isInitialized = false;
    }
}

// Singleton instance
export const backgroundShader = new BackgroundShader();
export default BackgroundShader;
