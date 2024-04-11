// General
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Redux Form
import { Field, reduxForm, formValueSelector } from 'redux-form';

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

class TeacherLocation extends Component {

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
        const { isExistingList, isLocationChosen } = props;
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
        const { index } = this.props;
        const { formatMessage } = this.props.intl;
        return (
            <div>
                <div >
                    <h3 className={s.landingContentTitle}>
                        <FormattedMessage {...messages.location} />
                    </h3>
                    <FormGroup className={s.formGroup}>
                        <Field
                            name={"teacher_location_" + index}
                            component={this.renderPlacesSuggest}
                            label={formatMessage(messages.yourFullAddress)}
                            className={cx(s.formControlInput)}
                        />
                    </FormGroup>
                </div>
            </div>
        );
    }

    renderLocationForm = () => {
        const { isExistingList, nextPage, previousPage, onSubmit, invalid, updateListingMap, loading, mapUpdateLoading, index } = this.props;
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
                        <Field name={`teachers.${index}.location.country`} component={this.renderCountryList} className={cx(s.formControlSelect)} />
                    </FormGroup>

                    <FormGroup className={s.formGroup}>
                        <ControlLabel className={s.landingLabel}>
                            <FormattedMessage {...messages.street} />
                        </ControlLabel>
                        <Field
                            name={`teachers.${index}.location.street`}
                            component={this.renderFormControl}
                            className={cx(s.formControlInput)}
                            label={formatMessage(messages.street)}
                        />
                    </FormGroup>

                    <FormGroup className={s.formGroup}>
                        <ControlLabel className={s.landingLabel}>
                            <FormattedMessage {...messages.buildingName} />
                        </ControlLabel>
                        <Field
                            name={`teachers.${index}.location.buildingName`}
                            component={this.renderFormControl}
                            className={cx(s.formControlInput)}
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
                                    name={`teachers.${index}.location.city`}
                                    component={this.renderFormControl}
                                    className={cx(s.formControlInput)}
                                />
                            </FormGroup>
                        </Col>
                        <Col xs={12} sm={6} md={6} lg={6}>
                            <FormGroup className={s.formGroup}>
                                <ControlLabel className={s.landingLabel}>
                                    <FormattedMessage {...messages.state} />
                                </ControlLabel>
                                <Field
                                    name={`teachers.${index}.location.state`}
                                    component={this.renderFormControl}
                                    className={cx(s.formControlInput)}
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
                                    name={`teachers.${index}.location.zipcode`}
                                    component={this.renderFormControl}
                                    className={cx(s.formControlInput)}
                                />
                            </Col>
                        </Row>
                    </FormGroup>

                </div>
            </div>
        );
    }

    render() {

        const { error, handleSubmit, submitting, pristine, onSubmit } = this.props;
        const { formatMessage } = this.props.intl;
        const { hideSuggestInput } = this.state;

        return (
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
        );
    }
}

TeacherLocation = reduxForm({
    form: 'RetreatForm', // a unique name for this form
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
    validate,
    onSubmit: submit
})(TeacherLocation);

const mapState = (state) => ({
    isLocationChosen: state.location.isLocationChosen,
    isExistingList: state.location.isExistingList,
    loading: state.loader.location,
    mapUpdateLoading: state.location.mapUpdateLoading
});

const mapDispatch = {
    updateLocationStatus,
    updateListingMap
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(TeacherLocation)));
