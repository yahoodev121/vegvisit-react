// General
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cookie from 'react-cookies';

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './GetEmailsModal.css';
import {
  Button,
  Col,
  Checkbox,
  Modal,
  Image,
  Carousel,
} from 'react-bootstrap';

// Redux
import { connect } from 'react-redux';
import { closeGetEmailsModal } from '../../actions/modalActions';

// Component
import pic1 from './1.png';
import pic2 from './2.png';
import pic3 from './3.png';

// Translation
import { FormattedMessage } from 'react-intl';

// Locale
import messages from '../../locale/messages';


class GetEmailsModal extends Component {
  static propTypes = {
    closeGetEmailsModal: PropTypes.func,
    modal: PropTypes.bool,
    formatMessage: PropTypes.func,
  };

  static EMAILS_COOKIE_NAME = 'noEmailsModal';

  constructor(props) {
    super(props);

    const { modal } = this.props;
    if (modal === true) {
      this.state = {
        modalStatus: true,
        dontShowAgain: false
      };
    } else {
      this.state = {
        modalStatus: false,
        dontShowAgain: false
      };
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleExit = this.handleExit.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    const { modal } = props;
    if (modal === true && modal !== state.modalStatus) {
      return { modalStatus: true };
    } else if (modal === false && modal !== state.modalStatus) {
      return { modalStatus: false };
    } else {
      return null;
    }
  }

  handleChange(evt) {
    this.setState({ dontShowAgain: evt.target.checked });
  }

  handleExit(evt) {
    const { closeGetEmailsModal } = this.props;
    if (this.state.dontShowAgain) {
      const maxAge = 365 * 24 * 3600;
      cookie.save(GetEmailsModal.EMAILS_COOKIE_NAME, 1, {
        path: '/',
        maxAge
      });
    }
    closeGetEmailsModal();
  }

  render() {
    const { modalStatus } = this.state;

    return (
      <div>
        <Modal show={modalStatus} animation={true} onHide={this.handleExit} size="lg" centered dialogClassName={cx(s.modalContainer, 'getEmailsModal')} >
          <Modal.Body bsClass={s.modalBody}>
            <div className={s.root}>
              <div className={s.container}>
                <Carousel className={s.getEmailCarousel}>
                  <Carousel.Item>
                    <Image src={pic1} className={s.img} />
                  </Carousel.Item>
                  <Carousel.Item>
                    <Image src={pic2} fluid className={s.img} />
                  </Carousel.Item>
                  <Carousel.Item>
                    <Image src={pic3} fluid className={s.img} />
                  </Carousel.Item>
                </Carousel>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className={s.modalFooter}>
            <Col xs={12} sm={7} md={7} lg={7} className={cx(s.noPadding, s.textAlignLeft)}>
            <Checkbox
              checked={this.state.dontShowAgain}
              onChange={this.handleChange} >
                <FormattedMessage {...messages.dontShowAgain} />
            </Checkbox>
            </Col>
            <Col xs={12} sm={5} md={5} lg={5} className={cx(s.noPadding, s.textAlignRight)}>
              <Button className={cx(s.button, s.btnPrimary, s.btnSmall)} bsSize="small" onClick={this.handleExit}>
                <FormattedMessage {...messages.close} />
              </Button>
            </Col>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

const mapState = state => ({
  modal: state.modalStatus.isGetEmailsModalOpen,
});

const mapDispatch = {
  closeGetEmailsModal,
};

export default withStyles(s)(connect(mapState, mapDispatch)(GetEmailsModal));
