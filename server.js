const express = require('express');

const app = express();
const httpServer = require('http').Server(app);
const cors = require('cors');
/* const io = require('socket.io')(httpServer); */
const language = require('@google-cloud/language');
const client = new language.LanguageServiceClient();
const languageProcessing = require('./languageProcessing');

const port = process.env.PORT || 3000;

/* const entities1 = require('./testfiles/entities1.json');
const syntax1 = require('./testfiles/syntax1.json');
const entities2 = require('./testfiles/entities2.json');
const syntax2 = require('./testfiles/syntax2.json');
const entities3 = require('./testfiles/entities3.json');
const syntax3 = require('./testfiles/syntax3.json'); */


app.use(express.json());
app.use(cors());

app.post('/parse-text', async (req, res) => {
    const data = {
        document: {
            type: 'PLAIN_TEXT',
            language: 'EN',
            content: req.body.text
        },
        encodingType: 'UTF-8'
    };
    const [syntaxResult] = await client.analyzeSyntax(data);
    //const [entitiesResult] = await client.analyzeEntities(data);
    /* testing files *
    const entitiesResult = entities3;
    const syntaxResult = syntax3; //*/
    const sentences = languageProcessing.getSentences(syntaxResult);

    questions = [];
    for (let i = 0; i < sentences.length; i++) {
        let graph = languageProcessing.createGraph(sentences[i]);
        questions.push(languageProcessing.getSubjectQuestion(graph), languageProcessing.getObjectQuestion(graph));
    }    
    
    console.log(questions);

    //res.send({/* entities: entitiesResult,  */syntax: syntaxResult});
    res.send({
        questions: questions
    });
});

httpServer.listen(port, () => console.log(`listening on port ${port}`));