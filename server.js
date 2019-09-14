const express = require('express');

const app = express();
const httpServer = require('http').Server(app);
/* const io = require('socket.io')(httpServer); */
const language = require('@google-cloud/language');
const client = new language.LanguageServiceClient();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true })) // ?

app.post('/parse-text', async (req, res) => {
    const data = {
        document: {
            type: 'PLAIN_TEXT',
            language: 'EN',
            content: req.body.text
        },
        encodingType: 'UTF-8'
    };
    const [result] = await client.analyzeSyntax(data);
    const sentences = result.sentences;
    const tokens = result.tokens;
    console.log(sentences);
    res.send(result);
});

httpServer.listen(port, () => console.log(`listening on port ${port}`));