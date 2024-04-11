// General
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

//Redux Form
import { Field, reduxForm, formValueSelector } from 'redux-form';

// Redux
import { connect } from 'react-redux';

// Translation
import { injectIntl, FormattedMessage } from 'react-intl';

// Locale
import messages from '../../locale/messages';

// Helpers
import validate from './validate';

// Internal Component
import IncrementButton from '../IncrementButton';

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

class Page4 extends Component {

  static propTypes = {
    initialValues: PropTypes.object,
    previousPage: PropTypes.any,
    nextPage: PropTypes.any,
    bathrooms: PropTypes.number,
    isExistingList: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    const { listingFields, valid } = props;
    if( listingFields != undefined) {
      this.state = {
        isDisabled: !valid,
        bathrooms: listingFields.bathrooms[0],
        bathroomType: listingFields.bathroomType,
      };
    } else {
      this.state = {
        isDisabled: !valid,
        bathrooms: {
          itemName: null,
          otherItemName: null,
          startValue: 0,
          endValue: 0
        },
        bathroomType: []
      };
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
    const { listingFields, valid } = props;

    if(listingFields != undefined &&
        (!_.isEqual(listingFields.bathrooms[0], state.bathrooms)
          || !_.isEqual(listingFields.bathroomType, state.bathroomType)
        )
      ){
      return {
        isDisabled: !valid,
        bathrooms: listingFields.bathrooms[0],
        bathroomType: listingFields.bathroomType,
      };
    } else if (!valid !== state.isDisabled) {
      return {
        isDisabled: !valid
      }
    } else {
      return null;
    }
  }

  renderIncrementButton = (field) => (
    <IncrementButton
      {...field}
      />
  );

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
    const { handleSubmit, submitting, pristine, previousPage, nextPage } = this.props;
    const { isExistingList } = this.props;
    const { isDisabled, bathrooms, bathroomType } = this.state;
    // let path = isExistingList ? "map" : "location";
    let path = 'location';

    return (
      <Grid fluid>
        <Row className={cx (s.landingContainer,'arrowPosition')}>
          <Col xs={12} sm={7} md={7} lg={7} className={s.landingContent}>
            <div>
              <h3 className={s.landingContentTitle}>
                <FormattedMessage {...messages.howManyBathrooms} />
              </h3>
              <form onSubmit={handleSubmit}>
                <div className={s.landingMainContent}>
                  <FormGroup className={s.formGroup}>
                    <Field
                        name="bathrooms"
                        type="text"
                        component={this.renderIncrementButton}
                        labelSingluar={bathrooms.itemName}
                        labelPlural={bathrooms.otherItemName}
                        maxValue={bathrooms.endValue}
                        minValue={bathrooms.startValue}
                        incrementBy={0.5}
                      />
                  </FormGroup>

                  <FormGroup className={s.formGroup}>
                    <Field name="bathroomType" component={this.renderFormControlSelect} className={cx(s.formControlSelect,s.paddingRight, s.jumboSelect)} >
                      {
                        bathroomType.map((value, key) =>{
                          return (
                            value.isEnable==1 && <option value={value.id} key={key}>{value.itemName}</option>
                          )
                        })
                      }
                    </Field>
                  </FormGroup>
                </div>
                <div className={s.nextPosition}>
                <div className={s.nextBackButton}>

                <hr className={s.horizontalLineThrough} />

                <FormGroup className={s.formGroup}>
                  <Col xs={12} sm={12} md={12} lg={12} className={s.noPadding}>
                    <Button className={cx(s.button, s.btnPrimaryBorder, s.btnlarge, s.pullLeft)} onClick={() => previousPage("bedrooms")}>
                      <FormattedMessage {...messages.back} />
                    </Button>
                    <Button className={cx(s.button, s.btnPrimary, s.btnlarge, s.pullRight)} disabled={isDisabled} onClick={() => nextPage(path)}>
                      <FormattedMessage {...messages.next} />
                    </Button>
                  </Col>
                </FormGroup>
                </div>
              </div>
              </form>
              
            </div>
          </Col>
          {/* <ListPlaceTips /> */}
        </Row>
      </Grid>
    )
  }
}

Page4 = reduxForm({
  form: 'ListPlaceStep1', // a unique name for this form
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
  onSubmit: update
})(Page4);

const mapState = (state) => ({
  isExistingList: state.location.isExistingList,
  listingFields: state.listingFields.data
});

const mapDispatch = {
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(Page4)));
