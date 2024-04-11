// General
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './CookiesDisclaimer.css';

// UI Components
import {
  Button,
  Modal } from 'react-bootstrap';
import * as SwitchButton from 'react-switch';

// Translation
import { injectIntl, FormattedMessage } from 'react-intl';

// Locale
import messages from '../../locale/messages';



class CookiesDisclaimerModal extends Component {
  static propTypes = {
    closeCookiesDisclaimerModal: PropTypes.any,
  };

  constructor (props) {
    super(props);

    this.handleNonNecessaryCookiesSwitch = this.handleNonNecessaryCookiesSwitch.bind(this);
    this.handleSave = this.handleSave.bind(this);

    this.state = {
      nonNecessaryCookiesEnabled: false,
      show: false
    }
  }

  componentDidMount() {
    const { show } = this.props;
    if (show === true){
      this.setState({ show: true });
    } else {
      this.setState({ show: false})
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { show } = props;

    if (show === true && !state.show) {
      return { show: true };
    } else if (!show && state.show) {
      return { show: false };
    } else {
      return null;
    }
  }

  handleNonNecessaryCookiesSwitch() {
    this.setState({ nonNecessaryCookiesEnabled: !this.state.nonNecessaryCookiesEnabled})
  }

  handleNecessaryCookiesSwitch() {

  }

  handleSave() {
    const { handleClose } = this.props;
    const { nonNecessaryCookiesEnabled } = this.state;
    handleClose(nonNecessaryCookiesEnabled);
  }

  render() {
    const { show, nonNecessaryCookiesEnabled } = this.state;

    return (
      <div>
        <Modal show={show} onHide={this.handleSave} >
          <Modal.Header>
            <Modal.Title><FormattedMessage {...messages.cookieSettings} /></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className={cx(s.displayTable, s.displayTableSection)}>
              <div className={s.displayRow}>
                <div className={cx(s.displayTableCell, s.displayText, s.labelText)}>
                  <FormattedMessage {...messages.nonNecessaryCookies} />
                </div>               <div className={cx(s.displayBtn, s.displayTableSection)}>
                  <SwitchButton
                    id="non-necessary-cookies-switch"
                    checked={nonNecessaryCookiesEnabled}
                    onChange={this.handleNonNecessaryCookiesSwitch}
                  />
                </div>
              </div>
              <div className={s.displayRow}>
                <div className={cx(s.displayTableCell, s.displayText, s.labelText)}>
                  <FormattedMessage {...messages.necessaryCookies} />
                </div>
                <div className={cx(s.displayBtn, s.displayTableSection)}>
                  <SwitchButton
                    id="necessary-cookies-switch"
                    checked={true}
                    disabled={true}
                    onChange={this.handleNecessaryCookiesSwitch}
                  />
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button className={s.button} onClick={this.handleSave}><FormattedMessage {...messages.saveAndAccept} /></Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default injectIntl(withStyles(s)(CookiesDisclaimerModal));
