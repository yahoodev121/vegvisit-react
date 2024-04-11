import React from 'react';
import PropTypes from 'prop-types';

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../ListPlaceTips.css';


// Translation
import { FormattedMessage } from 'react-intl';


// Locale
import messages from '../../../locale/messages';


class DescriptionTips extends React.Component {
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
                <span className={s.helpPanelTextTitle}><FormattedMessage {...messages.descriptionTitle1} /></span>
                <span><FormattedMessage {...messages.descriptionContent1} /></span>
              </p>
              <p>
                <span className={s.helpPanelTextTitle}><FormattedMessage {...messages.descriptionTitle2} /></span>
                <span><FormattedMessage {...messages.descriptionContent2} /></span>
              </p>
              <p>
                <span className={s.fontWeight}><FormattedMessage {...messages.descriptionContent3} /></span>
              </p>
            </div>
          </div>
        </div>
    );
  }
}

export default withStyles(s)(DescriptionTips);

