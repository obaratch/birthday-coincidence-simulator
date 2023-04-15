const ChartJsImgae = require("chartjs-to-image");

const LOOP = 100000;

const NUM_MIN = 1;
const NUM_MAX = 60;

const CHART_FILE_NAME = "birthday.png";
const WIDTH = 1920 / 2;
const HEIGHT = 1080 / 2;

let data = [];
for (let num = NUM_MIN; num <= NUM_MAX; num++) {
  const birthdayComparisons = Array.from(Array(LOOP))
    .map(() => generateBirthdays(num))
    .map(foundTheSame);
  const coincidenceCount = birthdayComparisons.filter((same) => same).length;
  const coincidenceRatio = coincidenceCount / LOOP;
  console.log(
    `Class of ${num}: ${coincidenceCount}/${LOOP} = ${coincidenceRatio}`
  );
  data.push({ num, coincidenceRatio });
}

const chart = new ChartJsImgae();
chart.setChartJsVersion("4");
chart.setWidth(WIDTH);
chart.setHeight(HEIGHT);
chart.setConfig({
  type: "line",
  options: {
    scales: {
      x: { title: { display: true, text: "Class Size" } },
    },
  },
  data: {
    labels: data.map((d) => d.num),
    datasets: [
      {
        label:
          "Possibility of One or More Birthday Coincidences in A Classroom",
        data: data.map((d) => d.coincidenceRatio),
      },
    ],
  },
});
chart.toFile(CHART_FILE_NAME).then(() => {
  console.log(`Chart image(${WIDTH}x${HEIGHT}) saved to ${CHART_FILE_NAME}.`);
});

// ----------------
// utils below

function generateBirthdays(num) {
  return Array.from(Array(num))
    .map(() => Math.round(Math.random() * 365))
    .sort((a, b) => a - b);
}

function foundTheSame(list) {
  for (let i = 0; i < list.length - 1; i++) {
    if (list[i] === list[i + 1]) {
      return true;
    }
  }
  return false;
}
