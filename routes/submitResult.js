const express = require('express');
require('dotenv').config({ path: './config/.env' });
const { MongoClient } = require('mongodb');

const uri = process.env.API_URI;
const router = express.Router();

router.post('/api', function (req, res) {
  async function run() {
    // connect to db
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
    const database = client.db('treasure');
    const collection = database.collection('players');

    // update data
    const data = req.body;
    const options = { upsert: true };
    const query = { name: data.name };
    const update = {
      $set: {
        name: data.name,
        score: data.score,
      },
    };
    collection.updateOne(query, update, options);

    // get new top 15
    const arr = [];
    const sort = { score: 1 };
    const limit = 15;
    const projection = { _id: 0, name: 1, score: 1 };
    const cursor = collection.find().project(projection);
    cursor.sort(sort);
    cursor.limit(limit);

    // send new top15 back to client
    cursor.forEach(
      (elem) => {
        arr.push(elem);
      },
      () => {
        client.close();
        res.json(arr);
      },
    );
  }
  run().catch();
});

module.exports = router;
