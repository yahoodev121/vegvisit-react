import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

// Redux
import { connect } from 'react-redux';

// Redux Form
import { Field, reduxForm } from 'redux-form';

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
import logourl from './paypal.png';

// Helpers
import validateStripe from './validateStripe';
import submit from './submit';

// Locale
import messages from '../../../locale/messages';

// Components
import Loader from '../../Loader';

import { useStripeExpress } from '../../../config'; 

class Stripe extends Component {
    static propTypes = {
        handleSubmit: PropTypes.any.isRequired,
        previousPage: PropTypes.any.isRequired,
        siteName: PropTypes.string.isRequired,
        formatMessage: PropTypes.any,
    };

    renderField = ({ input, label, type, meta: { touched, error, dirty }, placeHolder }) => {
        const { formatMessage } = this.props.intl;
        return (
            <div className={s.space1}>
             <Col lg="4" md="4" sm="12" xs="12" className={cx(s.responsiveTextAlign,s.responsivePadding)}>
                <label className={s.labelText}>{label}</label>
              </Col>  
              <Col  lg="8" md="8" sm="12" xs="12" className={s.responsivePadding}>
                <FormGroup className={s.formGroup}>
                    {touched && error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
                    <FormControl
                        {...input}
                        componentClass="input"
                        className={cx(s.formControlInput, s.commonBorder,s.inputFormControl)}
                        placeholder={placeHolder}
                    />
                </FormGroup>
                </Col>
            </div>
        );
    }

    render() {
        const { handleSubmit, pristine, previousPage, submitting, error } = this.props;
        const { base, availableCurrencies, siteName, payoutLoading } = this.props;
        const { formatMessage } = this.props.intl;


        return (
            <div className={'inputFocusColor'}>
            <form onSubmit={handleSubmit(submit)}>
                <Panel className={s.panelHeader}
                    header={formatMessage(messages.addPayout)}
                    footer={
                        <div className={s.displayInline}>
                            <Button
                                className={cx(s.button, s.btnlarge, s.btnPrimaryBorder, s.btnRight)}
                                onClick={previousPage}
                            >
                                <FormattedMessage {...messages.back} />
                            </Button>
                            <div className={s.displayInline}>
                                <Loader
                                    type={'button'}
                                    buttonType={'submit'}
                                    className={cx(s.button, s.btnPrimary, s.btnlarge, s.displayInline)}
                                    disabled={pristine || submitting || error}
                                    show={payoutLoading}
                                    label={formatMessage(messages.finish)}
                                />
                            </div>
                        </div>
                    }>
                    <div className={s.panelBody}>
                        {useStripeExpress ?
                        <FormattedMessage {...messages.payoutStripeExpressTip} /> :
                        <div>
                        <Field
                            name="firstname"
                            component={this.renderField}
                            label={formatMessage(messages.payoutFirstName)}
                            placeHolder={"First name"}
                        />

                        <Field
                            name="lastname"
                            component={this.renderField}
                            label={formatMessage(messages.payoutLastName)}
                            placeHolder={"Last name"}
                        />

                        <Field
                            name="routingNumber"
                            component={this.renderField}
                            label={formatMessage(messages.payoutRouting)}
                            placeHolder={"eg: 110000000"}
                        />

                        <Field
                            name="accountNumber"
                            component={this.renderField}
                            label={formatMessage(messages.accountNumber)}
                            placeHolder={"eg: 000123456789"}
                        />

                        <Field
                            name="confirmAccountNumber"
                            component={this.renderField}
                            label={formatMessage(messages.confirmAccountNumber)}
                            placeHolder={"eg: 000123456789"}
                        />

                        <Field
                            name="ssn4Digits"
                            component={this.renderField}
                            label={formatMessage(messages.ssn4Digits)}
                            placeHolder={"eg: 1234"}
                        />
                        </div>
                        }
                    </div>
                </Panel>
            </form>
            </div>
        );
    }
}

Stripe = reduxForm({
    form: 'PayoutForm', // a unique name for this form
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
    validate: validateStripe
})(Stripe);

const mapState = (state) => ({
    siteName: state.siteSettings.data.siteName,
    availableCurrencies: state.currency.availableCurrencies,
    base: state.currency.base,
    payoutLoading: state.reservation.payoutLoading
});

const mapDispatch = {
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(Stripe)));