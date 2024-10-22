// General
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Redux Form
import {Field, reduxForm, formValueSelector, change} from 'redux-form';

// Redux
import { connect } from 'react-redux';
import { updateLocationStatus } from '../../actions/getLocation';
import { updateListingMap } from '../../actions/updateListingMap';

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

// Translation
import { injectIntl, FormattedMessage } from 'react-intl';

// Locale
import messages from '../../locale/messages';


// Helpers
import validate from './validate';

// Internal Component
import PlacesSuggest from '../PlacesSuggest';
import ListPlaceTips from '../ListPlaceTips';
import CountryList from '../CountryList';
import Loader from '../Loader';

import submit from './submit';

class Location extends Component {

    static propTypes = {
        initialValues: PropTypes.object,
        isLocationChosen: PropTypes.bool,
        previousPage: PropTypes.any,
        onSubmit: PropTypes.any,
        updateLocationStatus: PropTypes.any,
        nextPage: PropTypes.any,
        isExistingList: PropTypes.bool,
        updateListingMap: PropTypes.any,
        mapUpdateLoading: PropTypes.bool
    };

    constructor(props) {
        super(props);

        const { isExistingList, isLocationChosen } = props;
        if (!isLocationChosen && !isExistingList) {
            this.state = {
                hideSuggestInput: false
            };
        } else {
            this.state = {
                hideSuggestInput: true,
            };
        }

        this.renderCountryList = this.renderCountryList.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        const { isExistingList, isLocationChosen, formData } = props;

        if (formData.values && formData.values.city) {
            return { hideSuggestInput: true };
        }

        if (!isLocationChosen && !isExistingList && state.hideSuggestInput !== false) {
            return { hideSuggestInput: false };
        } else if ((isLocationChosen || isExistingList) && state.hideSuggestInput !== true) {
            return { hideSuggestInput: true };
        } else {
            return null;
        }
    }

    renderPlacesSuggest = ({ input, label, meta: { touched, error }, className }) => {
        const { formatMessage } = this.props.intl;
        return (
            <div>
                {touched && error && <span>{formatMessage(error)}</span>}
                <PlacesSuggest
                    {...input}
                    label={label}
                    className={className}
                />
            </div>
        )
    }


    renderField = ({ input, label, type, meta: { touched, error, dirty } }) => {
        const { formatMessage } = this.props.intl;
        return (
            <div>
                <label>{label}</label>
                <div>
                    <input {...input} placeholder={label} type={type} />
                    {touched && error && <span>{formatMessage(error)}</span>}
                </div>
            </div>
        )
    }

