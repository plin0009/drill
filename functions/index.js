const functions = require('firebase-functions');
const admin = require('firebase-admin');
const language = require('@google-cloud/language');
const client = new language.LanguageServiceClient();

const languageProcessing = require('./languageProcessing');

const express = require('express');
const cors = require('cors')({origin: 'https://youknowthedrill.online'});
const app = express();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

admin.initializeApp();

// auth

app.use(cors);
app.post('/new-drillcode', async (req, res) => {
    const data = {
        document: {
            type: 'PLAIN_TEXT',
            language: 'EN',
            content: req.body.text
        },
        encodingType: 'UTF-8'
    }
    try {
        const [entitiesData] = await client.analyzeEntities(data);
        const [syntaxResult] = await client.analyzeSyntax(data);
        const entities = entitiesData.map(entity => ({
            word: entity.name,
            type: entity.type
        }));
        const sentences = languageProcessing.getSentences(syntaxResult);
        questions = [];
        for (let i = 0; i < sentences.length; i++) {
            let graph = languageProcessing.createGraph(sentences[i]);
            const questionTypes = ['Subject', 'Object'];
            let sentenceQuestions = [];
            let desiredQuestion = {};
            const idealAnswerLength = 10;
            for (let q = 0; q < 3; q++) {
                let question = languageProcessing[`get${questionTypes[q]}Question`](graph, entities);
                if (question) {
                    sentenceQuestions.push(question);
                    if (!desiredQuestion || Math.abs(idealAnswerLength - desiredQuestion.answer.length) > Math.abs(idealAnswerLength - question.answer.length)) {
                        desiredQuestion = question;
                    }
                }
            }
            console.log(sentenceQuestions);
            //questions.push(sentenceQuestions[Math.floor(Math.random() * sentenceQuestions.length)]);
            questions.push(desiredQuestion)
        }
        console.log(questions);
        const newDrillcodeRef = await admin.database().ref('/drillcodes').push(); // .push() generates child with a unique key (change later)
        await newDrillcodeRef.set({
            text: req.body.text,
            questions: questions
        });
        res.json({key: newDrillcodeRef.key});
    } catch(e) {
        console.error(e);
    }
});
app.post('/start-drillcode', async (req, res) => {
    
    try {
        
    } catch(e) {
        
    }
});

exports.api = functions.https.onRequest(app);