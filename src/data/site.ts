import type { ImageMetadata } from 'astro';

import conte from '../assets/media/process/conte.jpg';
import avalio from '../assets/media/process/avalio.jpg';
import ajusto from '../assets/media/process/ajusto.jpg';
import tatuo from '../assets/media/process/tatuo.jpg';

import lobo from '../assets/media/work/lobo.jpg';
import tigre from '../assets/media/work/tigre.jpg';
import caveira from '../assets/media/work/caveira.jpg';
import mewtwo from '../assets/media/work/mewtwo.jpg';
import perna from '../assets/media/work/perna.jpg';
import costas from '../assets/media/work/costas.jpg';
import antebraco from '../assets/media/work/antebraco.jpg';

import nathan from '../assets/media/about/nathan.jpg';
import certificados from '../assets/media/about/certificados.jpg';
import convencao from '../assets/media/about/convencao.jpg';
import estudio from '../assets/media/about/estudio.jpg';
import bancada from '../assets/media/about/bancada.jpg';

/**
 * Contato. TODO antes de publicar: número real do WhatsApp (só dígitos, com DDI 55),
 * @ do Instagram e endereço do estúdio. Campos vazios somem da página.
 */
export const contact = {
  whatsapp: '554797818221',
  instagram: '', // TODO: @ real do Nathan (sem o @)
  address: '',
  mapsUrl: '',
};

