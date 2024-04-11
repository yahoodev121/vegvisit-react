import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

// Redux
import { connect } from 'react-redux';

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
import s from '../Payout.css';

// Redirection
import history from '../../../core/history';

// Locale
import messages from '../../../locale/messages';

// Redux actions
import {removePayout} from '../../../actions/Payout/removePayoutAction';
import {setDefaultPayout} from '../../../actions/Payout/setDefaultPayout';

import { useStripeExpress } from '../../../config';
import { createStripeAuthUrl } from '../../../core/payment/stripe/helpers/createStripeAuthUrl';

import Link from '../../Link';

class PayoutList extends Component {
    static propTypes = {
      data: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        methodId: PropTypes.number.isRequired,
        paymentMethod: PropTypes.shape({
          name: PropTypes.string.isRequired
        }),
        payEmail: PropTypes.string.isRequired,
        currency: PropTypes.string.isRequired,
        default: PropTypes.bool.isRequired,
        last4Digits: PropTypes.number
      })),
      removePayout: PropTypes.any.isRequired,
      setDefaultPayout: PropTypes.any.isRequired,
      formatMessage: PropTypes.any,
    };

    handleClick (){
      history.push('/user/addpayout');
    }

    render() {
        const { data, removePayout, setDefaultPayout } = this.props;
        const { formatMessage } = this.props.intl;

        return (
			      <Panel className={s.panelHeader} header={formatMessage(messages.payoutMethod)} >
              <div className={s.panelBody}>
                <p className={s.payoutIntro}>
                  <FormattedMessage {...messages.addPayoutMethod}
                    values={{payoutsFAQ:
                      <Link to={"/page/payout"}>
                        <FormattedMessage {...messages.payoutsFAQ} />
                      </Link>
                    }}
                  />
                  {/* <a> <FormattedMessage {...messages.payoutFaq} /></a> */}
                </p>
                <table className={cx('table', s.noBorder)}>
                  <thead>
                    <tr className={cx(s.rowBorder, s.sectionTitleLight, s.textTruncate)}>
                      <th className={s.noBorder}><FormattedMessage {...messages.payoutTitle} /></th>
                      <th className={s.noBorder}><FormattedMessage {...messages.payoutTitle4} /></th>
                      <th className={s.noBorder}><FormattedMessage {...messages.status} /></th>
                      <th className={s.noBorder}><FormattedMessage {...messages.options} /></th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      data.length > 0 && data.map((item, index) => {
                        const isStripeWithoutUser = (item.methodId === 2 && (!item.payEmail || !item.payEmail.startsWith('acct_')));
                        const isStripeExpress = (item.methodId == 2 && useStripeExpress);
                        const isStripeExpressReady = isStripeExpress && item.payEmail.startsWith('acct_');
                        const addStripeUserUrl = createStripeAuthUrl({payEmail: item.payEmail});
                        return (
                            <tr className={cx(s.rowBorder, s.sectionTitleLight)} key={index}>
                            <td>{item.paymentMethod.name} {item.default && <Label bsStyle="success"><FormattedMessage {...messages.default} /></Label>}</td>
                              <td>
                                {
                                  (item.methodId == 1 || item.methodId == 4) && <span> 
                                    { item.payEmail }
                                  </span>
                                }
                                {
                                  isStripeExpress && <span> 
                                    { 'Account ID: ' + item.payEmail }
                                  </span>
                                }
                                {
                                  item.methodId == 2 && !isStripeExpress && <span>
                                    ******{item.last4Digits}
                                  </span>
                                }
                                {isStripeExpress && ` (${item.currency})`}
                              </td>
                              <td>{isStripeWithoutUser ? <FormattedMessage {...messages.payoutStripeNotReady} /> : <FormattedMessage {...messages.ready} />}</td>
                              <td className={s.textTruncate}>
                                {
                                  !item.default && !isStripeWithoutUser && <a className={s.btnRight} href="javascript:void(0)" onClick={() => setDefaultPayout(item.id)}><FormattedMessage {...messages.setDefault} /></a>
                                }
                                {
                                  useStripeExpress && isStripeWithoutUser && <a className={s.btnRight} href={addStripeUserUrl}><FormattedMessage {...messages.payoutStripeAddUser} /></a>
                                }
                                {
                                  isStripeExpressReady && <a className={s.textSpace2} href={`/stripe-dashboard?accountId=${item.payEmail}&account=true`}><FormattedMessage {...messages.payoutStripeAccount} /></a>
                                }
                                {
                                  isStripeExpressReady && <a className={s.textSpace2} href={`/stripe-dashboard?accountId=${item.payEmail}`}><FormattedMessage {...messages.payoutStripePayouts} /></a>
                                }
                                {
                                  !item.default && <a 
                                    className={s.textSpace} 
                                    href="javascript:void(0)" 
                                    onClick={() => removePayout(item.id)}
                                  >
                                    <FormattedMessage {...messages.remove} />
                                  </a>
                                }
                                
                              </td>
                            </tr>
                          );
                      })
                    }
                  </tbody>
                </table>
                <div className={cx(s.sectionTitleLight)}>
                <Button className={cx(s.button, s.btnlarge, s.btnPrimary, )} onClick={this.handleClick}>
                  <FormattedMessage {...messages.addPayout} />
                </Button>
                </div>
              </div>
            </Panel>

        );
    }
}

const mapState = (state) => ({
});

const mapDispatch = {
  removePayout,
  setDefaultPayout
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch) (PayoutList)));