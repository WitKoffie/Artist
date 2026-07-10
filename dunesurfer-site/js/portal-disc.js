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

  /* ── Scene ── */
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(50, 1, 0.1, 200);
  camera.position.set(0, 0, 6);

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

  /* ── Colors ── */
  var CYAN = new THREE.Color(0x00e5ff);
  var MAGENTA = new THREE.Color(0xff2aaa);
  var VIOLET = new THREE.Color(0x8b5cf6);

  /* ── Depth disc layers ── */
  var LAYER_COUNT = 18;
  var layers = [];

  var discVert = [
    'varying vec2 vUv;',
    'void main() {',
    '  vUv = uv;',
    '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
    '}'
  ].join('\n');

  var discFrag = [
    'precision highp float;',
    'uniform float uTime;',
    'uniform float uAudio;',
    'uniform float uPulse;',
    'uniform float uDepth;',
    'uniform vec3 uColor1;',
    'uniform vec3 uColor2;',
    'uniform float uPattern;',
    'varying vec2 vUv;',
    '',
    'float hash(vec2 p) {',
    '  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);',
    '}',
    'float noise(vec2 p) {',
    '  vec2 i = floor(p); vec2 f = fract(p);',
    '  f = f * f * (3.0 - 2.0 * f);',
    '  return mix(mix(hash(i), hash(i+vec2(1,0)), f.x),',
    '             mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);',
    '}',
    '',
    'void main() {',
    '  vec2 c = vUv - 0.5;',
    '  float dist = length(c);',
    '  float angle = atan(c.y, c.x);',
    '',
    '  // Circular mask with soft edge',
    '  float mask = 1.0 - smoothstep(0.38, 0.5, dist);',
    '',
    '  float t = uTime;',
    '  float depth = uDepth;',
    '',
    '  // Different patterns per layer type',
    '  float pattern = 0.0;',
    '  if (uPattern < 0.5) {',
    '    // Spiral arms',
    '    float spiral = sin(angle * 3.0 + dist * 12.0 - t * (1.0 + uAudio) + depth * 2.0);',
    '    pattern = pow(spiral * 0.5 + 0.5, 2.0);',
    '  } else if (uPattern < 1.5) {',
    '    // Concentric ripples',
    '    float ripple = sin(dist * 30.0 - t * 2.5 * (1.0 + uAudio * 0.5) + depth * 3.0);',
    '    pattern = pow(ripple * 0.5 + 0.5, 3.0);',
    '  } else {',
    '    // Nebula noise',
    '    vec2 nUv = c * 4.0 + vec2(t * 0.08, t * 0.06 + depth);',
    '    pattern = noise(nUv) * noise(nUv * 2.1 + 3.0);',
    '  }',
    '',
    '  // Frequency ring pulse',
    '  float freqRing = abs(sin(dist * 20.0 + depth * 5.0 - t * 3.0));',
    '  freqRing = pow(freqRing, 15.0) * (0.5 + uAudio * 1.5 + uPulse);',
    '',
    '  // Blend colors based on depth and angle',
    '  float blend = sin(angle * 2.0 + t * 0.3 + depth) * 0.5 + 0.5;',
    '  vec3 col = mix(uColor1, uColor2, blend);',
    '  col *= pattern * 0.6 + 0.1;',
    '',
    '  // Add frequency ring glow',
    '  vec3 ringCol = mix(uColor1, vec3(1.0), 0.4);',
    '  col += ringCol * freqRing;',
    '',
    '  // Center glow — deeper layers glow brighter',
    '  float centerGlow = exp(-dist * dist * 8.0) * (0.3 + depth * 0.3 + uPulse * 0.4);',
    '  col += mix(uColor1, uColor2, 0.5) * centerGlow;',
    '',
    '  // Edge sparkle',
    '  float sparkle = hash(vec2(angle * 10.0, dist * 20.0) + floor(t * 6.0));',
    '  sparkle = pow(sparkle, 20.0) * mask;',
    '  col += vec3(0.9, 0.95, 1.0) * sparkle * 0.5 * (1.0 + uAudio);',
    '',
    '  float alpha = mask * (0.12 + pattern * 0.25 + freqRing * 0.4 + centerGlow * 0.3);',
    '  alpha *= (0.5 + uAudio * 0.5);',
    '',
    '  gl_FragColor = vec4(col, alpha);',
    '}'
  ].join('\n');

  var colorPairs = [
    [CYAN, VIOLET], [MAGENTA, CYAN], [VIOLET, MAGENTA],
    [CYAN, new THREE.Color(0x22ffcc)], [MAGENTA, VIOLET],
    [new THREE.Color(0xffc864), MAGENTA]
  ];

  for (var i = 0; i < LAYER_COUNT; i++) {
    var depth = i / LAYER_COUNT;
    var radius = 2.8 - depth * 0.8;
    var lGeo = new THREE.PlaneGeometry(radius * 2, radius * 2);
    var pair = colorPairs[i % colorPairs.length];
    var lUniforms = {
      uTime: { value: 0 },
      uAudio: { value: 0 },
      uPulse: { value: 0 },
      uDepth: { value: depth },
      uColor1: { value: pair[0] },
      uColor2: { value: pair[1] },
      uPattern: { value: i % 3 }
    };
    var lMat = new THREE.ShaderMaterial({
      uniforms: lUniforms,
      vertexShader: discVert,
      fragmentShader: discFrag,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    var lMesh = new THREE.Mesh(lGeo, lMat);
    lMesh.position.z = -i * 0.35;
    scene.add(lMesh);
    layers.push({
      mesh: lMesh,
      uniforms: lUniforms,
      baseZ: -i * 0.35,
      depth: depth,
      rotSpeed: (0.02 + i * 0.008) * (i % 2 === 0 ? 1 : -1),
      index: i
    });
  }

  /* ── Outer ring border ── */
  var outerRing = new THREE.Mesh(
    new THREE.TorusGeometry(2.8, 0.04, 16, 120),
    new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.4 })
  );
  scene.add(outerRing);

  var midRing = new THREE.Mesh(
    new THREE.TorusGeometry(2.2, 0.025, 12, 100),
    new THREE.MeshBasicMaterial({ color: MAGENTA, transparent: true, opacity: 0.2 })
  );
  midRing.position.z = -1.5;
  scene.add(midRing);

  var innerRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.6, 0.02, 12, 80),
    new THREE.MeshBasicMaterial({ color: VIOLET, transparent: true, opacity: 0.15 })
  );
  innerRing.position.z = -3.5;
  scene.add(innerRing);

  /* ── Floating motes around the portal ── */
  var MOTE_COUNT = 300;
  var moteGeo = new THREE.BufferGeometry();
  var motePos = new Float32Array(MOTE_COUNT * 3);
  var moteCol = new Float32Array(MOTE_COUNT * 3);
  var moteSizes = new Float32Array(MOTE_COUNT);
  var moteData = [];
  var moteColors = [CYAN, MAGENTA, VIOLET, new THREE.Color(0xffffff)];

  for (var m = 0; m < MOTE_COUNT; m++) {
    var mAng = Math.random() * Math.PI * 2;
    var mRad = 1.5 + Math.random() * 2.0;
    var mZ = (Math.random() - 0.5) * 8;
    motePos[m * 3] = Math.cos(mAng) * mRad;
    motePos[m * 3 + 1] = Math.sin(mAng) * mRad;
    motePos[m * 3 + 2] = mZ;
    moteSizes[m] = 0.8 + Math.random() * 2.0;
    var mc = moteColors[Math.floor(Math.random() * moteColors.length)];
    moteCol[m * 3] = mc.r;
    moteCol[m * 3 + 1] = mc.g;
    moteCol[m * 3 + 2] = mc.b;
    moteData.push({
      angle: mAng,
      radius: mRad,
      z: mZ,
      speed: 0.1 + Math.random() * 0.3,
      drift: (Math.random() - 0.5) * 0.3,
      phase: Math.random() * Math.PI * 2
    });
  }

  moteGeo.setAttribute('position', new THREE.BufferAttribute(motePos, 3));
  moteGeo.setAttribute('color', new THREE.BufferAttribute(moteCol, 3));
  moteGeo.setAttribute('aSize', new THREE.BufferAttribute(moteSizes, 1));

  var moteVert = [
    'attribute float aSize;',
    'uniform float uTime;',
    'uniform float uAudio;',
    'varying vec3 vColor;',
    'varying float vAlpha;',
    'void main() {',
    '  vColor = color;',
    '  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);',
    '  float dist = -mvPos.z;',
    '  gl_PointSize = aSize * (1.0 + uAudio * 0.3) * (50.0 / max(dist, 1.0));',
    '  vAlpha = smoothstep(15.0, 2.0, dist) * 0.4;',
    '  gl_Position = projectionMatrix * mvPos;',
    '}'
  ].join('\n');

  var moteFrag = [
    'precision highp float;',
    'varying vec3 vColor;',
    'varying float vAlpha;',
    'void main() {',
    '  float d = length(gl_PointCoord - 0.5) * 2.0;',
    '  float a = exp(-d * d * 3.0);',
    '  gl_FragColor = vec4(vColor, a * vAlpha);',
    '}'
  ].join('\n');

  var moteUniforms = {
    uTime: { value: 0 },
    uAudio: { value: 0 }
  };

  var moteMat = new THREE.ShaderMaterial({
    uniforms: moteUniforms,
    vertexShader: moteVert,
    fragmentShader: moteFrag,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    vertexColors: true
  });
  scene.add(new THREE.Points(moteGeo, moteMat));

  /* ── Interaction ── */
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

  /* ── Animate ── */
  var clock = new THREE.Clock();
  var isVisible = true;

  function animate() {
    if (!isVisible) { requestAnimationFrame(animate); return; }
    var t = clock.getElapsedTime();

    audioLevel += (targetAudioLevel - audioLevel) * 0.08;
    smoothMouse.x += (mouse.x - smoothMouse.x) * 0.04;
    smoothMouse.y += (mouse.y - smoothMouse.y) * 0.04;

    var pulse = Math.pow(Math.abs(Math.sin(t * 2.0)), 3.0) * (0.3 + audioLevel * 0.7);

    moteUniforms.uTime.value = t;
    moteUniforms.uAudio.value = audioLevel;

    // Layers: each rotates, parallax shifts, and pulses
    for (var i = 0; i < layers.length; i++) {
      var L = layers[i];
      L.uniforms.uTime.value = t;
      L.uniforms.uAudio.value = audioLevel;
      L.uniforms.uPulse.value = pulse;

      if (!reducedMotion) {
        L.mesh.rotation.z += L.rotSpeed * 0.016;
      }

      // Parallax — deeper layers shift less with mouse, creating depth
      var parallaxStr = 1.0 - L.depth * 0.7;
      L.mesh.position.x = (smoothMouse.x - 0.5) * parallaxStr * 0.8;
      L.mesh.position.y = (smoothMouse.y - 0.5) * -parallaxStr * 0.8;

      // Breathing — layers gently expand/contract
      var breathe = 1.0 + Math.sin(t * 1.2 + L.index * 0.4) * 0.04 * (1.0 + audioLevel * 2.0);
      L.mesh.scale.set(breathe, breathe, 1);

      // Depth pulsation — layers spread and compress
      var depthPulse = Math.sin(t * 0.8 + L.index * 0.3) * 0.1 * (1.0 + audioLevel);
      L.mesh.position.z = L.baseZ + depthPulse;
    }

    // Rings pulse
    outerRing.material.opacity = 0.25 + pulse * 0.3 + audioLevel * 0.15;
    outerRing.scale.setScalar(1.0 + pulse * 0.08);
    if (!reducedMotion) outerRing.rotation.z = t * 0.03;

    midRing.material.opacity = 0.12 + pulse * 0.2;
    midRing.scale.setScalar(1.0 + pulse * 0.1);
    if (!reducedMotion) midRing.rotation.z = -t * 0.05;

    innerRing.material.opacity = 0.08 + pulse * 0.15;
    innerRing.scale.setScalar(1.0 + pulse * 0.12);
    if (!reducedMotion) innerRing.rotation.z = t * 0.07;

    // Floating motes orbit
    for (var m = 0; m < MOTE_COUNT; m++) {
      var md = moteData[m];
      md.angle += md.speed * 0.016 * (1.0 + audioLevel);
      motePos[m * 3] = Math.cos(md.angle) * md.radius;
      motePos[m * 3 + 1] = Math.sin(md.angle) * md.radius + Math.sin(t * 0.5 + md.phase) * 0.2;
      motePos[m * 3 + 2] = md.z + Math.sin(t * 0.3 + md.phase) * 0.5;
    }
    moteGeo.attributes.position.needsUpdate = true;

    // Camera subtle parallax
    if (!reducedMotion) {
      camera.position.x = (smoothMouse.x - 0.5) * 1.0;
      camera.position.y = (smoothMouse.y - 0.5) * -1.0;
    }
    camera.lookAt(0, 0, -2);

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
