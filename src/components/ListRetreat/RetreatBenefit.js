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

class RetreatBenefit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            benefits: [],
            benefitTexts: [],
            benefitIds: [],
            changedAt: ''
        };
    }

    renderFormControlCheckbox = ({ input: { value, onChange }, id, label, checked, desc, meta: { touched, error }, children, className }) => {
        const { formatMessage } = this.props.intl;
        return (
            <Col xs={12} md={3}>
                <Checkbox id={id} inline onChange={e => {
                    let { benefitTexts, benefitIds, benefits } = this.state;
                    if (e.target.checked) {
                        benefitTexts.push(desc);
                        benefitIds.push(id);
                    } else {
                        benefitTexts.splice(benefitTexts.indexOf(desc), 1);
                        benefitIds.splice(benefitIds.indexOf(id), 1);
                    }
                    benefits = benefits.map(item => {
                        return {
                            ...item,
                            checked: benefitIds.indexOf(item.id) >= 0
                        }
                    })
                    this.setState({benefitTexts, benefitIds, benefits});
                    onChange(benefitIds)
                }} checked={checked}>{label}</Checkbox>
            </Col>
        )
    }

    static getDerivedStateFromProps(props, state) {
        const { listingFields, formData } = props;
        let { benefitIds } = state;

        if (listingFields && listingFields.benefitType && listingFields.benefitType.length > 0) {
            let benefitTypes = listingFields.benefitType;
            let names = benefitTypes.map(item=>item.itemName);
            names.sort();
            let results = [];
            for (let i = 0; i < names.length; i ++) {
                for (let j = 0; j < benefitTypes.length; j ++) {
                    if (names[i] === benefitTypes[j].itemName) {
                        results.push(benefitTypes[j]);
                        break;
                    }
                }
            }
            if (formData.values && formData.values.benefits) {
                for (let i = 0; i < formData.values.benefits.length; i ++) {
                    let item = formData.values.benefits[i];
                    if (!benefitIds.includes(item)) {
                        benefitIds.push(item);
                    }
                }
            }
            results = results.map(item => {
                return {
                    ...item,
                    checked: benefitIds.indexOf(item.id) >= 0
                }
            })
            let benefitTexts = [];
            for (let i = 0; i < benefitIds.length; i++) {
                let id = benefitIds[i];
                let item = results.filter(item => item.id == id);
                benefitTexts.push(item[0].otherItemName);
            }

            return { benefits: results, benefitTexts, benefitIds };
        } else {
            return null;
        }
    }

    handleDismissAlert(index) {
        let {benefitIds, benefitTexts, benefits} = this.state;
        benefitIds.splice(index, 1)
        benefitTexts.splice(index, 1)
        benefits = benefits.map(item => {
            return {
                ...item,
                checked: benefitIds.indexOf(item.id) >= 0
            }
        })
        this.setState({
            benefitIds,
            benefitTexts,
            benefits
        })
    }

    async onFocus() {
        const {dispatch} = this.props;
        await dispatch(change('RetreatForm', 'showTip', false));
        await dispatch(change('RetreatForm', 'tipForm', 'RetreatBenefit'));
    }

    async onBlur() {
        const {dispatch} = this.props;
        await dispatch(change('RetreatForm', 'showTip', false));
    }

    render() {
        const { handleSubmit } = this.props;
        const { benefits, benefitTexts, benefitIds } = this.state;

        return (
            <Grid fluid onMouseEnter={() => {this.onFocus()}} onMouseLeave={() => this.onBlur()}>
                <Row className={s.landingContainer}>
                    <Col xs={12}>
                        <div>
                            <h3 className={s.landingContentTitle}><FormattedMessage {...messages.retreatBenefit} /></h3>
                            <form onSubmit={handleSubmit}>
                                <FormGroup>
                                    <Grid fluid>
                                        <Row className="show-grid">
                                            {
                                                benefits.map((each, index) => (
                                                    <Field id={each.id} key={index} name="benefits" component={this.renderFormControlCheckbox} label={each.itemName} checked={each.checked} desc={each.otherItemName} />
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
                            benefitTexts.map((item, index) => (
                                <Alert bsStyle="success" className={s.listAlert} onDismiss={() => this.handleDismissAlert(index)} key={index}>
                                    <p>
                                        {item}
                                    </p>
                                </Alert>
                            ))
                        }
                    </Col>
                </Row>
            </Grid>
        );
    }
}

RetreatBenefit = reduxForm({
    form: 'RetreatForm', // a unique name for this form
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
    validate,
    onSubmit: submit
})(RetreatBenefit);

const mapState = (state) => ({
    listingFields: state.listingFields.data,
    formData: state.form.RetreatForm,
});

const mapDispatch = {
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(RetreatBenefit)));
