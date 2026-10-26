window.RMS = window.RMS || {};

window.RMS.config = {
  storage: {
    key: 'rms.results.v1'
  },

  passMark: 40,

  score: {
    min: 0,
    max: 100,
    decimals: 2
  },

  limits: {
    rollMin: 1,
    rollMax: 99999,
    nameMin: 3,
    nameMax: 60,
    minAge: 5,
    maxAge: 120
  },

  gradeBands: [
    { min: 90, letter: 'A+' },
    { min: 80, letter: 'A' },
    { min: 70, letter: 'B+' },
    { min: 60, letter: 'B' },
    { min: 50, letter: 'C' },
    { min: 40, letter: 'D' },
    { min: 0, letter: 'F' }
  ],

  fields: ['rollNumber', 'studentName', 'dob', 'score']
};
