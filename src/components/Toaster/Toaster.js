import React from 'react';
import PropTypes from 'prop-types';

import ReduxToastr from 'react-redux-toastr'

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '!isomorphic-style-loader!css-loader!react-redux-toastr/lib/css/react-redux-toastr.min.css';

class Toaster extends React.Component {
  static propTypes = {
  };

  render() {
    return <ReduxToastr
              timeOut={4000}
              newestOnTop={false}
              preventDuplicates={true}
              position="top-right"
              transitionIn="fadeIn"
              transitionOut="fadeOut"
               />;
  }
}

export default withStyles(s)(Toaster);
