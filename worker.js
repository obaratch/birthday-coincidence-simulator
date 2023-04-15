const { parentPort, threadId: wid } = require("node:worker_threads");

parentPort.on("message", ({ size, LOOP }) => {
  const data = Array.from(Array(LOOP))
    .map(() => generateBirthdays(size))
    .map(findPair);
  const coincidenceCount = data.filter((d) => d).length;
  const coincidenceRatio = coincidenceCount / data.length;
  parentPort.postMessage({ wid, size, coincidenceCount, coincidenceRatio });
  process.exit();
});

function generateBirthdays(num) {
  return Array.from(Array(num))
    .map(() => Math.round(Math.random() * 365))
    .sort((a, b) => a - b);
}

function findPair(list) {
  for (let i = 0; i < list.length - 1; i++) {
    if (list[i] === list[i + 1]) {
      return true;
    }
  }
  return false;
}
