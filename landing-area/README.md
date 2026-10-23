# Landing del área de autocaravanas

Páginas estáticas independientes del sitio Gatsby (sin plantillas, sin React), una por idioma:

| Idioma | URL |
|---|---|
| ca | `/area-autocaravanes-la-mola-espot/` |
| es | `/es/area-autocaravanas-la-mola-espot/` |
| en | `/en/camper-area-la-mola-espot/` |
| fr | `/fr/aire-camping-car-la-mola-espot/` |
| nl | `/nl/camperplaats-la-mola-espot/` |

Las URLs y el texto del enlace del footer están en [`pages.json`](pages.json). Lo leen el generador,
`gatsby-config.js` (sitemap con hreflang) y `src/components/sections/Footer.js`.

## Cómo está montado

- `src/` es la fuente editable: un `landing.html` por idioma, el CSS original (`base.css`, `landing.css`),
  las fotos originales y el widget del tiempo (`widget/`).
- `build.py` genera el resultado en `static/` (Gatsby lo publica tal cual):
  - `static/<ruta de cada idioma>/index.html`: página autocontenida con el CSS purgado e incrustado
    (~6 KB gzip), canonical/hreflang/JSON-LD con el dominio `campinglamola.com`.
  - `static/area-assets/`: fotos en AVIF + WebP con varios tamaños (`srcset`), imagen Open Graph,
    logo y `meteo.<hash>.js`.
- **No edites `static/area-assets/` ni los `index.html` a mano**: se regeneran.

## Regenerar

```bash
cd landing-area
npm install          # una vez (purgecss + lightningcss)
python3 build.py     # requiere Pillow con soporte AVIF
```

Luego `git add static landing-area`. Para cambiar textos, edita `src/<idioma>/landing.html`;
para cambiar una foto, sustituye el fichero en `src/assets/` (mismo nombre).

## Tiempo en directo

El chip de la cabecera llama a `/.netlify/functions/meteo` (`netlify/functions/meteo.js`), que consulta
MET Norway (`altitude=1300`), lo cachea 10 min en el CDN y degrada a "dato obsoleto" hasta 60 min si el
proveedor falla. La atribución a MET Norway va en el pie (condición de uso de sus datos). Sin la función
(por ejemplo con `gatsby develop`) el chip muestra «Sin datos»; el resto de la página no depende de ella.

## SEO: qué hay y qué no

- Un solo `<h1>`, `title` y `description` por idioma, canonical propio, hreflang entre los 5 idiomas + `x-default`.
- JSON-LD: `Campground` (dirección, coordenadas, servicios), `FAQPage` y `BreadcrumbList`.
- Sin JavaScript para el contenido (el único script es el del tiempo, con `defer`).
- Sitemap: se añaden en `gatsby-config.js` (`resolvePages`/`serialize`) porque Gatsby no ve `static/`.
- Enlace interno: footer de todas las páginas del camping, pequeño y con texto descriptivo.
