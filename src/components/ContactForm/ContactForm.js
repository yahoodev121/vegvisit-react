// General
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import Link from '../Link';
// Redux Form
import { Field, reduxForm, reset } from 'redux-form';

import validate from './validate';

// Locale
import messages from '../../locale/messages';

// Redux
import { connect } from 'react-redux';

import ReCAPTCHA from 'react-google-recaptcha';

import { sendEmail } from '../../core/email/sendEmail';

import { toastr } from 'react-redux-toastr';

import { googleCaptcha, adminEmail } from '../../config';

// Style
import * as FontAwesome from 'react-icons/lib/fa';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './ContactForm.css';
import {
    Button,
    Form,
    Grid,
    Row, FormGroup,
    Col,
    ControlLabel,
    FormControl,
} from 'react-bootstrap';

//Images
import mailLogo from './mailblack.png';
import caller from './callLogo.png';
import addressLogo from './address.png';

// Internal Components
import Loader from '../Loader';

class ContactForm extends Component {
    static propTypes = {
        formatMessage: PropTypes.any,
    };

    constructor(props) {
        super(props);
        this.state = {
            contactLoading: false
        };
        this.handleClick = this.handleClick.bind(this);
    }

    async handleClick(values, dispatch) {
        let content = {
            phoneNumber: values.phoneNumber,
            name: values.name,
            email: values.email,
            ContactMessage: values.ContactMessage,
            reCaptcha: values.reCaptcha
        };
        this.setState({
            contactLoading: true
        })
        const { status, response } = await sendEmail(adminEmail, 'contact', content);
        this.setState({
            contactLoading: false
        })
        if (status === 200) {
            toastr.success("Success!", "Your email has been sent.");
        } else {
            toastr.error("Error!", "Sorry, something went wrong. Please try again!");
        }
        dispatch(reset('ContactForm'));
        grecaptcha.reset();
    }

