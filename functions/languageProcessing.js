const getSentences = (syntaxResult) => {
    const resultSentences = syntaxResult.sentences;
    const resultTokens = syntaxResult.tokens;

    let t = 0;
    let sentences = [];
    for (let s = 0; s < resultSentences.length; s++) {
        const condensedSentence = resultSentences[s].text.content.split(' ').join('');
        const startOfSentence = t;
        let condensedTokens = '';
        let sentenceTokens = [];
        while (condensedTokens !== condensedSentence) {
            condensedTokens += resultTokens[t].text.content;
            sentenceTokens.push(resultTokens[t]);
            t++;
        }
        sentences.push({
            start: startOfSentence,
            sentence: resultSentences[s].text.content,
            tokens: sentenceTokens
        });
    }
    return sentences;
}
const createGraph = (sentence) => {
    let graph = {
        length: sentence.tokens.length
    };
    sentence.tokens.map((token, index) => {
        graph[index] = {
            word: token.text.content,
            lemma: token.lemma,
            label: token.dependencyEdge.label,
            partOfSpeech: token.partOfSpeech.tag,
            leftChildren: [],
            rightChildren: []
        };
        index !== token.dependencyEdge.headTokenIndex - sentence.start && (graph[index].parent = {
            index: token.dependencyEdge.headTokenIndex - sentence.start,
            link: token.dependencyEdge.label
        });   // has a parent that's not itself
        token.partOfSpeech.tense !== 'TENSE_UNKNOWN' && (graph[index].tense = token.partOfSpeech.tense);
    });
    for (let i = 0; i < graph.length; i++) {  // children
        let token = graph[i];
        token.parent !== undefined && graph[token.parent.index][(i < token.parent.index ? 'left' : 'right') + 'Children'].push({
            index: i,
            link: token.parent.link
        });   // has a child that's not itself
    }
    return graph;
}
const getChildren = (graph, index) => {
    let nodes = [];
    for (let i = 0; i < graph[index].leftChildren.length; i++) {
        nodes.push(...getChildren(graph, graph[index].leftChildren[i].index));
    }
    nodes.push(index);
    for (let i = 0; i < graph[index].rightChildren.length; i++) {
        nodes.push(...getChildren(graph, graph[index].rightChildren[i].index));
    }
    return nodes;
}
const indicesToWords = (graph, indexArray, replacer) => {
    return indexArray.map(index => {
        if (index === -1) {
            return 'what'; // replace with a who what etc
        }
        return graph[index].word;
    });
}

const getSubjectQuestion = (graph) => {
    let subj = [];
    let notSubj = [];
    let subjIndex = 0;
    for (let i = 0; i < graph.length; i++) {  // find subject
        let token = graph[i];
        if (token.parent && (token.parent.link === 'NSUBJ' || token.parent.link === 'NSUBJPASS')) {
            console.log(`${token.word} is subject, getting children`);
            if (token.partOfSpeech === 'PRON')  continue;
            subj = getChildren(graph, i);
            subjIndex = i;
            break;
        }
    }
    if (subj === [])    return false;
    for (let j = 0; j < graph.length; j++) {
        if (j === subjIndex) notSubj.push(-1);
        if (subj.indexOf(j) === -1) notSubj.push(j);
    }
    const answerList = indicesToWords(graph, subj);
    return {
        question: questionify(indicesToWords(graph, notSubj)), // or who, etc
        answer: answerify(answerList),
        wrong: getWrongAnswers(answerList, entities, 3)
    }
}
const getObjectQuestion = (graph) => {
    let obj = [];
    let notObj = [];
    let objIndex = 0;
    for (let i = 0; i < graph.length; i++) {  // find object
        let token = graph[i];
        if (token.parent && (token.parent.link === 'DOBJ' || token.parent.link === 'POBJ')) {
            console.log(`${token.word} is object, getting children`);
            if (token.partOfSpeech === 'PRON')  continue;
            obj = getChildren(graph, i);
            objIndex = i;
            break;
        }
    }
    if (obj === [])     return false;
    for (let j = 0; j < graph.length; j++) {
        if (j === objIndex) notObj.push(-1);
        if (obj.indexOf(j) === -1) notObj.push(j);
    }
    const answerList = indicesToWords(graph, obj);
    return {
        question: questionify(indicesToWords(graph, notObj)), // or other forms of "be"
        answer: answerify(answerList),
        wrong: getWrongAnswers(answerList, entities, 3)
    }
}
const getTrueOrFalse = (graph) => {
    let statement = [];
    for (let i = 0; i < graph.length; i++) {
        if (!graph[i].parent) {
            statement = getChildren(graph, i);
        }
    }
    return {
        question: answerify(indicesToWords(graph, statement)),
        answer: 'True.',
        wrong: ["False."]
    }
}
const getWrongAnswers = (right, entities, length=3) => {
    let wrong = [];
    for (let i = 0; i < entities.length; i++) {
        if (entities[i].word !== right) {
            wrong.push(entities[i].word);
            if (wrong.length > length * 2) {
                break;
            }
        }
    }
    while (wrong.length > length) {
        wrong.splice(Math.floor(Math.random() * wrong.length), 1);
    }
    return wrong;
}

const questionify = (words) => { // [What, is, Heat, is, defined, as, .]  ->  What is heat defined as?
    // lowercase all words except for proper nouns
    // question mark
    words.pop();    // remove ending punctuation
    question = words.join(' ') + '?';
    question = question.charAt(0).toUpperCase() + question.slice(1);
    return question;
}
const answerify = (words) => { // [the, transfer, of, energy, between, objects, of, different, temperature]  -> The transfer of energy between objects of different temperature.
    // uppercase first letter
    // period
    answer = words.join(' ') + '.';
    answer = answer.charAt(0).toUpperCase() + answer.slice(1);
    return answer;
}

module.exports = {
    getSentences: getSentences,
    createGraph: createGraph,
    getChildren: getChildren,
    indicesToWords: indicesToWords,
    getSubjectQuestion: getSubjectQuestion,
    getObjectQuestion: getObjectQuestion,
    getTrueOrFalse: getTrueOrFalse,
    questionify: questionify,
    answerify: answerify
}