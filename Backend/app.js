const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// MongoDB connection
mongoose.connect('mongodb+srv://anushka:anushkas@cluster0.w2aa386.mongodb.net/cryptopasss?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Connection error', err));

// Define the concert schema
const concertSchema = new mongoose.Schema({
  concertName: { type: String, required: true },
  artistName: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  venue: { type: String, required: true },
  description: { type: String, required: true },
  regularPrice: { type: Number, required: true },
  regularCount: { type: Number, required: true },
  vipPrice: { type: Number, required: true },
  vipCount: { type: Number, required: true },
  imageHash: { type: String, required: true }  // Store IPFS hash here
});

// Create concert model
const Concert = mongoose.model('Concert', concertSchema);

const app = express();
app.use(cors());
app.use(bodyParser.json());

// POST route to add a new concert
app.post('/api/concerts', async (req, res) => {
  try {
    const concert = new Concert(req.body);
    await concert.save();
    res.status(201).json(concert); // Respond with the created concert data
  } catch (error) {
    console.error('Error saving concert to database:', error);
    res.status(500).json({ error: 'Error saving concert to database' });
  }
});

// GET route to retrieve all concerts
app.get('/api/concerts', async (req, res) => {
  try {
    const concerts = await Concert.find();
    res.status(200).json(concerts); // Respond with the list of concerts
  } catch (error) {
    console.error('Error retrieving concerts from database:', error);
    res.status(500).json({ error: 'Error retrieving concerts from database' });
  }
});

// Define the server port
const PORT = 3012;
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
