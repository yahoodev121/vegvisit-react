// General
import React from 'react';
import PropTypes from 'prop-types';

// Translation
import { injectIntl } from 'react-intl';

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Button } from 'react-bootstrap';
import s from './IncrementBtn.css';
import * as FontAwesome from 'react-icons/lib/fa';

class IncrementBtn extends React.Component {
  static propTypes = {
    maxValue: PropTypes.number,
    minValue: PropTypes.number,
    labelSingluar: PropTypes.string,
    labelPlural: PropTypes.string,
    incrementBy: PropTypes.number,
    value: PropTypes.string,
    onChange: PropTypes.any
  };

  constructor(props) {
    super(props);

    this.state = {
      value: 1
    }

    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    const { input } = props;
    if (input && input.value != undefined && Number(input.value) !== state.value) {
      return {
        value: Number(input.value)
      };
    } else {
      return null;
    }
  }

  increment = () => {
    const { input, maxValue, incrementBy, onChange } = this.props;
    const { value } = this.state;
    let currentValue = value;

    if (value < maxValue) {
      currentValue = Number(value) + Number(incrementBy)
      this.setState({
        value: currentValue
      });
      onChange(currentValue);
      return input.onChange(Number(currentValue));
    }
  }

  decrement = () => {
    const { input, minValue, incrementBy, onChange } = this.props;
    const { value } = this.state;
    let currentValue = value;

    if(value > minValue) {
      currentValue = Number(value) - Number(incrementBy)
      this.setState({
        value: currentValue
      });
      onChange(currentValue);
      return input.onChange(Number(currentValue));
    }
  }

  render() {
    const { input, onChange, maxValue, minValue, labelSingluar, labelPlural, incrementBy } = this.props;
    const { formatMessage } = this.props.intl;
    const { value } = this.state;

    let label;
    if(value == 0 || value > 1) {
      label = labelPlural;
    } else {
       label = labelSingluar; 
    }

    return (
      <div className={s.incrementDecrementButton}>
        <label className={s.incrementDecrementText}> {value} {label}</label>
        <Button className={s.iconButton} onClick={this.decrement}> 
          <FontAwesome.FaMinus /> 
        </Button>
        <Button className={s.iconButton} onClick={this.increment}> 
          <FontAwesome.FaPlus /> 
        </Button>
      </div>
    )
  }
}

export default injectIntl(withStyles(s)(IncrementBtn));
