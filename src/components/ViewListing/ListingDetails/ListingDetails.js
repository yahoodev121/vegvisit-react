import React from 'react';
import PropTypes from 'prop-types';
// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ListingDetails.css';
import {
  Button,
  Row,
  Col,
  Collapse,
  Label
} from 'react-bootstrap';
import cx from 'classnames';
import * as FontAwesome from 'react-icons/lib/fa';
// Translation
import { injectIntl, FormattedMessage } from 'react-intl';
// Locale
import messages from '../../../locale/messages';
// Redux
import { connect } from 'react-redux';
// Redux Action
import { getSpecificSettings } from '../../../actions/getSpecificSettings';
import { contactHostOpen } from '../../../actions/message/contactHostModal';
// Helper functions
import { formattingTime, checkIn, checkValue } from './helper';
import { generateCheckInString } from '../../../helpers/checkInHelper';
// Internal Component
import ListItem from './ListItem';
import Link from '../../Link';

import ListBedTypes from './ListBedTypes';
import HouseRulesDetails from './HouseRulesDetails';
import ServiceDetails from './ServiceDetails';

const options = { month: 'long', day: 'numeric' };
const dateFormatter = new Intl.DateTimeFormat('en-US', options);

class ListingDetails extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      listingData: PropTypes.shape({
        cancellation: PropTypes.shape({
          policyName: PropTypes.string.isRequired,
          policyContent: PropTypes.string.isRequired
        })
      })
    }),
    getSpecificSettings: PropTypes.any,
    settingsData: PropTypes.object,
    isHost: PropTypes.bool.isRequired,
    formatMessage: PropTypes.any,
    userBanStatus: PropTypes.number,
    inquiry: PropTypes.bool,
    info: PropTypes.string
  };
  static defaultProps = {
    isHost: false,
    description: []
  };

  constructor(props) {
    super(props);
    this.state = {
      open: false,
    }
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    const { inquiry, contactHostOpen, data, info } = this.props;
    if (inquiry && data && data.id) { // Coming from booking page and all data (email, phone) checked
      contactHostOpen(data.id, inquiry);
    } else if (info === 'inquiry' && data.id) { // Coming from verification mail, phone number to be checked
      contactHostOpen(data.id, false);
    }
  }

  handleClick() {
    this.setState({ open: !this.state.open })
  }


  render() {
    const { data, contactHostOpen, isHost, userBanStatus } = this.props;
    console.log("here is data prop:", data);
    const { open } = this.state;
    const { formatMessage } = this.props.intl;
    let minNight, maxNight, checkInStart, checkInEnd, propertyType, roomType;
    let highlights, category, startDate, endDate, numberSeats, searchResultsBulletpoints, retreatAbout, itinerary, accommodation, meals;
    let userAmenities = [], userSafetyAmenities = [], amenities = [];
    let sharedSpaces = [], houseRules = [], bedTypes = [], listBedTypes = [];
    let description, personCapacity, bathrooms, bedrooms, beds, aboutPlaces, aboutKitchen, neighbourhood, notes;
    let bathroomType;
    let listType;
    let userServices, additionalRules, moreDetails;
    if (data.listingData != undefined) {
      minNight = checkValue(data.listingData.minNight, 0);
      maxNight = checkValue(data.listingData.maxNight, 0);
      checkInStart = checkValue(data.listingData.checkInStart, '');
      checkInEnd = checkValue(data.listingData.checkInEnd, '');
      additionalRules = checkValue(data.listingData.additionalRules, '');
    }
    if (data.listingRetreat != undefined) {
      highlights = checkValue(data.listingRetreat.highlights, '');
      category = checkValue(data.listingRetreat.category, '');
      startDate = checkValue(data.listingRetreat.startDate, '');
      endDate = checkValue(data.listingRetreat.endDate, '');
      numberSeats = checkValue(data.listingRetreat.numberSeats, 0);
      searchResultsBulletpoints = checkValue(data.listingRetreat.searchResultsBulletpoints, '');
      retreatAbout = checkValue(data.listingRetreat.about, '');
      itinerary = checkValue(data.listingRetreat.itinerary, '');
      accommodation = checkValue(data.listingRetreat.accommodation, '');
      meals = checkValue(data.listingRetreat.meals, []);
    }
    if (data.settingsData != undefined && data.settingsData.length > 0) {
      propertyType = checkValue(data && data.settingsData && data.settingsData.length > 0 && data.settingsData[1] && data.settingsData[1].listsettings && data.settingsData[1].listsettings.itemName, '');
      roomType = checkValue(data && data.settingsData && data.settingsData.length > 0 && data.settingsData[0] && data.settingsData[0].listsettings && data.settingsData[0].listsettings.itemName, '');
      bathroomType = checkValue(data && data.settingsData && data.settingsData.length > 0 && data.settingsData[4] && data.settingsData[4].listsettings && data.settingsData[4].listsettings.itemName, '');
    }
    if (data) {
      sharedSpaces = checkValue(data.userSpaces, []);
      houseRules = checkValue(data.houseRules, []);
      userAmenities = checkValue(data.userAmenities, []);
      userServices = checkValue(data.userServices, []);
      userSafetyAmenities = checkValue(data.userSafetyAmenities, []);
      description = checkValue(data.description, '');
      personCapacity = checkValue(data.personCapacity, 0);
      bathrooms = checkValue(data.bathrooms, 0);
      bedrooms = checkValue(data.bedrooms, 0);
      beds = checkValue(data.beds, 0);
      bedTypes = checkValue(data.userBedsTypes, []);
      listBedTypes = checkValue(data.listBedTypes, []);
      moreDetails = checkValue(data.moreDetails, '');
      aboutPlaces = checkValue(data.aboutPlaces, '');
      aboutKitchen = checkValue(data.aboutKitchen, '');
      neighbourhood = checkValue(data.neighbourhood, '');
      notes = checkValue(data.notes, '');
      listType = checkValue(data.listType, '');
    }

    let count = 150, firstArray, restArray, dotString = false;
    if (description) {
      firstArray = description.slice(0, count);
      restArray = description.slice(count, description.length);
    }
    if (restArray && restArray.length > 0) {
      dotString = true;
    }

    return (
      <Row className={cx(s.pageContent)}>
        {
          highlights !== '' && (
            <Col xs={12} sm={12} md={12} lg={12} className={cx(s.horizontalLineThrough)}>
              <h2 className={cx(s.sectionTitleText)}> Highlights </h2>
              <div>
                <ul className={s.highlights}>
                  {
                    JSON.parse(highlights).map(item => (
                      <li>
                        <span>{item}</span>
                      </li>
                    ))
                  }
                </ul>
              </div>
              <hr />
            </Col>
          )
        }
        <Col xs={12} sm={12} md={12} lg={12} className={cx(s.horizontalLineThrough)}>
          <h2 className={cx(s.sectionTitleText)}>
            {
              listType === 'Retreats' ?
                <FormattedMessage {...messages.aboutListingRetreat} /> :
                <FormattedMessage {...messages.aboutListing} />
            }
          </h2>
          <div>
            <p className={s.listingFontSize}>
              {
                listType === 'Retreats' ?
                  retreatAbout && (retreatAbout.trim()).split("\n").map(function (item, index) {
                    return (
                      <p key={index}>
                        {item}
                      </p>
                    )
                  }) :
                  description && (description.trim()).split("\n").map(function (item, index) {
                    return (
                      <p key={index}>
                        {item}
                      </p>
                    )
                  })
              }
            </p>
            {listType !== 'retreats' && (aboutPlaces || aboutKitchen || notes) &&
              <React.Fragment>
                <Collapse in={open}>
                  <div>
                    {
                      aboutPlaces &&
                      <div>
                        <p className={cx(s.textMutedNew, s.noMargin)}>The space</p>
                        {
                          aboutPlaces && (aboutPlaces.trim()).split("\n").map(function (item, index) {
                            return (
                              <span key={index}>
                                <p> {item}</p>
                              </span>
                            )
                          })
                        }
                        {/* <p>{aboutPlaces}</p> */}
                      </div>
                    }
                    {
                      aboutKitchen &&
                      <div>
                        <p className={cx(s.textMutedNew, s.noMargin)}>The kitchen</p>
                        {
                          aboutKitchen && (aboutKitchen.trim()).split("\n").map(function (item, index) {
                            return (
                              <span key={index}>
                                <p> {item}</p>
                              </span>
                            )
                          })
                        }
                        {/* <p>{aboutKitchen}</p> */}
                      </div>
                    }
                    {
                      notes &&
                      <div>
                        <p className={cx(s.textMutedNew, s.noMargin)}>Other things to note</p>
                        {
                          notes && (notes.trim()).split("\n").map(function (item, index) {
                            return (
                              <span key={index}>
                                <p> {item}</p>
                              </span>
                            )
                          })
                        }
                        {/* <p>{notes}</p> */}
                      </div>
                    }
                  </div>
                </Collapse>
                <div className={s.btnContainer}>
                  <div className={s.showHidePadding}>
                    <Button
                      bsStyle="link"
                      className={cx(s.button, s.noPadding, s.btnLInk, s.showHideBtn)}
                      onClick={() => this.handleClick()}
                    >
                      {this.state.open ? <FormattedMessage {...messages.hideViewListing} /> : <FormattedMessage {...messages.showReadMore} />}

                      {
                        this.state.open && <FontAwesome.FaAngleUp className={s.navigationIcon} />
                      }

                      {
                        !this.state.open && <FontAwesome.FaAngleDown className={s.navigationIcon} />
                      }
                    </Button>
                  </div>
                </div>
              </React.Fragment>
            }
          </div>
          {
            !isHost && !userBanStatus && <div className={cx(s.spaceTop3, s.space4)}><p>
              <a href="javascript:void(0)" className={cx(s.sectionCaptionLink, s.sectionLink)} onClick={() => contactHostOpen(data.id)} >
                <FormattedMessage {...messages.contactHost} />
              </a>
            </p>
            </div>
          }
          <hr />
        </Col>
        {
          itinerary && (
            <Col xs={12} sm={12} md={12} lg={12} className={cx(s.horizontalLineThrough)}>
              <h2 className={cx(s.sectionTitleText)}> Itinerary </h2>
              <div>
                {
                  itinerary && (itinerary.trim()).split("\n").map(function (item, index) {
                    return (
                      <p key={index}>
                        {item}
                      </p>
                    )
                  })
                }
              </div>
              <hr />
            </Col>
          )
        }
        {
          accommodation && (
            <Col xs={12} sm={12} md={12} lg={12} className={cx(s.horizontalLineThrough)}>
              <h2 className={cx(s.sectionTitleText)}> Accommodation </h2>
              <div>
                {
                  accommodation && (accommodation.trim()).split("\n").map(function (item, index) {
                    return (
                      <p key={index}>
                        {item}
                      </p>
                    )
                  })
                }
              </div>
              <hr />
            </Col>
          )
        }
        {
          meals.length > 0 && (
            <Col xs={12} sm={12} md={12} lg={12} className={cx(s.horizontalLineThrough)}>
              <h2 className={cx(s.sectionTitleText)}> Meals </h2>
              <Row>
                {
                  meals.map(function (meal, index) {
                    return (
                      <Col sm={12} md={4} key={index} className={s.mealItem}>
                        <img alt={meal.mealType} src={meal.mealIcon}></img>
                        <span>
                          {meal.mealType}
                        </span>
                      </Col>
                    )
                  })
                }
              </Row>
              <hr />
            </Col>
          )
        }
        {
          listType !== 'Retreats' && (
            <Col xs={12} sm={12} md={12} lg={12} className={cx(s.horizontalLineThrough)}>
              <Row>
                <Col xs={12} sm={12} md={12} lg={12} className={cx(s.space1)}>
                  <p className={cx(s.textMutedNew, s.titleResizeFont)}><FormattedMessage {...messages.theSpace} /></p>
                </Col>
                <Col xs={12} sm={12} md={12} lg={12} className={cx(s.spaceTop1)}>
                  <Row>
                    <Col md={12} lg={12}>
                      <p className={s.splitList}>
                        <span className={cx(s.text)} >
                          <FormattedMessage {...messages.accommodates} />: <strong className={s.spaceFontSize}>{personCapacity}</strong>
                        </span>
                      </p>
                      <p className={s.splitList}>
                        <span className={cx(s.text)}>
                          {/* <FormattedMessage {...messages.bathrooms} />: <strong>{bathrooms}</strong> */}
                          <FormattedMessage {...messages.bathrooms} />:{' '}
                          <strong className={s.spaceFontSize}>
                            {data.bathrooms == 0 && <span>0 Bathrooms</span>}
                            {
                              data.bathrooms != 0 && <span>
                                {data.bathrooms}
                                {data.settingsData && data.settingsData[0] && data.settingsData[0].settingsId === 76 ? (data.settingsData[4] && data.settingsData[4].settingsId === 157 ? <span> Shared </span> : <span> Private </span>) : false}
                                {data.bathrooms > 1 ? <span> Baths </span> : <span> Bath </span>}
                              </span>
                            }
                          </strong>
                        </span>
                      </p>
                      {/* <p className={s.splitList}>
                    <span className={cx(s.text)}>
                      <FormattedMessage {...messages.bathroomType} />: <strong>{bathroomType}</strong>
                    </span>
                  </p> */}
                      {
                        bedrooms == 0 && <p className={s.splitList}>
                          <span className={cx(s.text)}>
                            <FormattedMessage {...messages.bedrooms} />: <strong className={s.spaceFontSize}>Studio</strong>
                          </span>
                        </p>
                      }
                      {
                        bedrooms != 0 && <p className={s.splitList}>
                          <span className={cx(s.text)}>
                            <FormattedMessage {...messages.bedrooms} />: <strong className={s.spaceFontSize}>{bedrooms}</strong>
                          </span>
                        </p>
                      }

                      {/* <p>
                    <span className={cx(s.text)}>
                      <FormattedMessage {...messages.beds} />: <strong>{beds}</strong>
                    </span>
                  </p> */}

                      <p className={s.splitList}>
                        <span className={cx(s.text)}>
                          <FormattedMessage {...messages.checkIn} />: <strong className={s.spaceFontSize}>{generateCheckInString(checkInStart, checkInEnd, messages, formatMessage)}</strong>
                        </span>
                      </p>
                      <p className={s.splitList}>
                        <span className={cx(s.text)}>
                          <FormattedMessage {...messages.propertyType} />: <strong className={s.spaceFontSize}>{propertyType}</strong>
                        </span>
                      </p>
                      <p className={s.splitList}>
                        <span className={cx(s.text)}>
                          <FormattedMessage {...messages.roomType} />: <strong className={s.spaceFontSize}>{roomType}</strong>
                        </span>
                      </p>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <hr />
            </Col>
          )
        }
        {
          listType !== 'Retreats' && (
            <Col xs={12} sm={12} md={12} lg={12} className={cx(s.horizontalLineThrough)}>
              <Row>
                <Col xs={12} sm={12} md={12} lg={12} className={cx(s.space1)}>
                  <p className={cx(s.textMutedNew, s.titleResizeFont)}><FormattedMessage {...messages.theKitchen} /></p>
                </Col>
                <Col xs={12} sm={12} md={12} lg={12} className={cx(s.spaceTop1)}>
                  <Row>
                    <Col md={12} lg={12}>
                      <p className={s.splitList}>
                        <span className={cx(s.text)} >
                          <FormattedMessage {...messages.kitchenType} />: <strong className={s.spaceFontSize}>{data.kitchen}</strong>
                        </span>
                      </p>
                      {data.nonVeg === 'Yes' &&
                        <p className={s.splitList}>
                          <span className={cx(s.text)} >
                            <FontAwesome.FaExclamationCircle className={s.warningIcon} />
                            <strong className={s.spaceFontSize}>Contains non-vegetarian pet food</strong>
                          </span>
                        </p>
                      }
                    </Col>
                  </Row>
                </Col>
              </Row>
              <hr />
            </Col>
          )
        }
        {
          listType !== 'Retreats' && listBedTypes && listBedTypes.length > 0 && listBedTypes[0].bedType && <div> <ListBedTypes
            itemList={listBedTypes}
            label={formatMessage(messages.beds)}
          />
            <Col xs={12} sm={12} md={12} lg={12}>
              <hr />
            </Col>
          </div>
        }

        {
          listType !== 'Retreats' && sharedSpaces && sharedSpaces.length > 0 && <div> <ListItem
            itemList={sharedSpaces}
            label={formatMessage(messages.sharedSpaces)}
            showLabel={formatMessage(messages.viewAllDescription)}
            hideLabel={formatMessage(messages.hideViewListing)}
          />
            <Col xs={12} sm={12} md={12} lg={12}>
              <hr />
            </Col>
          </div>
        }

        {
          listType !== 'Retreats' && userAmenities && userAmenities.length > 0 && <div> <ListItem
            itemList={userAmenities}
            label={formatMessage(messages.aminities)}
            showLabel={formatMessage(messages.viewAllDescription)}
            hideLabel={formatMessage(messages.hideViewListing)}
          />
            <Col xs={12} sm={12} md={12} lg={12}>
              <hr />
            </Col>
          </div>
        }
        {
          /* <Col xs={12} sm={12} md={8} lg={8} className={cx(s.space2, s.horizontalLineThrough)}>
          <Row>
            <Col xs={12} sm={3} md={3} lg={3} className={cx(s.space1, s.spaceTop1)}>
              <p className={s.textMuted}> <FormattedMessage {...messages.prices} /> </p>
            </Col>
            <Col xs={12} sm={9} md={9} lg={9} className={cx(s.space1,s.spaceTop1)}>
              <Row>
                <Col md={6} lg={6}>
                  <p>
                    <span className={cx(s.text)}>
                      <FormattedMessage {...messages.extraPeople} />: <strong><FormattedMessage {...messages.noCharge} /></strong>
                    </span>
                  </p>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col> */
        }

        {
          listType !== 'Retreats' && ((houseRules && houseRules.length > 0) || additionalRules) && <div> <ServiceDetails
            itemList={houseRules}
            details={additionalRules}
            label={formatMessage(messages.houseRules)}
            showLabel={formatMessage(messages.readAllDescription)}
            hideLabel={formatMessage(messages.hideViewListing)}
            listItemCount={4}
          />
            <Col xs={12} sm={12} md={12} lg={12}>
              <hr />
            </Col>
          </div>
        }

        {
          listType !== 'Retreats' && ((userServices && userServices.length > 0) || moreDetails) && <div> <HouseRulesDetails
            itemList={userServices}
            details={moreDetails}
            label={formatMessage(messages.additionalServicesone)}
            showLabel={formatMessage(messages.readMoreDescription)}
            hideLabel={formatMessage(messages.hideViewListing)}
            listItemCount={6}
          />
            <Col xs={12} sm={12} md={12} lg={12}>
              <hr />
            </Col>
          </div>
        }


        {
          listType !== 'Retreats' && data && data.listingData && data.listingData.cancellation && <Col xs={12} sm={12} md={12} lg={12} className={cx(s.horizontalLineThrough)}>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12} className={cx(s.space1)}>
                <p className={cx(s.textMutedNew, s.titleResizeFont)}><FormattedMessage {...messages.cancellations} /></p>
              </Col>
              <Col xs={12} sm={12} md={12} lg={12} className={cx(s.spaceTop1)}>
                <Row>
                  <Col md={12} lg={12}>
                    <p className={s.listingFontSize}>
                      <span className={cx(s.text)}><strong>{data.listingData.cancellation.policyName}</strong></span>
                    </p>
                    <p className={s.listingFontSize}>
                      <span className={cx(s.text)}>{data.listingData.cancellation.policyContent}</span>
                    </p>
                    <div className={cx(s.listingFontSize, s.showHideMargin)}>
                      <Link
                        to={"/cancellation-policies/" + data.listingData.cancellation.policyName}
                        className={cx(s.sectionCaptionLink)}
                      >
                        <FormattedMessage {...messages.viewDetails} />
                      </Link>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
            <hr />
          </Col>
        }

        {
          listType !== 'Retreats' && userSafetyAmenities.length > 0 && <div><ListItem
            itemList={userSafetyAmenities}
            label={formatMessage(messages.safetyFeatures)}
            showLabel={formatMessage(messages.viewAllDescription)}
            hideLabel={formatMessage(messages.hideViewListing)}
          />
            <Col xs={12} sm={12} md={12} lg={12}>
              <hr />
            </Col>
          </div>
        }

        {
          listType !== 'Retreats' && ((minNight != null && minNight && minNight > 0) || (maxNight != null && maxNight > 0)) && <Col xs={12} sm={12} md={12} lg={12}>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12} className={cx(s.space1)}>
                <p className={cx(s.textMutedNew, s.titleResizeFont)}> <FormattedMessage {...messages.availability} /> </p>
              </Col>
              <Col xs={12} sm={12} md={12} lg={12} className={cx(s.spaceTop1)}>
                <Row>
                  <Col md={12} lg={12}>
                    {
                      minNight != null && minNight > 0 &&
                      <p className={s.listingFontSize}><span className={cx(s.text)}> <strong>{minNight} {minNight > 1 ? 'nights' : 'night'}{' '}</strong>
                        <FormattedMessage {...messages.minimumStay} />
                      </span>
                      </p>
                    }
                    {
                      maxNight != null && maxNight > 0 &&
                      <p className={s.listingFontSize}><span className={cx(s.text)}> <strong>{maxNight} {maxNight > 1 ? 'nights' : 'night'}{' '}</strong>
                        <FormattedMessage {...messages.maximumNightStay} />
                      </span>
                      </p>
                    }
                  </Col>
                </Row>
              </Col>
            </Row>
            <hr />
          </Col>
        }
      </Row>
    );
  }
}
const mapState = (state) => ({
  settingsData: state.viewListing.settingsData,
});
const mapDispatch = {
  getSpecificSettings,
  contactHostOpen
};
export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(ListingDetails)));