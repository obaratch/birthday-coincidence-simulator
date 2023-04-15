const config = require("config");
const ChartJsImgae = require("chartjs-to-image");

const { ClassSize, LOOP } = config;

const { Worker } = require("node:worker_threads");

let reqs = [];
let tmp = {};
for (let size = ClassSize.MIN; size <= ClassSize.MAX; size++) {
  for (let i = 0; i < LOOP; i++) {
    reqs.push(
      new Promise((resolve) => {
        const worker = new Worker("./worker.js");
        worker.on("message", (msg) => resolve(msg));
        worker.postMessage({ size });
      }).then(({ wid, data, foundPair }) => {
        const size = data.length;
        if (!tmp[size]) {
          tmp[size] = [];
        }
        tmp[size].push({ wid, size, foundPair });
      })
    );
  }
}

Promise.all(reqs)
  .then(() => {
    const data = Object.values(tmp).map((results) => {
      const size = results[0].size;
      const coincidenceCount = results.filter((d) => d.foundPair).length;
      const coincidenceRatio = coincidenceCount / results.length;
      return { size, coincidenceRatio };
    });
    console.log(data);
    return data;
  })
  .then((data) => {
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
