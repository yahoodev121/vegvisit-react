import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Redux
import { connect } from 'react-redux';
// Translation
import { injectIntl, FormattedMessage } from 'react-intl';
// Locale
import messages from '../../locale/messages';
// Style
import { Button, Grid, Row, Col, FormGroup } from 'react-bootstrap';
import cx from 'classnames';
import * as FontAwesome from 'react-icons/lib/fa';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ExistingPage.css';

import defaultPic from './vectorImage.jpg';

// Component
import ListPlaceTips from '../ListPlaceTips';
import Loader from '../Loader';
import Link from '../Link';
import SyncCalendar from './SyncCalendar';
import GetEmailsModal from '../GetEmailsModal';
import ImportReviewsModal from './ImportReviews/ImportReviewsModal';
import PhoneVerificationModal from '../PhoneVerificationModal/PhoneVerificationModal';
import VerificationItem from '../../components/Trust/Item';

// Redux action
import { ManagePublishStatus } from '../../actions/Listing/ManagePublishStatus';
import { hostname } from 'os';
import { openImportReviewsModal } from '../../actions/ImportReviews/modalActions';
import { resendEmailVerification } from '../../actions/manageUserVerification';

class ExistingPage1 extends Component {
  static propTypes = {
    listingSteps: PropTypes.shape({
      step1: PropTypes.string.isRequired,
      step2: PropTypes.string.isRequired,
      step3: PropTypes.string.isRequired,
      listing: PropTypes.shape({
        id: PropTypes.number.isRequired,
        isReady: PropTypes.bool.isRequired,
        isPublished: PropTypes.bool.isRequired,
        listingStatus: PropTypes.bool.isRequired,
        reviewsImportUrlAirbnb: PropTypes.string,
        lastReviewsImportAirbnb: PropTypes.string,
        lastImportedReview: PropTypes.shape({
          importUrl: PropTypes.string,
          updatedAt: PropTypes.string,
        }),
      }),
      user: PropTypes.shape({
        userBanStatus: PropTypes.number,
      }),
    }),
    nextPage: PropTypes.any.isRequired,
    stepsLoading: PropTypes.bool,
    ManagePublishStatus: PropTypes.any.isRequired,
    openImportReviewsModal: PropTypes.any.isRequired,
    resendEmailVerification: PropTypes.any.isRequired,
    publishListLoading: PropTypes.bool,
    resendEmailLoading: PropTypes.bool,
    listId: PropTypes.number,
  };
  static defaultProps = {
    listingSteps: {
      step1: 'inactive',
      step2: 'inactive',
      step3: 'inactive',
      listing: {
        id: 0,
        isReady: false,
        isPublished: false,
        listingStatus: false,
      },
      user: {
        userBanStatus: 0,
      },
    },
    photosCount: 0,
    stepsLoading: false,
    publishListLoading: false,
    resendEmailLoading: false,
  };

  constructor(props) {
    super(props);
    this.sendConfirmEmail = this.sendConfirmEmail.bind(this);
    this.renderStepsCompletedActionBlock = this.renderStepsCompletedActionBlock.bind(this);
  }

  sendConfirmEmail() {
    const { resendEmailVerification } = this.props;
    resendEmailVerification();
  }