export const whatsappLink = (text = '') =>
  `https://wa.me/${contact.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

export type Style = 'Preto e cinza' | 'Blackwork' | 'Cobertura';
export const styles: Style[] = ['Preto e cinza', 'Blackwork', 'Cobertura'];

export interface Step {
  verb: string;
  text: string;
  image?: ImageMetadata;
  video?: string;
  alt: string;
}

/** As cinco etapas do roteiro, na voz do Nathan. A ordem é a do processo. */
export const steps: Step[] = [
  {
    verb: 'Conte',
    text: 'Você me conta o que deseja: referências, local do corpo, tamanho aproximado e o significado da ideia.',
    image: conte,
    alt: 'Nathan sentado no estúdio, ouvindo um cliente',
  },
  {
    verb: 'Avalio',
    text: 'Projeto que dá pra entender por foto eu avalio online. Cobertura, reforma ou pele que pede um olhar de perto, presencialmente.',
    image: avalio,
    alt: 'Nathan de perfil, concentrado, olhando para baixo',
  },
  {
    verb: 'Crio',
    text: 'Pesquiso, estudo composição, contraste e proporção, e desenho em cima da anatomia. A referência inspira; o projeto é seu.',
    video: 'freehand',
    alt: 'Freehand: Nathan desenha com marcador roxo direto na perna do cliente',
  },
  {
    verb: 'Ajusto',
    text: 'Alinhamos expectativas, faço os ajustes combinados e preparo o desenho para a região escolhida.',
    image: ajusto,
    alt: 'Antebraço com as linhas roxas do stencil, pronto para tatuar',
  },
  {
    verb: 'Tatuo',
    text: 'Preparo o ambiente, confiro o posicionamento com você, tatuo e explico os cuidados para a cicatrização.',
    video: 'sessao',
    alt: 'A máquina passando tinta preta por cima das linhas roxas do freehand',
  },
];

export interface Work {
  slug: string;
  name: string;
  style: Style;
  place: string;
  image: ImageMetadata;
  alt: string;
  note?: string;
}

/**
 * Trabalhos. Recortes dos posts e vídeos que o Nathan mandou pelo WhatsApp.
 * TODO: confirmar local do corpo/estilo de cada peça e trocar pelos arquivos originais em alta.
 */
export const works: Work[] = [
  { slug: 'lobo', name: 'Lobo', style: 'Preto e cinza', place: 'Perna', image: lobo, alt: 'Tatuagem de lobo com floresta e cervo em preto e cinza', note: 'Realismo animal com floresta de pinheiros e cervo na base.' },
  { slug: 'caveira', name: 'Caveira', style: 'Blackwork', place: 'Braço', image: caveira, alt: 'Caveira com arame farpado em preto, com respingos vermelhos', note: 'Caveira com arame farpado, preto sólido e respingos de vermelho.' },
  { slug: 'mewtwo', name: 'Mewtwo', style: 'Preto e cinza', place: 'Coxa', image: mewtwo, alt: 'Mewtwo em preto e cinza fechando a coxa', note: 'Feita em convenção, com o time ODD.' },
  { slug: 'perna', name: 'Perna', style: 'Blackwork', place: 'Perna inteira', image: perna, alt: 'Perna fechada com lettering gótico e figura em preto', note: 'Desenhada em freehand direto na pele antes de tatuar.' },
  { slug: 'tigre', name: 'Tigre', style: 'Preto e cinza', place: 'Braço', image: tigre, alt: 'Detalhe do focinho de um tigre tatuado em preto e cinza', note: 'Detalhe de pelagem e focinho.' },
  { slug: 'costas', name: 'Costas', style: 'Preto e cinza', place: 'Costas', image: costas, alt: 'Nathan tatuando as costas de um cliente já tatuado', note: 'Em sessão.' },
  { slug: 'antebraco', name: 'Antebraço', style: 'Preto e cinza', place: 'Antebraço', image: antebraco, alt: 'Antebraço com stencil roxo e sombras em andamento', note: 'Em sessão, sobre o stencil.' },
];

export interface Portrait {
  name: string;
  role: string;
  text: string;
  image: ImageMetadata;
  alt: string;
}

export const portraits: Portrait[] = [
  {
    name: 'Nathan Augusto',
    role: 'Tatuador desde 2022',
    text: 'Faço da tatuagem delicada até a mais complexa. Meu foco é preto e cinza: animais, rostos, coberturas e reformas, com muito freehand.',
    image: nathan,
    alt: 'Nathan no estúdio, de luvas pretas, conferindo o material antes da sessão',
  },
  {
    name: 'Formação',
    role: 'Três cursos na parede',
    text: 'Cover up em preto e cinza com Lucas Pessoa. Animais em preto e cinza na Ink Academy, com Chico Morbene. Blackwork com fine line na Domestika, com Mazvtier.',
    image: certificados,
    alt: 'Parede com os certificados do Nathan e o crachá de membro do ODD TEAM',
  },
  {
    name: 'ODD TEAM',
    role: 'Membro oficial',
    text: 'Faz parte do time da Odd Sheep. Na convenção, ao lado de uma coxa fechada com Mewtwo.',
    image: convencao,
    alt: 'Nathan agachado apontando para a tatuagem de Mewtwo na coxa de um cliente',
  },
  {
    name: 'O estúdio',
    role: 'Sala reservada',
    text: 'Maca e apoios cobertos com filme a cada sessão, luz de anel e descarte de perfurocortantes na parede.',
    image: estudio,
    alt: 'Sala do estúdio com maca preta coberta, ring light e o carrinho de bancada',
  },
  {
    name: 'A bancada',
    role: 'Montada na sua frente',
    text: 'Batoques, tinta e agulhas abertos na hora, no carrinho cheio de adesivos de marcas e amigos.',
    image: bancada,
    alt: 'Bancada coberta com filme, borrifador e batoques sobre o carrinho do estúdio',
  },
];

export const faq = [
  {
    q: 'Como funciona o orçamento?',
    a: 'Você me conta a ideia, manda referências, o local do corpo e o tamanho aproximado. Se dá pra avaliar por foto, o orçamento sai online. Valor e número de sessões dependem dessa avaliação.',
  },
  {
    q: 'Preciso ir ao estúdio?',
    a: 'Só quando o projeto pede: coberturas, reformas ou casos em que preciso ver a pele e a anatomia de perto. O resto começa pelo WhatsApp.',
  },
  {
    q: 'Posso enviar referências?',
    a: 'Pode e deve. Referência mostra o que te atrai; o desenho é criado para você e para a região escolhida, não copiado.',
  },
  {
    q: 'Como funcionam coberturas?',
    a: 'Começam com avaliação presencial. Vejo a tatuagem antiga, a cicatrização e a pele antes de propor o projeto. O preto e cinza e o freehand ajudam a esconder o que você não quer mais ver.',
  },
  {
    q: 'A simulação já é o desenho final?',
    a: 'Não. A simulação mostra posição e escala sobre a foto do seu corpo, para você decidir com segurança. O desenho completo é desenvolvido depois que você decide seguir com o projeto.',
  },
  {
    q: 'Quantas sessões serão necessárias?',
    a: 'Depende do tamanho, da região e do nível de detalhe. A estimativa vem junto com o orçamento e é revista se o projeto mudar.',
  },
  {
    q: 'Quando recebo orientações de cuidados?',
    a: 'No fim da sessão eu explico, com calma, como cuidar da tatuagem até cicatrizar. Qualquer dúvida depois, é só chamar.',
  },
];
