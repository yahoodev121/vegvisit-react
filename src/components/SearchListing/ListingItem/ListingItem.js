import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { change, submit as submitForm, formValueSelector, reduxForm } from 'redux-form';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ListingItem.css';
import {
  Button,
  Grid,
  Row,
  Col,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Carousel,
} from 'react-bootstrap';
import cx from 'classnames';
import * as FontAwesome from 'react-icons/lib/fa';

import CurrencyConverter from '../../CurrencyConverter';
import ListingPhotos from '../ListingPhotos';
import StarRating from '../../StarRating';
import WishListIcon from '../../WishListIcon';

// Locale
import messages from '../../../locale/messages';

import { formatURL } from '../../../helpers/formatURL';

const experienceCategories = [
  {id: '', name: ''},
  {id: 1, name: 'Bed & Breakfast (B&B)'},
  {id: 2, name: 'City stays',},
  {id: 3, name: 'Nature stays',},
  {id: 4, name: 'Animal Sanctuaries',},
  {id: 5, name: 'Boutique Hotels and Hostels',},
  {id: 6, name: 'Outdoor Stays',},
  {id: 7, name: 'Wellness & Healing',},
  {id: 8, name: 'Adventurous Activities',},
  {id: 9, name: 'Culinary Experiences',},
  {id: 10, name: 'Local Immersion',},
  {id: 11, name: 'Skill Learning',},
]


class ListingItem extends React.Component {

  constructor(props) {
    super(props);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
    let category = experienceCategories.filter(item => item.id == props.experienceCategory);
    this.state = {
      experienceCategories: experienceCategories,
      category: category.length ? category[0].name : ''
    }
  }

  static propTypes = {
    formatMessage: PropTypes.func,
    id: PropTypes.number,
    basePrice: PropTypes.number,
    currency: PropTypes.string,
    title: PropTypes.string,
    beds: PropTypes.number,
    personCapacity: PropTypes.number,
    roomType: PropTypes.string,
    houseType: PropTypes.string,
    listPhotos: PropTypes.array,
    coverPhoto: PropTypes.number,
    bookingType: PropTypes.string.isRequired,
    reviewsCount: PropTypes.number,
    reviewsStarRating: PropTypes.number,
    wishListStatus: PropTypes.bool,
    isListOwner: PropTypes.bool,
    city: PropTypes.string,
    state: PropTypes.string,
    country: PropTypes.string
  };

  handleMouseOver(value) {
    const { change } = this.props;
    change('SearchForm', 'markerHighlight', { 'id': value, 'hover': 'true' });
  }

  handleMouseOut(value) {
    const { change } = this.props;
    change('SearchForm', 'markerHighlight', {});
  }

