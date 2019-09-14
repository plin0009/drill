import React from 'react';
import ReactDOM from 'react-dom';
import Layout from '../components/Layout';

ReactDOM.render(
    <Layout navbarFixed={true}>
        <section className="hero is-fullheight">
            <div className="hero-body">
                <div className="container has-text-centered">
                    <h1 className="title is-1">Simplify. Gamify.</h1>
                    <h2 className="subtitle">Turn boring textbooks into bite-sized quizzes.</h2>
                    <a href="machine.html" className="button is-dark is-large is-rounded">See for yourself</a>
                </div>
            </div>
        </section>
    </Layout>,
    document.getElementById('root')
);