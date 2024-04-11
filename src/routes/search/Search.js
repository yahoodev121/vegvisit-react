// General
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { graphql, compose, gql } from 'react-apollo';

// Redux
import { connect } from 'react-redux';

// Redux Form
import {change, formValueSelector, reduxForm} from 'redux-form';

// Locale
import messages from '../../locale/messages';

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import { Button, Grid, Row, Col } from 'react-bootstrap';
import * as FontAwesome from 'react-icons/lib/fa';
import * as Material from 'react-icons/lib/md';
import s from './Search.css';

// Components
import SearchForm from '../../components/SearchListing/SearchForm';
import SearchResults from '../../components/SearchListing/SearchResults';
import MapResults from '../../components/SearchListing/MapResults';
import Loader from '../../components/Loader';
import Footer from '../../components/Footer/Footer';
import SliderAnimation from '../../components/SearchListing/SliderAnimation';

// New Design
import SearchHeader from '../../components/SearchListing/SearchHeader';
import RetreatSearchHeader from '../../components/SearchListing/RetreatSearchHeader';

// Redux Action
import { showMap, showResults, showForm, showFilter } from '../../actions/mobileSearchNavigation';
import { getListingFields } from '../../actions/getListingFields';
import { getDiets } from '../../actions/getDiets';
import { setPersonalizedValues } from '../../actions/personalized';

import ReactGoogleMapLoader from "react-google-maps-loader";
import { googleMapAPI } from '../../config';
import submit from '../../components/SearchListing/SearchForm/submit';

class Search extends React.Component {
  static propTypes = {
    searchType: PropTypes.string,
    initialFilter: PropTypes.object,
    searchSettings: PropTypes.object,
    filterToggle: PropTypes.bool,
    showMap: PropTypes.func.isRequired,
    showResults: PropTypes.func.isRequired,
    showForm: PropTypes.func.isRequired,
    formatMessage: PropTypes.func,
    mobileSearch: PropTypes.shape({
      searchMap: PropTypes.bool,
      searchResults: PropTypes.bool,
      searchForm: PropTypes.bool
    }),
    getListingFields: PropTypes.func,
  };

  static defaultProps = {
    mobileSearch: {
      searchMap: true,
      searchResults: false,
      searchForm: false,
      searchFilter: false
    },
    isMapShow: true
  };

  constructor(props) {
    super(props);

    this.state = {
      smallDevice: false,
      load: false
    };

    const { getListingFields, getDiets } = props;

    this.mapRef = React.createRef()

    // Get listing settings fields data
    getListingFields();
    getDiets();

    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    const { showResults, searchType, dispatch } = this.props;
    dispatch(change('SearchForm', 'listType', searchType));
    let isBrowser = typeof window !== 'undefined';
    if (isBrowser) {
      this.handleResize();
      window.addEventListener('resize', this.handleResize);
      if (window.matchMedia('(max-width: 768px)').matches) showResults();
    }

    this.setState({
      load: true
    })
  }

  componentWillUnmount() {
    let isBrowser = typeof window !== 'undefined';
    if (isBrowser) {
      window.removeEventListener('resize', this.handleResize);
    }
  }

  handleResize(e) {
    const { showResults, setPersonalizedValues } = this.props;
    let isBrowser = typeof window !== 'undefined';
    let smallDevice = isBrowser ? window.matchMedia('(max-width: 768px)').matches : false;
    if (smallDevice) {
      showResults();
      setPersonalizedValues({ name: 'showMap', value: false });
    }
    this.setState({ smallDevice });
  }

