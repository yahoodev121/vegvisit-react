import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './NavigationBeforeLogin.css';

import { Nav } from 'react-bootstrap';

import Link from '../Link';

// Modals
import LoginModal from '../LoginModal';
import SignupModal from '../SignupModal';
import ForgotPassword from '../ForgotPassword';

import NavLink from '../NavLink';

// Locale
import messages from '../../locale/messages';

class NavigationBeforeLogin extends React.Component {

  static propTypes = {
    className: PropTypes.string,
    setUserLogout: PropTypes.any,
    openLoginModal: PropTypes.any,
    openSignupModal: PropTypes.any,
  };

  render () {
    const { className, openLoginModal, openSignupModal } = this.props;
    return (
      <div>
      <LoginModal />
      <SignupModal />
      <ForgotPassword />
      <Nav pullRight>
        <NavLink to="/" className={"visible-xs visible-sm visible-md"}>
          <FormattedMessage {...messages.homeMenu} />
        </NavLink>
        <NavLink to="/about-us">
          <FormattedMessage {...messages.about} />
        </NavLink> 
        <NavLink to="/whyhost">
          <FormattedMessage {...messages.host} />
        </NavLink> 
        {/*<NavLink to="/saved">*/}
        {/*  <FormattedMessage {...messages.saved} />*/}
        {/*</NavLink> */}
        <NavLink to="/s?listType=retreats">
          <FormattedMessage {...messages.retreats} />
        </NavLink> 
        {/*<NavLink to="/messages">*/}
        {/*  <FormattedMessage {...messages.messages} />*/}
        {/*</NavLink> */}
        <NavLink externalLink to=" https://store.vegvisits.com">
          <FormattedMessage {...messages.store} />
        </NavLink>
        <NavLink to="#" noLink onClick={openLoginModal}>
          <FormattedMessage {...messages.signin} />
        </NavLink>
        {/* <NavLink to="/whyhost">
          <FormattedMessage {...messages.howItWorkBtnTwo} />
        </NavLink> 
        <NavLink externalLink to=" https://store.vegvisits.com">
          <FormattedMessage {...messages.store} />
        </NavLink>
        <NavLink to="/why-vegvisits">
          <FormattedMessage {...messages.whyvegvisits} />
        </NavLink>
        <NavLink to="#" noLink onClick={openLoginModal}>
          <FormattedMessage {...messages.login} />
        </NavLink>
        <NavLink to="#" noLink onClick={openSignupModal}>
          <FormattedMessage {...messages.signup} />
        </NavLink> */}
      </Nav>
    </div>
    );
  }

}

export default withStyles(s)(NavigationBeforeLogin);
