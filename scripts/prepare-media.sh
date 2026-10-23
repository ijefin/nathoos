#!/usr/bin/env bash
# Gera as mídias do site a partir do material bruto em _raw/ (fotos e vídeos do WhatsApp).
# Fotos de clima: preto e cinza, recorte 4:5. Tatuagens: cor original, recorte quadrado.
# Vídeos: loops curtos sem áudio em MP4 (H.264) + WebM (VP9), com pôster.
# Requer: ImageMagick 7 (magick) e ffmpeg.  Uso: bash scripts/prepare-media.sh
set -euo pipefail
cd "$(dirname "$0")/.."

A=_raw/zip-a   # estúdio
D=_raw/zip-d   # Nathan, trabalhos, vídeos
E=_raw/zip-e   # cobertura masculina (antes, sessões, braço fechado)
F=_raw/zip-f   # tigre nas costas, no estúdio
G=_raw/zip-g   # tigre nas costas, resultado e close do olho
IMG=src/assets/media
VID=public/media
TMP=$(mktemp -d); trap 'rm -r -- "$TMP"' EXIT
mkdir -p "$IMG/process" "$IMG/work" "$IMG/about" "$IMG/brand" "$VID"

# Preto e cinza do site: escala de cinza com contraste levemente aberto.
pb() { magick "$1" -colorspace Gray -level 4%,96% -quality 92 "$2"; }
# recorte: arquivo, geometria WxH+X+Y, destino
crop() { magick "$1" -crop "$2" +repage -quality 92 "$3"; }
crop_pb() { magick "$1" -crop "$2" +repage -colorspace Gray -level 4%,96% -quality 92 "$3"; }
# Cor do stencil preservada, todo o resto em cinza.
HOLD="colorhold=color=0x4a3ad0:similarity=0.18:blend=0.12"
frame() { ffmpeg -v error -y -ss "$2" -i "$1" -frames:v 1 -q:v 2 "$3"; }

# ---------- Processo (4:5) ----------
frame "$D/WhatsApp Video 2026-10-22 at 11.51.19.mp4" 3.2 $TMP/conte.jpg
crop_pb $TMP/conte.jpg 478x598+0+190                                  "$IMG/process/conte.jpg"
crop_pb "$D/WhatsApp Image 2026-10-22 at 11.50.33 (2).jpeg" 720x900+0+150    "$IMG/process/avalio.jpg"
# AJUSTO mantém só o roxo do stencil (colorhold); o resto vira cinza.
ffmpeg -v error -y -i "$D/WhatsApp Image 2026-10-22 at 11.50.52 (1).jpeg" -vf "crop=720:900:0:300,$HOLD" -q:v 2 "$IMG/process/ajusto.jpg"
crop_pb "$D/WhatsApp Image 2026-10-22 at 11.50.34 (1).jpeg" 900x1125+0+300   "$IMG/process/tatuo.jpg"

# ---------- Trabalhos (1:1, cor original) ----------
crop "$D/WhatsApp Image 2026-10-22 at 11.50.32 (1).jpeg" 470x470+880+330 "$IMG/work/lobo.jpg"
crop "$D/WhatsApp Image 2026-10-22 at 11.50.32 (1).jpeg" 320x320+0+130   "$IMG/work/tigre.jpg"
crop "$D/WhatsApp Image 2026-10-22 at 11.50.32.jpeg"     420x420+925+640 "$IMG/work/caveira.jpg"
crop "$D/WhatsApp Image 2026-10-22 at 11.51.19 (1).jpeg" 540x540+620+340 "$IMG/work/mewtwo.jpg"
crop "$D/WhatsApp Image 2026-10-22 at 11.50.33 (3).jpeg" 640x640+40+620  "$IMG/work/costas.jpg"
crop "$D/WhatsApp Image 2026-10-22 at 11.50.52 (2).jpeg" 600x600+0+560   "$IMG/work/antebraco.jpg"
frame "$D/WhatsApp Video 2026-10-22 at 11.50.32.mp4" 33.6 $TMP/perna.jpg
crop $TMP/perna.jpg 478x478+0+250                                 "$IMG/work/perna.jpg"

# ---------- Sobre (4:5, preto e cinza) ----------
crop_pb "$D/WhatsApp Image 2026-10-22 at 11.50.34 (2).jpeg" 720x900+0+120    "$IMG/about/nathan.jpg"
crop_pb "$D/WhatsApp Image 2026-10-22 at 11.51.12.jpeg"     720x900+0+60     "$IMG/about/certificados.jpg"
crop_pb "$D/WhatsApp Image 2026-10-22 at 11.51.19 (1).jpeg" 1069x1336+0+0    "$IMG/about/convencao.jpg"
crop_pb "$A/WhatsApp Image 2026-10-22 at 11.47.35 (1).jpeg" 720x900+0+180    "$IMG/about/estudio.jpg"
crop_pb "$A/WhatsApp Image 2026-10-22 at 11.47.34.jpeg"     720x900+0+330    "$IMG/about/bancada.jpg"

