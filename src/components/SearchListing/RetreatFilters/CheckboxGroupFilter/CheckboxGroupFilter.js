
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Translation
import { injectIntl, FormattedMessage } from 'react-intl';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './CheckboxGroupFilter.css';
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
import messages from '../../../../locale/messages';

// Submit
import submit from '../../SearchForm/submit';

import CustomCheckbox from '../../../CustomCheckbox';

class CheckboxGroupFilter extends Component {

  static propTypes = {
    className: PropTypes.any,
    handleTabToggle: PropTypes.any,
    isExpand: PropTypes.bool,
    searchFilterPropertyName: PropTypes.string.isRequired
  };

  static defaultProps = {
    isExpand: false,
    fieldsSettingsData: {}, /* Object.defineProperty({}, searchFilterPropertyName, {
      value: []
    }), */
    searchFilterPropertyValues: []
  };

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.setBtnWrapperRef = this.setBtnWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  async handleSubmit() {
    const { className, handleTabToggle, isExpand, searchFilterPropertyName } = this.props;
    const { change, submitForm } = this.props;
    await change('listType', 'retreats');
    await change('currentPage', 1);
    await submitForm('SearchForm');
    handleTabToggle(searchFilterPropertyName, !isExpand)
  }

  handleReset() {
    const { className, handleTabToggle, isExpand, searchFilterPropertyName } = this.props;
    const { change, submitForm } = this.props;
    change(searchFilterPropertyName, []);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  setBtnWrapperRef(node) {
    this.btnWrapperRef = node;
  }

  handleClickOutside(event) {
    const { className, handleTabToggle, isExpand, searchFilterPropertyName } = this.props;
    const { change, submitForm } = this.props;
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      change('listType', 'retreats');
      change('currentPage', 1);
      submitForm('SearchForm');
      if (this.btnWrapperRef && !this.btnWrapperRef.contains(event.target)) {
        handleTabToggle(searchFilterPropertyName, !isExpand)
      }
    }
  }

