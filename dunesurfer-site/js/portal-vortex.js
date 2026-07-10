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
  var camera = new THREE.PerspectiveCamera(60, 1, 0.1, 200);
  camera.position.set(0, 0, 5.5);

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
  var GOLD = new THREE.Color(0xffc864);

  /* ── Main vortex sphere particles ── */
  var PARTICLE_COUNT = 3000;
  var geo = new THREE.BufferGeometry();
  var positions = new Float32Array(PARTICLE_COUNT * 3);
  var colors = new Float32Array(PARTICLE_COUNT * 3);
  var sizes = new Float32Array(PARTICLE_COUNT);
  var phases = new Float32Array(PARTICLE_COUNT);
  var bands = new Float32Array(PARTICLE_COUNT);
  var orbits = new Float32Array(PARTICLE_COUNT * 2);

  var colChoices = [CYAN, MAGENTA, VIOLET, GOLD, new THREE.Color(0xffffff)];

  for (var i = 0; i < PARTICLE_COUNT; i++) {
    var theta = Math.random() * Math.PI * 2;
    var phi = Math.acos(2 * Math.random() - 1);
    var r = 1.8 + Math.random() * 0.6;

    if (i < PARTICLE_COUNT * 0.3) {
      var torusAngle = Math.random() * Math.PI * 2;
      var torusR = 2.0 + Math.cos(torusAngle) * 0.5;
      var torusY = Math.sin(torusAngle) * 0.5;
      positions[i * 3] = torusR * Math.cos(theta);
      positions[i * 3 + 1] = torusY;
      positions[i * 3 + 2] = torusR * Math.sin(theta);
    } else {
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }

    phases[i] = Math.random() * Math.PI * 2;
    bands[i] = Math.floor(Math.random() * 5);
    orbits[i * 2] = 0.15 + Math.random() * 0.6;
    orbits[i * 2 + 1] = (Math.random() - 0.5) * 0.4;

    sizes[i] = 1.2 + Math.random() * 3.0;

    var c = colChoices[Math.floor(Math.random() * colChoices.length)];
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
  geo.setAttribute('aBand', new THREE.BufferAttribute(bands, 1));

  var vertShader = [
    'attribute float aSize;',
    'attribute float aPhase;',
    'attribute float aBand;',
    'uniform float uTime;',
    'uniform float uAudio;',
    'uniform float uPulse;',
    'uniform float uFreqBands[5];',
    'varying vec3 vColor;',
    'varying float vAlpha;',
    'varying float vGlow;',
    '',
    'void main() {',
    '  vColor = color;',
    '',
    '  // Frequency band reactivity',
    '  int band = int(aBand);',
    '  float bandLevel = 0.0;',
    '  if (band == 0) bandLevel = uFreqBands[0];',
    '  else if (band == 1) bandLevel = uFreqBands[1];',
    '  else if (band == 2) bandLevel = uFreqBands[2];',
    '  else if (band == 3) bandLevel = uFreqBands[3];',
    '  else bandLevel = uFreqBands[4];',
    '',
    '  // Pulsate — particles breathe in and out',
    '  float breathe = sin(uTime * 1.5 + aPhase) * 0.15 * (1.0 + uAudio * 2.0);',
    '  float freqPop = bandLevel * 0.4;',
    '',
    '  vec3 pos = position * (1.0 + breathe + freqPop);',
    '',
    '  vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);',
    '  float dist = -mvPos.z;',
    '',
    '  // Size modulation',
    '  float sizePulse = 1.0 + uPulse * 0.6 + bandLevel * 0.5;',
    '  gl_PointSize = aSize * sizePulse * (80.0 / max(dist, 1.0));',
    '',
    '  vAlpha = smoothstep(20.0, 2.0, dist) * (0.6 + bandLevel * 0.4);',
    '  vGlow = uPulse + bandLevel * 0.5;',
    '',
    '  gl_Position = projectionMatrix * mvPos;',
    '}'
  ].join('\n');

  var fragShader = [
    'precision highp float;',
    'varying vec3 vColor;',
    'varying float vAlpha;',
    'varying float vGlow;',
    '',
    'void main() {',
    '  float d = length(gl_PointCoord - 0.5) * 2.0;',
    '  float core = 1.0 - smoothstep(0.0, 0.3, d);',
    '  float glow = exp(-d * d * 2.5);',
    '  float outer = exp(-d * d * 0.8) * 0.3;',
    '  float a = core + glow * (0.6 + vGlow * 0.4) + outer;',
    '  vec3 col = mix(vColor, vec3(1.0), core * 0.5);',
    '  gl_FragColor = vec4(col, a * vAlpha);',
    '}'
  ].join('\n');

  var uniforms = {
    uTime: { value: 0 },
    uAudio: { value: 0 },
    uPulse: { value: 0 },
    uFreqBands: { value: [0, 0, 0, 0, 0] }
  };

  var mat = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertShader,
    fragmentShader: fragShader,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    vertexColors: true
  });

  var points = new THREE.Points(geo, mat);
  scene.add(points);

  /* ── Inner core glow ── */
  var coreGeo = new THREE.SphereGeometry(0.35, 32, 32);
  var coreMat = new THREE.MeshBasicMaterial({
    color: CYAN,
    transparent: true,
    opacity: 0.6
  });
  var coreMesh = new THREE.Mesh(coreGeo, coreMat);
  scene.add(coreMesh);

  var haloMat = new THREE.MeshBasicMaterial({
    color: VIOLET,
    transparent: true,
    opacity: 0.08
  });
  var haloMesh = new THREE.Mesh(new THREE.SphereGeometry(1.0, 32, 32), haloMat);
  scene.add(haloMesh);

  /* ── Orbital ring bands (frequency visualizers) ── */
  var freqRings = [];
  var ringColors = [CYAN, MAGENTA, VIOLET, GOLD, new THREE.Color(0x22ddff)];
  var ringRadii = [2.6, 2.3, 2.0, 2.8, 3.1];

  for (var r = 0; r < 5; r++) {
    var rGeo = new THREE.TorusGeometry(ringRadii[r], 0.012, 8, 120);
    var rMat = new THREE.MeshBasicMaterial({
      color: ringColors[r],
      transparent: true,
      opacity: 0.15
    });
    var rMesh = new THREE.Mesh(rGeo, rMat);
    rMesh.rotation.x = Math.PI / 2 + (r - 2) * 0.25;
    rMesh.rotation.y = r * 0.6;
    scene.add(rMesh);
    freqRings.push({ mesh: rMesh, baseRadius: ringRadii[r], band: r });
  }

  /* ── Trailing spark particles ── */
  var SPARK_COUNT = 200;
  var sparkGeo = new THREE.BufferGeometry();
  var sparkPos = new Float32Array(SPARK_COUNT * 3);
  var sparkCol = new Float32Array(SPARK_COUNT * 3);
  var sparkSizes = new Float32Array(SPARK_COUNT);
  var sparkData = [];

  for (var s = 0; s < SPARK_COUNT; s++) {
    var sAng = Math.random() * Math.PI * 2;
    var sRad = 2.5 + Math.random() * 1.5;
    var sElev = (Math.random() - 0.5) * 2;
    sparkPos[s * 3] = Math.cos(sAng) * sRad;
    sparkPos[s * 3 + 1] = sElev;
    sparkPos[s * 3 + 2] = Math.sin(sAng) * sRad;
    sparkSizes[s] = 0.5 + Math.random() * 1.5;
    var sc = colChoices[Math.floor(Math.random() * colChoices.length)];
    sparkCol[s * 3] = sc.r;
    sparkCol[s * 3 + 1] = sc.g;
    sparkCol[s * 3 + 2] = sc.b;
    sparkData.push({
      angle: sAng,
      radius: sRad,
      elevation: sElev,
      speed: 0.3 + Math.random() * 0.8,
      drift: (Math.random() - 0.5) * 0.15
    });
  }

  sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
  sparkGeo.setAttribute('color', new THREE.BufferAttribute(sparkCol, 3));
  sparkGeo.setAttribute('aSize', new THREE.BufferAttribute(sparkSizes, 1));

  var sparkMat = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: [
      'attribute float aSize;',
      'uniform float uTime;',
      'uniform float uAudio;',
      'varying vec3 vColor;',
      'varying float vAlpha;',
      'void main() {',
      '  vColor = color;',
      '  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);',
      '  float dist = -mvPos.z;',
      '  gl_PointSize = aSize * (1.0 + uAudio * 0.5) * (50.0 / max(dist, 1.0));',
      '  vAlpha = smoothstep(15.0, 2.0, dist) * 0.5;',
      '  gl_Position = projectionMatrix * mvPos;',
      '}'
    ].join('\n'),
    fragmentShader: [
      'precision highp float;',
      'varying vec3 vColor;',
      'varying float vAlpha;',
      'void main() {',
      '  float d = length(gl_PointCoord - 0.5) * 2.0;',
      '  float a = exp(-d * d * 3.0);',
      '  gl_FragColor = vec4(vColor, a * vAlpha);',
      '}'
    ].join('\n'),
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    vertexColors: true
  });
  scene.add(new THREE.Points(sparkGeo, sparkMat));

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
  var origPositions = new Float32Array(positions);

  function animate() {
    if (!isVisible) { requestAnimationFrame(animate); return; }
    var t = clock.getElapsedTime();
    var dt = Math.min(clock.getDelta(), 0.05);

    audioLevel += (targetAudioLevel - audioLevel) * 0.08;
    smoothMouse.x += (mouse.x - smoothMouse.x) * 0.04;
    smoothMouse.y += (mouse.y - smoothMouse.y) * 0.04;

    // Simulated frequency bands (driven by time, boosted by audio)
    var freqBands = uniforms.uFreqBands.value;
    for (var b = 0; b < 5; b++) {
      var baseFreq = 0.8 + b * 0.6;
      freqBands[b] = (Math.sin(t * baseFreq + b * 1.3) * 0.5 + 0.5) * (0.2 + audioLevel * 0.8);
    }

    var pulse = Math.pow(Math.abs(Math.sin(t * 2.0)), 3.0) * (0.3 + audioLevel * 0.7);

    uniforms.uTime.value = t;
    uniforms.uAudio.value = audioLevel;
    uniforms.uPulse.value = pulse;

    // Rotate the whole vortex
    if (!reducedMotion) {
      points.rotation.y = t * 0.12;
      points.rotation.x = Math.sin(t * 0.08) * 0.15;
      points.rotation.z = Math.cos(t * 0.06) * 0.05;
    }

    // Rotate positions for swirl effect within the sphere
    var posArr = geo.attributes.position.array;
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      var ox = origPositions[i * 3];
      var oy = origPositions[i * 3 + 1];
      var oz = origPositions[i * 3 + 2];

      var localAngle = t * orbits[i * 2] + phases[i];
      var drift = orbits[i * 2 + 1] * t;

      var cosA = Math.cos(localAngle);
      var sinA = Math.sin(localAngle);
      posArr[i * 3] = ox * cosA - oz * sinA;
      posArr[i * 3 + 2] = ox * sinA + oz * cosA;
      posArr[i * 3 + 1] = oy + Math.sin(drift + phases[i]) * 0.15;
    }
    geo.attributes.position.needsUpdate = true;

    // Spark trails orbit
    for (var s = 0; s < SPARK_COUNT; s++) {
      var sd = sparkData[s];
      sd.angle += sd.speed * 0.016 * (1.0 + audioLevel * 1.5);
      sd.elevation += sd.drift * 0.016;
      if (Math.abs(sd.elevation) > 2) sd.drift *= -1;
      sparkPos[s * 3] = Math.cos(sd.angle) * sd.radius;
      sparkPos[s * 3 + 1] = sd.elevation;
      sparkPos[s * 3 + 2] = Math.sin(sd.angle) * sd.radius;
    }
    sparkGeo.attributes.position.needsUpdate = true;

    // Camera: mouse parallax + orbit
    if (!reducedMotion) {
      camera.position.x = (smoothMouse.x - 0.5) * 2.0 + Math.sin(t * 0.1) * 0.4;
      camera.position.y = (smoothMouse.y - 0.5) * -2.0 + Math.cos(t * 0.08) * 0.3;
    }
    camera.lookAt(0, 0, 0);

    // Frequency rings react to their band
    for (var r = 0; r < freqRings.length; r++) {
      var fr = freqRings[r];
      var bv = freqBands[fr.band];
      var sc = 1.0 + bv * 0.3 + pulse * 0.15;
      fr.mesh.scale.set(sc, sc, sc);
      fr.mesh.material.opacity = 0.08 + bv * 0.35 + pulse * 0.1;
      if (!reducedMotion) {
        fr.mesh.rotation.z = t * (0.05 + r * 0.02) * (r % 2 === 0 ? 1 : -1);
      }
    }

    // Core glow pulses
    coreMat.opacity = 0.3 + pulse * 0.5 + audioLevel * 0.3;
    coreMesh.scale.setScalar(1.0 + pulse * 0.4 + audioLevel * 0.2);
    var coreHue = (Math.sin(t * 0.3) * 0.5 + 0.5);
    coreMat.color.lerpColors(CYAN, MAGENTA, coreHue);

    haloMat.opacity = 0.04 + pulse * 0.1;
    haloMesh.scale.setScalar(1.0 + pulse * 0.6 + audioLevel * 0.4);

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
