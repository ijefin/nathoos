# Nathan Augusto Tattoo: site

Portfólio de uma página (v2): abertura → o que eu faço → casos reais → trabalhos → quem tatua → antes de decidir →
processo → orçamento progressivo → dúvidas → contato. Tema claro por padrão, escuro por escolha.
Plano e auditoria da v2 em `docs/v2-plano.md` (inclui o planejamento da anamnese por QR code).
Segue o roteiro em `Roteiro_Site_Portfolio_Nathan_Augusto_Tattoo.pdf` (etapa 1: site público).

## Rodar

```bash
npm install
npm run dev        # desenvolvimento
npm run build      # gera dist/
npx astro preview  # serve dist/ em segundo plano (Astro 7); pare com: npx astro preview stop
```

Mídias (recortes, preto e cinza, vídeos): `bash scripts/prepare-media.sh` (precisa de ImageMagick 7 e ffmpeg).
Lê o material bruto em `_raw/` e escreve em `src/assets/media/` e `public/media/`.

## Publicar

- **GitHub Pages:** todo push na `main` roda `.github/workflows/deploy.yml`, que faz o build com
  `BASE_PATH=/<nome-do-repo>` e publica em `https://<usuário>.github.io/<nome-do-repo>/`.
  Uma vez só: Settings → Pages → Source: **GitHub Actions**.
- **VPS ou domínio próprio:** `SITE_URL=https://seu-dominio npm run build` e sirva a pasta `dist/` como
  arquivos estáticos (nginx/caddy). Sem `BASE_PATH`, o site assume a raiz do domínio.

## Casos reais (jornadas)

Cada projeto é um arquivo em `src/content/projetos/*.yaml`, validado no build:

- `jornada: zero` (ideia → planejamento → desenvolvimento → sessão → resultado) ou `cobertura`
  (tatuagem antiga → planejamento → criação → sessão → cicatrizado → feedback, com `perfil: feminino | masculino`).
- Cada etapa leva `midia` (`imagem:` caminho relativo ou `video:` nome em `public/media`) ou `pendente:` com o que falta.
- `status: rascunho` fica fora do site público e aparece em **`/previa/`**, com o que falta marcado em cada etapa.
  Troque para `publicado` quando o material estiver completo e autorizado.
- `feedback` só aparece com `autorizado: true`.

## Antes de publicar

- `src/data/site.ts` → `contact`: número real do WhatsApp (só dígitos, com 55), @ do Instagram, endereço.
  Endereço vazio some do rodapé.
- `astro.config.mjs` → `site`: domínio final.
- `src/data/site.ts` → `works`: confirmar estilo e local do corpo de cada peça. Os textos de "note" são descrições
  do que aparece na foto. Trocar os recortes pelos arquivos originais em alta (os do WhatsApp têm ~450px).
- Política de privacidade (LGPD) antes de receber dados pelo site.

## Stack

| Peça | Versão | Por quê |
| --- | --- | --- |
| Astro | 7.4 | HTML estático, zero JS por padrão, `<Picture>` gera AVIF/WebP |
| Tailwind | 4.3 | tokens em `@theme` (`src/styles/global.css`) viram variáveis CSS e utilitários |
| GSAP + ScrollTrigger + SplitText | 3.15 | entradas, preenchimento de tinta, `matchMedia` para movimento reduzido. SplitText é gratuito desde a compra pela Webflow e substitui o SplitType (parado na 0.3.4) |
| Lenis | 1.3 | rolagem suave só com mouse/trackpad e sem movimento reduzido |
| OGL | 1.0 | shader da troca de imagem nos trabalhos, carregado sob demanda (15 KB gz) só no desktop |
| TikTok Sans variável | eixo de largura 75–150% | um arquivo de 91 KB, auto-hospedado e pré-carregado |

## Arquitetura

```
src/
  data/site.ts            conteúdo: contato, etapas, trabalhos, retratos, dúvidas
  layouts/Base.astro      <head>, pré-carga de fonte e pôster, JSON-LD TattooParlor
  components/
    Hero.astro            nome nos cantos + vídeo da tinta; barra fixa
    Specialties.astro     preto e cinza, blackwork, coberturas (declaração que se enche de tinta)
    Process.astro         cinco verbos em traço de stencil; TATUO enche de tinta
    Work.astro            índice de nomes + quadro fixo + filtro + lightbox com zoom
    Quote.astro           montador de pedido → mensagem no WhatsApp
    About.astro           "Quem tatua" fixo, retratos passando
    Faq.astro, Footer.astro, TornEdge.astro (borda de papel rasgado)
  scripts/
    main.ts               Lenis, ScrollTrigger, SplitText, vídeos, barra
    work.ts               nome atual, filtro, lightbox, carrega o shader
    ink-gl.ts             shader: a foto nova se espalha como tinta
    quote.ts              escreve a mensagem 1-2-3 e o link do WhatsApp
    pointer.ts            anel de stencil sobre os nomes, botões magnéticos
```

## Desempenho (Lighthouse 13.5, build de produção)

Celular: performance 96–97, acessibilidade 100, boas práticas 100, SEO 100. CLS 0, TBT ≤ 10 ms.
Desktop: performance 100, LCP 0,5 s.

O que segura esses números:
- Nenhum script bloqueia a renderização: um módulo no fim, CSS inline (`inlineStylesheets: 'always'`).
- Fonte única pré-carregada com fallback de métricas ajustadas (sem salto de layout).
- Pôster do vídeo do hero pré-carregado; vídeos dos passos com `preload="none"`, tocam só visíveis.
- Toda imagem com largura/altura e `sizes`; AVIF → WebP → JPEG.
- Shader e rolagem suave nunca carregam no celular nem com movimento reduzido.
- Estados escondidos de animação só existem com `html.js` e sem `prefers-reduced-motion`.

## Fora desta etapa

Anamnese digital por QR code (etapa 2 do roteiro): exige backend, controle de acesso por código de
atendimento, armazenamento privado e LGPD (dado de saúde é dado sensível). Não entra num site estático.
