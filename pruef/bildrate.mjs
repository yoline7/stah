import { starte, B } from './wolkenmess.mjs';
const b = await starte();
// scroll-behavior:smooth wuerde die eigene Fuehrung ueberschreiben
const gerade = 'html{scroll-behavior:auto!important}';
const messe = async (vw, vh, extra) => {
  const p = await b.newPage({ viewport: { width: vw, height: vh } });
  await p.goto(B + '/', { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: gerade + (extra || '') });
  await p.waitForTimeout(1200);
  const r = await p.evaluate(async () => {
    const ziel = document.querySelector('.s-e.on-dark');
    const von = ziel.getBoundingClientRect().top + window.scrollY - innerHeight;
    const bis = von + ziel.offsetHeight + innerHeight;
    window.scrollTo(0, von);
    await new Promise((f) => setTimeout(f, 300));
    let n = 0, mitKlasse = 0;
    const start = performance.now();
    return await new Promise((f) => {
      (function s(j) {
        n++;
        if (document.documentElement.classList.contains('blaettert')) mitKlasse++;
        const t = Math.min(1, (j - start) / 4000);
        window.scrollTo(0, von + (bis - von) * t);
        if (t < 1) requestAnimationFrame(s);
        else f({ fps: n / ((performance.now() - start) / 1000), n, mitKlasse, weg: Math.round(window.scrollY - von) });
      })(start);
    });
  });
  await p.close();
  return r;
};
console.log('Bildrate beim Rollen ueber die dunkle Passage, vier Sekunden\n');
for (const [vw, vh, name] of [[1920, 1080, '1920 mal 1080'], [1440, 900, '1440 mal 900'], [1280, 800, '1280 mal 800'], [390, 844, '390 mal 844']]) {
  const r = await messe(vw, vh);
  console.log('  ' + (r.fps >= 55 ? 'ok  ' : 'FEHL') + ' ' + name.padEnd(15) + r.fps.toFixed(1) + ' Bilder je Sekunde   Weg ' + r.weg + ' px, Klasse blaettert in ' + Math.round(r.mitKlasse / r.n * 100) + ' Prozent der Bilder');
}
console.log('\nZum Vergleich, 1440 mal 900:');
for (const [name, css] of [['ohne Wolken', '.wolken{display:none!important}'], ['Wolken ohne Halt beim Blaettern', 'html.blaettert .wolke{animation-play-state:running!important}']]) {
  const r = await messe(1440, 900, css);
  console.log('  ' + name.padEnd(34) + r.fps.toFixed(1) + ' Bilder je Sekunde');
}
await b.close();
