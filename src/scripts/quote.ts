import { contact } from '../data/site';

export function initQuote() {
  const form = document.querySelector<HTMLFormElement>('[data-quote]');
  const noteText = document.querySelector<HTMLElement>('[data-note-text]');
  const noteRefs = document.querySelector<HTMLUListElement>('[data-note-refs]');
  const send = document.querySelector<HTMLAnchorElement>('[data-send]');
  const sendDesc = document.querySelector<HTMLElement>('[data-send-desc]');
  const sizeOut = document.querySelector<HTMLOutputElement>('[data-size-out]');
  if (!form || !noteText || !noteRefs || !send || !sendDesc || !sizeOut) return;

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
    send.href = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(text)}`;
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
  form.addEventListener('submit', (e) => e.preventDefault());

  compose();
}
