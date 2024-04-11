import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './LocationMap.css';
import {
  Button,
  Grid,
  Row,
  Col,
  Collapse
} from 'react-bootstrap';
import cx from 'classnames';
import * as FontAwesome from 'react-icons/lib/fa';
// Redux
import { connect } from 'react-redux';

// Google Places Map Component
import ReactGoogleMapLoader from "react-google-maps-loader";
import {
  withGoogleMap,
  GoogleMap,
  Circle
} from "react-google-maps";

// Constants
import { googleMapAPI } from '../../../config';

// Locale
import messages from '../../../locale/messages';

import { capitalizeFirstLetter } from '../../../helpers/capitalizeFirstLetter';
import isValidNumber from '../../../helpers/isValidNumber';

const GoogleMapPlace =
  withGoogleMap(props => (
    <GoogleMap
      defaultZoom={14}
      center={props.center}
      defaultOptions={{
        backgroundColor: '',
        scrollwheel: false,
        maxZoom: 16,
        minZoom: 11,
        streetViewControl: false,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP
        },
        mapTypeControl: false,
      }}
    >
      <Circle
        center={props.center}
        radius={800}
        options={{
          fillColor: '#00d1c1',
          strokeColor: '#007A87',
        }}
      />
    </GoogleMap>
  ));


class LocationMap extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    formatMessage: PropTypes.any,
  };

  constructor(props) {
    super(props);

    const { data } = this.props;
    if (data && isValidNumber(data.lat) && isValidNumber(data.lng)) {
      let lat = data.lat;
      let lng = data.lng;
      this.state = {
        center: {
          lat: lat,
          lng: lng,
        },
        markers: null,
        open: false,
        smallDevice: false
      };
    } else {
      this.state = {
        center: {},
        markers: null,
        open: false,
        smallDevice: false
      }
    }
  
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({ open: !this.state.open })
  }

  render() {
    const { center } = this.state;
    const { data } = this.props;
    let firstName = data && data.user.profile && data.user.profile.firstName;
    let city = data.city;
    let state = data.state;
    let country = data.country;
    let neighbourhood = data.neighourhood;
    let count = 600, firstArray, restArray, dotString = false;
    if (neighbourhood) {
      firstArray = neighbourhood.slice(0, count);
      restArray = neighbourhood.slice(count, neighbourhood.length);
    }
    if (restArray && restArray.length > 0) {
      dotString = true;
    }
    return (
      <Row className={cx(s.pageContent)} >
        <Col xs={12} sm={12} md={12} lg={12}>
          <hr />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className={cx(s.space2, s.spaceTop3, s.horizontalLineThrough)}>
          <h1 className={cx(s.sectionTitleText, s.space2)}><FormattedMessage {...messages.neighbourHood} /></h1>
          {!this.state.open && count >= 150 && dotString === true &&
            <span className={cx(s.subText)}>  {firstArray && (firstArray.trim()).split("\n").map(function (item, index, paragraphs) {
              if (item !== '') {
                return (
                  <div key={index} className={s.space1}>
                    {item + (index < (paragraphs.length - 1) ? '' : '...')}
                  </div>
                )
              }
            })}</span>
          }
          {!this.state.open && count >= 150 && dotString === false &&
            <span className={cx(s.subText)}>  {firstArray && (firstArray.trim()).split("\n").map(function (item, index) {
              if (item !== '') {
                return (
                  <div key={index} className={s.space1}>
                    {item}
                  </div>
                )
              }
            })}</span>
          }
          {
            restArray && restArray.length > 0 &&
            <span>
              <Collapse in={this.state.open}>
                <div> <span className={s.subText}>
                  {neighbourhood && (neighbourhood.trim()).split("\n").map(function (item, index) {
                    if (item !== '') {
                      return (
                        <div key={index} className={s.space1}>
                          {item}
                        </div>
                      )
                    }
                  })}
                </span></div>
              </Collapse>
              {
                dotString && <div className={s.btnContainer}>
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
              }
            </span>
          }
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className={cx(s.space2)}>
          <p><span className={cx(s.text)}>{capitalizeFirstLetter(firstName)}'s{' '}<FormattedMessage {...messages.propertyLocated} />{' '}{city}, {state}, {country}</span></p>
          <div style={{ height: 350 }}>
            <ReactGoogleMapLoader
              params={{
                key: googleMapAPI, // Define your api key here
                libraries: "places,geometry"// To request multiple libraries, separate them with a comma
              }}
              render={googleMaps =>
                googleMaps && (
                  <GoogleMapPlace
                    containerElement={
                      <div style={{ width: '100%', height: `100%` }} />
                    }
                    mapElement={
                      <div style={{ width: '100%', height: `100%` }} />
                    }
                    center={center}
                    markers={{
                      position: new google.maps.LatLng(center.lat, center.lng)
                    }}
                  />
                )}
            />
          </div>
          <p className={s.spaceTop1}>
            <span className={cx(s.text)}><FormattedMessage {...messages.neighborhoodInfo} /></span>
          </p>
        </Col>
      </Row>
    );
  }
}

const mapState = (state) => ({

});

const mapDispatch = {
 
};

export default withStyles(s)(connect(mapState, mapDispatch)(LocationMap));
