const config = require("config");
const ChartJsImgae = require("chartjs-to-image");

const { ClassSize, LOOP } = config;

let data = [];
for (let size = ClassSize.MIN; size <= ClassSize.MAX; size++) {
  const birthdayComparisons = Array.from(Array(LOOP))
    .map(() => generateBirthdays(size))
    .map(foundTheSame);
  const coincidenceCount = birthdayComparisons.filter((same) => same).length;
  const coincidenceRatio = coincidenceCount / LOOP;
  console.log(
    `Class of ${size}: ${coincidenceCount}/${LOOP} = ${coincidenceRatio}`
  );
  data.push({ size, coincidenceRatio });
}

const chart = new ChartJsImgae();
const { FILE_NAME, TITLE, WIDTH, HEIGHT } = config.ChartImage;
chart.setChartJsVersion("4");
chart.setWidth(WIDTH);
chart.setHeight(HEIGHT);
chart.setConfig({
  type: "line",
  options: {
    scales: {
      xAxis: { title: { display: true, text: "Class Size" } },
    },
  },
  data: {
    labels: data.map((d) => d.size),
    datasets: [
      {
        label: TITLE,
        data: data.map((d) => d.coincidenceRatio),
      },
    ],
  },
});
chart.toFile(FILE_NAME).then(() => {
  console.log(`Chart image(${WIDTH}x${HEIGHT}) saved to ${FILE_NAME}.`);
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
