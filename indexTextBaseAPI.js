const express = require('express');
require('dotenv').config()
const app = express();
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const {
    TextServiceClient
} = require("@google-ai/generativelanguage");
const {
    GoogleAuth
} = require("google-auth-library");
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const API_KEY = process.env.API_KEY;
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const client = new TextServiceClient({
    authClient: new GoogleAuth().fromAPIKey(API_KEY),
});
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.get('/', (req, res) => {
    client.generateText({
        // required, which model to use to generate the result
        model: 'models/text-bison-001',
        // optional, 0.0 always uses the highest-probability result
        temperature: 0.7,
        // optional, how many candidate results to generate
        candidateCount: 1,
        // optional, number of most probable tokens to consider for generation
        top_k: 40,
        // optional, for nucleus sampling decoding strategy
        top_p: 0.95,
        // optional, maximum number of output tokens to generate
        max_output_tokens: 1024,
        // optional, sequences at which to stop model generation
        stop_sequences: [],
        // optional, safety settings
        // safety_settings: [{
        //     "category": "HARM_CATEGORY_DEROGATORY",
        //     "threshold": 1
        // }, {
        //     "category": "HARM_CATEGORY_TOXICITY",
        //     "threshold": 1
        // }, {
        //     "category": "HARM_CATEGORY_VIOLENCE",
        //     "threshold": 2
        // }, {
        //     "category": "HARM_CATEGORY_SEXUAL",
        //     "threshold": 2
        // }, {
        //     "category": "HARM_CATEGORY_MEDICAL",
        //     "threshold": 2
        // }, {
        //     "category": "HARM_CATEGORY_DANGEROUS",
        //     "threshold": 2
        // }],
        prompt: {
            text: req.query.question,
        },
    }).then(result => {
        result.forEach(function(d1) {
            if (d1 != null) {
                d1.candidates.forEach(function(d2) {
                    res.send(d2.output);
                })
            }
        })
    });
})