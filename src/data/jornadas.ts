/** Etapas de cada jornada documental, na ordem em que aparecem. */
export const etapasZero = ['ideia', 'planejamento', 'desenvolvimento', 'sessao', 'resultado'] as const;
export const etapasCobertura = ['antiga', 'planejamento', 'criacao', 'sessao', 'cicatrizado', 'feedback'] as const;
export const todasEtapas = [...new Set([...etapasZero, ...etapasCobertura])] as [string, ...string[]];

export const rotulos: Record<string, string> = {
  ideia: 'Ideia inicial',
  planejamento: 'Planejamento',
  desenvolvimento: 'Desenvolvimento',
  criacao: 'Criação',
  sessao: 'Sessão',
  resultado: 'Resultado',
  antiga: 'Tatuagem antiga',
  cicatrizado: 'Cicatrizado',
  feedback: 'Feedback',
};
