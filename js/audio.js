(function () {
  'use strict';

  var DSAudio = {
    currentAudio: null,
    currentId: null,

    playPreview: function (id, src) {
      if (this.currentId === id && this.currentAudio && !this.currentAudio.paused) {
        this.stopCurrent();
        return;
      }
      this.stopCurrent();

      var audio = new Audio(src);
      audio.preload = 'auto';
      this.currentAudio = audio;
      this.currentId = id;
      var self = this;

      audio.addEventListener('ended', function () {
        if (self.currentId === id) self.stopCurrent();
      });

      audio.addEventListener('error', function () {
        if (self.currentId === id) {
          self.currentAudio = null;
          self.currentId = null;
          self._setUI(id, false);
          self._markMissing(id);
        }
      });

      var started = audio.play();
      if (started && started.catch) {
        started
          .then(function () {
            self._setUI(id, true);
            self._emit('ds:audio-playing', id);
          })
          .catch(function () {
            if (self.currentId === id) {
              self.currentAudio = null;
              self.currentId = null;
              self._setUI(id, false);
              self._markMissing(id);
            }
          });
      } else {
        this._setUI(id, true);
        this._emit('ds:audio-playing', id);
      }
    },

    stopCurrent: function () {
      if (this.currentAudio) {
        this.currentAudio.pause();
        try { this.currentAudio.currentTime = 0; } catch (e) {}
      }
      if (this.currentId !== null) this._setUI(this.currentId, false);
      this.currentAudio = null;
      this.currentId = null;
      this._emit('ds:audio-stopped');
    },

    _setUI: function (id, playing) {
      document.querySelectorAll('[data-audio-id="' + id + '"]').forEach(function (btn) {
        btn.classList.toggle('playing', playing);
        btn.setAttribute('aria-pressed', playing ? 'true' : 'false');
        var label = btn.getAttribute('data-label') || 'preview';
        btn.setAttribute('aria-label', (playing ? 'Pause ' : 'Play ') + label);
        var scope = btn.closest('[data-audio-scope]') || btn.parentElement;
        if (scope) {
          var wave = scope.querySelector('.waveform');
          if (wave) wave.classList.toggle('playing', playing);
        }
      });
    },

    _markMissing: function (id) {
      document.querySelectorAll('[data-audio-id="' + id + '"]').forEach(function (btn) {
        var scope = btn.closest('[data-audio-scope]') || btn.parentElement;
        var status = scope ? scope.querySelector('.capsule-status') : null;
        if (status) {
          status.textContent = 'Preview coming soon';
          status.classList.add('missing');
        }
      });
    },

    _emit: function (name, id) {
      window.dispatchEvent(new CustomEvent(name, { detail: { id: id || null } }));
    }
  };

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) DSAudio.stopCurrent();
  });

  window.WKAudio = DSAudio;
})();
