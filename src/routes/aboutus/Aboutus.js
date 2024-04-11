import React from 'react';
import PropTypes from 'prop-types';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Aboutus.css';

import AboutLayout from '../../components/about';

class Aboutus extends React.Component {

  render() {
    return (
        <div>
          <AboutLayout />
              </div>
    );
  }
};

export default withStyles(s)(Aboutus);
