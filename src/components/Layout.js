import React from 'react';
import '../assets/styles/styles.scss';
import Logo from '../assets/images/logo.svg';
class Layout extends React.Component {
    render() {
        return (
            <>
                <nav className={'navbar is-spaced' + (this.props.navbarFixed ? ' is-fixed-top' : '')}>
                    <div className="navbar-brand">
                        <a href="/" className="navbar-item">
                            <img className="logo" src={Logo} alt="drill logo"/>
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