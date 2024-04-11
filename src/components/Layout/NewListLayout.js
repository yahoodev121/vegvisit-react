import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Layout.css';
import Header from '../Header';
import Footer from '../Footer';
import FooterToggle from '../FooterToggle';
import CookiesDisclaimer from '../CookiesDisclaimer';
import cx from 'classnames';

class NewListLayout extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  render() {
    return (
      <div>
        <Header />
        {this.props.children}
        <div className={cx('hidden-xs hidden-sm')}>
          <FooterToggle />
          {/* <Footer /> */}
        </div>
        <CookiesDisclaimer />
      </div>
    );
  }
}

export default withStyles(s)(NewListLayout);
