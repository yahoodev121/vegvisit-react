import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import moment from 'moment';
import { Panel, Row, Col } from 'react-bootstrap';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Reviews.css';

// Redux
import { connect } from 'react-redux';

// Component
import ResponseItem from './ResponseItem';
import Avatar from '../Avatar';
import Link from '../Link';

// Locale
import messages from '../../locale/messages';

class ReviewItem extends React.Component {

    static propTypes = {
        formatMessage: PropTypes.any,
        picture: PropTypes.string,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        profileId: PropTypes.number.isRequired,
        reviewContent: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
        response: PropTypes.object,
        otherUserResponse: PropTypes.bool,
        showUserName: PropTypes.bool,
        otherUserName: PropTypes.string,
        otherUserProfileId: PropTypes.number,
        isAdmin: PropTypes.bool,
        siteName: PropTypes.string,
        listData: PropTypes.any,
        userStatus: PropTypes.string.isRequired,
    };

    static defaultProps = {
        response: null,
        showUserName: false,
    };

    render() {
        const { firstName, lastName, profileId, picture, otherUserName, otherUserProfileId, isAdmin, listData, userStatus } = this.props;
        const { reviewContent, createdAt, response, otherUserResponse, showUserName, siteName, userData, isHost } = this.props;
        let date = moment(createdAt).format('MMMM YYYY');
        const { formatMessage } = this.props.intl;

        let isGuestName = response && response.authorData && response.authorData.firstName;
        let isGuestImage = response && response.authorData && response.authorData.picture;
        let isGuestProfileId = response && response.authorData && response.authorData.profileId;
        let showAvatar = showUserName == false ? picture : isGuestImage;
        // let isProfileId = showUserName == false ? profileId : isGuestProfileId;
        let isProfileId;
        if (!showUserName) {
            isProfileId = profileId
        } else {
            isProfileId = isGuestProfileId
        }

        let listId = listData ? listData.id : '';
        let listtitle = listData ? listData.title : '';
        let isValue = false;

        if (!isAdmin && !showUserName && !userStatus) {
            isValue = true;
        } else if (!isAdmin && !showUserName && userStatus) {
            isValue = false;
        }


        return (
            <li>

                <div className={s.displayTable}>
                    <div className={s.displayTableRow}>
                        <div className={cx(s.displayTableCell, s.LeftBg)}>
                            {
                                !isAdmin && <div className={cx(s.pullLeft, s.mediaContainer, s.textCenter)} >
                                    <Avatar
                                        source={picture}
                                        height={68}
                                        width={68}
                                        title={firstName}
                                        className={s.profileAvatar}
                                        withLink
                                        linkClassName={s.profileAvatarLink}
                                        profileId={profileId}
                                    />
                                    {
                                        showUserName && <div className={s.name}>
                                            <FormattedMessage {...messages.youLabel} />
                                        </div>
                                    }
                                </div>
                            }
                            {
                                isAdmin && <div className={cx(s.pullLeft, s.mediaContainer, s.textCenter)} >
                                    <Avatar
                                        source={'../../../adminAvatar.png'}
                                        height={68}
                                        width={68}
                                        title={formatMessage(messages.verifiedBy) + ' ' + siteName}
                                        className={cx(s.profileAvatar, s.noBackground)}
                                        staticImage
                                    />
                                    <div className={s.name}>
                                        {formatMessage(messages.verifiedBy) + ' ' + siteName}
                                    </div>
                                </div>
                            }
                        </div>
                        <div className={cx(s.displayTableCell, s.rightBg)}>
                            <div className={s.reviewBody}>

                                {
                                    showUserName && userStatus == "false" && <span className={s.textBold}>
                                        <FormattedMessage {...messages.Youhadreviewsfor} />{' '}
                                        {
                                            <span><Link to={"/rooms/" + listId}>{listtitle}</Link> :</span>
                                        }

                                    </span>
                                }

                                {
                                    showUserName && userStatus == "true" && <span className={s.textBold}>
                                        <FormattedMessage {...messages.Youhadreviewsof} />{' '}
                                        {/* <a href={"/users/show/" + profileId}>{firstName} </a>: */}
                                        <a href={"/users/show/" + isGuestProfileId}>{isGuestName} </a>:
                                    </span>
                                }

                                {
                                    !isAdmin && !showUserName &&userStatus == "true" &&
                                    <div className={s.nameBold}>
                                        {firstName}{'’s'} <FormattedMessage {...messages.offInfo} />{' '}
                                        
                                    </div>
                                }
                                {
                                    !isAdmin && !showUserName &&userStatus == "false" &&
                                    <div className={s.nameBold}> 
                                        {
                                            userStatus == "false" && <span>
                                                {firstName}{'’s'} <FormattedMessage {...messages.off} />{' '}
                                                <Link to={"/rooms/" + listId}>{listtitle}</Link> :
                                            </span>
                                        }
                                    </div>
                                }
                                <p>
                                    {
                                        reviewContent && (reviewContent.trim()).split("\n").map(function (content, index) {
                                            return (
                                                <span key={index}>
                                                    {content}
                                                    <br />
                                                </span>
                                            )
                                        })
                                    }
                                </p>
                                {
                                    response && <ResponseItem
                                        data={response}
                                        listData={listData}
                                        otherUserResponse={otherUserResponse}
                                        userStatus={userStatus}
                                    />
                                }
                                <p className={s.reviewMuted}>{date}</p>
                            </div>
                        </div>
                    </div>
                </div>



                <Row className={s.lineSeperation}>
                    <Col lg={12} md={12} sm={12} xs={12}>
                        <hr className={s.horizontalLineThrough} />
                    </Col>
                </Row>
            </li>
        );
    }
}

const mapState = state => ({
    siteName: state.siteSettings.data.siteName,
    userData: state.account.data,
});

const mapDispatch = {
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(ReviewItem)));