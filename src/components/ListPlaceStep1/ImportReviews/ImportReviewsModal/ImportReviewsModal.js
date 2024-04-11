// General
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './ImportReviewsModal.css';
import {
  Button,
  Form,
  FormGroup,
  Col,
  FormControl,
  Checkbox,
  Modal } from 'react-bootstrap';

// Redux
import { connect } from 'react-redux';
import { closeImportReviewsModal } from '../../../../actions/ImportReviews/modalActions';


// Translation
import { defineMessages, FormattedMessage } from 'react-intl';

// Locale
import messages from '../../../../locale/messages';

// Component
import ImportReviewsForm from '../ImportReviewsForm/ImportReviewsForm';



class ImportReviewsModal extends Component {
  static propTypes = {
    closeImportReviewsModal: PropTypes.any,
    importReviewsModal: PropTypes.bool,
    actionType: PropTypes.string.isRequired,
    listId: PropTypes.number.isRequired,
    importUrl: PropTypes.string,

  };

  constructor (props) {
    super(props);
    this.state = {
      importReviewsModalStatus: false
    }
  }

  componentDidMount() {
    const { importReviewsModal } = this.props;
    if (importReviewsModal === true){
      this.setState({ importReviewsModalStatus: true });
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { importReviewsModal } = props;

    if (importReviewsModal === true && !state.importReviewsModalStatus) {
      return { importReviewsModalStatus: true };
    } else if (!importReviewsModal && state.importReviewsModalStatus) {
      return { importReviewsModalStatus: false };
    } else {
      return null;
    }
  }

  render() {
    const { closeImportReviewsModal, actionType, listId, importUrl } = this.props;
    const { importReviewsModalStatus } = this.state;

    return (
      <div>
        <Modal show={importReviewsModalStatus} onHide={closeImportReviewsModal} dialogClassName={cx(s.logInModalContainer, 'loginModal', 'wishListCloseBtn')} >
          <Modal.Header closeButton>
          </Modal.Header>
          <Modal.Body bsClass={s.logInModalBody}>
          
            <div className={s.root}>
            <h4 className={s.titleBold}>
              {
                actionType === 'add' && <FormattedMessage {...messages.importReviews} />
              }
              {
                actionType === 'update' && <FormattedMessage {...messages.reimportReviews} />
              }
            </h4>
              <div className={cx(s.container, s.containerPadding)}>
                { 
                  <ImportReviewsForm listId={listId} importUrl={importUrl} actionType={actionType}/>
                }
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    )
  }
}


const mapState = (state) => ({
  importReviewsModal: state.modalStatus.importReviewsModalOpen,
});

const mapDispatch = {
  closeImportReviewsModal,
};

export default withStyles(s)(connect(mapState, mapDispatch)(ImportReviewsModal));
