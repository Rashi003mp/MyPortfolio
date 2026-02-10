precision highp float;

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
uniform float scrollProgress;
uniform float intensity;

varying vec2 vUv;

// Simple smooth noise
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = vUv;
  
  // Slow time evolution
  float t = time * 0.05;
  
  // Simple layered noise
  float n1 = snoise(uv * 2.0 + t);
  float n2 = snoise(uv * 4.0 - t * 0.5) * 0.5;
  float n3 = snoise(uv * 8.0 + t * 0.3) * 0.25;
  
  float noise = (n1 + n2 + n3) * 0.5 + 0.5;
  
  // Subtle variation based on scroll
  noise += scrollProgress * 0.1;
  
  // Base colors - deep black with subtle grey highlights
  vec3 colorDark = vec3(0.02, 0.02, 0.02);
  vec3 colorMid = vec3(0.06, 0.06, 0.06);
  vec3 colorLight = vec3(0.1, 0.1, 0.1);
  
  // Mix based on noise
  vec3 color = mix(colorDark, colorMid, smoothstep(0.3, 0.5, noise));
  color = mix(color, colorLight, smoothstep(0.6, 0.8, noise) * 0.3);
  
  // Subtle vignette
  float vignette = 1.0 - length(uv - 0.5) * 0.5;
  color *= vignette;
  
  // Apply intensity
  color *= intensity;
  
  gl_FragColor = vec4(color, 1.0);
}
