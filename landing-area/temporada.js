/**
 * Estado de la landing del área según data/temporada.json (sección «Temporada» del CMS).
 *
 * Lo aplica gatsby-node.js (onPostBuild) a las landings estáticas de static/, que
 * build.py genera con: el bàner de verano oculto y vacío (.temporada), la nota de
 * estado del hero (#estado-area) y los botones de check-in marcados (data-checkin).
 *
 * - Temporada de verano: bàner visible, check-in desactivado, sin horario en el schema.
 * - Fuera del verano el área está abierta salvo que las fechas (opcionales) digan otra cosa:
 *   solo «desde» → abre ese día; solo «hasta» → abierta hasta ese día incluido;
 *   las dos → abierta entre ellas, o, si «desde» es posterior a «hasta», cerrada
 *   entre ellas (cierre temporal con fecha de vuelta).
 *   El día cambia sin volver a publicar: un script en línea repite el cálculo en el
 *   navegador y actualiza la nota y los botones.
 * - Schema: openingHoursSpecification (todos los días, horario del check-in) con
 *   validFrom/validThrough según las fechas que haya.
 */

const DIAS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]
const ABRE = "09:00"
const CIERRA = "22:00"

const LOCALE = { ca: "ca", es: "es", en: "en-GB", fr: "fr", nl: "nl" }

