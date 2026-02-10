/**
 * Tween - Custom interpolation utilities
 * Physics-based easing and spring animations
 */

/**
 * Linear interpolation
 */
export function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

/**
 * Clamp value between min and max
 */
export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/**
 * Map value from one range to another
 */
export function map(value, inMin, inMax, outMin, outMax) {
    return outMin + (outMax - outMin) * ((value - inMin) / (inMax - inMin));
}

/**
 * Normalize value to 0-1 range
 */
export function normalize(value, min, max) {
    return clamp((value - min) / (max - min), 0, 1);
}

/**
 * Spring physics simulation
 */
export class Spring {
    constructor(options = {}) {
        this.stiffness = options.stiffness || 100;
        this.damping = options.damping || 10;
        this.mass = options.mass || 1;
        this.velocity = 0;
        this.value = options.initial || 0;
        this.target = options.initial || 0;
        this.precision = options.precision || 0.001;
    }

    /**
     * Update spring position
     */
    update(delta = 1 / 60) {
        const force = this.stiffness * (this.target - this.value);
        const dampingForce = this.damping * this.velocity;
        const acceleration = (force - dampingForce) / this.mass;

        this.velocity += acceleration * delta;
        this.value += this.velocity * delta;

        // Check if settled
        if (Math.abs(this.target - this.value) < this.precision &&
            Math.abs(this.velocity) < this.precision) {
            this.value = this.target;
            this.velocity = 0;
            return true;
        }

        return false;
    }

    /**
     * Set new target
     */
    set(target) {
        this.target = target;
    }

    /**
     * Jump to value immediately
     */
    jump(value) {
        this.value = value;
        this.target = value;
        this.velocity = 0;
    }
}

/**
 * Smooth value follower with exponential decay
 */
export class SmoothValue {
    constructor(initial = 0, factor = 0.1) {
        this.value = initial;
        this.target = initial;
        this.factor = factor;
    }

    update() {
        this.value = lerp(this.value, this.target, this.factor);
        return this.value;
    }

    set(target) {
        this.target = target;
    }

    jump(value) {
        this.value = value;
        this.target = value;
    }
}

/**
 * Cubic bezier easing function generator
 */
export function cubicBezier(x1, y1, x2, y2) {
    const NEWTON_ITERATIONS = 4;
    const NEWTON_MIN_SLOPE = 0.001;
    const SUBDIVISION_PRECISION = 0.0000001;
    const SUBDIVISION_MAX_ITERATIONS = 10;

    const kSplineTableSize = 11;
    const kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

    const sampleValues = new Float32Array(kSplineTableSize);

    function A(a1, a2) { return 1.0 - 3.0 * a2 + 3.0 * a1; }
    function B(a1, a2) { return 3.0 * a2 - 6.0 * a1; }
    function C(a1) { return 3.0 * a1; }

    function calcBezier(t, a1, a2) {
        return ((A(a1, a2) * t + B(a1, a2)) * t + C(a1)) * t;
    }

    function getSlope(t, a1, a2) {
        return 3.0 * A(a1, a2) * t * t + 2.0 * B(a1, a2) * t + C(a1);
    }

    for (let i = 0; i < kSplineTableSize; ++i) {
        sampleValues[i] = calcBezier(i * kSampleStepSize, x1, x2);
    }

    function getTForX(x) {
        let intervalStart = 0.0;
        let currentSample = 1;
        const lastSample = kSplineTableSize - 1;

        for (; currentSample !== lastSample && sampleValues[currentSample] <= x; ++currentSample) {
            intervalStart += kSampleStepSize;
        }
        --currentSample;

        const dist = (x - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
        const guessForT = intervalStart + dist * kSampleStepSize;

        const initialSlope = getSlope(guessForT, x1, x2);
        if (initialSlope >= NEWTON_MIN_SLOPE) {
            let currentT = guessForT;
            for (let i = 0; i < NEWTON_ITERATIONS; ++i) {
                const currentSlope = getSlope(currentT, x1, x2);
                if (currentSlope === 0.0) return currentT;
                const currentX = calcBezier(currentT, x1, x2) - x;
                currentT -= currentX / currentSlope;
            }
            return currentT;
        }

        return guessForT;
    }

    return function (x) {
        if (x === 0 || x === 1) return x;
        return calcBezier(getTForX(x), y1, y2);
    };
}

// Common easing functions
export const ease = {
    linear: t => t,
    easeOutExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
    easeOutQuart: t => 1 - Math.pow(1 - t, 4),
    easeOutBack: cubicBezier(0.34, 1.56, 0.64, 1),
    easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    spring: cubicBezier(0.175, 0.885, 0.32, 1.275)
};

export default {
    lerp,
    clamp,
    map,
    normalize,
    Spring,
    SmoothValue,
    cubicBezier,
    ease
};
