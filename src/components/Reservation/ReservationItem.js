import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment-timezone';
import { FormattedMessage } from 'react-intl';

// Redux
import { connect } from 'react-redux';

import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Reservation.css';
import {
  Label
} from 'react-bootstrap';

// Component
import Link from '../Link';
import Avatar from '../Avatar';
import CurrencyConverter from '../CurrencyConverter';

// Redux action
import { sendMessageAction } from '../../actions/message/sendMessageAction';

import { sendEmail } from '../../core/email/sendEmail';

// Locale
import messages from '../../locale/messages';

class ReservationItem extends Component {
  static propTypes = {
    noList: PropTypes.bool,
    userType: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    threadId: PropTypes.number.isRequired,
    reservationId: PropTypes.number.isRequired,
    reservationState: PropTypes.string.isRequired,
    checkIn: PropTypes.string.isRequired,
    checkOut: PropTypes.string.isRequired,
    guests: PropTypes.number.isRequired,
    listId: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    street: PropTypes.string.isRequired,
    buildingName: PropTypes.string,
    city: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    zipcode: PropTypes.string.isRequired,
    timeZone: PropTypes.string.isRequired,
    profileId: PropTypes.number.isRequired,
    displayName: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
    picture: PropTypes.string,
    guestServiceFee: PropTypes.number.isRequired,
    hostServiceFee: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    currency: PropTypes.string.isRequired,
    sendMessageAction: PropTypes.any.isRequired,
    phoneNumber: PropTypes.string,
    email: PropTypes.string,
    formatMessage: PropTypes.any,
    basePrice: PropTypes.number.isRequired,
  };

  static defaultProps = {
    noList: false,
    checkIn: null,
    checkOut: null
  };

  async sendMessage(status) {
    const { sendMessageAction, threadId, userType, checkIn, checkOut, guests, reservationId, title, paymentState, email, allowedCheckInTime, allowedCheckOutTime } = this.props;

    const { hostDisplayName, guestDisplayName, guestEmail, guestLocation, hostLocation } = this.props;
    const { hostProfilePic, hostJoinedDate, city, state, country, street, buildingName, zipcode, timeZone, confirmationCode, guestProfilePic } = this.props;
    const { hostContactNumber, guestContactNumber, hostEmail } = this.props;

    let typeValue = (paymentState && paymentState == 'pending' && status == 'approved') ? 'preApproved' : status
    sendMessageAction(
      threadId,
      userType,
      null,
      typeValue,
      checkIn,
      checkOut,
      guests,
      reservationId,
      hostDisplayName,
      guestDisplayName,
      null,
      guestEmail,
      checkIn,
      hostLocation,
      hostProfilePic,
      hostJoinedDate,
      'requestToBook',
      title,
      checkOut,
      city,
      state,
      country,
      timeZone,
      email
    );


    if (typeValue == 'approved') {
      let content1 = {
        listTitle: title,
        reservationId,
        threadId,
        confirmationCode,
        guestName: guestDisplayName,
        guestLocation,
        guestProfilePic,
        checkIn,
        checkOut,
        guests,
        allowedCheckInTime,
        allowedCheckOutTime,
        hostContactNumber,
        guestContactNumber,
        hostName: hostDisplayName,
        hostJoinedDate,
        hostLocation,
        guestEmail,
        hostProfilePic,
        hostEmail,
        listCity: city,
        listState: state,
        listCountry: country,
        listStreet: street,
        listBuildingName: buildingName,
        listZipcode: zipcode,
        listTimeZone: timeZone,
      }

      await sendEmail(guestEmail, 'bookingConfirmedToGuest', content1);
      await sendEmail(hostEmail, 'bookingConfirmedToHost', content1);
    }


  }