// Fecha legible en cada idioma. Catalán: «l’1 / l’11» (artículo apostrofado);
// francés: «1er».
const fechaLarga = (lang, iso) => {
  const texto = new Intl.DateTimeFormat(LOCALE[lang], {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`))
  return lang === "fr" ? texto.replace(/^1 /, "1er ") : texto
}
const articuloCa = fecha => (/^1{1,2} /.test(fecha) ? "l’" : "el ")

// Textos de la nota de estado. Cada uno recibe la fecha ya formateada.
const TEXTOS = {
  ca: {
    abierta: () => "Àrea oberta · check-in cada dia de 9:00 a 22:00h",
    abiertaHasta: f =>
      `Àrea oberta fins ${
        articuloCa(f) === "l’" ? "a l’" : "al "
      }${f} · check-in de 9:00 a 22:00h`,
    abre: f => `Àrea tancada · obrim ${articuloCa(f)}${f}`,
    cerrada: () => "Àrea tancada temporalment",
    verano: () => "Àrea tancada durant la temporada d’estiu",
  },
  es: {
    abierta: () => "Área abierta · check-in todos los días de 9:00 a 22:00h",
    abiertaHasta: f => `Área abierta hasta el ${f} · check-in de 9:00 a 22:00h`,
    abre: f => `Área cerrada · abrimos el ${f}`,
    cerrada: () => "Área cerrada temporalmente",
    verano: () => "Área cerrada durante la temporada de verano",
  },
  en: {
    abierta: () => "Area open · check-in daily from 9:00 to 22:00",
    abiertaHasta: f => `Area open until ${f} · check-in from 9:00 to 22:00`,
    abre: f => `Area closed · opening on ${f}`,
    cerrada: () => "Area temporarily closed",
    verano: () => "Area closed during the summer season",
  },
  fr: {
    abierta: () => "Aire ouverte · check-in tous les jours de 9h à 22h",
    abiertaHasta: f => `Aire ouverte jusqu’au ${f} · check-in de 9h à 22h`,
    abre: f => `Aire fermée · ouverture le ${f}`,
    cerrada: () => "Aire temporairement fermée",
    verano: () => "Aire fermée pendant la saison d’été",
  },
  nl: {
    abierta: () =>
      "Camperplaats open · dagelijks inchecken van 9:00 tot 22:00 uur",
    abiertaHasta: f =>
      `Camperplaats open tot ${f} · inchecken van 9:00 tot 22:00 uur`,
    abre: f => `Camperplaats gesloten · we openen op ${f}`,
    cerrada: () => "Camperplaats tijdelijk gesloten",
    verano: () => "Camperplaats gesloten tijdens het zomerseizoen",
  },
}

// --- Funciones que también se incrustan en la página (function + ES5) -------

// Hoy en Espot como AAAA-MM-DD (las fechas del CMS son días locales).
function hoyEnEspot() {
  var p = {}
  new Intl.DateTimeFormat("en", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .formatToParts(new Date())
    .forEach(function (x) {
      p[x.type] = x.value
    })
  return p.year + "-" + p.month + "-" + p.day
}

// "abierta" | "abiertaHasta" | "abre" (cerrada, con fecha de apertura) | "cerrada".
// Las fechas AAAA-MM-DD se comparan como texto.
function estadoArea(desde, hasta, hoy) {
  var abierta =
    desde && hasta && desde > hasta
      ? hoy <= hasta || hoy >= desde
      : (!desde || hoy >= desde) && (!hasta || hoy <= hasta)
  if (abierta) return hasta && hoy <= hasta ? "abiertaHasta" : "abierta"
  return desde && hoy < desde ? "abre" : "cerrada"
}

// Pone la nota y los botones de check-in en el estado indicado.
function pintarEstadoArea(estado, textos) {
  var nota = document.getElementById("estado-area")
  var abierta = estado === "abierta" || estado === "abiertaHasta"
  nota.textContent = textos[estado]
  nota.classList.toggle("estado-cerrada", !abierta)
  document.querySelectorAll("[data-checkin]").forEach(function (a) {
    if (abierta && !a.hasAttribute("href")) {
      a.setAttribute("href", a.getAttribute("data-checkin"))
      a.removeAttribute("role")
      a.removeAttribute("aria-disabled")
    } else if (!abierta && a.hasAttribute("href")) {
      a.setAttribute("data-checkin", a.getAttribute("href"))
      a.removeAttribute("href")
      a.setAttribute("role", "link")
      a.setAttribute("aria-disabled", "true")
    }
  })
}

// --- Build --------------------------------------------------------------------

const escaparHtml = texto =>
  String(texto || "")
    .trim()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")

const fechaValida = (valor, nombre) => {
  const iso = String(valor || "").trim()
  if (iso && !/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    throw new Error(`la fecha «${nombre}» no es AAAA-MM-DD: ${iso}`)
  }
  return iso
}

const reemplazarUna = (html, patron, sustituto, que) => {
  if (!patron.test(html)) {
    throw new Error(
      `la landing no trae ${que} (regenérala con landing-area/build.py)`
    )
  }
  return html.replace(patron, () => sustituto)
}

// <a class="button" href="https://checkin…" data-checkin> → sin href (no navega);
// la URL queda en data-checkin para que el script pueda reactivarlo.
const desactivarCheckin = html => {
  let botones = 0
  const resultado = html.replace(/ href="([^"]*)" data-checkin>/g, (_, url) => {
    botones++
    return ` data-checkin="${url}" role="link" aria-disabled="true">`
  })
  if (botones === 0) throw new Error("la landing no trae botones de check-in")
  return resultado
}

const horario = (desde, hasta) => {
  const tramo = extra => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: DIAS,
    opens: ABRE,
    closes: CIERRA,
    ...extra,
  })
  if (desde && hasta && desde > hasta) {
    return [tramo({ validThrough: hasta }), tramo({ validFrom: desde })]
  }
  return [
    tramo({
      ...(desde && { validFrom: desde }),
      ...(hasta && { validThrough: hasta }),
    }),
  ]
}

const ponerHorario = (html, especificacion) => {
  const m = html.match(
    /(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/
  )
  if (!m) throw new Error("la landing no trae JSON-LD")
  const datos = JSON.parse(m[2])
  const area = datos["@graph"].find(n =>
    [].concat(n["@type"]).includes("Campground")
  )
  if (especificacion) area.openingHoursSpecification = especificacion
  else delete area.openingHoursSpecification
  // Mismo formato que build.py (sin sangrías); «<» escapado dentro de <script>.
  const json = JSON.stringify(datos, null, 2)
    .replace(/\n\s+/g, "\n")
    .replace(/</g, "\\u003c")
  return html.replace(m[0], () => `${m[1]}\n${json}\n${m[3]}`)
}

const ponerNota = (html, texto, cerrada) =>
  reemplazarUna(
    html,
    /<p class="hero-note estado-area" id="estado-area">[^<]*<\/p>/,
    `<p class="hero-note estado-area${
      cerrada ? " estado-cerrada" : ""
    }" id="estado-area">${escaparHtml(texto)}</p>`,
    "la nota de estado (#estado-area)"
  )

const aplicarVerano = (html, lang, textos = {}) => {
  // La primera línea del texto del bàner es el titular; el resto, el detalle.
  const [titulo, ...detalle] = escaparHtml(textos.banner).split(/\s*\n\s*/)
  const boton = escaparHtml(textos.boton)
  if (!titulo || !boton) throw new Error("falta el texto del bàner o del botón")

  html = reemplazarUna(
    html,
    /<div class="temporada" hidden>/,
    `<div class="temporada">`,
    "el bàner"
  )
  html = reemplazarUna(
    html,
    /<strong class="temporada-titulo"><\/strong><span class="temporada-detalle"><\/span>/,
    `<strong class="temporada-titulo">${titulo}</strong><span class="temporada-detalle">${detalle.join(
      "<br>"
    )}</span>`,
    "el texto del bàner"
  )
  html = reemplazarUna(
    html,
    /<span class="temporada-boton-texto"><\/span>/,
    `<span class="temporada-boton-texto">${boton}</span>`,
    "el botón del bàner"
  )
  html = ponerNota(html, TEXTOS[lang].verano(), true)
  html = desactivarCheckin(html)
  return ponerHorario(html, null)
}

const aplicarFechas = (html, lang, desde, hasta, hoy) => {
  const t = TEXTOS[lang]
  const textos = {
    abierta: t.abierta(),
    abiertaHasta: hasta ? t.abiertaHasta(fechaLarga(lang, hasta)) : "",
    abre: desde ? t.abre(fechaLarga(lang, desde)) : "",
    cerrada: t.cerrada(),
  }
  const estado = estadoArea(desde, hasta, hoy)
  const abierta = estado === "abierta" || estado === "abiertaHasta"

  html = ponerNota(html, textos[estado], !abierta)
  if (!abierta) html = desactivarCheckin(html)
  html = ponerHorario(html, horario(desde, hasta))

  // Sin fechas el estado no cambia nunca: no hace falta script.
  if (!desde && !hasta) return html
  const script =
    `<script>(function(d){(${pintarEstadoArea})((${estadoArea})(d.desde,d.hasta,(${hoyEnEspot})()),d.textos)})(` +
    `${JSON.stringify({ desde, hasta, textos }).replace(
      /</g,
      "\\u003c"
    )})</script>`
  return html.replace("</body>", () => `${script}\n</body>`)
}

/** HTML de la landing de `lang` según `temporada` (data/temporada.json). */
const aplicarTemporada = (html, lang, temporada, hoy = hoyEnEspot()) => {
  if (temporada.verano) return aplicarVerano(html, lang, temporada[lang])
  const area = temporada.area || {}
  const desde = fechaValida(area.desde, "Oberta des de")
  const hasta = fechaValida(area.hasta, "Oberta fins a")
  return aplicarFechas(html, lang, desde, hasta, hoy)
}

module.exports = { aplicarTemporada, estadoArea, hoyEnEspot }
