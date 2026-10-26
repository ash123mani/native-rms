window.RMS = window.RMS || {};

window.RMS.repository = (function (config, storage) {
  'use strict';

  const adapter = storage.createAdapter(config.storage.key);

  function createId() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID();
    }
    return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
  }

  function gradeFor(score) {
    const value = Number(score);
    const band = config.gradeBands.find(function (item) {
      return value >= item.min;
    });
    return band || { min: 0, letter: 'F' };
  }

  function statusFor(score) {
    return Number(score) >= config.passMark ? 'pass' : 'fail';
  }

  function list() {
    return adapter.read().slice().sort(function (a, b) {
      return Number(a.roll) - Number(b.roll);
    });
  }

  function add(data) {
    const score = Number(data.score);
    const record = {
      id: createId(),
      roll: Number(data.roll),
      name: String(data.name).trim().replace(/\s+/g, ' '),
      dob: data.dob,
      score: score,
      grade: gradeFor(score).letter,
      status: statusFor(score),
      addedAt: new Date().toISOString()
    };

    const items = adapter.read();
    items.push(record);

    const written = adapter.write(items);
    if (!written.ok) {
      return { ok: false, error: written.error };
    }
    return { ok: true, record: record };
  }

  function remove(id) {
    const items = adapter.read();
    const remaining = items.filter(function (item) {
      return item.id !== id;
    });
    if (remaining.length === items.length) {
      return false;
    }
    return adapter.write(remaining).ok;
  }

  return {
    list: list,
    add: add,
    remove: remove,
    gradeFor: gradeFor,
    statusFor: statusFor,
    isAvailable: adapter.isAvailable
  };
})(window.RMS.config, window.RMS.storage);
