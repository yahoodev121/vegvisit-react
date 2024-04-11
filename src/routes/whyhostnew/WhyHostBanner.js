import React, { Component } from 'react';
import Image from './whyhostbanner.jpg';
import SecondImage from './whyhostbanner.jpg';
// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './WhyHostBanner.css';
import {
    Button,
    Grid,
    Row,
    Col,
    Form,
    FormGroup,
    FormControl,
    ControlLabel,
} from 'react-bootstrap';
import cx from 'classnames';


// Translation
import { FormattedMessage, injectIntl } from 'react-intl';

// Locale
import messages from '../../locale/messages';

// History
import history from '../../core/history';


// Internal Components
// // import Link from '../../../Link';
// import Link from '../../../components/Link';

import WhyBlock from '../../components/WhyHost/WhyBlock';

// ES6 Imports
import Scroll from 'react-scroll'; // Imports all Mixins
import { scroller } from 'react-scroll'; //Imports scroller mixin, can use as scroller.scrollTo()


// Or Access Link,Element,etc as follows
let Link = Scroll.Link;
let Element = Scroll.Element;
let Events = Scroll.Events;
let scroll = Scroll.animateScroll;
let scrollSpy = Scroll.scrollSpy;



class WhyHostBanner extends Component {
    handleClick() {
        history.push('/become-a-host?mode=new');
    }

    render() {
        return (
            <div>
                <div className={s.TopBannerHeader} style={{ backgroundImage: `url(${Image})` }} >

                    <div className={cx(s.bannerText, s.mainSection)}>
                        <div className={s.BannerSection}>
                            <h1 className={cx(s.bannerTitle, s.alignCenter)}>
                                <FormattedMessage {...messages.howItWorkBtnTwo} />
                            </h1>
                            <div className={s.contentSection}>
                                <p className={s.bannerDescriptionText}>
                                    <FormattedMessage {...messages.becomeAHostDescription} />
                                </p>
                            </div>
                            <div className={s.alignCenter}>
                                <Button
                                    className={cx(s.button, s.linkButton)}
                                    onClick={this.handleClick}
                                >
                                    <FormattedMessage {...messages.listYourSpace} />
                                </Button>
                                {/* <Link 
                                className={cx(s.button, s.btnPrimaryBorder, s.linkButton, s.btnRight)} 
                                activeClass={s.active} 
                                to="test1" 
                                spy={true} 
                                smooth={true}
                            >
                                <FormattedMessage {...messages.learnMore} />
                            </Link> */}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default withStyles(s)(WhyHostBanner);