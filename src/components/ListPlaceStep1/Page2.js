// General
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

// Redux Form
import { Field, reduxForm, formValueSelector } from 'redux-form';

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
  FormControl } from 'react-bootstrap';
import s from './ListPlaceStep1.css';

// Component
import ListPlaceTips from '../ListPlaceTips';

import update from './update';

class Page2 extends Component {

  static propTypes = {
    initialValues: PropTypes.object,
    previousPage: PropTypes.any,
    nextPage: PropTypes.any,
  };

  constructor(props) {
    super(props);

    const { listingFields, valid } = props;
    if(listingFields != undefined) {
      this.state = {
        isDisabled: !valid,
        houseType: listingFields.houseType,
        roomType: listingFields.roomType,
        buildingSize: listingFields.buildingSize,
        residenceType: listingFields.residenceType,
      };
    } else {
      this.state = {
        isDisabled: !valid,
        houseType: [],
        roomType: [],
        buildingSize: [],
        residenceType: []
      }
    }
  }

  componentDidMount(){
    const { valid } = this.props;
    
    if(valid){
      this.setState({ isDisabled: false });
    } else {
      this.setState({ isDisabled: true });
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { valid, listingFields } = props;

    if (listingFields != undefined && 
        (!_.isEqual(listingFields.houseType, state.houseType)
          || !_.isEqual(listingFields.roomType, state.roomType)
          || !_.isEqual(listingFields.buildingSize, state.buildingSize)
          || !_.isEqual(listingFields.residenceType, state.residenceType)
        )
      ) {
      return {
        isDisabled: !valid,
        houseType: listingFields.houseType,
        roomType: listingFields.roomType,
        buildingSize: listingFields.buildingSize,
        residenceType: listingFields.residenceType
      };
    } else if (!valid !== state.isDisabled) {
      return {
        isDisabled: !valid
      }
    } else {
      return null;
    }
  }

  renderSelectField = ({ input, label, meta: { touched, error }, children}) => {
    const {formatMessage} = this.props.intl;

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
    const { handleSubmit, submitting, pristine, valid, previousPage, nextPage, existingList } = this.props;
    const { isDisabled, houseType, roomType, residenceType, buildingSize } = this.state;
    let path = "index";
    if(existingList) {
      path ="home";
    }

    return (
    <div>
    
      <Grid fluid>
        <Row className={cx (s.landingContainer, 'arrowPosition')}>
          <Col xs={12} sm={7} md={7} lg={7} className={s.landingContent}>
            <div>
              <h3 className={s.landingContentTitle}><FormattedMessage {...messages.whatKindOfPlaceListing} /></h3>
              <form onSubmit={handleSubmit}>
                <div className={s.landingMainContent}>
                  <FormGroup className={s.formGroup}>
                    <ControlLabel className={s.landingLabel}>
                      <FormattedMessage {...messages.whatTypeOfProperty} />
                    </ControlLabel>
                    <Field name="houseType" component={this.renderFormControlSelect} className={cx(s.formControlSelect, s.jumboSelect)} >                      
                      {
                        houseType.map((value, key) =>{
                          return (
                            value.isEnable==1 && <option value={value.id} key={key}>{value.itemName}</option>
                          )
                        })
                      }
                    </Field>
                  </FormGroup>

                  <FormGroup className={s.formGroup}>
                    <ControlLabel className={s.landingLabel}>
                      <FormattedMessage {...messages.whatGuestHave} />
                    </ControlLabel>
                    <Field name="roomType" component={this.renderFormControlSelect} className={cx(s.formControlSelect, s.jumboSelect)} >
                      {
                        roomType.map((value, key) =>{
                          return (
                            value.isEnable==1 && <option value={value.id} key={key}>{value.itemName}</option>
                          )
                        })
                      }
                    </Field>
                  </FormGroup>

                  {/* <FormGroup className={s.formGroup}>
                    <ControlLabel className={s.landingLabel}>
                      <FormattedMessage {...messages.howManyRooms} />
                    </ControlLabel>
                    <Field name="buildingSize" component={this.renderFormControlSelect} className={cx(s.formControlSelect, s.jumboSelect)} >
                      {
                        buildingSize.map((value, key) =>{
                          return (
                            value.isEnable==1 && <option value={value.id} key={key}>{value.itemName}</option>
                          )
                        })
                      }
                    </Field>
                  </FormGroup> */}

                  <FormGroup className={s.formGroup}>
                    {/* <ControlLabel className={s.landingLabel}>
                      <FormattedMessage {...messages.isPersonalHome} />
                    </ControlLabel> */}
                    <FormGroup className={s.formGroup}>
                      <label className={s.landingCaption}>
                        <FormattedMessage {...messages.isPersonalHomeInfo} />
                      </label>
                    </FormGroup>
                    <div>
                      <label className={cx(s.blockRadioButton, s.landingLabel)}>
                        Yes <Field name="residenceType" component="input" type="radio" value="1" className={s.pullRight} />
                      </label>
                      <label className={cx(s.blockRadioButton, s.landingLabel)}>
                        No <Field name="residenceType" component="input" type="radio" value="0" className={s.pullRight} />
                      </label>
                    </div>
                  </FormGroup>

                  <FormGroup className={s.formGroup}>
                    <label className={s.landingCaption}>
                      <FormattedMessage {...messages.isPersonalHomeInfoNew} />
                    </label>
                  </FormGroup> 
                </div>
                <div className={s.nextPosition}>
                <div className={s.nextBackButton}>
                <hr className={s.horizontalLineThrough} />

                <FormGroup className={s.formGroup}>
                  <Col xs={12} sm={12} md={12} lg={12} className={s.noPadding}>
                    <Button className={cx(s.button, s.btnPrimaryBorder, s.btnlarge, s.pullLeft)} onClick={() => previousPage(path)}>
                      <FormattedMessage {...messages.back} />
                    </Button>
                    <Button className={cx(s.button, s.btnPrimary, s.btnlarge, s.pullRight)} disabled={isDisabled} onClick={() => nextPage("bedrooms")}>
                      <FormattedMessage {...messages.next} />
                    </Button>
                  </Col>
                </FormGroup>
                </div>
                </div>
              </form>
            </div>
          </Col>
          <ListPlaceTips />
        </Row>
      </Grid>
      </div>
    )
  }
}

Page2 = reduxForm({
  form: 'ListPlaceStep1', // a unique name for this form
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
  onSubmit: update
})(Page2);

// Decorate with connect to read form values
const selector = formValueSelector('ListPlaceStep1'); // <-- same as form name

const mapState = (state) => ({
  existingList: state.location.isExistingList,
  listingFields: state.listingFields.data
});

const mapDispatch = {
};

export default injectIntl(withStyles(s) (connect(mapState, mapDispatch)(Page2)));
