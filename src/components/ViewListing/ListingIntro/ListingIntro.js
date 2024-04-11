import React from 'react';
import PropTypes from 'prop-types';


// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ListingIntro.css';
import {
  Button,
  Grid,
  Row,
  Col,
  Form,
  FormGroup,
  FormControl,
  Label
} from 'react-bootstrap';
import cx from 'classnames';

// Translation
import { injectIntl, FormattedMessage } from 'react-intl';

// Locale
import messages from '../../../locale/messages';

// Component
import Avatar from '../../Avatar';
import StarRating from '../../StarRating';
import Link from '../../Link';

//Images
import HomeIcon from './home.svg';
import Building from './hotel.svg';
import User from './user.svg';
import Slumber from './slumber.svg';

class ListingIntro extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    formatMessage: PropTypes.any,
    reviewsCount: PropTypes.number.isRequired,
    reviewsStarRating: PropTypes.number.isRequired,
  };

  render() {
    const { data } = this.props;
    const { formatMessage } = this.props.intl;
    const { reviewsCount, reviewsStarRating } = this.props;
    let starRatingValue = 0;
    if (reviewsCount > 0 && reviewsStarRating > 0) {
      starRatingValue = Number(reviewsStarRating / reviewsCount)
    }
    let formattedAddress = '';
    if (data) {
      formattedAddress = [data.city, data.state, data.country].filter(item => item).join(', ');
    }

    let listingType = '';
    if (data && data.settingsData && data.settingsData.length > 0) {
      if (data.settingsData[0].listsettings && data.settingsData[0].listsettings.isEnable == "1" && data.settingsData[0].listsettings.itemName) {
        if (data.settingsData[0].listsettings.itemName == 'Entire Place' && data.settingsData[1] && data.settingsData[1].listsettings.isEnable == "1" && data.settingsData[1].listsettings.itemName) {
          listingType = `Entire ${data.settingsData[1].listsettings.itemName}`;
        } else {
          listingType = data.settingsData[0].listsettings.itemName;
          if (data.settingsData[1] && data.settingsData[1].listsettings.isEnable == "1" && data.settingsData[1].listsettings.itemName) {
            listingType += ` ${formatMessage(messages.in).toUpperCase()} ${data.settingsData[1].listsettings.itemName}`;
          }
        }
      }
    }

    return (
      <Row>
        <Col xs={12} sm={9} md={9} lg={9}>
          {
            data.listType !== "Retreats" && <h4 className={s.greenColor}>{listingType}</h4>
          }
          <h1 className={cx(s.titleText, s.space2)}>
            {data && data.title != null ? data.title : data && data.settingsData && data.settingsData.length > 0 && data.settingsData[0] && data.settingsData[0].listsettings && data.settingsData[0].listsettings.itemName + ' ' + formatMessage(messages.in) + ' ' + data.city}
          </h1>
          <div className={cx(s.space3, 'hidden-xs')}>
            <a className={s.textMuted}>{formattedAddress}</a>
          </div>
          <div className={cx(s.space2, 'visible-xs')}>
            <div className={s.displayTable}>
              <div className={cx(s.displayTableCell, s.vrAlignBottom)}>
                <a className={s.textMuted}>{formattedAddress}</a>
                <div >
                  <span><StarRating name={'review'} value={starRatingValue} /></span>
                </div>
              </div>
              <div className={s.displayTableCell}>
                <div className={cx(s.profileAvatarSection, s.mobileBg)}>
                  <Avatar
                    source={data.user.profile.picture}
                    type={"small"}
                    title={data.user.profile.firstName}
                    className={s.profileAvatar}
                    withLink
                    linkClassName={s.profileAvatarLink}
                    profileId={data.user.profile.profileId}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* <div className={cx(s.space2, 'hidden-xs')}>
            <span><StarRating name={'review'} value={starRatingValue} /></span>
          </div> */}

          {/* <div className={cx(s.displayTable)}>
            <div className={s.displayTableRow}>
              <div className={cx(s.displayTableCell, s.listingIntroWidth, s.responsiveListIngIntro)}>
                <div className={cx(s.displayTable)}>
                  <div className={s.displayTableRow}>
                    <div className={s.displayTableCellIcon}>
                      <img src={HomeIcon} className={s.overviewIcon} />
                    
                    </div>
                    <div className={cx(s.displayTableCell, s.introTextPadding)}>
                      <div className={cx(s.textMutedNew)}>Room Type</div>
                      <div>{data.settingsData && data.settingsData.length > 0 && data.settingsData[0].listsettings.itemName}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={cx(s.displayTableCell, s.responsiveListIngIntro)}>
                <div className={cx(s.displayTable, s.tableMarginTop)}>
                  <div className={s.displayTableRow}>
                    <div className={s.displayTableCellIcon}>
                      <img src={User} className={s.overviewIcon} />
                    </div>
                    <div className={cx(s.displayTableCell, s.introTextPadding)}>
                      <div className={cx(s.textMutedNew)}>
                        Guest
                      </div>
                      <div>
                        {data.personCapacity} {data.personCapacity > 1 ? formatMessage(messages.guests) : formatMessage(messages.guest)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={cx(s.displayTable)}>
            <div className={s.displayTableRow}>
              <div className={cx(s.displayTableCell, s.listingIntroWidth, s.responsiveListIngIntro)}>
                <div className={cx(s.displayTable, s.tableMarginTop)}>
                  <div className={s.displayTableRow}>
                    <div className={s.displayTableCellIcon}>
                      <img src={Building} className={s.overviewIcon} />
                      <i class="fa fa-chair"></i>
                    </div>
                    <div className={cx(s.displayTableCell, s.introTextPadding)}>
                      <div className={cx(s.textMutedNew)}>
                        Bedroom
                      </div>
                      <div>
                        {data.bedrooms} {data.bedrooms > 1 ? formatMessage(messages.bedrooms) : formatMessage(messages.bedroom)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={cx(s.displayTableCell, s.responsiveListIngIntro)}>
                <div className={cx(s.displayTable, s.tableMarginTop)}>
                  <div className={s.displayTableRow}>
                    <div className={s.displayTableCellIcon}>
                      <img src={Slumber} className={s.overviewIcon} />
                      <i class="fa fa-bath"></i>
                    </div>
                    <div className={cx(s.displayTableCell, s.introTextPadding)}>
                      <div className={cx(s.textMutedNew)}>
                        Bed
                      </div>
                     
                      <div>
                        {data.beds} {data.beds > 1 ? formatMessage(messages.beds) : formatMessage(messages.bed)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>*/}

        </Col>
        <Col xs={12} sm={3} md={3} lg={3} className={'hidden-xs'}>
          <div className={cx(s.profileAvatarSection, s.mobileBg)}>
            <Avatar
              source={data.user.profile.picture}
              type={"small"}
              height={115}
              width={115}
              title={data.user.profile.firstName}
              className={s.profileAvatar}
              withLink
              linkClassName={s.profileAvatarLink}
              profileId={data.user.profile.profileId}
            />
          </div>
          <p className={cx('text-center')}>
            <Link to={"/users/show/" + data.user.profile.profileId}>
              <span className={cx(s.textMuted)}>
                {data.user.profile.firstName}
              </span>
            </Link>
          </p>
        </Col>
        {
          data.listType === "Retreats" ? (
            <Col xs={12} sm={12} md={12} lg={12}>
              <div className={s.displayFlex}>
                {data.listingRetreat && data.listingRetreat.numberSeats && 
                  <div>
                    <i className={cx("fa fa-users", s.icons)}></i>
                    <span className={s.margiRight}>
                      Up to {data.listingRetreat.numberSeats} in group
                    </span>
                  </div>
                }
              </div>
              {data.listingRetreat && data.listingRetreat.category &&
                <div>
                  <Label bsStyle="primary">{data.listingRetreat.category.name}</Label>
                </div>
              }
            </Col>
          ) : (
            <Col xs={12} sm={12} md={12} lg={12}>
              <div className={s.displayFlex}>
                {/* { data.settingsData &&
                  <div>
                    <i className={cx("fa fa-users",s.icons)}></i>
                    <span className={s.margiRight}>{data.settingsData && data.settingsData.length > 0 && data.settingsData[0].listsettings.itemName}</span>
                  </div>
                } */}

                {data.personCapacity &&
                  <div>
                    <i className={cx("fa fa-users", s.icons)}></i>
                    <span className={s.margiRight}>
                      {data.personCapacity} {data.personCapacity > 1 ? formatMessage(messages.guests) : formatMessage(messages.guest)}
                    </span>
                  </div>
                }
                {data.bedrooms == 0 &&
                  <div>
                    {/* <i className={cx("fa fa-bed",s.icons)}></i> */}
                    <i className={cx("fa fa-chair", s.icons)}></i>
                    <span className={s.margiRight}>
                      Studio
                    </span>

                  </div>
                }
                {data.bedrooms != 0 &&
                  <div>
                    {/* <i className={cx("fa fa-bed",s.icons)}></i> */}
                    <i className={cx("fa fa-chair", s.icons)}></i>
                    <span className={s.margiRight}>
                      {data.bedrooms} {data.bedrooms > 1 ? formatMessage(messages.bedrooms) : formatMessage(messages.bedroom)}
                    </span>

                  </div>
                }
                {
                  <div>
                    <i className={cx("fa fa-bed", s.icons)}></i>
                    <span className={s.margiRight}>
                      {data.beds} {(data.beds > 1 || data.beds == 0) ? formatMessage(messages.beds) : formatMessage(messages.bed)}
                    </span>

                  </div>
                }
                {
                  <div>
                    <i className={cx("fa fa-bath", s.icons)}></i>
                    <span className={s.margiRight}>
                      {data.bathrooms == 0 && <span>0 Bathrooms</span>}
                      {
                        data.bathrooms != 0 && <span>
                          {data.bathrooms}
                          {data.settingsData && data.settingsData[0] && data.settingsData[0].settingsId === 76 ? (data.settingsData[4] && data.settingsData[4].settingsId === 157 ? <span> Shared </span> : <span> Private </span>) : false}
                          {data.bathrooms > 1 ? <span> Baths </span> : <span> Bath </span>}
                        </span>
                      }
                    </span>
                  </div>
                }
                {data.kitchen &&
                  <div>
                    <i className={cx("fa fa-seedling", s.icons)}></i>
                    <span className={s.margiRight}>
                      {data.kitchen} Kitchen
                    </span>
                  </div>
                }

              </div>
            </Col >
          )
        }
      </Row>
    );
  }
}

export default injectIntl(withStyles(s)(ListingIntro));
