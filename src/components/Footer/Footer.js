import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { graphql, gql, compose } from 'react-apollo';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Footer.css';
import { blogUrl } from '../../config';

import {
  Navbar,
  Nav,
  NavItem,
  NavDropdown,
  MenuItem,
  Row,
  Col,
  FormGroup,
  ControlLabel,
  Grid,
  FormControl,
  Image
} from 'react-bootstrap';
import cx from 'classnames';
import * as FontAwesome from 'react-icons/lib/fa';

// Component
import LanguageSwitcher from '../LanguageSwitcher';
import CurrencySwitcher from '../CurrencySwitcher';
import Link from '../Link';
import Andriod from './googleplay_EN.png';
import ios from './badge-example-preferred_2x.png';
import comingImage from './coming-soon.png';

// Locale
import messages from '../../locale/messages';

import getEnabledBlog from './getEnabledBlog.graphql';


class Footer extends React.Component {

  static propTypes = {
    siteName: PropTypes.string.isRequired,
    facebook: PropTypes.string,
    twitter: PropTypes.string,
    instagram: PropTypes.string,
    formatMessage: PropTypes.any,
    data: PropTypes.shape({
      loading: PropTypes.bool,
      getEnabledBlog: PropTypes.array,
    })
  };

  constructor(props) {
    super(props);
    this.state = {
      rentall: false,
      hosting: false,
      Experience: false,
    }
  }


  static getDerivedStateFromProps(props, state) {
    const { data: { getEnabledBlog } } = props;
    let rentall = false;
    let experience = false;
    getEnabledBlog && getEnabledBlog.length > 0 && getEnabledBlog.map((item, key) => {
      if (item.footerCategory == 'Vegvisits') {
        rentall = true;
      }
      if (item.footerCategory == 'Experience') {
        experience = true;
      }
      // if (item.footerCategory == 'hosting') {
      //   this.setState({ hosting: true })
      // }
    });
    return {
      rentall: rentall,
      Experience: experience
    }
  }

  render() {
    const { siteName, facebook, twitter, instagram } = this.props;
    const { data: { getEnabledBlog } } = this.props;
    const { rentall, Experience, hosting } = this.state;
    return (
      <div className={cx(s.root, 'whyHostSection')}>
        <div className={s.container}>
          <div className={cx(s.footerSectionContainer, 'hidden-print')}>
            <Grid fluid>
              <Row>
                <Col xs={12} sm={3} md={2} lg={2} className={cx(s.dropDownSection)}>
                  {/* <CurrencySwitcher />
                  <LanguageSwitcher /> */}
                </Col>

                <Col sm={3} mdOffset={1} md={2} lgOffset={1} lg={2} xs={6} className={cx(s.noPadding, s.xsLinksSectionLeft)}>
                  <label className={s.landingLabel}>{siteName}</label>
                  <ul className={s.listContainer}>
                    <li>
                      <Link to={'/about-Us'} className={s.textLink} >
                        <FormattedMessage {...messages.about} />
                      </Link>
                    </li>
                    {
                      rentall && getEnabledBlog && getEnabledBlog.length > 0 && getEnabledBlog.map((item, key) => {
                        if (item.footerCategory == 'Vegvisits') {
                          return (
                            <li key={item.id}>
                              <Link to={'/page/' + item.pageUrl} className={s.textLink} >
                                {item.pageTitle}
                              </Link>
                            </li>
                          )
                        }
                      })
                    }
                    <li>
                      <Link to={'/contact'} className={s.textLink} >
                        <FormattedMessage {...messages.contactForm} />
                      </Link>
                    </li>
                  </ul>
                </Col>
                <Col sm={3} mdOffset={1} md={2} lgOffset={1} lg={2} xs={6} className={cx(s.noPadding, s.xsLinksSectionRight)}>
                  <label className={s.landingLabel}>Experience</label>
                  <ul className={s.listContainer}>
                    <li>
                      <Link to={'/why-vegvisits'} className={s.textLink} >
                        <FormattedMessage {...messages.whyvegVisits} />
                      </Link>
                    </li> 
                    <li>
                      <Link to={'/whyhost'} className={s.textLink} >
                        <FormattedMessage {...messages.howItWorkBtnTwo} />
                      </Link>
                    </li>
                    <li>
                      <a href={blogUrl} className={s.textLink} >
                        <FormattedMessage {...messages.vegvisitsBlog} />
                      </a>
                    </li>
                    {
                      Experience && getEnabledBlog && getEnabledBlog.length > 0 && getEnabledBlog.map((item, key) => {
                        if (item.footerCategory == 'Experience') {
                          return (
                            <li key={item.id}>
                              <Link to={'/page/' + item.pageUrl} className={s.textLink} >
                                {item.pageTitle}{' '}{item.pageTitle == "Calendar Sync" && <span className={s.newIcon}>New</span>}
                              </Link>
                            </li>
                          )
                        }
                      })
                    }
                  </ul>
                </Col>
                {/* <Col sm={3} mdOffset={1} md={2} lgOffset={1} lg={2} xsHidden className={cx(s.noPadding)}>
                  <label className={s.landingLabel}>
                    <FormattedMessage {...messages.hosting} />
                  </label>
                  <ul className={s.listContainer}>
                    <li>
                      <Link to={'/hospitality'} className={s.textLink} >
                        <FormattedMessage {...messages.hospitality} />
                      </Link>
                    </li>
                    <li>
                      <Link to={'/privacy'} className={s.textLink} >
                        <FormattedMessage {...messages.termsPrivacy} />
                      </Link>
                    </li>
                  </ul>
                </Col> */}
              </Row>
              <Row className={s.copyrightSection}>
                <hr className={s.horizontalLineThrough} />

                <Col xs={6} sm={6} md={6} lg={6} className={s.noPadding}>
                  <span className={s.text}>© {new Date().getFullYear()} {siteName}</span>
                </Col>
                <Col xs={6} sm={6} md={6} lg={6} className={s.noPadding}>
                  {
                    instagram && <a href={instagram} target="_blank" className={cx(s.shareIcon, s.smallScreenShareIcon)}>
                      <FontAwesome.FaInstagram />
                    </a>
                  }
                  {
                    twitter && <a href={twitter} target="_blank" className={cx(s.shareIcon, s.smallScreenShareIcon)}>
                      <FontAwesome.FaTwitter />
                    </a>
                  }
                  {
                    facebook && <a href={facebook} target="_blank" className={cx(s.shareIcon, s.smallScreenShareIcon)}>
                      <FontAwesome.FaFacebook />
                    </a>
                  }
                </Col>
              </Row>

            </Grid>
          </div>
        </div>
      </div>

    );
  }
}


const mapState = state => ({
  siteName: state.siteSettings.data.siteName,
  facebook: state.siteSettings.data.facebookLink,
  twitter: state.siteSettings.data.twitterLink,
  instagram: state.siteSettings.data.instagramLink,
});

const mapDispatch = {
};


export default compose(
  withStyles(s),
  connect(mapState, mapDispatch),
  graphql(getEnabledBlog,
    {
      options: {
        fetchPolicy: 'network-only',
        ssr: false
      }
    }),
)(Footer);
