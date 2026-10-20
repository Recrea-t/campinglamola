/**
 * Widget de tiempo actual para Càmping La Mola (Espot).
 *
 * Un solo nodo: el chip de la cabecera (#meteo-cabecera) con icono animado,
 * temperatura y condición. Es el único nodo con aria-live: el dato «en vivo»
 * de la página. El pie no lleva atribución ni hora.
 *
 * - Llama SOLO a /.netlify/functions/meteo (mismo origen, ver netlify/functions/meteo.js): nunca al proveedor externo.
 * - Refresca cada 10 min y al volver a la pestaña visible.
 * - No re-renderiza si el valor no ha cambiado (huella icono|grupo|temp|locale).
 * - Pinta UN icono cada vez (nunca los 7 en el DOM).
 * - Respeta prefers-reduced-motion (ver meteo.css).
 *
 * Sin dependencias. Se carga con <script defer src="/widget/meteo.js">.
 */
(function () {
  'use strict';

  var INTERVALO_MS = 10 * 60 * 1000; // 10 min

  var LOCALES = {
    es: 'es-ES',
    ca: 'ca-ES',
    en: 'en-GB',
    fr: 'fr-FR',
    nl: 'nl-NL',
  };

  var TEXTOS = {
    es: {
      cargando: 'Consultando…',
      error: 'Sin datos',
      unidad: '°C',
      descripcionChip: 'Tiempo actual en La Mola',
      grupos: {
        clearsky: 'Cielo despejado',
        fair: 'Poco nuboso',
        partlycloudy: 'Intervalos nubosos',
        cloudy: 'Nublado',
        fog: 'Niebla',
        lightrain: 'Llovizna',
        rain: 'Lluvia',
        heavyrain: 'Lluvia fuerte',
        snow: 'Nieve',
        thunder: 'Tormenta',
      },
    },
    ca: {
      cargando: 'Consultant…',
      error: 'Sense dades',
      unidad: '°C',
      descripcionChip: 'Temps actual a La Mola',
      grupos: {
        clearsky: 'Cel serè',
        fair: 'Poc ennuvolat',
        partlycloudy: 'Intervals de núvols',
        cloudy: 'Ennuvolat',
        fog: 'Boira',
        lightrain: 'Plugim',
        rain: 'Pluja',
        heavyrain: 'Pluja forta',
        snow: 'Neu',
        thunder: 'Tempesta',
      },
    },
    en: {
      cargando: 'Checking…',
      error: 'No data',
      unidad: '°C',
      descripcionChip: 'Current weather at La Mola',
      grupos: {
        clearsky: 'Clear sky',
        fair: 'Mostly clear',
        partlycloudy: 'Partly cloudy',
        cloudy: 'Cloudy',
        fog: 'Fog',
        lightrain: 'Light drizzle',
        rain: 'Rain',
        heavyrain: 'Heavy rain',
        snow: 'Snow',
        thunder: 'Thunderstorm',
      },
    },
    fr: {
      cargando: 'Consultation…',
      error: 'Indisponible',
      unidad: '°C',
      descripcionChip: 'Météo actuelle à La Mola',
      grupos: {
        clearsky: 'Ciel dégagé',
        fair: 'Peu nuageux',
        partlycloudy: 'Passages nuageux',
        cloudy: 'Nuageux',
        fog: 'Brouillard',
        lightrain: 'Bruine',
        rain: 'Pluie',
        heavyrain: 'Forte pluie',
        snow: 'Neige',
        thunder: 'Orage',
      },
    },
    nl: {
      cargando: 'Ophalen…',
      error: 'Geen data',
      unidad: '°C',
      descripcionChip: 'Actueel weer op La Mola',
      grupos: {
        clearsky: 'Onbewolkt',
        fair: 'Vrijwel helder',
        partlycloudy: 'Half bewolkt',
        cloudy: 'Bewolkt',
        fog: 'Mist',
        lightrain: 'Motregen',
        rain: 'Regen',
        heavyrain: 'Zware regen',
        snow: 'Sneeuw',
        thunder: 'Onweer',
      },
    },
  };

  // --- iconos -------------------------------------------------------------
  //
  // Set animado del diseño (viewBox 120 de origen) ADAPTADO al tamaño real del
  // chip. El icono vive en una caja de 20 px (18 px en móvil); con trazo 2
  // sobre un lienzo de 120 el trazo real sería 0,33 px: una mancha.
  //
  // Por eso todos los iconos comparten lienzo cuadrado de 104 unidades
  // (viewBox «8 6 104 104») y trazo 7: a 20 px, 1 unidad = 0,192 px, así que
  // el trazo rinde ≈1,35 px reales y quedan ≥8 unidades de margen por lado
  // (el trazo ocupa ±3,5) para que nada se recorte al rotar o flotar.
  //
  // Mapeo (symbol_code de MET Norway, sin sufijo _day/_night/_polartwilight):
  //   clearsky|fair    día   -> sol
  //   clearsky|fair    noche -> noche
  //   partlycloudy     día   -> sol-nubes
  //   partlycloudy     noche -> luna-nubes
  //   cloudy                 -> nublado   (sin icono propio: forma #cloud)
  //   fog                    -> niebla    (nube + líneas, derivada de #cloud)
  //   lightrain|rain|heavyrain|*rainshowers* -> lluvia
  //   lightsnow|snow|heavysnow|*snowshowers*|sleet* -> nieve
  //   *thunder*              -> tormenta
  // Ids de máscara y keyframes prefijados (meteo-*) para no chocar con
  // landing.css/base.css.

  var VB = '8 6 104 104'; // lienzo común: x 8..112, y 6..110
  var SW = '7'; // trazo común -> ≈1,35 px a 20 px

  // Formas del diseño original, sin transformar (medidas con getBBox):
  //   #cloud -> x 24.24..99.76, y 39.44..78, centro (62 · 58.72)
  //   #moon  -> x 42..77.6,    y 40..76,    centro (59.8 · 58)
  var NUBE_D =
    'M34 78C22 78 20 62 34 58C34 44 52 38 62 48C70 34 90 38 90 54C104 56 102 78 90 78Z';
  var LUNA_D = 'M77.6 61.75A18 18 0 1 1 60.2 40A14 14 0 0 0 77.6 61.75Z';

  function nube(tx, ty, clase) {
    return (
      '<path d="' +
      NUBE_D +
      '" transform="translate(' +
      tx +
      ' ' +
      ty +
      ')"' +
      (clase ? ' class="' + clase + '"' : '') +
      '/>'
    );
  }

  /** 8 radios entre r0 y r1 alrededor de (cx,cy). */
  function rayos(cx, cy, r0, r1) {
    var trozos = [];
    for (var i = 0; i < 8; i += 1) {
      var a = (i * Math.PI) / 4;
      var cos = Math.cos(a);
      var sin = Math.sin(a);
      trozos.push(
        '<line x1="' +
          (cx + r0 * cos).toFixed(2) +
          '" y1="' +
          (cy + r0 * sin).toFixed(2) +
          '" x2="' +
          (cx + r1 * cos).toFixed(2) +
          '" y2="' +
          (cy + r1 * sin).toFixed(2) +
          '"/>',
      );
    }
    return trozos.join('');
  }

  function gota(x, y0, y1) {
    return (
      '<line class="meteo-icon-drop" x1="' +
      x +
      '" y1="' +
      y0 +
      '" x2="' +
      x +
      '" y2="' +
      y1 +
      '"/>'
    );
  }

  function copo(x, y, r) {
    return (
      '<g class="meteo-icon-flake">' +
      '<line x1="' +
      x +
      '" y1="' +
      (y - r) +
      '" x2="' +
      x +
      '" y2="' +
      (y + r) +
      '"/>' +
      '<line x1="' +
      (x - r) +
      '" y1="' +
      y +
      '" x2="' +
      (x + r) +
      '" y2="' +
      y +
      '"/>' +
      '</g>'
    );
  }

  function estrella(x, y, r) {
    return (
      '<g class="meteo-icon-star">' +
      '<line x1="' +
      x +
      '" y1="' +
      (y - r) +
      '" x2="' +
      x +
      '" y2="' +
      (y + r) +
      '"/>' +
      '<line x1="' +
      (x - r) +
      '" y1="' +
      y +
      '" x2="' +
      (x + r) +
      '" y2="' +
      y +
      '"/>' +
      '</g>'
    );
  }

  /**
   * Máscara que oculta la parte del sol/luna que cae dentro de la nube.
   * La región 0..120 cubre de sobra el lienzo 8..112; con límites que no
   * contuvieran la figura, Chromium pinta bloques en vez de recortar.
   */
  function mascara(id, tx, ty) {
    return (
      '<mask id="' +
      id +
      '" maskUnits="userSpaceOnUse" x="0" y="0" width="120" height="120">' +
      '<rect x="0" y="0" width="120" height="120" fill="#fff"/>' +
      '<path d="' +
      NUBE_D +
      '" transform="translate(' +
      tx +
      ' ' +
      ty +
      ')" fill="#000" stroke="#000" stroke-width="' +
      SW +
      '"/>' +
      '</mask>'
    );
  }

  // Luna escalada ×1,45 con centro en (56 · 52):  p·1,45 + t = destino.
  var LUNA_NOCHE = 'translate(-30.71 -32.1) scale(1.45)';
  // Luna escalada ×1,25 con centro en (72 · 38), arriba a la derecha de la nube.
  var LUNA_NUBES = 'translate(-2.75 -34.5) scale(1.25)';

  var ICONOS = {
    // Sol: disco r=24 y 8 rayos de r=31 a r=40. Extremos 20..100 (±3,5 ok).
    sol: {
      cuerpo:
        '<g class="meteo-icon-spin">' + rayos(60, 58, 31, 40) + '</g>' +
        '<circle cx="60" cy="58" r="24"/>',
    },

    // Sol tras nube: sol en (76,40) r=16 con rayos 23..28; nube a y+16.
    'sol-nubes': {
      cuerpo:
        mascara('meteo-mask-sol-nubes', -4, 16) +
        '<g mask="url(#meteo-mask-sol-nubes)">' +
        '<g class="meteo-icon-spin-sm">' +
        '<circle cx="76" cy="40" r="16"/>' +
        rayos(76, 40, 23, 28) +
        '</g>' +
        '</g>' +
        nube(-4, 16, 'meteo-icon-float'),
    },

    // Lluvia: nube baja (base de la nube en y 84) y 4 gotas hasta y 101.
    lluvia: {
      cuerpo:
        nube(0, 6) +
        gota(42, 90, 101) +
        gota(60, 90, 101) +
        gota(78, 90, 101) +
        gota(96, 90, 101),
    },

    // Nieve: nube baja y 4 copos centrados en y=96 (r=5 -> 91..101).
    nieve: {
      cuerpo:
        nube(0, 6) +
        copo(42, 96, 5) +
        copo(60, 96, 5) +
        copo(78, 96, 5) +
        copo(96, 96, 5),
    },

    // Tormenta: nube, 2 gotas a la izquierda y rayo a la derecha (y 78..102).
    tormenta: {
      cuerpo:
        nube(0, 4) +
        gota(26, 84, 94) +
        gota(38, 84, 94) +
        // Rayo RELLENO y grande (24x30 unidades ≈ 4,6x5,8 px a 20 px): con
        // trazo fino el propio trazo se come la forma y no se distingue de
        // una gota. Arranca dentro de la nube, como en el diseño original.
        '<path class="meteo-icon-bolt" fill="currentColor" stroke="none" ' +
        'd="M80 76 62 94 72 94 60 106 84 86 74 86Z"/>',
    },

    // Noche despejada: medialuna escalada ×1,45 centrada en (56,52) + 3 estrellas.
    noche: {
      cuerpo:
        '<path d="' +
        LUNA_D +
        '" transform="' +
        LUNA_NOCHE +
        '"/>' +
        estrella(92, 28, 4) +
        estrella(90, 84, 4) +
        estrella(30, 94, 4),
    },

    // Luna tras nube: luna ×1,25 arriba a la derecha y nube a y+16.
    'luna-nubes': {
      cuerpo:
        mascara('meteo-mask-luna-nubes', 0, 16) +
        '<g mask="url(#meteo-mask-luna-nubes)">' +
        '<path d="' +
        LUNA_D +
        '" class="meteo-icon-moon" transform="' +
        LUNA_NUBES +
        '"/>' +
        '</g>' +
        nube(0, 16, 'meteo-icon-float'),
    },

    // No existe icono de «nublado» en el diseño: se reutiliza la forma #cloud
    // del propio set, centrada y con la flotación suave del resto de nubes.
    nublado: {
      cuerpo: nube(-2, 0, 'meteo-icon-float'),
    },

    // Niebla: nube + 3 líneas derivadas de la misma forma.
    niebla: {
      cuerpo:
        nube(0, -2) +
        // Dos líneas, no tres: a 20 px tres líneas separadas 8 unidades se
        // fusionan en una barra sólida y la niebla deja de leerse.
        '<line class="meteo-icon-fog" x1="26" y1="88" x2="100" y2="88"/>' +
        '<line class="meteo-icon-fog" x1="38" y1="102" x2="104" y2="102"/>',
    },

    error: {
      cuerpo:
        '<path d="M60 26 96 94H24Z"/>' +
        '<line x1="60" y1="50" x2="60" y2="70"/>' +
        '<line x1="60" y1="80" x2="60" y2="84"/>',
    },
  };

  // Grupos del API -> icono, cuando no hay symbol_code utilizable (sin día/noche).
  var GRUPO_A_ICONO = {
    clearsky: 'sol',
    fair: 'sol',
    partlycloudy: 'sol-nubes',
    cloudy: 'nublado',
    fog: 'niebla',
    lightrain: 'lluvia',
    rain: 'lluvia',
    heavyrain: 'lluvia',
    snow: 'nieve',
    thunder: 'tormenta',
  };

  var SUFIJO = /_(day|night|polartwilight)$/;

  /**
   * symbol_code de MET Norway -> clave de icono.
   * El sufijo temporal decide día/noche; el resto, la familia de tiempo.
   */
  function iconoDe(symbol, grupo) {
    var crudo = String(symbol || '').toLowerCase();
    var sufijo = (SUFIJO.exec(crudo) || [])[1] || '';
    var base = crudo.replace(SUFIJO, '');
    var noche = sufijo === 'night' || sufijo === 'polartwilight';

    if (!base) return GRUPO_A_ICONO[grupo] || 'nublado';
    if (base.indexOf('thunder') !== -1) return 'tormenta';
    if (base.indexOf('sleet') !== -1 || base.indexOf('snow') !== -1) return 'nieve';
    if (base.indexOf('rain') !== -1 || base.indexOf('drizzle') !== -1) return 'lluvia';
    if (base.indexOf('fog') !== -1) return 'niebla';
    if (base === 'clearsky' || base === 'fair') return noche ? 'noche' : 'sol';
    if (base.indexOf('partlycloudy') !== -1) return noche ? 'luna-nubes' : 'sol-nubes';
    // 'cloudy' y cualquier código desconocido.
    return 'nublado';
  }

  function crearIcono(clave) {
    var icono = ICONOS[clave] || ICONOS.nublado;
    return (
      '<svg class="meteo-chip-icono meteo-icono-anim" viewBox="' +
      VB +
      '" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" ' +
      'stroke-width="' +
      SW +
      '" stroke-linecap="round" stroke-linejoin="round">' +
      icono.cuerpo +
      '</svg>'
    );
  }

  function localeActual() {
    var lang = (document.documentElement.getAttribute('lang') || 'es').toLowerCase();
    var base = lang.split('-')[0];
    return TEXTOS[base] ? base : 'es';
  }

  function formatearTemperatura(valor, locale) {
    return new Intl.NumberFormat(LOCALES[locale], {
      maximumFractionDigits: 0,
    }).format(valor);
  }

  function iniciar() {
    var chip = document.getElementById('meteo-cabecera');
    if (!chip) return; // página sin widget: nada que hacer.

    var nodoIcono = chip.querySelector('[data-meteo="icono"]');
    var nodoTemp = chip.querySelector('[data-meteo="temp"]');
    var nodoUnidad = chip.querySelector('[data-meteo="unidad"]');
    var nodoCondicion = chip.querySelector('[data-meteo="condicion"]');

    // Último estado pintado: evita tocar el DOM (y disparar aria-live)
    // cuando lo recibido es idéntico a lo anterior.
    var ultimo = { huella: null };
    var temporizador = null;
    var pidiendo = false;

    function fijarUnidad(texto) {
      if (nodoUnidad) nodoUnidad.textContent = texto;
    }

    function pintarCargando() {
      var t = TEXTOS[localeActual()];
      nodoTemp.textContent = '—';
      fijarUnidad('');
      nodoCondicion.textContent = t.cargando;
    }

    function pintarError() {
      if (ultimo.huella === 'error') return;
      ultimo.huella = 'error';
      var t = TEXTOS[localeActual()];
      chip.classList.remove('meteo-chip--listo');
      chip.classList.add('meteo-chip--error');
      chip.removeAttribute('title');
      nodoIcono.innerHTML = crearIcono('error');
      nodoTemp.textContent = '—';
      fijarUnidad('');
      nodoCondicion.textContent = t.error;
    }

    function pintarDatos(datos) {
      var locale = localeActual();
      var t = TEXTOS[locale];
      var grupo = t.grupos[datos.descripcion] ? datos.descripcion : 'cloudy';
      var icono = iconoDe(datos.symbol, grupo);
      var temp = formatearTemperatura(datos.tempC, locale);
      var huella = icono + '|' + grupo + '|' + temp + '|' + locale;

      // Sin cambio real: no se toca el DOM (no hay anuncio ni parpadeo).
      if (ultimo.huella === huella) return;

      var primeraVez = ultimo.huella === null || chip.classList.contains('meteo-chip--error');
      var cambioTemperatura =
        ultimo.huella !== null && !primeraVez && nodoTemp.textContent !== temp;

      ultimo.huella = huella;
      chip.classList.remove('meteo-chip--error');
      chip.setAttribute('title', t.descripcionChip);
      nodoIcono.innerHTML = crearIcono(icono);
      nodoTemp.textContent = temp;
      fijarUnidad(t.unidad);
      nodoCondicion.textContent = t.grupos[grupo];

      // Entrada suave la primera vez que hay dato real (envuelve al chip
      // entero; el icono animado no compite con ella).
      if (primeraVez) chip.classList.add('meteo-chip--listo');

      // Transición de opacidad al cambiar la temperatura, sin mover layout.
      if (cambioTemperatura) {
        nodoTemp.classList.remove('meteo-temp--cambio');
        // Reflow mínimo para reiniciar la animación con el mismo valor.
        void nodoTemp.offsetWidth;
        nodoTemp.classList.add('meteo-temp--cambio');
      }
    }

    function consultar(opciones) {
      var silencioso = opciones && opciones.silencioso;
      if (pidiendo) return;
      pidiendo = true;
      if (!silencioso) pintarCargando();

      var controlador = typeof AbortController !== 'undefined' ? new AbortController() : null;
      var corte = controlador ? setTimeout(function () { controlador.abort(); }, 8000) : null;

      fetch('/.netlify/functions/meteo', {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
        signal: controlador ? controlador.signal : undefined,
      })
        .then(function (respuesta) {
          if (!respuesta.ok) throw new Error('HTTP ' + respuesta.status);
          return respuesta.json();
        })
        .then(function (datos) {
          if (!datos || typeof datos.tempC !== 'number') throw new Error('datos inválidos');
          pintarDatos(datos);
        })
        .catch(function () {
          pintarError();
        })
        .then(function () {
          if (corte) clearTimeout(corte);
          pidiendo = false;
        });
    }

    function programar() {
      if (temporizador) clearInterval(temporizador);
      temporizador = setInterval(function () {
        // Con la pestaña oculta no se consulta: se refresca al volver.
        if (document.visibilityState === 'visible') consultar({ silencioso: true });
      }, INTERVALO_MS);
    }

    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible') {
        consultar({ silencioso: true });
        programar();
      }
    });

    consultar({ silencioso: false });
    programar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
