window.RMS = window.RMS || {};

window.RMS.storage = (function () {
  'use strict';

  function createAdapter(key) {
    function read() {
      try {
        const raw = window.localStorage.getItem(key);
        if (raw === null || raw === undefined || raw === '') {
          return [];
        }
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        console.warn('[RMS] Unable to read stored data, falling back to an empty list.', error);
        return [];
      }
    }

    function write(items) {
      try {
        window.localStorage.setItem(key, JSON.stringify(items));
        return { ok: true };
      } catch (error) {
        const quotaFull = error && (error.name === 'QuotaExceededError' || error.code === 22);
        const message = quotaFull
          ? 'Browser storage is full. Remove some results and try again.'
          : 'Results could not be saved in your browser.';
        console.error('[RMS] Unable to write stored data.', error);
        return { ok: false, error: message };
      }
    }

    function isAvailable() {
      try {
        const probe = '__rms_probe__';
        window.localStorage.setItem(probe, '1');
        window.localStorage.removeItem(probe);
        return true;
      } catch (error) {
        return false;
      }
    }

    return {
      read: read,
      write: write,
      isAvailable: isAvailable
    };
  }

  return {
    createAdapter: createAdapter
  };
})();
