const { Console } = require("console");
const express = require("express");
const fs = require("fs/promises");

const app = express();

const port = 3000;

const filePath = "count.txt";

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

const countSchema = new mongoose.Schema({ count: Number });
const Count = mongoose.model("Count", countSchema);

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
  let counter = await Count.findOne({});

  if (!counter) {
    counter = new Count({ count: 1 });
  } else {
    counter.count += 1;
  }

  await counter.save();
  res.json({ count: counter.count });
});

app.listen(port, () => {
  console.log(`Server is starting on ${port}`);
});
