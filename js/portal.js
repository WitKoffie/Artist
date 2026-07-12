/* ==========================================================================
   WitKoffie — 3D Sound Portal (Three.js)
   Interactive coffee cup with ripple effect — move the mouse over the
   coffee surface and the concentric grooves distort like a spoon stirring.
   ========================================================================== */

(function () {
  'use strict';

  var COLORS = {
    amber: 0xd69a3a,
    gold: 0xb9822b,
    cream: 0xf5e8d0,
    warmWhite: 0xfff8ea,
    saucer: 0x0b0907
  };

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var container = document.getElementById('sound-portal');
  if (!container) return;
  var stage = container.closest('.portal-stage') || container;

  function showFallback() { stage.classList.add('no-webgl'); }

  if (typeof THREE === 'undefined') { showFallback(); return; }

  /* ---- renderer / scene -------------------------------------------------- */
  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch (e) {
    showFallback();
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  container.appendChild(renderer.domElement);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
  camera.position.set(0, 0, 10.3);

  var portal = new THREE.Group();
  scene.add(portal);

  /* ---- coffee surface texture from logo image ----------------------------- */
  var coffeeTextureReady = false;
  var coffeeTexture = null;

  function loadCoffeeTexture(callback) {
    var img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function () {
      var tex = new THREE.Texture(img);
      if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;
      tex.needsUpdate = true;
      coffeeTexture = tex;
      coffeeTextureReady = true;
      if (callback) callback(tex);
    };
    img.onerror = function () {
      coffeeTexture = makeFallbackTexture();
      coffeeTextureReady = true;
      if (callback) callback(coffeeTexture);
    };
    img.src = './assets/images/witkoffie-mark.jpg';
  }

  function makeFallbackTexture() {
    var S = 1024, cv = document.createElement('canvas');
    cv.width = cv.height = S;
    var ctx = cv.getContext('2d'), c = S / 2;
    var grad = ctx.createRadialGradient(c, c, 0, c, c, c);
    grad.addColorStop(0, '#9c6b42');
    grad.addColorStop(0.45, '#bd8f5e');
    grad.addColorStop(0.85, '#e3cba3');
    grad.addColorStop(1, '#eedec0');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(c, c, c, 0, Math.PI * 2); ctx.fill();
    var tex = new THREE.CanvasTexture(cv);
    tex.anisotropy = 4;
    if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  /* ---- glow texture ------------------------------------------------------- */
  function makeGlowTexture(inner, outer) {
    var S = 256, cv = document.createElement('canvas');
    cv.width = cv.height = S;
    var ctx = cv.getContext('2d');
    var g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
    g.addColorStop(0, inner); g.addColorStop(1, outer);
    ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
    var tex = new THREE.CanvasTexture(cv);
    if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  /* ---- high-detail disc geometry ------------------------------------------ */
  function makeDiscGeometry(radius, rings, segments) {
    var verts = [], uvs = [], idx = [];
    verts.push(0, 0, 0); uvs.push(0.5, 0.5);
    for (var r = 1; r <= rings; r++) {
      var rad = (r / rings) * radius, uvR = r / rings * 0.5;
      for (var s = 0; s < segments; s++) {
        var theta = (s / segments) * Math.PI * 2;
        var ct = Math.cos(theta), st = Math.sin(theta);
        verts.push(ct * rad, st * rad, 0);
        uvs.push(0.5 + ct * uvR, 0.5 + st * uvR);
      }
    }
    for (var s = 0; s < segments; s++) {
      idx.push(0, 1 + s, 1 + (s + 1) % segments);
    }
    for (var r = 1; r < rings; r++) {
      var off0 = 1 + (r - 1) * segments, off1 = 1 + r * segments;
      for (var s = 0; s < segments; s++) {
        var s1 = (s + 1) % segments;
        idx.push(off0 + s, off1 + s, off1 + s1);
        idx.push(off0 + s, off1 + s1, off0 + s1);
      }
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    geo.computeBoundingSphere();
    return geo;
  }

  /* ---- build the portal --------------------------------------------------- */
  var CUP_R = 1.7;
  var RIM_THICK = 0.14;
  var OUTER_RING_R = 2.45;

  // Ambient glow behind everything
  var halo = new THREE.Mesh(
    new THREE.PlaneGeometry(5.6, 5.6),
    new THREE.MeshBasicMaterial({
      map: makeGlowTexture('rgba(214,154,58,0.25)', 'rgba(214,154,58,0)'),
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
    })
  );
  halo.position.z = -0.6;
  portal.add(halo);

  // Golden outer ring (the circle around the cup)
  var outerRing = new THREE.Mesh(
    new THREE.TorusGeometry(OUTER_RING_R, 0.022, 12, 160),
    new THREE.MeshBasicMaterial({ color: COLORS.amber })
  );
  portal.add(outerRing);

  var outerRingGlow = new THREE.Mesh(
    new THREE.RingGeometry(OUTER_RING_R - 0.17, OUTER_RING_R + 0.17, 128),
    new THREE.MeshBasicMaterial({
      color: COLORS.amber, transparent: true, opacity: 0.16,
      depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide
    })
  );
  outerRingGlow.position.z = -0.01;
  portal.add(outerRingGlow);

  // Dark fill between outer ring and cup (the black gap)
  var darkFill = new THREE.Mesh(
    new THREE.RingGeometry(CUP_R + RIM_THICK + 0.02, OUTER_RING_R - 0.03, 128),
    new THREE.MeshBasicMaterial({
      color: 0x0a0806, side: THREE.DoubleSide
    })
  );
  darkFill.position.z = 0.01;
  portal.add(darkFill);

  // Cup rim (white/cream ring around coffee)
  var cupRimMat = new THREE.MeshBasicMaterial({ color: 0xf0e8da });
  var cupRim = new THREE.Mesh(
    new THREE.TorusGeometry(CUP_R + RIM_THICK * 0.5, RIM_THICK * 0.5, 16, 128),
    cupRimMat
  );
  cupRim.position.z = 0.18;
  portal.add(cupRim);

  // Inner rim highlight
  var rimHighlight = new THREE.Mesh(
    new THREE.TorusGeometry(CUP_R + RIM_THICK * 0.5, RIM_THICK * 0.52, 16, 128),
    new THREE.MeshBasicMaterial({
      color: 0xffffff, transparent: true, opacity: 0.12,
      depthWrite: false, blending: THREE.AdditiveBlending
    })
  );
  rimHighlight.position.z = 0.22;
  portal.add(rimHighlight);

  // Handle ("ear") — rectangular tab matching the hero-bg cup
  var hW = 0.45, hH = 0.18, hR = 0.045;
  var hX = CUP_R + RIM_THICK * 0.35;
  var handleShape = new THREE.Shape();
  handleShape.moveTo(0, hH);
  handleShape.lineTo(hW - hR, hH);
  handleShape.quadraticCurveTo(hW, hH, hW, hH - hR);
  handleShape.lineTo(hW, -hH + hR);
  handleShape.quadraticCurveTo(hW, -hH, hW - hR, -hH);
  handleShape.lineTo(0, -hH);
  var handleGeo = new THREE.ExtrudeGeometry(handleShape, {
    depth: 0.08, bevelEnabled: true, bevelThickness: 0.02,
    bevelSize: 0.02, bevelSegments: 3
  });
  var handle = new THREE.Mesh(handleGeo, cupRimMat);
  handle.position.set(hX, 0, 0.12);
  handle.rotation.y = 0;
  portal.add(handle);

  // Coffee surface
  var COFFEE_R = CUP_R;
  var DISC_RINGS = 40;
  var DISC_SEGS = 80;
  var coneGeo = makeDiscGeometry(COFFEE_R, DISC_RINGS, DISC_SEGS);

  var pos = coneGeo.attributes.position;
  var vertCount = pos.count;
  var baseZ = new Float32Array(vertCount);
  for (var i = 0; i < vertCount; i++) {
    var x = pos.getX(i), y = pos.getY(i);
    var r = Math.sqrt(x * x + y * y) / COFFEE_R;
    var z = -0.32 * (1 - r) * (1 - r);
    pos.setZ(i, z);
    baseZ[i] = z;
  }
  coneGeo.computeVertexNormals();
  coneGeo.computeBoundingSphere();

  var coffeeMat = new THREE.MeshBasicMaterial({ color: 0x2a1810 });
  var coffee = new THREE.Mesh(coneGeo, coffeeMat);
  coffee.position.z = 0.16;
  portal.add(coffee);

  loadCoffeeTexture(function (tex) {
    coffeeMat.map = tex;
    coffeeMat.color.set(0xffffff);
    coffeeMat.needsUpdate = true;
  });

  // Bass pulse rings
  var PULSES = 3, pulses = [];
  for (var i = 0; i < PULSES; i++) {
    var m = new THREE.Mesh(
      new THREE.RingGeometry(0.8, 0.84, 96),
      new THREE.MeshBasicMaterial({
        color: COLORS.amber, transparent: true, opacity: 0,
        depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide
      })
    );
    m.position.z = 0.05;
    m.userData.t = i / PULSES;
    portal.add(m);
    pulses.push(m);
  }

  // Steam
  var steamCount = 26;
  var steamGeo = new THREE.BufferGeometry();
  var steamPos = new Float32Array(steamCount * 3);
  var steamSeed = new Float32Array(steamCount);
  for (var i = 0; i < steamCount; i++) {
    steamSeed[i] = Math.random();
    steamPos[i * 3] = (Math.random() - 0.5) * 0.8;
    steamPos[i * 3 + 1] = Math.random() * 2.2;
    steamPos[i * 3 + 2] = 0.4;
  }
  steamGeo.setAttribute('position', new THREE.BufferAttribute(steamPos, 3));
  var steam = new THREE.Points(
    steamGeo,
    new THREE.PointsMaterial({
      color: COLORS.cream, size: 0.14,
      map: makeGlowTexture('rgba(255,248,234,0.8)', 'rgba(255,248,234,0)'),
      transparent: true, opacity: 0.28, depthWrite: false, blending: THREE.AdditiveBlending
    })
  );
  portal.add(steam);

  var cursorWorldX = 0, cursorWorldY = 0;

  /* ---- ripple system (direct coordinate mapping — no raycasting) ---------- */
  var MAX_RIPPLES = 16;
  var ripples = [];
  var lastRipX = 999, lastRipY = 999;
  var mouseOverCup = false;
  var mouseLocalX = 0, mouseLocalY = 0;
  var containerMX = 9, containerMY = 9;

  container.addEventListener('pointermove', function (e) {
    var rect = container.getBoundingClientRect();
    containerMX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    containerMY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  }, { passive: true });

  container.addEventListener('pointerleave', function () {
    containerMX = 9; containerMY = 9;
    mouseOverCup = false;
  }, { passive: true });

  /* ---- state -------------------------------------------------------------- */
  var soundActive = document.body.classList.contains('sound-on');
  var audioPlaying = false;
  var targetRX = 0, targetRY = 0;
  var scrollDepth = 0;
  var running = true;

  window.addEventListener('pointermove', function (e) {
    if (reducedMotion) return;
    var nx = (e.clientX / window.innerWidth) * 2 - 1;
    var ny = (e.clientY / window.innerHeight) * 2 - 1;
    targetRY = nx * 0.18;
    targetRX = ny * 0.15;
  }, { passive: true });

  window.addEventListener('scroll', function () {
    if (reducedMotion) return;
    scrollDepth = Math.min(window.scrollY / window.innerHeight, 1);
  }, { passive: true });

  document.addEventListener('visibilitychange', function () {
    running = !document.hidden;
    if (running && !reducedMotion) requestAnimationFrame(tick);
  });

  window.addEventListener('wk:audio-playing', function () { audioPlaying = true; });
  window.addEventListener('wk:audio-stopped', function () { audioPlaying = false; });

  /* ---- sizing ------------------------------------------------------------- */
  function resize() {
    var w = container.clientWidth || 300;
    var h = container.clientHeight || w;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (reducedMotion) renderer.render(scene, camera);
  }
  window.addEventListener('resize', resize);
  resize();

  /* ---- animation ---------------------------------------------------------- */
  var t = 0;
  function tick() {
    if (!running) return;
    t += 0.016;

    coffee.rotation.z -= 0.001 + (audioPlaying ? 0.003 : 0);

    var energy = soundActive ? (audioPlaying ? 1 : 0.55) : 0.25;
    var breathe = 1 + Math.sin(t * 1.4) * 0.012 * (1 + energy);
    portal.scale.setScalar(breathe);

    portal.rotation.x += (targetRX - portal.rotation.x) * 0.05;
    portal.rotation.y += (targetRY - portal.rotation.y) * 0.05;
    camera.position.z = 9.3 + scrollDepth * 1.6;
    portal.position.y = scrollDepth * 0.7;

    var glowBase = soundActive ? 0.3 : 0.14;
    outerRingGlow.material.opacity = glowBase + Math.sin(t * 2.1) * 0.05 * (1 + energy);
    halo.material.opacity = 0.55 + energy * 0.35;

    var pulseSpeed = audioPlaying ? 0.55 : (soundActive ? 0.3 : 0.16);
    pulses.forEach(function (p) {
      p.userData.t += 0.016 * pulseSpeed;
      if (p.userData.t > 1) p.userData.t -= 1;
      var f = p.userData.t;
      p.scale.setScalar(1.55 + f * 1.05);
      p.material.opacity = (1 - f) * 0.32 * (0.4 + energy);
    });

    var sp = steam.geometry.attributes.position;
    for (var i = 0; i < steamCount; i++) {
      var sx = sp.getX(i), sy = sp.getY(i);
      sy += 0.006 + steamSeed[i] * 0.004;
      if (sy > 2.4) { sy = 0.2; sx = (Math.random() - 0.5) * 0.8; }
      var baseX = Math.sin(t * 0.8 + steamSeed[i] * 6.28 + sy) * 0.28 * (sy / 2.4 + 0.2);
      if (mouseOverCup) {
        var attractX = cursorWorldX - sx;
        var attractY = cursorWorldY - sy;
        var aDist = Math.sqrt(attractX * attractX + attractY * attractY);
        var pull = Math.max(0, 1 - aDist / 2.5) * 0.08;
        sx += attractX * pull;
        sy += attractY * pull * 0.5;
      } else {
        sx += (baseX - sx) * 0.05;
      }
      sp.setX(i, sx);
      sp.setY(i, sy);
    }
    sp.needsUpdate = true;

    /* ---- ripple: direct coordinate mapping ---- */
    if (!reducedMotion && Math.abs(containerMX) <= 1.1 && Math.abs(containerMY) <= 1.1) {
      var camZ = camera.position.z;
      var fovRad = camera.fov * Math.PI / 180;
      var halfH = Math.tan(fovRad * 0.5) * camZ;
      var halfW = halfH * camera.aspect;

      var worldX = containerMX * halfW;
      var worldY = containerMY * halfH;

      worldY -= portal.position.y;
      var sc = portal.scale.x;
      if (sc > 0) { worldX /= sc; worldY /= sc; }

      var dist = Math.sqrt(worldX * worldX + worldY * worldY);
      mouseOverCup = dist < COFFEE_R * 0.92;

      if (mouseOverCup) {
        var angle = -coffee.rotation.z;
        var cosA = Math.cos(angle), sinA = Math.sin(angle);
        mouseLocalX = worldX * cosA - worldY * sinA;
        mouseLocalY = worldX * sinA + worldY * cosA;

        cursorWorldX = worldX;
        cursorWorldY = worldY;

        var dx = mouseLocalX - lastRipX;
        var dy = mouseLocalY - lastRipY;
        if (dx * dx + dy * dy > 0.003) {
          ripples.push({ x: mouseLocalX, y: mouseLocalY, birth: t });
          if (ripples.length > MAX_RIPPLES) ripples.shift();
          lastRipX = mouseLocalX;
          lastRipY = mouseLocalY;
        }
      }
    } else {
      mouseOverCup = false;
    }

    while (ripples.length && t - ripples[0].birth > 4.5) ripples.shift();

    var cpos = coffee.geometry.attributes.position;
    var hasRipples = ripples.length > 0;
    for (var i = 0; i < vertCount; i++) {
      var z = baseZ[i];
      if (hasRipples) {
        var vx = cpos.getX(i), vy = cpos.getY(i);
        for (var j = 0; j < ripples.length; j++) {
          var rip = ripples[j];
          var rdx = vx - rip.x, rdy = vy - rip.y;
          var d = Math.sqrt(rdx * rdx + rdy * rdy);
          var age = t - rip.birth;
          var waveFront = age * 0.55;
          var distFromFront = Math.abs(d - waveFront);
          var ringFalloff = Math.exp(-distFromFront * distFromFront * 3);
          var timeFade = Math.exp(-age * 0.6);
          var wave = Math.sin(d * 8 - age * 4) * 0.14;
          z += wave * ringFalloff * timeFade;
        }
      }
      cpos.setZ(i, z);
    }
    if (hasRipples) {
      cpos.needsUpdate = true;
      coffee.geometry.computeVertexNormals();
    }

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }

  if (reducedMotion) {
    outerRingGlow.material.opacity = 0.22;
    renderer.render(scene, camera);
  } else {
    requestAnimationFrame(tick);
  }

  /* ---- cup hover audio ----------------------------------------------------- */
  var hoverAudio = new Audio('./assets/audio/promo.mp3');
  hoverAudio.loop = true;
  hoverAudio.volume = 0;
  var hoverPlaying = false;
  var hoverVolume = 0;
  var hoverTarget = 0;
  var FADE_SPEED = 0.04;

  function updateHoverAudio() {
    hoverTarget = mouseOverCup ? 1 : 0;
    hoverVolume += (hoverTarget - hoverVolume) * FADE_SPEED;
    if (hoverVolume < 0.005) hoverVolume = 0;
    if (hoverVolume > 0.995) hoverVolume = 1;
    hoverAudio.volume = hoverVolume * 0.7;

    if (mouseOverCup && !hoverPlaying) {
      hoverAudio.play().catch(function () {});
      hoverPlaying = true;
    } else if (!mouseOverCup && hoverPlaying && hoverVolume === 0) {
      hoverAudio.pause();
      hoverPlaying = false;
    }
    requestAnimationFrame(updateHoverAudio);
  }
  requestAnimationFrame(updateHoverAudio);

  /* ---- public API ---------------------------------------------------------- */
  window.WKPortal = {
    setSoundActive: function (on) {
      soundActive = !!on;
      if (reducedMotion) {
        outerRingGlow.material.opacity = on ? 0.4 : 0.22;
        renderer.render(scene, camera);
      }
    }
  };
})();
