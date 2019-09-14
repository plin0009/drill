import React from 'react';
import ReactDOM from 'react-dom';
import Layout from '../components/Layout';

ReactDOM.render(
    <Layout navbarFixed={true}>
        <section className="hero is-fullheight">
            <div className="hero-body">
                <div className="container has-text-centered">
                    <h1 className="title is-1">Dead End</h1>
                    <h2 className="subtitle">Can't find what you're looking for.</h2>
                </div>
            </div>
        </section>
    </Layout>,
    document.getElementById('root'));