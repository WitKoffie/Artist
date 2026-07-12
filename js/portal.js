/* ==========================================================================
   WitKoffie — 3D Sound Portal (Three.js)
   Displays the logo image as an interactive disc with ripple, rotation,
   mouse tilt, bass pulses, steam and hover audio.
   ========================================================================== */

(function () {
  'use strict';

  var COLORS = {
    amber: 0xd69a3a,
    cream: 0xf5e8d0,
    warmWhite: 0xfff8ea
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

  /* ---- texture loading --------------------------------------------------- */
  function loadLogoTexture(callback) {
    var img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function () {
      var tex = new THREE.Texture(img);
      if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;
      tex.needsUpdate = true;
      callback(tex);
    };
    img.onerror = function () {
      callback(makeFallbackTexture());
    };
    img.src = './assets/images/witkoffie-mark.jpg';
  }

  function makeFallbackTexture() {
    var S = 512, cv = document.createElement('canvas');
    cv.width = cv.height = S;
    var ctx = cv.getContext('2d'), c = S / 2;
    var grad = ctx.createRadialGradient(c, c, 0, c, c, c);
    grad.addColorStop(0, '#9c6b42');
    grad.addColorStop(0.5, '#bd8f5e');
    grad.addColorStop(1, '#eedec0');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(c, c, c, 0, Math.PI * 2); ctx.fill();
    var tex = new THREE.CanvasTexture(cv);
    if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

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

  /* ---- disc geometry with subdivisions for ripple ------------------------ */
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
  var DISC_R = 2.6;
  var DISC_RINGS = 50;
  var DISC_SEGS = 100;

  // Subtle ambient glow behind the disc
  var halo = new THREE.Mesh(
    new THREE.PlaneGeometry(7, 7),
    new THREE.MeshBasicMaterial({
      map: makeGlowTexture('rgba(214,154,58,0.18)', 'rgba(214,154,58,0)'),
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
    })
  );
  halo.position.z = -0.4;
  portal.add(halo);

  // The logo disc — entire logo image mapped onto a flat subdivided circle
  var discGeo = makeDiscGeometry(DISC_R, DISC_RINGS, DISC_SEGS);

  var pos = discGeo.attributes.position;
  var vertCount = pos.count;
  var baseZ = new Float32Array(vertCount);
  for (var i = 0; i < vertCount; i++) {
    baseZ[i] = 0;
  }

  var discMat = new THREE.MeshBasicMaterial({ color: 0x1a1008, transparent: true });
  var disc = new THREE.Mesh(discGeo, discMat);
  portal.add(disc);

  loadLogoTexture(function (tex) {
    discMat.map = tex;
    discMat.color.set(0xffffff);
    discMat.needsUpdate = true;
  });

  // Bass pulse rings
  var PULSES = 3, pulses = [];
  for (var i = 0; i < PULSES; i++) {
    var m = new THREE.Mesh(
      new THREE.RingGeometry(1.2, 1.25, 96),
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

  // Steam particles
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

  /* ---- ripple system ----------------------------------------------------- */
  var MAX_RIPPLES = 16;
  var ripples = [];
  var lastRipX = 999, lastRipY = 999;
  var mouseOverDisc = false;
  var mouseLocalX = 0, mouseLocalY = 0;
  var containerMX = 9, containerMY = 9;

  container.addEventListener('pointermove', function (e) {
    var rect = container.getBoundingClientRect();
    containerMX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    containerMY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  }, { passive: true });

  container.addEventListener('pointerleave', function () {
    containerMX = 9; containerMY = 9;
    mouseOverDisc = false;
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

    // Slow rotation
    disc.rotation.z -= 0.0008 + (audioPlaying ? 0.002 : 0);

    var energy = soundActive ? (audioPlaying ? 1 : 0.55) : 0.25;
    var breathe = 1 + Math.sin(t * 1.4) * 0.012 * (1 + energy);
    portal.scale.setScalar(breathe);

    // Mouse tilt
    portal.rotation.x += (targetRX - portal.rotation.x) * 0.05;
    portal.rotation.y += (targetRY - portal.rotation.y) * 0.05;
    camera.position.z = 9.3 + scrollDepth * 1.6;
    portal.position.y = scrollDepth * 0.7;

    // Halo glow
    halo.material.opacity = 0.45 + energy * 0.35;

    // Bass pulse rings
    var pulseSpeed = audioPlaying ? 0.55 : (soundActive ? 0.3 : 0.16);
    pulses.forEach(function (p) {
      p.userData.t += 0.016 * pulseSpeed;
      if (p.userData.t > 1) p.userData.t -= 1;
      var f = p.userData.t;
      p.scale.setScalar(1.2 + f * 1.3);
      p.material.opacity = (1 - f) * 0.28 * (0.4 + energy);
    });

    // Steam
    var sp = steam.geometry.attributes.position;
    for (var i = 0; i < steamCount; i++) {
      var sx = sp.getX(i), sy = sp.getY(i);
      sy += 0.006 + steamSeed[i] * 0.004;
      if (sy > 2.4) { sy = 0.2; sx = (Math.random() - 0.5) * 0.8; }
      var baseX = Math.sin(t * 0.8 + steamSeed[i] * 6.28 + sy) * 0.28 * (sy / 2.4 + 0.2);
      if (mouseOverDisc) {
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
      mouseOverDisc = dist < DISC_R * 0.88;

      if (mouseOverDisc) {
        var angle = -disc.rotation.z;
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
      mouseOverDisc = false;
    }

    while (ripples.length && t - ripples[0].birth > 4.5) ripples.shift();

    var dpos = disc.geometry.attributes.position;
    var hasRipples = ripples.length > 0;
    for (var i = 0; i < vertCount; i++) {
      var z = baseZ[i];
      if (hasRipples) {
        var vx = dpos.getX(i), vy = dpos.getY(i);
        for (var j = 0; j < ripples.length; j++) {
          var rip = ripples[j];
          var rdx = vx - rip.x, rdy = vy - rip.y;
          var d = Math.sqrt(rdx * rdx + rdy * rdy);
          var age = t - rip.birth;
          var waveFront = age * 0.55;
          var distFromFront = Math.abs(d - waveFront);
          var ringFalloff = Math.exp(-distFromFront * distFromFront * 3);
          var timeFade = Math.exp(-age * 0.6);
          var wave = Math.sin(d * 8 - age * 4) * 0.12;
          z += wave * ringFalloff * timeFade;
        }
      }
      dpos.setZ(i, z);
    }
    if (hasRipples) {
      dpos.needsUpdate = true;
      disc.geometry.computeVertexNormals();
    }

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }

  if (reducedMotion) {
    renderer.render(scene, camera);
  } else {
    requestAnimationFrame(tick);
  }

  /* ---- hover audio -------------------------------------------------------- */
  var hoverAudio = new Audio('./assets/audio/promo.mp3');
  hoverAudio.loop = true;
  hoverAudio.volume = 0;
  var hoverPlaying = false;
  var hoverVolume = 0;
  var hoverTarget = 0;
  var FADE_SPEED = 0.04;

  function updateHoverAudio() {
    hoverTarget = mouseOverDisc ? 1 : 0;
    hoverVolume += (hoverTarget - hoverVolume) * FADE_SPEED;
    if (hoverVolume < 0.005) hoverVolume = 0;
    if (hoverVolume > 0.995) hoverVolume = 1;
    hoverAudio.volume = hoverVolume * 0.7;

    if (mouseOverDisc && !hoverPlaying) {
      hoverAudio.play().catch(function () {});
      hoverPlaying = true;
    } else if (!mouseOverDisc && hoverPlaying && hoverVolume === 0) {
      hoverAudio.pause();
      hoverPlaying = false;
    }
    requestAnimationFrame(updateHoverAudio);
  }
  requestAnimationFrame(updateHoverAudio);

  /* ---- public API --------------------------------------------------------- */
  window.WKPortal = {
    setSoundActive: function (on) {
      soundActive = !!on;
      if (reducedMotion) renderer.render(scene, camera);
    }
  };
})();
