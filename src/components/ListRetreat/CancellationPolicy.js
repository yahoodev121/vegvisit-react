// General
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Link from "../Link";

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
    FormControl, Radio, Checkbox
} from 'react-bootstrap';
import s from './ListRetreat.css';

import submit from './submit';

class CancellationPolicy extends Component {

    static propTypes = {
        initialValues: PropTypes.object,
        previousPage: PropTypes.any,
        nextPage: PropTypes.any,
    };

    constructor(props) {
        super(props);
        console.log('cancellation-construct');
        const { listingFields, valid } = props;
        this.state = {
            isDisabled: !valid,
            cancellationType: [],
            yesNo: ["Yes", "No"],
            selectedType: '',
            flexibilities: [{
                id: 'yes',
                label: 'This retreat can be transferred to another date (Highly recommended)'
            }, {
                id: 'no',
                label: 'We do not allow any changes of dates by a customer (Not recommended)'
            }],
            increaseBookingOptions: [{
                id: 'yes',
                label: 'Yes, more bookings for me (best option)'
            }, {
                id: 'no',
                label: 'No, I\'m fine with less (not recommended)'
            }],
            useIncreaseBooking: false
        }

        if (typeof window !== 'undefined') {
            this.ReactQuill = require('react-quill');
        }
        this.quillRef = React.createRef();
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
        const { valid, listingFields, formData } = props;

        let optionState = {};
        if (formData.values && formData.values.cancellationPolicy) {
            optionState = {
                selectedType: formData.values.cancellationPolicy
            }
        }
        if (formData.values && formData.values.use_increase_booking) {
            optionState = {
                ...optionState,
                useIncreaseBooking: formData.values.use_increase_booking === 'yes'
            }
        }
        if (listingFields && listingFields.cancellationType && listingFields.cancellationType.length > 0) {
            return {
                ...optionState,
                cancellationType: listingFields.cancellationType
            }
        }
        return {
            ...optionState,
            cancellationType: []
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

    renderFormInput = ({ input, type, meta: { touched, error }, className }) => {
        const { formatMessage } = this.props.intl;
        return (
            <div>
                {touched && error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
                <FormControl {...input} type={type} className={className} />
            </div>
        )
    }

    renderFormControlRadioButton = ({input: { value, onChange }, id, fieldName, label, checked, meta: { touched, error }, children, className,}) => {
        console.log('render-form-control-radio-button:', fieldName);
        const { formatMessage } = this.props.intl;
        const { change } = this.props;
        return (
            <Radio
                id={id}
                name={fieldName}
                inline
                onChange={(e) => {
                    onChange(id);
                    change("category", null);
                }}
                checked={checked}
            >
                {label}
            </Radio>
        );
    };

    renderFormControlTextArea = ({
                                     input,
                                     label,
                                     meta: { touched, error },
                                     children,
                                     className,
                                 }) => {
        const ReactQuill = this.ReactQuill;
        const { formatMessage } = this.props.intl;

        let modules = {
            toolbar: {
                container: [
                    [{ 'header': '1' }, { 'header': '2' }],
                    [{ size: [] }],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' },
                        { 'indent': '-1' }, { 'indent': '+1' }],
                    ['link'],
                    ['image'],
                ],
                handlers: {
                    'image': this.imageHandler
                }
            },
            clipboard: {
                matchVisual: false,
            }
        };

        let formats = [
            'header', 'size',
            'bold', 'italic', 'underline', 'strike', 'blockquote',
            'list', 'bullet', 'indent',
            'link',
            'image'
        ];

        return (
            <div>
                {touched && error && (
                    <span className={s.errorMessage}>{formatMessage(error)}</span>
                )}
                <ReactQuill
                    ref={(el) => this.quillRef = el}
                    {...input}
                    onChange={async (newValue, delta, source) => {
                        if (source === 'user') {
                            input.onChange(newValue);
                        }
                    }}
                    onBlur={(range, source, quill) => {
                        if (quill.getHTML() == '<p><br></p>') {
                            input.onBlur('');
                        }
                        else {
                            input.onBlur(quill.getHTML());
                        }
                    }}
                    placeholder={label}
                    modules={modules}
                    formats={formats}
                    theme="snow"
                />
            </div>
        );
    };

    async onFocus(name) {
        const {dispatch} = this.props;
        await dispatch(change('RetreatForm', 'showTip', true));
        await dispatch(change('RetreatForm', 'tipForm', name));
    }

    async onBlur() {
        const {dispatch} = this.props;
        await dispatch(change('RetreatForm', 'showTip', false));
    }

    render() {
        const { handleSubmit, submitting, pristine, valid, previousPage, nextPage, existingList, formData } = this.props;
        const { cancellationType, yesNo, selectedType, flexibilities, increaseBookingOptions, useIncreaseBooking } = this.state;
        let path = "index";
        if (existingList) {
            path = "home";
        }

        return (
            <Grid fluid>
                <Row className={cx(s.landingContainer)}>
                    <Col xs={12} >
                        <div>
                            <h3 className={s.landingContentTitle}><FormattedMessage {...messages.cancellationPolicy} /></h3>
                            <p>
                                In order to best serve everyone, we've standardized the cancellation policies for retreats. Less confusion. More clarity. Both lead to more bookings and less headaches for you.<br/>
                                You can choose between 3 standardized policies: Free, Flexible and Moderate.<br/>
                                We highly encourage you to choose a standard policy and be a part of the simplicity movement. If none of them fits your business, you can choose the custom option and create your own. You can see our <Link to={'/page/retreat-cancellation-policy'}>full cancellation policy here</Link>.
                            </p>
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <FormGroup className={s.formGroup}>
                                        <ControlLabel className={s.landingLabel}>
                                            <FormattedMessage {...messages.cancellationPolicy} />
                                        </ControlLabel>
                                        {cancellationType.map((each, ii) => (
                                          <Radio
                                            key={ii}
                                            name="cancellationPolicy"
                                            inline
                                            value={each.itemName}
                                            onMouseEnter={() => {this.onFocus(`Cancellation${each.itemName}`)}}
                                            onMouseLeave={() => this.onBlur()}
                                            checked={formData.values && formData.values.cancellationPolicy && formData.values.cancellationPolicy == each.id}
                                          >
                                              {each.itemName}
                                          </Radio>
                                        ))}
                                    </FormGroup>
                                </div>
                            </form>
                        </div>
                    </Col>

                    { selectedType === 'Custom' && (
                        <div>
                            <Col xs={12}>
                                <h4>Deposit is refundable</h4>
                                <FormGroup>
                                    {yesNo.map((each, index) => (
                                        <Field
                                            id={each}
                                            key={index}
                                            fieldName="deposit_refundable"
                                            component={this.renderFormControlRadioButton}
                                            label={each}
                                            checked={formData.values && formData.values.deposit_refundable == each}
                                        />
                                    ))}
                                </FormGroup>
                            </Col>
                            <Col xs={12}>
                                <h4>How many days before the event must someone cancel to be eligible for a 100% refund of their deposit?</h4>

                                <FormGroup>
                                    <Field type="text"
                                           name="refund_before_days_100"
                                           component={this.renderFormInput}
                                           className={cx(s.formControlInput)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs={12}>
                                <h4>How many days before the event must someone cancel to be eligible for a 50% refund of their deposit?</h4>

                                <FormGroup>
                                    <Field type="text"
                                           name="refund_before_days_50"
                                           component={this.renderFormInput}
                                           className={cx(s.formControlInput)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs={12}>
                                <h4>Can customers pay the remaining balance (total price minus deposit) upon arrival?</h4>
                                <FormGroup>
                                    {yesNo.map((each, index) => (
                                        <Field
                                            id={each}
                                            key={index}
                                            name="pay_remain_balance"
                                            fieldName="pay_remain_balance"
                                            component={this.renderFormControlRadioButton}
                                            label={each}
                                            checked={formData.values && formData.values.pay_remain_balance == each}
                                        />
                                    ))}
                                </FormGroup>
                            </Col>
                            <Col xs={12} onMouseEnter={() => {this.onFocus('RetreatBeforeDays')}} onMouseLeave={() => this.onBlur()}>
                                <h4>Within how many days before the retreat starts do guests need to pay the remaining balance of the retreat?</h4>
                                <p>Note that the remaining balance will not be collected by Vegvisits.com. All the guest contact information will be provided for your convenience to collect the remaining balance.</p>

                                <FormGroup>
                                    <Field type="text"
                                           name="retreat_before_days"
                                           component={this.renderFormInput}
                                           className={cx(s.formControlInput)}
                                    />
                                </FormGroup>
                            </Col>
                        </div>
                    ) }

                    <Col xs={12} onMouseEnter={() => {this.onFocus('AllowFlexibility')}} onMouseLeave={() => this.onBlur()}>
                        <h4>Allow flexibility for your guests</h4>
                        <FormGroup>
                            <Grid>
                                {flexibilities.map((each, index) => (
                                    <Row className="show-grid">
                                        <Field
                                            id={each.id}
                                            key={index}
                                            name="allow_flexibility"
                                            fieldName="allow_flexibility"
                                            component={this.renderFormControlRadioButton}
                                            label={each.label}
                                            checked={formData.values && formData.values.allow_flexibility == each.id}
                                        />
                                    </Row>
                                ))}
                            </Grid>
                        </FormGroup>
                    </Col>

                    <Col xs={12} onMouseEnter={() => {this.onFocus('IncreaseBookings')}} onMouseLeave={() => this.onBlur()}>
                        <h4>Would you like to increase bookings by 50%?</h4>
                        <FormGroup>
                            <Grid>
                                {increaseBookingOptions.map((each, index) => (
                                    <Row className="show-grid">
                                        <Field
                                            id={each.id}
                                            key={index}
                                            name="use_increase_booking"
                                            fieldName="use_increase_booking"
                                            component={this.renderFormControlRadioButton}
                                            label={each.label}
                                            checked={formData.values && formData.values.use_increase_booking == each.id}
                                        />
                                    </Row>
                                ))}
                            </Grid>
                        </FormGroup>
                    </Col>

                    { useIncreaseBooking && (
                        <Col xs={12}>
                            <p>We’ve found that retreats that offer free a free service as a gift get a lot more bookings than those who do not. A few examples of free gifts could be packed vegan lunch for guests to take with them on departure day, An additional night of accommodation, Airport pick-up and drop-off, 60-minute massage, or 60-minute private lesson. Your gift must be a service and not an actual product.</p>
                            <h4>Give a free gift and increase bookings</h4>
                            <FormGroup>
                                <Field type="text"
                                       name="free_gift_name"
                                       component={this.renderFormInput}
                                       className={cx(s.formControlInput)}
                                />
                            </FormGroup>
                        </Col>
                    ) }

                    { useIncreaseBooking && (
                        <Col xs={12}>
                            <h4>About this gift</h4>
                            <FormGroup>
                                <Field
                                    name="free_gift_desc"
                                    component={this.renderFormControlTextArea}
                                    className={s.newInput}
                                />
                            </FormGroup>
                        </Col>
                    ) }
                </Row>
            </Grid>
        )
    }
}

CancellationPolicy = reduxForm({
    form: 'RetreatForm', // a unique name for this form
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
    validate,
    onSubmit: submit
})(CancellationPolicy);

const mapState = (state) => ({
    listingFields: state.listingFields.data,
    formData: state.form.RetreatForm,
});

const mapDispatch = {
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(CancellationPolicy)));
