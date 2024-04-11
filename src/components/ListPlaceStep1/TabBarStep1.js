// General
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Style
import { ProgressBar } from 'react-bootstrap';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './TabBarStep1.css';

// Translation
import { injectIntl, FormattedMessage } from 'react-intl';

// Locale
import messages from '../../locale/messages';

class TabBarStep1 extends Component {

  static propTypes = {
    nextPage: PropTypes.any,
    formatMessage: PropTypes.any,
  };

  render() {
    const { nextPage } = this.props;

    return (
      <div className={cx(s.progressContainer, 'hidden-xs')}>
        <a className={s.linkReset} onClick={() => nextPage("room")} href="javascript:void(0);">
          <div className={cx(s.textTrunck, s.progressStep, s.progressSection , s.progressStyle)} title="Place Type" >
            <FormattedMessage {...messages.tabPlaceType} />
          </div>
        </a>

        <a className={s.linkReset} onClick={() => nextPage("bedrooms")} href="javascript:void(0);">
          <div className={cx(s.textTrunck, s.progressStep, s.progressSection , s.progressStyle)} title="Bedrooms" >
            <FormattedMessage {...messages.bedrooms} />
          </div>
        </a>

        <a className={s.linkReset} onClick={() => nextPage("bathrooms")} href="javascript:void(0);">
          <div className={cx(s.textTrunck, s.progressStep, s.progressSection , s.progressStyle)} title="Baths" >
            <FormattedMessage {...messages.baths} />
          </div>
        </a>

        <a className={s.linkReset} onClick={() => nextPage("location")} href="javascript:void(0);">
          <div className={cx(s.textTrunck, s.progressStep, s.progressSection , s.progressStyle)} title="Location" >
            <FormattedMessage {...messages.location} />
          </div>
        </a>

        <a className={s.linkReset} onClick={() => nextPage("amenities")} href="javascript:void(0);">
          <div className={cx(s.textTrunck, s.progressStep, s.progressSection , s.progressStyle)} title="Amenities" >
            <FormattedMessage {...messages.aminities} />
          </div>
        </a>
        
        <a className={s.linkReset} onClick={() => nextPage("features")} href="javascript:void(0);">
          <div className={cx(s.textTrunck, s.progressStep, s.progressSection , s.progressStyle)} title="Features" >
            <FormattedMessage {...messages.sharedSpaces} />
          </div>
        </a>

        <div>
          <ProgressBar className={s.leanProgress}  />
        </div>
  
      </div>
    );
  }

}

export default withStyles(s)(TabBarStep1);

