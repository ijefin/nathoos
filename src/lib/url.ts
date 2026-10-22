/** Caminho de um arquivo de public/ respeitando o `base` do Astro (GitHub Pages serve em subpasta). */
export const asset = (path: string) => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
