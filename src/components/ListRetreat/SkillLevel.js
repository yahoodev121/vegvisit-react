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

class SkillLevel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            skillLevel: [],
            selected: []
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

        if (formData.values && formData.values.skillLevels) {
            data = {
                selected: formData.values.skillLevels
            };
        }

        if (listingFields && listingFields.skillLevel && listingFields.skillLevel.length > 0) {
            return { ...data, skillLevel: listingFields.skillLevel };
        } else {
            return {
                ...data
            };
        }
    }

    render() {
        const { handleSubmit } = this.props;
        const { skillLevel, selected } = this.state;

        return (
            <Grid fluid>
                <Row className={s.landingContainer}>
                    <Col xs={12}>
                        <div>
                            <h3 className={s.landingContentTitle}><FormattedMessage {...messages.skillLevel} /></h3>
                            <form onSubmit={handleSubmit}>
                                <FormGroup>
                                    {
                                        skillLevel.map((each, index) => (
                                            <Field id={each.id} key={index} name="skillLevels" component={this.renderFormControlCheckbox} checked={selected.includes(each.id)} label={each.itemName} />
                                        ))
                                    }
                                </FormGroup>
                            </form>
                        </div>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

SkillLevel = reduxForm({
    form: 'RetreatForm', // a unique name for this form
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
    validate,
    onSubmit: submit
})(SkillLevel);

const mapState = (state) => ({
    listingFields: state.listingFields.data,
    formData: state.form.RetreatForm,
});

const mapDispatch = {
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(SkillLevel)));
