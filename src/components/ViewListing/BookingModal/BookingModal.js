// General
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './BookingModal.css';
import {
    Button,
    Col,
    Modal
} from 'react-bootstrap';

// Redux
import { connect } from 'react-redux';
import { closeBookingModal } from '../../../actions/BookingModal/modalActions';

// Translation
import { FormattedMessage } from 'react-intl';

import Calendar from '../Calendar';
// Locale
import messages from '../../../locale/messages';


class BookingModal extends Component {
    static propTypes = {
        closeLoginModal: PropTypes.func,
        loginModal: PropTypes.bool,
        openSignupModal: PropTypes.func,
        formatMessage: PropTypes.func,
    };

    static defaultProps = {
        loading: true
    };

    constructor(props) {
        super(props);
        this.state = {
            bookingModalStatus: false,
        };
    }

    componentDidMount() {
        const { bookingModal } = this.props;
        if (bookingModal === true) {
            this.setState({ bookingModalStatus: true });
        }
    }

    static getDerivedStateFromProps(props, state) {
        const { bookingModal } = props;
        if (bookingModal === true && !state.bookingModalStatus) {
            return { bookingModalStatus: true };
        } else if (!bookingModal && state.bookingModalStatus) {
            return { bookingModalStatus: false };
        } else {
          return null;
        }
    }

    render() {
        const { closeBookingModal } = this.props;
        const { bookingModalStatus } = this.state;
        const { id, loading, blockedDates, personCapacity } = this.props;
        const { listingData, isHost, bookingType, userBanStatus, startDate, endDate, reviewsCount, reviewsStarRating, hostDetails } = this.props;
        
        return (
            <div className={'hidden-md'}>
                <Modal show={bookingModalStatus} animation={false} onHide={closeBookingModal} dialogClassName={cx(s.logInModalContainer, 'BookingModalNew','viewListModal')} >
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Body bsClass={s.logInModalBody}>
                       <Calendar
                            id={id}
                            loading={loading}
                            blockedDates={blockedDates || undefined}
                            personCapacity={personCapacity}
                            listingData={listingData || undefined}
                            isHost={isHost}
                            bookingType={bookingType}
                            userBanStatus={userBanStatus}
                            startDate={startDate}
                            endDate={endDate}
                            reviewsCount={reviewsCount}
                            reviewsStarRating={reviewsStarRating}
                            hostDetails = {hostDetails}
                        />
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}


const mapState = state => ({
    bookingModal: state.modalStatus.bookingModal,
});

const mapDispatch = {
    closeBookingModal,
};

export default withStyles(s)(connect(mapState, mapDispatch)(BookingModal));
