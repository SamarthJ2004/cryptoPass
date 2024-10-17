const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');


mongoose.connect('mongodb+srv://anushka:anushkas@cluster0.w2aa386.mongodb.net/cryptopasss?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Connection error', err));



const concertSchema = new mongoose.Schema({
  concertName: String,
  artistName: String,
  date: String,
  time: String,
  venue: String,
  description: String,
  regularPrice: Number,
  regularCount: Number,
  vipPrice: Number,
  vipCount: Number
});

const Concert = mongoose.model('Concert', concertSchema);

const app = express();
app.use(cors());
app.use(bodyParser.json());


app.post('/api/concerts', async (req, res) => {
  try {
    const concert = new Concert(req.body);
    await concert.save();
    res.status(201).send(concert);
  } catch (error) {
    res.status(500).send(error);
  }
});


app.get('/api/concerts', async (req, res) => {
  try {
    const concerts = await Concert.find();
    res.status(200).json(concerts);
  } catch (error) {
    res.status(500).send(error);
  }
});

const PORT = 3011;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
