import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import moment from 'moment';
import {
  Button,
  Form,
  Grid,
  Row,
  FormGroup,
  Col,
  ControlLabel,
  FormControl,
  FieldGroup,
  Panel,
  Table,
  Modal
} from 'react-bootstrap';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ViewProfile.css';
import * as FontAwesome from 'react-icons/lib/fa';

import { connect } from 'react-redux';

import { openReportUserModal, openThankYouModal } from '../../actions/modalActions';
import ReportUserModal from '../ReportUserModal';

import ThankYouModal from '../ThankYouModal';

// Component
import Reviews from './Reviews';
import VerifiedInfo from '../VerifiedInfo';
import Link from '../Link';
import Avatar from '../Avatar';

// Locale
import messages from '../../locale/messages';

class ViewProfile extends React.Component {

  static propTypes = {
    data: PropTypes.shape({
      userId: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      info: PropTypes.string.isRequired,
      location: PropTypes.string,
      createdAt: PropTypes.string.isRequired,
      picture: PropTypes.string.isRequired,
      profileId: PropTypes.number.isRequired,
      reviewsCount: PropTypes.number.isRequired,
    }).isRequired,
    isUser: PropTypes.bool,
    loadMore: PropTypes.any.isRequired,
    formatMessage: PropTypes.any,
  };

  static defaultProps = {
    data: {
      createdAt: new Date(),
      picture: null
    },
    isUser: false
  };

  render() {

    const { data, isUser, loadMore, openReportUserModal, profileId, userData, isAuthenticate } = this.props;
    let date = moment(data.createdAt).format('MMMM YYYY');
    return (
      <div className={cx(s.pageContainer, s.space2, s.spaceTop4, 'ViewProfile')}>
        <div className={s.containerResponsive}>
          <Col md={4} lg={3} className={s.hideSm}>
            <div className={cx(s.slideShow, s.space3)}>
              <Avatar
                source={data.picture}
                isUser={isUser}
                height={190}
                width={190}
                className={s.imgResponsive}
              />
            </div>

            <VerifiedInfo userId={data.userId} />
          </Col>

          <Col md={8} lg={9} className={cx(s.smPadding, s.preserveLineBreaks)}>
            <Row className={s.space2}>
              <Col xs={12} className={cx(s.showSm, s.centerFlex)}>
                <div className={cx(s.slideShowImages, s.mediaRound)}>
                  <Avatar
                    source={data.picture}
                    isUser={isUser}
                    height={225}
                    width={225}
                    className={s.imageContent}
                  />
                </div>


              </Col>
              <Col xs={12} md={12} lg={12} className={s.textalign}>
                <h1 className={s.profileTitle}>
                  <FormattedMessage {...messages.hey} />{' '} {data.firstName}!
                </h1>
                <p className={s.profileInfo}>
                  {/* {data.location}
                  <span>.</span> <FormattedMessage {...messages.joinedIn} /> {date}</span> */}

                  {
                    data.foodCategory && <span>
                      {data.foodCategory}{' '}<sub className={s.subSection}>.</sub></span>
                  }

                  {
                    data.location && <span>
                      {' '}{data.location}{' '} <sub className={s.subSection}>.</sub></span>
                  }

                  {
                    date && <span>
                      {' '}<FormattedMessage {...messages.joinedIn} /> {date}</span>
                  }

                </p>

                {
                  !isUser && isAuthenticate && <p className={s.reportProfile}>
                    <ReportUserModal profileId={profileId} />
                    <Link
                      className={cx(s.reportProfile)}
                      onClick={openReportUserModal}
                    >
                      <FontAwesome.FaFlag className={s.flagIcon} />
                      <FormattedMessage {...messages.reportUser} />
                    </Link>
                    <ThankYouModal />
                  </p>
                }

                {
                  isUser && <Link to={"/user/edit"}>
                    <FormattedMessage {...messages.editProfile} />
                  </Link>
                }

              </Col>
            </Row>
            <div className={s.space3}>
              <p>
                {data.info}
              </p>
            </div>

            {data.lifestyle &&
              <div className={s.space3}>
                <p className={s.boldheading}> <FormattedMessage {...messages.myLifestyle} /></p>
                <p>
                  {data.lifestyle}
                </p>
              </div>
            }
            {data.funFacts &&
              <div className={s.space3}>
                <p className={s.boldheading}> <FormattedMessage {...messages.profileFunFacts} /></p>
                <p>
                  {data.funFacts}
                </p>
              </div>
            }
            {data.hobbies &&
              <div className={s.space3}>
                <p className={s.boldheading}> <FormattedMessage {...messages.profileHobbies} /></p>
                <p>
                  {data.hobbies}
                </p>
              </div>
            }
            {(data.books) &&
              <div className={s.space3}>
                <p className={s.boldheading}> <FormattedMessage {...messages.profileFavorites} /></p>
                <p>
                  {data.books}
                </p>
              </div>
            }
            {data.spokenLanguages &&
              <div className={s.space3}>
                <p className={s.boldheading}> <FormattedMessage {...messages.profileSpoken} /></p>
                <p>
                  {data.spokenLanguages}
                </p>
              </div>
            }
            {data.school &&
              <div className={s.space3}>
                <p className={s.boldheading}> <FormattedMessage {...messages.school} /></p>
                <p>
                  {data.school}
                </p>
              </div>
            }
            {data.work &&
              <div className={s.space3}>
                <p className={s.boldheading}> <FormattedMessage {...messages.profileWork} /></p>
                <p>
                  {data.work}
                </p>
              </div>
            }
            {data.companionAnimals &&
              <div className={s.space3}>
                <p className={s.boldheading}> <FormattedMessage {...messages.profileCompanionAnimals} /></p>
                <p>
                  {data.companionAnimals}
                </p>
              </div>
            }
            {data.quote &&
              <div className={s.space3}>
                <p className={s.boldheading}> <FormattedMessage {...messages.profileQuote} /></p>
                <p>
                  {data.quote}
                </p>
              </div>
            }
            {
              data.reviewsCount > 0 && <Reviews
                reviewsCount={data.reviewsCount}
                data={data.reviews}
                loadMore={loadMore}
              />
            }
          </Col>
        </div>
      </div >

    );
  }
}

const mapState = (state) => ({
  listSettingsData: state.adminListSettingsData.data,
  userData: state.account.data,
  isAuthenticate: state.runtime.isAuthenticated
});

const mapDispatch = {
  openReportUserModal,
};

export default withStyles(s)(connect(mapState, mapDispatch)(ViewProfile));