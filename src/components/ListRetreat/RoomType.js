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
    FormControl
} from 'react-bootstrap';
import s from './ListRetreat.css';

import submit from './submit';

class RoomType extends Component {

    static propTypes = {
        initialValues: PropTypes.object,
    };

    constructor(props) {
        super(props);

        const { listingFields, valid } = props;
        if (listingFields != undefined) {
            this.state = {
                isDisabled: !valid,
                retreatRoomType: listingFields.retreatRoomType,
            };
        } else {
            this.state = {
                isDisabled: !valid,
                retreatRoomType: [],
            }
        }
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
        const { valid, listingFields } = props;

        if (listingFields != undefined &&
            (!_.isEqual(listingFields.retreatRoomType, state.retreatRoomType))
        ) {
            return {
                isDisabled: !valid,
                retreatRoomType: listingFields.retreatRoomType,
            };
        } else {
            return null;
        }
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

    render() {
        const { error, handleSubmit, existingList } = this.props;
        const { retreatRoomType } = this.state;

        return (
            <Grid fluid>
                <Row className={cx(s.landingContainer)}>
                    <Col xs={12} >
                        <div>
                            <p>{JSON.stringify(error)}</p>
                            <h3 className={s.landingContentTitle}><FormattedMessage {...messages.whatKindOfPlaceListing} /></h3>
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <FormGroup className={s.formGroup}>
                                        <ControlLabel className={s.landingLabel}>
                                            <FormattedMessage {...messages.roomType} />
                                        </ControlLabel>
                                        <Field name="roomType" component={this.renderFormControlSelect} className={cx(s.formControlSelect, s.jumboSelect)} >
                                            {
                                                retreatRoomType.map((value, key) => {
                                                    return (
                                                        value.isEnable == 1 && <option value={value.id} key={key}>{value.itemName}</option>
                                                    )
                                                })
                                            }
                                        </Field>
                                    </FormGroup>
                                </div>
                            </form>
                        </div>
                    </Col>
                </Row>
            </Grid>
        )
    }
}

RoomType = reduxForm({
    form: 'RetreatForm', // a unique name for this form
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
    validate,
    onSubmit: submit
})(RoomType);

const mapState = (state) => ({
    existingList: state.location.isExistingList,
    listingFields: state.listingFields.data
});

const mapDispatch = {
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(RoomType)));
