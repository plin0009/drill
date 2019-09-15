import React from 'react';

class MachineInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalActive: false,
            text: ''
        }
    }
    toggleModal() {
        this.setState({
            modalActive: !this.state.modalActive
        });
    }
    handleChange(e) {
        this.setState({
            text: e.target.value
        });
    }
    feed() {
        fetch('https://us-central1-you-know-the-drill.cloudfunctions.net/api/new-drillcode', {
            method: 'POST',
            body: JSON.stringify({
                text: this.state.text
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .then(data => {
            console.log(data);
            window.location.href = '/drillcode?code=' + data.key;
        })
        .catch(error => console.error(error));
    }
    useSample(sampleNum) {
        let sample = '';
        switch (sampleNum) {
            case 1:
                sample = `Enthalpy, the heat content of a system, is a state function. For a state function, the value is independent of the path taken to reach that specific value.`;
                break;
            case 2:
                sample = `Sense perception is understanding gained through our senses. The process of perception occurs quickly and continuously with sensation and although we do not experience perception and sensation separately, it is useful to try and distinguish between them.`;
                break;
            case 3:
                sample = `Heat is defined as the transfer of energy between objects of different temperature. According to the second law of thermodynamics, heat will spontaneously flow from an object of higher temperature to an object of lower temperature. Once the two objects reach the same temperature, which is known as thermal equilibrium, no more energy will be transferred.`;
                break;
            case 4:
                sample = `The Battle of Waterloo was a battle that was fought between the French army and the British and Prussian armies. Napoleon was crowned as Emperor of France in 1804, and then launched the successful Napoleonic Wars. France soon had an empire that stretched from Spain to the Russian border. Defeated at the Battle of Leipzig and elsewhere, he accepted exile on the island of Elba in 1814. In February 1815 he again took control of the French Army. He attacked his enemies in Belgium and was defeated at Waterloo. It was the last battle of the Napoleonic Wars.`;
                break;
        
            default:
                return;
        }
        this.setState({
            text: sample
        });
    }
    render() {
        return (
            <section className="section">
                <div className="container">
                    <h1 className="title is-3">Step 1: Feed the machine</h1>
                    <div className="box">
                        <div className="columns is-centered">
                            <div className="column is-narrow has-text-centered">
                                <button className="button is-dark is-medium is-rounded" onClick={() => this.toggleModal()}>Copy and paste text</button>
                            </div>
                            <div className="column is-narrow has-text-centered">
                                <button className="button is-dark is-medium is-rounded" disabled>Scan your textbook</button>
                            </div>
                            <div className="column is-narrow has-text-centered">
                                <button className="button is-dark is-medium is-rounded" disabled>Send a recording</button>
                            </div>
                        </div>
                    </div>
                    <div className={'modal' + (this.state.modalActive ? ' is-active' : '')}>
                        <div className="modal-background" onClick={() => this.toggleModal()}></div>
                        <div className="modal-card">
                            <header className="modal-card-head">
                                <p className="modal-card-title is-size-4">Copy and paste text</p>
                            </header>
                            <section className="modal-card-body">
                                <div className="field">
                                    <div className="control">
                                        <textarea className="textarea" placeholder="Digital textbook? Wikipedia article?" onChange={e => this.handleChange(e)} value={this.state.text}></textarea>
                                    </div>
                                </div>
                                <div className="columns is-mobile">
                                    <div className="column has-text-centered">
                                        <button className="button is-small is-light" onClick={() => this.useSample(1)}>Sample 1</button>
                                    </div>
                                    <div className="column has-text-centered">
                                        <button className="button is-small is-light" onClick={() => this.useSample(2)}>Sample 2</button>
                                    </div>
                                    <div className="column has-text-centered">
                                        <button className="button is-small is-light" onClick={() => this.useSample(3)}>Sample 3</button>
                                    </div>
                                    <div className="column has-text-centered">
                                        <button className="button is-small is-light" onClick={() => this.useSample(4)}>Sample 4</button>
                                    </div>
                                </div>
                            </section>
                            <footer className="modal-card-foot">
                                <button className="button is-success" onClick={() => this.feed()}>Feed</button>
                                <button className="button" onClick={() => this.toggleModal()}>Cancel</button>
                            </footer>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default MachineInput;