
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ShowMap.css';
import {
  Button
} from 'react-bootstrap';
import cx from 'classnames';

// Redux Form
import { Field, reduxForm, formValueSelector, change, submit as submitForm } from 'redux-form';

import { setPersonalizedValues } from '../../../../actions/personalized';

// Redux
import { connect } from 'react-redux';

// Locale
import messages from '../../../../locale/messages';

// Submit
import submit from '../../SearchForm/submit';

import Switch from '../../../Switch';

class ShowMap extends Component {

  constructor(props) {
    super(props);
  }


  renderSwitch = ({ input, label, meta: { touched, error }, className, min, max, rangeCurrency }) => {
    const { formatMessage } = this.props.intl;
    const { change, showMap, setPersonalizedValues } = this.props;
    
    return (
      <div>
        <Switch
          {...input}
          checked={showMap == true}
          formName={'SearchForm'}
          fieldName={'showMap'}
          checkedValue={true}
          unCheckedValue={false}
          isPersonalize={true}
          personalizedName={'showMap'}
          onClick={() => {
            setPersonalizedValues('showMap', !showMap);
          }}
        />
      </div>
    )
  }
 
  render() {
    const { className, showMap, setPersonalizedValues } = this.props;

    return (
      <div className={className}>
        <div className={cx(s.displayTable)}>
          <div className={cx(s.displayTableCell)}>
            <label className={s.labelText}>Show Map </label>
          </div>
          <div className={cx(s.displayTableCell)}>
            <Switch
              checked={showMap == true}
              formName={'SearchForm'}
              fieldName={'showMap'}
              checkedValue={true}
              unCheckedValue={false}
              isPersonalize={true}
              personalizedName={'showMap'}
              onClick={() => {
                setPersonalizedValues('showMap', !showMap);
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

ShowMap = reduxForm({
  form: 'SearchForm', // a unique name for this form
  onSubmit: submit,
  destroyOnUnmount: false,
})(ShowMap);

// Decorate with connect to read form values
const selector = formValueSelector('SearchForm'); // <-- same as form name

const mapState = (state) => ({
  fieldsSettingsData: state.listingFields.data,
  showMap: state.personalized.showMap
});

const mapDispatch = {
  change,
  submitForm,
  setPersonalizedValues
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(ShowMap)));