  renderStepsCompletedActionBlock() {
    const {
      nextPage,
      listingSteps,
      photosCount,
      stepsLoading,
      account,
      isAdmin,
      publishListLoading,
      resendEmailLoading,
      listId,
      openImportReviewsModal,
    } = this.props;
    const { formatMessage } = this.props.intl;
    const {
      listingSteps: {
        listing: {
          id,
          isReady,
          isPublished,
          user,
          listingStatus,
          reviewsImportUrlAirbnb,
          lastImportedReview,
        },
      },
    } = this.props;

    let userDelete = user && user.userDeletedAt;
    let isShowButton = false;
    let isEmailConfirmed = false;
    if (!userDelete) {
      isShowButton = true;
    } else {
      isShowButton = false;
    }
    if (account) {
      if (account.verification && account.verification.isEmailConfirmed) {
        isEmailConfirmed = true;
      }
    }

    let userBanStatusValue;
    if (user) {
      const {
        listingSteps: {
          listing: {
            user: { userBanStatus },
          },
        },
      } = this.props;
      userBanStatusValue = userBanStatus;
    }
    const {
      listingSteps: { step1, step2, step3 },
    } = this.props;
    const { ManagePublishStatus } = this.props;
    let isPhotoAvailable = false;
    if (photosCount > 0) {
      isPhotoAvailable = true;
    }
    const hasImportedReviews = reviewsImportUrlAirbnb ? true : false;
    return (
      <div>

        {listingSteps &&
          isReady &&
          !isPublished &&
          !userBanStatusValue &&
          isShowButton && (
            <Col xs={12} sm={12} md={12} lg={12}>
              <Col
                xs={12}
                sm={12}
                md={12}
                lg={12}
                className={cx(s.noPadding)}
              >
                <div className={s.displayInline}>
                  <Loader
                    type={'button'}
                    className={cx(s.button, s.btnPrimary)}
                    handleClick={() => ManagePublishStatus(id, 'publish')}
                    disabled={!isEmailConfirmed && !isAdmin}
                    show={publishListLoading}
                    label={formatMessage(messages.publishNow)}
                  />
                </div>
                {/* <Button className={cx(s.button, s.btnPrimary)} onClick={() => ManagePublishStatus(id, 'publish')}>
              <FormattedMessage {...messages.publishNow} />
            </Button> */}
                <a
                  target="_blank"
                  href={'/rooms/' + id + '/preview'}
                  className={cx(s.previewLink)}
                >
                  <FormattedMessage {...messages.previewListing} />
                </a>
              </Col>
            </Col>
          )}
        {listingSteps &&
          isReady &&
          isPublished &&
          !userBanStatusValue &&
          isShowButton && (
            <Col xs={12} sm={12} md={12} lg={12}>
              <Col
                xs={12}
                sm={12}
                md={12}
                lg={12}
                className={cx(s.noPadding)}
              >
                <div className={s.displayInline}>
                  <Loader
                    type={'button'}
                    className={cx(s.button, s.btnPrimary)}
                    handleClick={() => ManagePublishStatus(id, 'unPublish')}
                    // disabled={disabled}
                    show={publishListLoading}
                    label={formatMessage(messages.unPublishNow)}
                  />
                </div>
                {/* <Button
              className={cx(s.button, s.btnPrimary)}
              onClick={() => ManagePublishStatus(id, 'unPublish')}
            >
              <FormattedMessage {...messages.unPublishNow} />
            </Button> */}
                <a
                  target="_blank"
                  href={'/rooms/' + id + '/preview'}
                  className={cx(s.previewLink)}
                >
                  <FormattedMessage {...messages.previewListing} />{' '}
                </a>
              </Col>
            </Col>
          )}
        {userBanStatusValue == true && isShowButton && (
          <Col xs={12} sm={12} md={12} lg={12}>
            <Col
              xs={12}
              sm={12}
              md={12}
              lg={12}
              className={cx(s.spaceTop3, s.noPadding)}
            >
              <a
                target="_blank"
                href={'/rooms/' + id + '/preview'}
                className={cx(s.previewLinkUserBan)}
              >
                <FormattedMessage {...messages.previewListing} />
              </a>
            </Col>
          </Col>
        )}

        {step3 === 'completed' && (
          <Col xs={12} sm={12} md={12} lg={12}>
            <hr className={s.horizontalLineThrough} />
          </Col>
        )}
        {step3 === 'completed' && (
          <Col
            xs={12}
            sm={12}
            md={12}
            lg={12}
            className={cx(s.space2)}
          >
            <a
              href="javascript:void(0);"
              className={cx(s.modalCaptionLink)}
              onClick={() => openImportReviewsModal(listId)}
            >
              {!hasImportedReviews && (
                <FormattedMessage {...messages.importReviews} />
              )}
              {hasImportedReviews && (
                <FormattedMessage {...messages.reimportReviews} />
              )}
            </a>
          </Col>
        )}
        {listingSteps &&
          listingSteps.step3 === 'completed' &&
          listingSteps.listing &&
          listingSteps.listing.isPublished && (
            <Col xs={12} sm={12} md={12} lg={12} >
              <a
                target="_blank"
                href={'/become-a-host/' + id + '/booking-window'}
                className={cx(s.modalCaptionLink)}
              >
                <FormattedMessage {...messages.syncCalendar} />
              </a>
            </Col>
          )}
        {step3 === 'completed' && (
          <Col xs={12} sm={12} md={12} lg={12}>
            <hr className={s.horizontalLineThrough} />
          </Col>
        )}
        <Col xs={12} sm={12} md={12} lg={12}>
          <PhoneVerificationModal showVerified={false} noPhoneNumberMessage={formatMessage(messages.noPhoneNumberHost)}/>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className={cx(s.spaceTop2)}>
          <ul className={cx(s.listLayout)}>
            {!isEmailConfirmed && (
              <VerificationItem
                title={formatMessage(messages.email)}
                content={formatMessage(messages.pleaseVerifyHost)}
                isAction={true}
                isLink={false}
                buttonLabel={formatMessage(messages.verifyEmail)}
                handleClick={this.sendConfirmEmail}
                show={resendEmailLoading}
                name="email"
                simpleBox={true}
              />
            )}
            {/* {
              isEmailConfirmed &&  <VerificationItem
                title={formatMessage(messages.email)}
                content={formatMessage(messages.verifiedEmail)}
                isAction={false}
                isImage={true}
                name='email'
                simpleBox={true}
              />
          } */}
          </ul>
        </Col>
      </div>
    );
  }

