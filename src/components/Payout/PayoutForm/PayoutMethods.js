import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

import { graphql, compose } from 'react-apollo';

// Redux Form
import { reduxForm, change, formValueSelector, Field } from 'redux-form';
// Redux
import { connect } from 'react-redux';

import {
  Button,
  Panel,
  FormGroup
} from 'react-bootstrap';

import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../Payout.css';

// Component
import CountryList from '../../CountryList';

// Graphql
import getPayoutMethodsQuery from './getPayoutMethods.graphql';

// Locale
import messages from '../../../locale/messages';

// Helpers
import validate from './validate';

import { useStripeExpress, stripeExpressCountries } from '../../../config';

class PayoutMethods extends Component {
  static propTypes = {
    handleSubmit: PropTypes.any.isRequired,
    previousPage: PropTypes.any.isRequired,
    formatMessage: PropTypes.any,
    PayoutMethodsData: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      getPayoutMethods: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        processedIn: PropTypes.string.isRequired,
        fees: PropTypes.string.isRequired,
        currency: PropTypes.string.isRequired,
        details: PropTypes.string.isRequired,
        paymentType: PropTypes.string.isRequired,
      }))
    })
  };

  static defaultProps = {
    PayoutMethodsData: {
      loading: true,
      getPayoutMethods: []
    }
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    const { PayoutMethodsData: { loading, getPayoutMethods } } = this.props;
    const { change, paymentMethodId } = this.props;
    if (getPayoutMethods != null && getPayoutMethods.length > 0) {
      if (paymentMethodId === undefined || paymentMethodId === null) {
        change('methodId', getPayoutMethods[0].id);
        change('paymentType', getPayoutMethods[0].paymentType);
        change('currency', getPayoutMethods[0].currency);
      }
    }
  }

  handleChange(methodId, paymentType, currency) {
    const { change } = this.props;
    change('methodId', methodId);
    change('paymentType', paymentType);
    change('currency', currency);
  }

  renderCountryList = ({ input, label, meta: { touched, error }, children, className }) => {
    const { formatMessage } = this.props.intl;
    return (
      <div>
        <label className={s.sectionTitleLight}><FormattedMessage {...messages.addPayoutCountry} /></label>
        {touched && error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
        <FormGroup className={s.formGroup}>
          <CountryList input={input} className={cx(className,s.selectFormControl)} isEmptyFirst  />
        </FormGroup>
      </div>
    );
    {/* <div className={cx(s.space1,s.displayFlex)}>
       <Col lg="3" md="3" sm="12" xs="12" className={cx(s.responsiveTextAlign,s.responsivePadding)}>
        <label className={s.labelText}><FormattedMessage {...messages.country} /></label>
        </Col>
     
      <Col  lg="9" md="9" sm="12" xs="12" className={s.responsivePadding}>
      {touched && error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
      <FormGroup className={s.formGroup}>
          <CountryList input={input} className={cx(className,s.selectFormControl)} isEmptyFirst  />
        </FormGroup>
      </Col>  
      </div> */}
  }

  render() {
    const { error, handleSubmit, previousPage } = this.props;
    const { PayoutMethodsData: { loading, getPayoutMethods } } = this.props;
    const { paymentMethodId, country } = this.props;
    const { formatMessage } = this.props.intl;
    const offerStripe = stripeExpressCountries && stripeExpressCountries.length > 0 && stripeExpressCountries.indexOf(country) !== -1;

    return (
      <form onSubmit={handleSubmit}>
        <Panel
          className={s.panelHeader}
          header={formatMessage(messages.addPayout)}
          footer={
            <div>
              {/* <Button className={cx(s.button, s.btnlarge, s.btnPrimaryBorder, s.btnRight)} onClick={previousPage}>
                <FormattedMessage {...messages.back} />
              </Button> */}
              <Button className={cx(s.button, s.btnPrimary, s.btnlarge)} type="submit">
                <FormattedMessage {...messages.next} />
              </Button>
            </div>
          }
        >
          <div className={s.panelBody}>
            {/* <p className={s.payoutIntro}>
              <FormattedMessage {...messages.payoutIntro1} />
            </p> */}
            {
              loading && <div> Loading...</div>
            }
            {
              !loading && getPayoutMethods != undefined && getPayoutMethods.length > 0 && <span>
              {/* <div><FormattedMessage {...messages.addPayoutCountry} /></div> */}
              <Field name="country" component={this.renderCountryList} className={cx(s.formControlSelect, s.commonBorder)} />
              <br></br>
              <table className={cx('table', s.noBorder)}>
                <thead>
                  <tr className={cx(s.rowBorder, s.sectionTitleLight, s.textTruncate)}>
                    <th className={s.noBorder} />
                    <th className={s.noBorder}><FormattedMessage {...messages.payoutTitle} /></th>
                    {/* <th className={s.noBorder}><FormattedMessage {...messages.payoutTitle1} /></th>
                    <th className={s.noBorder}><FormattedMessage {...messages.payoutTitle2} /></th>
                    <th className={s.noBorder}><FormattedMessage {...messages.payoutTitle3} /></th> */}
                    <th className={s.noBorder}><FormattedMessage {...messages.payoutTitle4} /></th>
                  </tr>
                </thead>
                <tbody>

                  {
                    getPayoutMethods.map((item, index) => {

                      let checked = false;
                      if (item.id === paymentMethodId) {
                        checked = true;
                      } {/* if (!(country === 'US' || offerStripeExpress) && item.id === paymentMethodId) {
                        
                        return (
                          <tr className={cx(s.sectionTitleLight)} key={index}>
                            <td><label className={s.radioText}>{item.name}</label></td>
                            <td>{item.processedIn}</td>
                            <td>{item.fees}</td>
                            <td>{item.currency}</td>
                            <td>{item.details}</td>
                          </tr>
                        );
                      }
                      else if (country === 'US' || offerStripeExpress) { */}
                        
                        return (
                          <tr className={cx(s.sectionTitleLight)} key={index}>
                            <td>
                              <input disabled={item.paymentType == 2 && !offerStripe} name="methodId" type="radio" checked={checked} value={item.id} onChange={() => this.handleChange(item.id, item.paymentType, item.currency)} />
                            </td>
                            <td><label className={s.radioText}>{item.name}</label></td>
                            {/* <td>{item.processedIn}</td>
                            <td>{item.fees}</td>
                            <td>{item.currency}</td> */}
                            <td>{item.details.indexOf('(') !== -1 ? item.details.slice(0,item.details.indexOf('(')) : item.details}{item.details.indexOf('(') !== -1 && <span className={s.radioTextSupplement}><br />{item.details.slice(item.details.indexOf('('))}</span>}</td>
                          </tr>
                        );
                      // }
                    })
                  }

                </tbody>
              </table></span>
            }
            {
              !loading && getPayoutMethods != undefined && getPayoutMethods.length === 0 && <div> <FormattedMessage {...messages.noPaymentFound} /> </div>
            }
          </div>
        </Panel>
      </form>
    );
  }
}

PayoutMethods = reduxForm({
  form: 'PayoutForm', // a unique name for this form
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate
})(PayoutMethods);

const selector = formValueSelector('PayoutForm');

const mapState = (state) => ({
  paymentMethodId: selector(state, 'methodId'),
  country: selector(state, 'country')
});

const mapDispatch = {
  change
};

export default compose(
  injectIntl,
  withStyles(s),
  connect(mapState, mapDispatch),
  graphql(getPayoutMethodsQuery, {
    name: 'PayoutMethodsData',
    options: {
      ssr: false,
    }
  }),
)(PayoutMethods);