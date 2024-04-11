import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../ListPlaceTips.css';

import Link from '../../Link';

// Translation
import { FormattedMessage } from 'react-intl';


// Locale
import messages from '../../../locale/messages';


class MaxDaysNoticeTips extends React.Component {
  static propTypes = {
  };

  static defaultProps = {
  };
 
  render() {
    return (
        <div className={s.helpPanelContainer}>
          <div className={s.helpPanel}>
            <div className={s.helpPanelText}>
             <h3 className={cx(s.helpPanelTextTitle, s.noMarginTop)}><FormattedMessage {...messages.cancellationPolicies} /></h3>
              <p className={s.helpPanelListText}><FormattedMessage {...messages.cancellationPoliciesTips} /></p>
              <p>
                <span className={s.helpPanelTextTitle}>
                  <Link to={'/cancellation-policies/Flexible'}>
                    <FormattedMessage {...messages.flexible} />
                  </Link>
                </span>
                <ul className={s.helpPanelListText}>
                  <li><FormattedMessage {...messages.maxNoticeLabel1A} values={{break: <br />}} /></li>
                  <li><FormattedMessage {...messages.maxNoticeLabel1B} values={{break: <br />}} /></li>
                  <li><FormattedMessage {...messages.maxNoticeLabel1C} values={{break: <br />}} /></li>
                </ul>
              </p>
              <p>
                <span className={s.helpPanelTextTitle}>
                  <Link to={'/cancellation-policies/Moderate'}>
                    <FormattedMessage {...messages.moderate} />
                  </Link>
                </span>
                <ul className={s.helpPanelListText}>
                  <li><FormattedMessage {...messages.maxNoticeLabel2A} values={{break: <br />}} /></li>
                  <li><FormattedMessage {...messages.maxNoticeLabel2B} values={{break: <br />}} /></li>
                  <li><FormattedMessage {...messages.maxNoticeLabel2C} values={{break: <br />}} /></li>
                </ul>
              </p>
              <p>
                <span className={s.helpPanelTextTitle}>
                  <Link to={'/cancellation-policies/Strict'}>
                    <FormattedMessage {...messages.strict} />
                  </Link>
                </span>
                <ul className={s.helpPanelListText}>
                  <li><FormattedMessage {...messages.maxNoticeLabel3A} values={{break: <br />}} /></li>
                  <li><FormattedMessage {...messages.maxNoticeLabel3B} values={{break: <br />}} /></li>
                </ul>
              </p>
            </div>
          </div> 
        </div>
    );
  }
}

export default withStyles(s)(MaxDaysNoticeTips);

