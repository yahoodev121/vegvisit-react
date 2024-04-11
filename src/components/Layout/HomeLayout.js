import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Layout.css';
import HomeHeader from '../Header/HomeHeader';
import Feedback from '../Feedback';
import FooterToggle from '../FooterToggle';
import Footer from '../Footer';
import cx from 'classnames';
import CookiesDisclaimer from '../CookiesDisclaimer';

class HomeLayout extends React.Component {
    static propTypes = {
        children: PropTypes.node.isRequired,
    };

    componentDidMount() {
        console.log('home-layout-component-did-mount:', window.innerWidth);
        if (window.innerWidth <= 768) {
            this.timer = setInterval(() => {
                const id = this.timer;
                // console.log('Checking tawkto widget display, timer id is ' + id);
                if (window && window.Tawk_API && window.Tawk_API.hideWidget) {
                    // console.log(`Tawkto widget is hidden: ${window.Tawk_API.isChatHidden()}`);
                    window.Tawk_API.hideWidget();
                    // console.log(`Tawkto widget is hidden after hideWidget() call: ${window.Tawk_API.isChatHidden()}`);
                    if (id && window.Tawk_API.isChatHidden()) {
                        clearInterval(id);
                        // console.log('Cleared tawkto widget display timer with id ' + id);
                        this.timer = null;
                    }
                }
            }, 500);
        }
    }

    render() {
        const {layoutType} = this.props;

        return (
            <div>
                <HomeHeader borderLess={true} layoutType={layoutType}/>
                {this.props.children}
                <Feedback/>
                <Footer/>
                <CookiesDisclaimer/>
            </div>
        );
    }
}

export default withStyles(s)(HomeLayout);
