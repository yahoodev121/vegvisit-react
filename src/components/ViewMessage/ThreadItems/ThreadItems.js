import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button } from 'react-bootstrap';
import cx from 'classnames';
import s from '../ViewMessage.css';


import { graphql, compose } from 'react-apollo';

// Components
import Status from './Status';
import ToMessage from './ToMessage';
import FromMessage from './FromMessage';
import Loading from '../../Loading';

// Locale
import messages from '../../../locale/messages';

class ThreadItems extends Component {
  static propTypes = {
    formatMessage: PropTypes.any,
    threadId: PropTypes.number.isRequired,
    userType: PropTypes.string.isRequired,
    data: PropTypes.shape({
      guestProfile: PropTypes.shape({
        profileId: PropTypes.number.isRequired,
        picture: PropTypes.string,
        displayName: PropTypes.string.isRequired,
      }),
      hostProfile: PropTypes.shape({
        profileId: PropTypes.number.isRequired,
        picture: PropTypes.string,
        displayName: PropTypes.string.isRequired,
      }),
      threadItems: PropTypes.arrayOf(PropTypes.shape({
        type: PropTypes.string.isRequired,
        messageType: PropTypes.string.isRequired,
        content: PropTypes.string,
        createdAt: PropTypes.string.isRequired,
        sentBy: PropTypes.string.isRequired,
      })),
      threadItemsCount: PropTypes.number.isRequired,
      listData: PropTypes.shape({
        title: PropTypes.string.isRequired,
        timeZone: PropTypes.string.isRequired,
        listingData: PropTypes.shape({
          basePrice: PropTypes.number.isRequired,
          cleaningPrice: PropTypes.number.isRequired,
          currency: PropTypes.string.isRequired,
        }),
      }),
    }),
    actionThreadItemId: PropTypes.number.isRequired,
  };

  static defaultProps = {
    data: {
      threadItems: [],
      threadItemsCount: 0,
    },
  };

  render() {
    const { data, data: { threadItems, threadItemsCount, listData }, userType, loadMore, actionThreadItemId } = this.props;

    if (threadItems != null && threadItems.length > 0) {
      return (
        <div>

          {
            threadItems != null && threadItems.length > 0 && threadItems.map((item, index) => (
              <div key={index}>
                {
                  item.type && item.type != 'message' && <Status
                    type={item.type}
                    messageType={item.messageType}
                    createdAt={item.createdAt}
                    timeZone={listData.timeZone}
                    isActive={item.id === actionThreadItemId}
                  />
                }
                {
                  userType === 'guest' && item.sentBy === data.host && (item.content != null && item.content != "") && <FromMessage
                    profileId={data.hostProfile.profileId}
                    picture={data.hostProfile.picture}
                    displayName={data.hostProfile.displayName}
                    content={item.content}
                    createdAt={item.createdAt}
                  />
                }
                {
                  userType === 'guest' && item.sentBy === data.guest && (item.content != null && item.content != "") && <ToMessage
                    profileId={data.guestProfile.profileId}
                    picture={data.guestProfile.picture}
                    displayName={data.guestProfile.displayName}
                    content={item.content}
                    createdAt={item.createdAt}
                  />
                }
                {
                  userType === 'host' && item.sentBy === data.guest && (item.content != null && item.content != "") && <FromMessage
                    profileId={data.guestProfile.profileId}
                    picture={data.guestProfile.picture}
                    displayName={data.guestProfile.displayName}
                    content={item.content}
                    createdAt={item.createdAt}
                  />
                }
                {
                  userType === 'host' && item.sentBy === data.host && (item.content != null && item.content != "") && <ToMessage
                    profileId={data.hostProfile.profileId}
                    picture={data.hostProfile.picture}
                    displayName={data.hostProfile.displayName}
                    content={item.content}
                    createdAt={item.createdAt}
                  />
                }
              </div>
            ))
          }
          {
            data && threadItems && threadItems.length < threadItemsCount && <div className={s.textCenter}>
              <Button href="javascript:void(0)" onClick={() => loadMore()} className={cx(s.btnRadius, s.btnPrimary)}><FormattedMessage {...messages.loadMoreMsg} /></Button>
            </div>
          }

        </div>
      );
    }
    return (
      <div> <FormattedMessage {...messages.noItmesFound} /> </div>
    );
  }
}

export default ThreadItems;

