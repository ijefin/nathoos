# Notas de design — Nathan Augusto Tattoo

Direção sorteada: pinned-poster (seed 1141279756). Paleta mantida da marca (--keep palette).

## Inventário (só dele)
1. Tinta preta pingando nos batoques; diluições de cinza (preto e cinza é a especialidade).
2. Stencil / freehand riscado em roxo-azulado direto na pele.
3. Carrinho amarelo Vonder/Inkdraw coberto de adesivos.
4. Cordão amarelo ODD TEAM, membro oficial.
5. Posts do Instagram dele já usam papel rasgado e colagem.
6. Checklist 1-2-3 que ele pede no Instagram (ideia, conta, foto do local + tamanho).
7. Parede de certificados (Cover Up P&C, Animais P&C, Blackwork + Fine Line).
8. Tatua desde 2022. Muito freehand, coberturas e reformas.
9. Logo: N gótico com círculo de pincel dourado.

## Ideia
Nesta página, **o stencil roxo que vem antes de toda tatuagem** vira **o elemento fixo do pôster**:
os verbos do processo ficam presos em traço de stencil enquanto as fotos (todas em preto e cinza, com
só o roxo preservado) passam; no último passo, TATUO, o traço se enche de tinta.
Teste do concorrente: outro tatuador usa stencil, mas não tem freehand roxo filmado, P&C como
regra de imagem, o carrinho amarelo e o checklist 1-2-3 — o conjunto é dele.

## A coisa viva
Montador de pedido: escolhe estilo, local, tamanho, escreve a ideia e anexa referências (preview
local); um bilhete de papel rasgado escreve a mensagem no formato 1-2-3 dele em tempo real; a faixa
amarela ENVIAR abre o WhatsApp com o texto pronto. Cobertura/reforma → caminho presencial.

## Tokens
- --paper #ECECE7 (papel de transfer, neutro — não é o creme #F4F1EA)
- --ink #000000 (tinta, preto de verdade)
- --wash #5C5C58 (cinza de diluição, texto secundário)
- --paper-2 #DFDFD9 / --ink-2 #1A1A1A (degraus de tom, sem linhas)
- --stencil #4433CC / --stencil-light #A99DFF (roxo do stencil; casa com o colorhold)
- --accent #FFC400 (amarelo do carrinho / ODD) — só na ação

Tipo: TikTok Sans variável. Display wdth 150 / 800 caixa-alta; índice de trabalhos wdth 75
(condensada); texto wdth 100 / 400.

## Revisão contra o padrão genérico
- Fundo quase-preto + um acento ácido → trocado: capítulos alternam papel e tinta; amarelo só na ação;
  roxo é material (stencil), não decoração.
- Sem mono, sem eyebrow, sem 01/02/03 (a ordem é dada pelos verbos), sem linhas finas, sem gradiente,
  sem cards. Papel rasgado só como borda de seção (vem dos posts dele).
- Cursor: o prompt pede cursor customizado; a skill proíbe. Compromisso: cursor do sistema fica,
  um anel de stencil aparece só sobre o índice de trabalhos, só com ponteiro fino, nunca em movimento
  reduzido.
- Lightbox com blur: pedido no prompt; mantido só no dialog (algo que flutua de verdade).

## Seções (argumento)
1. Hero — quem e o quê: Nathan Augusto, tatuador; tinta pingando; Solicitar orçamento.
2. Especialidades — preto e cinza, blackwork e coberturas (palavras dele, ink fill).
3. Processo — cinco verbos: CONTE, AVALIO, CRIO, AJUSTO, TATUO.
4. Trabalhos — índice condensado passando pelo quadro fixo (shader de tinta na troca).
5. Orçamento — montador + faixa ENVIAR.
6. Sobre — QUEM TATUA fixo, retratos passando (formação, ODD TEAM, estúdio).
7. Dúvidas — as seis perguntas do roteiro.
8. Rodapé — convite + nome cortado em traço de stencil.

## Crítica

```
ROUND 1
Seen in one second: Nathan Augusto, tatuador; gota de tinta no batoque; botão amarelo de orçamento.
Idea (one sentence): os verbos do processo presos em traço de stencil roxo enquanto as fotos P&C passam; TATUO enche de tinta.
Live thing: montador de pedido que escreve a mensagem 1-2-3 dele num bilhete rasgado e abre o WhatsApp.
Layout words by section: hero=nome nos cantos + vídeo / especialidades=título largo, texto e foto lado a lado /
  processo=verbo fixo e foto alternando lados / trabalhos=índice condensado passando no quadro / orçamento=formulário + bilhete /
  enviar=faixa-palavra amarela / sobre=título fixo, retratos alternando / dúvidas=título largo, perguntas recuadas / rodapé=convite + nome cortado
Scores: design 7.5 · usability 7.5 · creativity 8 · content 7 → overall 7.5
Caps applied: nenhum
Top three problems:
1. Rodapé: logo, links e crédito saem da tela à direita (a coluna do grid ganha a largura do nome gigante). → minmax(0, 1fr).
2. Especialidades: os três estilos quebram em duas linhas numa coluna estreita e sobra um vão preto embaixo da foto. → estilos numa linha, coluna mais larga.
3. Trabalhos: só 7 peças, recortes de post em ~450px; o quadro amplia e amolece. → pedir originais ao Nathan (não resolve no código).
```

```
ROUND 2
Seen in one second: igual à rodada 1; rodapé agora fecha com logo, links e o nome em traço de stencil.
Scores: design 8 · usability 8 · creativity 8 · content 7 → overall 7.8
Caps applied: nenhum
Top three problems:
1. Conteúdo: só 7 trabalhos, recortes de post; a galeria precisa dos originais do Nathan. (fora do código)
2. Hero: o vídeo macro (478px) aparece ampliado ~1.2x na coluna de 5 colunas; fica macio. Aceito: é foco raso de propósito.
3. Rodapé: o nome cortado mostra só "NATHA" a 1440; reconhecível pelo contexto, mas um corte menor ajudaria.
Parado aqui: nenhum problema que um estranho notaria primeiro além do conteúdo que falta.
```
