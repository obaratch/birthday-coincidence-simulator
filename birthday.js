const config = require("config");
const { Worker } = require("node:worker_threads");
const ChartJsImgae = require("chartjs-to-image");

const { ClassSize, LOOP } = config;

let reqs = [];
for (let size = ClassSize.MIN; size <= ClassSize.MAX; size++) {
  reqs.push(
    new Promise((resolve) => {
      const worker = new Worker("./worker.js");
      worker.on("message", (result) => {
        const {
          size,
          coincidenceCount: count,
          coincidenceRatio: ratio,
        } = result;
        console.log(`Class of ${size}: ${count}/${LOOP} = ${ratio}`);
        resolve(result);
      });
      worker.postMessage({ size, LOOP });
    })
  );
}

Promise.all(reqs).then((data) => {
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
});
