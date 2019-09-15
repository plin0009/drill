import React from 'react';
import * as firebase from 'firebase/app';
import 'firebase/database';

import config from '../../config.js';

class DrillGame extends React.Component {
    constructor(props) {
        super(props);
        firebase.initializeApp(config.firebase);
        this.state = {
            c:'',
            drillData: {},
            drillInfo: {},
            choices: []
        };
    }
    componentDidMount() {
        const c = new URLSearchParams(window.location.search).get('l');
        this.getDrillInfo(c);

    }
    getDrillInfo(c) {
        console.log(c);
        let drillInfoRef = firebase.database().ref(`/drills/${c}`);
        drillInfoRef.on('value', drillInfoSnapshot => {
            const drillInfoVal = drillInfoSnapshot.val();
            console.log(drillInfoVal);
            if (drillInfoVal === null) {
                window.location.href = '404';
                return;
            }
            let newState = this.state;
            newState.c = c;
            newState.drillInfo = drillInfoVal;
            if (!newState.drillData.questions) {
                console.log('first time!');
                let drillData = firebase.database().ref(`/drillcodes/${newState.drillInfo.drillcode}`);
                drillData.once('value', drillDataSnapshot => {
                    const drillDataVal = drillDataSnapshot.val();
                    console.log(drillDataVal);
                    if (drillDataVal === null) {
                        window.location.href = '404';
                        return;
                    }
                    newState.drillData = drillDataVal;
                    console.log(newState);
                    this.setState(state => newState, () => this.createChoices());
                });
            } else {
                console.log('not first time');
                this.setState(state => newState, () => this.createChoices());
            }
        });
    }
    writeDrillInfo(newData) {
        let ref = firebase.database().ref(`/drills/${this.state.c}`);
        ref.set(newData);
    }
    createChoices() {
        if (this.state.drillInfo.index < 0) return this.setState({choices: ['Go back']});
        let currentQuestion = this.state.drillData.questions[this.state.drillInfo.index];
        let choices = currentQuestion.wrong.concat([currentQuestion.answer]);
        let shuffle = [];
        while (choices.length) {
            let random = Math.floor(Math.random() * choices.length);
            shuffle.push(...choices.splice(random, 1));
        }
        this.setState({choices: shuffle});
        return true;
    }
    answer(choice, e) {
        if (this.state.drillInfo.index === -1) {
            window.location.href = '/drillcode?code=' + this.state.drillInfo.drillcode;
            return;
        }
        if (choice !== this.state.drillData.questions[this.state.drillInfo.index].answer) {
            console.log('wrong answer');
            console.log(`${choice}, ${this.state.drillData.questions[this.state.drillInfo.index].answer}`)
            e.target.className += ' is-danger';
            return;
        }
        if (this.state.drillInfo.index + 1 >= this.state.drillData.questions.length) {
            this.writeDrillInfo({
                completed:  this.state.drillInfo.completed + this.state.drillData.questions[this.state.drillInfo.index].sentence,
                drillcode: this.state.drillInfo.drillcode,
                index: -1
            });
            return;
        }
        this.writeDrillInfo({
            completed:  this.state.drillInfo.completed + ' ' + this.state.drillData.questions[this.state.drillInfo.index].sentence,
            drillcode: this.state.drillInfo.drillcode,
            index: this.state.drillInfo.index + 1
        });
    }
    render() {
        return (
            <section className="hero is-medium">
                {(this.state.drillData.questions && this.state.drillInfo.drillcode) && (<>
                        <div className="hero-body">
                            <div className="container has-text-centered">
                                {this.state.drillInfo.completed !== '' && (<div className="box">
                                    <p className="subtitle">{this.state.drillInfo.completed}</p>
                                </div>)}
                                <h1 className="title is-1">
                                    {this.state.drillInfo.index >= 0 ? this.state.drillData.questions[this.state.drillInfo.index].question : 'Drill complete!'}
                                </h1>
                            </div>
                        </div>
                        <div className="hero-foot">
                            <div className="container">
                                <div className="columns is-centered">
                                    {(this.state.choices.length || this.createChoices()) && this.state.choices.map(choice => (
                                        <div className="column is-narrow has-text-centered">
                                            <button key={this.state.drillInfo.index + choice} className="button is-size-3 is-rounded is-dark" onClick={e => this.answer(choice, e)}>{choice}</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>)
                }
            </section>
        );
    }
}

export default DrillGame;