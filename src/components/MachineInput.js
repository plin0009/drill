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
        fetch('localhost:3000/parse-text', {
            method: 'POST',
            body: JSON.stringify({
                text: this.state.text
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));
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