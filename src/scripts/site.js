(function(){
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* Fortschritt und Parallaxe */
  var pg = document.getElementById('pg');
  var pxs = [].slice.call(document.querySelectorAll('.px[data-px]'));
  function frame(){
    var h = document.documentElement.scrollHeight - innerHeight;
    pg.style.width = (h > 0 ? scrollY / h * 100 : 0) + '%';
    if (reduce) return;
    var vh = innerHeight;
    for (var i = 0; i < pxs.length; i++){
      var el = pxs[i], host = el.closest('.mm') || el.parentElement;
      var r = host.getBoundingClientRect();
      if (r.bottom < -300 || r.top > vh + 300) continue;
      var p = (r.top + r.height / 2 - vh / 2) / vh;
      var f = parseFloat(el.getAttribute('data-px')) || .15;
      el.style.translate = '0 ' + (p * f * 100).toFixed(2) + '%';
    }
  }
  var t = false;
  addEventListener('scroll', function(){ if (t) return; t = true; requestAnimationFrame(function(){ frame(); t = false; }); }, {passive:true});
  addEventListener('resize', frame);
  frame();

  /* Enthuellung */
  var targets = document.querySelectorAll('.fu, .rl, .mm');
  if ('IntersectionObserver' in window && !reduce){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){
        if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, {threshold:.1, rootMargin:'0px 0px -6% 0px'});
    [].forEach.call(targets, function(el){ io.observe(el); });
  } else {
    [].forEach.call(targets, function(el){ el.classList.add('in'); });
  }
  setTimeout(function(){
    document.querySelectorAll('.hero .rl, .hero .fu, .hero .px').forEach(function(el){ el.classList.add('in'); });
  }, 120);

  /* Menue */
  var hd = document.getElementById('hd');
  var bg = document.getElementById('bg');
  var mnu = document.getElementById('menu');
  if (hd && bg && mnu){
    var offen = false;
    var setze = function(auf){
      offen = auf;
      hd.classList.toggle('open', auf);
      bg.setAttribute('aria-expanded', auf ? 'true' : 'false');
      bg.setAttribute('aria-label', auf ? 'Men\u00fc schliessen' : 'Men\u00fc \u00f6ffnen');
      document.body.style.overflow = auf ? 'hidden' : '';
    };
    bg.addEventListener('click', function(){ setze(!offen); });
    mnu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ setze(false); });
    });
    addEventListener('keydown', function(e){
      if (e.key === 'Escape' && offen){ setze(false); bg.focus(); }
    });
  }

  /* Zeiger */
  if (fine && !reduce){
    document.body.classList.add('cc');
    var cur = document.getElementById('cur'), x = 0, y = 0, cx = 0, cy = 0;
    addEventListener('mousemove', function(e){ x = e.clientX; y = e.clientY; });
    (function loop(){
      cx += (x - cx) * .18; cy += (y - cy) * .18;
      cur.style.transform = 'translate(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px)';
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a, button, summary, label, input').forEach(function(el){
      el.addEventListener('mouseenter', function(){ cur.classList.add('on'); });
      el.addEventListener('mouseleave', function(){ cur.classList.remove('on'); });
    });
  }

})();
