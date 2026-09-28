# Particles and performance

## GPU particles (the right default)

Animate positions in the vertex shader, not in JavaScript. CPU-side loops over 50k positions each frame cause long tasks and jank.

```js
const count = isMobile ? 30000 : 120000
const geo = new THREE.BufferGeometry()
geo.setAttribute('position', new THREE.BufferAttribute(shapeA, 3)) // Float32Array(count*3)
geo.setAttribute('aTarget', new THREE.BufferAttribute(shapeB, 3))
geo.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))

const mat = new THREE.ShaderMaterial({
  transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  uniforms: { uTime: { value: 0 }, uMorph: { value: 0 }, uSize: { value: 2 * Math.min(devicePixelRatio, 1.5) } },
  vertexShader: /* glsl */`
    attribute vec3 aTarget; attribute float aRandom;
    uniform float uTime, uMorph, uSize;
    void main() {
      float t = smoothstep(0.0, 1.0, clamp(uMorph * 1.4 - aRandom * 0.4, 0.0, 1.0)); // staggered morph
      vec3 p = mix(position, aTarget, t);
      p += 0.02 * sin(uTime + aRandom * 6.2831) ; // idle drift
      vec4 mv = modelViewMatrix * vec4(p, 1.0);
      gl_PointSize = uSize * (1.0 / -mv.z);
      gl_Position = projectionMatrix * mv;
    }`,
  fragmentShader: /* glsl */`
    void main() {
      float d = length(gl_PointCoord - 0.5);
      if (d > 0.5) discard;
      gl_FragColor = vec4(vec3(1.0), smoothstep(0.5, 0.0, d));
    }`,
})
scene.add(new THREE.Points(geo, mat))
```

### Shape morphing (brain / ring / grid switchers)
- Precompute each shape's target positions once (sample mesh surfaces with `MeshSurfaceSampler`), store as attributes or a data texture.
- Morph by animating one uniform (`uMorph` 0 → 1) with GSAP; swap attributes at the end. No per-frame JS over positions.
- Keep the same particle count for every shape so buffers are reused.

### Tie effects to content
A particle switcher is most persuasive when a shape resolves into something real (a product screenshot as a texture sampled into points, a client logo). Decoration alone reads as a demo.

## Frame budget checklist

- **Overdraw**: additive blending with large points is fill-rate heavy. Smaller points, fewer layers on mobile.
- **Post-processing**: bloom and DOF are expensive. One pass, half resolution, disabled on mobile if frame time > 16 ms.
- **Draw calls**: merge static meshes, use `InstancedMesh` for repeats. Check `renderer.info.render.calls`.
- **Textures**: KTX2 via `KTX2Loader`; never ship 4K PNGs.
- **Shadows**: bake them; real-time shadows rarely justify their cost on a marketing page.
- **Adaptive quality**: drei `<PerformanceMonitor onDecline={() => setDpr(1)} />` or measure frame time yourself and lower DPR/particle count.

## Profiling

- Chrome DevTools Performance panel with CPU 4x throttle: look for long tasks in `requestAnimationFrame` callbacks.
- `renderer.info` for calls, triangles, textures, geometries.
- Spector.js for a frame capture when a shader is slow.
- `stats-gl` for on-screen FPS and GPU time during development only.

## Bundle size

- Import only what you use: `import { WebGLRenderer, Scene, Points } from 'three'` with a bundler that tree-shakes.
- `three/examples/jsm/*` addons are big; import individually.
- drei re-exports a lot; import from specific paths if the analyzer shows bloat.
- Keep the scene in its own chunk so the rest of the site does not wait for it.
