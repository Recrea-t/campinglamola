// uso: node css.js <out.css> <html...>   (base.css + landing.css + meteo.css se pasan por env CSS_FILES separados por coma)
const { PurgeCSS } = require('purgecss');
const { transform } = require('lightningcss');
const fs = require('fs');
(async () => {
  const [out, ...html] = process.argv.slice(2);
  const files = process.env.CSS_FILES.split(',');
  const res = await new PurgeCSS().purge({
    content: html.map(f => ({ raw: fs.readFileSync(f, 'utf8'), extension: 'html' })).concat([{ raw: fs.readFileSync(process.env.METEO_JS, 'utf8'), extension: 'js' }]),
    css: files.map(f => ({ raw: fs.readFileSync(f, 'utf8') })),
    safelist: { standard: [/^meteo-/, /^estado-/], greedy: [/\[open\]/] },
    keyframes: true, fontFace: true, variables: true,
    // Clases/ids (con los caracteres de Tailwind), palabras sueltas y nombres de etiqueta (br, em, summary…).
    defaultExtractor: c => [
      ...(c.match(/[A-Za-z0-9_\-\/:\\\[\]\.%]+/g) || []),
      ...(c.match(/[A-Za-z0-9_-]+/g) || []),
      ...(c.match(/(?<=<)[a-z][a-z0-9]*/g) || []),
    ],
  });
  const css = res.map(r => r.css).join('\n');
  const { code } = transform({ filename: 'a.css', code: Buffer.from(css), minify: true, targets: { chrome: 90 << 16, safari: 14 << 16, firefox: 90 << 16 } });
  fs.writeFileSync(out, code);
  const zlib = require('zlib');
  console.log('raw', files.map(f => fs.statSync(f).size), '-> min', code.length, 'gz', zlib.gzipSync(code).length);
})();
