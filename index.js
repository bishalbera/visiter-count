const mongoose = require("mongoose");
const express = require("express");

const app = express();

const port = 3000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

const countSchema = new mongoose.Schema({ count: Number });
const Count = mongoose.model("Count", countSchema);

app.get("/visitor-count", async (req, res) => {
  try {
    let counter = await Count.findOne({});

    if (!counter) {
      // Initialize a new count document if it doesn't exist
      counter = new Count({ count: 1 });
    } else {
      // Increment the count if it already exists
      counter.count += 1;
    }

    await counter.save();
    res.json({ count: counter.count });
  } catch (error) {
    console.error("Error fetching or updating count:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is starting on ${port}`);
});
