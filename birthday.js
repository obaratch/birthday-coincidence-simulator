const config = require("config");
const ChartJsImgae = require("chartjs-to-image");

const { ClassSize, LOOP } = config;

const { Worker } = require("node:worker_threads");

let reqs = [];
for (let size = ClassSize.MIN; size <= ClassSize.MAX; size++) {
  reqs.push(
    new Promise((resolve) => {
      const worker = new Worker("./worker.js");
      worker.on("message", (msg) => resolve(msg));
      worker.postMessage({ size, LOOP });
    })
  );
}

Promise.all(reqs).then((data) => {
  console.log(data);
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
