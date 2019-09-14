import React from 'react';
import ReactDOM from 'react-dom';
import Layout from '../components/Layout';

ReactDOM.render(
    <Layout>
        <section className="hero is-fullheight">
            <div className="hero-body">
                <div className="container">
                    <h1 className="title">Tagline.</h1>
                    <button className="button is-dark is-large is-rounded">Call to Action</button>
                </div>
            </div>
        </section>
    </Layout>,
    document.getElementById('root')
);