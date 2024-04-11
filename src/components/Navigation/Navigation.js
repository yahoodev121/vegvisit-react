import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

// Translation
import { injectIntl } from 'react-intl';

import NavigationBeforeLogin from '../NavigationBeforeLogin';
import NavigationAfterLogin from '../NavigationAfterLogin';
import Link from '../Link';
import { setUserLogout } from '../../actions/logout';
import {
  openLoginModal,
  openSignupModal } from '../../actions/modalActions';

class Navigation extends React.Component {

  static propTypes = {
    className: PropTypes.string,
    isAuthenticated: PropTypes.bool,
    setUserLogout: PropTypes.any,
    openLoginModal: PropTypes.any,
    openSignupModal: PropTypes.any,
  };

  render() {
    const { className, isAuthenticated, setUserLogout, openLoginModal, openSignupModal } = this.props;

    if(isAuthenticated === true) {
      return <NavigationAfterLogin
                className={className}
                setUserLogout={setUserLogout}
                />

    } else {
      return <NavigationBeforeLogin
                className={className}
                openLoginModal={openLoginModal}
                openSignupModal={openSignupModal}
                />;
    }
  }

}

const mapState = (state) => ({
  isAuthenticated: state.runtime.isAuthenticated,
});

const mapDispatch = {
	setUserLogout,
  openLoginModal,
  openSignupModal
};
export default injectIntl(connect(mapState, mapDispatch)(Navigation));
