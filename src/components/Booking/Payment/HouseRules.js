import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
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
import * as FontAwesome from 'react-icons/lib/fa';
import logoUrl from './logo-small.jpg';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Payment.css';

// Locale
import messages from '../../../locale/messages';

class HouseRules extends Component {
    static propTypes = {
    	houseRules: PropTypes.array.isRequired,
      hostDisplayName: PropTypes.string.isRequired,
      formatMessage: PropTypes.any,
    };

    render() {
        const { hostDisplayName, houseRules } = this.props;

        return (
            <Panel className={s.houseRulesPanel}>
            <h3 className={s.textCenter}>
              <span>{hostDisplayName}'s <FormattedMessage {...messages.houseRules} /></span>
            </h3>
              {
                houseRules.map((item, index) => {
                  if(item.listsettings.isEnable === "1"){
                    return (
                      <div className={s.houseRules} key={index}>
                        <span>{item.listsettings.itemName}</span>
                        <FontAwesome.FaCheckCircle className={s.circleIcon} />
                      </div>
                    )
                  }
                })
              }
            </Panel>
        );
    }
}

export default withStyles(s)(HouseRules);

