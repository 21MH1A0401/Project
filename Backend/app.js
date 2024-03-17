import express from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import mongoose from "mongoose";

// Define Schema
const sentimentAnalysisSchema = new mongoose.Schema({
    content: String,
    positiveScore: Number,
    negativeScore: Number,
    neutralScore: Number
});

// Create Model
const SentimentAnalysis = mongoose.model('SentimentAnalysis', sentimentAnalysisSchema);

const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb+srv://buddanavaraprasad:MVdDKXcTAc5IMdH4@cluster0.ci86jca.mongodb.net/Cluster0?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// POST endpoint to receive sentiment analysis data
app.post('/analyze-sentiment', async (req, res) => {
    try {
        // Extract data from request body
        const { content, positiveScore, negativeScore, neutralScore } = req.body;

        // Create a new document with the received data
        const analysisResult = new SentimentAnalysis({
            content,
            positiveScore,
            negativeScore,
            neutralScore
        });

        // Save the document to the database
        await analysisResult.save();

        // Respond with success message
        res.json({ message: 'Sentiment analysis data stored successfully.' });
    } catch (error) {
        // If an error occurs, respond with error message
        res.status(500).json({ error: 'An error occurred while storing sentiment analysis data.' });
    }
});

// GET endpoint to fetch sentiment analysis scores
app.get('/getscores', async (req,res) => {
    try {
        // Fetch scores data from the database
        const scoresData = await SentimentAnalysis.find();

        // Respond with the data
        res.status(200).json({ scoresData });
    } catch (error) {
        // If an error occurs, respond with error message
        res.status(500).json({ error: 'An error occurred while fetching sentiment analysis scores.' });
    }
});

app.listen(5000, () => {
    console.log("Connected to Database & Listening to localhost 5000");
});
