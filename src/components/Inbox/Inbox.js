import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

import { graphql, compose } from 'react-apollo';

import {
  Grid,
  Row,
  Col,
  Panel,
  Badge
} from 'react-bootstrap';

import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Inbox.css';

// Graphql 
import UnreadCountQuery from './UnreadCount.graphql';
import GetAllThreadQuery from './AllThreadsQuery.graphql';

// Component
import InboxItem from './InboxItem';
import EmptyInbox from './EmptyInbox';
import Loader from '../Loader';
import CustomPagination from '../CustomPagination';
import GetEmailsModal from '../GetEmailsModal/GetEmailsModal';

// Redux
import { connect } from 'react-redux';
import { openGetEmailsModal } from '../../actions/modalActions';

// Locale
import messages from '../../locale/messages';

class Inbox extends React.Component {

  static propTypes = {
    formatMessage: PropTypes.any,
    allThreads: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      GetAllThreads: PropTypes.shape({
        count: PropTypes.number.isRequired,
        threadsData: PropTypes.arrayOf(PropTypes.shape({
          id: PropTypes.number.isRequired,
          listData: PropTypes.shape({
            city: PropTypes.string.isRequired,
            state: PropTypes.string.isRequired,
            country: PropTypes.string.isRequired,
            timeZone: PropTypes.string.isRequired,
          }),
          guestProfile: PropTypes.shape({
            profileId: PropTypes.number.isRequired,
            picture: PropTypes.string,
            displayName: PropTypes.string.isRequired,
            firstName: PropTypes.string.isRequired,
          }),
          hostProfile: PropTypes.shape({
            profileId: PropTypes.number.isRequired,
            picture: PropTypes.string,
            displayName: PropTypes.string.isRequired,
            firstName: PropTypes.string.isRequired,
          }),
          threadItem: PropTypes.shape({
            type: PropTypes.string.isRequired,
            content: PropTypes.string,
            startDate: PropTypes.string,
            endDate: PropTypes.string,
            isRead: PropTypes.bool.isRequired,
            sentBy: PropTypes.string.isRequired,
            createdAt: PropTypes.string.isRequired,
          }),
          actionThreadItem: PropTypes.shape({
            id: PropTypes.number.isRequired,
            threadId: PropTypes.number.isRequired,
            content: PropTypes.string,
            sentBy: PropTypes.string.isRequired,
            isRead: PropTypes.bool.isRequired,
            type: PropTypes.string.isRequired,
            startDate: PropTypes.string,
            endDate: PropTypes.string,
            createdAt: PropTypes.string.isRequired,
            messageType: PropTypes.string.isRequired,
          })
        }))
      }),
    }),
    UnreadCount: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      getUnreadCount: PropTypes.shape({
        hostCount: PropTypes.number.isRequired,
        guestCount: PropTypes.number.isRequired
      })
    }),
    inboxType: PropTypes.string.isRequired
  };

  static defaultProps = {
    allThreads: {
      loading: true,
      GetAllThreads: {
        count: null,
        threadsData: []
      }
    },
    UnreadCount: {
      loading: true,
      hostCount: null,
      guestCount: null
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      type: props.inboxType ? props.inboxType : 'guest',
      currentPage: 1
    }
    this.changeType = this.changeType.bind(this);
    this.paginationData = this.paginationData.bind(this);

    // Default GetAllThreads query will look for guest threads, therefore we need to refetch with type host in case
    if (this.state.type === 'host') {
      this.changeType('host');
    }
  }

  componentWillUnmount() {
    const { UnreadCount } = this.props;
    UnreadCount.stopPolling();
  }

  componentDidMount() {
    const { openGetEmailsModal } = this.props;
    openGetEmailsModal();
  }

  changeType(threadType) {
    const { allThreads: { refetch } } = this.props;
    let variables = {
      threadType,
      currentPage: 1
    };
    this.setState({ type: threadType, currentPage: 1 });
    refetch(variables);
  }

  paginationData(currentPage) {
    const { allThreads: { refetch } } = this.props;
    let variables = { currentPage };
    this.setState({ currentPage });
    refetch(variables);
  }

  render() {
    const { allThreads: { loading, GetAllThreads } } = this.props;
    const { UnreadCount: { getUnreadCount } } = this.props;
    const { formatMessage } = this.props.intl;
    const { type, currentPage } = this.state;
    let hostActive, guestActive, host, guest;
    if (type === 'host') {
      hostActive = s.active;
    } else {
      guestActive = s.active;
    }
    if (getUnreadCount) {
      host = getUnreadCount.hostCount != null && getUnreadCount.hostCount > 0 ? getUnreadCount.hostCount : null;
      guest = getUnreadCount.guestCount != null && getUnreadCount.guestCount > 0 ? getUnreadCount.guestCount : null;
    }
    return (
      <div
        className={cx(
          s.progressContainerResponsive,
          s.space5,
          s.spaceTop5,
          s.root
        )}
      >
        <GetEmailsModal />
        <Grid fluid>
          <Row className={cx(s.containerResponsive)}>
            <Col sm={12} md={7} lg={7} className={s.h4}>
              <ul className={cx('list-inline', s.tabs)}>
                <li className={guestActive}>
                  <a
                    className={s.tabItem}
                    href="javascript:void(0)"
                    onClick={() => this.changeType('guest')}
                  >
                    <FormattedMessage {...messages.traveling} />
                    {guest != null && (
                      <Badge className={s.count}>{guest}</Badge>
                    )}
                  </a>
                </li>
                <li className={hostActive}>
                  <a
                    className={s.tabItem}
                    href="javascript:void(0)"
                    onClick={() => this.changeType('host')}
                  >
                    <FormattedMessage {...messages.hosting} />
                    {host != null && <Badge className={s.count}>{host}</Badge>}
                  </a>
                </li>
              </ul>
            </Col>
          </Row>
          <Row className={s.containerResponsive}>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Panel className={s.panelHeader}>
                {loading && <Loader type={'text'} />}

                {!loading &&
                  GetAllThreads &&
                  GetAllThreads.threadsData &&
                  GetAllThreads.threadsData.length > 0 && (
                    <ul className={s.listLayout}>
                      {GetAllThreads.threadsData.map((item, index) => {
                        if (item.guestProfile && item.hostProfile) {
                          return (
                            <InboxItem
                              key={index}
                              threadId={item.id}
                              type={type}
                              profileId={
                                type === 'host'
                                  ? item.guestProfile.profileId
                                  : item.hostProfile.profileId
                              }
                              picture={
                                type === 'host'
                                  ? item.guestProfile.picture
                                  : item.hostProfile.picture
                              }
                              displayName={
                                type === 'host'
                                  ? item.guestProfile.firstName
                                  : item.hostProfile.firstName
                              }
                              content={item.threadItem.content}
                              createdAt={item.threadItem.createdAt}
                              city={item.listData.city}
                              state={item.listData.state}
                              country={item.listData.country}
                              timeZone={item.listData.timeZone}
                              startDate={item.threadItem.startDate}
                              endDate={item.threadItem.endDate}
                              status={item.actionThreadItem.type}
                              sentBy={item.threadItem.sentBy}
                              read={item.threadItem.isRead}
                              messageType={item.actionThreadItem.messageType}
                              currentStatus={item && item.threadItem}
                              paymentState={
                                item &&
                                item.threadItem &&
                                item.threadItem.reservation &&
                                item.threadItem.reservation.paymentState
                              }
                              reservationState={
                                item &&
                                item.threadItem &&
                                item.threadItem.reservation &&
                                item.threadItem.reservation.reservationState
                              }
                            />
                          );
                        } else {
                          return <li />;
                        }
                      })}
                    </ul>
                  )}
                {!loading &&
                  GetAllThreads &&
                  GetAllThreads.threadsData &&
                  GetAllThreads.threadsData.length === 0 && (
                    <EmptyInbox type={type} />
                  )}

                {GetAllThreads &&
                  GetAllThreads.threadsData &&
                  GetAllThreads.threadsData.length > 0 && (
                    <div>
                      <CustomPagination
                        total={GetAllThreads.count}
                        currentPage={currentPage}
                        defaultCurrent={1}
                        defaultPageSize={5}
                        change={this.paginationData}
                        paginationLabel={formatMessage(messages.messages)}
                      />
                    </div>
                  )}
              </Panel>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

const mapState = state => ({
  modal: state.modalStatus.isGetEmailsModalOpen,
});

const mapDispatch = {
  openGetEmailsModal,
};

export default compose(
  injectIntl,
  withStyles(s),
  connect(mapState, mapDispatch),
  graphql(UnreadCountQuery, {
    name: 'UnreadCount',
    options: {
      ssr: false,
      pollInterval: 5000
    }
  }),
  graphql(GetAllThreadQuery, {
    name: 'GetAllThreads',
    options: {
      ssr: false,
      pollInterval: 5000,
      fetchPolicy: 'network-only',
    }
  })
)(Inbox);
