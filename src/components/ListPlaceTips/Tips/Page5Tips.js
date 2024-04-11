import React from 'react';
import PropTypes from 'prop-types';

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../ListPlaceTips.css';

// Translation
import { FormattedMessage } from 'react-intl';


// Locale
import messages from '../../../locale/messages';


class Page5Tips extends React.Component {
  static propTypes = {
  };

  static defaultProps = {
  };

  render() {
    return (
        <div className={s.helpPanelContainer}>
          <div className={s.helpPanel}>
            <div className={s.helpPanelText}>
              <p>
                <span><FormattedMessage {...messages.pageFiveContent} /></span>
                </p>
            </div>
          </div>
        </div>  
    );
  }
}

export default withStyles(s)(Page5Tips);

