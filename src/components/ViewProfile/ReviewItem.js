import React, {Component} from 'react'
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  Row,
  Col,
} from 'react-bootstrap';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ViewProfile.css';
import { FormattedMessage, injectIntl } from 'react-intl';

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
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    importUserName: PropTypes.string,
    importDateInfo: PropTypes.string,
    authorId: PropTypes.string,
    profileId: PropTypes.number,
    reviewContent: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    response: PropTypes.object,
    location: PropTypes.string, 
    isAdmin: PropTypes.bool,
    siteName: PropTypes.string
  };

  static defaultProps = {};

  render() {
    const { firstName, lastName, importUserName, authorId, profileId, picture, location, isAdmin, siteName } = this.props;
    const { reviewContent, createdAt, importDateInfo, response } = this.props;
    const { formatMessage } = this.props.intl;
    const isAirbnbImportUser = authorId === '00001' ;
    const authorName = !isAirbnbImportUser ? firstName : importUserName;
    const withLink = !isAirbnbImportUser;
    const date = isAirbnbImportUser ? importDateInfo : moment(createdAt).format('MMMM YYYY');
    return (
        <div>
         <div className={s.panelBody}>
            <div className={'viewprofileAvatar'}>
            {
                !isAdmin && <div className={s.avatarWrapper}>
                        <Avatar
                            source={picture}
                            height={68}
                            width={68}
                            title={authorName}
                            className={s.profileAvatarLink}
                            withLink={withLink}
                            linkClassName={s.profileAvatarLink}
                            profileId={profileId}
                            useRandomPicture={isAirbnbImportUser}
                        /> 
                    <div className={cx(s.textCenter, s.profileName)}>
                        {
                          !isAirbnbImportUser && <Link to={"/users/show/" + profileId}>{authorName}</Link>
                        }
                        {
                          isAirbnbImportUser && 
                          <div className={cx(s.textCenter, s.profileName)}>
                              {authorName}
                          </div>
                        }
                    </div>
                    {/* <span className={cx(s.showSm, s.textCenter)}>
                    <span className={cx(s.reviewMuted)}>
                        {date}
                    </span>
                    </span> */}
                </div>
            }
            {
                isAdmin && <div className={s.avatarWrapper}>
                    <Avatar
                        source={'../../../adminAvatar.png'}
                        height={68}
                        width={68}
                        title={formatMessage(messages.verifiedBy) + ' ' + siteName}
                        className={cx(s.profileAvatar, s.noBackground)}
                        staticImage
                    />
                    <div className={cx(s.textCenter, s.profileName)}>
                        {formatMessage(messages.verifiedBy) + ' ' + siteName}
                    </div>
                    {/* <span className={cx(s.showSm, s.textCenter)}>
                        <span className={cx(s.reviewMuted)}>
                            {date}
                        </span>
                    </span> */}
                </div>
            }
            </div>
            <div  className={s.messageContent}>
            
              <div className={s.commentContainer}>
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
                {/* {
                    response && <ResponseItem 
                        data={response}
                    />  
                }   */}
                <div className={s.hideSm}>
                    <span className={cx(s.pullLeft, s.reviewMuted)}>
                        {/* {
                            location && <span>From {location}.</span>
                        } */}
                        {date} 
                    </span>

                </div>
                {isAirbnbImportUser &&
                  <div className={cx(s.pullRight, s.reviewMuted)}>
                    from Airbnb
                  </div>}
              </div>
            
            </div>
          
         </div>   
         <Row className={cx(s.lineSeperation)}>
            <Col lg={12} sm={12} md={12} xs={12} className={s.padding5per}>
                <hr className={s.horizontalLineThrough} />
            </Col>
            </Row>
        </div>
    );
  }
}

const mapState = state => ({
    siteName: state.siteSettings.data.siteName
});

const mapDispatch = {
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(ReviewItem)));