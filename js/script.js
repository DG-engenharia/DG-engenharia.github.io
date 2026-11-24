/* DG Engenharia e Soluções Ambientais – interações do site */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // cabeçalho e menu
  // cabeçalho: fica visível no topo; ao rolar para baixo some, volta ao rolar para cima ou ao levar o mouse ao topo
  const hd = $('#hd'), menu = $('#menu'), mbt = $('#mbt'), heroEl = $('.hero');
  if (hd) {
    let lastY = scrollY;
    const limite = () => heroEl ? heroEl.offsetHeight - 120 : 220;
    const mostra = () => hd.classList.remove('oculto');
    const onS = () => {
      const y = scrollY;
      if (!hd.classList.contains('fixo')) hd.classList.toggle('solid', y > 40);
      hd.classList.toggle('compacto', y > 40);
      if (y < limite() || (menu && menu.classList.contains('ab'))) mostra();
      else if (y > lastY + 6) hd.classList.add('oculto');
      else if (y < lastY - 6) mostra();
      lastY = y;
    };
    addEventListener('scroll', onS, { passive: true }); onS();
    addEventListener('mousemove', e => { if (e.clientY < 90) mostra(); }, { passive: true });
    hd.addEventListener('focusin', mostra);
  }
  if (mbt) mbt.addEventListener('click', () => { const ab = menu.classList.toggle('ab'); mbt.setAttribute('aria-expanded', ab); });
  $$('#menu a').forEach(a => a.addEventListener('click', () => menu.classList.remove('ab')));
  const ano = $('#ano'); if (ano) ano.textContent = new Date().getFullYear();

  // slides da capa
  const sl = $$('.slide'), db = $$('#dots button');
  if (sl.length) {
    let hI = 0, hT;
    const hero = i => { sl.forEach((s, j) => s.classList.toggle('on', j === i)); db.forEach((d, j) => { d.classList.remove('on'); void d.offsetWidth; d.classList.toggle('on', j === i); }); hI = i; };
    const auto = () => { clearInterval(hT); hT = setInterval(() => hero((hI + 1) % sl.length), 6000); };
    db.forEach((d, i) => d.addEventListener('click', () => { hero(i); auto(); })); auto();
  }

  // abas de serviços
  const grade = $('#grade');
  $$('#tabs button').forEach(b => b.addEventListener('click', () => {
    $$('#tabs button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); });
    const g = b.dataset.g;
    grade.classList.toggle('filtrado', g !== 'todos'); grade.classList.toggle('dense', g === 'todos'); 
    $$('.sv', grade).forEach((c, i) => { const v = g === 'todos' || c.dataset.g.split(' ').includes(g); c.classList.toggle('oculto', !v); if (v) { c.style.animation = 'none'; void c.offsetWidth; c.style.animation = ''; c.style.animationDelay = i * 50 + 'ms'; } });
  }));

  // explorador de camadas (cenários)
  $$('#cen button').forEach(b => b.addEventListener('click', () => {
    $$('#cen button').forEach(x => x.classList.toggle('on', x === b));
    $$('.exp-un').forEach(u => { u.classList.toggle('oculto', u.dataset.c !== b.dataset.c); if (u.dataset.c === b.dataset.c) u.classList.add('vis2'); });
  }));
  $$('.exp-un').forEach(un => {
    const mapa = $('.mapa', un);
    const legs = () => {
      const base = ($('.seg button.on', un) || {}).dataset?.b;
      $$('.leg', un).forEach(l => {
        const okL = l.dataset.showL ? $(`[data-l="${l.dataset.showL}"]`, un).checked : true;
        const okB = l.dataset.showB ? base === l.dataset.showB : true;
        let on = okL && okB;
        if (l.dataset.showL && $$('.leg[data-show-b]', un).some(x => x.dataset.showB === base)) on = false;
        l.classList.toggle('on', on);
      });
    };
    $$('.seg button', un).forEach(b => b.addEventListener('click', () => {
      $$('.seg button', un).forEach(x => x.classList.toggle('on', x === b));
      $$('[data-base]', mapa).forEach(m => m.classList.toggle('off', m.dataset.base !== b.dataset.b)); legs();
    }));
    $$('input[data-l]', un).forEach(c => c.addEventListener('change', () => { $(`[data-lay="${c.dataset.l}"]`, mapa).classList.toggle('off', !c.checked); legs(); }));
    legs();
  });

  // antes e depois (com abas)
  $$('#ad-tabs button').forEach(b => b.addEventListener('click', () => {
    $$('#ad-tabs button').forEach(x => x.classList.toggle('on', x === b));
    $$('.ad-un').forEach(u => { u.classList.toggle('oculto', u.dataset.a !== b.dataset.a); $$('.rev', u).forEach(r => r.classList.add('vis2')); });
  }));
  $$('.ad').forEach(ad => {
    const top = $('.top', ad), bar = $('.bar', ad); let drag = false;
    const set = x => { const r = ad.getBoundingClientRect(); const p = Math.min(100, Math.max(0, (x - r.left) / r.width * 100)); top.style.clipPath = `inset(0 ${100 - p}% 0 0)`; bar.style.left = p + '%'; };
    ad.addEventListener('pointerdown', e => { drag = true; ad.setPointerCapture(e.pointerId); set(e.clientX); });
    ad.addEventListener('pointermove', e => { if (drag) set(e.clientX); });
    ad.addEventListener('pointerup', () => { drag = false; });
  });

  // etapas do processo
  const passos = $$('.passo'), txs = $$('.passo-tx');
  if (passos.length) {
    let pI = 0;
    const passo = i => { passos.forEach((p, j) => p.classList.toggle('on', j === i)); txs.forEach((t, j) => t.classList.toggle('on', j === i)); pI = i; };
    const pT = setInterval(() => passo((pI + 1) % passos.length), 5000);
    passos.forEach((p, i) => p.addEventListener('click', () => { clearInterval(pT); passo(i); }));
  }

  // lightbox
  const lb = $('#lb'); let lista = [], li = 0;
  const show = () => { $('#lb-im').src = lista[li][0]; $('#lb-im').alt = lista[li][1]; $('#lb-p').textContent = lista[li][1]; lb.classList.add('on'); };
  const move = d => { li = (li + d + lista.length) % lista.length; show(); };
  const fecha = () => lb.classList.remove('on');
  if (lb) {
    $('#lb-x').addEventListener('click', fecha); $('#lb-e').addEventListener('click', () => move(-1)); $('#lb-d').addEventListener('click', () => move(1));
    lb.addEventListener('click', e => { if (e.target === lb) fecha(); });
    document.addEventListener('keydown', e => { if (!lb.classList.contains('on')) return; if (e.key === 'Escape') fecha(); if (e.key === 'ArrowRight') move(1); if (e.key === 'ArrowLeft') move(-1); });
  }

  // galeria com filtros
  $$('#filtros button').forEach(b => b.addEventListener('click', () => {
    $$('#filtros button').forEach(x => x.classList.toggle('on', x === b));
    $$('.gi').forEach(g => g.classList.toggle('hid', b.dataset.f !== '*' && g.dataset.f !== b.dataset.f));
  }));
  $$('.gi').forEach(g => g.addEventListener('click', e => {
    e.preventDefault();
    const vis = $$('.gi').filter(x => !x.classList.contains('hid'));
    lista = vis.map(x => [x.getAttribute('href'), x.dataset.titulo]); li = vis.indexOf(g); show();
  }));

  // página de serviço: miniaturas
  const th = $('#pg-th'), pim = $('#pg-im');
  if (pim) {
    const bts = th ? $$('button', th) : [];
    bts.forEach(b => b.addEventListener('click', () => { pim.src = b.dataset.src; pim.alt = b.dataset.alt; bts.forEach(x => x.classList.toggle('on', x === b)); }));
    $('#pg-main').addEventListener('click', () => {
      lista = bts.length ? bts.map(b => [b.dataset.src, b.dataset.alt]) : [[pim.getAttribute('src'), pim.alt]];
      li = Math.max(0, bts.findIndex(b => b.classList.contains('on'))); show();
    });
  }

  // animação ao rolar
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis2'); io.unobserve(e.target); } }), { threshold: .12 }) : null;
  $$('.rev').forEach(r => io ? io.observe(r) : r.classList.add('vis2'));
})();
