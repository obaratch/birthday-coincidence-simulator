const { parentPort, threadId: wid } = require("node:worker_threads");

parentPort.on("message", ({ size }) => {
  const data = generateBirthdays(size);
  const foundPair = findPair(data);
  parentPort.postMessage({ wid, data, foundPair });
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
