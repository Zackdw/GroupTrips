// Fruit Gang strawberries: low-poly 3D berries drifting up through the page background.
// Faintness comes from the container's CSS opacity, so materials stay opaque (no sorting issues).
import {
  AmbientLight, ConeGeometry, CylinderGeometry, DirectionalLight, Group, InstancedMesh, LatheGeometry,
  Mesh, MeshStandardMaterial, Object3D, PerspectiveCamera, Scene, SphereGeometry, Vector2, WebGLRenderer,
} from 'three';

// Berry silhouette, bottom tip → top shoulder (x = radius, y = height).
const PROFILE = [[0, -1.25], [0.25, -1.05], [0.5, -0.7], [0.75, -0.25], [0.92, 0.2], [1, 0.55],
  [0.95, 0.8], [0.75, 0.98], [0.4, 1.08], [0, 1.1]];

function radiusAt(y) {
  for (let i = 1; i < PROFILE.length; i++) {
    const [r0, y0] = PROFILE[i - 1], [r1, y1] = PROFILE[i];
    if (y >= y0 && y <= y1) return r0 + ((y - y0) / (y1 - y0)) * (r1 - r0);
  }
  return 0;
}

function makeBerryParts() {
  const berryGeo = new LatheGeometry(PROFILE.map(([r, y]) => new Vector2(r, y)), 28);
  const berryMat = new MeshStandardMaterial({ color: 0xe8394d, roughness: 0.45 });
  const seedGeo = new SphereGeometry(0.05, 6, 4);
  seedGeo.scale(1, 1.6, 1);
  const seedMat = new MeshStandardMaterial({ color: 0xffd36b, roughness: 0.6 });
  const leafGeo = new ConeGeometry(0.22, 0.75, 4);
  leafGeo.scale(1, 1, 0.25);
  const leafMat = new MeshStandardMaterial({ color: 0x3aa35c, roughness: 0.7 });
  const stemGeo = new CylinderGeometry(0.045, 0.07, 0.42, 6);

  // Seed layout is shared by every berry.
  const seedSpots = [];
  for (let row = 0; row < 9; row++) {
    const y = -0.95 + row * 0.2;
    const r = radiusAt(y);
    const n = Math.max(3, Math.round(11 * r));
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2 + (row % 2) * (Math.PI / n);
      seedSpots.push({ x: Math.cos(a) * r * 0.99, y, z: Math.sin(a) * r * 0.99, a });
    }
  }

  return function makeBerry() {
    const g = new Group();
    g.add(new Mesh(berryGeo, berryMat));

    const seeds = new InstancedMesh(seedGeo, seedMat, seedSpots.length);
    const o = new Object3D();
    seedSpots.forEach((s, i) => {
      o.position.set(s.x, s.y, s.z);
      o.rotation.set(0, -s.a, 0.35);
      o.updateMatrix();
      seeds.setMatrixAt(i, o.matrix);
    });
    g.add(seeds);

    for (let k = 0; k < 6; k++) {
      const leaf = new Mesh(leafGeo, leafMat);
      const a = (k / 6) * Math.PI * 2;
      leaf.position.set(Math.cos(a) * 0.38, 1.08, Math.sin(a) * 0.38);
      leaf.rotation.set(0, -a, 0);
      leaf.rotateZ(-Math.PI / 2 + 0.25);   // lay the cone flat, pointing outward and slightly down
      g.add(leaf);
    }
    const stem = new Mesh(stemGeo, leafMat);
    stem.position.y = 1.3;
    stem.rotation.z = 0.2;
    g.add(stem);
    return g;
  };
}

export function strawberryField(container) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let renderer;
  try {
    renderer = new WebGLRenderer({ alpha: true, antialias: true });
  } catch {
    return;   // no WebGL: the page is fine without the berries
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  container.append(renderer.domElement);

  const scene = new Scene();
  const camera = new PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 14;
  scene.add(new AmbientLight(0xffffff, 1.3));
  const sun = new DirectionalLight(0xffffff, 1.8);
  sun.position.set(3, 5, 6);
  scene.add(sun);

  const makeBerry = makeBerryParts();
  const tanHalf = Math.tan((camera.fov / 2) * (Math.PI / 180));
  const halfH = (z) => (camera.position.z - z) * tanHalf;

  let berries = [];
  function populate() {
    berries.forEach((b) => scene.remove(b.mesh));
    const area = container.clientWidth * container.clientHeight;
    const count = Math.max(8, Math.min(18, Math.round(area / 60000)));
    berries = Array.from({ length: count }, (_, i) => {
      const mesh = makeBerry();
      const z = -8 + Math.random() * 10;
      const b = {
        mesh, z,
        u: Math.random() * 2 - 1,                       // horizontal position as a fraction of the visible width
        y: (Math.random() * 2 - 1) * halfH(z),
        rise: 0.25 + Math.random() * 0.35,              // units per second
        spin: [Math.random() - 0.5, 0.4 + Math.random() * 0.5, Math.random() - 0.5].map((v) => v * 0.6),
        phase: Math.random() * Math.PI * 2,
        scale: 0.55 + Math.random() * 0.5,
      };
      mesh.scale.setScalar(b.scale);
      mesh.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
      scene.add(mesh);
      return b;
    });
  }

  function resize() {
    const w = container.clientWidth, h = container.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  let pointerX = 0, pointerY = 0;
  addEventListener('pointermove', (e) => {
    pointerX = (e.clientX / innerWidth) * 2 - 1;
    pointerY = (e.clientY / innerHeight) * 2 - 1;
  }, { passive: true });

  let last = performance.now();
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const t = now / 1000;
    // Scrolling lifts the whole field a little faster than the page: parallax depth.
    const scrollLift = scrollY * 0.004;
    camera.position.x += (pointerX * 0.8 - camera.position.x) * 0.03;
    camera.position.y += (-pointerY * 0.5 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);

    for (const b of berries) {
      const hh = halfH(b.z);
      b.y += b.rise * dt;
      let y = b.y + scrollLift;
      const span = 2 * hh + 3;
      y = ((((y + hh + 1.5) % span) + span) % span) - hh - 1.5;   // wrap bottom ↔ top
      b.mesh.position.set(b.u * hh * camera.aspect + Math.sin(t * 0.5 + b.phase) * 0.4, y, b.z);
      b.mesh.rotation.x += b.spin[0] * dt;
      b.mesh.rotation.y += b.spin[1] * dt;
      b.mesh.rotation.z += b.spin[2] * dt;
    }
    renderer.render(scene, camera);
    if (!reduce) requestAnimationFrame(frame);
  }

  resize();
  populate();
  let timer;
  addEventListener('resize', () => {
    clearTimeout(timer);
    timer = setTimeout(() => { resize(); populate(); if (reduce) frame(performance.now()); }, 200);
  });
  requestAnimationFrame(frame);
}
