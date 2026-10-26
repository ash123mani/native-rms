window.RMS = window.RMS || {};

window.RMS.toast = (function (ui) {
  'use strict';

  const DEFAULT_DURATION = 3600;

  const TONE_ICON = {
    success: 'check-circle',
    danger: 'alert',
    info: 'info'
  };

  function dismiss(toast) {
    if (!toast || toast.dataset.dismissing === 'true') {
      return;
    }
    toast.dataset.dismissing = 'true';
    toast.classList.add('rms-toast--leaving');

    window.setTimeout(function () {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 200);
  }

  function show(message, options) {
    const opts = options || {};
    const tone = opts.tone || 'success';
    const duration = opts.duration || DEFAULT_DURATION;
    const container = document.getElementById(opts.containerId || 'toastContainer');

    if (!container) {
      return null;
    }

    const toast = ui.el('div', {
      className: 'rms-toast rms-toast--' + tone,

      attrs: { role: tone === 'danger' ? 'alert' : 'status' }
    });

    const icon = ui.icon(TONE_ICON[tone] || 'info', 'rms-icon rms-toast__icon');
    toast.appendChild(icon);
    toast.appendChild(ui.el('p', { className: 'rms-toast__body', text: message }));

    const close = ui.el('button', {
      className: 'rms-toast__close',
      attrs: { type: 'button', 'aria-label': 'Dismiss notification' }
    });
    close.appendChild(ui.icon('close', 'rms-icon rms-icon--sm'));
    close.addEventListener('click', function () {
      dismiss(toast);
    });
    toast.appendChild(close);

    container.appendChild(toast);

    if (duration > 0) {
      window.setTimeout(function () {
        dismiss(toast);
      }, duration);
    }

    return toast;
  }

  function clearAll() {
    const container = document.getElementById('toastContainer');
    if (!container) {
      return;
    }
    Array.prototype.slice.call(container.children).forEach(dismiss);
  }

  return {
    show: show,
    dismiss: dismiss,
    clearAll: clearAll
  };
})(window.RMS.ui);