    renderFormControl = ({ input, label, type, meta: { touched, error }, className }) => {
        const { formatMessage } = this.props.intl;
        return (
            <div>
                {touched && error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
                <FormControl {...input} placeholder={label} type={type} className={className} />
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


    renderCountryList({ input, label, meta: { touched, error }, children, className }) {
        const { formatMessage } = this.props.intl;
        return <CountryList input={input} className={className} />
    }

    renderLocationInput = () => {
        const { updateLocationStatus, nextPage, previousPage, loading } = this.props;
        const { formatMessage } = this.props.intl;
        return (
            <div>
                <div >
                    <h3 className={s.landingContentTitle}>
                        <FormattedMessage {...messages.location} />
                    </h3>
                    <FormGroup className={s.formGroup}>
                        <Field
                            name="location"
                            component={this.renderPlacesSuggest}
                            label={formatMessage(messages.yourFullAddress)}
                            className={cx(s.formControlInput, s.jumboInput)}
                        />
                    </FormGroup>
                </div>
            </div>
        );
    }

    renderLocationForm = () => {
        const { isExistingList, nextPage, previousPage, onSubmit, invalid, updateListingMap, loading, mapUpdateLoading } = this.props;
        const { formatMessage } = this.props.intl;
        const { error, handleSubmit, submitting, valid } = this.props;
        let isDisabled = true;
        if (valid) {
            isDisabled = false;
        }
        return (
            <div>
                <div >
                    <h3 className={s.landingContentTitle}>
                        <FormattedMessage {...messages.location} />
                    </h3>

                    <FormGroup className={s.formGroup}>
                        <ControlLabel className={s.landingLabel}>
                            <FormattedMessage {...messages.country} />
                        </ControlLabel>
                        <Field name="country" component={this.renderCountryList} className={cx(s.formControlSelect, s.jumboSelect, s.formControlSelectLarge)} />
                    </FormGroup>

                    <FormGroup className={s.formGroup}>
                        <ControlLabel className={s.landingLabel}>
                            <FormattedMessage {...messages.street} />
                        </ControlLabel>
                        <Field
                            name="street"
                            component={this.renderFormControl}
                            className={cx(s.formControlInput, s.jumboInput)}
                            label={formatMessage(messages.street)}
                        />
                    </FormGroup>

                    <FormGroup className={s.formGroup}>
                        <ControlLabel className={s.landingLabel}>
                            <FormattedMessage {...messages.buildingName} />
                        </ControlLabel>
                        <Field
                            name="buildingName"
                            component={this.renderFormControl}
                            className={cx(s.formControlInput, s.jumboInput)}
                            label={formatMessage(messages.buildingName)}
                        />
                    </FormGroup>

                    <Row>
                        <Col xs={12} sm={6} md={6} lg={6}>
                            <FormGroup className={s.formGroup}>
                                <ControlLabel className={s.landingLabel}>
                                    <FormattedMessage {...messages.city} />
                                </ControlLabel>
                                <Field
                                    name="city"
                                    component={this.renderFormControl}
                                    className={cx(s.formControlInput, s.jumboInput)}
                                />
                            </FormGroup>
                        </Col>
                        <Col xs={12} sm={6} md={6} lg={6}>
                            <FormGroup className={s.formGroup}>
                                <ControlLabel className={s.landingLabel}>
                                    <FormattedMessage {...messages.state} />
                                </ControlLabel>
                                <Field
                                    name="state"
                                    component={this.renderFormControl}
                                    className={cx(s.formControlInput, s.jumboInput)}
                                />
                            </FormGroup>
                        </Col>
                    </Row>

                    <FormGroup className={s.formGroup}>
                        <Row>
                            <Col xs={12} sm={6} md={6} lg={6}>
                                <ControlLabel className={s.landingLabel}>
                                    <FormattedMessage {...messages.zipcode} />
                                </ControlLabel>
                                <Field
                                    name="zipcode"
                                    component={this.renderFormControl}
                                    className={cx(s.formControlInput, s.jumboInput)}
                                />
                            </Col>
                        </Row>
                    </FormGroup>

                </div>
            </div>
        );
    }

    async onFocus() {
        const {dispatch} = this.props;
        await dispatch(change('RetreatForm', 'showTip', true));
        await dispatch(change('RetreatForm', 'tipForm', 'Location'));
    }

    async onBlur() {
        const {dispatch} = this.props;
        await dispatch(change('RetreatForm', 'showTip', false));
    }

    render() {

        const { error, handleSubmit, submitting, pristine, onSubmit } = this.props;
        const { formatMessage } = this.props.intl;
        const { hideSuggestInput } = this.state;

        return (
            <Grid fluid onMouseEnter={() => {this.onFocus()}} onMouseLeave={() => this.onBlur()}>
                <Row className={s.landingContainer}>
                    <Col xs={12}>
                        <form onSubmit={handleSubmit}>
                            {error && <strong>{formatMessage(error)}</strong>}
                            {
                                hideSuggestInput && this.renderLocationForm()
                            }
                            {
                                !hideSuggestInput && this.renderLocationInput()
                            }
                        </form>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

Location = reduxForm({
    form: 'RetreatForm', // a unique name for this form
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
    validate,
    onSubmit: submit
})(Location);

const mapState = (state) => ({
    isLocationChosen: state.location.isLocationChosen,
    isExistingList: state.location.isExistingList,
    loading: state.loader.location,
    mapUpdateLoading: state.location.mapUpdateLoading,
    formData: state.form.RetreatForm,
});

const mapDispatch = {
    updateLocationStatus,
    updateListingMap
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(Location)));
