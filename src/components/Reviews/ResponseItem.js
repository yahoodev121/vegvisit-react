import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Panel, Row, Col } from 'react-bootstrap';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Reviews.css';

// Component
import Avatar from '../Avatar';
import Link from '../Link';

// Locale
import messages from '../../locale/messages';

class ResponseItem extends React.Component {

    static propTypes = {
        data: PropTypes.shape({
            authorData: PropTypes.shape({
                picture: PropTypes.string,
                firstName: PropTypes.string.isRequired,
                lastName: PropTypes.string.isRequired,
                profileId: PropTypes.number.isRequired,
            }),
        }),
        otherUserResponse: PropTypes.bool,
        formatMessage: PropTypes.any,
        otherUserProfileId: PropTypes.number,
    };

    static defaultProps = {
        otherUserResponse: false,
    };

    render() {
        const { data: { authorData: { firstName, lastName, profileId, picture } }, otherUserProfileId, listData, userStatus } = this.props;
        const { data: { reviewContent }, otherUserResponse } = this.props;
        const { formatMessage } = this.props.intl;
        let listtitle = listData ? listData.title : '';
        let listId = listData ? listData.id : '';
        let isGuest;
        if (otherUserResponse) {
            isGuest = firstName + '’s ' + formatMessage(messages.review)
        } else if(userStatus == "true"){
            isGuest = formatMessage(messages.your)
        } else {
            isGuest = formatMessage(messages.reviewsYou)
        }

        return (
            <div>
                <div className={cx(s.reviewBody, s.pullLeft)}>
                    <Avatar
                        source={picture}
                        height={34}
                        width={34}
                        title={firstName}
                        className={s.profileAvatar}
                        withLink
                        linkClassName={cx(s.avatarDisplay, s.profileAvatarLink)}
                        profileId={profileId}
                    />
                </div>
                <div className={s.reviewBody}>
                    <span className={s.textBold}>
                        {isGuest}{' '}
                        {!otherUserResponse && userStatus == "true" && <Link to={"/rooms/" + listId}>{''}{listtitle}</Link>} :
                    </span>
                    <p>
                        {
                            reviewContent
                        }
                    </p>
                </div>
            </div>
        );
    }
}

export default injectIntl(withStyles(s)(ResponseItem));