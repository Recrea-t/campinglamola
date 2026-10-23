#!/usr/bin/env python3
"""
Genera las landings del área de autocaravanas (5 idiomas) a partir de ./src
y las escribe en static/ del sitio Gatsby. Cada página sale autocontenida:
CSS purgado e incrustado, imágenes AVIF/WebP responsive y cero dependencia de
plantillas Gatsby.

Uso (desde la raíz del repo):   python3 landing-area/build.py

Requiere: Python 3 + Pillow (con AVIF) y, para el CSS, `npm install` dentro de
landing-area/ (purgecss + lightningcss).
"""
import hashlib, html as htmllib, json, pathlib, re, shutil, subprocess, sys

AQUI = pathlib.Path(__file__).resolve().parent
SRC = AQUI / 'src'
RAIZ = AQUI.parent
OUT = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else RAIZ / 'static'
ASSETS_URL = '/area-assets'
SITIO = 'https://campinglamola.com'

sys.path.insert(0, str(AQUI))
PAGES = json.loads((AQUI / 'pages.json').read_text(encoding='utf8'))
LANGS = list(PAGES)                      # ca, es, en, fr, nl
X_DEFAULT = 'es'
HOME = {'ca': '/', 'es': '/es/', 'en': '/en/', 'fr': '/fr/', 'nl': '/nl/'}

OG_LOCALE = {'ca': 'ca_ES', 'es': 'es_ES', 'en': 'en_GB', 'fr': 'fr_FR', 'nl': 'nl_NL'}
OG_NOMBRE = 'area-autocaravanas-espot-la-mola-og.jpg'

# --- imágenes ---------------------------------------------------------------
# origen -> (nombre descriptivo, anchos, sizes)
IMAGENES = {
    'camping-montana-original.webp': ('area-autocaravanas-espot-vista-general', [480, 800, 1200, 1461],
                                      '(min-width: 861px) 57vw, 100vw'),
    'sanitarios-interior.webp': ('area-camper-sanitarios-duchas-interior', [480, 800, 1200],
                                 '(min-width: 861px) 38vw, 100vw'),
    'sanitarios-entrada.webp': ('area-camper-sanitarios-entrada', [480, 800, 1200],
                                '(min-width: 861px) 38vw, 50vw'),
    'wc-quimico.webp': ('area-camper-vaciado-wc-quimico', [350, 700],
                        '(min-width: 861px) 20vw, 50vw'),
    'vaciado-aguas-grises.webp': ('area-camper-vaciado-aguas-grises', [480, 800, 1200, 1400],
                                  '(min-width: 861px) 38vw, 100vw'),
    'recarga-agua.webp': ('area-camper-recarga-agua-potable', [480, 800, 1200, 1400],
                          '(min-width: 861px) 38vw, 100vw'),
}


def generar_imagenes(destino):
    from PIL import Image
    destino.mkdir(parents=True, exist_ok=True)
    for f, (nombre, anchos, _) in IMAGENES.items():
        im = Image.open(SRC / 'assets' / f).convert('RGB')
        w0, h0 = im.size
        for w in anchos:
            if w > w0:
                continue
            r = im.resize((w, round(h0 * w / w0)), Image.LANCZOS) if w != w0 else im
            r.save(destino / f'{nombre}-{w}.avif', 'AVIF', quality=52, speed=4)
            r.save(destino / f'{nombre}-{w}.webp', 'WEBP', quality=76, method=6)
    # Imagen para redes (Open Graph): 1200x630, JPEG (WebP/AVIF no se admiten en todas).
    hero = Image.open(SRC / 'assets' / 'camping-montana-original.webp').convert('RGB')
    w, h = hero.size
    alto = round(w * 630 / 1200)
    top = max(0, round((h - alto) * 0.45))
    hero.crop((0, top, w, top + alto)).resize((1200, 630), Image.LANCZOS) \
        .save(destino / OG_NOMBRE, 'JPEG', quality=80, optimize=True, progressive=True)