  mobileNavigation() {
    const {
      mobileSearch: { searchMap, searchResults },
      showMap,
      showResults,
      showForm,
      setPersonalizedValues
    } = this.props;

    let leftNav, rightNav;
    if (searchResults) {
      leftNav = <Button className={cx(s.filterButton, s.locationBtn)} bsStyle="link" onClick={() => {
        showMap();
        setPersonalizedValues({ name: 'showMap', value: true })
        // if (this.mapRef.current) {
        //   this.mapRef.current.scrollIntoView();
        // }
        window.scrollTo({
          top: screen.height,
          behavior: 'smooth'
        })
      }}><FormattedMessage {...messages.map} />{' '}<FontAwesome.FaMap className={s.icon} /></Button>;
      rightNav = <Button className={cx(s.filterButton)} bsStyle="link" onClick={() => showForm()}><FormattedMessage {...messages.filters} /><FontAwesome.FaSliders /></Button>
    }

    if (searchMap) {
      leftNav = <Button className={cx(s.filterButton)} bsStyle="link" onClick={() => {
        showResults()
        setPersonalizedValues({ name: 'showMap', value: false })
      }}><FormattedMessage {...messages.results} />{' '}<Material.MdSettingsInputComposite className={s.icon} /></Button>
      rightNav = <Button className={cx(s.filterButton)} bsStyle="link" onClick={() => showForm()}><FormattedMessage {...messages.filters} /><FontAwesome.FaSliders /></Button>
    }

    return (
      <div className={cx(s.mobileNavigation)}>
        <div className={s.buttonOuter}>
          <div className={cx(s.buttonContainer)}>
            {
              leftNav
            }
            {
              //rightNav
            }
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {
      mobileSearch: { searchMap, searchResults, searchForm, searchFilter },
      searchSettings,
      initialFilter,
      filterToggle,
      isMapShow,
      showFilter,
      showResults,
      layoutType,
      searchType,
      getBannerData
    } = this.props;

    const { smallDevice, load } = this.state;

    let DesktopResults = true;
    if (filterToggle === true) {
      DesktopResults = false;
    }
    const isBrowser = typeof window !== 'undefined';
    //const smallDevice = isBrowser ? window.matchMedia('(max-width: 768px)').matches : undefined;

    if (!load || !isBrowser) {
      return (
        <div className={s.searchLoaderContainer}>
          <Loader type={"text"} />
        </div>
      );
    }

    return (
      <div className={cx(s.root, 'searchPage', { [s.topPadding]: searchType !== 'retreats' })}>
        <div className={cx(s.container, { [s.containerPadding]: searchType !== 'retreats' })}>
          {layoutType && (layoutType == 1 || layoutType == 3) && searchType == 'retreats' && (
            <SliderAnimation layoutType={layoutType} data={getBannerData} />
          )}
          {
            !smallDevice &&
            (searchType === 'retreats' ?
              <RetreatSearchHeader searchType={searchType} searchSettings={searchSettings} /> :
              <SearchHeader searchType={searchType} searchSettings={searchSettings} />)
          }
          {
            smallDevice && !searchMap &&
            (searchType === 'retreats' ?
              <RetreatSearchHeader searchType={searchType} showFilter={showFilter} showResults={showResults} searchSettings={searchSettings} /> :
              <SearchHeader searchType={searchType} showFilter={showFilter} showResults={showResults} searchSettings={searchSettings} />)

          }
          <Grid fluid className={cx(s.noPadding)}>
            <Row className={cx(s.fullWidth, s.noMargin)}>
              <Col xs={12} sm={isMapShow ? 6 : 12} md={isMapShow ? 8 : 12} className={s.noPadding}>
                <div className={cx(s.searchResultContainer, { [s.listItemOnly]: isMapShow == false })}>
                  {/* {
                    !smallDevice && <div className={cx(s.filtersBody)}>
                      <SearchForm initialFilter={initialFilter} searchSettings={searchSettings} />
                    </div>
                  }

                  {
                    smallDevice && searchForm && <div className={cx(s.filtersBody)}>
                      <SearchForm initialFilter={initialFilter} searchSettings={searchSettings} />
                    </div>
                  } */}

                  {
                    !smallDevice && DesktopResults && <div className={cx(s.resultsBody)}>
                      <SearchResults searchType={searchType} />
                    </div>
                  }

                  {
                    smallDevice && searchResults && <div className={cx(s.resultsBody)}>
                      <SearchResults searchType={searchType} />
                    </div>
                  }
                  {/* {
                    smallDevice && searchResults && <div className={cx(s.space10)}>
                      <Footer />
                    </div>
                  } */}

                </div>
              </Col>
              {
                isMapShow && (
                  <Col xs={12} sm={6} md={4} className={s.stickyMap} ref={this.mapRef}>
                    <div
                      className={s.searchMapContainer}
                    >
                      <ReactGoogleMapLoader
                        params={{
                          key: googleMapAPI, // Define your api key here
                          libraries: "places,geometry,markerwithlabel"// To request multiple libraries, separate them with a comma
                        }}
                        render={googleMaps =>
                          googleMaps && (
                            <MapResults initialFilter={initialFilter} searchSettings={searchSettings} />
                          )}
                      />
                    </div>
                  </Col>
                )
              }
            </Row>
          </Grid>
          {
            !searchForm && this.mobileNavigation()
          }

        </div>
      </div>
    );
  }
}

// This reduxForm is needed for the mobile device MapResults,
// so submit is called when zooming or panning
Search = reduxForm({
  form: 'SearchForm', // a unique name for this form
  onSubmit: submit,
  destroyOnUnmount: false,
})(Search);

const selector = formValueSelector('SearchForm');

const mapState = (state) => ({
  filterToggle: state.toggle.filterToggle,
  mobileSearch: state.mobileSearch.data,
  isMapShow: state.personalized.showMap
});

const mapDispatch = {
  showMap,
  showResults,
  showForm,
  getListingFields,
  getDiets,
  showFilter,
  setPersonalizedValues
};

export default compose(
  withStyles(s),
  graphql(gql`
        query getBanner{
          getBanner {
            id
            title
            content
          }
        }
      `, {
    name: 'getBannerData',
    options: {
      ssr: true
    }
  })
)(connect(mapState, mapDispatch)(Search));