  render() {
    const {
      nextPage,
      photosCount,
      stepsLoading,
      listId,
      account
    } = this.props;
    if (stepsLoading) {
      return <Loader type={'text'} />;
    }
    const {
      listingSteps: {
        listing: {
          isPublished,
          user,
          listingStatus,
          reviewsImportUrlAirbnb,
        },
      },
    } = this.props;

    let userFirstName = '';

    if (account) {
      userFirstName = account.firstName;
    }

    let userBanStatusValue;
    if (user) {
      const {
        listingSteps: {
          listing: {
            user: { userBanStatus },
          },
        },
      } = this.props;
      userBanStatusValue = userBanStatus;
    }
    const {
      listingSteps: { step1, step2, step3 },
    } = this.props;
    let isPhotoAvailable = false;
    if (photosCount > 0) {
      isPhotoAvailable = true;
    }
    const hasImportedReviews = reviewsImportUrlAirbnb ? true : false;
    return (
      <div className={s.spaceTop5}>
        <GetEmailsModal />
        <ImportReviewsModal
          actionType={hasImportedReviews ? 'update' : 'add'}
          listId={listId}
          importUrl={hasImportedReviews ? reviewsImportUrlAirbnb : null}
        />
        <Grid>
          <Row className={s.landingContainer}>
            <Col xs={12} sm={7} md={7} lg={7}>
              <Col xs={12} sm={12} md={12} lg={12}>
                {step1 == 'completed' && step2 == 'active' && (
                  <h3 className={s.landingTitle}>
                    <FormattedMessage {...messages.step1Heading1} />{' '}
                    {userFirstName}! <br />
                    <FormattedMessage {...messages.step1Heading} />
                  </h3>
                )}

                {step1 == 'completed' &&
                  step2 == 'completed' &&
                  step3 == 'active' && (
                    <h4 className={s.landingTitle}>
                      <FormattedMessage {...messages.step2Heading2} />{' '}
                      {userFirstName}!<br />
                      <FormattedMessage {...messages.step2Heading1} />
                    </h4>
                  )}
                {step1 == 'completed' &&
                  step2 == 'completed' &&
                  step3 == 'completed' &&
                  !isPhotoAvailable && (
                    <h4 className={s.landingTitle}>
                      <FormattedMessage {...messages.step2Uncompleted} /> <br />
                    </h4>
                  )}
                {/* {
                  step1 == "completed" && step2 == "completed" && step3 == "completed" && isPhotoAvailable  &&
                  <h4 className={s.landingTitle}>
                   <FormattedMessage {...messages.allSet}/> {userFirstName}! <FormattedMessage {...messages.stepsCompleted} /> <br />
                  </h4>
                } */}
                {step1 == 'completed' &&
                  step2 == 'completed' &&
                  step3 == 'completed' &&
                  isPhotoAvailable &&
                  !listingStatus && (
                    <h4 className={s.landingTitle}>
                      <FormattedMessage {...messages.stepsCompleted1} />{' '}
                      {userFirstName}!<br />
                      <FormattedMessage {...messages.stepsCompleted} />
                    </h4>
                  )}
                {step1 == 'completed' &&
                  step2 == 'completed' &&
                  step3 == 'completed' &&
                  isPhotoAvailable &&
                  !isPublished &&
                  listingStatus && (
                    <h4 className={s.landingTitle}>
                      <FormattedMessage {...messages.stepsCompletedPublish1} />{' '}
                      <br />
                    </h4>
                  )}
                {step1 == 'completed' &&
                  step2 == 'completed' &&
                  step3 == 'completed' &&
                  isPublished &&
                  listingStatus && (
                    <h4 className={s.landingTitle}>
                      <FormattedMessage {...messages.stepsCompletedPublish} />{' '}
                      <br />
                    </h4>
                  )}
                {/* {
                  step1 == "completed" && step2 == "completed" && step3 == "completed" && isPhotoAvailable && !isPublished && !isReady &&
                  <h4 className={s.landingTitle}>
                   unblish <br />
                  </h4>
                } */}
              </Col>

              {step3 === 'completed' && this.renderStepsCompletedActionBlock()}

              <Col xs={12} sm={12} md={12} lg={12}>
                <strong className={cx(s.step)}>
                  <span>
                    <FormattedMessage {...messages.step1HeadingNew} />
                  </span>
                </strong>
                {step1 == 'completed' && (
                  <h3 className={s.landingContentTitle}>
                    <FormattedMessage {...messages.theBasic} />
                  </h3>
                )}
              </Col>
              <Col xs={10} sm={10} md={10} lg={10}>
                <p className={cx(s.landingTitleStep)}>
                  <span>
                    <FormattedMessage {...messages.step1HeadingContent} />
                  </span>
                </p>
                {step1 == 'active' && (
                  <Button
                    className={cx(s.button, s.btnPrimary)}
                    onClick={() => nextPage('room')}
                  >
                    <FormattedMessage {...messages.continue} />
                  </Button>
                )}
                {step1 == 'completed' && (
                  <a
                    href="javascript:void(0);"
                    className={s.modalCaptionLink}
                    onClick={() => nextPage('room')}
                  >
                    <FormattedMessage {...messages.change} />
                  </a>
                )}
              </Col>
              {step1 == 'completed' && (
                <Col xs={2} sm={2} md={2} lg={2}>
                  <span className={s.icon}>
                    <FontAwesome.FaCheckCircle />
                  </span>
                </Col>
              )}
              <Col xs={12} sm={12} md={12} lg={12}>
                <hr className={s.horizontalLineThrough} />
              </Col>
              <Col xs={12} sm={12} md={12} lg={12}>
                <strong className={s.step}>
                  <span>
                    <FormattedMessage {...messages.step2Heading} />
                  </span>
                </strong>
                <h3 className={s.landingContentTitle}>
                  <FormattedMessage {...messages.step2SubHeading} />
                </h3>
              </Col>
              <Col xs={10} sm={10} md={10} lg={10}>
                <p className={cx(s.landingTitleStep)}>
                  <span>
                    <FormattedMessage {...messages.step2HeadingContent} />
                  </span>
                </p>
                {step2 == 'active' && (
                  <Button
                    className={cx(s.button, s.btnPrimary)}
                    onClick={() => nextPage('photos')}
                  >
                    <FormattedMessage {...messages.continue} />
                  </Button>
                )}
                {step2 == 'completed' && !isPhotoAvailable && (
                  <Button
                    className={cx(s.button, s.btnPrimary)}
                    onClick={() => nextPage('photos')}
                  >
                    <FormattedMessage {...messages.addPhotos} />
                  </Button>
                )}
                {step2 == 'completed' && isPhotoAvailable && (
                  <a
                    href="javascript:void(0);"
                    className={s.modalCaptionLink}
                    onClick={() => nextPage('photos')}
                  >
                    <FormattedMessage {...messages.change} />
                  </a>
                )}
              </Col>
              {step2 == 'completed' && (
                <Col xs={2} sm={2} md={2} lg={2}>
                  <span className={s.icon}>
                    <FontAwesome.FaCheckCircle />
                  </span>
                </Col>
              )}
              <Col xs={12} sm={12} md={12} lg={12}>
                <hr className={s.horizontalLineThrough} />
              </Col>
              <Col xs={12} sm={12} md={12} lg={12}>
                <strong className={s.step}>
                  <span>
                    <FormattedMessage {...messages.step3Heading} />
                  </span>
                </strong>
                <h3 className={s.landingContentTitle}>
                  <FormattedMessage {...messages.step3SubHeading} />
                </h3>
              </Col>
              <Col xs={10} sm={10} md={10} lg={10}>
                <p className={cx(s.landingTitleStep)}>
                  <span>
                    <FormattedMessage {...messages.step3HeadingContent} />
                  </span>
                </p>
                {step3 == 'active' && (
                  <Button
                    className={cx(s.button, s.btnPrimary, s.space10)}
                    onClick={() => nextPage('guest-requirements')}
                  >
                    <FormattedMessage {...messages.continue} />
                  </Button>
                )}
                {step3 == 'completed' && (
                  <a
                    href="javascript:void(0);"
                    className={cx(s.modalCaptionLink, s.space10)}
                    onClick={() => nextPage('guest-requirements')}
                  >
                    <FormattedMessage {...messages.change} />
                  </a>
                )}
              </Col>
              {step3 == 'completed' && (
                <Col xs={2} sm={2} md={2} lg={2}>
                  <span className={cx(s.icon, s.space10)}>
                    <FontAwesome.FaCheckCircle />
                  </span>
                </Col>
              )}
            </Col>

            {/* <ListPlaceTips /> */}
            <Col xs={12} sm={5} md={5} lg={5} className={'hidden-xs'}>
              <div>
                <div>
                  <img src={defaultPic} className={s.imageSection} />
                </div>
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
const mapState = (state) => ({
  listingSteps: state.location.listingSteps,
  stepsLoading: state.location.stepsLoading,
  account: state.account.data,
  publishListLoading: state.location.publishListLoading,
  resendEmailLoading: state.loader.resendEmailLoading,
  isAdmin: state.user && state.user.admin ? true : false
});
const mapDispatch = {
  ManagePublishStatus,
  openImportReviewsModal,
  resendEmailVerification,
};
export default injectIntl(
  withStyles(s)(connect(mapState, mapDispatch)(ExistingPage1))
);
