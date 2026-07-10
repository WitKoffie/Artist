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

  /* ── Scene setup ── */
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(75, 1, 0.1, 200);
  camera.position.set(0, 0, 0.1);
  camera.lookAt(0, 0, -100);

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

  /* ── Tunnel shader ── */
  var tunnelUniforms = {
    uTime: { value: 0 },
    uAudio: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uPulse: { value: 0 }
  };

  var tunnelVert = [
    'varying vec2 vUv;',
    'varying vec3 vPos;',
    'void main() {',
    '  vUv = uv;',
    '  vPos = position;',
    '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
    '}'
  ].join('\n');

  var tunnelFrag = [
    'precision highp float;',
    'uniform float uTime;',
    'uniform float uAudio;',
    'uniform vec2 uMouse;',
    'uniform float uPulse;',
    'varying vec2 vUv;',
    'varying vec3 vPos;',
    '',
    'vec3 cyan    = vec3(0.0, 0.898, 1.0);',
    'vec3 magenta = vec3(1.0, 0.165, 0.667);',
    'vec3 violet  = vec3(0.545, 0.361, 0.965);',
    'vec3 deep    = vec3(0.015, 0.005, 0.04);',
    'vec3 amber   = vec3(0.77, 0.52, 0.11);',
    '',
    'float hash(vec2 p) {',
    '  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);',
    '}',
    '',
    'float noise(vec2 p) {',
    '  vec2 i = floor(p);',
    '  vec2 f = fract(p);',
    '  f = f * f * (3.0 - 2.0 * f);',
    '  return mix(',
    '    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),',
    '    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),',
    '    f.y);',
    '}',
    '',
    'float fbm(vec2 p) {',
    '  float v = 0.0, a = 0.5;',
    '  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.1; a *= 0.48; }',
    '  return v;',
    '}',
    '',
    'void main() {',
    '  float angle = vUv.x * 6.2832;',
    '  float depth = vUv.y;',
    '  float speed = 0.3 + uAudio * 0.5;',
    '',
    '  // Flowing depth — perpetual forward motion',
    '  float flow = depth * 8.0 + uTime * speed;',
    '',
    '  // Spiral energy streams wrapping the tunnel',
    '  float spiral1 = sin(angle * 4.0 + flow * 1.5) * 0.5 + 0.5;',
    '  float spiral2 = sin(angle * 6.0 - flow * 2.0 + 1.5) * 0.5 + 0.5;',
    '  float spiral3 = sin(angle * 2.0 + flow * 0.8 + 3.0) * 0.5 + 0.5;',
    '',
    '  // Nebula clouds swirling through the tunnel',
    '  vec2 nUv = vec2(angle * 0.5 + uTime * 0.02, flow * 0.15);',
    '  float neb = fbm(nUv * 3.0);',
    '  float neb2 = fbm(nUv * 5.0 + 2.5);',
    '',
    '  // Depth fog — darker near camera, bright at vanishing point',
    '  float depthFade = smoothstep(0.0, 0.4, depth);',
    '  float farGlow = smoothstep(0.7, 1.0, depth);',
    '',
    '  // Base color — deep void with depth',
    '  vec3 col = deep;',
    '',
    '  // Nebula clouds',
    '  col = mix(col, violet * 0.35, neb * depthFade * 0.8);',
    '  col = mix(col, deep * 1.5, neb2 * 0.3);',
    '',
    '  // Spiral energy streams',
    '  float s1 = pow(spiral1, 4.0) * depthFade;',
    '  float s2 = pow(spiral2, 5.0) * depthFade;',
    '  float s3 = pow(spiral3, 3.0) * depthFade;',
    '  col += cyan * s1 * 0.35;',
    '  col += magenta * s2 * 0.25;',
    '  col += violet * s3 * 0.2;',
    '',
    '  // Frequency rings — pulsating bands across the tunnel depth',
    '  float ringFreq = 30.0;',
    '  float ringPhase = flow * ringFreq;',
    '  float ring = pow(abs(sin(ringPhase)), 40.0);',
    '  float ringPulse = ring * (0.3 + uAudio * 0.7 + uPulse * 0.5);',
    '  vec3 ringCol = mix(cyan, magenta, sin(depth * 3.0 + uTime * 0.3) * 0.5 + 0.5);',
    '  col += ringCol * ringPulse * depthFade * 0.6;',
    '',
    '  // Wider pulsation bands — bass frequency feel',
    '  float bassPulse = pow(abs(sin(flow * 4.0 + uTime * 1.5)), 8.0);',
    '  col += violet * bassPulse * 0.15 * (1.0 + uAudio);',
    '',
    '  // Vanishing point glow — the light at the end',
    '  col += mix(cyan, vec3(1.0), 0.3) * farGlow * (0.5 + uAudio * 0.5);',
    '',
    '  // Mouse sway highlight — as if a light source shifts',
    '  float mAngle = atan(uMouse.y - 0.5, uMouse.x - 0.5);',
    '  float angleDiff = abs(sin((angle - mAngle) * 0.5));',
    '  col += violet * 0.08 * (1.0 - angleDiff) * depthFade;',
    '',
    '  // Sparkle dust',
    '  float sparkle = hash(vec2(angle * 20.0, flow * 10.0) + floor(uTime * 5.0));',
    '  sparkle = pow(sparkle, 25.0) * depthFade;',
    '  col += vec3(0.9, 0.95, 1.0) * sparkle * (0.5 + uAudio * 1.0);',
    '',
    '  // Edge vignette — darken near camera opening',
    '  float vignette = smoothstep(0.0, 0.15, depth);',
    '  col *= vignette;',
    '',
    '  // Subtle amber warmth in mid-tones',
    '  col += amber * 0.04 * neb * depthFade;',
    '',
    '  gl_FragColor = vec4(col, 0.95);',
    '}'
  ].join('\n');

  /* ── Build the tunnel geometry ── */
  var tunnelLength = 80;
  var tunnelRadius = 3.5;
  var tunnelSegments = 128;
  var tunnelRadialSegs = 64;

  var tunnelGeo = new THREE.CylinderGeometry(
    tunnelRadius, tunnelRadius * 0.3,
    tunnelLength, tunnelRadialSegs, tunnelSegments, true
  );
  tunnelGeo.rotateX(Math.PI / 2);
  tunnelGeo.translate(0, 0, -tunnelLength / 2);

  var tunnelMat = new THREE.ShaderMaterial({
    uniforms: tunnelUniforms,
    vertexShader: tunnelVert,
    fragmentShader: tunnelFrag,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false
  });
  var tunnel = new THREE.Mesh(tunnelGeo, tunnelMat);
  scene.add(tunnel);

  /* ── Depth particles — stars flying past ── */
  var starCount = 300;
  var starGeo = new THREE.BufferGeometry();
  var starPos = new Float32Array(starCount * 3);
  var starCol = new Float32Array(starCount * 3);
  var starSizes = new Float32Array(starCount);
  var starSpeeds = [];

  var colChoices = [
    new THREE.Color(0x00e5ff),
    new THREE.Color(0xff2aaa),
    new THREE.Color(0x8b5cf6),
    new THREE.Color(0xffffff)
  ];

  for (var i = 0; i < starCount; i++) {
    var ang = Math.random() * Math.PI * 2;
    var rad = 0.3 + Math.random() * (tunnelRadius - 0.8);
    starPos[i * 3] = Math.cos(ang) * rad;
    starPos[i * 3 + 1] = Math.sin(ang) * rad;
    starPos[i * 3 + 2] = -Math.random() * tunnelLength;
    starSpeeds.push(8 + Math.random() * 20);
    starSizes[i] = 1.5 + Math.random() * 3.0;

    var sc = colChoices[Math.floor(Math.random() * colChoices.length)];
    starCol[i * 3] = sc.r;
    starCol[i * 3 + 1] = sc.g;
    starCol[i * 3 + 2] = sc.b;
  }

  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(starCol, 3));
  starGeo.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));

  var starVertShader = [
    'attribute float size;',
    'varying vec3 vColor;',
    'void main() {',
    '  vColor = color;',
    '  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);',
    '  gl_PointSize = size * (80.0 / -mvPos.z);',
    '  gl_Position = projectionMatrix * mvPos;',
    '}'
  ].join('\n');

  var starFragShader = [
    'precision highp float;',
    'varying vec3 vColor;',
    'void main() {',
    '  float d = length(gl_PointCoord - 0.5) * 2.0;',
    '  float alpha = 1.0 - smoothstep(0.0, 1.0, d);',
    '  alpha *= alpha;',
    '  gl_FragColor = vec4(vColor, alpha * 0.8);',
    '}'
  ].join('\n');

  var starMat = new THREE.ShaderMaterial({
    vertexShader: starVertShader,
    fragmentShader: starFragShader,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    vertexColors: true
  });
  var stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  /* ── Pulsating ring gates along the tunnel ── */
  var ringGates = [];
  var ringGateCount = 8;
  for (var r = 0; r < ringGateCount; r++) {
    var rz = -(r + 1) * (tunnelLength / (ringGateCount + 1));
    var rRadius = tunnelRadius * (1.0 - (r / ringGateCount) * 0.6);
    var rGeo = new THREE.TorusGeometry(rRadius, 0.03 + (ringGateCount - r) * 0.005, 16, 80);
    var rColor = r % 3 === 0 ? 0x00e5ff : (r % 3 === 1 ? 0xff2aaa : 0x8b5cf6);
    var rMat = new THREE.MeshBasicMaterial({
      color: rColor,
      transparent: true,
      opacity: 0.3
    });
    var rMesh = new THREE.Mesh(rGeo, rMat);
    rMesh.position.set(0, 0, rz);
    scene.add(rMesh);
    ringGates.push({
      mesh: rMesh,
      baseZ: rz,
      baseRadius: rRadius,
      speed: 0.6 + r * 0.15,
      phase: r * 0.8
    });
  }

  /* ── Central vanishing point glow ── */
  var vpGeo = new THREE.SphereGeometry(0.6, 32, 32);
  var vpMat = new THREE.MeshBasicMaterial({
    color: 0x00e5ff,
    transparent: true,
    opacity: 0.4
  });
  var vpGlow = new THREE.Mesh(vpGeo, vpMat);
  vpGlow.position.set(0, 0, -tunnelLength + 2);
  scene.add(vpGlow);

  var vpGeo2 = new THREE.SphereGeometry(1.8, 32, 32);
  var vpMat2 = new THREE.MeshBasicMaterial({
    color: 0x8b5cf6,
    transparent: true,
    opacity: 0.12
  });
  var vpGlow2 = new THREE.Mesh(vpGeo2, vpMat2);
  vpGlow2.position.set(0, 0, -tunnelLength + 2);
  scene.add(vpGlow2);

  /* ── Interaction state ── */
  var mouse = { x: 0.5, y: 0.5 };
  var smoothMouse = { x: 0.5, y: 0.5 };
  var isAudioPlaying = false;
  var audioLevel = 0;
  var targetAudioLevel = 0;
  var pulse = 0;

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

  function animate() {
    if (!isVisible) { requestAnimationFrame(animate); return; }
    var t = clock.getElapsedTime();
    var dt = clock.getDelta();

    // Smooth audio
    audioLevel += (targetAudioLevel - audioLevel) * 0.08;

    // Smooth mouse
    smoothMouse.x += (mouse.x - smoothMouse.x) * 0.04;
    smoothMouse.y += (mouse.y - smoothMouse.y) * 0.04;

    // Gentle camera sway from mouse
    if (!reducedMotion) {
      camera.position.x = (smoothMouse.x - 0.5) * 0.6;
      camera.position.y = (smoothMouse.y - 0.5) * -0.6;
      camera.lookAt(0, 0, -50);
    }

    // Pulse — rhythmic throb
    pulse = Math.pow(Math.abs(Math.sin(t * 2.0)), 3.0) * (0.3 + audioLevel * 0.7);

    // Update tunnel shader
    tunnelUniforms.uTime.value = t;
    tunnelUniforms.uAudio.value = audioLevel;
    tunnelUniforms.uMouse.value.set(smoothMouse.x, smoothMouse.y);
    tunnelUniforms.uPulse.value = pulse;

    // Animate depth particles — fly toward camera, loop back
    var posArr = starGeo.attributes.position.array;
    var speedMul = 1.0 + audioLevel * 2.0;
    for (var i = 0; i < starCount; i++) {
      posArr[i * 3 + 2] += starSpeeds[i] * 0.016 * speedMul;
      if (posArr[i * 3 + 2] > 1) {
        var ang = Math.random() * Math.PI * 2;
        var rad = 0.3 + Math.random() * (tunnelRadius - 0.8);
        posArr[i * 3] = Math.cos(ang) * rad;
        posArr[i * 3 + 1] = Math.sin(ang) * rad;
        posArr[i * 3 + 2] = -tunnelLength + Math.random() * 5;
      }
    }
    starGeo.attributes.position.needsUpdate = true;

    // Animate ring gates — pulsate scale and opacity
    for (var r = 0; r < ringGates.length; r++) {
      var rg = ringGates[r];
      var wave = Math.sin(t * rg.speed + rg.phase);
      var scale = 1.0 + wave * 0.08 * (1.0 + audioLevel * 2.0);
      rg.mesh.scale.set(scale, scale, 1);
      rg.mesh.material.opacity = 0.15 + wave * 0.15 + audioLevel * 0.2;

      if (!reducedMotion) {
        rg.mesh.rotation.z = t * 0.1 * (r % 2 === 0 ? 1 : -1);
      }
    }

    // Vanishing point pulse
    vpGlow.material.opacity = 0.25 + pulse * 0.5 + audioLevel * 0.3;
    vpGlow.scale.setScalar(1.0 + pulse * 0.4);
    vpGlow2.material.opacity = 0.08 + pulse * 0.15;
    vpGlow2.scale.setScalar(1.0 + pulse * 0.6);

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
