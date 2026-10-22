import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { initWork } from './work';
import { initQuote } from './quote';
import { initPointer } from './pointer';

gsap.registerPlugin(ScrollTrigger, SplitText);

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const touch = matchMedia('(hover: none), (pointer: coarse)').matches;

// ---------- Rolagem suave: só com mouse/trackpad e sem movimento reduzido ----------
let lenis: Lenis | null = null;
if (!reduced && !touch) {
  lenis = new Lenis({ lerp: 0.12, anchors: { offset: -64 } });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis!.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

// ---------- Barra fixa: depois do hero, aparece ao rolar para cima e sai ao rolar para baixo ----------
const bar = document.querySelector<HTMLElement>('[data-site-bar]');
const hero = document.querySelector('.hero');
if (bar && hero) {
  let pastHero = false;
  let inWork = false;
  const work = document.querySelector('#trabalhos');
  // No índice de trabalhos a barra sai do caminho dos nomes.
  if (work) new IntersectionObserver(([e]) => {
    inWork = e.isIntersecting;
    if (inWork) bar.classList.remove('is-on');
  }, { rootMargin: '-15% 0px -15% 0px' }).observe(work);
  new IntersectionObserver(([e]) => {
    pastHero = !e.isIntersecting;
    if (!pastHero) bar.classList.remove('is-on');
  }, { threshold: 0.05 }).observe(hero);
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => bar.classList.toggle('is-on', pastHero && !inWork && self.direction === -1),
  });
}

// ---------- Celular: botão de orçamento fixo depois do hero, fora do caminho no orçamento e no rodapé ----------
const floatCta = document.querySelector<HTMLElement>('[data-float-cta]');
if (floatCta && hero) {
  const away = new Set<Element>();
  let past = false;
  const sync = () => floatCta.classList.toggle('is-on', past && away.size === 0);
  new IntersectionObserver(([e]) => {
    past = !e.isIntersecting;
    sync();
  }).observe(hero);
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) e.isIntersecting ? away.add(e.target) : away.delete(e.target);
    sync();
  });
  document.querySelectorAll('#orcamento, .send, footer').forEach((el) => io.observe(el));
}

// ---------- Vídeos: tocam só quando visíveis, param com a aba escondida ----------
const videos = document.querySelectorAll<HTMLVideoElement>('[data-inview-play], [data-autoplay]');
const videoIO = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      const v = e.target as HTMLVideoElement;
      if (e.isIntersecting && !reduced) v.play().catch(() => {});
      else v.pause();
    }
  },
  { rootMargin: '200px 0px' },
);
videos.forEach((v) => {
  if (reduced) {
    v.removeAttribute('autoplay');
    v.pause();
  }
  videoIO.observe(v);
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) videos.forEach((v) => v.pause());
});

// ---------- Movimento ----------
const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
  // Títulos de seção: linhas sobem de trás da própria linha de base, uma vez.
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 105,
          duration: 0.9,
          ease: 'expo.out',
          stagger: 0.09,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        }),
    });
  });

  // Partes de cada seção: texto, depois imagem, com atraso curto.
  ScrollTrigger.batch('[data-rise]', {
    start: 'top 94%',
    once: true,
    onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out', stagger: 0.07 }),
  });

  // Declaração que se enche de tinta, palavra por palavra (começa em 45%).
  document.querySelectorAll<HTMLElement>('[data-fill]').forEach((el) => {
    // aria: 'none' porque <p> não aceita aria-label; as palavras seguem como texto comum.
    const split = SplitText.create(el, { type: 'words', aria: 'none' });
    gsap.fromTo(
      split.words,
      { opacity: 0.45 },
      {
        opacity: 1,
        ease: 'none',
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 55%', scrub: true },
      },
    );
  });

  // Cards do "Quem tatua": os respingos caem no papel quando o card entra...
  document.querySelectorAll<HTMLElement>('[data-splat]').forEach((wrap) => {
    gsap.from(wrap.querySelectorAll('.ink-splat'), {
      scale: 0.2,
      rotate: -25,
      opacity: 0,
      transformOrigin: '50% 50%',
      duration: 0.7,
      ease: 'expo.out',
      stagger: 0.12,
      scrollTrigger: { trigger: wrap, start: 'top 85%', once: true },
    });
  });
  // ...e o texto dele se enche de tinta enquanto é lido (começa legível, em 60%).
  document.querySelectorAll<HTMLElement>('[data-fill-card]').forEach((el) => {
    const split = SplitText.create(el, { type: 'words', aria: 'none' });
    gsap.fromTo(
      split.words,
      { opacity: 0.6 },
      { opacity: 1, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: el, start: 'top 90%', end: 'bottom 72%', scrub: true } },
    );
  });

  // Assinatura: no último passo, o traço do stencil se enche de tinta.
  const ink = document.querySelector<HTMLElement>('.step-ink');
  const lastStep = ink?.closest('[data-step]');
  if (ink && lastStep) {
    gsap.fromTo(
      ink,
      { clipPath: 'inset(0 100% 0 0)' },
      {
        clipPath: 'inset(0 0% 0 0)',
        ease: 'none',
        scrollTrigger: { trigger: lastStep, start: 'top 40%', end: 'top -20%', scrub: true },
      },
    );
  }

  // Fotos do "Quem tatua" derivam pouco dentro da moldura (menos de 8%).
  document.querySelectorAll<HTMLElement>('[data-drift] img').forEach((img) => {
    gsap.fromTo(
      img,
      { yPercent: -4 },
      { yPercent: 0, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } },
    );
  });

});

// ---------- Palavras que ocupam exatamente a largura útil (ENVIAR, o nome no rodapé) ----------
const fitWord = (el: HTMLElement) => {
  el.style.fontSize = '';
  const range = document.createRange();
  range.selectNodeContents(el);
  const textWidth = range.getBoundingClientRect().width;
  if (!textWidth) return;
  const size = parseFloat(getComputedStyle(el).fontSize);
  el.style.fontSize = `${(size * el.clientWidth) / textWidth}px`;
};
document.querySelectorAll<HTMLElement>('.send-word, [data-fit]').forEach((el) => {
  const fit = () => fitWord(el);
  fit();
  document.fonts?.ready.then(fit);
  new ResizeObserver(fit).observe(el.parentElement!);
});

// ---------- Interações ----------
initWork({ reduced, touch, lenis });
initQuote();
if (!touch && !reduced) initPointer();

// Fontes mudam a altura das linhas: recalcula os gatilhos quando carregarem.
document.fonts?.ready.then(() => ScrollTrigger.refresh());
