import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { FormattedMessage, injectIntl } from 'react-intl';

// Redux
import { connect } from 'react-redux';
import {
  Grid,
  Row,
  Col,
  Button,
} from 'react-bootstrap';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ViewMessage.css';
import * as FontAwesome from 'react-icons/lib/fa';

// Component
import UserDetail from './UserDetail';
import TripDetails from './TripDetails';
import ActionBlock from './ActionBlock';
import SendMessage from './SendMessage';
import ThreadItems from './ThreadItems';
import Loader from '../Loader';
import GuestHostDetails from './GuestHostDetails';
import withoutTawkTo from '../withoutTawkTo';

// Graphql
import GetThreadQuery from './GetThreadQuery.graphql';
import GetMoreThreadItemsQuery from './GetMoreThreadItemsQuery.graphql';

// Locale
import messages from '../../locale/messages';

class ViewMessage extends React.Component {
  static propTypes = {
    formatMessage: PropTypes.any,
    threadId: PropTypes.number.isRequired,
    userType: PropTypes.string.isRequired,
    threadItemsData: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      getThread: PropTypes.shape({
        guestProfile: PropTypes.shape({
          profileId: PropTypes.number.isRequired,
          picture: PropTypes.string,
          displayName: PropTypes.string.isRequired,
          firstName: PropTypes.string.isRequired,
          location: PropTypes.string,
          reviewsCount: PropTypes.number,
          userVerification: PropTypes.object,
        }),
        guestUserData: PropTypes.shape({
          email: PropTypes.string.isRequired,
          userBanStatus: PropTypes.number,
        }),
        hostProfile: PropTypes.shape({
          profileId: PropTypes.number.isRequired,
          picture: PropTypes.string,
          displayName: PropTypes.string.isRequired,
          firstName: PropTypes.string.isRequired,
          location: PropTypes.string,
          reviewsCount: PropTypes.number,
          userVerification: PropTypes.object,
        }),
        hostUserData: PropTypes.shape({
          email: PropTypes.string.isRequired,
          userBanStatus: PropTypes.number,
        }),
        threadItemForType: PropTypes.shape({
          reservationId: PropTypes.number,
          startDate: PropTypes.string.isRequired,
          endDate: PropTypes.string.isRequired,
          personCapacity: PropTypes.number.isRequired,
          createdAt: PropTypes.string.isRequired,
          cancelData: PropTypes.shape({
            guestServiceFee: PropTypes.number,
            hostServiceFee: PropTypes.number,
            refundToGuest: PropTypes.number,
            payoutToHost: PropTypes.number,
            total: PropTypes.number,
            currency: PropTypes.string,
          })
        }),
        actionThreadItems: PropTypes.shape({
          reservationId: PropTypes.number,
          startDate: PropTypes.string.isRequired,
          endDate: PropTypes.string.isRequired,
          personCapacity: PropTypes.number.isRequired,
          createdAt: PropTypes.string.isRequired,
          cancelData: PropTypes.shape({
            guestServiceFee: PropTypes.number,
            hostServiceFee: PropTypes.number,
            refundToGuest: PropTypes.number,
            payoutToHost: PropTypes.number,
            total: PropTypes.number,
            currency: PropTypes.string,
          })
        }),
        listData: PropTypes.shape({
          title: PropTypes.string.isRequired,
          street: PropTypes.string.isRequired,
          buildingName: PropTypes.string,
          city: PropTypes.string.isRequired,
          state: PropTypes.string.isRequired,
          country: PropTypes.string.isRequired,
          zipcode: PropTypes.string.isRequired,
          timeZone: PropTypes.string.isRequired,
          listingData: PropTypes.shape({
            basePrice: PropTypes.number.isRequired,
            cleaningPrice: PropTypes.number.isRequired,
            currency: PropTypes.string.isRequired,
          }),
        }),
      }),
    }),
  };
  static defaultProps = {
    threadId: null,
  };
  constructor(props) {
    super(props);
    this.loadMore = this.loadMore.bind(this);
    this.nextAction = this.nextAction.bind(this);
    this.previousAction = this.previousAction.bind(this);
    this.firstAction = this.firstAction.bind(this);
    this.lastAction = this.lastAction.bind(this);
    this.state = {actionItemIndex: 0};
  }
  loadMore() {
    const { threadItemsData: { loading, getThread: { threadItems }, fetchMore }, threadId } = this.props;

    fetchMore({
      query: GetMoreThreadItemsQuery,
      variables: {
        threadId,
        offset: threadItems.length,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) { return previousResult; }
        return {
          getThread: {
            ...previousResult.getThread,
            threadItems: [...previousResult.getThread.threadItems, ...fetchMoreResult.getAllThreadItems],
          },
        };
      },
    });
  }

  nextAction() {
    this.setState({actionItemIndex: this.state.actionItemIndex + 1});
  }
  previousAction() {
    this.setState({actionItemIndex: this.state.actionItemIndex - 1});
  }
  firstAction() {
    this.setState({actionItemIndex: 0});
  }
  lastAction() {
    const { threadItemsData: { getThread } } = this.props;
    this.setState({actionItemIndex: getThread.actionThreadItems.length - 1});
  }

  render() {
    const { threadItemsData: { loading, getThread }, userType, threadId, isAdminAuthenticated } = this.props;
    const { account } = this.props;
    if (loading) {
      return <Loader type={'text'} />;
    }

    if (getThread && getThread.threadItemForType && getThread.hostProfile && getThread.guestProfile && getThread.actionThreadItems && getThread.actionThreadItems.length > 0) {
    
      let receiverName = getThread.guestProfile.firstName;
      let hostUserBanStatus = getThread.hostUserData.userBanStatus;
      let guestUserBanStatus = getThread.guestUserData.userBanStatus;
      let senderName = getThread.hostProfile.firstName;
      let receiverType = 'guest', isListAvailable = false;
      let receiverEmail = getThread.guestUserData.email;
      if (userType === "guest") {
        receiverName = getThread.hostProfile.firstName;
        senderName = getThread.guestProfile.firstName;
        receiverType = 'host';
        receiverEmail = getThread.hostUserData.email;
      }
      let listPublishStatus;
      const initialValues = {
        threadId,
        threadType: userType,
        type: 'message',
        receiverName,
        senderName,
        receiverType,
        receiverEmail
      };

      if (getThread && getThread.listData) {
        isListAvailable = true
      }
      
      if (getThread && getThread.listData) {
        listPublishStatus = getThread.listData.isPublished
      }

      let actionThreadItems;
      actionThreadItems = getThread.actionThreadItems[this.state.actionItemIndex];

      return (
        
        <div>
          <Row>
            <Col lg={4} md={4} sm={5} xs={12} className={cx(s.sidebarDesign, s.space4, 'hidden-xs')}>
              <UserDetail
                profileId={userType === 'host' ? getThread.guestProfile.profileId : getThread.hostProfile.profileId}
                picture={userType === 'host' ? getThread.guestProfile.picture : getThread.hostProfile.picture}
                displayName={userType === 'host' ? getThread.guestProfile.firstName : getThread.hostProfile.firstName}
                location={userType === 'host' ? getThread.guestProfile.location : getThread.hostProfile.location}
                reviewsCount={userType === 'host' ? getThread.guestProfile.reviewsCount : getThread.hostProfile.reviewsCount}
                verifications={userType === 'host' ? getThread.guestProfile.userVerification : getThread.hostProfile.userVerification}
              />
              {
                isListAvailable && <TripDetails
                  listId={getThread.listId}
                  userType={userType}
                  title={getThread.listData.title}
                  timeZone={getThread.listData.timeZone}
                  basePrice={getThread.listData.listingData.basePrice}
                  cleaningPrice={getThread.listData.listingData.cleaningPrice}
                  monthlyDiscount={getThread.listData.listingData.monthlyDiscount}
                  weeklyDiscount={getThread.listData.listingData.weeklyDiscount}
                  currency={getThread.listData.listingData.currency}
                  startDate={actionThreadItems.startDate}
                  endDate={actionThreadItems.endDate}
                  personCapacity={actionThreadItems.personCapacity}
                  cancelData={actionThreadItems.cancelData}
                  reservationData={actionThreadItems.reservation || undefined}
                />
              }
              {
                !isListAvailable && <FormattedMessage {...messages.noList} />
              }
            </Col>
            <Col lg={8} md={8} sm={7} xs={12} className={cx(s.space4, s.paddingRight)}>
                            
              {
                !isAdminAuthenticated && !guestUserBanStatus && !hostUserBanStatus &&
                <Row>
                  <Col lg={1} md={1} sm={2} xs={2} className={cx(s.space4)}>
                    <Button variant="primary" size="lg" onClick={this.previousAction} disabled={this.state.actionItemIndex <= 0} className={cx(s.actionNavigationButton)}><FontAwesome.FaStepBackward /></Button>
                    <Button variant="primary" size="lg" onClick={this.firstAction} className={cx(s.actionNavigationButton)}><FontAwesome.FaFastBackward /></Button>
                  </Col>
                  <Col lg={10} md={10} sm={8} xs={8} className={cx(s.space4)}>
                    <ActionBlock
                      threadType={userType}
                      actionType={actionThreadItems.type}
                      threadId={threadId}
                      listId={getThread.listId}
                      reservationId={actionThreadItems.reservationId}
                      startDate={actionThreadItems.startDate}
                      endDate={actionThreadItems.endDate}
                      personCapacity={actionThreadItems.personCapacity}
                      createdAt={actionThreadItems.createdAt}
                      hostDisplayName={getThread.hostProfile.firstName}
                      guestDisplayName={getThread.guestProfile.firstName}
                      guestEmail={getThread.guestUserData.email}
                      hostemail={getThread.hostProfile.email}
                      hostProfilePic={getThread.hostProfile.picture}
                      title={getThread.listData.title}
                      listPublishStatus={listPublishStatus} 
                      guestLastName={getThread.guestProfile.lastName} 
                      guestLocation={getThread.guestProfile.location} 
                      guestProfilePic={getThread.guestProfile.picture} 
                      guestJoinedDate={getThread.guestProfile.createdAt} 
                      checkIn={actionThreadItems.reservation ? actionThreadItems.reservation.checkIn : ''} 
                      checkOut={actionThreadItems.reservation ? actionThreadItems.reservation.checkOut : ''}
                      guests={actionThreadItems.reservation ? actionThreadItems.reservation.guests : ''} 
                      allowedCheckInTime={getThread.listData.listingData.checkInStart} 
                      allowedCheckOutTime={getThread.listData.listingData.checkInEnd} 
                      hostContactNumber={getThread.hostProfile.phoneNumber} 
                      guestContactNumber={getThread.guestProfile.phoneNumber} 
                      hostLocation={getThread.hostProfile.location} 
                      hostJoinedDate={getThread.hostProfile.createdAt}
                      content={actionThreadItems.content} 
                      hostProfilePic={getThread.hostProfile.picture} 
                      guestId={getThread.guest} 
                      hostId={getThread.host} 
                      hostemail={getThread.hostUserData.email}
                      messageType={actionThreadItems.messageType}
                      city={getThread.listData.city}
                      state={getThread.listData.state}
                      country={getThread.listData.country}
                      street={getThread.listData.street}
                      buildingName={getThread.listData.buildingName}
                      zipcode={getThread.listData.zipcode}
                      timeZone={getThread.listData.timeZone}
                      paymentState={actionThreadItems && actionThreadItems.reservation && actionThreadItems.reservation.paymentState}
                      reservationState={actionThreadItems && actionThreadItems.reservation && actionThreadItems.reservation.reservationState}
                      total={actionThreadItems && actionThreadItems.reservation && actionThreadItems.reservation.total}
                    />
                  </Col>
                  <Col lg={1} md={1} sm={2} xs={2} className={cx(s.space4, s.paddingLeft)}>
                    <Button variant="primary" size="lg" onClick={this.nextAction} disabled={this.state.actionItemIndex >= getThread.actionThreadItems.length - 1} className={cx(s.actionNavigationButton)}><FontAwesome.FaStepForward /></Button>
                    <Button variant="primary" size="lg" onClick={this.lastAction} className={cx(s.actionNavigationButton)}><FontAwesome.FaFastForward /></Button>
                  </Col>
                </Row>
              }
              <div className="hidden-xs">
                <GuestHostDetails
                  userType={userType}
                  threadId={threadId}
                  getThread={getThread}
                  account={account}
                />
              </div>
              {
                !isAdminAuthenticated && <SendMessage
                  initialValues={initialValues}
                  threadId={threadId}
                  profileId={userType === 'host' ? getThread.hostProfile.profileId : getThread.guestProfile.profileId}
                  picture={userType === 'host' ? getThread.hostProfile.picture : getThread.guestProfile.picture}
                  displayName={userType === 'host' ? getThread.hostProfile.firstName : getThread.guestProfile.firstName}
                />
              }
              <ThreadItems
                userType={userType}
                threadId={threadId}
                data={getThread}
                loadMore={this.loadMore}
                actionThreadItemId={actionThreadItems.id}
              />
            </Col>
            <Col lg={4} md={4} sm={4} xs={12} className={cx(s.sidebarDesign, s.space4, 'visible-xs')}>
              <UserDetail
                profileId={userType === 'host' ? getThread.guestProfile.profileId : getThread.hostProfile.profileId}
                picture={userType === 'host' ? getThread.guestProfile.picture : getThread.hostProfile.picture}
                displayName={userType === 'host' ? getThread.guestProfile.firstName : getThread.hostProfile.firstName}
                location={userType === 'host' ? getThread.guestProfile.location : getThread.hostProfile.location}
                reviewsCount={userType === 'host' ? getThread.guestProfile.reviewsCount : getThread.hostProfile.reviewsCount}
                verifications={userType === 'host' ? getThread.guestProfile.userVerification : getThread.hostProfile.userVerification}
              />
              {
                isListAvailable && <TripDetails
                  listId={getThread.listId}
                  userType={userType}
                  title={getThread.listData.title}
                  timeZone={getThread.listData.timeZone}
                  basePrice={getThread.listData.listingData.basePrice}
                  cleaningPrice={getThread.listData.listingData.cleaningPrice}
                  monthlyDiscount={getThread.listData.listingData.monthlyDiscount}
                  weeklyDiscount={getThread.listData.listingData.weeklyDiscount}
                  currency={getThread.listData.listingData.currency}
                  startDate={getThread.threadItemForType.startDate}
                  endDate={getThread.threadItemForType.endDate}
                  personCapacity={getThread.threadItemForType.personCapacity}
                  cancelData={getThread.threadItemForType.cancelData}
                  reservationData={getThread.threadItemForType.reservation || undefined}
                />
              }
              {
                !isListAvailable && <FormattedMessage {...messages.noList} />
              }
            </Col>
          </Row>
        </div>
      );
    }
    
    return (
      <Grid>
        <Row>
          <Col md={7} mdPush={5} className={s.space4}>
            <FormattedMessage {...messages.noThreadFound} />
          </Col>
        </Row>
      </Grid>
    );
  }
}
const mapState = (state) => ({
  isAdminAuthenticated: state.runtime.isAdminAuthenticated,
  account: state.account.data,
});
const mapDispatch = {};
export default compose(
  withoutTawkTo,
  withStyles(s),
  connect(mapState, mapDispatch),
  graphql(GetThreadQuery, {
    name: 'threadItemsData',
    options: props => ({
      variables: {
        threadId: props.threadId,
        threadType: props.userType,
      },
      ssr: false,
      //pollInterval: 5000,
      fetchPolicy: 'network-only',
    }),
  }),
)(ViewMessage);
