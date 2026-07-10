/**
 * interactions.js — Premium interaction engine
 * Loaded AFTER Lenis + GSAP/ScrollTrigger CDN scripts.
 * Complements main.js without duplicating any of its features.
 */
(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouchDevice = false;

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- helpers ---------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* ==========================================================
     1. LENIS SMOOTH SCROLL
     ========================================================== */
  var lenis = new Lenis({
    duration: 1.2,
    easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add(function (time) {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  window.__lenis = lenis;

  /* ==========================================================
     2. CUSTOM CURSOR
     ========================================================== */
  var cursorDot = document.createElement('div');
  var cursorRing = document.createElement('div');

  cursorDot.className = 'cursor-dot';
  cursorRing.className = 'cursor-ring';

  // Inline styles
  var dotStyle = cursorDot.style;
  dotStyle.position = 'fixed';
  dotStyle.top = '0';
  dotStyle.left = '0';
  dotStyle.width = '8px';
  dotStyle.height = '8px';
  dotStyle.borderRadius = '50%';
  dotStyle.background = '#00e5ff';
  dotStyle.pointerEvents = 'none';
  dotStyle.zIndex = '99999';
  dotStyle.mixBlendMode = 'difference';
  dotStyle.transform = 'translate(-50%, -50%)';
  dotStyle.willChange = 'transform';

  var ringStyle = cursorRing.style;
  ringStyle.position = 'fixed';
  ringStyle.top = '0';
  ringStyle.left = '0';
  ringStyle.width = '40px';
  ringStyle.height = '40px';
  ringStyle.borderRadius = '50%';
  ringStyle.border = '1px solid rgba(255,255,255,0.6)';
  ringStyle.pointerEvents = 'none';
  ringStyle.zIndex = '99998';
  ringStyle.transform = 'translate(-50%, -50%)';
  ringStyle.willChange = 'transform';

  var canHover = window.matchMedia('(hover: hover)').matches;

  if (canHover) {
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorRing);
    document.body.style.cursor = 'none';

    var cursorX = -100, cursorY = -100;

    document.addEventListener('mousemove', function (e) {
      cursorX = e.clientX;
      cursorY = e.clientY;
      gsap.set(cursorDot, { x: cursorX, y: cursorY });
      gsap.to(cursorRing, { x: cursorX, y: cursorY, duration: 0.15, overwrite: true });
    });

    var interactiveSelectors = 'a, button, .tilt, .glass-card, [data-magnetic]';

    document.addEventListener('mouseover', function (e) {
      if (e.target.closest(interactiveSelectors)) {
        gsap.to(cursorRing, { scale: 1.8, duration: 0.3 });
        cursorRing.classList.add('cursor-active');
      }
    });

    document.addEventListener('mouseout', function (e) {
      if (e.target.closest(interactiveSelectors)) {
        gsap.to(cursorRing, { scale: 1, duration: 0.3 });
        cursorRing.classList.remove('cursor-active');
      }
    });

    document.addEventListener('mousedown', function () {
      gsap.to(cursorDot, { scale: 0.8, duration: 0.1 });
    });

    document.addEventListener('mouseup', function () {
      gsap.to(cursorDot, { scale: 1, duration: 0.1 });
    });
  }

  window.addEventListener('touchstart', function () {
    isTouchDevice = true;
    cursorDot.style.display = 'none';
    cursorRing.style.display = 'none';
    document.body.style.cursor = '';
  }, { once: true });

  /* ==========================================================
     3. MAGNETIC BUTTONS
     ========================================================== */
  if (!reducedMotion) {
    $$('[data-magnetic]').forEach(function (el) {
      var strength = 0.3;
      var radius = 100;

      el.addEventListener('pointermove', function (e) {
        var rect = el.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var dx = e.clientX - cx;
        var dy = e.clientY - cy;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < radius) {
          gsap.to(el, {
            x: dx * strength,
            y: dy * strength,
            duration: 0.3,
            ease: 'power2.out',
            overwrite: true
          });
        }
      });

      el.addEventListener('pointerleave', function () {
        gsap.to(el, {
          x: 0,
          y: 0,
          ease: 'elastic.out(1, 0.3)',
          duration: 0.8
        });
      });
    });
  }

  /* ==========================================================
     4. SPLIT-TEXT HEADLINE REVEALS
     ========================================================== */
  $$('[data-split-text]').forEach(function (el) {
    var mode = el.getAttribute('data-split-text') || 'chars';
    var text = el.textContent;
    var html = '';

    if (mode === 'words') {
      var words = text.split(/(\s+)/);
      words.forEach(function (w) {
        if (/^\s+$/.test(w)) {
          html += w;
        } else {
          html += '<span class="word" style="display:inline-block;overflow:hidden;vertical-align:top"><span class="word-inner" style="display:inline-block;will-change:transform">' + w + '</span></span>';
        }
      });
    } else {
      var wordChunks = text.split(/(\s+)/);
      wordChunks.forEach(function (chunk) {
        if (/^\s+$/.test(chunk)) {
          html += chunk;
        } else {
          html += '<span class="word" style="display:inline-block;overflow:hidden;vertical-align:top">';
          for (var i = 0; i < chunk.length; i++) {
            html += '<span class="char" style="display:inline-block;will-change:transform">' + chunk[i] + '</span>';
          }
          html += '</span>';
        }
      });
    }

    el.innerHTML = html;

    if (reducedMotion) return;

    if (mode === 'words') {
      var wordInners = $$('.word-inner', el);
      gsap.set(wordInners, { y: '110%', opacity: 0 });
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: function () {
          gsap.to(wordInners, {
            y: '0%',
            opacity: 1,
            stagger: 0.08,
            duration: 0.7,
            ease: 'power3.out'
          });
        }
      });
    } else {
      var chars = $$('.char', el);
      gsap.set(chars, { y: '110%', opacity: 0 });
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: function () {
          gsap.to(chars, {
            y: '0%',
            opacity: 1,
            stagger: 0.02,
            duration: 0.6,
            ease: 'power3.out'
          });
        }
      });
    }
  });

  /* ==========================================================
     5. PARALLAX ELEMENTS
     ========================================================== */
  if (!reducedMotion) {
    $$('[data-parallax]').forEach(function (el) {
      var speed = parseFloat(el.getAttribute('data-parallax')) || 0.3;
      gsap.to(el, {
        y: function () { return speed * 200; },
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    });
  }

  /* ==========================================================
     6. IMAGE REVEAL ON SCROLL
     ========================================================== */
  if (!reducedMotion) {
    $$('[data-reveal-image]').forEach(function (img) {
      // Wrap in overflow-hidden container if not already wrapped
      var parent = img.parentNode;
      if (!parent.classList.contains('reveal-image-wrap')) {
        var wrapper = document.createElement('div');
        wrapper.className = 'reveal-image-wrap';
        wrapper.style.overflow = 'hidden';
        wrapper.style.position = 'relative';
        parent.insertBefore(wrapper, img);
        wrapper.appendChild(img);
        parent = wrapper;
      }

      gsap.set(img, {
        clipPath: 'inset(0 0 100% 0)',
        scale: 1.2,
        willChange: 'clip-path, transform'
      });

      ScrollTrigger.create({
        trigger: parent,
        start: 'top 80%',
        once: true,
        onEnter: function () {
          gsap.to(img, {
            clipPath: 'inset(0 0 0% 0)',
            scale: 1,
            duration: 1.2,
            ease: 'power3.out'
          });
        }
      });
    });
  }

  /* ==========================================================
     7. HORIZONTAL SCROLL SECTION
     ========================================================== */
  if (!reducedMotion) {
    var hSection = $('[data-horizontal-scroll]');
    if (hSection) {
      var track = $('.horizontal-track', hSection);
      if (track) {
        var getScrollWidth = function () {
          return track.scrollWidth - hSection.offsetWidth;
        };

        gsap.to(track, {
          x: function () { return -getScrollWidth(); },
          ease: 'none',
          scrollTrigger: {
            trigger: hSection,
            pin: true,
            scrub: 1,
            end: function () { return '+=' + getScrollWidth(); },
            invalidateOnRefresh: true
          }
        });
      }
    }
  }

  /* ==========================================================
     8. SCROLL-VELOCITY MARQUEE
     ========================================================== */
  if (!reducedMotion) {
    $$('[data-marquee]').forEach(function (el) {
      var inner = el.firstElementChild;
      if (!inner) return;

      // Duplicate content to fill width
      var clone = inner.cloneNode(true);
      el.appendChild(clone);

      var speed = parseFloat(el.getAttribute('data-marquee')) || 40;
      var direction = el.hasAttribute('data-marquee-reverse') ? 1 : -1;

      // Calculate the width of one set of content
      var contentWidth = inner.offsetWidth;

      el.style.display = 'flex';
      el.style.overflow = 'hidden';
      el.style.whiteSpace = 'nowrap';

      var tween = gsap.to([inner, clone], {
        x: direction * contentWidth * -1,
        duration: contentWidth / speed,
        ease: 'none',
        repeat: -1,
        modifiers: {
          x: function (x) {
            return (parseFloat(x) % contentWidth) + 'px';
          }
        }
      });

      // Modulate speed with scroll velocity
      ScrollTrigger.create({
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: function (self) {
          var velocity = Math.abs(self.getVelocity());
          var speedFactor = 1 + Math.min(velocity / 1000, 3);
          tween.timeScale(speedFactor);
        }
      });

      // Reset speed when not scrolling
      lenis.on('scroll', function () {
        gsap.to(tween, {
          timeScale: 1,
          duration: 0.8,
          overwrite: true,
          ease: 'power2.out'
        });
      });
    });
  }

  /* ==========================================================
     9. STAGGERED SECTION REVEALS
     ========================================================== */
  if (!reducedMotion) {
    $$('[data-reveal-section]').forEach(function (section) {
      var children = $$('.reveal-child', section);
      if (!children.length) return;

      gsap.set(children, { y: 60, opacity: 0, willChange: 'transform, opacity' });

      ScrollTrigger.create({
        trigger: section,
        start: 'top 80%',
        once: true,
        onEnter: function () {
          gsap.to(children, {
            y: 0,
            opacity: 1,
            stagger: 0.12,
            duration: 0.8,
            ease: 'power3.out',
            clearProps: 'willChange'
          });
        }
      });
    });
  }

  /* ==========================================================
     10. TEXT SCRAMBLE EFFECT
     ========================================================== */
  var SCRAMBLE_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  function scrambleText(el) {
    var finalText = el.getAttribute('data-scramble') || el.textContent;
    var length = finalText.length;
    var duration = 1500; // ms
    var startTime = null;

    el.setAttribute('data-scramble-original', finalText);

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);

      var result = '';
      for (var i = 0; i < length; i++) {
        if (finalText[i] === ' ') {
          result += ' ';
        } else if (progress >= (i + 1) / length) {
          result += finalText[i];
        } else {
          result += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
      }

      el.textContent = result;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = finalText;
      }
    }

    requestAnimationFrame(step);
  }

  $$('[data-scramble]').forEach(function (el) {
    if (reducedMotion) return;

    var originalText = el.textContent;
    if (!el.getAttribute('data-scramble')) {
      el.setAttribute('data-scramble', originalText);
    }

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: function () {
        scrambleText(el);
      }
    });
  });

  /* ==========================================================
     REFRESH SCROLLTRIGGER AFTER LOAD
     ========================================================== */
  window.addEventListener('load', function () {
    ScrollTrigger.refresh();
  });

})();
