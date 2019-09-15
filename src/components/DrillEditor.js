import React from 'react';
import * as firebase from 'firebase/app';
import 'firebase/database';

import config from '../../config.js';
import { start } from 'repl';

class DrillEditor extends React.Component {
    constructor(props) {
        super(props);
        firebase.initializeApp(config.firebase);
        this.state = {
            drillCode: '',
            drill: {},
            questionsActive: false
        };
    }
    getDrill(code) {
        let ref = firebase.database().ref(`/drillcodes/${code}`);
        ref.once('value', snapshot => {
            const val = snapshot.val();
            if (val === null) {
                window.location.href = '404';
                return;
            }
            this.setState({
                drill: snapshot.val()
            });
        });
    }
    writeDrill() {
        if (this.state.drillCode === '')    return;
        let ref = firebase.database().ref(`/drillcodes/${this.state.drillCode}`);
        ref.set(this.state.drill);
    }
    componentDidMount() {
        const code = new URLSearchParams(window.location.search).get('code');

        this.setState({
            drillCode: code
        });
        // fetch questions
        this.getDrill(code);
    }
    handleQuestionChange(questionIndex, value) {
        this.setState(state => {
            let newState = state;
            newState.drill.questions[questionIndex].question = value;
            return newState;
        })
    }
    handleWrongAnswerChange(questionIndex, wrongAnswerIndex, value) {
        this.setState(state => {
            let newState = state;
            newState.drill.questions[questionIndex].wrong[wrongAnswerIndex] = value;
            return newState;
        })
    }
    toggleQuestionsShow() {
        this.setState({
            questionsActive: !this.state.questionsActive
        });
    }
    startDrill() {
        fetch('https://us-central1-you-know-the-drill.cloudfunctions.net/api/start-drill', {
            method: 'POST',
            body: JSON.stringify({
                drillcode: this.state.drillCode
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .then(data => {
            console.log(data);
            data.key && (window.location.href = '/drill?l=' + data.key);
        })
        .catch(error => console.error(error));
    }
    render() {
        return (
            <section className="section">
                <div className="container">
                    <h1 className="title is-1">Edit Drill</h1>
                    <div className="columns">
                        <div className="column is-narrow">
                            <div className="box">
                                <h1 className="title">Drillcode</h1>
                                <h2 className="subtitle">Save the Drillcode to start the drill in the future.</h2>
                                <div className="field">
                                    <div className="control">
                                        <input type="text" id="drillcode" className="input" value={this.state.drillCode} readOnly onClick={e => {
                                            e.target.select();
                                            document.execCommand('copy');
                                        }}/>
                                    </div>
                                </div>
                                <div className="buttons are-medium">
                                    <button className="button is-rounded is-dark" onClick={() => this.startDrill()}>Run Drill</button>
                                    <button className="button is-rounded is-light" onClick={() => {
                                        document.getElementById('drillcode').select();
                                        document.execCommand('copy');
                                    }}>
                                        Save Drillcode
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="column">
                            <div className="box">
                                <h1 className="title">Original Text</h1>
                                <div className="field">
                                    <div className="control">
                                        <textarea className="textarea has-fixed-size" value={this.state.drill.text || ''}></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="box has-background-dark">
                        <div className="columns is-mobile">
                            <div className="column">
                                <h1 className="title has-text-light">Questions</h1>
                            </div>
                            <div className="column is-narrow">
                                <div className="buttons are-medium">
                                    <button className="button is-rounded is-dark" onClick={() => this.toggleQuestionsShow()}>{this.state.questionsActive ? 'Hide' : 'Show'}</button>
                                    <button className="button is-rounded is-light" onClick={() => this.writeDrill()}>Save</button>
                                </div>
                            </div>
                        </div>
                        {this.state.questionsActive && this.state.drill.questions && this.state.drill.questions.map((question, questionIndex) => (
                            <div className="box has-background-light">
                                <h2 className="subtitle" contentEditable={true} onInput={e => this.handleQuestionChange(questionIndex, e.currentTarget.textContent)}>{question.question}</h2>
                                <div className="columns">
                                    <div className="column">
                                        <div className="field">
                                            <div className="control">
                                                <input type="text" className="input is-primary" value={question.answer}/>
                                            </div>
                                        </div>
                                    </div>
                                    {question.wrong.map((wrongAnswer, wrongAnswerIndex) => (
                                        <div className="column">
                                            <div className="field">
                                                <div className="control">
                                                    <input type="text" className="input is-danger" onChange={e => this.handleWrongAnswerChange(questionIndex, wrongAnswerIndex, e.target.value)} value={wrongAnswer}/>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        
                    </div>
                </div>
            </section>
        );
    }
}

export default DrillEditor;