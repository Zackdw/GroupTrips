// Chibi crew for GroupTrips pages.
//   Crew.svg(person)      → SVG markup for one chibi (viewBox 0 0 64 100)
//   Crew.walk(container)  → the whole crew strolling back and forth across `container`
// Drawn from photos the organizer shared; the photos themselves are NOT in this repo (it's public).
// Rename the ids to first names if you like; they aren't shown anywhere.
(function () {
  const CREW = [
    { id: 'rust-jacket', skin: '#f1c7a5', hair: '#3b2a20', hairStyle: 'short', beard: true,
      top: '#c4532d', sleeves: 'long', bottom: '#cbb68c', shoes: '#5a4636', prop: 'surfboard' },
    { id: 'curls', skin: '#f3cfb4', hair: '#2a1c15', hairStyle: 'curly', eyes: 'happy',
      top: '#1f1f22', sleeves: 'tank', bottom: '#4a6a8c', shoes: '#2f2f2f', armTattoos: true, gauges: '#4f8f6a' },
    { id: 'pink-shirt', skin: '#efc19c', hair: '#3a2618', hairStyle: 'short', beard: true,
      top: '#e8857f', pattern: 'flowers', sleeves: 'short', bottom: '#3d4f6b', shoes: '#efe7d4' },
    { id: 'glasses', skin: '#f3d2b5', hair: '#1d1a19', hairStyle: 'bun', glasses: true,
      top: '#ebe1d0', collar: '#f2b8b5', sleeves: 'short', bottom: '#9db6cf', shoes: '#f7f7f7', lei: true },
    { id: 'swoop', skin: '#ecc29b', hair: '#141414', hairStyle: 'swoop', stud: true,
      top: '#2d3f66', collar: '#d6d9de', sleeves: 'short', bottom: '#b8bcc4', shoes: '#2d2d2d', hibiscus: true },
    { id: 'bob', skin: '#f1c8a4', hair: '#6a4a35', hairStyle: 'bob', noseRing: true,
      top: '#fbfbf8', outfit: 'dress', shoes: '#1e2633' },
  ];

  const HAIR_BACK = {
    curly: (c) => [[12, 34, 8], [52, 34, 8], [13, 46, 7], [51, 46, 7], [17, 55, 6.5], [47, 55, 6.5]]
      .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`).join(''),
    bob: (c) => `<path d="M10 32 Q8 9 32 8 Q56 9 54 32 L55 47 Q50 51 45 47 L45 34 H19 L19 47 Q14 51 9 47 Z" fill="${c}"/>`,
    bun: (c) => `<circle cx="32" cy="9" r="7.5" fill="${c}"/>`,
  };

  const HAIR_FRONT = {
    short: (c) => `<path d="M12 31 Q10 9 32 8 Q54 9 52 31 Q51 21 45 18 Q40 23 33 19 Q26 24 21 19 Q15 22 12 31 Z" fill="${c}"/>
      <path d="M24 11 l3 -5 l2.5 5 Z M33 9 l4 -5 l1 6 Z M41 11 l4 -3 l-0.5 5 Z" fill="${c}"/>`,
    curly: (c) => [[15, 21, 8], [23, 14, 8], [32, 11, 8.5], [41, 14, 8], [49, 21, 8], [11, 29, 6], [53, 29, 6],
      [20, 20, 5], [27, 18, 5], [35, 18, 5], [43, 20, 5]]
      .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`).join(''),
    bun: (c) => `<path d="M12 31 Q11 11 32 10 Q53 11 52 31 Q50 20 40 17 Q32 15 24 17 Q14 20 12 31 Z" fill="${c}"/>`,
    swoop: (c) => `<path d="M12 33 Q11 20 17 14 L20 24 Q14 26 13 33 Z M52 33 Q53 20 47 14 L44 24 Q50 26 51 33 Z" fill="${c}" opacity=".8"/>
      <path d="M14 22 Q12 5 32 3 Q52 1 56 14 Q52 11 47 12 Q53 18 50 25 Q44 16 32 17 Q22 17 14 22 Z" fill="${c}"/>`,
    bob: (c) => `<path d="M12 31 Q11 10 32 9 Q53 10 52 30 Q46 18 36 18 Q28 25 13 33 Z" fill="${c}"/>`,
  };

  // Heads are drawn on a 1x grid and scaled 2x around the chin (32, 50) for the big-head chibi look.
  const HEAD_SCALE = 'translate(32 50) scale(2) translate(-32 -50)';
  const VIEWBOX = '-24 -50 112 150';

  // Fruit Gang: everyone has a strawberry tattoo (forearm, or calf when sleeves cover the arm).
  function strawberryTattoo(x, y) {
    return `<g transform="translate(${x} ${y}) scale(.9)">
      <path d="M0 -2 Q3 -2.2 3 .5 Q2.6 3 0 4.2 Q-2.6 3 -3 .5 Q-3 -2.2 0 -2 Z" fill="#e63950"/>
      <path d="M-2.2 -2 L0 -3.4 L2.2 -2 L0 -1.3 Z" fill="#3a9a4a"/></g>`;
  }

  function lei(y) {
    const colors = ['#ff6f91', '#ffd166', '#ffffff', '#ff8fab'];
    let out = '';
    for (let i = 0; i <= 8; i++) {
      const t = i / 8;
      const x = 21 + 22 * t;
      const yy = y + 6 * 4 * t * (1 - t);   // gentle dip across the chest
      out += `<circle cx="${x.toFixed(1)}" cy="${yy.toFixed(1)}" r="2.1" fill="${colors[i % colors.length]}"/>`;
    }
    return out;
  }

  function arm(p, side) {
    const x = side === 'a' ? 14.5 : 42.5;
    const hx = x + 3.5;
    const skinArm = p.sleeves !== 'long';
    let g = `<rect x="${x}" y="54" width="7" height="17" rx="3.5" fill="${skinArm ? p.skin : p.top}"/>`;
    if (p.sleeves === 'short') g += `<rect x="${x - 0.5}" y="53.5" width="8" height="7.5" rx="3.5" fill="${p.top}"/>`;
    if (p.outfit === 'dress') g += `<ellipse cx="${hx}" cy="57" rx="4.6" ry="3.4" fill="${p.top}" stroke="#e6e2d8" stroke-width=".6"/>`;
    if (p.armTattoos && side === 'a') g += `<path d="M${hx - 1} 58 q2 2 0 4 q-2 2 0 4 M${hx + 1} 63 l1.5 1.5" stroke="#3f5f55" stroke-width="1.1" fill="none" opacity=".65"/>`;
    if (side === 'b' && skinArm) g += strawberryTattoo(hx, 64);
    g += `<circle cx="${hx}" cy="71.5" r="3.4" fill="${p.skin}"/>`;
    return `<g class="arm arm-${side}">${g}</g>`;
  }

  function svg(p) {
    const s = [];
    s.push(`<ellipse cx="32" cy="94" rx="15" ry="3" fill="#000" opacity=".14"/>`);
    s.push('<g class="bod">');

    if (p.prop === 'surfboard') {
      s.push(`<g transform="rotate(10 54 58)"><ellipse cx="54" cy="58" rx="6.5" ry="28" fill="#fff4d2" stroke="#e0a43a" stroke-width="1"/>
        <path d="M54 31 V85" stroke="#2fa3b5" stroke-width="2"/></g>`);
    }
    if (HAIR_BACK[p.hairStyle]) s.push(`<g transform="${HEAD_SCALE}">${HAIR_BACK[p.hairStyle](p.hair)}</g>`);

    // Legs + shoes
    for (const [side, x] of [['a', 24], ['b', 33]]) {
      let g = `<rect x="${x}" y="72" width="7" height="17" rx="3" fill="${p.skin}"/>`;
      if (side === 'b' && p.sleeves === 'long') g += strawberryTattoo(x + 3.5, 80);
      g += `<ellipse cx="${x + 3}" cy="90" rx="5" ry="2.8" fill="${p.shoes}"/>`;
      if (p.outfit === 'dress') g += `<rect x="${x - 1.5}" y="90.5" width="9" height="1.4" rx=".7" fill="#ffffff"/>`;
      s.push(`<g class="leg leg-${side}">${g}</g>`);
    }

    // Body
    if (p.outfit === 'dress') {
      s.push(`<rect x="20" y="49" width="24" height="11" rx="4" fill="${p.skin}"/>`);
      s.push(`<path d="M20 57 Q32 60.5 44 57 L48 82 Q32 87 16 82 Z" fill="${p.top}" stroke="#e6e2d8" stroke-width=".7"/>`);
      s.push(`<path d="M19 71 Q32 74 45 71" stroke="#e6e2d8" stroke-width=".8" fill="none"/>`);
    } else {
      s.push(`<rect x="20" y="49" width="24" height="25" rx="8" fill="${p.top}"/>`);
      if (p.collar) s.push(`<path d="M27 49 L32 57 L37 49 Z" fill="${p.collar}"/>`);
      if (p.pattern === 'flowers') {
        s.push([[25, 60], [36, 57], [30, 66], [39, 65], [24, 69]]
          .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.4" fill="#fff" opacity=".85"/>`).join(''));
      }
      s.push(`<rect x="21" y="70" width="22" height="9" rx="3" fill="${p.bottom}"/>`);
    }
    if (p.hibiscus) {
      s.push(`<g transform="translate(38.5 60)">${[0, 72, 144, 216, 288].map((a) =>
        `<circle cx="${(2 * Math.cos(a * Math.PI / 180)).toFixed(2)}" cy="${(2 * Math.sin(a * Math.PI / 180)).toFixed(2)}" r="1.9" fill="#ff5a6e"/>`).join('')}
        <circle r="1" fill="#ffd166"/></g>`);
    }
    if (p.lei) s.push(lei(54));
    s.push(arm(p, 'a'), arm(p, 'b'));

    // Head (drawn at 1x, scaled up around the chin)
    s.push(`<g transform="${HEAD_SCALE}">`);
    s.push(`<circle cx="12.5" cy="32" r="3.6" fill="${p.skin}"/><circle cx="51.5" cy="32" r="3.6" fill="${p.skin}"/>`);
    s.push(`<circle cx="32" cy="30" r="20" fill="${p.skin}"/>`);
    if (p.beard) {
      s.push(`<path d="M14.5 34 Q16 49 32 50 Q48 49 49.5 34 Q47 44 40 45 Q32 47 24 45 Q17 44 14.5 34 Z" fill="${p.hair}" opacity=".3"/>`);
    }
    if (p.eyes === 'happy') {
      s.push(`<path d="M22.5 33 Q25 29.5 27.5 33 M36.5 33 Q39 29.5 41.5 33" stroke="#2a2a2a" stroke-width="1.6" fill="none" stroke-linecap="round"/>`);
    } else {
      s.push(`<ellipse cx="25" cy="32" rx="2.4" ry="2.8" fill="#2a2a2a"/><ellipse cx="39" cy="32" rx="2.4" ry="2.8" fill="#2a2a2a"/>
        <circle cx="25.8" cy="31" r=".8" fill="#fff"/><circle cx="39.8" cy="31" r=".8" fill="#fff"/>`);
    }
    s.push(`<ellipse cx="20.5" cy="37.5" rx="3" ry="1.8" fill="#ff8f8f" opacity=".45"/>
      <ellipse cx="43.5" cy="37.5" rx="3" ry="1.8" fill="#ff8f8f" opacity=".45"/>`);
    s.push(`<path d="M27.5 38.5 Q32 44.5 36.5 38.5 Z" fill="#7a2e2e"/>`);
    s.push(HAIR_FRONT[p.hairStyle](p.hair));

    if (p.glasses) {
      s.push(`<circle cx="25" cy="32" r="5.2" fill="none" stroke="#6b5a4a" stroke-width="1.3"/>
        <circle cx="39" cy="32" r="5.2" fill="none" stroke="#6b5a4a" stroke-width="1.3"/>
        <path d="M30.2 32 Q32 30.8 33.8 32" stroke="#6b5a4a" stroke-width="1.2" fill="none"/>`);
    }
    if (p.gauges) s.push(`<circle cx="12.5" cy="36.5" r="1.9" fill="${p.gauges}"/><circle cx="51.5" cy="36.5" r="1.9" fill="${p.gauges}"/>`);
    if (p.stud) s.push(`<circle cx="51.5" cy="35.5" r=".9" fill="#f2f2f2"/>`);
    if (p.noseRing) s.push(`<circle cx="33.6" cy="36.4" r=".9" fill="none" stroke="#d8c27a" stroke-width=".7"/>`);
    s.push('</g>');

    s.push('</g>');
    return `<svg viewBox="${VIEWBOX}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${s.join('')}</svg>`;
  }

  const CSS = `
    .walker { position: absolute; left: 0; bottom: 3%; width: 90px; z-index: 3; will-change: transform; }
    .walker.back { bottom: 15%; width: 72px; z-index: 1; }
    .walker svg { display: block; width: 100%; height: auto; overflow: visible; }
    .walker svg.flip { transform: scaleX(-1); }
    .walker .leg, .walker .arm { transform-box: fill-box; transform-origin: 50% 0; animation: crew-swing .55s ease-in-out infinite alternate; }
    .walker .leg-b, .walker .arm-a { animation-name: crew-swing-r; }
    .walker .arm { animation-name: crew-arm; }
    .walker .arm-a { animation-name: crew-arm-r; }
    .walker .bod { animation: crew-bob .275s ease-in-out infinite alternate; }
    @keyframes crew-swing { from { transform: rotate(18deg); } to { transform: rotate(-18deg); } }
    @keyframes crew-swing-r { from { transform: rotate(-18deg); } to { transform: rotate(18deg); } }
    @keyframes crew-arm { from { transform: rotate(12deg); } to { transform: rotate(-12deg); } }
    @keyframes crew-arm-r { from { transform: rotate(-12deg); } to { transform: rotate(12deg); } }
    @keyframes crew-bob { from { transform: translateY(0); } to { transform: translateY(-1.6px); } }
    @media (prefers-reduced-motion: reduce) { .walker * { animation: none !important; } }
  `;

  // Alternates depth rows and directions; each walker loops across at its own pace,
  // starting spread out so the beach isn't empty on load.
  function walk(container) {
    if (!document.getElementById('crew-css')) {
      const style = document.createElement('style');
      style.id = 'crew-css';
      style.textContent = CSS;
      document.head.append(style);
    }
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    container.innerHTML = '';
    const walkers = CREW.map((p, i) => {
      const el = document.createElement('div');
      el.className = 'walker' + (i % 2 ? ' back' : '');
      el.innerHTML = svg(p);
      el.querySelector('svg').classList.toggle('flip', i % 3 === 1);
      container.append(el);
      return el;
    });

    let anims = [];
    function start() {
      anims.forEach((a) => a.cancel());
      anims = [];
      const W = container.clientWidth;
      walkers.forEach((el, i) => {
        const leftward = i % 3 === 1;
        const w = el.offsetWidth;
        if (reduce) {
          el.style.transform = `translateX(${((i + 0.5) / walkers.length) * W - w / 2}px)`;
          return;
        }
        const from = -w - 10, to = W + 10;
        const speed = 24 + ((i * 7) % 15);                 // px per second
        const duration = ((to - from) / speed) * 1000;
        const frames = [{ transform: `translateX(${from}px)` }, { transform: `translateX(${to}px)` }];
        const a = el.animate(leftward ? frames.reverse() : frames, { duration, iterations: Infinity });
        a.currentTime = duration * ((i * 0.37 + 0.1) % 1);
        anims.push(a);
      });
    }
    start();
    let timer;
    addEventListener('resize', () => { clearTimeout(timer); timer = setTimeout(start, 200); });
  }

  window.Crew = { members: CREW, svg, walk };
})();
