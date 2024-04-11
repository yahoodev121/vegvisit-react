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

class YogaType extends Component {
    constructor(props) {
        super(props);

        this.state = {
            yogaType: [],
            selected: []
        };
    }

    renderFormControlCheckbox = ({ input: { value, onChange }, id, label, checked, meta: { touched, error }, children, className }) => {
        const { formatMessage } = this.props.intl;
        return (
            <Col xs={12} md={3}>
                <Checkbox id={id} inline onChange={e => {
                    let newValue;
                    if (!value) newValue = [id];
                    else newValue = ([...value, id].filter((value, index, self) => {
                        return self.indexOf(value) === index;
                    }))
                    if (!e.target.checked) newValue = newValue.filter(each => each !== id)
                    onChange(newValue)
                }} checked={checked}>{label}</Checkbox>
            </Col>
        )
    }

    static getDerivedStateFromProps(props, state) {
        const { listingFields, formData } = props;

        let data = {}
        if (formData.values && formData.values.yogaTypes) {
            let selected = formData.values.yogaTypes;
            data = {
                selected: selected
            }
        }


        if (listingFields && listingFields.yogaType && listingFields.yogaType.length > 0) {
            let yogaType = listingFields.yogaType;
            let names = yogaType.map(item=>item.itemName);
            names.sort();
            let results = [];
            for (let i = 0; i < names.length; i ++) {
                for (let j = 0; j < yogaType.length; j ++) {
                    if (names[i] === yogaType[j].itemName) {
                        results.push(yogaType[j]);
                        break;
                    }
                }
            }
            return { ...data, yogaType: results };
        } else {
            return {...data};
        }
    }

    render() {
        const { handleSubmit } = this.props;
        const { yogaType, selected } = this.state;

        return (
            <Grid fluid>
                <Row className={s.landingContainer}>
                    <Col xs={12}>
                        <div>
                            <h3 className={s.landingContentTitle}><FormattedMessage {...messages.yogaType} /></h3>
                            <form onSubmit={handleSubmit}>
                                <FormGroup>
                                    <Grid fluid>
                                        <Row className="show-grid">
                                            {
                                                yogaType.map((each, index) => (
                                                    <Field id={each.id} key={index} name="yogaTypes" component={this.renderFormControlCheckbox} label={each.itemName} checked={selected.includes(each.id)}/>
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

YogaType = reduxForm({
    form: 'RetreatForm', // a unique name for this form
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
    validate,
    onSubmit: submit
})(YogaType);

const mapState = (state) => ({
    listingFields: state.listingFields.data,
    formData: state.form.RetreatForm,
});

const mapDispatch = {
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(YogaType)));
