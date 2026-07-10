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

  // Camera offset and angled — so you SEE the tunnel walls receding
  var camera = new THREE.PerspectiveCamera(70, 1, 0.1, 200);
  camera.position.set(0.8, 0.6, 2.5);
  camera.lookAt(0, 0, -40);

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

  /* ── Tunnel wall shader ── */
  var tunnelUniforms = {
    uTime: { value: 0 },
    uAudio: { value: 0 },
    uPulse: { value: 0 }
  };

  var tunnelVert = [
    'varying vec2 vUv;',
    'varying float vDepth;',
    'void main() {',
    '  vUv = uv;',
    '  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);',
    '  vDepth = -mvPos.z / 80.0;',
    '  gl_Position = projectionMatrix * mvPos;',
    '}'
  ].join('\n');

  var tunnelFrag = [
    'precision highp float;',
    'uniform float uTime;',
    'uniform float uAudio;',
    'uniform float uPulse;',
    'varying vec2 vUv;',
    'varying float vDepth;',
    '',
    'vec3 cyan    = vec3(0.0, 0.898, 1.0);',
    'vec3 magenta = vec3(1.0, 0.165, 0.667);',
    'vec3 violet  = vec3(0.545, 0.361, 0.965);',
    'vec3 deep    = vec3(0.012, 0.004, 0.035);',
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
    'float fbm(vec2 p) {',
    '  float v=0.0, a=0.5;',
    '  for(int i=0;i<4;i++){v+=a*noise(p);p*=2.1;a*=0.5;}',
    '  return v;',
    '}',
    '',
    'void main() {',
    '  float angle = vUv.x * 6.2832;',
    '  float depth = vUv.y;',
    '  float speed = 0.25 + uAudio * 0.5;',
    '  float flow = depth * 10.0 + uTime * speed;',
    '',
    '  // Spirals wrapping the walls',
    '  float s1 = pow(sin(angle*3.0 + flow*1.2)*0.5+0.5, 3.0);',
    '  float s2 = pow(sin(angle*5.0 - flow*1.8+1.5)*0.5+0.5, 4.0);',
    '  float s3 = pow(sin(angle*2.0 + flow*0.6+3.0)*0.5+0.5, 2.5);',
    '',
    '  // Nebula',
    '  vec2 nUv = vec2(angle*0.4+uTime*0.015, flow*0.12);',
    '  float neb = fbm(nUv*3.5);',
    '',
    '  // Depth atmosphere',
    '  float depthFade = smoothstep(0.0, 0.25, depth);',
    '  float farGlow = smoothstep(0.75, 1.0, depth);',
    '',
    '  vec3 col = deep;',
    '  col = mix(col, violet*0.3, neb*depthFade*0.7);',
    '  col += cyan * s1 * 0.3 * depthFade;',
    '  col += magenta * s2 * 0.2 * depthFade;',
    '  col += violet * s3 * 0.15 * depthFade;',
    '',
    '  // Frequency rings pulsating down the tunnel',
    '  float ring = pow(abs(sin(flow * 25.0)), 30.0);',
    '  vec3 ringCol = mix(cyan, magenta, sin(depth*4.0+uTime*0.4)*0.5+0.5);',
    '  col += ringCol * ring * (0.25 + uAudio*0.6 + uPulse*0.4) * depthFade;',
    '',
    '  // Bass throb',
    '  float bass = pow(abs(sin(flow*3.0 + uTime*1.8)), 6.0);',
    '  col += violet * bass * 0.12 * (1.0 + uAudio);',
    '',
    '  // Far end glow',
    '  col += mix(cyan, vec3(1.0), 0.4) * farGlow * (0.4 + uAudio*0.5);',
    '',
    '  // Sparkle dust in the walls',
    '  float sparkle = hash(vec2(angle*15.0, flow*8.0) + floor(uTime*4.0));',
    '  sparkle = pow(sparkle, 22.0) * depthFade;',
    '  col += vec3(0.9, 0.95, 1.0) * sparkle * (0.4 + uAudio);',
    '',
    '  // Vignette near opening',
    '  col *= smoothstep(0.0, 0.12, depth);',
    '',
    '  gl_FragColor = vec4(col, 0.92);',
    '}'
  ].join('\n');

  // Tapered cylinder — wider at camera end, narrower at far end for perspective
  var tunnelLen = 70;
  var tunnelGeo = new THREE.CylinderGeometry(
    4.0,   // top radius (far end — smaller)
    1.2,   // bottom radius (near camera — but we flip it)
    tunnelLen,
    64, 128, true
  );
  // Rotate so it extends along -Z and flip so wide end is near camera
  tunnelGeo.rotateX(Math.PI / 2);
  tunnelGeo.translate(0, 0, -tunnelLen / 2 + 2);

  var tunnelMat = new THREE.ShaderMaterial({
    uniforms: tunnelUniforms,
    vertexShader: tunnelVert,
    fragmentShader: tunnelFrag,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false
  });
  var tunnelMesh = new THREE.Mesh(tunnelGeo, tunnelMat);
  scene.add(tunnelMesh);

  /* ── Ring gates at intervals — physical 3D depth markers ── */
  var ringGates = [];
  for (var r = 0; r < 10; r++) {
    var rz = -3 - r * 6.5;
    var rLerp = r / 10;
    // Rings get smaller as they go deeper — matching tunnel taper
    var rRadius = 4.0 - rLerp * 2.8;
    var thickness = 0.04 - r * 0.002;
    if (thickness < 0.015) thickness = 0.015;
    var rGeo = new THREE.TorusGeometry(rRadius, thickness, 12, 80);
    var rColor = r % 3 === 0 ? CYAN : (r % 3 === 1 ? MAGENTA : VIOLET);
    var rMat = new THREE.MeshBasicMaterial({
      color: rColor,
      transparent: true,
      opacity: 0.35 - r * 0.02
    });
    var rMesh = new THREE.Mesh(rGeo, rMat);
    rMesh.position.set(0, 0, rz);
    scene.add(rMesh);
    ringGates.push({
      mesh: rMesh,
      baseZ: rz,
      baseRadius: rRadius,
      speed: 0.5 + r * 0.12,
      phase: r * 0.9,
      index: r
    });
  }

  /* ── Depth particles — stars streaking past ── */
  var starCount = 400;
  var starGeo = new THREE.BufferGeometry();
  var starPos = new Float32Array(starCount * 3);
  var starCol = new Float32Array(starCount * 3);
  var starSizes = new Float32Array(starCount);
  var starSpeeds = [];
  var colChoices = [CYAN, MAGENTA, VIOLET, new THREE.Color(0xffffff)];

  function initStar(i, farSpawn) {
    var ang = Math.random() * Math.PI * 2;
    var maxR = 3.8 - (farSpawn ? 2.0 : 0);
    var rad = 0.2 + Math.random() * maxR;
    starPos[i * 3] = Math.cos(ang) * rad;
    starPos[i * 3 + 1] = Math.sin(ang) * rad;
    starPos[i * 3 + 2] = farSpawn ? (-5 - Math.random() * tunnelLen) : (2 - Math.random() * (tunnelLen + 5));
    starSpeeds[i] = 6 + Math.random() * 18;
    starSizes[i] = 1.0 + Math.random() * 3.5;
    var sc = colChoices[Math.floor(Math.random() * colChoices.length)];
    starCol[i * 3] = sc.r;
    starCol[i * 3 + 1] = sc.g;
    starCol[i * 3 + 2] = sc.b;
  }

  for (var i = 0; i < starCount; i++) initStar(i, false);

  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(starCol, 3));
  starGeo.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));

  var starVert = [
    'attribute float size;',
    'varying vec3 vColor;',
    'varying float vAlpha;',
    'void main() {',
    '  vColor = color;',
    '  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);',
    '  float dist = -mvPos.z;',
    '  gl_PointSize = size * (60.0 / max(dist, 1.0));',
    '  vAlpha = smoothstep(80.0, 5.0, dist);',
    '  gl_Position = projectionMatrix * mvPos;',
    '}'
  ].join('\n');

  var starFrag = [
    'precision highp float;',
    'varying vec3 vColor;',
    'varying float vAlpha;',
    'void main() {',
    '  float d = length(gl_PointCoord - 0.5) * 2.0;',
    '  float a = 1.0 - smoothstep(0.0, 1.0, d);',
    '  a *= a;',
    '  gl_FragColor = vec4(vColor, a * vAlpha * 0.85);',
    '}'
  ].join('\n');

  var starMat = new THREE.ShaderMaterial({
    vertexShader: starVert,
    fragmentShader: starFrag,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    vertexColors: true
  });
  scene.add(new THREE.Points(starGeo, starMat));

  /* ── Vanishing point glow ── */
  var vpCore = new THREE.Mesh(
    new THREE.SphereGeometry(0.8, 32, 32),
    new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.5 })
  );
  vpCore.position.set(0, 0, -tunnelLen + 3);
  scene.add(vpCore);

  var vpHalo = new THREE.Mesh(
    new THREE.SphereGeometry(2.5, 32, 32),
    new THREE.MeshBasicMaterial({ color: VIOLET, transparent: true, opacity: 0.1 })
  );
  vpHalo.position.set(0, 0, -tunnelLen + 3);
  scene.add(vpHalo);

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
  var baseCamX = 0.8, baseCamY = 0.6;

  function animate() {
    if (!isVisible) { requestAnimationFrame(animate); return; }
    var t = clock.getElapsedTime();

    audioLevel += (targetAudioLevel - audioLevel) * 0.08;
    smoothMouse.x += (mouse.x - smoothMouse.x) * 0.04;
    smoothMouse.y += (mouse.y - smoothMouse.y) * 0.04;

    // Camera sway — mouse moves the viewpoint around inside the tunnel
    if (!reducedMotion) {
      camera.position.x = baseCamX + (smoothMouse.x - 0.5) * 1.2;
      camera.position.y = baseCamY + (smoothMouse.y - 0.5) * -1.2;
      // Gentle orbit drift
      camera.position.x += Math.sin(t * 0.15) * 0.3;
      camera.position.y += Math.cos(t * 0.12) * 0.2;
    }
    camera.lookAt(0, 0, -40);

    // Pulse rhythm
    var pulse = Math.pow(Math.abs(Math.sin(t * 2.0)), 3.0) * (0.3 + audioLevel * 0.7);

    tunnelUniforms.uTime.value = t;
    tunnelUniforms.uAudio.value = audioLevel;
    tunnelUniforms.uPulse.value = pulse;

    // Stars fly toward camera
    var speedMul = 1.0 + audioLevel * 2.5;
    for (var i = 0; i < starCount; i++) {
      starPos[i * 3 + 2] += starSpeeds[i] * 0.016 * speedMul;
      if (starPos[i * 3 + 2] > 4) {
        initStar(i, true);
      }
    }
    starGeo.attributes.position.needsUpdate = true;

    // Ring gates pulse and rotate
    for (var r = 0; r < ringGates.length; r++) {
      var rg = ringGates[r];
      var wave = Math.sin(t * rg.speed + rg.phase);
      var sc = 1.0 + wave * 0.06 * (1.0 + audioLevel * 2.5);
      rg.mesh.scale.set(sc, sc, 1);
      rg.mesh.material.opacity = 0.2 + wave * 0.15 + audioLevel * 0.15 + pulse * 0.1;
      if (!reducedMotion) {
        rg.mesh.rotation.z = t * 0.08 * (r % 2 === 0 ? 1 : -1);
      }
    }

    // Vanishing point throb
    vpCore.material.opacity = 0.3 + pulse * 0.5 + audioLevel * 0.3;
    vpCore.scale.setScalar(1.0 + pulse * 0.5);
    vpHalo.material.opacity = 0.06 + pulse * 0.12;
    vpHalo.scale.setScalar(1.0 + pulse * 0.8);

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
