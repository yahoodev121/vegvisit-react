// General
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Redux Form
import {Field, reduxForm, formValueSelector, change} from 'redux-form';

// Redux
import { connect } from 'react-redux';

// Helpers
import validate from './validate';

// Translation
import { injectIntl, FormattedMessage } from 'react-intl';

// Locale
import messages from '../../locale/messages';

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import {
    Alert,
    Grid,
    Button,
    CloseButton,
    Form,
    Row,
    FormGroup,
    Col,
    ControlLabel,
    FormControl,
    Checkbox
} from 'react-bootstrap';
import s from './ListRetreat.css';

// Component

import submit from './submit';

class RetreatFullPayment extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAllowPayment: false,
            isDepositOnly: false
        };
    }

    static getDerivedStateFromProps(props, state) {
        const {formData} = props;
        let data = {}
        if (formData.values) {
            if (formData.values.isCash) {
                data = {
                    ...data,
                    isCash: true
                }
            }
            if (formData.values.isCredit) {
                data = {
                    ...data,
                    isCredit: true
                }
            }

            if (formData.values.isBank) {
                data = {
                    ...data,
                    isBank: true
                }
            }
        }
        return data;
    }

    async onFocus() {
        const {dispatch} = this.props;
        await dispatch(change('RetreatForm', 'showTip', true));
        await dispatch(change('RetreatForm', 'tipForm', 'FullPayment'));
    }

    async onBlur() {
        const {dispatch} = this.props;
        await dispatch(change('RetreatForm', 'showTip', false));
    }

    render() {
        const { handleSubmit, dispatch } = this.props;
        const { isAllowPayment, isDepositOnly } = this.state;

        return (
            <Grid fluid onMouseEnter={() => {this.onFocus()}} onMouseLeave={() => this.onBlur()}>
                <Row className={s.landingContainer}>
                    <Col xs={12}>
                        <div>
                            <h3 className={s.landingContentTitle}>
                                Full Payment
                            </h3>
                            <form onSubmit={handleSubmit}>
                                <FormGroup>
                                    <Grid>
                                        <Row className="show-grid">
                                            <Checkbox inline onChange={async e => {
                                                this.setState({isAllowPayment: e.target.checked})
                                                await dispatch(change('RetreatForm', 'isAllowPayment', e.target.checked));
                                            }} checked={isAllowPayment}>Allow: Guests can make Full Payment or Deposit Only (Highly recommended)</Checkbox>
                                        </Row>
                                        <Row className="show-grid">
                                            <Checkbox inline onChange={async e => {
                                                this.setState({isDepositOnly: e.target.checked})
                                                await dispatch(change('RetreatForm', 'isDepositOnly', e.target.checked));
                                            }} checked={isDepositOnly}>Deposit Only Payments: lowers chances of bookings (Not recommended)</Checkbox>
                                        </Row>
                                    </Grid>
                                </FormGroup>
                            </form>
                        </div>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

RetreatFullPayment = reduxForm({
    form: 'RetreatForm', // a unique name for this form
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
    validate,
    onSubmit: submit
})(RetreatFullPayment);

const mapState = (state) => ({
    formData: state.form.RetreatForm,
});

const mapDispatch = {
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(RetreatFullPayment)));
