/**
 * Tiempo actual en Càmping La Mola (Espot) para el chip de la cabecera de la
 * landing del área de autocaravanas (landing-area/).
 *
 * GET /.netlify/functions/meteo  ->  { tempC, symbol, descripcion, obsTime, source, cached, fetchedAt }
 *
 * - Proxy de MET Norway Locationforecast 2.0 (compact): el navegador nunca
 *   llama al proveedor (exige un User-Agent identificable, que un navegador no
 *   puede fijar).
 * - `altitude=1300`: sin ella el modelo resuelve 1479 m y la temperatura sale
 *   ~1,1 °C más baja que en el camping.
 * - Caché en el CDN de Netlify (10 min) y, además, en memoria de la instancia.
 *   Si el proveedor falla se sirve el último dato bueno (hasta 60 min).
 * - `descripcion` es una clave cerrada (nunca texto del proveedor): el widget la
 *   traduce a los 5 idiomas.
 */

const LAT = '42.5693401';
const LON = '1.1101092';
const ALTITUDE = '1300';

// MET Norway responde 403 sin un User-Agent identificable con contacto real.
const USER_AGENT = 'LaMolaCheckin/1.0 (https://www.campinglamola.com; info@campinglamola.com)';
const UPSTREAM_URL =
  'https://api.met.no/weatherapi/locationforecast/2.0/compact' +
  `?lat=${LAT}&lon=${LON}&altitude=${ALTITUDE}`;

const TTL_MS = 10 * 60 * 1000;
const STALE_MS = 60 * 60 * 1000;
const TIMEOUT_MS = 3000;

let cache = { datos: null, fetchedAt: 0 };

/** symbol_code crudo -> grupo traducible. El orden importa (thunder > heavyrain > rain...). */
function grupoDeSymbol(symbol) {
  const base = String(symbol || '')
    .toLowerCase()
    .replace(/_(day|night|polartwilight)$/, '');

  if (base.includes('thunder')) return 'thunder';
  if (base.includes('heavyrain')) return 'heavyrain';
  if (base.includes('lightrain') || base.includes('drizzle')) return 'lightrain';
  if (base.includes('rain')) return 'rain';
  if (base.includes('sleet') || base.includes('snow')) return 'snow';
  if (base.includes('fog')) return 'fog';
  if (base === 'clearsky') return 'clearsky';
  if (base === 'fair') return 'fair';
  if (base.includes('partlycloudy')) return 'partlycloudy';
  return 'cloudy';
}

async function consultarMetNo() {
  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), TIMEOUT_MS);

  try {
    const respuesta = await fetch(UPSTREAM_URL, {
      headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
      signal: controlador.signal,
    });
    if (!respuesta.ok) throw new Error(`met.no respondió ${respuesta.status}`);

    const cuerpo = await respuesta.json();
    const serie = cuerpo?.properties?.timeseries?.[0];
    if (!serie) throw new Error('respuesta sin timeseries');

    const tempC = serie?.data?.instant?.details?.air_temperature;
    if (typeof tempC !== 'number' || !Number.isFinite(tempC)) {
      throw new Error('respuesta sin air_temperature');
    }

    // El símbolo vive en el resumen de la próxima hora; si no, en el de 6 h.
    const symbol =
      serie?.data?.next_1_hours?.summary?.symbol_code ??
      serie?.data?.next_6_hours?.summary?.symbol_code ??
      'cloudy';

    return {
      tempC,
      symbol,
      descripcion: grupoDeSymbol(symbol),
      obsTime: serie.time,
      source: 'MET Norway',
    };
  } finally {
    clearTimeout(temporizador);
  }
}

async function estadoMeteo() {
  const ahora = Date.now();

  if (cache.datos && ahora - cache.fetchedAt < TTL_MS) {
    return { ...cache.datos, cached: true, fetchedAt: cache.fetchedAt };
  }

  try {
    const datos = await consultarMetNo();
    cache = { datos, fetchedAt: Date.now() };
    return { ...datos, cached: false, fetchedAt: cache.fetchedAt };
  } catch (error) {
    if (cache.datos && ahora - cache.fetchedAt < STALE_MS) {
      console.warn(`[meteo] upstream KO (${error.message}); sirvo el último dato`);
      return { ...cache.datos, cached: true, fetchedAt: cache.fetchedAt, obsoleto: true };
    }
    throw error;
  }
}

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'X-Content-Type-Options': 'nosniff',
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET' && event.httpMethod !== 'HEAD') {
    return {
      statusCode: 405,
      headers: JSON_HEADERS,
      body: JSON.stringify({ error: 'metodo_no_permitido' }),
    };
  }

  try {
    const datos = await estadoMeteo();
    return {
      statusCode: 200,
      headers: {
        ...JSON_HEADERS,
        // Navegador 10 min; CDN 10 min y, si el origen falla, hasta 1 h / 1 día de respaldo.
        'Cache-Control': 'public, max-age=600',
        'Netlify-CDN-Cache-Control':
          'public, s-maxage=600, stale-while-revalidate=3600, stale-if-error=86400',
        ...(datos.obsoleto ? { 'X-Meteo-Stale': '1' } : {}),
      },
      body: JSON.stringify(datos),
    };
  } catch (error) {
    console.error(`[meteo] sin dato servible: ${error.message}`);
    return {
      statusCode: 503,
      headers: { ...JSON_HEADERS, 'Cache-Control': 'no-store' },
      body: JSON.stringify({ error: 'meteo_no_disponible' }),
    };
  }
};
