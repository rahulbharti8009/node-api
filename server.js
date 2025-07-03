 const cluster = require('node:cluster');
const os = require('os')
const process = require('node:process');
const express = require("express");
 const numCPUs = os.cpus().length


if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  const app = express()
  const PORT = 8001

  app.get("/", (req, res) => {
    return res.json({message : `Worker ${process.pid} started`})
  })

  app.listen(PORT, () => {
  console.log(`Server is ruuning on port ${PORT}`);
});
}