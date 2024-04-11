// General
import React from 'react';
import PropTypes from 'prop-types';

// Translation
import { injectIntl } from 'react-intl';

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Button } from 'react-bootstrap';
import s from './IncrementButton.css';
import * as FontAwesome from 'react-icons/lib/fa';

class IncrementButton extends React.Component {
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
  }

  componentDidMount() {
    const { input } = this.props;
    if (input && input.value != undefined) {
       this.setState({
        value: Number(input.value)
      });
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { input } = props;
    if (input && input.value != undefined && input.value !== state.value) {
      return {
        value: Number(input.value)
      };
    } else {
      return null;
    }
  }

  increment = (value, maxValue, incrementBy) => {
    if(value < maxValue) {
      let currentValue = Number(value) + Number(incrementBy);

      this.setState({
        value: currentValue
      });
      return currentValue
    }
  }

  decrement = (value, minValue, incrementBy, page) => {
    let currentValue = value;

    if (page === "minMax") {
      if (value !== 1 && value > minValue) {
        currentValue = Number(value) - Number(incrementBy);
      } else {
        currentValue = '';
      }

      this.setState({
        value: currentValue
      });
      return currentValue
    } else {
      if (value > minValue) {
        currentValue = Number(value) - Number(incrementBy);

        this.setState({
          value: currentValue
        });
        return currentValue;
      }
    }
  }

  render() {

    const { input: { onChange }, maxValue, minValue, labelSingluar, labelPlural, incrementBy, page } = this.props;
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
        <Button className={s.iconButton} onClick={() => onChange(this.decrement(value, minValue, incrementBy, page))}> 
          <FontAwesome.FaMinus /> 
        </Button>
        <Button className={s.iconButton} onClick={() => onChange(this.increment(value, maxValue, incrementBy, page))}> 
          <FontAwesome.FaPlus /> 
        </Button>
      </div>
    )
  }
}

export default injectIntl(withStyles(s)(IncrementButton));
