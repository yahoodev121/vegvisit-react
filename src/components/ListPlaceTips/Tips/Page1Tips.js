import React from 'react';
import PropTypes from 'prop-types';

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../ListPlaceTips.css';

// Translation
import { FormattedMessage } from 'react-intl';


// Locale
import messages from '../../../locale/messages';


class Page1Tips extends React.Component {
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
                <span className={s.helpPanelTextTitle}><FormattedMessage {...messages.pageOneTitleTips} /></span>
                <span><FormattedMessage {...messages.pageContent1} /></span>
              </p>
              <p>
                <span className={s.helpPanelTextTitle}><FormattedMessage {...messages.pageTwoTitleTips} /></span>
                <span><FormattedMessage {...messages.pageContent2} /></span>
              </p>
              <p>
                <span className={s.helpPanelTextTitle}><FormattedMessage {...messages.pageThreeTitleTips} /></span>
                <span><FormattedMessage {...messages.pageContent3} /></span>
              </p>
            </div>
          </div>
        </div>
    );
  }
}

export default withStyles(s)(Page1Tips);

