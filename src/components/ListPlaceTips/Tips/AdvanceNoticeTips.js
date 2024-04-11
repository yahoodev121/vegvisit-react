import React from 'react';
import PropTypes from 'prop-types';

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../ListPlaceTips.css';

// Translation
import { FormattedMessage } from 'react-intl';


// Locale
import messages from '../../../locale/messages';


class AdvanceNoticeTips extends React.Component {
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
                {/* <span className={s.helpPanelTextTitle}>Entire place</span> */}
                <span><FormattedMessage {...messages.advanceNoticeLabel1} /></span>
              </p>
              {/* <p>
                <span className={s.helpPanelTextTitle}>Private room</span>
                <span>Guests have their own private room for sleeping. Other areas could be shared.</span>
              </p>
              <p>
                <span className={s.helpPanelTextTitle}>Shared room</span>
                <span>Guests sleep in a bedroom or a common area that could be shared with others.</span>
              </p> */}
            </div>
          </div>
        </div>
    );
  }
}

export default withStyles(s)(AdvanceNoticeTips);