# ---------- Especialidades (16:9, preto e cinza) ----------
mkdir -p "$IMG/intro"
pb "$D/WhatsApp Image 2026-10-22 at 11.50.52.jpeg" "$IMG/intro/sessao.jpg"

# ---------- Abertura: só o Nathan (P&B), com a borda rasgada ----------
mkdir -p "$IMG/hero"
pb "$D/WhatsApp Image 2026-10-22 at 11.50.33 (1).jpeg" "$IMG/hero/nathan.jpg"

# ---------- Jornadas (cor original: são trabalhos dele) ----------
J=src/assets/media/jornadas
mkdir -p "$J"
# Cobertura masculina: espaço colorido → braço fechado em preto e cinza (fotos de 22/10 21:42).
# Recortes sem o rosto do cliente (decisão de 22/10: publicar só braço e ombro).
crop "$E/WhatsApp Image 2026-10-22 at 21.42.11.jpeg"     436x545+0+250  "$J/cob-m-antiga.jpg"
crop "$E/WhatsApp Image 2026-10-22 at 21.42.12 (1).jpeg" 613x766+0+250  "$J/cob-m-sessao.jpg"
crop "$E/WhatsApp Image 2026-10-22 at 21.42.12 (3).jpeg" 576x720+0+420  "$J/cob-m-ombro.jpg"
crop "$E/WhatsApp Image 2026-10-22 at 21.42.13.jpeg"     576x720+0+360  "$J/cob-m-final.jpg"
# Tigre nas costas, do zero (fotos de 22/10 21:33 e 21:34).
crop "$F/WhatsApp Image 2026-10-22 at 21.33.43 (2).jpeg" 720x900+0+130  "$J/tigre-estudio.jpg"
crop "$G/WhatsApp Image 2026-10-22 at 21.34.44 (1).jpeg" 720x900+0+40   "$J/tigre-costas.jpg"
crop "$G/WhatsApp Image 2026-10-22 at 21.34.44.jpeg"     720x900+0+200  "$J/tigre-olho.jpg"
# Índice de trabalhos (quadrado).
crop "$G/WhatsApp Image 2026-10-22 at 21.34.44 (1).jpeg" 720x720+0+150  "$IMG/work/tigre-costas.jpg"
crop "$E/WhatsApp Image 2026-10-22 at 21.42.13.jpeg"     576x576+0+380  "$IMG/work/cobertura-braco.jpg"

# ---------- Antes de decidir: stencil posicionado (só o roxo) ----------
mkdir -p "$IMG/planning"
ffmpeg -v error -y -i "$D/WhatsApp Image 2026-10-22 at 11.50.52 (2).jpeg" -vf "crop=720:900:0:260,$HOLD" -q:v 2 "$IMG/planning/stencil.jpg"

# ---------- Marca ----------
# Logo sem o disco preto, para uso sobre fundos escuros.
magick "$D/WhatsApp Image 2026-10-22 at 11.50.16.jpeg" -fuzz 18% -transparent black -trim +repage -resize 640x640 "$IMG/brand/logo.png"

# ---------- Vídeos ----------
# clip: origem, início, duração, nome, filtro extra
clip() {
  local vf="scale=478:-2,fps=30${5:+,$5}"
  ffmpeg -v error -y -ss "$2" -t "$3" -i "$1" -an -vf "$vf" -c:v libx264 -profile:v high -crf 26 -preset slow -pix_fmt yuv420p -movflags +faststart "$VID/$4.mp4"
  ffmpeg -v error -y -ss "$2" -t "$3" -i "$1" -an -vf "$vf" -c:v libvpx-vp9 -b:v 0 -crf 40 -row-mt 1 -pix_fmt yuv420p "$VID/$4.webm"
  ffmpeg -v error -y -ss "$2" -i "$1" -frames:v 1 -vf "$vf" -q:v 3 "$VID/$4.jpg"
}
GRAY="hue=s=0,eq=contrast=1.08"
clip "$D/WhatsApp Video 2026-10-22 at 11.51.19 (1).mp4" 6.0 7.5 tinta   "$GRAY"   # gota de tinta no batoque
clip "$D/WhatsApp Video 2026-10-22 at 11.50.32.mp4"     2.4 3.4 freehand "$HOLD"   # freehand com marcador: só o roxo sobrevive
clip "$D/WhatsApp Video 2026-10-22 at 11.50.32.mp4"    15.0 6.5 sessao   "$HOLD"   # máquina passando sobre as linhas roxas

# Favicon: o N do logo sobre preto.
magick "$D/WhatsApp Image 2026-10-22 at 11.50.16.jpeg" -crop 560x560+520+500 +repage -resize 64x64 public/favicon.png

ls -la "$IMG"/* "$VID"
