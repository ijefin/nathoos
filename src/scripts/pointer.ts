import gsap from 'gsap';

/**
 * Anel de stencil que acompanha o ponteiro só sobre os nomes dos trabalhos (o cursor do
 * sistema continua visível), e botões principais que puxam alguns pixels em direção ao ponteiro.
 * Só roda com mouse/trackpad e sem movimento reduzido (quem chama decide).
 */
export function initPointer() {
  const ring = document.createElement('div');
  ring.className = 'stencil-ring';
  ring.setAttribute('aria-hidden', 'true');
  ring.textContent = 'Ver';
  document.body.append(ring);

  const x = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' });
  const y = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' });
  window.addEventListener('pointermove', (e) => {
    x(e.clientX);
    y(e.clientY);
  });

  document.querySelectorAll<HTMLElement>('[data-cursor]').forEach((el) => {
    el.addEventListener('pointerenter', () => ring.classList.add('is-on'));
    el.addEventListener('pointerleave', () => ring.classList.remove('is-on'));
  });

  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const mx = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
    const my = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      mx(((e.clientX - r.left) / r.width - 0.5) * 12);
      my(((e.clientY - r.top) / r.height - 0.5) * 10);
    });
    el.addEventListener('pointerleave', () => {
      mx(0);
      my(0);
    });
  });
}
