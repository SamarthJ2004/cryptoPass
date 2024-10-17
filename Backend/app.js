const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(bodyParser.json());

app.use('/uploads', express.static('uploads'));

// URL
const URL = "mongodb+srv://anushka:anushkas@cluster0.w2aa386.mongodb.net/cryptopasss?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });

const EventSchema = new mongoose.Schema({
    concertName: { type: String, required: true },
    artistName: { type: String, required: true },
    dateTime: { type: Date, required: true },
    venue: { type: String, required: true },
    description: { type: String, required: true },
    regularPrice: { type: Number, required: true },
    regularCount: { type: Number, required: true },
    royalPrice: { type: Number, required: true },
    royalCount: { type: Number, required: true },
    image: { type: String, required: true }, 
    email: { type: String, required: true },
    info: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const EventModel = mongoose.model('Event', EventSchema);

// Multer setup for handling image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// API to handle form submission
app.post('/addEvent', upload.single('poster'), async (req, res) => {
    try {
        const { concertName, artistName, venue, description, regularPrice, regularCount, royalPrice, royalCount, email, info } = req.body;
        const dateTime = new Date(req.body.dateTime);
        const posterPath = `req.file ? /uploads/${concertName + artistName} : null`;

        const newEvent = new EventModel({
            concertName,
            artistName,
            dateTime,
            venue,
            description,
            regularPrice,
            regularCount,
            royalPrice,
            royalCount,
            image: posterPath,  
            email,
            info
        });

        await newEvent.save();
        res.status(201).json({ message: 'Event added successfully' });
    } catch (error) {
        console.error('Error saving the event:', error);
        res.status(500).json({ message: 'Error saving the event' });
    }
});

app.get('/events', async (req, res) => {
    try {
        const events = await EventModel.find(); // Fetch all events from the collection
        res.status(200).json(events); // Send the events as a JSON response
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Error fetching events' });
    }
});


const PORT = 3011;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});