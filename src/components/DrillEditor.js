import React from 'react';
import * as firebase from 'firebase/app';
import 'firebase/database';

import config from '../../config.js';

class DrillEditor extends React.Component {
    constructor(props) {
        super(props);
        firebase.initializeApp(config.firebase);
        this.state = {
            drillCode: '',
            drill: {}
        };
    }
    getDrill(code) {
        let ref = firebase.database().ref(`/drillcodes/${code}`);
        console.log(ref);
        ref.on('value', snapshot => {
            this.setState({
                drill: snapshot.val()
            });
        });
    }
    writeDrill() {
        let ref = firebase.database().ref(`/drillcodes/${code}`);
        ref.set();
    }
    componentDidMount() {
        const code = new URLSearchParams(window.location.search).get('code');

        this.setState({
            drillCode: code
        });
        // fetch questions
        this.getDrill(code);
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
                                        <input type="text" className="input" value={this.state.drillCode} readOnly/>
                                    </div>
                                </div>
                                <div className="buttons are-medium">
                                    <button className="button is-rounded is-dark">Start Drill</button>
                                    <button className="button is-rounded is-light">Save Drillcode</button>
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
                        <h1 className="title has-text-light">Questions</h1>
                        {this.state.drill.questions && this.state.drill.questions.map(question => (
                            <div className="box has-background-light">
                                <h2 className="subtitle">{question.question}</h2>
                                <div className="columns">
                                    <div className="column">
                                        <div className="field">
                                            <div className="control">
                                                <input type="text" className="input is-primary" value={question.answer}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="column">
                                        <div className="field">
                                            <div className="control">
                                                <input type="text" className="input is-danger" value="Wrong answer number 1."/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="column">
                                        <div className="field">
                                            <div className="control">
                                                <input type="text" className="input is-danger" value="Wrong answer number 2."/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="column">
                                        <div className="field">
                                            <div className="control">
                                                <input type="text" className="input is-danger" value="Wrong answer number 3."/>
                                            </div>
                                        </div>
                                    </div>
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