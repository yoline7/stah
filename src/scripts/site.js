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

  /* ---------- Zustand, wird bei jedem Seitenaufbau neu gefasst ---------- */
  var pg = null, pxs = [], cur = null, hd = null, bg = null, mnu = null;
  var offen = false;
  var laeufer = [], laeuft = false, letzterStart = -1e9, beobachter = [];
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

  /* ---------- Lichtlauf, ein Taktgeber fuer alle ---------- */
  function starteLauf(e){
    if (!kannLauf || laeuft || document.hidden) return false;
    laeuft = true; letzterStart = performance.now();
    e.el.classList.add('aktiv');
    setTimeout(function(){
      e.el.classList.remove('aktiv');
      laeuft = false;
    }, 1650);
    e.faellig = performance.now() + wuerfel(9000, 14000);
    return true;
  }

  function takt(){
    if (!kannLauf || laeuft || document.hidden) return;
    var t = performance.now();
    /* Mindestabstand 2.5 Sekunden nach dem Ende des letzten Laufs */
    if (t - letzterStart < 1600 + 2500) return;
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
        bg.setAttribute('aria-label', z ? 'Menü schliessen' : 'Menü öffnen');
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
      if (bar){ bar.classList.add('lauf-kante'); stellen.push(bar); }
      document.querySelectorAll('.facts').forEach(function(el){ el.classList.add('lauf'); stellen.push(el); });
      document.querySelectorAll('#hd .cta, .send').forEach(function(el){ el.classList.add('lauf'); stellen.push(el); });

      var jetzt = performance.now();
      stellen.forEach(function(el){
        var e = { el: el, sichtbar: false, faellig: jetzt + wuerfel(9000, 14000) };
        laeufer.push(e);
        if ('IntersectionObserver' in window){
          var o = new IntersectionObserver(function(es){ e.sichtbar = es[0].isIntersecting; },
            { threshold:.15 });
          o.observe(el); beobachter.push(o);
        } else { e.sichtbar = true; }
      });
      /* Beim Zeigen auf einen Knopf laeuft er sofort, danach greift der Takt */
      document.querySelectorAll('#hd .cta, .send').forEach(function(el){
        if (el.dataset.laufBereit) return;
        el.dataset.laufBereit = '1';
        el.addEventListener('mouseenter', function(){
          for (var i = 0; i < laeufer.length; i++) if (laeufer[i].el === el) starteLauf(laeufer[i]);
        });
      });
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
      var t = performance.now();
      letzterStart = t;
      for (var i = 0; i < laeufer.length; i++) laeufer[i].faellig = t + wuerfel(9000, 14000);
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
