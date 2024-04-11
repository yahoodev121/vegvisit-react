import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

// Redux Form
import { change, submit as submitForm, formValueSelector, reduxForm } from 'redux-form';

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './SearchResults.css';
import cx from 'classnames';
import {
  Button,
  Grid,
  Row,
  Col,
  Breadcrumb
} from 'react-bootstrap';

// Component
import CustomPagination from '../CustomPagination';
import ListingItem from '../ListingItem';
import NoResults from '../NoResults';
import Loader from '../../Loader';

import submit from '../SearchForm/submit';
import { showForm } from '../../../actions/mobileSearchNavigation';
import ListingRetreatItem from '../ListingRetreatItem/ListingRetreatItem';
class SearchResults extends React.Component {
  static propTypes = {
    change: PropTypes.any,
    submitForm: PropTypes.any,
    results: PropTypes.array,
    currentPage: PropTypes.number,
    total: PropTypes.number,
    isResultLoading: PropTypes.bool
  };

  static defaultProps = {
    results: [],
    //isResultLoading: false,
    showMap: false,
    showMapLoader: false
  };

  constructor(props) {
    super(props);
    this.state = {
      page: props.currentPage
    };
    this.handlePagination = this.handlePagination.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    const { currentPage, results } = props;
    console.log('search-results:', results);
    if (currentPage != undefined && currentPage !== state.page) {
      return { page: currentPage };
    } else {
      return null;
    }
  }

  async handlePagination(currenctPage, size) {
    const { change, submitForm } = this.props;
    await change('currentPage', currenctPage);
    await submitForm('SearchForm');
  }

  render() {
    const { page } = this.state;
    const { results, total, isResultLoading, showMap, showMapLoader, searchType } = this.props;
    console.log('results', results);
    if (results != null && results.length > 0) {
      return (
        <div className={cx(s.searchResults, { [s.listItemOnly]: showMap == false })}>
          {
            !showMapLoader && <Row className={s.noMargin}>
             
                <div className={cx(s.resultsContainer)}>
                  {/* <Loader
                    type={"page"}
                    show={isResultLoading}
                  /> */}
                  {
                    isResultLoading && <div className={s.loadingOverlay} />
                  }
                  {
                    results.map((item, listIndex) => {
                      return (
                        <div className={cx(searchType === 'retreats' ? s.listRetreatItem : s.listItem, s.displayInlineBlock)} key={item.id}>
                          {
                            searchType === 'retreats' ? (
                              <ListingRetreatItem
                                id={item.id}
                                title={item.title}
                                basePrice={item.listingData.basePrice}
                                currency={item.listingData.currency}
                                beds={item.beds ? item.beds : 0}
                                personCapacity={item.personCapacity ? item.personCapacity : 0}
                                listPhotos={item.listPhotos}
                                bookingType={item.bookingType}
                                reviewsCount={item.reviewsCount}
                                reviewsStarRating={item.reviewsStarRating}
                                wishListStatus={item.wishListStatus}
                                isListOwner={item.isListOwner}
                                city={item.city}
                                state={item.state}
                                country={item.country}
                                listingRetreat={item.listingRetreat}
                              />
                            ) : (
                              <ListingItem
                                id={item.id}
                                basePrice={item.listingData.basePrice}
                                currency={item.listingData.currency}
                                title={item.title}
                                beds={item.beds}
                                personCapacity={item.personCapacity}
                                roomType={item.settingsData && item.settingsData[0] && item.settingsData[0].listsettings && item.settingsData[0].listsettings.itemName ? item.settingsData[0].listsettings.itemName : undefined}
                                houseType={item.settingsData && item.settingsData[1] && item.settingsData[1].listsettings && item.settingsData[1].listsettings.itemName ? item.settingsData[1].listsettings.itemName : undefined}
                                coverPhoto={item.coverPhoto}
                                listPhotos={item.listPhotos}
                                bookingType={item.bookingType}
                                reviewsCount={item.reviewsCount}
                                reviewsStarRating={item.reviewsStarRating}
                                wishListStatus={item.wishListStatus}
                                isListOwner={item.isListOwner} kitchentype={item.kitchen}
                                city={item.city}
                                state={item.state}
                                country={item.country}
                                experienceCategory={item.experienceCategory}
                              />
                            )
                          }

                        </div>
                      )
                    })
                  }
                </div>
                <div className={s.resultsFooter}>
                  <div className={s.resultsPagination}>
                    <div className={s.pagination}>
                      <CustomPagination
                        total={total}
                        current={page}
                        defaultCurrent={1}
                        defaultPageSize={12}
                        handleChange={this.handlePagination}

                      />
                    </div>
                  </div>
                </div>
             
            </Row>
          }
        </div>
      );

    } else {
      return (
        <div>
          {
            isResultLoading && <div className={s.loadingOverlay} />
          }
          <NoResults />
        </div>
      );
    }
  }
}

SearchResults = reduxForm({
  form: 'SearchForm', // a unique name for this form
  onSubmit: submit,
  destroyOnUnmount: false,
})(SearchResults);


const selector = formValueSelector('SearchForm');

const mapState = (state) => ({
  results: state.search.data,
  currentPage: selector(state, 'currentPage'),
  total: state.search.count,
  isResultLoading: state.search.isResultLoading,
  showMap: state.personalized.showMap,
  showMapLoader: state.loader.showMapLoading
});

const mapDispatch = {
  change,
  submitForm,
};

export default withStyles(s)(connect(mapState, mapDispatch)(SearchResults));
