// General
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Redux Form
import { Field, reduxForm, formValueSelector } from 'redux-form';

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
    Grid,
    Button,
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

class Drink extends Component {
    constructor(props) {
        super(props);

        this.state = {
            drinks: [],
            selected: [],
        };
    }

    renderFormControlCheckbox = ({ input: { value, onChange }, id, label, checked, meta: { touched, error }, children, className }) => {
        const { formatMessage } = this.props.intl;
        return (
            <Checkbox id={id} inline onChange={e => {
                let newValue;
                if (!value) newValue = [id];
                else newValue = ([...value, id].filter((value, index, self) => {
                    return self.indexOf(value) === index;
                }))
                if (!e.target.checked) newValue = newValue.filter(each => each !== id)
                onChange(newValue)
            }} checked={checked}>{label}</Checkbox>
        )
    }

    static getDerivedStateFromProps(props, state) {
        const { listingFields, formData } = props;

        let data = {};
        if (formData.values && formData.values.drink) {
            data = {
                selected: formData.values.drink
            };
        }

        if (listingFields && listingFields.retreatDrink && listingFields.retreatDrink.length > 0) {
            return { ...data, drinks: listingFields.retreatDrink };
        } else {
            return {
                ...data
            };
        }
    }

    render() {
        const { handleSubmit } = this.props;
        const { drinks, selected } = this.state;

        return (
            <Grid fluid>
                <Row className={s.landingContainer}>
                    <Col xs={12}>
                        <div>
                            <h3 className={s.landingContentTitle}>Drinks included</h3>
                            <form onSubmit={handleSubmit}>
                                <FormGroup>
                                    <Grid>
                                        <Row className="show-grid">
                                            {
                                                drinks.map((each, index) => (
                                                    <Field id={each.id} key={index} name="drink" component={this.renderFormControlCheckbox} label={each.itemName} checked={selected.includes(each.id)}/>
                                                ))
                                            }
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

Drink = reduxForm({
    form: 'RetreatForm', // a unique name for this form
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
    validate,
    onSubmit: submit
})(Drink);

const mapState = (state) => ({
    listingFields: state.listingFields.data,
    formData: state.form.RetreatForm,
});

const mapDispatch = {
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(Drink)));
