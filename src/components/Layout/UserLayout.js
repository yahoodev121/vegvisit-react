import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Layout.css';
import Header from '../Header';
import Footer from '../Footer';
import SubnavBar from '../SubnavBar';
import CookiesDisclaimer from '../CookiesDisclaimer';

class UserLayout extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  render() {
    return (
      <div>
        <Header />
        <SubnavBar />
        {this.props.children}
        <Footer />
        <CookiesDisclaimer />
      </div>
    );
  }
}

export default withStyles(s)(UserLayout);
