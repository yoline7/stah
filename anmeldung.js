(function(){
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var PREIS = 145, gaeste = document.getElementById('gaeste');
  function chf(n){
    var p = n.toFixed(2).split('.'), g = p[0];
    if (g.length > 3) g = g.slice(0, g.length - 3) + "'" + g.slice(g.length - 3);
    return 'CHF ' + g + '.' + p[1];
  }
  function anz(){ var e = document.querySelector('input[name=anzahl]:checked'); return e ? +e.value : 1; }
  function bauen(){
    var n = anz(), keep = {};
    gaeste.querySelectorAll('[data-i]').forEach(function(b){
      var i = b.getAttribute('data-i'), s = b.querySelector('input:checked');
      keep['s'+i] = s ? s.value : 'fleisch';
      keep['n'+i] = b.querySelector('input[type=text]').value;
    });
    gaeste.innerHTML = '';
    for (var i = 1; i <= n; i++){
      var d = document.createElement('div');
      d.className = 'pers'; d.setAttribute('data-i', i);
      d.innerHTML =
        '<span class="mono">' + (i === 1 ? 'Erste Person' : i + '. Person') + '</span>' +
        '<div class="row"><div class="fl" style="margin:0;"><span class="mono">Name</span>' +
        '<input type="text" placeholder="' + (i === 1 ? 'wie oben' : 'Vor- und Nachname') + '"></div>' +
        '<div class="fl" style="margin:0;"><span class="mono">Essen</span><div class="chips">' +
        '<label class="chip"><input type="radio" name="e' + i + '" value="fleisch" checked><span>Fleisch</span></label>' +
        '<label class="chip"><input type="radio" name="e' + i + '" value="vegetarisch"><span>Vegetarisch</span></label>' +
        '</div></div></div>';
      gaeste.appendChild(d);
    }
    gaeste.querySelectorAll('[data-i]').forEach(function(b){
      var i = b.getAttribute('data-i');
      if (keep['n'+i]) b.querySelector('input[type=text]').value = keep['n'+i];
      if (keep['s'+i]){ var t = b.querySelector('input[value="'+keep['s'+i]+'"]'); if (t) t.checked = true; }
    });
    document.getElementById('totalwert').textContent = chf(n * PREIS);
    document.getElementById('teiler').textContent = n + (n === 1 ? ' Platz' : ' Plätze') + ' · CHF 145.00';
  }
  document.getElementById('anzahl').addEventListener('change', bauen);
  bauen();

  document.getElementById('senden').addEventListener('click', function(){
    var ok = true;
    ['name','mail'].forEach(function(id){ if (!document.getElementById(id).value.trim()) ok = false; });
    if (!document.getElementById('zustimmung').checked) ok = false;
    var f = document.getElementById('fehler');
    if (!ok){ f.style.display = 'block'; return; }
    f.style.display = 'none';
    document.getElementById('formular').style.display = 'none';
    document.querySelector('.side').style.display = 'none';
    document.getElementById('danke').style.display = 'block';
    window.scrollTo({top:0, behavior: reduce ? 'auto' : 'smooth'});
  });
})();
