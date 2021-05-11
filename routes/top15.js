const express = require('express');
require('dotenv').config({ path: './config/.env' });
const { MongoClient } = require('mongodb');

const uri = process.env.API_URI;
const router = express.Router();

router.get('/top15', async function (req, res) {
  try {
    // connect to db
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
    const database = client.db('treasure');
    const collection = database.collection('players');

    // find data
    const sort = { score: 1 };
    const limit = 20;
    const projection = { _id: 0, name: 1, score: 1 };
    const cursor = collection.find().project(projection);
    cursor.sort(sort);
    cursor.limit(limit);

    // send data back to client
    const data = await cursor.toArray();
    res.json(data);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
