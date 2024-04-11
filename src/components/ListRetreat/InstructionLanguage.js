// General
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

// Redux Form
import {Field, reduxForm, formValueSelector, change} from 'redux-form';

// Translation
import { injectIntl, FormattedMessage } from 'react-intl';

// Locale
import messages from '../../locale/messages';


// Helpers
import validate from './validate';

// Redux
import { connect } from 'react-redux';

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
    FormControl
} from 'react-bootstrap';
import s from './ListRetreat.css';

import submit from './submit';

class InstructionLanguage extends Component {

    static propTypes = {
        initialValues: PropTypes.object,
        previousPage: PropTypes.any,
        nextPage: PropTypes.any,
    };

    constructor(props) {
        super(props);

        const { listingFields, valid } = props;
        this.state = {
            isDisabled: !valid,
            instructionLanguage: [],
        }
    }

    componentDidMount() {
        const { valid } = this.props;

        if (valid) {
            this.setState({ isDisabled: false });
        } else {
            this.setState({ isDisabled: true });
        }
    }

    static getDerivedStateFromProps(props, state) {
        const { valid, listingFields, language, formData, dispatch } = props;

        if (language && language.length > 0) {
            if (formData.values && !formData.values.languageId) {
                dispatch(change('RetreatForm', 'languageId', language[0].id));
            }
            return {
                instructionLanguage: language
            }
        }

        return {
            instructionLanguage: []
        }
    }

    renderSelectField = ({ input, label, meta: { touched, error }, children }) => {
        const { formatMessage } = this.props.intl;

        return (
            <div>
                <select
                    {...input}
                >
                    {children}
                </select>
                {touched && error && <span>{formatMessage(error)}</span>}
            </div>
        )
    }

    renderFormControlSelect = ({ input, label, meta: { touched, error }, children, className }) => {
        const { formatMessage } = this.props.intl;
        return (
            <div>
                <FormControl componentClass="select" {...input} className={className} >
                    {children}
                </FormControl>
            </div>
        )
    }

    render() {
        const { handleSubmit, submitting, pristine, valid, previousPage, nextPage, existingList } = this.props;
        const { instructionLanguage } = this.state;
        let path = "index";
        if (existingList) {
            path = "home";
        }

        return (
            <Grid fluid>
                <Row className={cx(s.landingContainer)}>
                    <Col xs={12} >
                        <div>
                            <h3 className={s.landingContentTitle}><FormattedMessage {...messages.instructionLanguage} /></h3>
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <FormGroup className={s.formGroup}>
                                        <Field name="languageId" component={this.renderFormControlSelect} className={cx(s.formControlSelect, s.jumboSelect)} >
                                            {
                                                instructionLanguage.map((value, key) => {
                                                    return (
                                                        <option value={value.id} key={key}>{value.name}</option>
                                                    )
                                                })
                                            }
                                        </Field>
                                    </FormGroup>
                                </div>
                            </form>
                        </div>
                    </Col>
                </Row>
            </Grid>
        )
    }
}

InstructionLanguage = reduxForm({
    form: 'RetreatForm', // a unique name for this form
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
    validate,
    onSubmit: submit
})(InstructionLanguage);

const mapState = (state) => ({
    listingFields: state.listingFields.data,
    language: state.language.languages,
    formData: state.form.RetreatForm,
});

const mapDispatch = {
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(InstructionLanguage)));
