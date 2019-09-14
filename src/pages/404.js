import React from 'react';
import ReactDOM from 'react-dom';
import Layout from '../components/Layout';

ReactDOM.render(
    <Layout>
        <section className="hero is-fullheight">
            <div className="hero-body">
                <div className="container">
                    <h1 className="title">Dead End</h1>
                    <h2 className="subtitle">Can't find what you're looking for.</h2>
                </div>
            </div>
        </section>
    </Layout>,
    document.getElementById('root'));