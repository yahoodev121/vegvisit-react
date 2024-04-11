
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './CompanionAnimals.css';
import cx from 'classnames';

// Redux Form
import { Field, reduxForm, formValueSelector, change, submit as submitForm } from 'redux-form';

// Redux
import { connect } from 'react-redux';

// Locale
import messages from '../../../../../locale/messages';

// Submit
import submit from '../../../SearchForm/submit';

import Switch from '../../../../Switch/Switch';

class CompanionAnimals extends Component {

  static propTypes = {
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);
  }


  renderSwitch = ({ input, label, meta: { touched, error }, className }) => {
    const { formatMessage } = this.props.intl;
    const { change, petsAllowed } = this.props;
    
    return (
      <div>
        <Switch
          {...input}
          checked={petsAllowed == true}
          formName={'SearchForm'}
          fieldName={'petsAllowed'}
          checkedValue={true}
          unCheckedValue={false}
          isPersonalize={false}
        />
      </div>
    )
  }
 
  render() {
    const { className, petsAllowed } = this.props;
    const { formatMessage } = this.props.intl;

    return (
      <div className={className}>
        <div className={cx(s.displayTable)}>
          <div className={cx(s.displayTableCell)}>
            <label className={s.labelText}>{formatMessage(messages.searchCompanionAnimalsAllowed)}</label>
          </div>
          <div className={cx(s.displayTableCell, s.alignRight)}>
            <Field
              name="petsAllowed"
              component={this.renderSwitch}
            />
          </div>
        </div>
      </div>
    );
  }
}

CompanionAnimals = reduxForm({
  form: 'SearchForm', // a unique name for this form
  onSubmit: submit,
  destroyOnUnmount: false,
})(CompanionAnimals);

// Decorate with connect to read form values
const selector = formValueSelector('SearchForm'); // <-- same as form name

const mapState = (state) => ({
  fieldsSettingsData: state.listingFields.data,
  petsAllowed: selector(state, 'petsAllowed')
});

const mapDispatch = {
  change,
  submitForm
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(CompanionAnimals)));