import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
// External Component
import moment from 'moment';
// Style
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  Button,
  Row,
  Col,
  ProgressBar, Checkbox,
} from 'react-bootstrap';
import s from './ListItem.css';
import * as FontAwesome from 'react-icons/lib/fa';
// For Redirect
import history from '../../../core/history';
// Component
import ListCoverPhoto from '../../ListCoverPhoto';
import PublishOption from './PublishOption';
import Link from '../../Link';
// Redux
import { connect } from 'react-redux';
// Redux action
import { removeListing } from '../../../actions/removeListing';
// Locale
import messages from '../../../locale/messages';
import log from '../../../helpers/clientLog';
class ListItem extends React.Component {
  static propTypes = {
    formatMessage: PropTypes.any,
  };
  constructor(props) {
    super(props);
    this.state = {
      isRemove: false,
      isPublished: false,
    };
    this.openRemoveList = this.openRemoveList.bind(this);
    this.closeRemoveList = this.closeRemoveList.bind(this);
  }

  async updatePublishStatus(status) {
    const {data} = this.props;
    console.log('update-item:', data);
    const query = `query (
      $listId: Int,
      $isPublished: Int
    ) {
        updateListingPublished (
          listId: $listId,
          isPublished: $isPublished,
        ) {
          status
          id
        }
      }`;

    const resp = await fetch('/graphql', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: query,
        variables: {
          listId: data.id,
          isPublished: status
        }
      }),
      credentials: 'include'
    }).catch((error) => {
      console.log('update-publish-error:', error);
    });
    const { res } = await resp.json().catch((error) => {
      console.log('update-publish-error:', error);
    });
  }

  componentDidMount() {
    const {data} = this.props;
    this.setState({isPublished: data.isPublished});
  }

  percentage(data) {
    let totalPercentage = 100;
    let percentage = 0;
    let step1Percentage = 0, step2Percentage = 0, step2PhotosPercentage = 0, step3Percentage = 0;
    let step1 = (data && data.listingSteps) ? data.listingSteps.step1 : null;
    let step2 = (data && data.listingSteps) ? data.listingSteps.step2 : null;
    let step3 = (data && data.listingSteps) ? data.listingSteps.step3 : null;
    let listPhotos = data.listPhotos;
    if (data) {
      if (data.listType === 'Retreats') {
        let percent = 0;
        // console.log('list-item:', data);
        let listingRetreat = data.listingRetreat;
        if (listPhotos) { percent += 4;}
        if (listingRetreat.RetreatStyle) { percent += 2;}
        if (listingRetreat.atmospheres) { percent += 2;}
        if (listingRetreat.yogaTypes) { percent += 2;}
        if (listingRetreat.skillLevels) { percent += 2;}
        if (listingRetreat.languageId) { percent += 2;}
        if (listingRetreat.benefits) { percent += 2;}
        if (listingRetreat.summary) { percent += 2;}
        if (listingRetreat.reviews) { percent += 2;}
        if (listingRetreat.showType) { percent += 2;}
        if (listingRetreat.includes) { percent += 2;}
        if (listingRetreat.not_includes) { percent += 2;}
        if (listingRetreat.special) { percent += 2;}
        if (listingRetreat.full_description) { percent += 2;}
        if (listingRetreat.meal) { percent += 2;}
        if (listingRetreat.drink) { percent += 2;}
        if (listingRetreat.food) { percent += 2;}
        if (listingRetreat.currency) { percent += 2;}
        if (listingRetreat.periodType) { percent += 2;}
        if (listingRetreat.retreat_dates) { percent += 2;}
        if (listingRetreat.duration) { percent += 2;}
        if (listingRetreat.min_days) { percent += 2;}
        if (listingRetreat.isAllowPayment) { percent += 2;}
        if (listingRetreat.isDepositOnly) { percent += 2;}
        if (listingRetreat.isCash) { percent += 2;}
        if (listingRetreat.isCredit) { percent += 2;}
        if (listingRetreat.isBank) { percent += 2;}
        if (listingRetreat.accommodations) { percent += 2;}
        if (listingRetreat.teachers) { percent += 2;}
        if (listingRetreat.cancellationPolicy) { percent += 2;}
        if (listingRetreat.deposit_refundable) { percent += 2;}
        if (listingRetreat.refund_before_days_100) { percent += 2;}
        if (listingRetreat.refund_before_days_50) { percent += 2;}
        if (listingRetreat.pay_remain_balance) { percent += 2;}
        if (listingRetreat.retreat_before_days) { percent += 2;}
        if (listingRetreat.allow_flexibility) { percent += 2;}
        if (listingRetreat.use_increase_booking) { percent += 2;}
        if (listingRetreat.free_gift_name) { percent += 2;}
        if (listingRetreat.free_gift_desc) { percent += 2;}
        if (listingRetreat.itinerary) { percent += 2;}
        if (listingRetreat.localInfoDesc) { percent += 2;}
        if (listingRetreat.seasonalInformation) { percent += 2;}
        if (listingRetreat.travelHelp) { percent += 2;}
        if (listingRetreat.localInformation) { percent += 2;}
        if (listingRetreat.facilityFeatures) { percent += 2;}

        return percent;
      } else {
        if (step1 === "active") {
          step1Percentage = 0.20;
        }
        if (step1 === "completed") {
          step1Percentage = 0.30;
        }
        if (step2 === "completed") {
          step2Percentage = 0.20;
        }
        if (listPhotos.length > 0) {
          step2PhotosPercentage = 0.10;
        }
        if (step3 === "completed") {
          step3Percentage = 0.40;
        }
      }
    }
    percentage = step1Percentage + step2Percentage + step2PhotosPercentage + step3Percentage;
    return Number(totalPercentage * percentage);
  }
  title(data) {
    if (data) {
      if (data.title != null) {
        return data.title
      } else if (data.settingsData && data.settingsData.length > 0 && data.city) {
        return data.settingsData[0].listsettings.itemName + " in " + data.city;
      }
    }
  }
  handlePreview(listId) {
    if (listId) {
      history.push('/rooms/' + listId + '/preview');
    }
  }
  handleEditListing(listId) {
    if (listId) {
      const { data } = this.props;
      if (data.listType === 'Retreats') {
        history.push('/retreats/' + listId + '/edit');
      } else {
        history.push('/become-a-host/' + listId + '/home');
      }
    }
  }
  handleRemoveListing(listId) {
    const { removeListing } = this.props;
    removeListing(listId);
    this.setState({ isRemove: false });
  }
  openRemoveList() {
    this.setState({ isRemove: true });
  }
  closeRemoveList() {
    this.setState({ isRemove: false });
  }
  removeItem(listId) {
    return (
      <li className={s.panelBodyAlert}>
        <div className={cx(s.alertBlock)}>
          <Row>
            <Col xs={12} xsOffset={0} smOffset={1} sm={10} mdOffset={1} md={10} lgOffset={1} lg={10}>
              <p className={cx(s.h5, s.spaceTop5)}>
                <span><FormattedMessage {...messages.deleteListing} /></span>
              </p>
              <p className={cx(s.spaceTop2, s.alertText)}>
                <span><FormattedMessage {...messages.deleteListingInfo} /></span>
              </p>
              <Col xs={12} sm={12} md={12} lg={12} className={s.noPadding}>
                <Button
                  className={cx(s.button, s.btnPrimary, s.btnlarge, s.spaceTop4, s.spaceRight2, s.smButton)}
                  onClick={() => this.handleRemoveListing(listId)}>
                  <FormattedMessage {...messages.delete} />
                </Button>
                <Button
                  className={cx(s.button, s.btnPrimaryBorder, s.btnlarge, s.spaceTop4, s.smButton)}
                  onClick={this.closeRemoveList}>
                  <FormattedMessage {...messages.goBack} />
                </Button>
              </Col>
            </Col>
          </Row>
        </div>
      </li>
    )
  }
  render() {
    const { isRemove, isPublished } = this.state;
    const { data } = this.props;
    let updatedDate = moment(data.updatedAt).format('Do MMMM YYYY');
    let listId = data.id;
    let coverPhoto = data.coverPhoto;
    let listPhotos = data.listPhotos;
    if (isRemove) {
      return this.removeItem(listId);
    } else {
      return (
        <li className={s.panelBody} >
          <Row>
            <Col xs={12} sm={12} className={cx('hidden-md hidden-lg', s.space2)}>
              <a href="javascript:void(0);" onClick={this.openRemoveList}>
                <FontAwesome.FaClose className={cx(s.iconRemove, s.icon, 'pull-right')} />
              </a>
            </Col>
            <Col xs={12} sm={12} md={5} lg={5}>
              <div className={s.listPhotoCover}>
                <div className={s.listPhotoMedia}>
                  <a target="_blank" href={"/rooms/" + listId + "/preview"}>
                    <ListCoverPhoto
                      className={s.imgResponsive}
                      coverPhoto={coverPhoto}
                      listPhotos={listPhotos}
                      photoType={"x_medium"}
                    />
                  </a>
                </div>
              </div>
            </Col>
            <Col xs={12} sm={12} md={7} lg={7} className={s.listDetailContent}>
              <a href="javascript:void(0);" onClick={this.openRemoveList}>
                <FontAwesome.FaClose className={cx(s.iconRemove, s.icon, "hidden-sm hidden-xs", 'pull-right')} />
              </a>
              <Col xs={12} sm={12} md={10} lg={10} className={cx(s.noPadding, s.spaceTop2)}>
                <ProgressBar
                  bsClass={s.leanProgressBar}
                  className={s.leanProgressContainer}
                  now={this.percentage(data)}
                />
                <span className={s.labelText}><FormattedMessage {...messages.progressBarText1} /> {this.percentage(data)}% <FormattedMessage {...messages.progressBarText2} /></span>
              </Col>
              <Col xs={12} sm={12} md={10} lg={10} className={cx(s.noPadding, s.spaceTop2)}>
                <div className={s.listingInfo}>
                  {data.listType}
                </div>
                <a target="_blank" href={"/rooms/" + listId + "/preview"}>
                  <span className={s.listContent}> {this.title(data)}</span>
                </a>
              </Col>
              <Col xs={12} sm={12} md={10} lg={10} className={cx(s.noPadding, s.spaceTop2)}>
                <span className={s.landingStep}><FormattedMessage {...messages.listingUpdateInfo} /> {updatedDate}</span>
              </Col>
              <Col xs={12}>
                <Button className={cx(s.button, s.btnPrimary, s.spaceRight2, s.spaceTop3, s.smButton)} onClick={() => this.handleEditListing(listId)}>
                  {
                    data &&  data.listType === 'Retreats' && <span><FormattedMessage {...messages.editListing} /></span>
                  }
                  {
                    data && data.listingSteps && data.listType !== 'Retreats' && data.listingSteps.step3 === "completed" && listPhotos.length > 0 && <span><FormattedMessage {...messages.editListing} /></span>
                  }
                  {
                    data && data.listingSteps && data.listType !== 'Retreats' && data.listingSteps.step3 === "completed" && listPhotos.length <= 0 && <span><FormattedMessage {...messages.finishListing} /></span>
                  }
                  {
                    ((data && data.listingSteps && data.listType !== 'Retreats' && data.listingSteps.step3 !== "completed") || (!(data && data.listingSteps && data.listingSteps.step3) && data.listType !== 'Retreats')) && <span><FormattedMessage {...messages.finishListing} /></span>
                  }
                </Button>

                <div style={{float: 'right', marginTop: '28px'}}>
                  <Checkbox inline onChange={e => {
                    console.log(e.target.checked)
                    this.setState({isPublished: e.target.checked});
                    this.updatePublishStatus(e.target.checked);
                  }} checked={isPublished}>
                    Publish
                  </Checkbox>
                </div>
              </Col>


              {
                data && data.listingSteps && data.isReady &&  <a
                href={"/rooms/" + listId + "/preview"}
                target="_blank"
                className={cx('btn btn-default', s.button, s.btnPrimaryBorder, s.spaceTop3, s.smButton)}
              >
                <FormattedMessage {...messages.preview} />
              </a>
              }

              {
                data && data.isReady && data.user.userBanStatus != 1 && <PublishOption
                  listId={listId}
                  isPublished={data.isPublished}
                />
              }
            </Col>
          </Row>
        </li>
      );
    }
  }
}
const mapState = (state) => ({
});
const mapDispatch = {
  removeListing
};
export default withStyles(s)(connect(mapState, mapDispatch)(ListItem));
