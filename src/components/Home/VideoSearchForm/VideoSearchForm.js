import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

// Redux
import {connect} from 'react-redux';

// Translation
import {FormattedMessage, injectIntl} from 'react-intl';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './VideoSearchForm.css';

import {Field, reduxForm} from 'redux-form';

import {
    Button,
    Form,
    Grid,
    Row, FormGroup,
    Col,
    ControlLabel,
    FormControl,
    MenuItem,
    Dropdown,
    FieldGroup,
    Panel,
} from 'react-bootstrap';

import {FaCheck} from "react-icons/lib/fa";
import cx from 'classnames';
import * as FontAwesome from 'react-icons/lib/fa';

// History
import history from '../../../core/history';


// Components
import DateRange from '../DateRange/DateRange';
import PlaceGeoSuggest from '../PlaceGeoSuggest/PlaceGeoSuggest';
import MobileDateRange from '../MobileDateRange/MobileDateRange';


// Redux Action
import {getSpecificSettings} from '../../../actions/getSpecificSettings';
import {setPersonalizedValues} from '../../../actions/personalized';

// Helper
import detectMobileBrowsers from '../../../helpers/detectMobileBrowsers';

// Locale
import messages from '../../../locale/messages';


class VideoSearchForm extends React.Component {
    static propTypes = {
        setPersonalizedValues: PropTypes.any.isRequired,
        getSpecificSettings: PropTypes.any.isRequired,
        personalized: PropTypes.shape({
            location: PropTypes.string,
            lat: PropTypes.number,
            lng: PropTypes.number,
            chosen: PropTypes.number,
            startDate: PropTypes.string,
            endDate: PropTypes.string,
            personCapacity: PropTypes.number,
            formatMessage: PropTypes.any,
        }),
        settingsData: PropTypes.shape({
            listSettings: PropTypes.array.isRequired
        }).isRequired
    };

    static defaultProps = {
        listingFields: []
    };


    static defaultProps = {
        personalized: {
            location: null,
            lat: null,
            lng: null,
            startDate: null,
            endDate: null,
            personCapacity: null,
            chosen: null
        },
        settingsData: {
            listSettings: []
        }
    };

