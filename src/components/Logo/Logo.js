import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Link from '../Link';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Logo.css';
import cx from 'classnames';
import history from '../../core/history';
import whitelogo from './White.png';
import colorlogo from './Colour.png';

class Logo extends Component {
    static propTypes = {
        siteName: PropTypes.string.isRequired,
        logoImage: PropTypes.string,
        link: PropTypes.string,
        className: PropTypes.string,
        logoHeight: PropTypes.string,
        logoWidth: PropTypes.string,
    };

    static defaultProps = {
        siteName: null,
        logoImage: null,
        link: '/',
        logoHeight: '34',
        logoWidth: '34'
    }

    render() {
        const { siteName, logoImage, link, className, logoHeight, logoWidth, searchType } = this.props;

        let defaultLogoHeight = logoHeight && logoHeight != null ? logoHeight : '63';
        let defaultLogoWidth = logoWidth && logoWidth != null ? logoWidth : '250';
        let location = history.location ? history.location.pathname : null;
        if (history.location) {
            location = history.location.pathname;
        }
   
        return (
            <Link to={link} className={className}>
                {
                    logoImage != null && (location === '/' || location === '/whyhost' || (location === '/s' && searchType === 'retreats')) &&

                    <img src={whitelogo} className={s.whitelogo} />

                }
                {
                    logoImage != null && (location !== '/' && location !== '/whyhost' && !(location === '/s' && searchType === 'retreats')) && location &&

                    <img src={colorlogo} height={defaultLogoHeight} width={defaultLogoWidth} />


                }
                {
                    logoImage === null && siteName != null && <span className={cx(s.logoColor, 'logoWhite')}>{siteName}</span>
                }
                {
                    logoImage === null && siteName === null && <span className={s.logoColor}>Site Name</span>
                }
            </Link>
        );
    }
}

const mapState = (state) => ({
    siteName: state.siteSettings.data.siteName,
    logoImage: state.siteSettings.data.Logo,
    logoHeight: state.siteSettings.data.logoHeight,
    logoWidth: state.siteSettings.data.logoWidth,
});

const mapDispatch = {};

export default withStyles(s)(connect(mapState, mapDispatch)(Logo));
