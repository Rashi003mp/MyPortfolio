/**
 * DeviceCapability - Detect device features and capabilities
 * Used for conditional rendering and performance optimization
 */

class DeviceCapability {
    constructor() {
        this.capabilities = {
            isMobile: false,
            isTouch: false,
            supportsWebGL: false,
            webglVersion: 0,
            gpuTier: 'unknown',
            reducedMotion: false,
            pixelRatio: 1,
            screenSize: 'desktop',
            supportsHover: true,
            connectionSpeed: 'fast'
        };

        this.detect();
    }

    /**
     * Run all detection tests
     */
    detect() {
        this.detectDevice();
        this.detectTouch();
        this.detectWebGL();
        this.detectGPU();
        this.detectMotionPreference();
        this.detectConnection();

        return this.capabilities;
    }

    /**
     * Detect mobile/tablet vs desktop
     */
    detectDevice() {
        const ua = navigator.userAgent.toLowerCase();
        const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];

        this.capabilities.isMobile = mobileKeywords.some(keyword => ua.includes(keyword));
        this.capabilities.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

        const width = window.innerWidth;
        if (width < 768) {
            this.capabilities.screenSize = 'mobile';
        } else if (width < 1024) {
            this.capabilities.screenSize = 'tablet';
        } else {
            this.capabilities.screenSize = 'desktop';
        }
    }

    /**
     * Detect touch capability
     */
    detectTouch() {
        this.capabilities.isTouch = (
            'ontouchstart' in window ||
            navigator.maxTouchPoints > 0 ||
            window.matchMedia('(pointer: coarse)').matches
        );

        this.capabilities.supportsHover = window.matchMedia('(hover: hover)').matches;
    }

    /**
     * Detect WebGL support level
     */
    detectWebGL() {
        const canvas = document.createElement('canvas');
        let gl = null;

        // Try WebGL 2 first
        try {
            gl = canvas.getContext('webgl2');
            if (gl) {
                this.capabilities.supportsWebGL = true;
                this.capabilities.webglVersion = 2;
                return;
            }
        } catch (e) { }

        // Fall back to WebGL 1
        try {
            gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl) {
                this.capabilities.supportsWebGL = true;
                this.capabilities.webglVersion = 1;
                return;
            }
        } catch (e) { }

        this.capabilities.supportsWebGL = false;
        this.capabilities.webglVersion = 0;
    }

    /**
     * Estimate GPU tier based on available info
     */
    detectGPU() {
        if (!this.capabilities.supportsWebGL) {
            this.capabilities.gpuTier = 'none';
            return;
        }

        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');

        if (!gl) {
            this.capabilities.gpuTier = 'low';
            return;
        }

        // Try to get GPU info via debug extension
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        let renderer = '';

        if (debugInfo) {
            renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase();
        }

        // Heuristic GPU tier detection
        const highEndKeywords = ['nvidia', 'geforce', 'gtx', 'rtx', 'radeon rx', 'amd rx', 'apple m1', 'apple m2', 'apple m3'];
        const lowEndKeywords = ['intel', 'integrated', 'mesa', 'swiftshader', 'llvmpipe'];

        if (highEndKeywords.some(k => renderer.includes(k))) {
            this.capabilities.gpuTier = 'high';
        } else if (lowEndKeywords.some(k => renderer.includes(k))) {
            this.capabilities.gpuTier = 'low';
        } else {
            // Default to medium for unknown GPUs
            this.capabilities.gpuTier = 'medium';
        }

        // Downgrade for mobile regardless of GPU
        if (this.capabilities.isMobile) {
            if (this.capabilities.gpuTier === 'high') {
                this.capabilities.gpuTier = 'medium';
            } else {
                this.capabilities.gpuTier = 'low';
            }
        }
    }

    /**
     * Detect reduced motion preference
     */
    detectMotionPreference() {
        this.capabilities.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Listen for changes
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            this.capabilities.reducedMotion = e.matches;
        });
    }

    /**
     * Detect connection speed
     */
    detectConnection() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

        if (connection) {
            const effectiveType = connection.effectiveType;

            if (effectiveType === '4g') {
                this.capabilities.connectionSpeed = 'fast';
            } else if (effectiveType === '3g') {
                this.capabilities.connectionSpeed = 'medium';
            } else {
                this.capabilities.connectionSpeed = 'slow';
            }
        }
    }

    /**
     * Get recommended quality settings based on capabilities
     */
    getQualitySettings() {
        const { gpuTier, isMobile, reducedMotion, connectionSpeed } = this.capabilities;

        if (reducedMotion) {
            return {
                enableWebGL: false,
                enableAnimations: false,
                particleCount: 0,
                shaderComplexity: 'none',
                textureResolution: 'low'
            };
        }

        if (gpuTier === 'high' && !isMobile) {
            return {
                enableWebGL: true,
                enableAnimations: true,
                particleCount: 1000,
                shaderComplexity: 'high',
                textureResolution: 'high'
            };
        }

        if (gpuTier === 'medium' || (gpuTier === 'high' && isMobile)) {
            return {
                enableWebGL: true,
                enableAnimations: true,
                particleCount: 500,
                shaderComplexity: 'medium',
                textureResolution: 'medium'
            };
        }

        // Low tier or slow connection
        return {
            enableWebGL: connectionSpeed !== 'slow',
            enableAnimations: true,
            particleCount: 100,
            shaderComplexity: 'low',
            textureResolution: 'low'
        };
    }

    /**
     * Check if a specific feature should be enabled
     */
    shouldEnable(feature) {
        const settings = this.getQualitySettings();

        switch (feature) {
            case 'webgl':
                return settings.enableWebGL;
            case 'animations':
                return settings.enableAnimations;
            case 'particles':
                return settings.particleCount > 0;
            case 'complexShaders':
                return settings.shaderComplexity === 'high';
            default:
                return true;
        }
    }
}

// Singleton instance
export const deviceCapability = new DeviceCapability();
export default DeviceCapability;
