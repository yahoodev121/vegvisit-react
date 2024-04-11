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
    Grid,
    Button,
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

class LocalInformation extends Component {
    constructor(props) {
        super(props);

        let features = [
            'A/C in Rooms',
            'Heating',
            'Sauna',
            'Free Parking',
            'Hot Tub',
            'Housekeeping',
            'Free Wifi',
            'Pool',
            'Kitchen',
            'Coffee/Tea',
            'Fitness Center',
            'Bicycles For Rent',
            'Spa',
            'Towels',
            'Meditation/Yoga Space',
            'Garden',
            'Filtered Water',
            'Desk/workspace',
            'TV',
            'Wheelchair Accessible',
            'Mountain Views',
            'Waterfront',
            'Downtown',
            'Walking/Hiking Trails',
            'Lake Access',
            'Beach Access',
            'Security Guard',
            'Laundry',
            'Library',
            'Art Room',
            'Smoke-Free Property',
            'Eco-Friendly',
            'Lounge',
            'Bar',
            'Restaurant',
            'Wheelchair Accessible'
        ];

        this.state = {
            localInformation: [],
            facilityFeatures: features.sort(),
            isFixed: true
        };

        if (typeof window !== 'undefined') {
            this.ReactQuill = require('react-quill');
        }
        this.quillRef = React.createRef();
    }

    handleScroll = () => {
        if (window.scrollY > 13000) {
            this.setState({ isFixed: false });
        } else {
            this.setState({ isFixed: true });
        }
    };

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    renderFormControlCheckbox = ({ input: { value, onChange }, id, label, checked, meta: { touched, error }, children, className }) => {
        const { formatMessage } = this.props.intl;
        return (
            <Checkbox id={id} inline onChange={e => {
                let newValue;
                if (!value) newValue = [id];
                else newValue = ([...value, id].filter((value, index, self) => {
                    return self.indexOf(value) === index;
                }))
                if (!e.target.checked) newValue = newValue.filter(each => each !== id)
                onChange(newValue)
            }} className={s.retreatCheckbox} checked={checked}>{label}</Checkbox>
        )
    }

    static getDerivedStateFromProps(props, state) {
        const { listingFields, area } = props;

        if (area && area.length > 0) {
            return { localInformation: area };
        } else {
            return null;
        }
    }

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
        const { handleSubmit, area, formData } = this.props;
        const { localInformation, facilityFeatures, isFixed } = this.state;

        return (
            <Grid fluid>
                <Row className={s.landingContainer}>
                    <Col xs={12}>
                        <div>
                            <h3 className={s.landingContentTitle}><FormattedMessage {...messages.localInformation} /></h3>

                            <h4>
                                Write about your retreat location and what makes it so special. What things can be done in the area? Why would attendees enjoy experiencing your special piece of the world?
                            </h4>

                            <FormGroup>
                                <Field
                                    name="localInfoDesc"
                                    component={this.renderFormControlTextArea}
                                    className={s.newInput}
                                />
                            </FormGroup>
                        </div>
                    </Col>
                    <Col xs={12}>
                        <h4>Nature Landscape</h4>
                        <FormGroup>
                            {
                                localInformation.map((each, index) => (
                                    <Field id={each.id} key={index} name="localInformation" component={this.renderFormControlCheckbox} label={each.name} checked={formData.values && formData.values.localInformation && formData.localInformation.includes(each.id)}/>
                                ))
                            }
                        </FormGroup>
                    </Col>
                    <Col xs={12}>
                        <h3>Facility Features</h3>
                        <FormGroup>
                            {
                                facilityFeatures.map((each, index) => (
                                    <Field id={each} key={index} name="facilityFeatures" component={this.renderFormControlCheckbox} label={each} checked={formData.values && formData.values.facilityFeatures && formData.values.facilityFeatures.includes(each.id)}/>
                                ))
                            }
                        </FormGroup>
                    </Col>
                    <Col xs={12} onMouseEnter={() => {this.onFocus('SeasonalWeather')}} onMouseLeave={() => this.onBlur()}>
                        <h3>Seasonal Weather information</h3>
                        <p>Any information about the weather that guests should know so they can come prepared and well packed.</p>
                        <FormGroup>
                            <Field
                                name="seasonalInformation"
                                component={this.renderFormControlTextArea}
                                className={s.newInput}
                            />
                        </FormGroup>
                    </Col>
                    <Col xs={12} onMouseEnter={() => {this.onFocus('TravelHelp')}} onMouseLeave={() => this.onBlur()}>
                        <h3>How to get there</h3>
                        <p>Closest airport, airport transfers, buses, trains.</p>
                        <FormGroup>
                            <Field
                                name="travelHelp"
                                component={this.renderFormControlTextArea}
                                className={s.newInput}
                            />
                        </FormGroup>
                    </Col>
                    <Col xs={12} className={isFixed ? s.fixedSubmit : s.staticSubmit}>
                        <form onSubmit={handleSubmit}>
                            <FormGroup className={s.formGroup}>
                                <Col xs={12} sm={12} md={12} lg={12} className={s.noPadding}>
                                    <Button className={cx(s.button, s.btnPrimary, s.btnlarge, s.pullRight)} type='submit'>
                                        <FormattedMessage {...messages.submit} />
                                    </Button>
                                </Col>
                            </FormGroup>
                        </form>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

LocalInformation = reduxForm({
    form: 'RetreatForm', // a unique name for this form
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
    validate,
    onSubmit: submit
})(LocalInformation);

const mapState = (state) => ({
    listingFields: state.listingFields.data,
    area: state.area.areas,
    formData: state.form.RetreatForm,
});

const mapDispatch = {
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(LocalInformation)));
