const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://Jarko:78789893@cluster0.n3xtd.gcp.mongodb.net/Cluster0?retryWrites=true&w=majority"; 
const client = new MongoClient(uri, { useUnifiedTopology: true });
const express = require("express");
const { response } = require("express");
const app = express();
const port = process.env.PORT || 27017;
app.listen(port, () => console.log(`server is running on port ${port}`));
app.use(express.static("public"));
app.use(express.json());

//connect to db
async function run() {
  await client.connect();
  console.log("conected to database");
  const database = client.db("treasure");
  const collection = database.collection("players");
  // get top 15
  app.get("/get", function (req, res, opt) {
    let arr = [];
    const sort = { score: 1 };
    const limit = 15;
    const projection = { _id: 0, name: 1, score: 1 };
    const cursor = collection.find().project(projection);
    cursor.sort(sort);
    cursor.limit(limit);
    cursor.forEach(
      (elem) => {
        arr.push(elem);
      },
      () => {
        res.json(arr);
      }
    );
  });

  // data handler
  app.post("/api", function (req, res) {
    let data = req.body;
    // request
    const options = { upsert: true };
    let query = { name: data.name };
    let update = {
      $set: {
        name: data.name,
        score: data.score,
      },
    };
    collection.updateOne(query, update, options);

    //response
    let arr = [];
    const sort = { score: 1 };
    const limit = 15;
    const projection = { _id: 0, name: 1, score: 1 };
    const cursor = collection.find().project(projection);
    cursor.sort(sort);
    cursor.limit(limit);
    cursor.forEach(
      (elem) => {
        arr.push(elem);
      },
      () => {
        res.json(arr);
      }
    );
  });
}
run().catch((err) => {
  console.error(err);
});
