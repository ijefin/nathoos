import { contact } from '../data/site';

export function initQuote() {
  const form = document.querySelector<HTMLFormElement>('[data-quote]');
  const noteText = document.querySelector<HTMLElement>('[data-note-text]');
  const noteRefs = document.querySelector<HTMLUListElement>('[data-note-refs]');
  const sends = document.querySelectorAll<HTMLAnchorElement>('[data-send]');
  const status = document.querySelector<HTMLElement>('[data-send-status]');
  const sendDesc = document.querySelector<HTMLElement>('[data-send-desc]');
  const sizeOut = document.querySelector<HTMLOutputElement>('[data-size-out]');
  if (!form || !noteText || !noteRefs || !sends.length || !sendDesc || !sizeOut) return;

  let refCount = 0;
  const urls: string[] = [];

  const value = (name: string) => (form.elements.namedItem(name) as RadioNodeList | HTMLInputElement | null)?.value?.trim() ?? '';
  const checked = (name: string) => (form.elements.namedItem(name) as HTMLInputElement | null)?.checked ?? false;

  const compose = () => {
    const nome = value('nome');
    const estilo = value('estilo');
    const local = value('local');
    const tamanho = value('tamanho');
    const ideia = value('ideia');
    const presencial = value('caminho') === 'presencial';
    const cobertura = estilo.startsWith('Cobertura');

    sizeOut.textContent = `${tamanho} cm`;

    const refs = refCount
      ? `vou mandar ${refCount} ${refCount === 1 ? 'foto' : 'fotos'} de referência aqui na conversa`
      : 'vou mandar as referências aqui na conversa';
    const lines = [
      `Oi, Nathan!${nome ? ` Aqui é ${nome}.` : ''}`,
      '',
      `1) Ideia: ${estilo.toLowerCase()}; ${refs}${cobertura ? ', junto com uma foto da tatuagem atual' : ''}.`,
      `2) O que quero fazer: ${ideia || 'te conto melhor por aqui.'}`,
      `3) Local e tamanho: ${local.toLowerCase()}, uns ${tamanho} cm${checked('fechamento') ? ', fechamento' : ''}. Mando foto do local também.`,
      '',
      presencial ? 'Quero marcar uma avaliação presencial no estúdio.' : 'Pode ser avaliação online, por fotos.',
    ];
    const text = lines.join('\n');

    noteText.textContent = text;
    sends.forEach((a) => (a.href = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(text)}`));

    // Diz o que falta; a mensagem pode ir assim mesmo, mas fica claro quando está completa.
    if (status) {
      const missing = [!nome && 'seu nome', !ideia && 'sua ideia'].filter(Boolean);
      status.textContent = missing.length ? `Falta: ${missing.join(' e ')}.` : 'Tudo pronto. É só enviar.';
      status.classList.toggle('is-ready', !missing.length);
    }
    sendDesc.textContent = presencial
      ? 'Abre o WhatsApp pedindo um horário de avaliação. As fotos você manda na conversa.'
      : 'Abre o WhatsApp com a sua mensagem pronta. As fotos você manda na conversa.';
  };

  // Cobertura e reforma pedem avaliação presencial; escolher o estilo já sugere o caminho.
  form.addEventListener('change', (e) => {
    const t = e.target as HTMLInputElement;
    if (t.name === 'estilo') {
      const path = t.value.startsWith('Cobertura') ? 'presencial' : 'online';
      form.querySelector<HTMLInputElement>(`input[name="caminho"][value="${path}"]`)!.checked = true;
    }
    if (t.name === 'refs' && t.files) {
      urls.splice(0).forEach((u) => URL.revokeObjectURL(u));
      noteRefs.replaceChildren();
      const files = [...t.files].filter((f) => f.type.startsWith('image/')).slice(0, 8);
      refCount = files.length;
      files.forEach((f, i) => {
        const url = URL.createObjectURL(f);
        urls.push(url);
        const li = document.createElement('li');
        li.style.setProperty('--r', `${(i % 2 ? 1 : -1) * (1 + (i % 3))}deg`);
        const img = document.createElement('img');
        img.src = url;
        img.alt = `Referência ${i + 1}: ${f.name}`;
        li.append(img);
        noteRefs.append(li);
      });
    }
    compose();
  });
  form.addEventListener('input', compose);

  // ---------- Perguntas progressivas: uma por vez, com voltar e continuar ----------
  const steps = [...form.querySelectorAll<HTMLElement>('[data-q]')];
  const nav = form.querySelector<HTMLElement>('[data-q-nav]');
  const back = form.querySelector<HTMLButtonElement>('[data-q-back]');
  const next = form.querySelector<HTMLButtonElement>('[data-q-next]');
  const count = form.querySelector<HTMLElement>('[data-q-count]');
  let at = 0;
  const show = (i: number, focus = true) => {
    at = Math.max(0, Math.min(steps.length - 1, i));
    steps.forEach((el, k) => el.classList.toggle('is-current', k === at));
    if (count) count.textContent = `${at + 1} de ${steps.length}`;
    if (back) back.disabled = at === 0;
    if (next) next.hidden = at === steps.length - 1;
    if (focus) steps[at].querySelector<HTMLElement>('input:checked, input, textarea')?.focus({ preventScroll: true });
  };
  if (steps.length && nav && back && next) {
    nav.hidden = false;
    back.addEventListener('click', () => show(at - 1));
    next.addEventListener('click', () => show(at + 1));
    // Clique ou toque numa opção já avança; pelo teclado (setas) não, para não pular perguntas.
    form.addEventListener('click', (e) => {
      const input = (e.target as HTMLElement).closest('.choice')?.querySelector('input[type="radio"]');
      if (input && (e as MouseEvent).detail > 0 && at < steps.length - 1) setTimeout(() => show(at + 1), 260);
    });
    form.addEventListener('keydown', (e) => {
      const t = e.target as HTMLElement;
      if (e.key === 'Enter' && t.matches('input[type="text"], input[type="range"]')) {
        e.preventDefault();
        if (at < steps.length - 1) show(at + 1);
        else sends[0]?.focus();
      }
    });
    show(0, false);
  }
  form.addEventListener('submit', (e) => e.preventDefault());

  compose();
}
