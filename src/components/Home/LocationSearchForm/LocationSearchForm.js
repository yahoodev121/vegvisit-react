
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

// Redux
import { connect } from 'react-redux';

// Translation
import { FormattedMessage, injectIntl } from 'react-intl';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './LocationSearchForm.css';

import { Field, reduxForm } from 'redux-form';

import {
  Button,
  Form,
  Grid,
  Row, FormGroup,
  Col,
  ControlLabel,
  FormControl,
  FieldGroup,
  Panel,
} from 'react-bootstrap';
import cx from 'classnames';
import * as FontAwesome from 'react-icons/lib/fa';
import ReactGoogleMapLoader from "react-google-maps-loader";

// History
import history from '../../../core/history';

// Components
import PlaceGeoSuggest from '../PlaceGeoSuggest';

// Redux Action
import { getSpecificSettings } from '../../../actions/getSpecificSettings';
import { setPersonalizedValues } from '../../../actions/personalized';

// Helper
import detectMobileBrowsers from '../../../helpers/detectMobileBrowsers';

// Locale
import messages from '../../../locale/messages';

// Config
import { googleMapAPI } from '../../../config';


class LocationSearchForm extends React.Component {
  static propTypes = {
    setPersonalizedValues: PropTypes.any.isRequired,
    getSpecificSettings: PropTypes.any.isRequired,
    personalized: PropTypes.shape({
      location: PropTypes.string,
      lat: PropTypes.number,
      lng: PropTypes.number,
      chosen: PropTypes.number,
      startDate: PropTypes.string,
      endDate: PropTypes.string,
      personCapacity: PropTypes.number,
      formatMessage: PropTypes.any,
    }),
    settingsData: PropTypes.shape({
      listSettings: PropTypes.array.isRequired
    }).isRequired
  };

  static defaultProps = {
    listingFields: []
  };


  static defaultProps = {
    personalized: {
      location: null,
      lat: null,
      lng: null,
      startDate: null,
      endDate: null,
      personCapacity: null,
      chosen: null
    },
    settingsData: {
      listSettings: []
    }
  };

  constructor(props) {
    super(props);

    const { getSpecificSettings, listingFields } = this.props;
    // Get PersonCapacity Settings Data
    //getSpecificSettings(2);
    let mobileDevice = false;
    let roomType = [];
    let personCapacity = [];
    if (detectMobileBrowsers.isMobile() === true) {
      mobileDevice = true;
    }
    if (listingFields != undefined) {
      roomType = listingFields.roomType;
      personCapacity = listingFields.personCapacity;
    }
    this.state = {
      mobileDevice: mobileDevice,
      personCapacity: personCapacity,
      roomType: roomType
    };

    this.handleClick = this.handleClick.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    const { listingFields } = props;
    if (listingFields != undefined && (!_.isEqual(listingFields.roomType, state.roomType) || !_.isEqual(listingFields.personCapacity, state.personCapacity))) {
      return {
        roomType: listingFields.roomType,
        personCapacity: listingFields.personCapacity
      };
    } else {
      return null;
    }
  }

  handleClick() {
    const { personalized, setPersonalizedValues } = this.props;
    let updatedURI, uri = '/s?';

    if (personalized.chosen != null) {
      uri = uri + '&address=' + personalized.location + '&chosen=' + personalized.chosen;
    } else {
      if (personalized.location != null) {
        uri = uri + '&address=' + personalized.location;
      }
    }

    updatedURI = encodeURI(uri);
    history.push(updatedURI);
  }

  render() {

    const { location, dates, settingsData, setPersonalizedValues, personalized, listingFields } = this.props;
    const { formatMessage } = this.props.intl;
    const { personCapacity } = this.state;
    let rows = []; const isBrowser = typeof window !== 'undefined';

    const smallDevice = isBrowser ? window.matchMedia('(max-width: 640px)').matches : undefined;

    return (
      <div>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <form>
              <div className={cx(s.searchFormContainer, 'homeSearchForm', 'homeLocationSearchForm')}>
                <div className={s.searchForm}>
                  <div className={cx(s.displayTable)}>
                    <div className={cx(s.displayTableRow)}>
                      <div className={cx(s.displayTableCell, s.locationSection)}>
                        <div className={cx(s.displayTable)}>
                          <div className={cx(s.displayTableRow)}>
                            <div className={cx(s.searchIconContainer, s.displayTableCell)}>
                              <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true" 
                                  focusable="false" className={s.searchIcon}>
                                  <path d="m10.4 18.2c-4.2-.6-7.2-4.5-6.6-8.8.6-4.2 4.5-7.2 8.8-6.6 4.2.6 7.2 4.5 6.6 8.8-.6 4.2-4.6 7.2-8.8 6.6m12.6 3.8-5-5c1.4-1.4 2.3-3.1 2.6-5.2.7-5.1-2.8-9.7-7.8-10.5-5-.7-9.7 2.8-10.5 7.9-.7 5.1 2.8 9.7 7.8 10.5 2.5.4 4.9-.3 6.7-1.7v.1l5 5c .3.3.8.3 1.1 0s .4-.8.1-1.1"></path>
                              </svg>
                            </div>
                            <div className={cx(s.locationTableCell, s.displayTableCell)}>
                              <ReactGoogleMapLoader
                                params={{
                                  key: googleMapAPI, // Define your api key here
                                  libraries: "places", // To request multiple libraries, separate them with a comma
                                }}
                                render={googleMaps =>
                                  googleMaps && (
                                    <PlaceGeoSuggest
                                      label={formatMessage(messages.homeWhere)}
                                      className={cx(s.formControlInput, s.input)}
                                      containerClassName={s.geoSuggestContainer}
                                    />)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={cx(s.searchBtnContainer)}>
                        <Button className={cx(s.btn, s.btnPrimary, s.btnBlock, s.btnLarge)} onClick={this.handleClick}>
                          <span className={cx('hidden-lg hidden-md')}><FontAwesome.FaSearch /></span>
                          <span className={cx('hidden-sm hidden-xs')}>
                            <FormattedMessage {...messages.search} />
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </Col>
        </Row>
      </div>
    );
  }
}

LocationSearchForm = reduxForm({
  form: 'SearchForm', // a unique name for this form
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})(LocationSearchForm);

const mapState = (state) => ({
  personalized: state.personalized,
  settingsData: state.viewListing.settingsData,
  listingFields: state.listingFields.data,
});

const mapDispatch = {
  getSpecificSettings,
  setPersonalizedValues
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(LocationSearchForm)));
