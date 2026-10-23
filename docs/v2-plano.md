# V2: auditoria e plano

## 1. Auditoria do que existe (v1, commit 9d901a5)

**Tecnologias confirmadas:** Astro 7.4 (estático), Tailwind 4.3 (tokens em `@theme`), GSAP 3.15 com
ScrollTrigger e SplitText, Lenis 1.3, OGL 1.0 (shader), fonte TikTok Sans variável auto-hospedada.
Deploy no GitHub Pages por Actions a cada push na `main` (`BASE_PATH=/nathoos`).

**Componentes:** Hero, Specialties, Process (5 verbos), Work (índice + quadro + lightbox + filtro),
Quote (montador de pedido + faixa ENVIAR), About (cards com respingos), Faq, Footer, TornEdge, InkSplat.

**Integrações operacionais que precisam continuar funcionando:**
| Integração | Onde | Como |
| --- | --- | --- |
| WhatsApp com mensagem pronta | `scripts/quote.ts`, `data/site.ts` | `wa.me/554797818221?text=` montado no formato 1-2-3 do Nathan |
| Caminho presencial para cobertura | `quote.ts` | estilo "Cobertura ou reforma" marca avaliação presencial |
| Filtro e lightbox dos trabalhos | `scripts/work.ts` | `data-filter`, `<dialog>` com zoom |
| Botão flutuante (celular) e barra fixa | `main.ts`, `Hero.astro` | some no orçamento e no rodapé |
| Mídia | `scripts/prepare-media.sh` | P&B, colorhold do roxo, AVIF/WebP via `<Picture>` |

**Conteúdo real disponível:** 7 trabalhos (recortes de post, ~450px), 1 projeto completo em vídeo
(perna: freehand → sessão → resultado), retratos do Nathan, estúdio, certificados, ODD TEAM.

**Conteúdo que não existe ainda:** os dois projetos de cobertura (feminino e masculino) com
tatuagem antiga, planejamento, criação, sessão, cicatrizado e feedback; exemplos de simulação
visual; depoimentos com autorização; foto em alta da tatuagem de tigre para a abertura.

## 2. Decisão: evoluir, não refazer

A base aguenta a v2: os componentes são independentes e o conteúdo já está separado em
`data/site.ts`. Refazer jogaria fora a identidade que o Nathan aprovou. O que muda de estrutura:
1. **Tema:** tokens semânticos (`--page`, `--page-fg`…) no lugar de cores fixas, tema claro por
   padrão e escuro por escolha (guardado no navegador do visitante).
2. **Conteúdo gerenciável:** projetos das jornadas viram arquivos em `src/content/projetos/`
   (Content Collections com esquema validado). Cada projeto tem `status: rascunho | publicado`.
   A página pública mostra só os publicados; `/previa/` mostra tudo, com molduras indicando
   a foto ou o vídeo que falta, para o Nathan saber o que mandar.
3. **Orçamento progressivo:** o formulário vira perguntas uma a uma, depois dos casos reais,
   reaproveitando a mesma composição de mensagem do WhatsApp.

## 3. Página v2 (ordem do argumento)

1. **Abertura:** foto do Nathan e tatuagem realista de tigre, separadas por um rasgo diagonal
   irregular de papel; frase "O detalhe que faz a diferença no olhar."; botão de tema.
2. **Apresentação:** a fala dele + "O que eu faço" em lista de palavras grandes com uma linha
   cada (elemento da referência).
3. **Jornadas documentais:** "Do zero" e "Cobertura". Na cobertura, dois projetos lado a lado
   etapa por etapa. Fotos e vídeos reais primeiro.
4. **Trabalhos:** índice atual.
5. **Antes de decidir:** direção de estilo e simulação visual quando aplicável, deixando claro
   que não é o desenho final gratuito.
6. **Processo:** os cinco verbos em stencil (mantido).
7. **Orçamento:** perguntas progressivas → bilhete → WhatsApp.
8. **Quem tatua**, **Dúvidas**, **Rodapé** (mantidos).

Da referência entram: abertura com retrato e frase gigante, lista "o que eu faço", depoimentos
com foto (só quando houver feedback real autorizado), lema de fechamento. Fica de fora a tela
"START" que bloqueia o conteúdo.

## 4. Anamnese por QR code (planejamento, não implementado)

- **Não cabe no site estático.** Precisa de backend (ex.: Supabase/Postgres com RLS, ou um
  serviço próprio no VPS) porque guarda dado de saúde, que é dado sensível pela LGPD.
- **Fluxo:** o Nathan cria o atendimento no painel → o sistema gera um link individual
  `…/anamnese/<token>` (token aleatório de 128 bits, uso único, expira em 72 h) → o QR code na
  recepção leva a uma página que pede o código do atendimento; a ficha nunca é listável nem
  acessível sem o token.
- **Dados:** só o necessário (alergias, pele, cicatrização, medicamentos relevantes, reações
  anteriores). Criptografia em repouso, acesso só do Nathan, registro de quem abriu e quando.
- **Consentimentos separados:** termo do procedimento ≠ autorização opcional de uso de imagem.
  Guardar versão do termo, data, evidência da assinatura e histórico de revisão.
- **Revisão humana obrigatória:** resposta relevante (alergia, anticoagulante etc.) marca a ficha
  para revisão; nada é aprovado automaticamente.
- **Antes de dados reais:** política de privacidade, base legal, prazo de retenção, canal para o
  titular pedir exclusão, revisão jurídica e sanitária dos termos.
