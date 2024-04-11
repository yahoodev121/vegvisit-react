
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Translation
import { injectIntl, FormattedMessage } from 'react-intl';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Duration.css';
import {
  Button
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

import DurationRange from '../../../DurationRange';

class Duration extends Component {

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
    await change('listType', 'retreats');
    await change('currentPage', 1);
    submitForm('SearchForm');
    handleTabToggle('duration', !isExpand)
  }

  handleReset() {
    const { className, handleTabToggle, isExpand } = this.props;
    const { change, submitForm } = this.props;
    change('durationRange', null);
    change('durationRangeLabel', undefined);
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
      change('listType', 'retreats');
      change('currentPage', 1);
      submitForm('SearchForm');
      if (this.btnWrapperRef && !this.btnWrapperRef.contains(event.target)) {
        handleTabToggle('duration', !isExpand)
      }
    }
  }

  renderDurationRange = ({ input, min, max, minDuration, maxDuration }) => {
    return (
      <div className={cx(s.durationRangeContainer, s.space4)}>
        <DurationRange
          {...input}
          min={min}
          max={max}
          minDuration={minDuration}
          maxDuration={maxDuration}
        />
      </div>
    )
  }

  render() {
    const { className, handleTabToggle, isExpand, searchSettings } = this.props;
    const { durationRangeLabel, durationRange } = this.props;
    const { formatMessage } = this.props.intl;

    let minDurationRange = durationRangeLabel != undefined ? durationRangeLabel[0] : 2;
    let maxDurationRange = durationRangeLabel != undefined ? durationRangeLabel[1] : 30;

    return (
      <div className={className}>
        <p className={cx(s.captionTitle, s.space4)}>
          {minDurationRange} Days
          <span>{' - '}</span>
          {maxDurationRange}{maxDurationRange < 30 ? '' : '+'} Days
        </p>
        <Field
          name="durationRange"
          component={this.renderDurationRange}
          min={2}
          max={30}
          minDuration={minDurationRange}
          maxDuration={maxDurationRange}
        />
      </div>
    );
  }
}

Duration = reduxForm({
  form: 'SearchForm', // a unique name for this form
  onSubmit: submit,
  destroyOnUnmount: false,
})(Duration);

// Decorate with connect to read form values
const selector = formValueSelector('SearchForm'); // <-- same as form name

const mapState = (state) => ({
  fieldsSettingsData: state.listingFields.data,
  durationRangeLabel: selector(state, 'durationRangeLabel'),
  durationRange: selector(state, 'durationRange'),
});

const mapDispatch = {
  change,
  submitForm
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(Duration)));