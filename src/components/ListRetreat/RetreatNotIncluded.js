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

class RetreatNotIncluded extends Component {
    constructor(props) {
        super(props);

        this.state = {
            includes: [],
            includedTexts: [],
            includedIds: [],
            customOptions: [],
            customOptionIndex: 0,
        };
    }

    renderFormControlCheckbox = ({ input: { value, onChange }, id, label, checked, desc, meta: { touched, error }, children, className }) => {
        const { formatMessage } = this.props.intl;
        return (
            <Col xs={12} md={3}>
                <Checkbox id={id} inline onChange={e => {
                    let { includedTexts, includedIds, includes } = this.state;
                    if (e.target.checked) {
                        includedTexts.push(desc);
                        includedIds.push(id);
                    } else {
                        includedTexts.splice(includedTexts.indexOf(desc), 1);
                        includedIds.splice(includedIds.indexOf(id), 1);
                    }
                    includes = includes.map(item => {
                        return {
                            ...item,
                            checked: includedIds.indexOf(item.id) >= 0
                        }
                    })
                    this.setState({includedTexts, includedIds, includes});
                    onChange(includedIds)
                }} checked={checked}>{label}</Checkbox>
            </Col>
        )
    }

    renderFormControl = ({ input, label, type, value, index, meta: { touched, error }, className }) => {
        const { formatMessage } = this.props.intl;
        return (
            <div className={s.customOptionBox}>
                {touched && error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
                <FormControl {...input} placeholder={label} type={type} className={className} value={value} onChange={e => {
                    console.log('handle-input-change:', e.target.value);
                    let {customOptions} = this.state;
                    customOptions[index].value = e.target.value;
                    this.setState({customOptions});
                }}/>
                <CloseButton label="close" className={s.btnRemoveOption} onClick={() => {this.removeCustomOption(index)}}/>
            </div>
        )
    }

    addCustomOption = () => {
        let { customOptions, customOptionIndex } = this.state;
        customOptions.push({
            id: customOptionIndex,
            value: ''
        });
        console.log('add-custom-option');
        this.setState({customOptions, customOptionIndex: customOptionIndex + 1});
    }

    removeCustomOption = (index) => {
        console.log('remove-custom-option:', index);
        let { customOptions } = this.state;
        const newArray = customOptions.filter((_, i) => i !== index);
        this.setState({customOptions: newArray})
    }

    static getDerivedStateFromProps(props, state) {
        const { listingFields, formData } = props;
        let { includedIds } = state;

        if (listingFields && listingFields.retreatNotIncluded && listingFields.retreatNotIncluded.length > 0) {
            let includes = listingFields.retreatNotIncluded;

            if (formData.values && formData.values.not_includes) {
                for (let i = 0; i < formData.values.not_includes.length; i ++) {
                    let id = formData.values.not_includes[i];
                    if (!includedIds.includes(id)) {
                        includedIds.push(id);
                    }
                }
            }
            includes = includes.map(item => {
                return {
                    ...item,
                    checked: includedIds.indexOf(item.id) >= 0
                }
            })
            let includedTexts = [];
            for (let i = 0; i < includedIds.length; i ++) {
                let id = includedIds[i];
                let item = includes.filter(item => item.id == id);
                includedTexts.push(item[0].otherItemName);
            }
            return { includes, includedTexts, includedIds };
        } else {
            return null;
        }
    }

    handleDismissAlert(index) {
        let {includedIds, includedTexts, includes} = this.state;
        includedIds.splice(index, 1)
        includedTexts.splice(index, 1)
        includes = includes.map(item => {
            return {
                ...item,
                checked: includedIds.indexOf(item.id) >= 0
            }
        })
        this.setState({
            includedIds,
            includedTexts,
            includes
        })
    }

    async onFocus() {
        const {dispatch} = this.props;
        await dispatch(change('RetreatForm', 'showTip', true));
        await dispatch(change('RetreatForm', 'tipForm', 'RetreatNotIncluded'));
    }

    async onBlur() {
        const {dispatch} = this.props;
        await dispatch(change('RetreatForm', 'showTip', false));
    }

    render() {
        const { handleSubmit } = this.props;
        const { includes, includedTexts, customOptions } = this.state;

        return (
            <Grid fluid onMouseEnter={() => {this.onFocus()}} onMouseLeave={() => this.onBlur()}>
                <Row className={s.landingContainer}>
                    <Col xs={12}>
                        <div>
                            <h3 className={s.landingContentTitle}><FormattedMessage {...messages.retreatNotIncluded} /></h3>
                            <form onSubmit={handleSubmit}>
                                <FormGroup>
                                    <Grid>
                                        <Row className="show-grid">
                                            {
                                                includes.map((each, index) => (
                                                    <Field id={each.id} key={index} name="not_includes" component={this.renderFormControlCheckbox} label={each.itemName} checked={each.checked} desc={each.otherItemName} />
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
                            includedTexts.map((item, index) => (
                                <Alert bsStyle="success" className={s.listAlert} onDismiss={() => this.handleDismissAlert(index)} key={index}>
                                    <p>
                                        {item}
                                    </p>
                                </Alert>
                            ))
                        }
                    </Col>

                    <Col xs={12}>
                        {
                            customOptions.map((item, index) => (
                                <Field
                                    key={item.id}
                                    name="custom_not_included[]"
                                    type="text"
                                    value={item.value}
                                    index={index}
                                    component={this.renderFormControl}
                                    className={s.formControlInput}
                                />
                            ))
                        }
                        <Button bsStyle="link" className={s.btnAdd} onClick={() => {this.addCustomOption()}}>+ Add your own option</Button>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

RetreatNotIncluded = reduxForm({
    form: 'RetreatForm', // a unique name for this form
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
    validate,
    onSubmit: submit
})(RetreatNotIncluded);

const mapState = (state) => ({
    listingFields: state.listingFields.data,
    formData: state.form.RetreatForm,
});

const mapDispatch = {
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(RetreatNotIncluded)));