    constructor(props) {
        super(props);

        const {getSpecificSettings, listingFields, setPersonalizedValues} = this.props;
        // Get PersonCapacity Settings Data
        //getSpecificSettings(2);
        let mobileDevice = false;
        let roomType = [];
        let personCapacity = [];
        if (detectMobileBrowsers.isMobile() === true) {
            mobileDevice = true;
        }
        if (listingFields != undefined) {
            roomType = listingFields.roomType;
            personCapacity = listingFields.personCapacity;
        }
        this.state = {
            mobileDevice: mobileDevice,
            personCapacity: personCapacity,
            roomType: roomType,
            openCategory: false,
            openGuests: false,
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleSearchTypeClick = this.handleSearchTypeClick.bind(this);

        setPersonalizedValues({name: 'searchType', value: "stays"});
    }

    static getDerivedStateFromProps(props, state) {
        const {listingFields} = props;
        if (listingFields != undefined && (!_.isEqual(listingFields.roomType, state.roomType) || !_.isEqual(listingFields.personCapacity, state.personCapacity))) {
            return {
                roomType: listingFields.roomType,
                personCapacity: listingFields.personCapacity
            };
        } else {
            return null;
        }
    }

    handleClick() {

        const {personalized, setPersonalizedValues} = this.props;
        let updatedURI, uri = '/s?';

        if (personalized.searchType) {
            uri = uri + 'listType=' + personalized.searchType;
        }

        if (personalized.chosen != null) {
            uri = uri + '&address=' + personalized.location + '&chosen=' + personalized.chosen;
        } else {
            if (personalized.location != null) {
                uri = uri + '&address=' + personalized.location;
            }
        }

        if (personalized.startDate != null && personalized.endDate != null) {
            uri = uri + '&startDate=' + personalized.startDate + '&endDate=' + personalized.endDate;
        }

        if (personalized.personCapacity != null && !isNaN(personalized.personCapacity)) {
            uri = uri + '&guests=' + personalized.personCapacity;
        }

        if (personalized.category) {
            uri = uri + '&category=' + personalized.category;
        }

        updatedURI = encodeURI(uri);
        history.push(updatedURI);
    }

    handleSearchTypeClick(type) {
        const {setPersonalizedValues} = this.props;
        setPersonalizedValues({name: 'searchType', value: type});
    }

    componentDidUpdate(prevProps, prevState) {
        const {personalized} = this.props;
        if (prevProps.personalized !== personalized) {
            if (prevProps.personalized.location !== personalized.location && personalized.chosen) {
                if (personalized.searchType === "retreats") {
                    this.setState({
                        openCategory: true,
                    })
                }
            }
            if (prevProps.personalized.endDate !== personalized.endDate) {
                if (personalized.searchType !== "retreats") {
                    this.setState({
                        openGuests: true
                    })
                }
            }
        }
    }

    getCategoryName(val) {
        let categories = ['', 'Yoga', 'Wellness', 'Meditation', 'Spiritual', 'Art', 'Adventure', 'Personal Development', 'Teacher Traning'];
        return categories[val];
    }

    render() {

        const {location, dates, settingsData, setPersonalizedValues, personalized, listingFields} = this.props;
        const {formatMessage} = this.props.intl;
        const {personCapacity} = this.state;
        let rows = [];
        const isBrowser = typeof window !== 'undefined';
        // for (let i= 1; i <= 16; i++) {
        //   rows.push(<option value={i} key={i}>{i} {i>1 ? 'guests' : 'guest'}</option>);
        // }

        let startValue, endValue;
        if (personCapacity && personCapacity[0] && personCapacity[0].startValue) {
            for (let i = personCapacity[0].startValue; i <= personCapacity[0].endValue; i++) {
                rows.push(
                    <MenuItem eventKey={i}
                              active={personalized.personCapacity == i}>{i} {i > 1 ? 'guests' : 'guest'}</MenuItem>
                );
                startValue = personCapacity[0].startValue;
                endValue = personCapacity[0].endValue;
            }
        }
        const smallDevice = isBrowser ? window.matchMedia('(max-width: 640px)').matches : undefined;

        return (
            <Row className={s.fullWidth}>
                <Col xs={12} sm={12} md={12} lg={12} className={s.pad0}>
                    <form>
                        <div
                            className={cx(s.searchFormInputs, "homeSearchForm vidSearchForm")}
                        >
                            <div className={s.searchForm}>
                                <div className={cx(s.buttons)}>
                                    <Button
                                        className={cx(s.btn, s.btnRound, personalized.searchType === 'stays' && s.btnPrimary)}
                                        onClick={() => this.handleSearchTypeClick('stays')}>
                                        <span>
                                            <FormattedMessage {...messages.stays} />
                                        </span>
                                    </Button>
                                    <Button
                                        className={cx(s.btn, s.btnRound, personalized.searchType === 'stays_with' && s.btnPrimary)}
                                        onClick={() => this.handleSearchTypeClick('stays_with')}>
                                        <span>
                                            <FormattedMessage {...messages.staysWithExperiences} />
                                        </span>
                                    </Button>
                                    <Button
                                        className={cx(s.btn, s.btnRound, personalized.searchType === 'retreats' && s.btnPrimary)}
                                        onClick={() => this.handleSearchTypeClick('retreats')}>
                                        <span>
                                            <FormattedMessage {...messages.retreats} />
                                        </span>
                                    </Button>
                                </div>

                                <div style={{display: 'flex', justifyContent: 'center'}}>
                                    <div className={s.inputContainer}>
                                        <div
                                            className={cx(
                                                s.formRow,
                                                personalized.searchType === 'retreats' && s.marginH,
                                                personalized.searchType === 'stays' && s.stays,
                                                personalized.searchType === 'stays_with' && s.stays_with,
                                                personalized.searchType === 'retreats' && s.retreats,
                                            )}
                                        >
                                            <div className={cx(s.formItem, s.location)}>
                                                <label className={s.label}>
                                                    <span>
                                                        <FormattedMessage {...messages.where} />
                                                    </span>
                                                </label>
                                                <PlaceGeoSuggest
                                                    label={formatMessage(messages.homeWhere)}
                                                    className={cx(s.formControlInput, s.input)}
                                                    containerClassName={s.geoSuggestContainer}
                                                />
                                            </div>
                                            {
                                                personalized.searchType === 'retreats' ? (
                                                    <div className={cx(s.formItem, s.categories)}>
                                                        <label className={cx(s.selectPadding, s.label)}>
                                                            <span>
                                                                Categories
                                                            </span>
                                                        </label>
                                                        <Dropdown
                                                            onSelect={(value) => {
                                                                setPersonalizedValues({name: 'category', value})
                                                                this.setState({
                                                                    openCategory: false
                                                                })
                                                            }}
                                                            className={cx(s.searchDropdown)}
                                                            open={this.state.openCategory}
                                                        >
                                                            <Dropdown.Toggle>
                                                                <button type='button'
                                                                        className={cx(s.dropdownToggleButton)}
                                                                        onClick={() => {
                                                                            this.setState({
                                                                                openCategory: !this.state.openCategory
                                                                            })
                                                                        }}>
                                                                    {this.getCategoryName(personalized.category) || "Choose a category"}
                                                                </button>
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu className="super-colors">
                                                                <MenuItem eventKey="1"
                                                                          active={personalized.category === "1"}>Yoga</MenuItem>
                                                                <MenuItem eventKey="2"
                                                                          active={personalized.category === "2"}>Wellness</MenuItem>
                                                                <MenuItem eventKey="3"
                                                                          active={personalized.category === "3"}>Meditation</MenuItem>
                                                                <MenuItem eventKey="4"
                                                                          active={personalized.category === "4"}>Spiritual</MenuItem>
                                                                <MenuItem eventKey="5"
                                                                          active={personalized.category === "5"}>Art</MenuItem>
                                                                <MenuItem eventKey="6"
                                                                          active={personalized.category === "6"}>Adventure</MenuItem>
                                                                <MenuItem eventKey="7"
                                                                          active={personalized.category === "7"}>Personal Development</MenuItem>
                                                                <MenuItem eventKey="8"
                                                                          active={personalized.category === "8"}>Teacher Training</MenuItem>
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </div>
                                                ) : (
                                                    <div className={cx(s.formItem, s.dates)}>
                                                        <div className={cx("homeDate vidFormsearch", s.labels)}>
                                                            <label
                                                                className={cx(s.label, s.startLabel)}
                                                                htmlFor="start_date_id"
                                                            >
                                                                Start Date
                                                            </label>
                                                            <label
                                                                className={cx(s.label, s.endLabel)}
                                                                htmlFor="end_date_id"
                                                            >
                                                                End Date
                                                            </label>
                                                        </div>
                                                        <span className={cx("homeDate vidFormsearch", s.input)}>
                                                            {!smallDevice && (
                                                                <DateRange formName={"SearchForm"} numberOfMonths={2}/>
                                                            )}

                                                            {smallDevice && (
                                                                <MobileDateRange
                                                                    formName={"SearchForm"}
                                                                    numberOfMonths={2}
                                                                />
                                                            )}
                                                        </span>
                                                    </div>
                                                )
                                            }
                                            {
                                                personalized.searchType !== 'retreats' && (
                                                    <div className={cx(s.formItem, s.guests)}>
                                                        <label className={cx(s.selectPadding, s.label)}>
                                                            <span>
                                                                <FormattedMessage {...messages.guest} />
                                                            </span>
                                                        </label>
                                                        <Dropdown
                                                            onSelect={(value) => {
                                                                setPersonalizedValues({name: 'personCapacity', value})
                                                                this.setState({
                                                                    openGuests: false
                                                                })
                                                            }}
                                                            className={cx(s.searchDropdown)}
                                                            open={this.state.openGuests}
                                                        >
                                                            <Dropdown.Toggle>
                                                                <button type='button'
                                                                        className={cx(s.dropdownToggleButton)}
                                                                        onClick={() => {
                                                                            this.setState({
                                                                                openGuests: !this.state.openGuests
                                                                            })
                                                                        }}>
                                                                    {personalized.personCapacity || "Choose a guest capacity"}
                                                                </button>
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu className="super-colors">
                                                                {rows}
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </div>
                                                )
                                            }
                                            <Button
                                                className={cx(
                                                    s.btnSearchLg,
                                                    s.btn,
                                                    s.btnSearch,
                                                    s.btnCircle
                                                )}
                                                onClick={this.handleClick}
                                            >
                                                <span>
                                                    <FontAwesome.FaSearch/>
                                                </span>
                                            </Button>
                                            <Button
                                                className={cx(
                                                    s.btnSearchSm,
                                                    s.btn,
                                                    s.btnSearch,
                                                    s.btnRound
                                                )}
                                                onClick={this.handleClick}
                                            >
                                                <span>
                                                    <FormattedMessage {...messages.search} />
                                                </span>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {
                            personalized.searchType === "retreats" && (
                                <div className={cx(s.checkItems)}>
                                    <div className={cx(s.checkItem)}>
                                        <FaCheck/>
                                        <label>Best price, guaranteed</label>
                                    </div>
                                    <div className={cx(s.checkItem)}>
                                        <FaCheck/>
                                        <label>FREE cancellation available</label>
                                    </div>
                                    <div className={cx(s.checkItem)}>
                                        <FaCheck/>
                                        <label>No booking fees</label>
                                    </div>
                                </div>
                            )
                        }
                    </form>
                </Col>
            </Row>
        );
    }
}

VideoSearchForm = reduxForm({
    form: 'VideoSearchForm', // a unique name for this form
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
})(VideoSearchForm);

const mapState = (state) => ({
    personalized: state.personalized,
    settingsData: state.viewListing.settingsData,
    listingFields: state.listingFields.data,
});

const mapDispatch = {
    getSpecificSettings,
    setPersonalizedValues
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(VideoSearchForm)));
