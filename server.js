const { Console } = require("console");
const express = require("express");
const fs = require("fs/promises");

const app = express();

const port = 3000;

const filePath = "count.txt";

const readCount = async () => {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return parseInt(data, 10) || 0;
  } catch (err) {
    console.log(err);
  }
};

const incrementCounter = async () => {
  const count = (await readCount()) + 1;

  await fs.writeFile(filePath, count.toString());

  return count;
};

app.get("/visitor-count", async (req, res) => {
  try {
    const count = await incrementCounter();
    res.json({ count }); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" }); 
  }
});

app.listen(port, () => {
  console.log(`Server is starting on ${port}`);
});
