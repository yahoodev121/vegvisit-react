import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Layout.css';
import Header from '../Header';
import Feedback from '../Feedback';
import Footer from '../Footer';
import FooterToggle from '../FooterToggle';
import cx from 'classnames';
import CookiesDisclaimer from '../CookiesDisclaimer';
import HomeHeader from '../Header/HomeHeader';

class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    page: PropTypes.string
  };

  static defaultProps = {
    page: ''
  };

  render() {
    const { page, className, layoutType, searchType } = this.props;

    return (
      <div>
        <Header layoutType={layoutType} searchType={searchType} />
        {this.props.children}
        <div className={cx('hidden-xs', {[s.searchFooter]: page === 'search'}, className)}>
          <FooterToggle />
        </div>
        <CookiesDisclaimer />
      </div>
    );
  }
}

export default withStyles(s)(Layout);
