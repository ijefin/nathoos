import { Renderer, Program, Mesh, Triangle, Texture } from 'ogl';
import gsap from 'gsap';

const vertex = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

// A imagem nova se espalha sobre a antiga como tinta na pele: um campo de ruído decide
// onde a tinta chega primeiro, e a borda que avança escurece e empurra um pouco o desenho.
const fragment = /* glsl */ `
  precision highp float;
  uniform sampler2D tA;
  uniform sampler2D tB;
  uniform float uP;
  uniform float uSeed;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7)) + uSeed) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
    return v;
  }

  void main() {
    float n = fbm(vUv * 3.2);
    float w = 0.09;
    float edge = uP * (1.0 + w * 2.0) - w;
    float reveal = 1.0 - smoothstep(edge - w, edge, n);
    float rim = smoothstep(0.0, w, abs(n - edge));
    float active = step(0.001, uP) * step(uP, 0.999);
    vec2 push = (n - 0.5) * 0.035 * (1.0 - rim) * active * vec2(1.0, -1.0);
    vec4 a = texture2D(tA, vUv + push);
    vec4 b = texture2D(tB, vUv - push);
    vec3 col = mix(a.rgb, b.rgb, reveal);
    col *= mix(1.0, mix(0.12, 1.0, rim), active);
    gl_FragColor = vec4(col, 1.0);
  }
`;

async function loadImage(img: HTMLImageElement) {
  img.loading = 'eager';
  if (!img.complete || !img.naturalWidth) await img.decode().catch(() => undefined);
  return img;
}

export async function createInkSwap(frame: HTMLElement, shots: HTMLImageElement[], first: string) {
  const renderer = new Renderer({ dpr: Math.min(devicePixelRatio, 2), alpha: false, antialias: false });
  const gl = renderer.gl;
  gl.clearColor(0.1, 0.1, 0.1, 1);

  const textures = new Map<string, Texture>();
  await Promise.all(
    shots.map(async (img) => {
      await loadImage(img);
      const t = new Texture(gl, { generateMipmaps: false, minFilter: gl.LINEAR });
      t.image = img;
      textures.set(img.dataset.shot!, t);
    }),
  );
  const start = textures.get(first);
  if (!start) return null;

  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: { tA: { value: start }, tB: { value: start }, uP: { value: 0 }, uSeed: { value: 0 } },
  });
  const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

  const canvas = gl.canvas as HTMLCanvasElement;
  canvas.setAttribute('aria-hidden', 'true');
  frame.prepend(canvas);

  const render = () => renderer.render({ scene: mesh });
  const resize = () => {
    const { width, height } = frame.getBoundingClientRect();
    renderer.setSize(width, height);
    render();
  };
  new ResizeObserver(resize).observe(frame);
  resize();

  let shown = first;
  let tween: gsap.core.Tween | null = null;

  return (slug: string) => {
    const next = textures.get(slug);
    if (!next || slug === shown) return;
    // Se uma troca ainda está correndo, a imagem de destino vira a nova base.
    if (tween) {
      tween.kill();
      program.uniforms.tA.value = program.uniforms.tB.value;
    }
    shown = slug;
    program.uniforms.tB.value = next;
    program.uniforms.uSeed.value = Math.random() * 100;
    const state = { p: 0 };
    tween = gsap.to(state, {
      p: 1,
      duration: 0.75,
      ease: 'power2.inOut',
      onUpdate: () => {
        program.uniforms.uP.value = state.p;
        render();
      },
      onComplete: () => {
        program.uniforms.tA.value = next;
        program.uniforms.uP.value = 0;
        render();
        tween = null;
      },
    });
  };
}
