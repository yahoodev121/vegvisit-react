import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment-timezone';
import { FormattedMessage, injectIntl } from 'react-intl';

// Redux
import { connect } from 'react-redux';

import {
    Button,
    Col,
    Panel
} from 'react-bootstrap';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../ViewMessage.css';

import { bookingProcess } from '../../../actions/booking/bookingProcess';

// Locale
import messages from '../../../locale/messages';

// Component
import CountDown from '../../CountDown';
import Link from '../../Link';
import fetch from '../../../core/fetch';
import { toastr } from 'react-redux-toastr';
import Loader from '../../Loader';
import { hostname } from 'os';

class GuestActions extends Component {
    static propTypes = {
        actionType: PropTypes.string.isRequired,
        messageType: PropTypes.string.isRequired,
        hostDisplayName: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
        startDate: PropTypes.string.isRequired,
        endDate: PropTypes.string.isRequired,
        personCapacity: PropTypes.number.isRequired,
        listId: PropTypes.number.isRequired,
        reservationId: PropTypes.number,
        formatMessage: PropTypes.any,
        guestId: PropTypes.any,
        hostId: PropTypes.any,
        paymentState: PropTypes.string,
        reservationState: PropTypes.string,
        total: PropTypes.number,
        city: PropTypes.string,
        state: PropTypes.string,
        country: PropTypes.string,
        timeZone: PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.preBook = this.preBook.bind(this);
        this.state = {
            bookLoading: false,
            isExpired: false
        };
    }

