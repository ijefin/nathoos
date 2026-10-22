import type Lenis from 'lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface Ctx {
  reduced: boolean;
  touch: boolean;
  lenis: Lenis | null;
}

type Swap = (slug: string) => void;

export function initWork({ reduced, touch, lenis }: Ctx) {
  const section = document.querySelector<HTMLElement>('#trabalhos');
  if (!section) return;

  const frame = section.querySelector<HTMLElement>('[data-work-frame]')!;
  const shots = [...frame.querySelectorAll<HTMLImageElement>('[data-shot]')];
  const items = [...section.querySelectorAll<HTMLLIElement>('.work-item')];
  const factStyle = section.querySelector<HTMLElement>('[data-fact="style"]')!;
  const factPlace = section.querySelector<HTMLElement>('[data-fact="place"]')!;
  const empty = section.querySelector<HTMLElement>('[data-work-empty]')!;

  // Troca padrão: crossfade em CSS. O shader substitui isto quando carrega.
  let swap: Swap = (slug) => shots.forEach((img) => img.classList.toggle('is-current', img.dataset.shot === slug));
  let current = items[0]?.dataset.slug ?? '';

  const setCurrent = (li: HTMLLIElement) => {
    const slug = li.dataset.slug!;
    if (slug === current) return;
    current = slug;
    items.forEach((it) => it.classList.toggle('is-current', it === li));
    const btn = li.querySelector<HTMLButtonElement>('[data-open-work]')!;
    factStyle.textContent = btn.dataset.styleLabel ?? '';
    factPlace.textContent = (btn.dataset.place ?? '').toLowerCase();
    swap(slug);
  };
  items[0]?.classList.add('is-current');

  // O nome que cruza o meio da tela é o atual.
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) setCurrent(e.target as HTMLLIElement);
    },
    { rootMargin: '-49% 0px -49% 0px' },
  );
  items.forEach((li) => io.observe(li));

  // ---------- Filtro por estilo ----------
  const filters = [...section.querySelectorAll<HTMLButtonElement>('[data-filter]')];
  const applyFilter = (value: string) => {
    filters.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === value)));
    let shown = 0;
    items.forEach((li) => {
      const show = value === '*' || li.dataset.style === value;
      li.hidden = !show;
      if (show) shown++;
    });
    empty.hidden = shown > 0;
    const first = items.find((li) => !li.hidden);
    if (first) setCurrent(first);
    ScrollTrigger.refresh();
  };
  filters.forEach((b) => b.addEventListener('click', () => applyFilter(b.dataset.filter!)));
  document.querySelectorAll<HTMLAnchorElement>('[data-filter-link]').forEach((a) =>
    a.addEventListener('click', () => applyFilter(a.dataset.filterLink!)),
  );

  // ---------- Lightbox ----------
  const dialog = section.querySelector<HTMLDialogElement>('[data-lightbox]')!;
  const img = dialog.querySelector<HTMLImageElement>('[data-lightbox-img]')!;
  const zoom = dialog.querySelector<HTMLButtonElement>('[data-zoom]')!;
  const title = dialog.querySelector<HTMLElement>('[data-lightbox-title]')!;
  const meta = dialog.querySelector<HTMLElement>('[data-lightbox-meta]')!;
  const note = dialog.querySelector<HTMLElement>('[data-lightbox-note]')!;
  const cta = dialog.querySelector<HTMLAnchorElement>('[data-lightbox-cta]')!;
  let opener: HTMLElement | null = null;

  const close = () => {
    dialog.close();
  };
  dialog.addEventListener('close', () => {
    zoom.classList.remove('is-zoomed');
    lenis?.start();
    opener?.focus();
  });

  section.querySelectorAll<HTMLButtonElement>('[data-open-work]').forEach((btn) =>
    btn.addEventListener('click', () => {
      opener = btn;
      img.src = btn.dataset.src!;
      img.alt = btn.dataset.alt!;
      title.textContent = btn.dataset.name!;
      meta.textContent = `${btn.dataset.styleLabel}, ${btn.dataset.place?.toLowerCase()}`;
      note.textContent = btn.dataset.note ?? '';
      cta.dataset.style = btn.dataset.styleLabel === 'Cobertura' ? 'Cobertura ou reforma' : btn.dataset.styleLabel;
      lenis?.stop();
      dialog.showModal();
    }),
  );
  dialog.querySelector('[data-close]')!.addEventListener('click', close);

  // O quadro e o botão "Ver em detalhe" abrem o trabalho atual; a foto do celular abre o seu.
  const openSlug = (slug: string) => section.querySelector<HTMLButtonElement>(`.work-name[data-open-work="${slug}"]`)?.click();
  section.querySelectorAll<HTMLElement>('[data-open-current]').forEach((el) => el.addEventListener('click', () => openSlug(current)));
  section.querySelectorAll<HTMLElement>('[data-open-slug]').forEach((el) => el.addEventListener('click', () => openSlug(el.dataset.openSlug!)));
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) close();
  });
  cta.addEventListener('click', () => {
    close();
    const style = document.querySelector<HTMLInputElement>(`[data-quote] input[name="estilo"][value="${cta.dataset.style ?? ''}"]`);
    style?.click();
  });

  // Zoom para ver contraste e traço: clique alterna, o ponteiro escolhe o ponto.
  zoom.addEventListener('click', () => {
    const on = zoom.classList.toggle('is-zoomed');
    zoom.setAttribute('aria-label', on ? 'Reduzir a foto' : 'Ampliar a foto para ver o traço');
  });
  zoom.addEventListener('pointermove', (e) => {
    if (!zoom.classList.contains('is-zoomed')) return;
    const r = zoom.getBoundingClientRect();
    img.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
  });

  // ---------- Shader de tinta: só com ponteiro fino, sem movimento reduzido, perto da seção ----------
  if (reduced || touch || !('WebGLRenderingContext' in window)) return;
  const near = new IntersectionObserver(
    async ([e]) => {
      if (!e.isIntersecting) return;
      near.disconnect();
      try {
        const { createInkSwap } = await import('./ink-gl');
        const gl = await createInkSwap(frame, shots, current);
        if (gl) {
          swap = gl;
          frame.classList.add('has-gl');
        }
      } catch {
        /* sem WebGL: fica o crossfade */
      }
    },
    { rootMargin: '600px 0px' },
  );
  near.observe(section);
}
