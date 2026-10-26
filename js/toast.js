window.RMS = window.RMS || {};

window.RMS.toast = (function (ui) {
  'use strict';

  const TONE_ICON = {
    success: 'check-circle',
    danger: 'alert'
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

  function show(message, tone) {
    const kind = tone === 'danger' ? 'danger' : 'success';
    const container = document.getElementById('toastContainer');

    if (!container) {
      return null;
    }

    const toast = ui.el('div', {
      className: 'rms-toast rms-toast--' + kind,
      attrs: { role: kind === 'danger' ? 'alert' : 'status' }
    });

    toast.appendChild(ui.icon(TONE_ICON[kind], 'rms-icon rms-toast__icon'));
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

    window.setTimeout(function () {
      dismiss(toast);
    }, 3600);

    return toast;
  }

  return {
    show: show
  };
})(window.RMS.ui);