  reservationStyle() {
    const { reservationState, paymentState, userType, cancelledType, total, basePrice } = this.props;
    let reservationStateValue;
    let style, label;
    let approveMessage, approveColor;
    let cancelMessage;


    if (userType === 'host' && paymentState == 'pending' && reservationState == 'approved') {
      approveMessage = <FormattedMessage {...messages.messageStatus15} />
      approveColor = 'black'
    } else {
      approveMessage = <FormattedMessage {...messages.messageStatus16} />
      approveColor = 'warning'
    }
    reservationStateValue = (paymentState == 'pending' && reservationState == 'approved' && approveMessage) ? 'requestAccepted' : reservationState;

    reservationStateValue = (paymentState == 'expired' && reservationState == 'approved') ? 'expired' : 'approved';

    if (paymentState == 'pending' && reservationState == 'pending') {
      reservationStateValue = 'pending';
    } else if (paymentState == 'pending' && reservationState == 'approved') {
      reservationStateValue = 'requestAccepted';
    } else if (paymentState == 'pending' && reservationState == 'declined') {
      reservationStateValue = 'declined';
    } else if (paymentState == 'pending' && reservationState == 'expired') {
      reservationStateValue = 'expired';
    } else if (paymentState == 'completed' && reservationState == 'approved') {
      reservationStateValue = 'approved';
    } else if (paymentState == 'pending' && reservationState == 'approved') {
      reservationStateValue = 'expired';
    } else if (paymentState == 'completed' && reservationState == 'completed') {
      reservationStateValue = 'completed';
    } else if (paymentState == 'completed' && reservationState == 'cancelled' && cancelledType === 'host') {
      reservationStateValue = 'cancelled';
      cancelMessage = <FormattedMessage {...messages.messageStatus6} />
    } else if (paymentState == 'completed' && reservationState == 'cancelled' && cancelledType === 'guest') {
      reservationStateValue = 'cancelled';
      cancelMessage = <FormattedMessage {...messages.messageStatus7} />
    } else if (paymentState == 'completed' && reservationState == 'pending') {
      reservationStateValue = 'pending';
    } else if (paymentState == 'completed' && reservationState == 'declined') {
      reservationStateValue = 'declined';
    } else if (paymentState == 'expired' && reservationState == 'approved') {
      reservationStateValue = 'paymentExpired';
    } else if (paymentState == 'completed' && reservationState == 'expired') {
      reservationStateValue = 'expired';
    }

    switch (reservationStateValue) {
      case 'pending':
        label = <FormattedMessage {...messages.messageStatus12} />
        style = 'primary';
        break;
      case 'expired':
        label = <FormattedMessage {...messages.messageStatus9} />
        style = 'danger';
        break;
      case 'approved':
        label = <FormattedMessage {...messages.messageStatus4} />
        style = 'success';
        break;
      case 'declined':
        label = <FormattedMessage {...messages.messageStatus3} />
        style = 'danger';
        break;
      case 'completed':
        label = <FormattedMessage {...messages.inboxCompleted} />
        style = 'success';
        break;
      case 'cancelled':
        label = cancelMessage;
        style = 'danger';
        break;
      case 'requestAccepted':
        label = approveMessage
        style = approveColor;
        break;
      case 'paymentExpired':
        label = <FormattedMessage {...messages.messageStatus9} />
        style = 'danger';
        break;
    }
    return <Label className={s.labelText} bsStyle={style}>{label}</Label>;
  }