def anchos_de(nombre):
    for _, (n, anchos, _) in IMAGENES.items():
        if n == nombre:
            return anchos
    raise KeyError(nombre)


def picture(m):
    """<img src="../assets/X.webp" ...> -> <picture> con AVIF + WebP responsive."""
    tag = m.group(0)
    fichero = re.search(r'src="\.\./assets/([^"]+)"', tag).group(1)
    nombre, anchos, sizes = IMAGENES[fichero]
    ancho_real = [w for w in anchos]
    def srcset(ext):
        return ', '.join(f'{ASSETS_URL}/img/{nombre}-{w}.{ext} {w}w' for w in ancho_real)
    medio = min(ancho_real, key=lambda w: abs(w - 800))
    tag = tag.replace(f'src="../assets/{fichero}"',
                      f'src="{ASSETS_URL}/img/{nombre}-{medio}.webp" srcset="{srcset("webp")}" sizes="{sizes}"')
    return (f'<picture><source type="image/avif" srcset="{srcset("avif")}" sizes="{sizes}">{tag}</picture>')


# --- CSS --------------------------------------------------------------------
def css_purgado(htmls):
    css = AQUI / 'build' / 'area.min.css'
    css.parent.mkdir(exist_ok=True)
    # Las fotos van dentro de <picture>: los selectores «figure>img» pasan a «figure img».
    landing = (SRC / 'landing.css').read_text(encoding='utf8').replace('>img', ' img')
    (css.parent / 'landing.picture.css').write_text(landing, encoding='utf8')
    ficheros = [SRC / 'base.css', css.parent / 'landing.picture.css', SRC / 'extra.css', SRC / 'widget' / 'meteo.css']
    env = {'CSS_FILES': ','.join(str(f) for f in ficheros),
           'METEO_JS': str(SRC / 'widget' / 'meteo.js')}
    import os
    subprocess.run(['node', str(AQUI / 'css.js'), str(css)] + [str(h) for h in htmls],
                   check=True, env={**os.environ, **env}, cwd=AQUI)
    return css.read_text(encoding='utf8')


# --- páginas ----------------------------------------------------------------
def url(lang):
    return SITIO + PAGES[lang]['path']


def sincronizar_faq(html):
    """El FAQPage del JSON-LD se regenera con las preguntas/respuestas visibles (Google exige que coincidan)."""
    vis = re.findall(r'<summary class="faq-question">\s*<span>(.*?)</span>.*?<div class="faq-answer">\s*<p>(.*?)</p>',
                     html, flags=re.S)
    limpio = lambda t: re.sub(r'\s+', ' ', htmllib.unescape(re.sub(r'<[^>]+>', ' ', t))).strip()
    m = re.search(r'(<script type="application/ld\+json">)(.*?)(</script>)', html, flags=re.S)
    datos = json.loads(m.group(2))
    faq = next(n for n in datos['@graph'] if n['@type'] == 'FAQPage')
    faq['mainEntity'] = [{'@type': 'Question', 'name': limpio(q),
                          'acceptedAnswer': {'@type': 'Answer', 'text': limpio(a)}} for q, a in vis]
    assert vis, 'sin FAQ visible'
    nuevo = m.group(1) + '\n' + json.dumps(datos, ensure_ascii=False, indent=2) + '\n' + m.group(3)
    return html[:m.start()] + nuevo + html[m.end():]


def enlazar_camping(html):
    """El área forma parte del camping: containedInPlace al Campground que emite el sitio Gatsby (SchemaOrg.js)."""
    m = re.search(r'(<script type="application/ld\+json">)(.*?)(</script>)', html, flags=re.S)
    datos = json.loads(m.group(2))
    area = next(n for n in datos['@graph'] if 'Campground' in n['@type'])
    area['containedInPlace'] = {'@id': f'{SITIO}/#camping'}
    nuevo = m.group(1) + '\n' + json.dumps(datos, ensure_ascii=False, indent=2) + '\n' + m.group(3)
    return html[:m.start()] + nuevo + html[m.end():]


