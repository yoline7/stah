(function(){
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine   = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* Kurve aus der Vorgabe, cubic-bezier(.22,1,.36,1) */
  function kurve(p1x, p1y, p2x, p2y){
    function A(a,b){ return 1 - 3*b + 3*a; }
    function B(a,b){ return 3*b - 6*a; }
    function C(a){ return 3*a; }
    function wert(t,a,b){ return ((A(a,b)*t + B(a,b))*t + C(a))*t; }
    function steig(t,a,b){ return 3*A(a,b)*t*t + 2*B(a,b)*t + C(a); }
    return function(x){
      var t = x;
      for (var i = 0; i < 6; i++){
        var d = steig(t, p1x, p2x);
        if (d === 0) break;
        t -= (wert(t, p1x, p2x) - x) / d;
      }
      return wert(t, p1y, p2y);
    };
  }
  var weich = kurve(.22, 1, .36, 1);
  var wuerfel = function(a, b){ return a + Math.random() * (b - a); };

  /* Kann der Browser den Lichtlauf tragen? Sonst bleibt er ganz weg. */
  var kannLauf = !reduce
    && typeof CSS !== 'undefined' && typeof CSS.registerProperty === 'function'
    && (CSS.supports('mask-composite', 'exclude') || CSS.supports('-webkit-mask-composite', 'xor'))
    && CSS.supports('background', 'conic-gradient(from 0deg, #000, #fff)');
  if (kannLauf) document.documentElement.classList.add('hat-lauf');

  /* Welle und Spur laufen durch die Buchstaben. Ohne background-clip:text bleiben sie weg. */
  var kannWelle = kannLauf && typeof CSS !== 'undefined' && typeof CSS.supports === 'function'
    && (CSS.supports('-webkit-background-clip', 'text') || CSS.supports('background-clip', 'text'));
  if (kannWelle) document.documentElement.classList.add('hat-welle');

  /* ---------- Zustand, wird bei jedem Seitenaufbau neu gefasst ---------- */
  var pg = null, pxs = [], cur = null, hd = null, bg = null, mnu = null;
  var offen = false;
  var laeufer = [], laeuft = false, laufEnde = -1e9, beobachter = [];

  /* Farbpuls. Drei Gruene, ein Orange. Orange hoechstens jeder fuenfte Lauf
     und nie zweimal hintereinander, darum die Zaehlung seitOrange. */
  var farben = ['--puls-1', '--puls-2', '--puls-3', '--puls-4'];
  var seitOrange = 9, letzteFarbe = -1;
  function naechsteFarbe(){
    var i;
    if (seitOrange >= 4 && Math.random() < .55){ i = 3; seitOrange = 0; }
    else {
      do { i = Math.floor(Math.random() * 3); } while (i === letzteFarbe);
      seitOrange++;
    }
    letzteFarbe = i;
    document.documentElement.style.setProperty('--puls', 'var(' + farben[i] + ')');
    return i;
  }

  /* Takt je Art. Kante haeufig, Zahlen seltener, Laufband am seltensten. */
  var takte = {
    kante:  { von:  6000, bis: 10000, dauer: 1400 },
    zahlen: { von: 12000, bis: 18000, dauer: 1400 },
    band:   { von: 18000, bis: 26000, dauer: 1800 }
  };
  var VERSATZ = 140;   /* Versatz je Zahl, daraus wird die Welle */
  var ABSTAND = 2000;  /* Mindestruhe zwischen zwei Bewegungen */
  var band = null, bandX = 0, bandBreite = 0, bandTempo = 0, bandZiel = 0, bandTau = .3;
  var zeigerTempo = .12;

  /* ---------- Fortschritt und Parallaxe ---------- */
  function bild(){
    if (pg){
      var h = document.documentElement.scrollHeight - innerHeight;
      pg.style.width = (h > 0 ? scrollY / h * 100 : 0) + '%';
    }
    if (reduce) return;
    var vh = innerHeight;
    for (var i = 0; i < pxs.length; i++){
      var el = pxs[i], host = el.closest('.mm') || el.parentElement;
      if (!host) continue;
      var r = host.getBoundingClientRect();
      if (r.bottom < -300 || r.top > vh + 300) continue;
      var p = (r.top + r.height / 2 - vh / 2) / vh;
      var f = parseFloat(el.getAttribute('data-px')) || .15;
      el.style.translate = '0 ' + (p * f * 100).toFixed(2) + '%';
    }
  }

  /* ---------- Ein Taktgeber fuer alle Bewegungen ----------
     Nie laufen zwei Bewegungen gleichzeitig. Zwischen zwei Bewegungen liegen
     mindestens zwei Sekunden Ruhe. Jede Bewegung setzt vorher ihre Farbe. */
  function neuFaellig(e){
    var t = takte[e.art];
    e.faellig = performance.now() + wuerfel(t.von, t.bis);
  }

  function starteLauf(e){
    if (!kannLauf || laeuft || document.hidden) return false;
    laeuft = true;
    naechsteFarbe();
    var dauer = takte[e.art].dauer, aufraeumen;

    if (e.art === 'zahlen'){
      if (!kannWelle){ laeuft = false; neuFaellig(e); return false; }
      var zahlen = [].slice.call(e.el.querySelectorAll('b'));
      zahlen.forEach(function(b, i){
        b.style.setProperty('--verzug', (i * VERSATZ) + 'ms');
        b.classList.add('welle');
      });
      dauer += Math.max(0, zahlen.length - 1) * VERSATZ;
      aufraeumen = function(){
        zahlen.forEach(function(b){ b.classList.remove('welle'); b.style.removeProperty('--verzug'); });
      };
    } else if (e.art === 'band'){
      /* Die Spur laeuft ueber die sichtbaren Trennpunkte. Der Versatz kommt aus
         der Lage im Schirm, darum wandert sie von links nach rechts. */
      var breite = innerWidth || 1;
      var punkte = [].slice.call(e.el.querySelectorAll('.track i')).filter(function(k){
        var r = k.getBoundingClientRect();
        return r.right > -40 && r.left < breite + 40;
      });
      if (!punkte.length){ laeuft = false; neuFaellig(e); return false; }
      punkte.forEach(function(k){
        var x = k.getBoundingClientRect().left;
        k.style.setProperty('--verzug', Math.round(Math.max(0, Math.min(1, x / breite)) * 900) + 'ms');
        k.classList.add('punkt');
      });
      e.el.classList.add('spur');
      aufraeumen = function(){
        e.el.classList.remove('spur');
        punkte.forEach(function(k){ k.classList.remove('punkt'); k.style.removeProperty('--verzug'); });
      };
    } else {
      e.el.classList.add('aktiv');
      aufraeumen = function(){ e.el.classList.remove('aktiv'); };
    }

    setTimeout(function(){
      aufraeumen();
      laufEnde = performance.now();
      laeuft = false;
    }, dauer + 60);
    neuFaellig(e);
    return true;
  }

  function takt(){
    if (!kannLauf || laeuft || document.hidden) return;
    var t = performance.now();
    if (t - laufEnde < ABSTAND) return;
    var dran = [];
    for (var i = 0; i < laeufer.length; i++){
      if (laeufer[i].sichtbar && laeufer[i].faellig <= t) dran.push(laeufer[i]);
    }
    if (!dran.length) return;
    starteLauf(dran[Math.floor(Math.random() * dran.length)]);
  }

  /* ---------- Zahlen im Faktenfeld ---------- */
  function zaehle(b){
    if (b.dataset.gezaehlt) return;
    b.dataset.gezaehlt = '1';
    var knoten = b.firstChild;
    if (!knoten || knoten.nodeType !== 3) return;
    var roh = knoten.nodeValue.trim();
    var treffer = roh.match(/^(\d+)(.*)$/);
    if (!treffer) return;
    var ziel = parseInt(treffer[1], 10), rest = treffer[2];
    if (reduce || ziel === 0){ return; }
    var start = performance.now();
    knoten.nodeValue = '0' + rest;
    (function schritt(jetzt){
      var t = Math.min(1, (jetzt - start) / 900);
      knoten.nodeValue = Math.round(weich(t) * ziel) + rest;
      if (t < 1) requestAnimationFrame(schritt);
      else knoten.nodeValue = ziel + rest;
    })(start);
  }

  /* ---------- Laufband ---------- */
  function bandBild(dt){
    if (!band || reduce) return;
    var k = 1 - Math.exp(-dt / (bandTau * 1000));
    bandTempo += (bandZiel - bandTempo) * k;
    bandX -= bandTempo * dt;
    if (bandBreite > 0 && bandX <= -bandBreite / 2) bandX += bandBreite / 2;
    band.style.transform = 'translate3d(' + bandX.toFixed(2) + 'px,0,0)';
  }

  /* ---------- Zeiger ---------- */
  var zx = 0, zy = 0, zcx = 0, zcy = 0;

  /* ---------- Aufbau je Seite ---------- */
  function auf(){
    pg  = document.getElementById('pg');
    cur = document.getElementById('cur');
    hd  = document.getElementById('hd');
    bg  = document.getElementById('bg');
    mnu = document.getElementById('menu');
    pxs = [].slice.call(document.querySelectorAll('.px[data-px]'));

    /* Enthuellung */
    var ziele = document.querySelectorAll('.fu, .rl, .mm');
    if ('IntersectionObserver' in window && !reduce){
      var io = new IntersectionObserver(function(es){
        es.forEach(function(e){
          if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
        });
      }, { threshold:.1, rootMargin:'0px 0px -6% 0px' });
      [].forEach.call(ziele, function(el){ io.observe(el); });
    } else {
      [].forEach.call(ziele, function(el){ el.classList.add('in'); });
    }
    setTimeout(function(){
      document.querySelectorAll('.hero .rl, .hero .fu, .hero .px').forEach(function(el){ el.classList.add('in'); });
    }, 120);

    /* Menue, nur einmal je Kopfzeile */
    if (hd && bg && mnu && !bg.dataset.bereit){
      bg.dataset.bereit = '1';
      var setze = function(z){
        offen = z;
        hd.classList.toggle('open', z);
        bg.setAttribute('aria-expanded', z ? 'true' : 'false');
        bg.setAttribute('aria-label', z ? (bg.dataset.zu || '') : (bg.dataset.auf || ''));
        document.body.style.overflow = z ? 'hidden' : '';
      };
      bg.addEventListener('click', function(){ setze(!offen); });
      mnu.querySelectorAll('a').forEach(function(a){
        a.addEventListener('click', function(){ setze(false); });
      });
      addEventListener('keydown', function(e){
        if (e.key === 'Escape' && offen){ setze(false); bg.focus(); }
      });
    }
    if (hd) hd.classList.remove('open');
    document.body.style.overflow = '';
    offen = false;

    /* Lichtlauf: vier Stellen, sonst nirgends */
    beobachter.forEach(function(o){ o.disconnect(); });
    beobachter = [];
    laeufer = [];
    if (kannLauf){
      var stellen = [];
      var bar = document.querySelector('#hd .bar');
      if (bar){ bar.classList.add('lauf-kante'); stellen.push({ el: bar, art: 'kante' }); }
      document.querySelectorAll('.facts').forEach(function(el){
        el.classList.add('lauf');
        stellen.push({ el: el, art: 'kante' });
        stellen.push({ el: el, art: 'zahlen' });
      });
      document.querySelectorAll('#hd .cta, .send').forEach(function(el){
        el.classList.add('lauf'); stellen.push({ el: el, art: 'kante' });
      });
      document.querySelectorAll('.tick').forEach(function(el){
        stellen.push({ el: el, art: 'band' });
      });

      stellen.forEach(function(st){
        var e = { el: st.el, art: st.art, sichtbar: false, faellig: 0 };
        neuFaellig(e);
        laeufer.push(e);
        if ('IntersectionObserver' in window){
          var o = new IntersectionObserver(function(es){ e.sichtbar = es[0].isIntersecting; },
            { threshold:.15 });
          o.observe(st.el); beobachter.push(o);
        } else { e.sichtbar = true; }
      });
      /* Beim Zeigen auf einen Knopf laeuft er sofort, danach greift der Takt */
      document.querySelectorAll('#hd .cta, .send').forEach(function(el){
        if (el.dataset.laufBereit) return;
        el.dataset.laufBereit = '1';
        el.addEventListener('mouseenter', function(){
          for (var i = 0; i < laeufer.length; i++){
            if (laeufer[i].el === el && laeufer[i].art === 'kante') starteLauf(laeufer[i]);
          }
        });
      });
    }

    /* Wolken ruhen ausserhalb des Sichtfelds. Reine Leistungsbremse,
       die Bewegung selbst laeuft ohne JavaScript. */
    var wolken = document.querySelectorAll('.wolken');
    if (wolken.length && 'IntersectionObserver' in window){
      var wio = new IntersectionObserver(function(es){
        es.forEach(function(e){ e.target.classList.toggle('ruht', !e.isIntersecting); });
      }, { rootMargin:'10% 0px' });
      wolken.forEach(function(el){ wio.observe(el); });
      beobachter.push(wio);
    }

    /* Zahlen */
    var zahlen = document.querySelectorAll('.facts b');
    if (zahlen.length){
      if ('IntersectionObserver' in window && !reduce){
        var zio = new IntersectionObserver(function(es){
          es.forEach(function(e){ if (e.isIntersecting){ zaehle(e.target); zio.unobserve(e.target); } });
        }, { threshold:.4 });
        zahlen.forEach(function(b){ zio.observe(b); });
      }
    }

    /* Laufband */
    band = document.querySelector('.tick .track');
    if (band && !reduce){
      band.classList.add('gefuehrt');
      bandBreite = band.scrollWidth;
      bandX = 0;
      bandZiel = (bandBreite / 2) / 44000;
      bandTempo = bandZiel;
      if (!band.dataset.bereit){
        band.dataset.bereit = '1';
        band.addEventListener('mouseenter', function(){ bandZiel = 0; bandTau = .2; });
        band.addEventListener('mouseleave', function(){ bandZiel = (bandBreite / 2) / 44000; bandTau = .3; });
      }
    }

    /* Zeiger */
    if (fine && !reduce && cur){
      document.body.classList.add('cc');
      document.querySelectorAll('a, button, summary, label, input').forEach(function(el){
        if (el.dataset.zeiger) return;
        el.dataset.zeiger = '1';
        el.addEventListener('mouseenter', function(){ cur.classList.add('on'); zeigerTempo = .20; });
        el.addEventListener('mouseleave', function(){ cur.classList.remove('on'); zeigerTempo = .12; });
      });
      document.querySelectorAll('#hd .cta, .send').forEach(function(el){
        if (el.dataset.zeigerKnopf) return;
        el.dataset.zeigerKnopf = '1';
        el.addEventListener('mouseenter', function(){ cur.classList.add('knopf'); });
        el.addEventListener('mouseleave', function(){ cur.classList.remove('knopf'); });
      });
      document.querySelectorAll('.band').forEach(function(el){
        if (el.dataset.zeiger) return;
        el.dataset.zeiger = '1';
        el.addEventListener('mouseenter', function(){ cur.classList.add('klein'); });
        el.addEventListener('mouseleave', function(){ cur.classList.remove('klein'); });
      });
    }

    bild();
  }

  /* ---------- Globale Horcher, genau einmal ---------- */
  var wartet = false;
  addEventListener('scroll', function(){
    if (wartet) return;
    wartet = true;
    requestAnimationFrame(function(){ bild(); wartet = false; });
  }, { passive:true });
  addEventListener('resize', function(){
    bild();
    if (band){ bandBreite = band.scrollWidth; bandZiel = (bandBreite / 2) / 44000; }
  });
  addEventListener('mousemove', function(e){ zx = e.clientX; zy = e.clientY; });
  document.addEventListener('visibilitychange', function(){
    if (!document.hidden){
      laufEnde = performance.now();
      for (var i = 0; i < laeufer.length; i++) neuFaellig(laeufer[i]);
    }
  });

  var vorher = 0;
  (function schleife(jetzt){
    var dt = vorher ? Math.min(64, jetzt - vorher) : 16;
    vorher = jetzt;
    if (fine && !reduce && cur){
      zcx += (zx - zcx) * zeigerTempo;
      zcy += (zy - zcy) * zeigerTempo;
      cur.style.transform = 'translate(' + zcx.toFixed(1) + 'px,' + zcy.toFixed(1) + 'px)';
    }
    bandBild(dt);
    requestAnimationFrame(schleife);
  })(0);

  setInterval(takt, 250);

  if (document.readyState !== 'loading') auf();
  else addEventListener('DOMContentLoaded', auf);
  document.addEventListener('astro:page-load', auf);
})();
