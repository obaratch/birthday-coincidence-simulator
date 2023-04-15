module.exports = {
  // Number of times to run the simulation
  // (bigger the better but slower)
  LOOP: 10000,

  // Class size range
  ClassSize: {
    MIN: 1,
    MAX: 60,
  },

  // Chart image settings
  ChartImage: {
    FILE_NAME: "simulation-result.png",
    TITLE: "Possibility of One or More Birthday Coincidences in a Classroom",
    WIDTH: 1920 / 2,
    HEIGHT: 1080 / 2,
  },
};

// create config/local.js (or .json) to override.
