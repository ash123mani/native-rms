window.RMS = window.RMS || {};

window.RMS.validators = (function (config) {
  'use strict';

  const limits = config.limits;

  const NAME_PATTERN = /^[A-Za-z][A-Za-z .'-]*$/;

  function todayISO() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return now.getFullYear() + '-' + month + '-' + day;
  }

  function parseISODate(value) {
    const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ''));
    if (!parts) {
      return null;
    }
    const year = Number(parts[1]);
    const month = Number(parts[2]);
    const day = Number(parts[3]);
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
      return null;
    }
    return date;
  }

  function ageOn(dob, reference) {
    let age = reference.getFullYear() - dob.getFullYear();
    const monthDiff = reference.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && reference.getDate() < dob.getDate())) {
      age -= 1;
    }
    return age;
  }

  const RULES = {
    rollNumber: {
      label: 'Roll number',
      required: true,
      validate: function (value, context) {
        if (!/^\d+$/.test(value)) {
          return 'Roll number must contain digits only.';
        }
        const number = Number(value);
        if (number < limits.rollMin || number > limits.rollMax) {
          return 'Roll number must be between ' + limits.rollMin + ' and ' + limits.rollMax + '.';
        }
        const taken = (context.existingRolls || []).map(Number);
        if (taken.indexOf(number) !== -1) {
          return 'Roll number ' + number + ' is already assigned to another student.';
        }
        return '';
      }
    },

    studentName: {
      label: 'Student name',
      required: true,
      validate: function (value) {
        if (value.length < limits.nameMin) {
          return 'Student name must be at least ' + limits.nameMin + ' characters long.';
        }
        if (value.length > limits.nameMax) {
          return 'Student name must be ' + limits.nameMax + ' characters or fewer.';
        }
        if (!NAME_PATTERN.test(value)) {
          return 'Student name must start with a letter and may only contain letters, spaces, apostrophes and hyphens.';
        }
        return '';
      }
    },

    dob: {
      label: 'Date of birth',
      required: true,
      validate: function (value) {
        const dob = parseISODate(value);
        if (!dob) {
          return 'Please enter a valid date of birth.';
        }
        const today = new Date();
        if (dob > today) {
          return 'Date of birth cannot be in the future.';
        }
        const age = ageOn(dob, today);
        if (age < limits.minAge) {
          return 'The student must be at least ' + limits.minAge + ' years old.';
        }
        if (age > limits.maxAge) {
          return 'Please enter a valid date of birth (age must be under ' + limits.maxAge + ' years).';
        }
        return '';
      }
    },

    score: {
      label: 'Score',
      required: true,
      validate: function (value) {
        const decimals = '\\.\\d{1,' + config.score.decimals + '}';
        if (!new RegExp('^\\d+(' + decimals + ')?$').test(value)) {
          return 'Score must be a whole number with at most ' + config.score.decimals + ' decimal places.';
        }
        const number = Number(value);
        if (number < config.score.min || number > config.score.max) {
          return 'Score must be between ' + config.score.min + ' and ' + config.score.max + '.';
        }
        return '';
      }
    }
  };

  function validateField(name, rawValue, context) {
    const rule = RULES[name];
    if (!rule) {
      return '';
    }
    const value = String(rawValue == null ? '' : rawValue).trim();
    if (value === '') {
      return rule.required ? rule.label + ' is required.' : '';
    }
    return rule.validate(value, context || {}) || '';
  }

  function validateAll(values, context) {
    const errors = {};
    config.fields.forEach(function (name) {
      const message = validateField(name, values ? values[name] : '', context);
      if (message) {
        errors[name] = message;
      }
    });
    return {
      valid: Object.keys(errors).length === 0,
      errors: errors
    };
  }

  function setFieldState(input, feedback, message) {
    if (!input) {
      return;
    }

    if (message) {
      input.classList.add('rms-input--invalid');
      input.setAttribute('aria-invalid', 'true');
      if (feedback) {
        feedback.textContent = message;
        feedback.classList.add('rms-field__error--visible');
      }
    } else {
      input.classList.remove('rms-input--invalid');
      input.removeAttribute('aria-invalid');
      if (feedback) {
        feedback.textContent = '';
        feedback.classList.remove('rms-field__error--visible');
      }
    }
  }

  function announce(message) {
    const live = document.getElementById('liveStatus');
    if (!live) {
      return;
    }
    live.textContent = '';
    window.setTimeout(function () {
      live.textContent = message;
    }, 50);
  }

  return {
    validateField: validateField,
    validateAll: validateAll,
    setFieldState: setFieldState,
    announce: announce,
    parseISODate: parseISODate,
    ageOn: ageOn,
    todayISO: todayISO,
    rules: RULES
  };
})(window.RMS.config);
