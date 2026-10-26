(function () {
  'use strict';

  const config = window.RMS.config;
  const repository = window.RMS.repository;
  const validators = window.RMS.validators;
  const toast = window.RMS.toast;

  const form = document.getElementById('resultForm');
  if (!form) {
    return;
  }

  const fields = {};

  config.fields.forEach(function (name) {
    fields[name] = {
      input: document.getElementById(name),
      feedback: document.getElementById(name + 'Error')
    };
  });

  let submitAttempted = false;

  function collectValues() {
    const values = {};
    config.fields.forEach(function (name) {
      values[name] = fields[name] && fields[name].input ? fields[name].input.value : '';
    });
    return values;
  }

  function existingRolls() {
    return repository.list().map(function (item) {
      return Number(item.roll);
    });
  }

  function validateField(name) {
    const field = fields[name];
    if (!field || !field.input) {
      return;
    }
    const value = field.input.value.trim();

    const message = value === '' && !submitAttempted
      ? ''
      : validators.validateField(name, field.input.value, { existingRolls: existingRolls() });
    validators.setFieldState(field.input, field.feedback, message);
  }

  function setDateBounds() {
    const field = fields.dob;
    if (!field || !field.input) {
      return;
    }
    const today = new Date();
    const oldest = new Date(today.getFullYear() - config.limits.maxAge, today.getMonth(), today.getDate());
    field.input.max = validators.todayISO();
    field.input.min = oldest.getFullYear() + '-' +
      String(oldest.getMonth() + 1).padStart(2, '0') + '-' +
      String(oldest.getDate()).padStart(2, '0');
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    submitAttempted = true;

    const values = collectValues();
    const result = validators.validateAll(values, { existingRolls: existingRolls() });

    config.fields.forEach(function (name) {
      const field = fields[name];
      if (field && field.input) {
        validators.setFieldState(field.input, field.feedback, result.errors[name] || '');
      }
    });

    if (!result.valid) {
      const count = Object.keys(result.errors).length;
      const firstInvalid = form.querySelector('.rms-input--invalid');
      if (firstInvalid) {
        firstInvalid.focus();
      }
      validators.announce('The form has ' + count + ' error' + (count === 1 ? '' : 's') + '. Please review the highlighted fields.');
      return;
    }

    const saved = repository.add({
      roll: values.rollNumber,
      name: values.studentName,
      dob: values.dob,
      score: values.score
    });

    if (!saved.ok) {
      validators.announce(saved.error);
      toast.show(saved.error, 'danger');
      return;
    }

    form.reset();
    setDateBounds();
    submitAttempted = false;
    fields.rollNumber.input.focus();

    const message = 'Result for roll number ' + saved.record.roll + ' added successfully.';
    validators.announce(message);
    toast.show(message);
  });

  config.fields.forEach(function (name) {
    const field = fields[name];
    if (!field || !field.input) {
      return;
    }

    field.input.addEventListener('blur', function () {
      validateField(name);
    });

    field.input.addEventListener('input', function () {
      if (field.input.classList.contains('rms-input--invalid')) {
        validateField(name);
      }
    });
  });

  setDateBounds();
})();
