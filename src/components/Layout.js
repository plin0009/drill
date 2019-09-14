import React from 'react';
import '../styles/styles.scss';
class Layout extends React.Component {
    render() {
        return (
            <>
                <nav className="navbar is-fixed-top is-spaced">
                    <div className="navbar-brand">
                        <a href="/" className="navbar-item">
                            <h1 className="title">drill</h1>
                        </a>
                    </div>
                </nav>
                {this.props.children}
                <section className="footer">
                    <div className="container"></div>
                </section>
            </>
        );
    }
}

export default Layout;