    renderFormControl = ({ input, label, type, meta: { touched, error }, className, isDisabled }) => {
        const { formatMessage } = this.props.intl;
        return (
            <div>
                <FormControl {...input} placeholder={label} type={type} className={className} disabled={isDisabled} />
                {touched && error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
            </div>
        )
    }

    renderFormControlTextArea = ({ input, label, meta: { touched, error }, children, className }) => {
        const { formatMessage } = this.props.intl;
        return (
            <div>
                <FormControl
                    {...input}
                    className={className}
                    componentClass="textarea"
                >
                    {children}
                </FormControl>
                {touched && error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
            </div>
        )
    }

    renderCaptcha = ({ input, label, type, meta: { touched, error }, className, isDisabled }) => {
        const { formatMessage } = this.props.intl;
        let siteKey = googleCaptcha.sitekey;
        return (
            <div>
                <ReCAPTCHA
                    sitekey={siteKey}
                    onChange={input.onChange}
                />
                {touched && error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
            </div>
        )
    }

    render() {
        const { error, handleSubmit, submitting, dispatch, pristine } = this.props;
        const { formatMessage } = this.props.intl;
        const { contactLoading } = this.state;
        const title = <h3>{formatMessage(messages.Required)}</h3>;

        return (
            <Grid fluid>
                <Row>
                    <Col lg={12} md={12} sm={12} xs={12} className={s.marginTop}>
                        <div>
                            <Col lg={12} md={12} sm={12} xs={12} className={s.space3}>
                                <div className={s.space6}>
                                    <h1 className={s.contactTitle}>
                                        <FormattedMessage {...messages.contactFormInformation} />
                                    </h1>
                                </div>
                            </Col>
                            <Col lg={4} md={4} sm={4} xs={12} className={s.alignCenter}>
                                <div className={s.space6}>
                                    <div>
                                        <div className={s.iconMargin}>
                                            <img src={mailLogo} className={s.mailIcon} />
                                        </div>
                                        <div>
                                            <h1 className={cx(s.contactTitle, s.subTitleText)}>
                                                <FormattedMessage {...messages.contactFormEmail} />
                                            </h1>
                                            <h4 className={s.addressText}>
                                                <a href={"mailto:team@vegvisits.com"} className={s.linkText} target='_blank'>team@vegvisits.com</a>
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            </Col>


                            <Col lg={4} md={4} sm={4} xs={12} className={s.alignCenter}>
                                <div className={s.space6}>
                                    <div>
                                        <div className={s.iconMargin}>
                                            <img src={addressLogo} className={s.mailIcon} />
                                        </div>
                                        <h1 className={cx(s.contactTitle, s.subTitleText)}>
                                            <FormattedMessage {...messages.contactFormAddress1} />
                                        </h1>
                                        <h1 className={cx(s.contactTitle, s.subTitleText)}>
                                            & <FormattedMessage {...messages.contactFormAddress2} />
                                        </h1>

                                    </div>
                                </div>
                            </Col>
                            <Col lg={4} md={4} sm={4} xs={12} className={s.alignCenter}>
                                <div className={s.space6}>
                                    <div>
                                        <div className={s.iconMargin}>
                                            <img src={caller} className={s.mailIcon} />
                                        </div>
                                        <div>
                                            <h1 className={cx(s.contactTitle, s.subTitleText)}><FormattedMessage {...messages.contactFormCall} /></h1>
                                            <h4 className={s.contactNumber}> <a href={"tel: (347) 709-6002"} className={s.linkText} target='_blank'>
                                                (347) 709-6002
                                            </a></h4>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </div>
                    </Col>

                    <Col lg={12} md={12} sm={12} xs={12} className={s.marginTop}>
                        <div className={s.contactText}><p className={s.contactParagraph}><FormattedMessage {...messages.contactText1} />
                            {' '}
                            <Link to={"/page/faq's"}>
                                <FormattedMessage {...messages.contactFaq} />
                            </Link>,
                            {' '}
                            <FormattedMessage {...messages.contactText2} />
                        </p>
                            <p className={s.contactTeam}>  <FormattedMessage {...messages.contactTeam} /> </p>
                        </div>
                    </Col>



                    <Col lg={12} md={12} sm={12} xs={12} className={cx(s.marginTop)}>
                        <div className={cx(s.formBackground, 'inputFocusColor')}>
                            <div className={s.formContainerHeader}>
                                <h2 className={s.captionText}><FormattedMessage {...messages.contactForm} /></h2>
                            </div>
                            <div className={s.formContainer}>
                                {error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
                                <form onSubmit={handleSubmit(this.handleClick)} >
                                    <Row className={s.formGroup}>
                                        <Col xs={12} sm={6} md={6} lg={6} className={s.noPadding}>
                                            <Col xs={12} sm={12} md={12} lg={12}>
                                                <label className={s.labelText} >{formatMessage(messages.Nameincontact)}</label>
                                            </Col>
                                            <Col xs={12} sm={12} md={12} lg={12}>
                                                <Field name="name"
                                                    type="text"
                                                    component={this.renderFormControl}
                                                    label={formatMessage(messages.Nameincontact)}
                                                    className={cx(s.formControlInput, s.backgroundTwo, s.commonBorder)}
                                                />
                                            </Col>
                                        </Col>
                                        <Col xs={12} sm={6} md={6} lg={6} className={s.noPadding}>
                                            <Col xs={12} sm={12} md={12} lg={12}>
                                                <label className={s.labelText} >{formatMessage(messages.phoneNumber)}</label>
                                            </Col>
                                            <Col xs={12} sm={12} md={12} lg={12}>
                                                <Field name="phoneNumber"
                                                    type="text"
                                                    component={this.renderFormControl}
                                                    label={formatMessage(messages.phoneNumber)}
                                                    className={cx(s.formControlInput, s.backgroundThree, s.commonBorder)}
                                                />
                                            </Col>
                                        </Col>
                                    </Row>
                                    <Row className={s.formGroup}>
                                        <Col xs={12} sm={12} md={12} lg={12}>
                                            <label className={s.labelText} >{formatMessage(messages.email)}</label>
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={12}>
                                            <Field name="email"
                                                type="text"
                                                component={this.renderFormControl}
                                                label={formatMessage(messages.email)}
                                                className={cx(s.formControlInput, s.backgroundOne, s.commonBorder)}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className={s.formGroup}>
                                        <Col xs={12} sm={12} md={12} lg={12}>
                                            <label className={s.labelText} >{formatMessage(messages.ContactMessage)}</label>
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={12}>
                                            <Field name="ContactMessage"
                                                type="text"
                                                component={this.renderFormControlTextArea}
                                                label={formatMessage(messages.ContactMessage)}
                                                className={cx(s.formControlInput, s.backgroundFour, s.commonBorder)}
                                            />
                                        </Col>
                                    </Row>

                                    <Row className={s.formGroup}>
                                        <Col xs={12} sm={12} md={12} lg={12}>
                                            <Field name="reCaptcha"
                                                component={this.renderCaptcha}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className={s.formGroup}>
                                        <Col xs={12} sm={12} md={12} lg={12} className={s.spaceTop3}>
                                            <Loader
                                                type={"button"}
                                                buttonType={"submit"}
                                                className={cx(s.button, s.btnPrimary, s.btnlarge, s.paddingRight)}
                                                disabled={submitting}
                                                show={contactLoading}
                                                label={formatMessage(messages.sendmail)}
                                            />
                                            <span className={s.paperPlane}><FontAwesome.FaPaperPlane /></span>
                                        </Col>
                                    </Row>
                                </form>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Grid>
        )
    }

}

ContactForm = reduxForm({
    form: 'ContactForm', // a unique name for this form
    validate
})(ContactForm);


const mapState = (state) => ({

});

const mapDispatch = {
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(ContactForm)));
