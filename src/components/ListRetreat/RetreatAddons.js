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
    Checkbox,
    Input
} from 'react-bootstrap';
import s from './ListRetreat.css';

// Component

import submit from './submit';

class RetreatAddons extends Component {
    constructor(props) {
        super(props);

        this.state = {
            addons: [
                'Extra day/night',
                '60min massage',
                'Spa package',
                'Childcare',
                'Airport transfer(one-way)',
                'Laundry(perkg)',
                'Honeymoon service',
                'Packed lunch/picnic',
                'Meal package',
                'Surf class',
                'Additional treatment',
                'Private class'
            ],
            includedText: [],
            includedAddons: [],
        };
    }

    renderFormControlCheckbox = ({ input: { value, onChange }, id, label, checked, meta: { touched, error }, children, className }) => {
        const { formatMessage } = this.props.intl;
        const { dispatch } = this.props;

        return (
            <Col xs={12} md={3}>
                <Checkbox id={id} inline onChange={async e => {
                    let { includedAddons, includedText } = this.state;
                    if (e.target.checked) {
                        includedAddons.push({
                            name: id,
                            price: ''
                        });
                        includedText.push(id);
                    } else {
                        includedAddons = includedAddons.filter(item => item.name !== id)
                        includedText.splice(includedText.indexOf(id), 1)
                    }
                    this.setState({includedAddons, includedText});
                    await dispatch(change('RetreatForm', 'addons', includedAddons));
                }} checked={checked}>{label}</Checkbox>
            </Col>
        )
    }

    async handleNameChange(index, value) {
        const { formData, dispatch } = this.props;
        let addons = formData.values.addons;
        addons[index].name = value;
        const includedText= addons.map(item => item.name);
        this.setState({includedAddons: addons, includedText});
        await dispatch(change('RetreatForm', 'addons', addons));
    }

    async handlePriceChange(index, value) {
        const { formData, dispatch } = this.props;
        let addons = formData.values.addons;
        addons[index].price = value;
        const includedText= addons.map(item => item.name);
        this.setState({includedAddons: addons, includedText});
        await dispatch(change('RetreatForm', 'addons', addons));
    }


    async removeAddons(index) {
        let {includedAddons, includedText} = this.state;
        const { dispatch } = this.props;
        includedAddons.splice(index, 1);
        includedText.splice(index, 1);
        this.setState({includedAddons, includedText});
        await dispatch(change('RetreatForm', 'addons', includedAddons));
    }

    async onFocus() {
        const {dispatch} = this.props;
        await dispatch(change('RetreatForm', 'showTip', true));
        await dispatch(change('RetreatForm', 'tipForm', 'RetreatAddons'));
    }

    async onBlur() {
        const {dispatch} = this.props;
        await dispatch(change('RetreatForm', 'showTip', false));
    }

    render() {
        const { handleSubmit } = this.props;
        const { includedAddons, addons, includedText } = this.state;

        return (
            <Grid fluid onMouseEnter={() => {this.onFocus()}} onMouseLeave={() => this.onBlur()}>
                <Row className={s.landingContainer}>
                    <Col xs={12}>
                        <div>
                            <h3 className={s.landingContentTitle}>Retreat Addons</h3>
                            <form onSubmit={handleSubmit}>
                                <FormGroup>
                                    <Grid fluid>
                                        <Row className="show-grid">
                                            {
                                                addons.map((each, index) => (
                                                    <Field id={each} key={index} name="addons" component={this.renderFormControlCheckbox} label={each} checked={includedText.includes(each)} />
                                                ))
                                            }
                                        </Row>
                                    </Grid>
                                </FormGroup>
                            </form>
                        </div>
                    </Col>
                    <Col xs={12}>
                        {
                            includedAddons.map((item, index) => (
                                <div className={s.addonsBox} key={index}>
                                    <FormControl
                                        type="text"
                                        value={item.name}
                                        placeholder="Enter Name"
                                        className={s.formControlInput}
                                        onChange={(e) => {
                                            console.log('on-blur-handle-change');
                                            this.handleNameChange(index, e.target.value)
                                        }}
                                    />

                                    <div className={s.customOptionBox}>
                                        <FormControl
                                            type="text"
                                            value={item.price}
                                            placeholder="Enter Price"
                                            className={s.formControlInput}
                                            onChange={(e) => {
                                                this.handlePriceChange(index, e.target.value)
                                            }}
                                        />
                                        <CloseButton label="close" onClick={() => {this.removeAddons(index)}}/>
                                    </div>
                                </div>
                            ))
                        }
                    </Col>
                </Row>
            </Grid>
        );
    }
}

RetreatAddons = reduxForm({
    form: 'RetreatForm', // a unique name for this form
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
    validate,
    onSubmit: submit
})(RetreatAddons);

const mapState = (state) => ({
    formData: state.form.RetreatForm,
});

const mapDispatch = {
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(RetreatAddons)));