def marcar_temporada(lang, html):
    """Temporada de verano: el camping deja de funcionar como área. Aquí solo se deja el marcado (bàner oculto y
    vacío con el enlace a Parcelas, botones de check-in marcados con data-checkin); gatsby-node.js (onPostBuild)
    muestra el bàner con los textos de data/temporada.json y desactiva esos botones cuando el interruptor del CMS
    está encendido."""
    parcelas = PAGES[lang]['parcelas']
    sol = ('<svg class="temporada-icono" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5"></circle>'
           '<path d="M12 2v2.5m0 15V22M2 12h2.5m15 0H22M4.9 4.9l1.8 1.8m10.6 10.6 1.8 1.8M4.9 19.1l1.8-1.8m10.6-10.6 1.8-1.8">'
           '</path></svg>')
    banner = ('<div class="temporada" hidden>\n<div class="temporada-inner">\n'
              f'{sol}\n'
              '<p class="temporada-texto"><strong class="temporada-titulo"></strong>'
              '<span class="temporada-detalle"></span></p>\n'
              f'<a class="temporada-boton" href="{parcelas}"><span class="temporada-boton-texto"></span> '
              '<svg class="icon" aria-hidden="true"><use href="#lm-arrow"></use></svg></a>\n'
              '</div>\n</div>\n')
    html = html.replace('<header class="header">', banner + '<header class="header">', 1)
    html, n = re.subn(rf'(<a class="button[^"]*" href="https://checkin\.campinglamola\.com/{lang}\?calc")',
                      r'\1 data-checkin', html)
    assert n == 4 and 'class="temporada"' in html, (lang, n)
    return html