  render() {
    const { threadId, userType, type, reservationId, reservationState, checkIn, checkOut, createdAt } = this.props;
    const { listId, title, street, city, state, country, zipcode, timeZone } = this.props;
    const { profileId, displayName, fullName, picture, phoneNumber, email } = this.props;
    const { guestServiceFee, hostServiceFee, total, currency } = this.props;
    const { noList, paymentState, confirmationCode, approveColor } = this.props;
    const { usersFirstName, basePrice } = this.props;
    let isValue;

    if (reservationState == 'completed' || reservationState == 'approved') {
      isValue = '#5cb85c'
    } else if (reservationState == 'expired') {
      isValue = '#d9534f'
    } else if (reservationState == 'pending') {
      isValue = '#007bff'
    } else if (reservationState == 'declined' || reservationState == 'cancelled') {
      isValue = '#d9534f'
    }
    if (reservationState == 'approved' && paymentState == 'pending' && userType == 'host') {
      isValue = '#3B858A'
    }
    if (reservationState == 'approved' && paymentState == 'pending' && userType == 'guest') {
      isValue = '#f0ad4e'
    }
    if (paymentState == 'expired') {
      isValue = '#f0ad4e'
    }
    if (reservationState == 'expired' && paymentState == 'completed') {
      isValue = '#f0ad4e'
    }
    if (reservationState == 'approved' && paymentState == 'expired') {
      isValue = '#d9534f';
    }

    let checkInDate = (checkIn && timeZone) ? moment(checkIn).tz(timeZone).format('Do MMM - ') : '';
    let checkOutDate = (checkOut && timeZone) ? moment(checkOut).tz(timeZone).format('Do MMM, YYYY') : '';
    let createdDate = createdAt ? moment(createdAt).format('Do MMM, YYYY') : '';
    let subTotal = 0;
    let enableCancel = false, enableIternary = false;
    if (reservationState === 'approved' && paymentState == 'completed') {
      enableCancel = true;
      enableIternary = true;
    }

    if (userType === 'host') {
      if (total > 0) {
        subTotal = total - hostServiceFee;
      } else {
        subTotal = 0
      }
      // subTotal = total - hostServiceFee;
    } else {
      subTotal = total + guestServiceFee
    }

    let userValue = false;
    if (userType === 'guest' && paymentState == 'pending' && reservationState != 'expired' && reservationState != 'declined' && reservationState != 'pending') {
      userValue = true
    }

    return (
      <div className={s.positionRelative}>
        <div className={s.displayTable}>
          <div className={s.displayTableRow}>
            <div className={cx(s.displayTableCell, s.borderLine, s.dateSectionWidth, s.dateSection)}>
              <div className={cx('hidden-xs hidden-sm')}>
                <p className={cx(s.noMargin, s.dateFontNew, s.dateFontMargin, s.fontWeight)}>{createdDate}</p>
              </div>
            </div>
            <div className={s.circle} style={{ borderColor: isValue }}>
            </div>
            <div className={cx(s.positionRelative, s.spaceTop3)}>
              <div className={cx(s.displayTableCell, s.mainSection, s.space2, s.afterSection)}>
                <div className={s.displayTable}>
                  <div className={s.displayTableRow}>
                    <div className={cx(s.sectionTitleLight, s.displayTableCell, s.addressWidth, s.responsiveDisplay, s.tabScreenresolution)}>
                      {
                        !noList && <div>
                          <a href={"/rooms/" + listId} target={'_blank'} className={s.linkTitle}> {title} </a><br />
                        </div>
                      }
                      <span>{checkInDate}{checkOutDate}</span><br />
                      {
                        noList && userType === 'guest' && <span className={s.errorMessage}> <FormattedMessage {...messages.notexist} /> </span>
                      }
                      {
                        noList && userType === 'host' && <span className={s.errorMessage}> <FormattedMessage {...messages.notexist} /> </span>
                      }

                      {
                        !noList && <div>
                          <span>{city}, {state} {zipcode} </span>
                        </div>
                      }
                     
                      <p className={cx(s.sectionTitleLight, s.spaceTop1)}>
                        {this.reservationStyle()}
                      </p>
                    </div>
                    <div className={cx(s.displayTableCell, s.logoWidth, s.alignCenter, s.responsiveDisplay, s.responsiveAvatarSection, s.tabAvatarSection)}>
                      <div className={cx(s.mediaContainer, s.mediaWidth, s.responsiveAvatarImg)}>
                        <Avatar
                          source={picture}
                          height={50}
                          width={50}
                          title={reservationState == 'approved' ? fullName : displayName}
                          className={cx(s.profileAvatar, s.profileAvatarLink)}
                          withLink={noList ? false : true}
                          profileId={profileId}
                        />
                      </div>
                      {!noList && <Link to={"/users/show/" + profileId} className={s.sectionTitleLight}>
                        {
                          /* (reservationState == 'approved' || reservationState == 'completed' ) && paymentState == 'completed' ? fullName : usersFirstName */
                          usersFirstName
                        }
                      </Link>}
                      <span className={s.sectionTitleLight}>
                        {noList && userType === 'guest' && <FormattedMessage {...messages.noHostProfile}/>}
                        {noList && userType === 'host' && <FormattedMessage {...messages.noGuestProfile}/>}
                      </span>
                      <br />

                      {
                        paymentState == 'completed' && basePrice == 0 && reservationState == 'pending' && <ul className={s.listLayout}>
                          {/* <li>{phoneNumber}</li>
                          <li className={s.textWordBreak}>{email}</li> */}
                        </ul>
                      }

                      {
                        type === 'current' && paymentState == 'completed' && (reservationState == 'approved' || reservationState == 'completed' ) && <ul className={s.listLayout}>
                          <li>{phoneNumber}</li>
                          <li className={s.textWordBreak}>{email}</li>
                        </ul>
                      }

                    </div>
                    <div className={cx(s.displayTableCell, s.responsiveDisplay, s.tabPriceSection)}>
                      <p className={cx(s.space1, s.fontWeight, s.dateFont)}>
                        {
                          paymentState == 'completed' && <CurrencyConverter
                            amount={subTotal}
                            className={s.bookItPrice}
                            from={currency}
                            noConversion={true}
                          />
                        }

                      </p>
                      <ul className={s.listLayout}>

                        {
                          !noList && !userValue && threadId && <li><Link to={"/message/" + threadId + "/" + userType}> <FormattedMessage {...messages.messageHistroy} /></Link></li>
                        }

                        {
                          !noList && userValue && threadId && <li><Link to={"/message/" + threadId + "/" + userType}> <FormattedMessage {...messages.continueToCheckOut} /></Link></li>
                        }

                        {
                          noList && <li><Link to={"/contact"}><FormattedMessage {...messages.contactSupport} /></Link></li>
                        }

                        {
                          !noList && userType === 'guest' && enableIternary && (paymentState == 'completed' && reservationState == 'approved') && <li><Link to={"/users/trips/itinerary/" + reservationId}> <FormattedMessage {...messages.viewItinerary} /></Link></li>
                        }
                        {
                          !noList && threadId && userType === 'guest' && (paymentState == 'completed' && (reservationState == 'approved' || reservationState == 'cancelled' || reservationState == 'completed')) && <li><Link to={"/users/trips/receipt/" + reservationId}><FormattedMessage {...messages.viewReceipt} /></Link></li>
                        }
                        {
                          !noList && threadId && userType === 'host' && paymentState == 'completed' && (reservationState == 'approved' || reservationState == 'cancelled' || reservationState == 'completed') && <li><Link to={"/users/trips/receipt/" + reservationId}><FormattedMessage {...messages.viewReceipt} /></Link></li>
                        }
                        {
                          !noList && userType === 'host' && reservationState === 'pending' && total != 0 && <li>
                            <a onClick={() => this.sendMessage('preApproved')}>
                              <FormattedMessage {...messages.approve} />
                            </a>
                          </li>
                        }
                        {
                          !noList && userType === 'host' && reservationState === 'pending' && total == 0 && <li>
                            <a onClick={() => this.sendMessage('approved')}>
                              <FormattedMessage {...messages.approve} />
                            </a>
                          </li>
                        }
                        {
                          !noList && userType === 'host' && reservationState === 'pending' && <li>
                            <a onClick={() => this.sendMessage('declined')}>
                              <FormattedMessage {...messages.decline} />
                            </a>
                          </li>
                        }
                        {
                          !noList && threadId && enableCancel && <li> <Link to={"/cancel/" + reservationId + "/" + userType}><FormattedMessage {...messages.cancel} /></Link></li>
                        }

                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapState = (state) => ({
});

const mapDispatch = {
  sendMessageAction,
};

export default withStyles(s)(connect(mapState, mapDispatch)(ReservationItem));