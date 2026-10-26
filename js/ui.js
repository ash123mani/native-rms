window.RMS = window.RMS || {};

window.RMS.ui = (function () {
  'use strict';

  const SVG_NS = 'http://www.w3.org/2000/svg';

  function el(tag, options) {
    const node = document.createElement(tag);
    const opts = options || {};

    if (opts.className) {
      node.className = opts.className;
    }
    if (opts.text !== undefined && opts.text !== null) {
      node.textContent = opts.text;
    }
    if (opts.attrs) {
      Object.keys(opts.attrs).forEach(function (name) {
        node.setAttribute(name, opts.attrs[name]);
      });
    }
    return node;
  }

  function icon(name, className) {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', className || 'rms-icon');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');

    const use = document.createElementNS(SVG_NS, 'use');
    use.setAttribute('href', '#i-' + name);
    svg.appendChild(use);
    return svg;
  }

  function formatDate(iso) {
    const parsed = window.RMS.validators.parseISODate(iso);
    if (!parsed) {
      return iso || '';
    }
    return parsed.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  function formatScore(score) {
    const value = Number(score);
    return Number.isInteger(value) ? String(value) : value.toFixed(2);
  }

  function setCurrentYear() {
    const node = document.getElementById('year');
    if (node) {
      node.textContent = String(new Date().getFullYear());
    }
  }

  return {
    el: el,
    icon: icon,
    formatDate: formatDate,
    formatScore: formatScore,
    setCurrentYear: setCurrentYear
  };
})();
