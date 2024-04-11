// General
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
// Redux Form
import { Field, reduxForm, change, formValueSelector } from 'redux-form';
import { graphql, gql, compose } from 'react-apollo';

import submit from './submit';
import validate from './validate';

// Locale
import messages from '../../locale/messages';

// Redux
import { connect } from 'react-redux';

// Helper
import PopulateData from '../../helpers/populateData';

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './EditProfileForm.css';
import {
  Button,
  Form,
  Grid,
  Row, FormGroup,
  Col,
  ControlLabel,
  FormControl,
  FieldGroup,
  Panel,
  InputGroup
} from 'react-bootstrap';

// Internal Components
import PhoneVerificationModal from '../PhoneVerificationModal';
import CountryList from '../CountryList';
import CustomCheckbox from '../CustomCheckbox';

class EditProfileForm extends Component {

  static propTypes = {
    loadAccount: PropTypes.func,
    formatMessage: PropTypes.func,
  };

  constructor(props) {
    super(props);

    let now = new Date();
    let currentYear = now.getFullYear();
    let years = PopulateData.generateData(1920, currentYear, "desc");
    let days = PopulateData.generateData(1, 31);
    let months = PopulateData.generateData(0, 11);
    this.state = {
      dateOfBirthData: {
        years: years,
        months: months,
        days: days
      },
      countryCode: 'US',
      country: '+1',
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleCountryChange = this.handleCountryChange.bind(this);
  }

  componentDidMount() {
    const { change, initialValues } = this.props;
    let loggedinEmail;
    if (initialValues && initialValues.email) {
      loggedinEmail = initialValues.email;
    }
    change('loggedinEmail', loggedinEmail);

    if(initialValues && initialValues.countryName && initialValues.countryCode){
      this.setState({
        countryCode: initialValues.countryName,
        country: initialValues.countryCode
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { change, initialValues } = this.props;
    const { country, countryCode } = this.state;
    let loggedinEmail;
    if (initialValues && initialValues.email && (!prevProps.initialValues || prevProps.initialValues.email !== initialValues.email)) {
      loggedinEmail = initialValues.email;
      change('loggedinEmail', loggedinEmail);
    }
   
    if (countryCode && country && (prevState.countryCode !== countryCode || prevState.country !== country)) {
      change('countryCode', countryCode);
      change('dialCode', country);
    }
  }

  renderFormControlTextArea = ({ input, label, meta: { touched, error }, children, className }) => {
    const { formatMessage } = this.props.intl;

    return (
      <div>
        {touched && error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
        <FormControl
          {...input}
          className={className}
          componentClass="textarea"  rows={5}
        >
          {children}
        </FormControl>
      </div>
    )
  }

  renderFormControl = ({ input, label, type, meta: { touched, error }, className, isDisabled }) => {
    const { formatMessage } = this.props.intl;
    return (
      <div>
        {touched && error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
        <FormControl {...input} placeholder={label} type={type} className={className} disabled={isDisabled} />
      </div>
    )
  }

  renderFormControlEmail = ({ input, label, type, meta: { touched, error }, className, disabled }) => {
    const { formatMessage } = this.props.intl;
    return (
      <div>
        {touched && error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
        <FormControl {...input} placeholder={label} type={type} className={className} disabled={disabled} />
      </div>
    )
  }

  renderFormControlSelect = ({ input, label, meta: { touched, error }, children, className }) => {
    const { formatMessage } = this.props.intl;
    return (
      <div>
        {touched && error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
        <FormControl componentClass="select" {...input} className={className} >
          {children}
        </FormControl>
      </div>
    )
  }

  renderFormControlCurrency = ({ input, label, type, meta: { touched, error }, className, country }) => {
    const { formatMessage } = this.props.intl;
    return (
      <div className={s.margintop15}>
        {touched && error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
        <InputGroup>
          <InputGroup.Addon className={s.addonStyle}>
            {country}
          </InputGroup.Addon>
          <FormControl {...input} placeholder={label} type={type} className={className} />
        </InputGroup>
      </div>
    )
  }


  handleChange(event) {
    
    this.setState({ [event.target.name]: event.target.value });
  }

  handleCountryChange(e, selectedData) {

    this.setState({
      country: selectedData.dialCode,
      countryCode: selectedData.countryCode
    });
    
  }

  checkboxGroup = ({ label, name, options, input }) => (
    <ul className={s.listContainer}>
        { options && options.map((option, index) =>{ 
            if(option.isEnable) {
              return (
                <li className={cx(s.listContent)} key={index}>
                  <span className={s.checkBoxSection}>
                    <CustomCheckbox
                      name={`${input.name}[${index}]`}
                      className={'icheckbox_square-green'}
                      value={option.id}
                      checked={input.value.indexOf(option.id) !== -1}
                      onChange={event => {
                        const newValue = [...input.value];
                        if (event === true) {
                          newValue.push(option.id);
                        } else {
                          newValue.splice(newValue.indexOf(option.id), 1);
                        }
                        return input.onChange(newValue);
                      }}
                    />
                  </span>
                  <span className={cx(s.checkBoxSection, s.checkBoxLabel)}>
                    <label className={cx(s.checkboxLabel)}>{option.dietName}</label>
                  </span>
                </li>
              )
            }
          })
        }
    </ul>
  );

  render() {

    const { error, handleSubmit, submitting, dispatch, loadAccount, base, availableCurrencies, initialValues, diets } = this.props;
    const { formatMessage } = this.props.intl;
    const { siteSettingStatus } = this.props;
    const { dateOfBirthData } = this.state;
    const { country, countryCode } = this.state;
    
    let isPhoneStatus = siteSettingStatus && siteSettingStatus.phoneNumberStatus == 1 ? true : false;

    const title = <h3>{formatMessage(messages.Required)}</h3>;
    return (
      <div className={'inputFocusColor'}>
        {error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
        <Panel className={s.panelHeader} header={title}>
          <Form onSubmit={handleSubmit((values, dispatch, props) => submit(values, dispatch, props, initialValues))}>
            <Row className={s.formGroup}>
              <Col componentClass={ControlLabel} xs={12} sm={3} md={3} lg={3} className={s.textAlign}>
                <label className={s.labelText} >{formatMessage(messages.firstName)}</label>
              </Col>
              <Col componentClass={ControlLabel} xs={12} sm={9} md={9} lg={9}>
                <Field name="firstName"
                  type="text"
                  component={this.renderFormControl}
                  label={formatMessage(messages.firstName)}
                  className={cx(s.formControlInput, s.commonBorder)}
                />
              </Col>
            </Row>

            <Row className={s.formGroup}>
              <Col componentClass={ControlLabel} xs={12} sm={3} md={3} lg={3} className={s.textAlign}>
                <label className={s.labelText} >{formatMessage(messages.lastName)}</label>
              </Col>
              <Col componentClass={ControlLabel} xs={12} sm={9} md={9} lg={9}>
                <Field name="lastName"
                  type="text"
                  component={this.renderFormControl}
                  label={formatMessage(messages.lastName)}
                  className={cx(s.formControlInput, s.commonBorder)}
                />
                <p className={s.labelText}>{formatMessage(messages.lastNameInfo)}</p>
              </Col>
            </Row>

            <Row className={s.formGroup}>
              <Col componentClass={ControlLabel} xs={12} sm={3} md={3} lg={3} className={s.textAlign}>
                <label className={s.labelText} >{formatMessage(messages.iAmEditProfile)}</label>
              </Col>
              <Col componentClass={ControlLabel} xs={12} sm={9} md={9} lg={9}>
                <div className={s.select}>
                  <Field name="gender" className={cx(s.formControlSelect, s.commonBorder)} component={this.renderFormControlSelect} >
                    <option value="">{formatMessage(messages.gender)}</option>
                    <option value="Male">{formatMessage(messages.genderMale)}</option>
                    <option value="Female">{formatMessage(messages.genderFemale)}</option>
                    <option value="Other">{formatMessage(messages.genderOther)}</option>
                  </Field>
                </div>
                <p className={s.labelText}>{formatMessage(messages.genderInfo)}</p>
              </Col>
            </Row>

            <Row className={cx(s.formGroup)} >
              <Col xs={12} sm={3} md={3} lg={3} className={s.textAlign}>
                <label className={s.labelText} >{formatMessage(messages.dateOfBirth)}</label>
              </Col>

              <Col xs={12} sm={9} md={9} lg={9}>
                <div className={cx(s.select, s.birthDayWidth)}>
                  <Field name="month" className={cx(s.formControlSelect, s.commonBorder)} component={this.renderFormControlSelect} >
                    <option value="">{formatMessage(messages.month)}</option>
                    {
                      dateOfBirthData.months.map((item, key) => {
                        return (
                          <option key={key} value={item}>{item + 1}</option>
                        )
                      })
                    }
                  </Field>
                </div>

                <div className={cx(s.select, s.birthDayWidth)}>
                  <Field name="day" className={cx(s.formControlSelect, s.commonBorder)} component={this.renderFormControlSelect} >
                    <option value="">{formatMessage(messages.day)}</option>
                    {
                      dateOfBirthData.days.map((item, key) => {
                        return (
                          <option key={key} value={item}>{item}</option>
                        )
                      })
                    }
                  </Field>
                </div>

                <div className={cx(s.select, s.smSpace, s.birthDayWidth)}>
                  <Field name="year" className={cx(s.formControlSelect, s.commonBorder)} component={this.renderFormControlSelect} >
                    <option value="">{formatMessage(messages.year)}</option>
                    {
                      dateOfBirthData.years.map((item, key) => {
                        return (
                          <option key={key} value={item}>{item}</option>
                        )
                      })
                    }
                  </Field>
                </div>
                <p className={s.labelText}>{formatMessage(messages.birthdayDescription)}</p>
              </Col>

            </Row>

            <Row className={s.formGroup}>
              <Col componentClass={ControlLabel} xs={12} sm={3} md={3} lg={3} className={s.textAlign}>
                <label className={s.labelText} >{formatMessage(messages.email)}</label>
              </Col>
              <Col componentClass={ControlLabel} xs={12} sm={9} md={9} lg={9}>
                <Field name="email"
                  type="text"
                  component={this.renderFormControlEmail}
                  label={formatMessage(messages.email)}
                  className={cx(s.formControlInput, s.commonBorder)}
                  disabled={true}
                />
                  <p className={s.labelText}>{formatMessage(messages.emailDescription)}</p>
              </Col>
            
            </Row>

            <Row className={s.formGroup}>
              <Col componentClass={ControlLabel} xs={12} sm={3} md={3} lg={3} className={s.textAlign}>
                <label className={s.labelText} >{formatMessage(messages.phoneNumber)}</label>
              </Col>
              <Col xs={12} sm={9} md={9} lg={9}>
                {/* {
                  !isPhoneStatus && <Field 
                    name="phoneNumber"
                    type="text"
                    component={this.renderFormControl}
                    label={formatMessage(messages.phoneNumber)}
                    className={cx(s.formControlInput, s.commonBorder)}
                  />
                } */}
                {!isPhoneStatus && <div className={s.widthredcd}>
                  <CountryList
                    input={
                      {
                        name: 'countryCode',
                        onChange: this.handleChange,
                        value: countryCode,
                      }
                    }
                    className={cx(s.formControlSelect)}
                    dialCode={false}
                    getSelected={this.handleCountryChange}
                    formName={'EditProfileForm'}

                  />
                  <Field
                    name="phoneNumber"
                    type="text"
                    component={this.renderFormControlCurrency}
                    label={formatMessage(messages.phoneNumber)}
                    className={s.formControlInput}
                    onChange={this.handleChange}
                    country={country}
                  />
                </div>}
                {
                  isPhoneStatus && <PhoneVerificationModal />
                }
                <p className={s.labelText}>{formatMessage(messages.phoneNumberInfo)}</p>
              </Col>
            </Row>

            {/* <Row className={s.formGroup}>
              <Col componentClass={ControlLabel} xs={12} sm={3} md={3} lg={3} className={s.textAlign}>
                <label className={s.labelText} >{formatMessage(messages.preferredLanguage)}</label>
              </Col> */}
              {/* <Col componentClass={ControlLabel} xs={12} sm={9} md={9} lg={9}>
                <div>
                  <Field name="preferredLanguage" className={cx(s.formControlSelect, s.formControlSelectWidth, s.commonBorder)} component={this.renderFormControlSelect} > */}
                    {/* <option value="">Choose Language</option> */}
                    {/* <option value="id">Bahasa Indonesia</option>
                    <option value="ms">Bahasa Melayu</option>
                    <option value="ca">Català</option>
                    <option value="da">Dansk</option>
                    <option value="de">Deutsch</option> */}
                    {/* <option value="en">English</option> */}
                    {/* <option value="es">Español</option>
                    <option value="el">Eλληνικά</option>
                    <option value="fr">Français</option>
                    <option value="it">Italiano</option>
                    <option value="hu">Magyar</option>
                    <option value="nl">Nederlands</option>
                    <option value="no">Norsk</option>
                    <option value="pl">Polski</option>
                    <option value="pt">Português</option>
                    <option value="fi">Suomi</option>
                    <option value="sv">Svenska</option>
                    <option value="tr">Türkçe</option>
                    <option value="is">Íslenska</option>
                    <option value="cs">Čeština</option>
                    <option value="ru">Русский</option>
                    <option value="th">ภาษาไทย</option>
                    <option value="zh">中文 (简体)</option>
                    <option value="zh-TW">中文 (繁體)</option>
                    <option value="ja">日本語</option>
                    <option value="ko">한국어</option> */}
                  {/* </Field>
                  <p className={s.labelText}>{formatMessage(messages.preferredLanguageInfo)}</p>
                </div>
              </Col>
            </Row> */}

            <Row className={s.formGroup}>
              <Col componentClass={ControlLabel} xs={12} sm={3} md={3} lg={3} className={s.textAlign}>
                <label className={s.labelText} >{formatMessage(messages.preferredCurrency)}</label>
              </Col>
              <Col componentClass={ControlLabel} xs={12} sm={9} md={9} lg={9}>
                <div>

                  <Field name="preferredCurrency" className={cx(s.formControlSelect, s.formControlSelectWidth, s.commonBorder)} component={this.renderFormControlSelect} >
                    <option value="">{formatMessage(messages.chooseCurrency)}</option>
                    {
                      availableCurrencies.map((currency, key) => {
                        if (currency.isEnable === true) {
                          return <option key={key} value={currency.symbol}>{currency.symbol}</option>
                        }
                      })
                    }
                  </Field>
                  <p className={s.labelText}>{formatMessage(messages.preferredCurrencyInfo)}</p>
                </div>

              </Col>
            </Row>
            
            <Row className={s.formGroup}>
              <Col componentClass={ControlLabel} xs={12} sm={3} md={3} lg={3} className={s.textAlign}>
                <label className={s.labelText} >{formatMessage(messages.liveLocation)}</label>
              </Col>
              <Col componentClass={ControlLabel} xs={12} sm={9} md={9} lg={9}>
                <Field name="location"
                  type="text"
                  component={this.renderFormControl}
                  label="e.g. Paris, France / Brooklyn, New York / Adelaide, South Australia"
                  className={cx(s.formControlInput, s.commonBorder)}
                 />
              </Col>
            </Row>

            <Row className={s.formGroup}>
              <Col componentClass={ControlLabel} xs={12} sm={3} md={3} lg={3} className={s.textAlign}>
                <label className={s.labelText} >{formatMessage(messages.iAmEditProfile)}</label>
              </Col>
              <Col componentClass={ControlLabel} xs={12} sm={9} md={9} lg={9}>
                <div className={s.select}>
                  <Field name="foodCategory" className={cx(s.formControlSelect, s.commonBorder)} component={this.renderFormControlSelect} >
                    <option value="">{formatMessage(messages.chooseDiet)}</option>
                    <option value="Raw Vegan">{formatMessage(messages.rawvegan)}</option>
                    <option value="Vegan">{formatMessage(messages.vegan)}</option>
                    <option value="Vegetarian">{formatMessage(messages.vegetarian)}</option>
                    <option value="Veg-Curious">{formatMessage(messages.vegCurious)}</option>
                  </Field>
                </div>
                <p className={s.labelText}>{formatMessage(messages.iAmInfo)}</p>
              </Col>
            </Row>

            <Row className={s.formGroup}>
              <Col componentClass={ControlLabel} xs={12} sm={3} md={3} lg={3} className={s.textAlign}>
                <label className={s.labelText} >{formatMessage(messages.nicheDiet)}</label>
              </Col>
              <Col componentClass={ControlLabel} xs={12} sm={9} md={9} lg={9}>
                    <Field name="userDiets" component={this.checkboxGroup} options={diets} />
                <p className={s.checkBoxGroupText}>{formatMessage(messages.selectNicheDiet)}</p>
              </Col>
            </Row>

            <Row className={s.formGroup}>
              <Col componentClass={ControlLabel} xs={12} sm={3} md={3} lg={3} className={s.textAlign}>
                <label className={s.labelText} >{formatMessage(messages.info)}</label>
              </Col>
              <Col componentClass={ControlLabel} xs={12} sm={9} md={9} lg={9}>
                <Field name="info"
                  component={this.renderFormControlTextArea}
                  className={cx(s.formControlInput, s.commonBorder)}
                />
                  <p className={s.labelText}>{formatMessage(messages.belowDesc)}</p>
              </Col>
            </Row>


            {/* About me */}
            <h4 className={s.aboutSection}>{formatMessage(messages.aboutMe)}</h4>
            <Row className={s.formGroup}>
              <Col componentClass={ControlLabel} xs={12} sm={3} md={3} lg={3} className={s.textAlign}>
                <label className={s.labelText} >{formatMessage(messages.myLifestyle)}</label>
              </Col>
              <Col componentClass={ControlLabel} xs={12} sm={9} md={9} lg={9}>
                <Field name="lifestyle"
                  component={this.renderFormControlTextArea}
                  className={cx(s.formControlInput, s.commonBorder)}
                />
              </Col>
            </Row>

            <Row className={s.formGroup}>
              <Col componentClass={ControlLabel} xs={12} sm={3} md={3} lg={3} className={s.textAlign}>
                <label className={s.labelText} >{formatMessage(messages.funFacts)}</label>
              </Col>
              <Col componentClass={ControlLabel} xs={12} sm={9} md={9} lg={9}>
                <Field name="funFacts"
                  component={this.renderFormControlTextArea}
                  className={cx(s.formControlInput, s.commonBorder)}
                />
              </Col>
            </Row>

            <Row className={s.formGroup}>
              <Col componentClass={ControlLabel} xs={12} sm={3} md={3} lg={3} className={s.textAlign}>
                <label className={s.labelText} >{formatMessage(messages.hobbies)}</label>
              </Col>
              <Col componentClass={ControlLabel} xs={12} sm={9} md={9} lg={9}>
                <Field name="hobbies"
                  component={this.renderFormControlTextArea}
                  className={cx(s.formControlInput, s.commonBorder)}
                />
              </Col>
            </Row>

            <Row className={s.formGroup}>
              <Col componentClass={ControlLabel} xs={12} sm={3} md={3} lg={3} className={s.textAlign}>
                <label className={s.labelText} >{formatMessage(messages.favoriteBooks)}</label>
              </Col>
              <Col componentClass={ControlLabel} xs={12} sm={9} md={9} lg={9}>
                <Field name="books"
                  // type="text"
                  component={this.renderFormControlTextArea}
                  className={cx(s.formControlInput, s.commonBorder)}
                />
              </Col>
            </Row>

            <Row className={s.formGroup}>
              <Col componentClass={ControlLabel} xs={12} sm={3} md={3} lg={3} className={s.textAlign}>
                <label className={s.labelText} >{formatMessage(messages.spokenLanguages)}</label>
              </Col>
              <Col componentClass={ControlLabel} xs={12} sm={9} md={9} lg={9}>
                <Field name="spokenLanguages"
                  type="text"
                  component={this.renderFormControl}
                  className={cx(s.formControlInput, s.commonBorder)}
                />
              </Col>
            </Row>
            
            {/* <Row className={s.formGroup}>
              <Col componentClass={ControlLabel} xs={12} sm={3} md={3} lg={3} className={s.textAlign}>
                <label className={s.labelText} >{formatMessage(messages.favoriteMusic)}</label>
              </Col>
              <Col componentClass={ControlLabel} xs={12} sm={9} md={9} lg={9}>
                <Field name="music"
                  type="text"
                  component={this.renderFormControl}
                  className={cx(s.formControlInput, s.commonBorder)}
                />
              </Col>
            </Row>

            <Row className={s.formGroup}>
              <Col componentClass={ControlLabel} xs={12} sm={3} md={3} lg={3} className={s.textAlign}>
                <label className={s.labelText} >{formatMessage(messages.favoriteMovies)}</label>
              </Col>
              <Col componentClass={ControlLabel} xs={12} sm={9} md={9} lg={9}>
                <Field name="movies"
                  type="text"
                  component={this.renderFormControl}
                  className={cx(s.formControlInput, s.commonBorder)}
                />
              </Col>
            </Row> */}

            <Row className={s.formGroup}>
              <Col componentClass={ControlLabel} xs={12} sm={3} md={3} lg={3} className={s.textAlign}>
                <label className={s.labelText} >{formatMessage(messages.school)}</label>
              </Col>
              <Col componentClass={ControlLabel} xs={12} sm={9} md={9} lg={9}>
                <Field name="school"
                  type="text"
                  component={this.renderFormControl}
                  className={cx(s.formControlInput, s.commonBorder)}
                />
              </Col>
            </Row>

            <Row className={s.formGroup}>
              <Col componentClass={ControlLabel} xs={12} sm={3} md={3} lg={3} className={s.textAlign}>
                <label className={s.labelText} >{formatMessage(messages.work)}</label>
              </Col>
              <Col componentClass={ControlLabel} xs={12} sm={9} md={9} lg={9}>
                <Field name="work"
                  type="text"
                  component={this.renderFormControl}
                  className={cx(s.formControlInput, s.commonBorder)}
                />
              </Col>
            </Row>

            <Row className={s.formGroup}>
              <Col componentClass={ControlLabel} xs={12} sm={3} md={3} lg={3} className={s.textAlign}>
                <label className={s.labelText} >{formatMessage(messages.companionAnimals)}</label>
              </Col>
              <Col componentClass={ControlLabel} xs={12} sm={9} md={9} lg={9}>
                <Field name="companionAnimals"
                  type="text"
                  component={this.renderFormControl}
                  className={cx(s.formControlInput, s.commonBorder)}
                />
              </Col>
            </Row>

            <Row className={s.formGroup}>
              <Col componentClass={ControlLabel} xs={12} sm={3} md={3} lg={3} className={s.textAlign}>
                <label className={s.labelText} >{formatMessage(messages.favoriteQuote)}</label>
              </Col>
              <Col componentClass={ControlLabel} xs={12} sm={9} md={9} lg={9}>
                <Field name="quote"
                  type="text"
                  component={this.renderFormControl}
                  className={cx(s.formControlInput, s.commonBorder)}
                />
              </Col>
            </Row>

            <Row className={s.formGroup}>
              <Col xs={12} sm={12} md={12} lg={12} className={s.spaceTop3}>
                <Button bsSize="small" className={cx(s.button, s.btnPrimary, s.btnlarge)} type="submit" disabled={submitting}
                >
                  {formatMessage(messages.save)}
                </Button>
              </Col>
            </Row>
          </Form>
        </Panel>
      </div>
    )
  }

}
EditProfileForm = reduxForm({
  form: 'EditProfileForm', // a unique name for this form
  validate,
})(EditProfileForm);
const selector = formValueSelector('EditProfileForm');

const mapState = (state) => ({
  initialValues: state.account.data,
  availableCurrencies: state.currency.availableCurrencies,
  base: state.currency.base,
  siteSettingStatus: state.siteSettings.data,
  phoneNumber: selector(state, 'phoneNumber'),
  diets: state.diets.data
});
const mapDispatch = {
  change
};

export default compose(
  injectIntl,
  withStyles(s),
  connect(mapState, mapDispatch),
  graphql(gql`
      query getCountries {
          getCountries{
              id
              countryCode
              countryName
              isEnable
              dialCode
          }
      }
  `, {
      options: {
        ssr: false,
        fetchPolicy: 'network-only'
      }
    })
)(EditProfileForm);
// export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(EditProfileForm)));
