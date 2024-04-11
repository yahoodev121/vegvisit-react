
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

// Redux
import { connect } from 'react-redux';

// Translation
import { FormattedMessage, injectIntl } from 'react-intl';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './RetreatSearchForm.css';

import { Field, reduxForm } from 'redux-form';

import {
  Button,
  Form,
  Grid,
  Row, FormGroup,
  Col,
  ControlLabel,
  FormControl,
  MenuItem,
  Dropdown,
  FieldGroup,
  Panel,
} from 'react-bootstrap';

import { FaCheck } from "react-icons/lib/fa";
import cx from 'classnames';
import * as FontAwesome from 'react-icons/lib/fa';

// History
import history from '../../../core/history';


// Components
import DateRange from '../../Home/DateRange/DateRange';
import PlaceGeoSuggest from '../../Home/PlaceGeoSuggest/PlaceGeoSuggest';
import MobileDateRange from '../../Home/MobileDateRange/MobileDateRange';


// Redux Action
import { getSpecificSettings } from '../../../actions/getSpecificSettings';
import { getCategoriesData } from '../../../actions/getCategories';
import { setPersonalizedValues } from '../../../actions/personalized';

// Helper
import detectMobileBrowsers from '../../../helpers/detectMobileBrowsers';

// Locale
import messages from '../../../locale/messages';


class RetreatSearchForm extends React.Component {
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
    }).isRequired,
    categories: PropTypes.array.isRequired
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

    const { getSpecificSettings, listingFields, setPersonalizedValues, getCategoriesData } = this.props;
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
      roomType: roomType,
      openCategory: false,
      openGuests: false,
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleSearchTypeClick = this.handleSearchTypeClick.bind(this);

    getCategoriesData();
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
    let updatedURI, uri = '/s?listType=' + personalized.searchType;

    if (personalized.chosen != null) {
      uri = uri + '&address=' + personalized.location + '&chosen=' + personalized.chosen;
    } else {
      if (personalized.location != null) {
        uri = uri + '&address=' + personalized.location;
      }
    }

    if (personalized.startDate != null && personalized.endDate != null) {
      uri = uri + '&startDate=' + personalized.startDate + '&endDate=' + personalized.endDate;
    }

    // if (personalized.searchType == 'retreats' && personalized.category != null) {
    //   uri = uri + '&category=' + personalized.category;
    // }

    if ((personalized.searchType == 'stays' || personalized.searchType == 'stays_with') && personalized.personCapacity != null && !isNaN(personalized.personCapacity)) {
      uri = uri + '&guests=' + personalized.personCapacity;
    }

    updatedURI = encodeURI(uri);
    history.push(updatedURI);
  }

  handleSearchTypeClick(type) {
    const { setPersonalizedValues } = this.props;
    setPersonalizedValues({ name: 'searchType', value: type });
  }

  componentDidUpdate(prevProps, prevState) {
    const { personalized } = this.props;
    if (prevProps.personalized !== personalized) {
      if (prevProps.personalized.location !== personalized.location && personalized.chosen) {
        if (personalized.searchType === "retreats") {
          this.setState({
            openCategory: true,
          })
        }
      }
      if (prevProps.personalized.endDate !== personalized.endDate) {
        if (personalized.searchType !== "retreats") {
          this.setState({
            openGuests: true
          })
        }
      }
    }
  }

  render() {

    const { location, dates, settingsData, setPersonalizedValues, personalized, listingFields, categories } = this.props;
    const { formatMessage } = this.props.intl;
    const { personCapacity } = this.state;
    let rows = []; const isBrowser = typeof window !== 'undefined';
    // for (let i= 1; i <= 16; i++) {
    //   rows.push(<option value={i} key={i}>{i} {i>1 ? 'guests' : 'guest'}</option>);
    // }

    let startValue, endValue;
    if (personCapacity && personCapacity[0] && personCapacity[0].startValue) {
      for (let i = personCapacity[0].startValue; i <= personCapacity[0].endValue; i++) {
        rows.push(
          <MenuItem eventKey={i} active={personalized.personCapacity == i}>{i} {i > 1 ? 'guests' : 'guest'}</MenuItem>
        );
        startValue = personCapacity[0].startValue;
        endValue = personCapacity[0].endValue;
      }
    }
    const smallDevice = isBrowser ? window.matchMedia('(max-width: 640px)').matches : undefined;

    return (
      <Row className={s.fullWidth}>
        <Col xs={12} sm={12} md={12} lg={12} className={s.pad0}>
          <form>
            <div
              className={cx(s.searchFormInputs, "homeSearchForm vidSearchForm")}
            >
              <div className={s.searchForm}>
                <div className={cx(s.formRow, personalized.searchType === 'retreats' && s.marginH)}>
                  <div className={cx(s.formItem, s.location)}>
                    <label className={s.label}>
                      <span>
                        <FormattedMessage {...messages.where} />
                      </span>
                    </label>
                    <PlaceGeoSuggest
                      label={formatMessage(messages.homeWhere)}
                      className={cx(s.formControlInput, s.input)}
                      containerClassName={s.geoSuggestContainer}
                    />
                  </div>
                  <Button
                    className={cx(
                      s.btnSearchLg,
                      s.btn,
                      s.btnSearch,
                      s.btnCircle
                    )}
                    onClick={this.handleClick}
                  >
                    <span>
                      <FontAwesome.FaSearch />
                    </span>
                  </Button>
                  <Button
                    className={cx(
                      s.btnSearchSm,
                      s.btn,
                      s.btnSearch,
                      s.btnRound
                    )}
                    onClick={this.handleClick}
                  >
                    <span>
                      <FormattedMessage {...messages.search} />
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Col>
      </Row>
    );
  }
}
RetreatSearchForm = reduxForm({
  form: 'RetreatSearchForm', // a unique name for this form
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})(RetreatSearchForm);

const mapState = (state) => ({
  personalized: state.personalized,
  settingsData: state.viewListing.settingsData,
  listingFields: state.listingFields.data,
  categories: state.category.categories,
});

const mapDispatch = {
  getSpecificSettings,
  getCategoriesData,
  setPersonalizedValues
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(RetreatSearchForm)));