def transformar(lang, html, css, js_url):
    u = url(lang)
    viejo = f'https://checkin.campinglamola.com/{lang}/landing.html'
    og_img = f'{SITIO}{ASSETS_URL}/{OG_NOMBRE}'

    html = marcar_temporada(lang, html)

    # Identificadores y URLs propias
    # Un solo @id para el área en los 5 idiomas: las fuentes traen #campground-<idioma>
    html = re.sub(r'https://checkin\.campinglamola\.com/#campground(-[a-z]{2})?', f'{SITIO}/#area-autocaravanas', html)
    html = html.replace(viejo + '#faqs', u + '#faqs')
    for l in LANGS:
        html = html.replace(f'https://checkin.campinglamola.com/{l}/landing.html', url(l))
        html = html.replace(f'../{l}/landing.html', PAGES[l]['path'])
    html = html.replace('https://checkin.campinglamola.com/assets/camping-montana-original.webp', og_img)
    html = html.replace('href="https://campinglamola.com/"', f'href="{HOME[lang]}"')
    html = html.replace('"item": "https://campinglamola.com/"', f'"item": "{SITIO}{HOME[lang]}"')
    html = re.sub(r'(og:image:width" content=")\d+', r'\g<1>1200', html)
    html = re.sub(r'(og:image:height" content=")\d+', r'\g<1>630', html)
    html = html.replace('<meta property="og:image:alt"', '<meta property="og:image:type" content="image/jpeg" />\n  <meta property="og:image:alt"', 1)
    # idiomas alternativos para Open Graph
    alt = ''.join(f'\n  <meta property="og:locale:alternate" content="{OG_LOCALE[l]}" />' for l in LANGS if l != lang)
    html = re.sub(r'(<meta property="og:locale" content="[^"]*" />)', lambda m: m.group(1) + alt, html, 1)
    html = sincronizar_faq(html)
    html = enlazar_camping(html)
    # x-default
    html = re.sub(r'(hreflang="x-default" href=")[^"]+', lambda m: m.group(1) + url(X_DEFAULT), html)

    # Hojas de estilo -> bloque incrustado purgado
    html = re.sub(r'\s*<link rel="stylesheet" href="[^"]+" />', '', html)
    html = html.replace('</head>', f'  <style>{css}</style>\n</head>', 1)

    # Logo y favicon con rutas absolutas
    html = html.replace('../assets/logo.png', f'{ASSETS_URL}/logo-camping-la-mola.png')
    html = html.replace('../assets/favicon.svg', f'{ASSETS_URL}/favicon.svg')
    html = re.sub(r'\s*<link rel="preload" as="image" href="[^"]*logo-camping-la-mola.png" />', '', html)

    # Preload del LCP: AVIF responsive (solo lo descargan los navegadores que lo soportan)
    nombre, anchos, sizes = IMAGENES['camping-montana-original.webp']
    srcset = ', '.join(f'{ASSETS_URL}/img/{nombre}-{w}.avif {w}w' for w in anchos)
    html = re.sub(r'<link rel="preload" as="image" href="\.\./assets/camping-montana-original\.webp"[^>]*/>',
                  f'<link rel="preload" as="image" type="image/avif" imagesrcset="{srcset}" imagesizes="{sizes}" fetchpriority="high" />',
                  html)

    # Fotos
    html = re.sub(r'<img src="\.\./assets/(?!logo)[^"]+"[^>]*>', picture, html)
    # El LCP: dimensiones reales de la variante servida no cambian (width/height = originales)

    # Script del tiempo
    html = re.sub(r'<script defer src="[^"]*meteo\.js"></script>', f'<script defer src="{js_url}"></script>', html)

    # Limpieza de HTML: comentarios y sangrías (sin tocar el contenido de <style>)
    partes = re.split(r'(<style>.*?</style>)', html, flags=re.S)
    for i, p in enumerate(partes):
        if p.startswith('<style>'):
            continue
        p = re.sub(r'<!--.*?-->', '', p, flags=re.S)
        p = re.sub(r'\n[ \t]+', '\n', p)
        p = re.sub(r'\n{2,}', '\n', p)
        partes[i] = p
    html = ''.join(partes)

    assert 'checkin.campinglamola.com/' + lang + '/landing' not in html, lang
    assert '../assets' not in html and '../' + lang not in html, lang
    return html


def main():
    gen = OUT / ASSETS_URL.strip('/')
    if gen.exists():
        shutil.rmtree(gen)
    gen.mkdir(parents=True)
    generar_imagenes(gen / 'img')
    # og en la raíz de assets
    shutil.move(str(gen / 'img' / OG_NOMBRE), str(gen / OG_NOMBRE))
    shutil.copy(SRC / 'assets' / 'logo.png', gen / 'logo-camping-la-mola.png')
    shutil.copy(SRC / 'assets' / 'favicon.svg', gen / 'favicon.svg')

    js = (SRC / 'widget' / 'meteo.js').read_bytes()
    js_nombre = f'meteo.{hashlib.sha256(js).hexdigest()[:8]}.js'
    (gen / js_nombre).write_bytes(js)
    js_url = f'{ASSETS_URL}/{js_nombre}'

    # 1.ª pasada: HTML ya transformado (con <picture>, etc.) sin CSS, para purgar contra el marcado real.
    (AQUI / 'build').mkdir(exist_ok=True)
    previos = []
    for l in LANGS:
        previo = AQUI / 'build' / f'{l}.html'
        previo.write_text(transformar(l, (SRC / l / 'landing.html').read_text(encoding='utf8'), '', js_url), encoding='utf8')
        previos.append(previo)
    css = css_purgado(previos)
    for l in LANGS:
        html = (SRC / l / 'landing.html').read_text(encoding='utf8')
        html = transformar(l, html, css, js_url)
        dest = OUT / PAGES[l]['path'].strip('/') / 'index.html'
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(html, encoding='utf8')
        print(f'{l}: {dest.relative_to(OUT)}  {len(html)/1024:.1f} KB')


if __name__ == '__main__':
    main()
