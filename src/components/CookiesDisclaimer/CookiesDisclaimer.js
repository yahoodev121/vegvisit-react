// General
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cookie from 'react-cookies'
import { FormattedMessage, injectIntl } from 'react-intl';

// Bootstrap
import {
  Button,
  Grid,
} from 'react-bootstrap';

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './CookiesDisclaimer.css';

// Locale
import messages from '../../locale/messages';
import { url, sitename } from '../../config';
import CookiesDisclaimerModal from './CookiesDisclaimerModal';
import { initGA } from '../../helpers/gaHelper';

class CookiesDisclaimer extends Component {

  static propTypes = {
    formatMessage: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.mainCookieName = 'cookiesDisclaimerVegvisits';
    this.nonNecessaryCookieName = 'allowNonNecessaryCookies';

    this.state = {
      isCookiesSet: false,
      isPageLoad: false,
      showCookieSettings: false,
    }
    this.acceptAll = this.acceptAll.bind(this);
    this.setCookies = this.setCookies.bind(this);
    this.showCookieSettings = this.showCookieSettings.bind(this);
    this.handleCookieSettingsClose = this.handleCookieSettingsClose.bind(this);
    this.handleAcceptNonNecessaryCookies = this.handleAcceptNonNecessaryCookies.bind(this);
  }

  componentDidMount() {
    let cookiesValue = cookie.load(this.mainCookieName);
    this.setState({
      isCookiesSet: (cookiesValue) ? true : false,
      isPageLoad: true
    });
    let nonNecessaryCookiesValue = cookie.load(this.nonNecessaryCookieName);
    if (nonNecessaryCookiesValue === 'true') {
      this.handleAcceptNonNecessaryCookies();
    }
  }

  acceptAll() {
    this.setCookies(true);
    this.handleAcceptNonNecessaryCookies();
  }

  setCookies(allowNonNecessaryCookies) {
    let maxAge = 3600 * 24 * 30;
    cookie.save(this.mainCookieName, 'VegvisitsDisclaimer', {
      path: '/',
      maxAge,
      secure: true
    });
    cookie.save(this.nonNecessaryCookieName, allowNonNecessaryCookies, {
      path: '/',
      maxAge,
      secure: true
    });

    this.setState({ isCookiesSet: true })
  }

  showCookieSettings() {
    this.setState({ showCookieSettings: true });
  }

  handleCookieSettingsClose(nonNecessaryCookiesEnabled) {
    this.setCookies(nonNecessaryCookiesEnabled);
    if (nonNecessaryCookiesEnabled) {
      this.handleAcceptNonNecessaryCookies();
    }
    this.setState({ 
      showCookieSettings: false
    });
  }

  handleAcceptNonNecessaryCookies() {
    initGA();
  }

  render() {
    const { formatMessage } = this.props.intl;
    const { isCookiesSet, isPageLoad, showCookieSettings: showCookieSettings } = this.state;
    if (isCookiesSet) {
      return <span />;
    } else {
      return (
        <span>
          <CookiesDisclaimerModal show={showCookieSettings} handleClose={this.handleCookieSettingsClose} />
          <Grid fluid>
            {
              isPageLoad && <div
                className={cx(s.root, s.container, s.fixedPosition)}
              >
                <div className={cx(s.cookiesBackground)}>
                  <div>
                    <div className={cx(s.displayTable, s.displayTableSection)}>
                      <div className={s.displayRow}>
                        <div className={s.displayText}>
                          <span className={cx(s.labelText)}>
                            {sitename}{' '}
                            {formatMessage(messages.cookiesDisclaimer)}
                            {' '}
                            <a
                              href={url + '/page/privacy/'}
                              className={cx(s.labelText, s.linkStyle)}
                            >
                              {formatMessage(messages.cookiePolicy)}
                            </a>
                          </span>
                        </div>

                        <div className={cx(s.displayBtn)}>
                          <Button
                            type="button"
                            className={cx(s.button, s.btnlarge, s.shiftLeftForTawkToIfSmall)}
                            onClick={this.showCookieSettings}
                          >
                            {formatMessage(messages.cookieSettings)}
                          </Button>
                        </div>
                        <div className={cx(s.displayBtn)}>
                          <Button
                            type="button"
                            className={cx(s.button, s.btnlarge, s.shiftLeftForTawkTo)}
                            onClick={this.acceptAll}
                          >
                            {formatMessage(messages.acceptAll)}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            }
          </Grid>
        </span>
      )
    }
  }
}

export default injectIntl(withStyles(s)(CookiesDisclaimer));


