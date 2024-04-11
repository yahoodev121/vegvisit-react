
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Translation
import { injectIntl, FormattedMessage } from 'react-intl';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Category.css';
import {
  Button, FormControl
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

const experienceCategories = [
  {id: '', name: 'All Categories'},
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


class Category extends Component {
  
  static propTypes = {
    className: PropTypes.any,
    handleTabToggle: PropTypes.any,
    isExpand: PropTypes.bool,
  };

  static defaultProps = {
    isExpand: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      experienceCategories: experienceCategories,
    }
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
    const { className, handleTabToggle, isExpand } = this.props;
    const { change, submitForm } = this.props;
    await change('currentPage', 1);
    submitForm('SearchForm');
    handleTabToggle('category', !isExpand)
  }

  handleReset() {
    const { className, handleTabToggle, isExpand } = this.props;
    const { change, submitForm } = this.props;
    change('category', null);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  setBtnWrapperRef(node) {
    this.btnWrapperRef = node;
  }

  handleClickOutside(event) {
    const { className, handleTabToggle, isExpand } = this.props;
    const { change, submitForm } = this.props;
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      change('currentPage', 1);
      submitForm('SearchForm');
      if (this.btnWrapperRef && !this.btnWrapperRef.contains(event.target)) {
        handleTabToggle('category', !isExpand)
      }
    }
  }

  renderFormControlSelect = ({ input, label, meta: { touched, error }, children, className }) => {
    const {formatMessage} = this.props.intl;
    return (
        <div>
          <FormControl componentClass="select" {...input} className={className} >
            {children}
          </FormControl>
        </div>
    )}

  render() {
    const { className, handleTabToggle, isExpand, searchSettings } = this.props;
    const {experienceCategories} = this.state;

    return (
      <div className={className}>
        <div ref={this.setBtnWrapperRef}>
          <Button 
            className={cx({ [s.btnSecondary]: (isExpand === true) }, s.btn)}
            onClick={() => handleTabToggle('category', !isExpand)}>
              Category
          </Button>
        </div>
        {
          isExpand && <div className={s.searchFilterPopover} ref={this.setWrapperRef}>
            <div className={s.searchFilterPopoverContent}>
              <Field name="category" component={this.renderFormControlSelect}>
                {
                  experienceCategories.map((value, key) => {
                    return <option value={value.id}
                                   key={key}>{value.name}</option>
                  })
                }
              </Field>
              <div className={cx(s.searchFilterPopoverFooter, s.displayTable)}>
                <div className={cx('text-left', s.displayTableCell)}>
                  {
                    /*priceRange && <Button
                      bsStyle="link"
                      className={cx(s.btnLink)}
                      onClick={this.handleReset}>
                      <FormattedMessage {...messages.clear} />
                    </Button>*/
                  }
                </div>
                <div className={cx('text-right', s.displayTableCell, s.mt10)}>
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

Category = reduxForm({
  form: 'SearchForm', // a unique name for this form
  onSubmit: submit,
  destroyOnUnmount: false,
})(Category);

// Decorate with connect to read form values
const selector = formValueSelector('SearchForm'); // <-- same as form name

const mapState = (state) => ({
  fieldsSettingsData: state.listingFields.data,
});

const mapDispatch = {
  change,
  submitForm
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(Category)));