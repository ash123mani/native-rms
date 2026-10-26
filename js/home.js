(function () {
  'use strict';

  const repository = window.RMS.repository;
  const ui = window.RMS.ui;
  const validators = window.RMS.validators;

  const tableBody = document.getElementById('resultsBody');
  if (!tableBody) {
    return;
  }

  const table = tableBody.closest('table');
  const emptyState = document.getElementById('emptyState');
  const recordCount = document.getElementById('recordCount');

  function cell(text) {
    return ui.el('td', { text: text });
  }

  function buildRow(record, position) {
    const score = Number(record.score);
    const grade = repository.gradeFor(score);
    const isPass = repository.statusFor(score) === 'pass';

    const row = ui.el('tr');

    row.appendChild(cell(String(position)));
    row.appendChild(cell(String(record.roll)));
    row.appendChild(cell(record.name));

    const dobCell = cell('');
    dobCell.appendChild(ui.el('time', {
      text: ui.formatDate(record.dob),
      attrs: { datetime: record.dob }
    }));
    row.appendChild(dobCell);

    row.appendChild(cell(ui.formatScore(score)));
    row.appendChild(cell(grade.letter));
    row.appendChild(cell(isPass ? 'Pass' : 'Fail'));

    const actionCell = cell('');
    const deleteButton = ui.el('button', {
      className: 'rms-btn rms-btn--danger-ghost rms-btn--icon',
      attrs: {
        type: 'button',
        'data-action': 'delete',
        'data-id': record.id,
        'aria-label': 'Delete result for ' + record.name
      }
    });
    deleteButton.appendChild(ui.icon('trash', 'rms-icon rms-icon--sm'));
    actionCell.appendChild(deleteButton);
    row.appendChild(actionCell);

    return row;
  }

  function renderRows(records) {
    const fragment = document.createDocumentFragment();
    records.forEach(function (record, index) {
      fragment.appendChild(buildRow(record, index + 1));
    });
    tableBody.textContent = '';
    tableBody.appendChild(fragment);
  }

  function renderEmptyState(hasRecords) {
    emptyState.classList.toggle('rms-hidden', hasRecords);
    table.classList.toggle('rms-hidden', !hasRecords);
  }

  function render() {
    const all = repository.list();
    renderRows(all);
    renderEmptyState(all.length > 0);
    recordCount.textContent = all.length + (all.length === 1 ? ' student' : ' students');
  }

  function requestDelete(id) {
    const record = repository.list().find(function (item) {
      return item.id === id;
    });
    if (!record) {
      return;
    }

    const confirmed = window.confirm(
      'Delete the result for ' + record.name + ' (Roll No. ' + record.roll + ')?\n\n' +
      'This cannot be undone.'
    );
    if (!confirmed) {
      return;
    }

    if (repository.remove(id)) {
      render();
      validators.announce('Result deleted.');
    }
  }

  tableBody.addEventListener('click', function (event) {
    const button = event.target.closest('[data-action="delete"]');
    if (button) {
      requestDelete(button.dataset.id);
    }
  });

  render();

  if (!repository.isAvailable()) {
    validators.announce('Browser storage is unavailable. Results will not be saved.');
  }
})();