  render() {
    const { formatMessage } = this.props.intl;
    const {
      id,
      basePrice,
      currency,
      title,
      beds,
      personCapacity,
      roomType,
      houseType,
      coverPhoto,
      listPhotos,
      bookingType,
      reviewsCount,
      reviewsStarRating,
      wishListStatus,
      isListOwner,
      isMapShow, kitchentype,
      city,
      state,
      country,
      experienceCategory
    } = this.props;

    const {category} = this.state;


    let bedsLabel = formatMessage(messages.bed).toLowerCase();
    // let guestsLabel = formatMessage(messages.guest).toLowerCase();
    let heartIcon = 'heartIcon';
    if (beds > 1) {
      bedsLabel = formatMessage(messages.beds).toLowerCase();
    }

    /* if (personCapacity > 1) {
      guestsLabel = formatMessage(messages.guests).toLowerCase();
    } */
    let starRatingValue = 0;
    if (reviewsCount > 0 && reviewsStarRating > 0) {
      starRatingValue = Number(reviewsStarRating / reviewsCount)
    }
    let activeItem = 0, photoTemp, photosList = listPhotos.slice();
    if (listPhotos && listPhotos.length > 1) {
      listPhotos.map((x, y) => { if (x.id === coverPhoto) activeItem = y });
      if (activeItem > 0) {
        photoTemp = photosList[0];
        photosList[0] = photosList[activeItem];
        photosList[activeItem] = photoTemp;
      }
    }

    return (
      <div className={cx(s.listItemContainer)} onMouseOver={() => this.handleMouseOver(id)} onMouseOut={() => this.handleMouseOut(id)}>
        {
          !isListOwner && <WishListIcon listId={id} key={id} isChecked={wishListStatus} heartIcon={heartIcon} />
        }

        <ListingPhotos
          id={id}
          coverPhoto={coverPhoto}
          listPhotos={photosList}
          formatURL={formatURL}
          title={title}
          isMapShow={isMapShow}
        />
        <div className={s.listInfo}>
          <a className={s.listInfoLink} href={"/rooms/" + formatURL(title) + '-' + id} target={"_blank"}>
            <Row>
              <Col xs={12} sm={12} md={12} className={cx(s.textEllipsis, s.infoDesc, s.infoText, s.infoSpace)}>
                {
                  experienceCategory ? (
                    <div className={s.listingInfo}>
                      {category}
                    </div>
                  ) : ''
                }
                <div className={s.listingInfo}>
                  {roomType && <span>
                    <span>{roomType}</span>
                    <span>&nbsp;&#183;&nbsp;</span>
                  </span>
                  }
                  {houseType && <span>
                    <span>{houseType}</span>
                    <span>&nbsp;&#183;&nbsp;</span>
                  </span>
                  }
                  <span>{beds} {bedsLabel}</span>
                  {/* <span>&nbsp;&#183;&nbsp;</span>
                    <span>{personCapacity} {guestsLabel}</span> */}
                </div>
              </Col>
              <Col xs={12} sm={12} md={12} className={cx(s.textEllipsis, s.listingTitle)}>
                {title}
              </Col>
              <Col xs={12} sm={12} md={12} className={cx(s.textEllipsis, s.infoPrice, s.infoText, s.infoSpaceTop1)}>
                {
                  <CurrencyConverter
                    amount={basePrice}
                    from={currency}
                  />
                }
                {
                  bookingType === "instant" && <span><FontAwesome.FaBolt className={s.instantIcon} /></span>
                }
                {' '}<FormattedMessage {...messages.perNight} />
                {kitchentype && kitchentype != null && kitchentype != '' && <span className={s.beforeDot}> &nbsp;&#183;&nbsp;</span>}

                {kitchentype && kitchentype != null && kitchentype != '' && <span>{' '}{kitchentype}{' '}<FormattedMessage {...messages.kitchen} /></span>}

              </Col>
              <Col xs={12} sm={12} md={12} className={cx(s.textEllipsis, s.infoPrice, s.infoText, s.infoSpaceTop1)}>
                <span><FontAwesome.FaMapMarker className={s.locationIcon} />{city}, {state}, {country}</span>
              </Col>
              {reviewsCount > 0 && <Col xs={12} sm={12} md={12}
                className={cx(s.textEllipsis, s.infoReview, s.infoSpaceTop1)}
              >
                <div className={cx(s.reviewStar, 'small-star-rating')}>
                  <StarRating
                    value={starRatingValue}
                    name={'review'}
                    className={s.displayInline}
                    starColor={'#484848'}
                    emptyStarColor={'#cccccc'}
                  />
                  <span className={s.textInline}>&nbsp; {reviewsCount + ' '}{reviewsCount > 1 ? formatMessage(messages.reviews) : formatMessage(messages.review)}
                  </span>
                </div>

              </Col>}
            </Row>
          </a>
        </div>
      </div>
    );
  }
}

// export default injectIntl(withStyles(s)(ListingItem));
//export default injectIntl(withStyles(s)(ListingItem));

const mapState = (state) => ({
  isMapShow: state.personalized.showMap
});

const mapDispatch = {
  change
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(ListingItem)));