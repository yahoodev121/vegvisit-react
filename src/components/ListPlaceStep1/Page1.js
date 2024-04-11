// General
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

// Redux Form
import { Field, reduxForm } from 'redux-form';

// Redux
import { connect } from 'react-redux';

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
  FormControl } from 'react-bootstrap';
import s from './ListPlaceStep1.css';

import update from './update';

// Component
import ListPlaceTips from '../ListPlaceTips';

const experienceCategories = [
  {id: 0, name: ''},
  {id: 1, name: 'Bed & Breakfast (B&B)'},
  {id: 2, name: 'City stays',},
  {id: 3, name: 'Nature stays',},
  {id: 4, name: 'Animal Sanctuaries',},
  {id: 5, name: 'Boutique Hotels and Hostels',},
  {id: 6, name: 'Outdoor Stays',},
  {id: 7, name: 'Wellness & Healing',},
  {id: 8, name: 'Adventurous Activities',},
  {id: 9, name: 'Culinary Experiences',},
  {id: 10, name: 'Local Immersion',},
  {id: 11, name: 'Skill Learning',},
]

class Page1 extends Component {

  static propTypes = {
    initialValues: PropTypes.object,
    nextPage: PropTypes.any,
    userData : PropTypes.shape({
      firstName : PropTypes.string.isRequired
    }).isRequired
  };

  static defaultProps = {
    userData: {
      firstName: ''
    }
  };

  constructor (props) {
    super(props);

    const { listingFields } = props;
    if(listingFields != undefined) {
      this.state = {
        roomType: listingFields.roomType,
        personCapacity: listingFields.personCapacity,
        experienceCategories: experienceCategories,
        showExperience: false,
      };
    } else {
      this.state = {
        roomType: [],
        personCapacity: [],
        experienceCategories: experienceCategories,
        showExperience: false
      }
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { listingFields, formData } = props;
    let ss = {};
    if (formData.values.stayType == '1') {
      ss = {
        showExperience: true,
      }
    } else {
      ss = {
        showExperience: false,
      }
    }
    if(listingFields != undefined && (!_.isEqual(listingFields.roomType, state.roomType) || !_.isEqual(listingFields.personCapacity, state.personCapacity))) {
      return {
        ...ss,
        roomType: listingFields.roomType,
        personCapacity: listingFields.personCapacity
      };
    } else {
      return {
        ...ss
      };
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
    const {formatMessage} = this.props.intl;
    return (
      <div>
        <FormControl componentClass="select" {...input} className={className} >
          {children}
        </FormControl>
      </div>
    )}

  render() {
    const { error, handleSubmit, submitting, dispatch, nextPage } = this.props;
    const { userData } = this.props;
    const { roomType, personCapacity, experienceCategories, showExperience } = this.state;
    return (
      <Grid>
        <Row>
          <Col xs={12} sm={7} md={7} lg={7} className={s.landingContentWithTip}>
            <Col xs={12} smOffset={1} sm={8} mdOffset={1} md={10} lgOffset={1} lg={8}>
              <h2 className={s.landingTitle}><FormattedMessage {...messages.heyBecome} /> {userData.firstName}! <FormattedMessage {...messages.letYouGetReady} />.</h2>
              <strong className={s.landingStep}><span>STEP 1</span></strong>
              <h3 className={s.landingContentTitle}> <FormattedMessage {...messages.whatKindOfPlace} /> </h3>

              <form onSubmit={handleSubmit}>
                <FormGroup className={s.formGroup}>
                  <Row>
                    <Col componentClass={ControlLabel} xs={12} sm={12} md={6} lg={6} >
                      <Field name="roomType" component={this.renderFormControlSelect} className={cx(s.backgroundPosition,s.formControlSelect, s.jumboSelect, s.noFontWeight)}>
                        { 
                          roomType.map((value, key) => { 
                            return ( value.isEnable==1 && <option value={value.id} key={key}>{value.itemName}</option>) 
                          }) 
                        }
                      </Field>
                    </Col>
                    
                    <Col componentClass={ControlLabel} xs={12} sm={12} md={6} lg={6} >
                      <Field name="personCapacity" component={this.renderFormControlSelect} className={cx(s.backgroundPosition, s.formControlSelect, s.jumboSelect, s.noFontWeight)} >
                        {
                          personCapacity.map((value, key) =>{
                            let rows = [];
                            for (let i= value.startValue; i <= value.endValue; i++) {
                              rows.push(<option value={i}>for {i} {i>1 ? value.otherItemName : value.itemName}</option>);
                            }
                            return rows;
                          })
                        }
                      </Field>
                    </Col>
                  </Row>
                </FormGroup>

                <FormGroup className={s.formGroup}>
                  <FormGroup className={s.formGroup}>
                    <label className={s.landingCaption}>
                      Will you be providing an experience with your place?
                    </label>
                  </FormGroup>
                  <div>
                    <label className={cx(s.blockRadioButton, s.landingLabel)}>
                      Yes <Field name="stayType" component="input" type="radio" value="1" className={s.pullRight} />
                    </label>
                    <label className={cx(s.blockRadioButton, s.landingLabel)}>
                      No <Field name="stayType" component="input" type="radio" value="0" className={s.pullRight} />
                    </label>
                  </div>
                </FormGroup>

                {
                  showExperience && (
                    <FormGroup className={s.formGroup}>
                      <FormGroup className={s.formGroup}>
                        <label className={s.landingCaption}>
                          Experience Category
                        </label>
                      </FormGroup>
                      <Row>
                        <Col componentClass={ControlLabel} xs={12} sm={12} md={12} lg={12}>
                          <Field name="experienceCategory" component={this.renderFormControlSelect}
                                 className={cx(s.backgroundPosition, s.formControlSelect, s.jumboSelect, s.noFontWeight)}>
                            {
                              experienceCategories.map((value, key) => {
                                return <option value={value.id}
                                               key={key}>{value.name}</option>
                              })
                            }
                          </Field>
                        </Col>
                      </Row>
                    </FormGroup>
                  )
                }

                <FormGroup className={s.formGroup}>
                  <Button className={cx(s.button, s.btnPrimary, s.btnlarge)}  onClick={() => nextPage('room')}>
                    <FormattedMessage {...messages.continue} />
                  </Button>
                </FormGroup>
              </form>
            </Col>
          </Col>
          <ListPlaceTips page={"index"}/>
        </Row>
      </Grid>
    )
  }
}

Page1 = reduxForm({
  form: 'ListPlaceStep1', // a unique name for this form
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  onSubmit: update
})(Page1);

const mapState = (state) => ({
  userData: state.account.data,
  listingFields: state.listingFields.data,
  formData: state.form.ListPlaceStep1,
});

const mapDispatch = {
};

export default injectIntl(withStyles(s) (connect(mapState, mapDispatch)(Page1)));
