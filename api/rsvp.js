const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Koneksi ke MongoDB
const mongoURI = "mongodb+srv://server123:Alfiahibnumalik@tesserver.rbuzv.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

// Model untuk RSVP
const rsvpSchema = new mongoose.Schema({
    name: String,
    attendance: Number,
    message: String
});

const Rsvp = mongoose.model('Rsvp', rsvpSchema);

// Route untuk menghandle RSVP
app.post('/api/rsvp', async (req, res) => {
    const { name, attendance, message } = req.body;
    const newRsvp = new Rsvp({ name, attendance, message });

    try {
        await newRsvp.save();
        res.status(201).json(newRsvp);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route untuk mendapatkan semua RSVP
app.get('/api/rsvps', async (req, res) => {
    try {
        const rsvps = await Rsvp.find();
        res.status(200).json(rsvps);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Export sebagai handler untuk Vercel
module.exports = app;
