import React from 'react';

class DrillcodePrompt extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            drillcode: ''
        }
    }
    handleChange(e) {
        this.setState({
            drillcode: e.target.value
        });
    }
    render() {
        return (
            <section className="section">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-narrow">
                            <div className="box has-text-centered">
                                <h1 className="title">Already have a drillcode?</h1>
                                <div className="field">
                                    <div className="control">
                                        <input type="text" className="input" placeholder="Enter it here!" value={this.state.drillcode} onChange={e => this.handleChange(e)}/>
                                    </div>
                                </div>
                                <button className="button is-medium is-rounded is-primary" onClick={() => window.location.href = '/drillcode?code=' + this.state.drillcode}>Go!</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default DrillcodePrompt;