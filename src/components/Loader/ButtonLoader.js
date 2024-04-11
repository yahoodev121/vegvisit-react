import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {
 Grid,
 Row,
 Col,
 Button } from 'react-bootstrap';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Loader.css';

// Component
import MDSpinner from 'react-md-spinner';

class ButtonLoader extends Component {

  static propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired,
    handleClick: PropTypes.any,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    spinnerColor: PropTypes.string,
  };

  static defaultProps = {
    label: 'Submit',
    show: false,
    type: 'button',
    spinnerColor: '#fff'
  };

  constructor (props) {
    super(props)
    this.state = {
			isSubmitting: false
		};
    this.handleClickOnce = this.handleClickOnce.bind(this)
  }

  handleClickOnce = (event) => {
    const { handleClick } = this.props;
    if(handleClick) {
      if (this.state.isSubmitting) {
        return;
      }
      this.setState({isSubmitting: true});
      handleClick();
    }
  }

    render() {
        const { label, show, type, handleClick, className, disabled, spinnerColor } = this.props;
        let isDisabled = false;
        if(show || disabled){
          isDisabled = true;
        }
        return (
            <Button 
              className={className} 
              disabled={isDisabled || this.state.isSubmitting} 
              type={type} 
              onClick={this.handleClickOnce}
            >
              {
                show && <MDSpinner
                  singleColor={spinnerColor}
                  size={18}
              />
              }
                
                &nbsp;{label}
            </Button>
        );
    }
}

export default withStyles(s)(ButtonLoader);