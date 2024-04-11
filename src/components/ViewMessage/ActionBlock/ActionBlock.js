import React, { Component } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

import {
  Button,
  Form,
  Grid,
  Row, FormGroup,
  Col,
  ControlLabel,
  FormControl,
  FieldGroup,
  Panel,
  Label
} from 'react-bootstrap';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../ViewMessage.css';

// Component
import GuestActions from './GuestActions';
import HostActions from './HostActions';

class ActionBlock extends Component {
  static propTypes = {
    threadType: PropTypes.string.isRequired,
    actionType: PropTypes.string.isRequired,
    threadId: PropTypes.number.isRequired,
    listId: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    street: PropTypes.string.isRequired,
    buildingName: PropTypes.string,
    zipcode: PropTypes.string.isRequired,
    timeZone: PropTypes.string.isRequired,
    reservationId: PropTypes.number,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    personCapacity: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired,
    hostDisplayName: PropTypes.string.isRequired,
    guestDisplayName: PropTypes.string.isRequired,
    guestLastName: PropTypes.any,
    guestLocation: PropTypes.any,
    guestProfilePic: PropTypes.any,
    guestJoinedDate: PropTypes.any,
    checkIn: PropTypes.any,
    checkOut: PropTypes.any,
    guests: PropTypes.any,
    allowedCheckInTime: PropTypes.any,
    allowedCheckOutTime: PropTypes.any,
    hostContactNumber: PropTypes.any,
    guestContactNumber: PropTypes.any,
    hostLocation: PropTypes.any,
    hostJoinedDate: PropTypes.any,
    content: PropTypes.string,
    hostProfilePic: PropTypes.any,
    hostemail: PropTypes.any,
    paymentState: PropTypes.string,
    reservationState: PropTypes.string,
    total: PropTypes.number,
  };

  static defaultProps = {
    actionType: null
  }

  render() {
    const { threadType, actionType, threadId, listId, startDate, endDate, personCapacity, createdAt, messageType } = this.props;
    const { hostDisplayName, guestDisplayName, reservationId, guestEmail, title, listPublishStatus, guestLastName, guestLocation, guestProfilePic, guestJoinedDate, checkIn, checkOut, guests, allowedCheckInTime, allowedCheckOutTime, hostContactNumber, guestContactNumber, hostLocation, hostJoinedDate, content, hostProfilePic, guestId, hostId, hostemail } = this.props;
    const { city, state, country, street, buildingName, zipcode, timeZone, paymentState, reservationState, total } = this.props;
    
    if (actionType != null) {
      if (threadType === 'host') {
        return <HostActions
          actionType={actionType}
          threadId={threadId}
          reservationId={reservationId}
          threadType={threadType}
          startDate={startDate}
          endDate={endDate}
          personCapacity={personCapacity}
          createdAt={createdAt}
          guestDisplayName={guestDisplayName}
          hostDisplayName={hostDisplayName}
          guestEmail={guestEmail}
          listId={listId}
          title={title}
          listPublishStatus={listPublishStatus}
          guestLastName={guestLastName}
          guestLocation={guestLocation}
          guestProfilePic={guestProfilePic}
          guestJoinedDate={guestJoinedDate}
          checkIn={checkIn}
          checkOut={checkOut}
          guests={guests}
          allowedCheckInTime={allowedCheckInTime}
          allowedCheckOutTime={allowedCheckOutTime}
          hostContactNumber={hostContactNumber}
          guestContactNumber={guestContactNumber}
          hostLocation={hostLocation}
          hostJoinedDate={hostJoinedDate}
          content={content}
          hostProfilePic={hostProfilePic}
          hostemail={hostemail}
          messageType={messageType}
          city={city}
          state={state}
          country={country}
          street={street}
          buildingName={buildingName}
          zipcode={zipcode}
          timeZone={timeZone}
          paymentState={paymentState}
          reservationState={reservationState}
          total={total}
        />
      } else {
        return <GuestActions
          actionType={actionType}
          threadId={threadId}
          listId={listId}
          startDate={startDate}
          endDate={endDate}
          personCapacity={personCapacity}
          reservationId={reservationId}
          hostDisplayName={hostDisplayName}
          createdAt={createdAt}
          listPublishStatus={listPublishStatus}
          content={content}
          guestId={guestId}
          hostId={hostId}
          messageType={messageType}
          hostemail={hostemail}
          guestEmail={guestEmail}
          city={city}
          state={state}
          country={country}
          timeZone={timeZone}
          paymentState={paymentState}
          reservationState={reservationState}
          total={total}
        />
      }
    } else {
      return <div />
    }
  }
}

export default withStyles(s)(ActionBlock);

