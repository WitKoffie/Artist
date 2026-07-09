(function () {
  'use strict';

  if (typeof THREE === 'undefined') {
    var stage = document.querySelector('.portal-stage');
    if (stage) stage.classList.add('no-webgl');
    return;
  }

  var container = document.getElementById('sound-portal');
  if (!container) return;

  var stage = container.closest('.portal-stage');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  try {
    var testCanvas = document.createElement('canvas');
    var gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
    if (!gl) { if (stage) stage.classList.add('no-webgl'); return; }
  } catch (e) { if (stage) stage.classList.add('no-webgl'); return; }

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(0, 4.5, 0);
  camera.lookAt(0, 0, 0);

  var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  function resize() {
    var w = container.clientWidth;
    var h = container.clientHeight;
    if (w === 0 || h === 0) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  resize();
  window.addEventListener('resize', resize);

  var CYAN = new THREE.Color(0x00e5ff);
  var MAGENTA = new THREE.Color(0xff2aaa);
  var VIOLET = new THREE.Color(0x8b5cf6);

  /* ── Vortex disc with custom shader ── */
  var vortexUniforms = {
    uTime: { value: 0 },
    uAudio: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) }
  };

  var vortexVert = [
    'varying vec2 vUv;',
    'void main() {',
    '  vUv = uv;',
    '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
    '}'
  ].join('\n');

  var vortexFrag = [
    'precision highp float;',
    'uniform float uTime;',
    'uniform float uAudio;',
    'uniform vec2 uMouse;',
    'varying vec2 vUv;',
    '',
    'vec3 cyan    = vec3(0.0, 0.898, 1.0);',
    'vec3 magenta = vec3(1.0, 0.165, 0.667);',
    'vec3 violet  = vec3(0.545, 0.361, 0.965);',
    'vec3 deep    = vec3(0.02, 0.008, 0.06);',
    '',
    'float hash(vec2 p) {',
    '  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);',
    '}',
    '',
    'float noise(vec2 p) {',
    '  vec2 i = floor(p);',
    '  vec2 f = fract(p);',
    '  f = f * f * (3.0 - 2.0 * f);',
    '  float a = hash(i);',
    '  float b = hash(i + vec2(1.0, 0.0));',
    '  float c = hash(i + vec2(0.0, 1.0));',
    '  float d = hash(i + vec2(1.0, 1.0));',
    '  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);',
    '}',
    '',
    'float fbm(vec2 p) {',
    '  float v = 0.0;',
    '  float a = 0.5;',
    '  for (int i = 0; i < 5; i++) {',
    '    v += a * noise(p);',
    '    p *= 2.0;',
    '    a *= 0.5;',
    '  }',
    '  return v;',
    '}',
    '',
    'void main() {',
    '  vec2 uv = vUv - 0.5;',
    '  float dist = length(uv);',
    '  float angle = atan(uv.y, uv.x);',
    '',
    '  // Circular mask — hard edge at disc boundary',
    '  float mask = 1.0 - smoothstep(0.48, 0.5, dist);',
    '',
    '  // Spiral arms',
    '  float speed = 0.15 + uAudio * 0.25;',
    '  float spiral = sin(angle * 3.0 - dist * 12.0 + uTime * speed) * 0.5 + 0.5;',
    '  float spiral2 = sin(angle * 5.0 + dist * 8.0 - uTime * speed * 1.3) * 0.5 + 0.5;',
    '',
    '  // Nebula noise warped by spiral',
    '  vec2 warp = vec2(',
    '    cos(angle + uTime * 0.1) * dist,',
    '    sin(angle + uTime * 0.1) * dist',
    '  );',
    '  float neb = fbm(warp * 4.0 + uTime * 0.05);',
    '  float neb2 = fbm(warp * 6.0 - uTime * 0.08 + 3.0);',
    '',
    '  // Color mixing',
    '  vec3 col = deep;',
    '  col = mix(col, violet * 0.4, neb * smoothstep(0.4, 0.1, dist));',
    '  col = mix(col, cyan * 0.6, spiral * smoothstep(0.45, 0.15, dist) * 0.5);',
    '  col = mix(col, magenta * 0.5, spiral2 * smoothstep(0.4, 0.2, dist) * 0.4);',
    '  col += violet * 0.15 * neb2 * smoothstep(0.35, 0.1, dist);',
    '',
    '  // Core glow',
    '  float core = smoothstep(0.15, 0.0, dist);',
    '  col += cyan * core * (0.8 + uAudio * 0.6);',
    '',
    '  // Inner ring glow',
    '  float ring1 = smoothstep(0.02, 0.0, abs(dist - 0.18));',
    '  float ring2 = smoothstep(0.015, 0.0, abs(dist - 0.32));',
    '  col += magenta * ring1 * 0.4;',
    '  col += cyan * ring2 * 0.3;',
    '',
    '  // Edge glow — rim light',
    '  float rim = smoothstep(0.35, 0.49, dist) * smoothstep(0.5, 0.47, dist);',
    '  col += cyan * rim * (0.3 + 0.2 * sin(uTime * 0.5));',
    '',
    '  // Mouse proximity highlight',
    '  vec2 mOff = uv - (uMouse - 0.5) * 0.3;',
    '  float mDist = length(mOff);',
    '  col += violet * 0.12 * smoothstep(0.3, 0.0, mDist);',
    '',
    '  // Sparkle layer',
    '  float sparkle = hash(uv * 80.0 + floor(uTime * 3.0));',
    '  sparkle = pow(sparkle, 20.0) * smoothstep(0.45, 0.1, dist);',
    '  col += vec3(0.8, 0.9, 1.0) * sparkle * (0.6 + uAudio * 0.8);',
    '',
    '  gl_FragColor = vec4(col * mask, mask * 0.95);',
    '}'
  ].join('\n');

  var discGeo = new THREE.CircleGeometry(2.2, 96);
  var discMat = new THREE.ShaderMaterial({
    uniforms: vortexUniforms,
    vertexShader: vortexVert,
    fragmentShader: vortexFrag,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false
  });
  var disc = new THREE.Mesh(discGeo, discMat);
  disc.rotation.x = -Math.PI / 2;
  scene.add(disc);

  /* ── Outer energy ring ── */
  var outerGeo = new THREE.TorusGeometry(2.2, 0.035, 16, 128);
  var outerMat = new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.7 });
  var outerRing = new THREE.Mesh(outerGeo, outerMat);
  outerRing.rotation.x = -Math.PI / 2;
  scene.add(outerRing);

  /* ── Inner ring ── */
  var innerGeo = new THREE.TorusGeometry(1.6, 0.02, 16, 96);
  var innerMat = new THREE.MeshBasicMaterial({ color: MAGENTA, transparent: true, opacity: 0.45 });
  var innerRing = new THREE.Mesh(innerGeo, innerMat);
  innerRing.rotation.x = -Math.PI / 2;
  scene.add(innerRing);

  /* ── Mid ring ── */
  var midGeo = new THREE.TorusGeometry(1.0, 0.015, 16, 64);
  var midMat = new THREE.MeshBasicMaterial({ color: VIOLET, transparent: true, opacity: 0.3 });
  var midRing = new THREE.Mesh(midGeo, midMat);
  midRing.rotation.x = -Math.PI / 2;
  scene.add(midRing);

  /* ── Ambient glow halo ── */
  var glowGeo = new THREE.RingGeometry(2.0, 2.8, 64);
  var glowMat = new THREE.MeshBasicMaterial({ color: VIOLET, transparent: true, opacity: 0.06, side: THREE.DoubleSide });
  var glow = new THREE.Mesh(glowGeo, glowMat);
  glow.rotation.x = -Math.PI / 2;
  glow.position.y = -0.02;
  scene.add(glow);

  /* ── Orbiting particles — two layers ── */
  function createParticleLayer(count, minR, maxR, size, baseOpacity) {
    var geo = new THREE.BufferGeometry();
    var pos = new Float32Array(count * 3);
    var cols = new Float32Array(count * 3);
    var speeds = [];
    var radii = [];

    for (var i = 0; i < count; i++) {
      var angle = Math.random() * Math.PI * 2;
      var r = minR + Math.random() * (maxR - minR);
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      pos[i * 3 + 2] = Math.sin(angle) * r;
      speeds.push(0.2 + Math.random() * 0.9);
      radii.push(r);

      var col = Math.random() > 0.6 ? CYAN : (Math.random() > 0.5 ? MAGENTA : VIOLET);
      cols[i * 3] = col.r;
      cols[i * 3 + 1] = col.g;
      cols[i * 3 + 2] = col.b;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(cols, 3));

    var mat = new THREE.PointsMaterial({
      size: size,
      vertexColors: true,
      transparent: true,
      opacity: baseOpacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    return { mesh: new THREE.Points(geo, mat), speeds: speeds, radii: radii, count: count };
  }

  var innerParticles = createParticleLayer(40, 0.3, 1.5, 0.04, 0.8);
  var outerParticles = createParticleLayer(50, 1.5, 2.4, 0.03, 0.5);
  scene.add(innerParticles.mesh);
  scene.add(outerParticles.mesh);

  /* ── Pulse rings ── */
  var pulseRings = [];
  var pulseColors = [CYAN, MAGENTA, VIOLET, CYAN];
  for (var p = 0; p < 4; p++) {
    var pr = 0.6 + p * 0.45;
    var pGeo = new THREE.TorusGeometry(pr, 0.008, 8, 80);
    var pMat = new THREE.MeshBasicMaterial({
      color: pulseColors[p],
      transparent: true,
      opacity: 0.15
    });
    var pMesh = new THREE.Mesh(pGeo, pMat);
    pMesh.rotation.x = -Math.PI / 2;
    scene.add(pMesh);
    pulseRings.push({ mesh: pMesh, baseRadius: pr, speed: 0.4 + p * 0.25, phase: p * 1.2 });
  }

  /* ── Interaction state ── */
  var mouse = { x: 0.5, y: 0.5 };
  var smoothMouse = { x: 0.5, y: 0.5 };
  var isAudioPlaying = false;
  var audioLevel = 0;
  var targetAudioLevel = 0;

  container.addEventListener('pointermove', function (e) {
    var rect = container.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) / rect.width;
    mouse.y = (e.clientY - rect.top) / rect.height;
  });

  window.addEventListener('ds:audio-playing', function () { isAudioPlaying = true; targetAudioLevel = 1; });
  window.addEventListener('ds:audio-stopped', function () { isAudioPlaying = false; targetAudioLevel = 0; });
  window.addEventListener('wk:audio-playing', function () { isAudioPlaying = true; targetAudioLevel = 1; });
  window.addEventListener('wk:audio-stopped', function () { isAudioPlaying = false; targetAudioLevel = 0; });

  /* ── Animation loop ── */
  var clock = new THREE.Clock();
  var isVisible = true;

  function animateParticleLayer(layer, t, audioMul) {
    var posArr = layer.mesh.geometry.attributes.position.array;
    for (var i = 0; i < layer.count; i++) {
      var idx = i * 3;
      var x = posArr[idx];
      var z = posArr[idx + 2];
      var angle = Math.atan2(z, x) + layer.speeds[i] * 0.012 * audioMul;
      posArr[idx] = Math.cos(angle) * layer.radii[i];
      posArr[idx + 2] = Math.sin(angle) * layer.radii[i];
      posArr[idx + 1] = Math.sin(t * layer.speeds[i] * 0.8 + i * 0.5) * 0.12;
    }
    layer.mesh.geometry.attributes.position.needsUpdate = true;
  }

  function animate() {
    if (!isVisible) { requestAnimationFrame(animate); return; }
    var t = clock.getElapsedTime();

    audioLevel += (targetAudioLevel - audioLevel) * 0.08;
    smoothMouse.x += (mouse.x - smoothMouse.x) * 0.05;
    smoothMouse.y += (mouse.y - smoothMouse.y) * 0.05;

    var speed = 0.15 + audioLevel * 0.3;

    vortexUniforms.uTime.value = t;
    vortexUniforms.uAudio.value = audioLevel;
    vortexUniforms.uMouse.value.set(smoothMouse.x, smoothMouse.y);

    if (!reducedMotion) {
      outerRing.rotation.z = -t * speed * 0.4;
      innerRing.rotation.z = t * speed * 0.6;
      midRing.rotation.z = -t * speed * 0.8;
    }

    var audioMul = isAudioPlaying ? 2.5 : 1;
    animateParticleLayer(innerParticles, t, audioMul);
    animateParticleLayer(outerParticles, t, audioMul * 0.7);

    pulseRings.forEach(function (pr) {
      var wave = Math.sin(t * pr.speed + pr.phase);
      var scale = 1 + wave * 0.06 * (1 + audioLevel);
      pr.mesh.scale.set(scale, scale, 1);
      pr.mesh.material.opacity = 0.1 + wave * 0.08 + audioLevel * 0.1;
    });

    glow.material.opacity = 0.04 + (1 - Math.abs(smoothMouse.x - 0.5) * 2) * 0.06 + audioLevel * 0.04;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  document.addEventListener('visibilitychange', function () {
    isVisible = !document.hidden;
    if (isVisible) clock.getDelta();
  });

  animate();

  window.DSPortal = {
    setSoundActive: function (on) {
      isAudioPlaying = on;
      targetAudioLevel = on ? 1 : 0;
    }
  };
  window.WKPortal = window.DSPortal;
})();
