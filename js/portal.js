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

  /* colors */
  var CYAN = new THREE.Color(0x00e5ff);
  var MAGENTA = new THREE.Color(0xff2aaa);
  var VIOLET = new THREE.Color(0x8b5cf6);
  var DEEP = new THREE.Color(0x150a28);

  /* ambient glow */
  var glowGeo = new THREE.RingGeometry(2.4, 3.2, 64);
  var glowMat = new THREE.MeshBasicMaterial({ color: VIOLET, transparent: true, opacity: 0.08, side: THREE.DoubleSide });
  var glow = new THREE.Mesh(glowGeo, glowMat);
  glow.rotation.x = -Math.PI / 2;
  glow.position.y = -0.02;
  scene.add(glow);

  /* outer ring */
  var outerGeo = new THREE.TorusGeometry(2.2, 0.04, 16, 80);
  var outerMat = new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.6 });
  var outerRing = new THREE.Mesh(outerGeo, outerMat);
  outerRing.rotation.x = -Math.PI / 2;
  scene.add(outerRing);

  /* inner ring */
  var innerGeo = new THREE.TorusGeometry(1.6, 0.025, 16, 64);
  var innerMat = new THREE.MeshBasicMaterial({ color: MAGENTA, transparent: true, opacity: 0.4 });
  var innerRing = new THREE.Mesh(innerGeo, innerMat);
  innerRing.rotation.x = -Math.PI / 2;
  scene.add(innerRing);

  /* vortex disc - procedural texture */
  var texSize = 1024;
  var texCanvas = document.createElement('canvas');
  texCanvas.width = texSize;
  texCanvas.height = texSize;
  var ctx = texCanvas.getContext('2d');

  var cx = texSize / 2;
  var cy = texSize / 2;

  /* base gradient - deep void center, nebula edges */
  var grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, cx);
  grad.addColorStop(0, '#050208');
  grad.addColorStop(0.3, '#0a0418');
  grad.addColorStop(0.6, '#150a28');
  grad.addColorStop(0.85, '#1a0a2e');
  grad.addColorStop(1, '#0a0418');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, texSize, texSize);

  /* spiral grooves */
  for (var ring = 0; ring < 30; ring++) {
    var radius = 40 + ring * 15;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = ring % 3 === 0
      ? 'rgba(0, 229, 255, 0.12)'
      : ring % 3 === 1
        ? 'rgba(255, 42, 170, 0.08)'
        : 'rgba(139, 92, 246, 0.06)';
    ctx.lineWidth = ring % 2 === 0 ? 1.5 : 0.8;
    ctx.stroke();
  }

  /* center eye */
  var eyeGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 60);
  eyeGrad.addColorStop(0, 'rgba(0, 229, 255, 0.5)');
  eyeGrad.addColorStop(0.4, 'rgba(139, 92, 246, 0.3)');
  eyeGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = eyeGrad;
  ctx.fillRect(cx - 60, cy - 60, 120, 120);

  /* center dot */
  ctx.beginPath();
  ctx.arc(cx, cy, 8, 0, Math.PI * 2);
  ctx.fillStyle = '#00e5ff';
  ctx.fill();

  var texture = new THREE.CanvasTexture(texCanvas);
  texture.needsUpdate = true;

  var discGeo = new THREE.CircleGeometry(2.15, 80);
  var discMat = new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 0.95, side: THREE.DoubleSide });
  var disc = new THREE.Mesh(discGeo, discMat);
  disc.rotation.x = -Math.PI / 2;
  scene.add(disc);

  /* energy particles orbiting */
  var particleCount = 60;
  var particleGeo = new THREE.BufferGeometry();
  var positions = new Float32Array(particleCount * 3);
  var pColors = new Float32Array(particleCount * 3);
  var particleSpeeds = [];
  var particleRadii = [];

  for (var i = 0; i < particleCount; i++) {
    var angle = Math.random() * Math.PI * 2;
    var r = 0.5 + Math.random() * 1.8;
    positions[i * 3] = Math.cos(angle) * r;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 0.6;
    positions[i * 3 + 2] = Math.sin(angle) * r;
    particleSpeeds.push(0.3 + Math.random() * 0.8);
    particleRadii.push(r);

    var col = Math.random() > 0.5 ? CYAN : (Math.random() > 0.5 ? MAGENTA : VIOLET);
    pColors[i * 3] = col.r;
    pColors[i * 3 + 1] = col.g;
    pColors[i * 3 + 2] = col.b;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

  var particleMat = new THREE.PointsMaterial({
    size: 0.04,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  var particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  /* pulse rings */
  var pulseRings = [];
  for (var p = 0; p < 3; p++) {
    var pr = 0.8 + p * 0.6;
    var pGeo = new THREE.TorusGeometry(pr, 0.01, 8, 64);
    var pMat = new THREE.MeshBasicMaterial({
      color: p === 0 ? CYAN : (p === 1 ? MAGENTA : VIOLET),
      transparent: true,
      opacity: 0.2
    });
    var pMesh = new THREE.Mesh(pGeo, pMat);
    pMesh.rotation.x = -Math.PI / 2;
    scene.add(pMesh);
    pulseRings.push({ mesh: pMesh, baseRadius: pr, speed: 0.5 + p * 0.3 });
  }

  /* interaction state */
  var mouse = { x: 0.5, y: 0.5 };
  var isAudioPlaying = false;
  var rotationSpeed = 0.15;

  container.addEventListener('pointermove', function (e) {
    var rect = container.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) / rect.width;
    mouse.y = (e.clientY - rect.top) / rect.height;
  });

  window.addEventListener('ds:audio-playing', function () { isAudioPlaying = true; });
  window.addEventListener('ds:audio-stopped', function () { isAudioPlaying = false; });
  window.addEventListener('wk:audio-playing', function () { isAudioPlaying = true; });
  window.addEventListener('wk:audio-stopped', function () { isAudioPlaying = false; });

  /* animation loop */
  var clock = new THREE.Clock();
  var isVisible = true;

  function animate() {
    if (!isVisible) { requestAnimationFrame(animate); return; }
    var t = clock.getElapsedTime();
    var speed = isAudioPlaying ? 0.4 : rotationSpeed;

    if (!reducedMotion) {
      disc.rotation.z = t * speed;
      outerRing.rotation.z = -t * speed * 0.5;
      innerRing.rotation.z = t * speed * 0.7;
    }

    /* particles orbit */
    var posArr = particleGeo.attributes.position.array;
    for (var i = 0; i < particleCount; i++) {
      var idx = i * 3;
      var x = posArr[idx];
      var z = posArr[idx + 2];
      var angle = Math.atan2(z, x) + particleSpeeds[i] * 0.01 * (isAudioPlaying ? 2 : 1);
      posArr[idx] = Math.cos(angle) * particleRadii[i];
      posArr[idx + 2] = Math.sin(angle) * particleRadii[i];
      posArr[idx + 1] = Math.sin(t * particleSpeeds[i] + i) * 0.15;
    }
    particleGeo.attributes.position.needsUpdate = true;

    /* pulse rings */
    pulseRings.forEach(function (pr) {
      var scale = 1 + Math.sin(t * pr.speed) * 0.08 * (isAudioPlaying ? 2 : 1);
      pr.mesh.scale.set(scale, scale, 1);
      pr.mesh.material.opacity = 0.15 + Math.sin(t * pr.speed) * 0.1;
    });

    /* glow response to mouse */
    glow.material.opacity = 0.06 + (1 - Math.abs(mouse.x - 0.5) * 2) * 0.06;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  document.addEventListener('visibilitychange', function () {
    isVisible = !document.hidden;
    if (isVisible) clock.getDelta();
  });

  animate();

  window.DSPortal = {
    setSoundActive: function (on) { isAudioPlaying = on; }
  };
  window.WKPortal = window.DSPortal;
})();
