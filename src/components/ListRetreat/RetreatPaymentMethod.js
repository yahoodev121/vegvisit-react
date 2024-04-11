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

class RetreatPaymentMethod extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isCash: false,
            isCredit: false,
            isBank: false
        };
    }

    render() {
        const { handleSubmit, dispatch } = this.props;
        const { isCash, isCredit, isBank } = this.state;

        return (
            <Grid fluid>
                <Row className={s.landingContainer}>
                    <Col xs={12}>
                        <div>
                            <h3 className={s.landingContentTitle}>
                                Accepted Payment Methods
                            </h3>
                            <form onSubmit={handleSubmit}>
                                <FormGroup>
                                    <Grid>
                                        <Row className="show-grid">
                                            <Checkbox inline onChange={async e => {
                                                this.setState({isCash: e.target.checked})
                                                await dispatch(change('RetreatForm', 'isCash', e.target.checked));
                                            }} checked={isCash}>Cash</Checkbox>
                                        </Row>
                                        <Row className="show-grid">
                                            <Checkbox inline onChange={async e => {
                                                this.setState({isCredit: e.target.checked})
                                                await dispatch(change('RetreatForm', 'isCredit', e.target.checked));
                                            }} checked={isCredit}>Credit/Debit Card</Checkbox>
                                        </Row>
                                        <Row className="show-grid">
                                            <Checkbox inline onChange={async e => {
                                                this.setState({isBank: e.target.checked})
                                                await dispatch(change('RetreatForm', 'isBank', e.target.checked));
                                            }} checked={isBank}>Bank Transfer</Checkbox>
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

RetreatPaymentMethod = reduxForm({
    form: 'RetreatForm', // a unique name for this form
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
    validate,
    onSubmit: submit
})(RetreatPaymentMethod);

const mapState = (state) => ({
    formData: state.form.RetreatForm,
});

const mapDispatch = {
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(RetreatPaymentMethod)));
