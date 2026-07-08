(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* scroll progress bar */
  var progressBar = $('.scroll-progress');
  function onScrollProgress() {
    if (!progressBar) return;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var pct = h > 0 ? window.scrollY / h : 0;
    progressBar.style.transform = 'scaleX(' + Math.min(pct, 1) + ')';
  }

  /* header glass on scroll */
  var header = $('.site-header');
  function onScrollHeader() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 24);
    onScrollProgress();
  }
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* mobile menu */
  var navToggle = $('.nav-toggle');
  var nav = $('.main-nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    $$('.main-nav a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* reveal on scroll */
  var revealEls = $$('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* 3D card tilt */
  function attachTilt(card) {
    if (reducedMotion || !window.matchMedia('(hover: hover)').matches) return;
    var strength = 7;
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width;
      var py = (e.clientY - r.top) / r.height;
      card.style.transform =
        'perspective(800px) rotateX(' + ((0.5 - py) * strength) + 'deg)' +
        ' rotateY(' + ((px - 0.5) * strength) + 'deg) translateY(-4px)';
      card.style.setProperty('--mx', (px * 100) + '%');
      card.style.setProperty('--my', (py * 100) + '%');
    });
    card.addEventListener('pointerleave', function () { card.style.transform = ''; });
  }
  $$('.tilt').forEach(attachTilt);

  /* waveform bars */
  function buildWaveform(el) {
    if (el.childElementCount) return;
    var bars = parseInt(el.getAttribute('data-bars') || '18', 10);
    for (var i = 0; i < bars; i++) {
      var s = document.createElement('span');
      s.style.setProperty('--i', i);
      s.style.setProperty('--h', (35 + Math.round(Math.random() * 55)) + '%');
      el.appendChild(s);
    }
  }
  $$('.waveform').forEach(buildWaveform);

  /* sound gate */
  var enterBtn = $('#enter-sound');
  var gated = $$('.play-btn[data-gated]');

  function setSoundOn(on, announce) {
    document.body.classList.toggle('sound-on', on);
    gated.forEach(function (btn) { btn.setAttribute('aria-disabled', on ? 'false' : 'true'); });
    try { sessionStorage.setItem('ds-sound-on', on ? '1' : ''); } catch (e) {}
    if (on && announce) {
      var live = $('#sound-live');
      if (live) live.textContent = 'Frequencies active. Preview players are now enabled.';
    }
  }

  if (enterBtn) {
    enterBtn.addEventListener('click', function () { setSoundOn(true, true); });
    var remembered = false;
    try { remembered = sessionStorage.getItem('ds-sound-on') === '1'; } catch (e) {}
    setSoundOn(remembered, false);
  }

  /* preview play buttons */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-audio-id][data-audio-src]');
    if (!btn) return;
    if (btn.getAttribute('aria-disabled') === 'true') {
      var scope = btn.closest('[data-audio-scope]');
      var status = scope && scope.querySelector('.capsule-status');
      if (status) status.textContent = 'Click "Enter The Vortex" above to activate previews.';
      return;
    }
    if (window.WKAudio) {
      window.WKAudio.playPreview(btn.getAttribute('data-audio-id'), btn.getAttribute('data-audio-src'));
    }
  });

  /* releases (music page) */
  var PLATFORMS = [
    { key: 'spotifyUrl', label: 'Spotify', icon: './assets/icons/spotify.svg' },
    { key: 'appleMusicUrl', label: 'Apple Music', icon: './assets/icons/apple-music.svg' },
    { key: 'youtubeUrl', label: 'YouTube', icon: './assets/icons/youtube.svg' },
    { key: 'distrokidUrl', label: 'DistroKid', icon: './assets/icons/distrokid.svg' }
  ];

  function platformButtons(release) {
    var wrap = document.createElement('div');
    wrap.className = 'platform-row';
    PLATFORMS.forEach(function (p) {
      var url = release[p.key];
      if (!url) return;
      var img = '<img src="' + p.icon + '" alt="" aria-hidden="true">';
      if (url === '#') {
        var span = document.createElement('span');
        span.className = 'platform-btn disabled';
        span.setAttribute('aria-disabled', 'true');
        span.innerHTML = img + p.label;
        wrap.appendChild(span);
      } else {
        var a = document.createElement('a');
        a.className = 'platform-btn';
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener';
        a.setAttribute('aria-label', release.title + ' on ' + p.label);
        a.innerHTML = img + p.label;
        wrap.appendChild(a);
      }
    });
    return wrap;
  }

  function playerRow(id, src, label) {
    var row = document.createElement('div');
    row.className = 'player-row';
    row.setAttribute('data-audio-scope', '');
    row.innerHTML =
      '<button class="play-btn" type="button" data-audio-id="' + id + '" data-audio-src="' + src + '"' +
      ' data-label="' + label + ' preview" aria-label="Play ' + label + ' preview" aria-pressed="false">' +
      '<svg class="icon-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>' +
      '<svg class="icon-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>' +
      '</button>' +
      '<div class="waveform" data-bars="26" aria-hidden="true"></div>' +
      '<span class="capsule-status"></span>';
    buildWaveform(row.querySelector('.waveform'));
    return row;
  }

  function renderReleases() {
    var grid = $('#releases-grid');
    var featuredMount = $('#featured-release');
    var data = window.WK_RELEASES || [];
    if (!grid && !featuredMount) return;

    var featured = data.find(function (r) { return r.featured; }) || data[0];

    if (featuredMount && featured) {
      var art = featuredMount.querySelector('[data-slot="cover"]');
      var title = featuredMount.querySelector('[data-slot="title"]');
      var date = featuredMount.querySelector('[data-slot="date"]');
      var desc = featuredMount.querySelector('[data-slot="desc"]');
      var player = featuredMount.querySelector('[data-slot="player"]');
      var links = featuredMount.querySelector('[data-slot="links"]');
      if (art) { art.src = featured.coverImage; art.alt = featured.title + ' cover art'; art.onerror = function() { this.onerror = null; this.src = './assets/images/release-placeholder.jpg'; }; }
      if (title) {
        title.textContent = featured.title;
        if (featured.artist) {
          var sub = document.createElement('span');
          sub.className = 'release-artist';
          sub.textContent = featured.artist;
          title.appendChild(document.createElement('br'));
          title.appendChild(sub);
        }
      }
      if (date) date.textContent = featured.releaseDate;
      if (desc) desc.textContent = featured.description;
      if (player && featured.previewAudio) player.appendChild(playerRow('featured-release', featured.previewAudio, featured.title));
      if (links) links.appendChild(platformButtons(featured));
    }

    if (grid) {
      data.forEach(function (r, i) {
        var card = document.createElement('article');
        card.className = 'release-card glass-card tilt reveal';

        var cover = document.createElement('div');
        cover.className = 'cover';
        var img = document.createElement('img');
        img.src = r.coverImage;
        img.alt = r.title + ' cover art';
        img.loading = 'lazy';
        img.onerror = function() { this.onerror = null; this.src = './assets/images/release-placeholder.jpg'; };
        cover.appendChild(img);
        card.appendChild(cover);

        var body = document.createElement('div');
        body.className = 'body';
        var h3 = document.createElement('h3');
        h3.textContent = r.title;
        if (r.artist) {
          var sub2 = document.createElement('span');
          sub2.className = 'release-artist';
          sub2.textContent = r.artist;
          h3.appendChild(document.createElement('br'));
          h3.appendChild(sub2);
        }
        var dateEl = document.createElement('span');
        dateEl.className = 'release-date';
        dateEl.textContent = r.releaseDate;
        var p = document.createElement('p');
        p.className = 'desc';
        p.textContent = r.description;
        body.appendChild(h3);
        body.appendChild(dateEl);
        body.appendChild(p);
        if (r.previewAudio) {
          body.appendChild(playerRow('release-' + i, r.previewAudio, r.title));
        } else {
          var listen = document.createElement('p');
          listen.className = 'listen-hint';
          listen.textContent = 'Listen on the platforms below';
          body.appendChild(listen);
        }
        body.appendChild(platformButtons(r));
        card.appendChild(body);

        grid.appendChild(card);
        attachTilt(card);
        card.classList.add('visible');
      });
    }
  }
  renderReleases();

  /* contact form */
  var form = $('#contact-form');
  if (form) {
    var fields = {
      name: $('#cf-name'),
      email: $('#cf-email'),
      reason: $('#cf-reason'),
      message: $('#cf-message')
    };
    var submitBtn = form.querySelector('button[type="submit"]');

    function setInvalid(input, invalid) {
      var field = input.closest('.field');
      if (field) field.classList.toggle('invalid', invalid);
      input.setAttribute('aria-invalid', invalid ? 'true' : 'false');
      return !invalid;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var okName = setInvalid(fields.name, fields.name.value.trim().length < 2);
      var okEmail = setInvalid(fields.email, !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.value.trim()));
      var okMsg = setInvalid(fields.message, fields.message.value.trim().length < 5);
      if (!okName || !okEmail || !okMsg) {
        var firstBad = form.querySelector('.field.invalid input, .field.invalid textarea');
        if (firstBad) firstBad.focus();
        return;
      }

      var note = $('#form-status');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Transmitting...'; }

      var formData = new FormData(form);
      formData.set('subject', 'DuneSurfer enquiry: ' + (fields.reason.value || 'General'));

      fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.success) {
            if (note) { note.textContent = 'Transmission received! DuneSurfer will respond.'; note.style.color = 'var(--color-cyan)'; }
            form.reset();
          } else {
            if (note) { note.textContent = 'Something went wrong. Please try again.'; note.style.color = 'var(--color-magenta)'; }
          }
        })
        .catch(function () {
          if (note) { note.textContent = 'Network error. Please check your connection and try again.'; note.style.color = 'var(--color-magenta)'; }
        })
        .finally(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send Transmission'; }
        });
    });

    Object.keys(fields).forEach(function (k) {
      fields[k].addEventListener('input', function () { setInvalid(fields[k], false); });
    });
  }

  /* footer wave bars */
  $$('.footer-wave').forEach(function (el) {
    for (var i = 0; i < 42; i++) {
      var s = document.createElement('span');
      s.style.setProperty('--i', i);
      s.style.setProperty('--h', (30 + Math.round(Math.random() * 60)) + '%');
      el.appendChild(s);
    }
  });

  /* footer year */
  var yearEl = $('#footer-year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
