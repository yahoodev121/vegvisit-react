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

class RetreatIncluded extends Component {
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

    renderFormControlCheckbox = ({ input: { value, onChange }, id, label, checked, desc, isMain, meta: { touched, error }, children, className }) => {
        const { formatMessage } = this.props.intl;
        return (
          <div>
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
              }} checked={checked}>
                  {isMain ? (<b>{label}</b>) : label}
              </Checkbox>
          </div>
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

        if (listingFields && listingFields.retreatIncluded && listingFields.retreatIncluded.length > 0) {
            let includes = listingFields.retreatIncluded;
            let names = includes.map(item=>item.itemName);
            names.sort();
            let results = [];
            for (let i = 0; i < names.length; i ++) {
                for (let j = 0; j < includes.length; j ++) {
                    if (names[i] === includes[j].itemName) {
                        results.push(includes[j]);
                        break;
                    }
                }
            }
            if (formData.values && formData.values.includes) {
                for (let i = 0; i < formData.values.includes.length; i ++) {
                    let id = formData.values.includes[i];
                    if (!includedIds.includes(id)) {
                        includedIds.push(id);
                    }
                }
            }
            results = results.map(item => {
                return {
                    ...item,
                    isMain: item.itemDescription === 'main',
                    checked: includedIds.indexOf(item.id) >= 0
                }
            })
            let includedTexts = [];
            for (let i = 0; i < includedIds.length; i ++) {
                let id = includedIds[i];
                let item = results.filter(item => item.id == id);
                includedTexts.push(item[0].otherItemName);
            }
            return { includes: results, includedTexts, includedIds };
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
        await dispatch(change('RetreatForm', 'tipForm', 'RetreatIncluded'));
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
                            <h3 className={s.landingContentTitle}><FormattedMessage {...messages.retreatIncluded} /></h3>
                            <form onSubmit={handleSubmit}>
                                <FormGroup>
                                    <Grid fluid>
                                        <Row className="show-grid">
                                            <Col xs={12} md={3}>
                                                {
                                                    includes.filter((item, index) => {
                                                        if (index < Math.round(includes.length / 4)) {
                                                            return true;
                                                        } else {
                                                            return false;
                                                        }
                                                    }).map((each, index) => (
                                                      <Field id={each.id} key={index} name="includes" component={this.renderFormControlCheckbox} label={each.itemName} checked={each.checked} desc={each.otherItemName} isMain={each.isMain} />
                                                    ))
                                                }
                                            </Col>
                                            <Col xs={12} md={3}>
                                                {
                                                    includes.filter((item, index) => {
                                                        if (Math.round(includes.length / 4) <= index && index < Math.round(includes.length / 4) * 2) {
                                                            return true;
                                                        } else {
                                                            return false;
                                                        }
                                                    }).map((each, index) => (
                                                      <Field id={each.id} key={index} name="includes" component={this.renderFormControlCheckbox} label={each.itemName} checked={each.checked} desc={each.otherItemName} isMain={each.isMain} />
                                                    ))
                                                }
                                            </Col>
                                            <Col xs={12} md={3}>
                                                {
                                                    includes.filter((item, index) => {
                                                        if (Math.round(includes.length / 4) * 2 <= index && index < Math.round(includes.length / 4) * 3) {
                                                            return true;
                                                        } else {
                                                            return false;
                                                        }
                                                    }).map((each, index) => (
                                                      <Field id={each.id} key={index} name="includes" component={this.renderFormControlCheckbox} label={each.itemName} checked={each.checked} desc={each.otherItemName} isMain={each.isMain} />
                                                    ))
                                                }
                                            </Col>
                                            <Col xs={12} md={3}>
                                                {
                                                    includes.filter((item, index) => {
                                                        if (Math.round(includes.length / 4) * 3 <= index) {
                                                            return true;
                                                        } else {
                                                            return false;
                                                        }
                                                    }).map((each, index) => (
                                                      <Field id={each.id} key={index} name="includes" component={this.renderFormControlCheckbox} label={each.itemName} checked={each.checked} desc={each.otherItemName} isMain={each.isMain} />
                                                    ))
                                                }
                                            </Col>
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
                                    name="custom_included[]"
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

RetreatIncluded = reduxForm({
    form: 'RetreatForm', // a unique name for this form
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
    validate,
    onSubmit: submit
})(RetreatIncluded);

const mapState = (state) => ({
    listingFields: state.listingFields.data,
    formData: state.form.RetreatForm,
});

const mapDispatch = {
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(RetreatIncluded)));