  checkboxHorizontalGroup = ({ label, name, options, input }) => {
    const { formatMessage } = this.props.intl;

    return (
      <div className={cx(s.displayTable)}>
        {
          options.map((option, index) => {

            if (option.isEnable !== "1") {
              return <span maxPrice />
            }
            let splitLineContent = option.itemDescription && option.itemDescription.split('\n');
            let newSplitLineContent = splitLineContent && splitLineContent.filter(function (el) { return el; });
            return (
              <div className={cx(s.displayTableRow)}>
                <div className={cx(s.displayTableCell, s.padding4, s.checkboxSection, s.NHtype)}>
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
                <div className={cx(s.displayTableCell, s.captionTitle, s.padding4, s.NhName)}>
                  {option.itemName}
                  <div>
                    {
                      newSplitLineContent && newSplitLineContent.length > 0 && newSplitLineContent.map((itemValue, indexes) => {
                        return (
                          <span><p className={s.dot} dangerouslySetInnerHTML={{ __html: itemValue }} />
                          </span>
                        )
                      })
                    }
                    {/* {option.itemDescription} */}
                  </div>
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
      if (retreatFilterProperties) {
        const categories = retreatFilterProperties.filter(item => item.parentId == 0);
        searchFilterProperties = categories && categories.map(item => {
          return {
            id: item.id,
            itemName: item.name,
            isEnable: '1'
          }
        })
      }
    } else if (searchFilterPropertyName === 'atmosphere') {
      const retreatFilterProperties = fieldsSettingsData[searchFilterPropertyName];
      searchFilterProperties = retreatFilterProperties && retreatFilterProperties.map(item => {
        return {
          id: item.id,
          itemName: item.itemName,
          isEnable: '1'
        }
      })
    } else if (searchFilterPropertyName === 'language') {
      const retreatFilterProperties = fieldsSettingsData[searchFilterPropertyName];
      searchFilterProperties = retreatFilterProperties && retreatFilterProperties.map(item => {
        return {
          id: item.id,
          itemName: item.name,
          isEnable: '1'
        }
      })
    } else if (searchFilterPropertyName === 'retreatOptions') {
      searchFilterProperties = [{
        id: 1,
        itemName: 'Meals included',
        isEnable: '1'
      }, {
        id: 2,
        itemName: 'Airport Pickup',
        isEnable: '1'
      }, {
        id: 3,
        itemName: 'Free cancellation',
        isEnable: '1'
      }]
    } else if (searchFilterPropertyName === 'retreatStyle') {
      const retreatFilterProperties = fieldsSettingsData[searchFilterPropertyName];
      searchFilterProperties = retreatFilterProperties && retreatFilterProperties.map(item => {
        return {
          id: item.id,
          itemName: item.itemName,
          isEnable: '1'
        }
      })
    } else if (searchFilterPropertyName === 'localInformation') {
      const retreatFilterProperties = fieldsSettingsData['area'];
      searchFilterProperties = retreatFilterProperties && retreatFilterProperties.map(item => {
        return {
          id: item.id,
          itemName: item.name,
          isEnable: '1'
        }
      })
    } else if (searchFilterPropertyName === 'skillLevel') {
      const retreatFilterProperties = fieldsSettingsData[searchFilterPropertyName];
      searchFilterProperties = retreatFilterProperties && retreatFilterProperties.map(item => {
        return {
          id: item.id,
          itemName: item.itemName,
          isEnable: '1'
        }
      })
    } else if (searchFilterPropertyName === 'meal') {
      let foods = fieldsSettingsData[searchFilterPropertyName];
      let names = foods.map(item=>item.mealType);
      names.sort();
      let results = [];
      for (let i = 0; i < names.length; i ++) {
        for (let j = 0; j < foods.length; j ++) {
          if (names[i] === foods[j].mealType) {
            results.push(foods[j]);
            break;
          }
        }
      }

      searchFilterProperties = results && results.map(item => {
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

    let buttonLabel = formatMessage(messages['search' + searchFilterPropertyName.charAt(0).toUpperCase() + searchFilterPropertyName.slice(1)]);

    let singleListingType;

    if (searchFilterPropertyValues && searchFilterPropertyValues.length > 0) {
      if (searchFilterPropertyValues.length > 1) {
        buttonLabel = buttonLabel + '	· ' + searchFilterPropertyValues.length;
      } else if (searchFilterPropertyValues.length == 1) {
        singleListingType = searchFilterProperties.filter((item) => { return item.id == searchFilterPropertyValues[0] });
        if (singleListingType && singleListingType.length > 0) {
          buttonLabel = singleListingType[0].itemName;
        } else {
          buttonLabel = buttonLabel + '	· ' + searchFilterPropertyValues.length;
        }
      }
    }

    return (
      <div className={className}>
        <div ref={this.setBtnWrapperRef}>
          <Button
            className={cx({ [s.btnSecondary]: (isExpand === true || searchFilterPropertyValues.length > 0) }, s.btn)}
            onClick={() => handleTabToggle(searchFilterPropertyName, !isExpand)}>
            {buttonLabel}
          </Button>
        </div>
        {
          isExpand && <div className={s.searchFilterPopover} ref={this.setWrapperRef}>
            <div className={s.searchFilterPopoverContent}>
              <Field
                name={searchFilterPropertyName}
                component={this.checkboxHorizontalGroup}
                options={searchFilterProperties} />
              <div className={cx(s.searchFilterPopoverFooter, s.displayTable)}>
                <div className={cx('text-left', s.displayTableCell)}>
                  {/* <Button
                    bsStyle="link"
                    className={cx(s.btnLink)}
                    onClick={this.handleReset}>
                    <FormattedMessage {...messages.clear} />
                  </Button> */}
                </div>
                <div className={cx('text-right', s.displayTableCell)}>
                  <Button
                    bsStyle="link"
                    className={cx(s.btnLink, s.btnLinkSecondary)}
                    onClick={this.handleSubmit}>
                    <FormattedMessage {...messages.apply} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

CheckboxGroupFilter = reduxForm({
  form: 'SearchForm', // a unique name for this form
  onSubmit: submit,
  destroyOnUnmount: false,
})(CheckboxGroupFilter);

// Decorate with connect to read form values
const selector = formValueSelector('SearchForm'); // <-- same as form name

const mapState = (state, props) => ({
  fieldsSettingsData: { ...state.listingFields.data, dietType: state.diets.data, category: state.category.categories, meal: state.meal.meals, area: state.area.areas, language: state.language.languages },
  searchFilterPropertyValues: selector(state, props.searchFilterPropertyName)
});

const mapDispatch = {
  change,
  submitForm
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(CheckboxGroupFilter)));
