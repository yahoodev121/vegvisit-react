// General
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './SocialShareModal.css';
import * as FontAwesome from 'react-icons/lib/fa';
import {
  Button,
  Form,
  Row,
  FormGroup,
  Col,
  ControlLabel,
  FormControl,
  FieldGroup,
  Checkbox,
  Modal,
  Dropdown,
  DropdownButton,
  MenuItem,
  ListGroup,
  ListGroupItem,
  Image
} from 'react-bootstrap';

// Redux
import { connect } from 'react-redux';
import { openSocialShareModal, closeSocialShareModal } from '../../../actions/modalActions';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Link from '../../Link';

// Translation
import { FormattedMessage, injectIntl } from 'react-intl';

// Locale
import messages from '../../../locale/messages';
import SocialShare from '../SocialShare';
import { url } from '../../../config';
import {
  FacebookShareButton,
  GooglePlusShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  GooglePlusIcon,
  LinkedinIcon,
  EmailIcon,
} from 'react-share';
import history from '../../../core/history';
class SocialShareModal extends Component {
  static propTypes = {
    closeSocialShareModal: PropTypes.func,
    socialshareModal: PropTypes.bool,
    openSocialShareModal: PropTypes.func,
    formatMessage: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      socialshareModalStatus: false,
      isFormOpen: false,
      value: 'Copy Link',
      copied: false,
    };
    this.openForm = this.openForm.bind(this);
    this.copyText = this.copyText.bind(this);
  }

  openForm() {
    this.setState({ isFormOpen: true });
  }

  componentDidMount() {
    const { socialshareModal } = this.props;
    if (socialshareModal === true) {
      this.setState({ socialshareModalStatus: true });
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { socialshareModal } = props;
    if (socialshareModal === true && !state.socialshareModalStatus) {
      return { socialshareModalStatus: true };
    } else if (!socialshareModal && state.socialshareModalStatus) {
      return { socialshareModalStatus: false };
    } else {
      return null;
    }
  }

  async copyText() {
    const { formatMessage } = this.props.intl;

    this.setState({
      value: formatMessage(messages.shareListingCopied),
      copied: true
    })

    setTimeout(() => {
      this.setState({
        value: formatMessage(messages.shareListingCopy),
        copied: false
      })
    }, 2000)
  }

  render() {
    const { formatMessage } = this.props.intl;
    const { closeSocialShareModal, openSocialShareModal, listId, title, city, state, country } = this.props;
    const { socialshareModalStatus, isFormOpen } = this.state;
    // let location = history.location ? history.location.pathname : null;
    // var locationPath = location ? location.replace('/preview',''): null;
    // const shareUrl = url + locationPath;
    const shareUrl = url + '/rooms/' + listId;
    let previewText = formatMessage(messages.shareListingEmailSubject);
    let bodyText = formatMessage(messages.shareListingEmailBody); // + ' ' + shareUrl;
    let bodyTextNoEmoji = formatMessage(messages.shareListingBody);


    return (
      <div>
        <Modal show={socialshareModalStatus} animation={false} onHide={closeSocialShareModal} dialogClassName={cx(s.signupModalContainer, 'signupModal', 'sharesocialModal')} >
          <Modal.Header closeButton className={cx(s.marginBottom24, 'customClosebutton', s.marginleftM5)}>

            {/* <Modal.Title><FormattedMessage {...messages.signup} /></Modal.Title> */}
          </Modal.Header>
          <Modal.Body bsClass={s.signupModalBody}>
            <div className={s.paddingbottom24}>
              <div className={s.share}>
                <FormattedMessage {...messages.shareListingHeader}/>
              </div>
              <div className={s.content}>
                {formatMessage(messages.shareListingNote)}{': '}
                {title} in {city}, {state}, {country}
              </div>
            </div>
            <ListGroup className={'sharingsocial'}>
              <ListGroupItem tag="a" href={shareUrl} className={s.borderradiusNone}>
                {/* <FontAwesome.FaFacebook className={s.socialIcons} /> */}
                <FacebookShareButton
                  url={shareUrl}
                  quote={bodyTextNoEmoji}
                // className={s.displayIcon}
                >
                  <FontAwesome.FaFacebook className={s.socialIcons} />

                  Facebook
                </FacebookShareButton>
                {/* Facebook */}
              </ListGroupItem>
              <ListGroupItem tag="a" href={shareUrl}>
                {/* <FontAwesome.FaTwitter className={s.socialIcons} /> */}
                <TwitterShareButton
                  url={shareUrl}
                  title={bodyText}
                  className={s.displayIcon}>
                  <FontAwesome.FaTwitter className={s.socialIcons} />
                  Twitter
                </TwitterShareButton>
                {/* Twitter */}
              </ListGroupItem>
              <ListGroupItem tag="a" href={shareUrl}>
                {/* <FontAwesome.FaEnvelope className={s.socialIcons} /> */}
                <EmailShareButton
                  url={shareUrl}
                  subject={previewText}
                  body={bodyText}
                  className={s.displayIcon}>
                  <FontAwesome.FaEnvelope className={s.socialIcons} />
                  Email
              </EmailShareButton>
                {/* Email */}
              </ListGroupItem>
              {/* <ListGroupItem tag="a" href={shareUrl}>
                <FacebookShareButton
                  url={shareUrl}
                >
                  <FontAwesome.FaFacebookOfficial className={s.socialIcons} />
                  Messenger
                </FacebookShareButton>

              </ListGroupItem> */}
              <ListGroupItem tag="a" href='#'>
                {/* <FontAwesome.FaCopy className={s.socialIcons} /> */}
                <CopyToClipboard
                  text={shareUrl}
                  onCopy={() => this.copyText()}
                // onCopy={() => this.setState({
                //   value: 'Copied',
                //   copied: true 
                // })}
                >
                  <span>
                    <FontAwesome.FaCopy className={s.socialIcons} />
                    {this.state.value}</span>
                </CopyToClipboard>
              </ListGroupItem>
              {/* <ListGroupItem tag="a" href="#" className={s.borderradiusNone}>
                <FontAwesome.FaFileCodeO className={s.socialIcons} />
                Embeded
              </ListGroupItem> */}
            </ListGroup>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}


const mapState = state => ({
  socialshareModal: state.modalStatus.isSocialShareModal,
});

const mapDispatch = {
  closeSocialShareModal,
  openSocialShareModal,
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(SocialShareModal)));
