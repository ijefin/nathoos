import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { todasEtapas } from './data/jornadas';

/**
 * Projetos das jornadas documentais. Um arquivo YAML por projeto em src/content/projetos/.
 * `status: rascunho` não aparece no site público, só em /previa/ (com o que falta marcado).
 */
const projetos = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/projetos' }),
  schema: ({ image }) =>
    z
      .object({
        titulo: z.string(),
        jornada: z.enum(['zero', 'cobertura']),
        perfil: z.enum(['feminino', 'masculino']).optional(),
        local: z.string(),
        status: z.enum(['rascunho', 'publicado']),
        ordem: z.number().default(0),
        resumo: z.string().optional(),
        etapas: z.array(
          z.object({
            chave: z.enum(todasEtapas),
            texto: z.string().optional(),
            // O que ainda falta mandar para esta etapa (aparece só na prévia).
            pendente: z.string().optional(),
            midia: z
              .array(
                z.object({
                  imagem: image().optional(),
                  // Nome do vídeo em public/media (sem extensão): gera .webm, .mp4 e .jpg (pôster).
                  video: z.string().optional(),
                  alt: z.string(),
                }),
              )
              .default([]),
          }),
        ),
        feedback: z
          .object({
            texto: z.string(),
            autor: z.string(),
            // Sem autorização escrita do cliente o depoimento não é publicado.
            autorizado: z.boolean(),
          })
          .optional(),
      })
      .refine((p) => p.jornada !== 'cobertura' || p.perfil, { message: 'Projeto de cobertura precisa de perfil' }),
});

export const collections = { projetos };
