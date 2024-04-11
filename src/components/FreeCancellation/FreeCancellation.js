import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import s from './FreeCancellation.css'
import * as FontAwesome from 'react-icons/lib/fa';

class FreeCancellation extends React.Component {
    constructor (props) {
      super (props);  
    }

    static propTypes = {
      className: PropTypes.string,
    }

    render() {
      const { className } = this.props;

      return (
        <div className={className}>
          <FontAwesome.FaCheckCircleO color="green" />
          FREE Cancellation
        </div>
      );
    }
}

export default FreeCancellation;
 