    async preBook() {
        const { bookingProcess, listId, startDate, endDate, timeZone, personCapacity, listPublishStatus, guestId, hostId, messageType, reservationId } = this.props;
        const { paymentState, reservationState, total } = this.props
        this.setState({ bookLoading: true });
        const preApprove = true;
        let query = `query checkReservation ($checkIn: String!,$checkOut: String!,$listId: Int! ){
            checkReservation(checkIn: $checkIn, checkOut:$checkOut, listId:$listId ){
              id
              listId
              hostId
              guestId
              checkIn
              checkOut
              status
            }
          }`;

        const startingDate = moment(startDate).tz(timeZone);
        const endingDate = moment(endDate).tz(timeZone);

        const params = {
            listId: listId,
            checkIn: startingDate,
            checkOut: endingDate,
        };

        const resp = await fetch('/graphql', {
            method: 'post',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables: params,
            }),
            credentials: 'include',
        });

        const { data } = await resp.json();
        if (data && data.checkReservation) {
            if (data.checkReservation.status == "200") {
                if (listPublishStatus) {

                    let query1 = `query checkRequestBooking ($checkIn: String,$checkOut: String,$listId: Int,$hostId:String,$guestId:String){
                        checkRequestBooking(checkIn: $checkIn, checkOut:$checkOut, listId:$listId,hostId:$hostId,guestId:$guestId ){
                          count
                          status
                        }
                      }`;

                    const params = {
                        listId: listId,
                        checkIn: startingDate,
                        checkOut: endingDate,
                        hostId,
                        guestId
                    };

                    const resp = await fetch('/graphql', {
                        method: 'post',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            query: query1,
                            variables: params,
                        }),
                        credentials: 'include',
                    });

                    const { data } = await resp.json();
                    if (data && data.checkRequestBooking) {
                        if (data.checkRequestBooking.status == "200") {
                            // if (data.checkRequestBooking.count >= 1) {
                            //     bookingProcess(listId, personCapacity, startDate, endDate, true, '', '', '', messageType)
                            // }
                            // else {
                            //     bookingProcess(listId, personCapacity, startDate, endDate, false, '', '', '', messageType)
                            // }

                            if (messageType == 'inquiry') {
                                bookingProcess(listId, personCapacity, startDate, endDate, true, '', '', '', messageType, reservationId)
                            } else {
                                bookingProcess(listId, personCapacity, startDate, endDate, true, '', '', '', messageType, reservationId)
                            }
                            setTimeout(() => { this.setState({ bookLoading: false }) }, 1000)

                        }
                        else {
                            toastr.error("Booking Failed", "The dates are not available!");
                            this.setState({ bookLoading: false });
                        }
                    }

                } else {
                    toastr.error("Sorry!", "The listing had unpublished or deleted by Host/Admin. Please try another.");
                    this.setState({ bookLoading: false });
                }
            }
            else {
                this.setState({ bookLoading: false, isExpired: true });
            }
        }
        else {
            this.setState({ bookLoading: false });
        }
    }

    // Inquiry
    inquiry(hostDisplayName) {
        const { listId, messageType } = this.props;
        return (
            <Panel className={cx(s.space5, s.contextPadding)}>
                {
                    messageType != 'inquiry' && <h4><strong><FormattedMessage {...messages.inboxMessage} />  </strong></h4>
                }
                {
                    messageType == 'inquiry' && <h4><strong><FormattedMessage {...messages.messageAction1} /> {hostDisplayName} <FormattedMessage {...messages.messageAction2} /></strong></h4>
                }
                {
                    messageType != 'inquiry' && <span><p className={s.spaceTop2}>
                        {hostDisplayName} <FormattedMessage {...messages.inboxMessage1} />
                      </p>
                      <p>
                          <FormattedMessage {...messages.inboxMessageRequestSentAdditionalInfo1} />
                      </p>
                      <p>
                      <FormattedMessage {...messages.inboxMessageRequestSentAdditionalInfo2}
                        values={{link:
                          <Link to={"/user/edit"}>
                            <FormattedMessage {...messages.inboxMessageRequestSentAdditionalInfo3} />
                          </Link>
                        }}
                      />
                      </p>
                    </span>
                }
                {
                    messageType == 'inquiry' && <span>
                      <p className={s.spaceTop2}>
                          <FormattedMessage {...messages.messageActionInfo} />
                      </p>
                      <p className={s.spaceTop2}>
                          <FormattedMessage {...messages.messageActionInfo2} />
                      </p>
                      <p className={s.spaceTop2}>
                        <FormattedMessage {...messages.messageActionInfo3} values={{profile: <Link to={"/user/edit"} className={cx()}><FormattedMessage {...messages.profileWord} /></Link>}}/>
                      </p>
                    </span>
                }
                {/* <Col xs={12} sm={12} md={12} lg={12} className={cx(s.spaceTop2, s.noPadding)}>
                    <Link to={"/rooms/" + listId} className={cx(s.linkBtn, s.btnPrimary)}><FormattedMessage {...messages.RequestToBook} /></Link>
                </Col> */}
            </Panel>
        );
    }

    // Request to book
    requestToBook(hostDisplayName) {
        const { reservationId, messageType, total } = this.props;
        if (messageType == 'requestToBook' && total == 0) {
            return (
                <Panel className={cx(s.space5, s.contextPadding)}>
                    <h4><strong><FormattedMessage {...messages.inboxMessage} /></strong></h4>
                    <p className={s.spaceTop2}>
                        {/* <FormattedMessage {...messages.cancelInfo} /> */}
                        {hostDisplayName} <FormattedMessage {...messages.inboxMessageRequestFreeListingSentAdditionalInfo1} />
                    </p>
                    <p>
                      <FormattedMessage {...messages.inboxMessageRequestSentAdditionalInfo2}
                        values={{link:
                          <Link to={"/user/edit"}>
                            <FormattedMessage {...messages.inboxMessageRequestSentAdditionalInfo3} />
                          </Link>
                        }}
                      />
                    </p>
                </Panel>
            );
        } else {
            return (
                <Panel className={cx(s.space5, s.contextPadding)}>
                    <h4><strong><FormattedMessage {...messages.messageAction3} /> {hostDisplayName} <FormattedMessage {...messages.messageAction4} /></strong></h4>
                    <p className={s.spaceTop2}>
                        {/* <FormattedMessage {...messages.cancelInfo} /> */}
                        <FormattedMessage {...messages.cancelInfoBooking} />
                    </p>
                    {/* <Col xs={12} sm={12} md={12} lg={12} className={cx(s.spaceTop2, s.noPadding)}>
	                <Link to={"/cancel/" + reservationId + "/guest" } className={cx(s.linkBtn, s.btnPrimary)}>
                        <FormattedMessage {...messages.cancelReservation} />
                    </Link>
	            </Col> */}
                </Panel>
            );
        }
    }

    // Request to book/ Inquiry declined
    declined(hostDisplayName) {
        const { city, state, country } = this.props;
        return (
            <Panel className={cx(s.space5, s.contextPadding)}>
                <h4><strong><FormattedMessage {...messages.guestDeclinedInfo} /></strong></h4>
                {/* <p className={s.spaceTop2}>
                <FormattedMessage {...messages.guestDeclinedInfo} />
                </p> */}
                <p className={s.spaceTop2}>
                  <FormattedMessage {...messages.guestDeclinedInfo1} />{' '} {hostDisplayName}{' '}<FormattedMessage {...messages.guestDeclinedInfo2} />
                </p>
                <p className={cx(s.spaceTop4, s.space4)}>
                  <Link to={`/s?&address=${city},${state}`} className={cx(s.linkBtn, s.btnPrimary)}><FormattedMessage {...messages.guestDeclinedInfoButton} /></Link>
                </p>
                <p>
                  <FormattedMessage {...messages.guestDeclinedInfo3}
                    values={{link:
                      <Link to={"/user/edit"}>
                        <FormattedMessage {...messages.inboxMessageRequestSentAdditionalInfo3} />
                      </Link>
                    }}
                  />
                </p>
            </Panel>
        );
    }

    // Request to book / Pre-approved by host
    approved() {
        const { createdAt, actionType, hostDisplayName, messageType, listId } = this.props;
        const { bookLoading } = this.state;
        const { formatMessage } = this.props.intl;

        let startDate = moment();
        let next24Hours = moment(createdAt).add(23, 'hours').add(59, 'minutes');
        let distance = Number(next24Hours - startDate);
        let options = { endDate: next24Hours };
        if (distance < 0) {
            return this.expired();
        } else {
            return (
                <Panel className={cx(s.space5, s.contextPadding)}>
                    {
                        actionType === 'preApproved' ? <h4><strong>{messageType === 'inquiry' ? <FormattedMessage {...messages.inquiryApprovedAction1}/> : <span>{hostDisplayName} <FormattedMessage {...messages.requestApprovedAction2}/></span>}</strong></h4>
                            : <h4><strong><FormattedMessage {...messages.requestApprovedAction1} /> {hostDisplayName} <FormattedMessage {...messages.forThisListing} /></strong></h4>
                    }

                    <p className={s.spaceTop2}>
                        {messageType === 'inquiry' ?
                          <FormattedMessage {...messages.inquiryTimeInfo1} values={{host: hostDisplayName}}/> : 
                          <FormattedMessage {...messages.requestTimeInfo1} />
                        }
                    </p>
                    <p>
                      {messageType === 'inquiry' ?
                        <FormattedMessage {...messages.inquiryTimeInfo2} values={{countdown: <CountDown options={options} />}}/> :
                        <span><FormattedMessage {...messages.requestTimeInfo2} /> <CountDown options={options} /></span> 
                      }
                    </p>
                    <Col xs={12} sm={12} md={12} lg={12} className={cx(s.spaceTop2, s.noPadding)}>
                        {!bookLoading && <Button className={s.btnPrimary} onClick={() => this.preBook()} disabled={this.state.isExpired}>
                            <FormattedMessage {...messages.finishBooking} />
                        </Button>
                        }
                        {bookLoading && <Loader
                            type={"button"}
                            buttonType={"submit"}
                            className={cx(s.btnPrimary)}
                            show={bookLoading}
                            label={formatMessage(messages.finishBooking)}
                        />}
                        {this.state.isExpired && <div className={s.errorMessage}> <FormattedMessage {...messages.bookingPeriodExpired} /><a href={'/book/' + listId}> <FormattedMessage {...messages.bookingPeriodExpired2} /></a></div>}
                    </Col>
                </Panel>
            );
        }
    }

    // Booking confirmed by host/ instant booking
    bookingConfirmed() {
        const { reservationId, hostDisplayName } = this.props;
        return (
            <Panel className={cx(s.space5, s.contextPadding)}>
                {/* <h4>
                    <strong><FormattedMessage {...messages.bookingConfirmedInfo1} /> {hostDisplayName} <FormattedMessage {...messages.messageAction4} />
                    </strong>
                </h4> */}
                <h4><strong><FormattedMessage {...messages.bookingIsConfirmed} /></strong></h4>
                <p className={s.spaceTop2}>
                    <FormattedMessage {...messages.bookingCanceledInfo} />
                </p>
                <p className={s.spaceTop2}>
                    <FormattedMessage {...messages.bookingCanceledInfo1} /> {hostDisplayName} <FormattedMessage {...messages.bookingCanceledInfo2}
                        values={{yourTripsLink:
                        <Link to={"/trips/current"}>
                          <FormattedMessage {...messages.yourTrips} />
                        </Link>
                      }}
                    />
                </p>
                <Col xs={12} sm={12} md={12} lg={12} className={cx(s.spaceTop2, s.noPadding)}>
                    <Link to={"/cancel/" + reservationId + "/guest"} className={cx(s.linkBtn, s.btnPrimary)}>
                        <FormattedMessage {...messages.cancelReservation} />
                    </Link>
                </Col>
            </Panel>
        );
    }

    // Pre-approved or approved by host is expired
    expired() {
        const { listId, hostDisplayName, paymentState, messageType, actionType } = this.props;
        if (paymentState === 'expired' || actionType === 'preApproved') { // preApproved in case we are coming from approved(), i.e. payment expired but db not yet updated by cron job
            return (
                <Panel className={cx(s.space5, s.contextPadding)}>
                    <h4><strong><FormattedMessage {...messages.bookingExpiredTitle1} /></strong></h4>
                    <p className={s.spaceTop2}>
                        <FormattedMessage {...messages.bookingExpiredInfo2} 
                          values={{host: hostDisplayName}}
                        />
                    </p>

                    <Col xs={12} sm={12} md={12} lg={12} className={cx(s.spaceTop2, s.noPadding)}>
                        <Link to={"/rooms/" + listId} className={cx(s.linkBtn, s.btnPrimary)}>
                            <FormattedMessage {...messages.gotoListing} />
                        </Link>
                    </Col>
                </Panel>
            );
        }
        else if (messageType === 'inquiry') {
            return (
                <Panel className={cx(s.space5, s.contextPadding)}>
                    <h4><strong><FormattedMessage {...messages.invitationExpiredTitle} /></strong></h4>
                    <p className={s.spaceTop2}>
                        <FormattedMessage {...messages.invitationExpiredInfo} />
                    </p>

                    <Col xs={12} sm={12} md={12} lg={12} className={cx(s.spaceTop2, s.noPadding)}>
                        <Link to={"/rooms/" + listId} className={cx(s.linkBtn, s.btnPrimary)}>
                            <FormattedMessage {...messages.gotoListing} />
                        </Link>
                    </Col>
                </Panel>
            );
        }
        else {
          return (
              <Panel className={cx(s.space5, s.contextPadding)}>
                  <h4><strong><FormattedMessage {...messages.bookingExpiredTitle} /></strong></h4>
                  <p className={s.spaceTop2}>
                      <FormattedMessage {...messages.bookingExpiredInfo} /> {hostDisplayName} <FormattedMessage {...messages.bookingExpiredInfo0} /> {hostDisplayName} <FormattedMessage {...messages.bookingExpiredInfo1} />
                  </p>

                  <Col xs={12} sm={12} md={12} lg={12} className={cx(s.spaceTop2, s.noPadding)}>
                      <Link to={"/rooms/" + listId} className={cx(s.linkBtn, s.btnPrimary)}>
                          <FormattedMessage {...messages.gotoListing} />
                      </Link>
                  </Col>
              </Panel>
          );
      }
    }

    // Booking is cancelled by host
    cancelled() {
        return (
            <Panel className={cx(s.space5, s.contextPadding)}>
                <h4><strong><FormattedMessage {...messages.bookingRequestCancel1} /></strong></h4>
                <p className={s.spaceTop2}>
                    <FormattedMessage {...messages.bookingRequestCancel2} />
                </p>
            </Panel>
        );
    }

    cancelledguest() {
        return (
            <Panel className={cx(s.space5, s.contextPadding)}>
                <h4><strong><FormattedMessage {...messages.bookingRequestCancel1} /></strong></h4>
                {/* <p className={s.spaceTop2}>
                    <FormattedMessage {...messages.bookingRequestCancel4} />
                </p> */}
            </Panel>
        );
    }

    completed() {
        const { reservationId, hostDisplayName } = this.props;
        return (
            <Panel className={cx(s.space5, s.contextPadding)}>
                <h4><strong>Sadly, the trip is over - but we hope it was great!</strong></h4>
                <p className={s.spaceTop2}>
                    If you haven’t already left a review of your experience staying at {hostDisplayName}'s accommodation, please leave one here:
                </p>
                <Col xs={12} sm={12} md={12} lg={12} className={cx(s.spaceTop2, s.noPadding)}>
                    <Link to={"/review/write/" + reservationId} className={cx(s.linkBtn, s.btnPrimary)}>
                        <FormattedMessage {...messages.submitYourReview} />
                    </Link>
                </Col>
            </Panel>
        );
    }

    render() {
        const { actionType, hostDisplayName, guestId, hostId, reservationId } = this.props;
        const { bookLoading } = this.state;
        const { formatMessage } = this.props.intl;

        if (actionType === 'inquiry') {
            return this.inquiry(hostDisplayName);
        } else if (actionType === 'preApproved') {
            return this.approved(hostDisplayName);
        } else if (actionType === 'declined') {
            return this.declined(hostDisplayName);
        } else if (actionType === 'intantBooking' || actionType === 'approved') {
            return this.bookingConfirmed(hostDisplayName);
        } else if (actionType === 'requestToBook') {
            return this.requestToBook(hostDisplayName);
        } else if (actionType === 'expired') {
            return this.expired();
        } else if (actionType === 'paymentExpire') {
            return this.expired();
        } else if (actionType === 'cancelledByHost') {
            return this.cancelled();
        }
        else if (actionType === 'cancelledByGuest') {
            return this.cancelledguest();
        }
        else if (actionType === 'completed') {
            return this.completed();
        }
    }
}

const mapState = (state) => ({
});

const mapDispatch = {
    bookingProcess,
};

// export default withStyles(s)(connect(mapState, mapDispatch)(GuestActions));
export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(GuestActions)));
