
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Translation
import { injectIntl, FormattedMessage } from 'react-intl';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './CheckboxGroupFilterXs.css';
import {
  Button,
  Row,
  Col
} from 'react-bootstrap';
import cx from 'classnames';

// Redux Form
import { Field, reduxForm, formValueSelector, change, submit as submitForm } from 'redux-form';

// Redux
import { connect } from 'react-redux';

// Locale
import messages from '../../../../../locale/messages';

// Submit
import submit from '../../../SearchForm/submit';

import CustomCheckbox from '../../../../CustomCheckbox';

class CheckboxGroupFilterXs extends Component {

  static propTypes = {
    className: PropTypes.any,
    handleTabToggle: PropTypes.any,
  };

  static defaultProps = {
    fieldsSettingsData: {}, /* Object.defineProperty({}, searchFilterPropertyName, {
      value: []
    }), */
    searchFilterPropertyValues: []
  };

  constructor(props) {
    super(props);
  }

  checkboxHorizontalGroup = ({ label, name, options, input }) => {
    const { formatMessage } = this.props.intl;

    return (
      <div className={cx(s.displayTable)}>
        {
          options.map((option, index) => {
            if (option.isEnable !== "1") {
              return <span key={index} />
            }

            return (
              <div className={cx(s.displayTableRow)} key={option.id}>
                <div className={cx(s.displayTableCell, s.checkBoxSection, s.padding2)}>
                  <CustomCheckbox
                    key={index}
                    className={'icheckbox_square-green'}
                    name={`${input.name}[${index}]`}
                    value={option.id}
                    checked={input.value.indexOf(option.id) !== -1}
                    onChange={event => {
                      const newValue = [...input.value];
                      if (event === true) {
                        newValue.push(option.id);
                      } else {
                        newValue.splice(newValue.indexOf(option.id), 1);
                      }
                      input.onChange(newValue);
                    }}
                  />
                </div>
                <div className={cx(s.displayTableCell, s.captionTitle, s.padding2)}>
                  {option.itemName}
                </div>
              </div>
            )
          })
        }
      </div>
    )
  };

  render() {
    const { className, handleTabToggle, isExpand, searchFilterPropertyName } = this.props;
    const { fieldsSettingsData, searchFilterPropertyValues } = this.props;
    let searchFilterProperties;
    if (searchFilterPropertyName === 'kitchenType') {
      searchFilterProperties = [{ id: 'Vegan', itemName: 'Vegan', isEnable: '1' }, { id: 'Vegetarian', itemName: 'Vegetarian', isEnable: '1' }];
    } else if (searchFilterPropertyName === 'dietType') {
      const dietFilterProperties = fieldsSettingsData[searchFilterPropertyName];
      searchFilterProperties = dietFilterProperties && dietFilterProperties.map(item => {
        return {
          id: item.id,
          itemName: item.dietName,
          isEnable: item.isEnable ? '1' : '0'
        }
      })
    } else if (searchFilterPropertyName === 'category') {
      const retreatFilterProperties = fieldsSettingsData[searchFilterPropertyName];
      searchFilterProperties = retreatFilterProperties && retreatFilterProperties.map(item => {
        return {
          id: item.id,
          itemName: item.name,
          isEnable: '1'
        }
      })
    } else if (searchFilterPropertyName === 'meal') {
      const retreatFilterProperties = fieldsSettingsData[searchFilterPropertyName];
      searchFilterProperties = retreatFilterProperties && retreatFilterProperties.map(item => {
        return {
          id: item.id,
          itemName: item.mealType,
          isEnable: '1'
        }
      })
    } else {
      searchFilterProperties = fieldsSettingsData[searchFilterPropertyName];
    }
    const { formatMessage } = this.props.intl;

    return (
      <div className={className}>
        <p className={cx(s.captionTitle, s.space3, s.textBold, s.spaceTop1)}>
          <FormattedMessage {...messages['search' + searchFilterPropertyName.charAt(0).toUpperCase() + searchFilterPropertyName.slice(1)]} />
        </p>
        <div className={cx(s.displayTable, s.space4)}>
          <Field
            name={searchFilterPropertyName}
            component={this.checkboxHorizontalGroup}
            options={searchFilterProperties} />
        </div>
      </div>
    );
  }
}

CheckboxGroupFilterXs = reduxForm({
  form: 'SearchForm', // a unique name for this form
  onSubmit: submit,
  destroyOnUnmount: false,
})(CheckboxGroupFilterXs);

// Decorate with connect to read form values
const selector = formValueSelector('SearchForm'); // <-- same as form name

const mapState = (state, props) => ({
  fieldsSettingsData: { ...state.listingFields.data, dietType: state.diets.data, category: state.category.categories, meal: state.meal.meals },
  searchFilterPropertyValues: selector(state, props.searchFilterPropertyName)
});

const mapDispatch = {
  change,
  submitForm
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(CheckboxGroupFilterXs)));