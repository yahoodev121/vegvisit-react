import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';

import {
  Button,
  Form,
  Grid,
  Row, FormGroup,
  Col,
  ControlLabel,
  FormControl,
  FieldGroup,
  Panel,
  Label,
} from 'react-bootstrap';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './EmptyList.css';

// Redirection
import Link from '../../Link';

// Locale
import messages from '../../../locale/messages';

class EmptyList extends Component {
    static propTypes = {
      siteName: PropTypes.string.isRequired,
      formatMessage: PropTypes.any,
    };

    handleClick (){
      history.push('/user/addpayout');
    }

    render() {
        const { siteName } = this.props;
        const { formatMessage } = this.props.intl;

        return (
			      <Panel className={cx(s.panelHeader)} header={formatMessage(messages.payoutMethod)} >
              <div className={s.textCenter}>
                <span className={s.textLead}><FormattedMessage {...messages.addPayoutMethod} 
                  values={{payoutsFAQ:
                    <Link to={"/page/payout"}>
                      <FormattedMessage {...messages.payoutsFAQ} />
                    </Link>
                  }}
                /></span>
              </div>
              <div className={cx(s.spaceTop4, s.space2, s.textCenter)}>
                <Link to={"/user/addpayout"} className={cx(s.button, s.btnPrimary)}><FormattedMessage {...messages.addPayout} /></Link>
              </div>
            </Panel>
        );
    }
}

const mapState = (state) => ({
  siteName: state.siteSettings.data.siteName,
});
const mapDispatch = {};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch) (EmptyList)));