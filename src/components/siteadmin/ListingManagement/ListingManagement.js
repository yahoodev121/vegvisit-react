import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Table, Tr, Td } from 'reactable';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import moment from 'moment';
import Confirm from 'react-confirm-bootstrap';

// Redux Action
import { removeListing } from '../../../actions/siteadmin/ListingManagement/removeListing';
import { removeImportedReviews } from '../../../actions/siteadmin/ListingManagement/removeImportedReviews';
import {
  addListToRecommended,
  removeListFromRecommended
} from '../../../actions/siteadmin/ListingManagement/manageRecommend';

import messages from './messages';
import { graphql, gql, compose } from 'react-apollo';
import { FormattedMessage, injectIntl } from 'react-intl';
// Style
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ListingManagement.css';
import CustomPagination from '../../CustomPagination';
import listingsQuery from './listingsQuery.graphql';
import { FormControl } from 'react-bootstrap';
class ListingManagement extends React.Component {

  static propTypes = {
    getAllListings: PropTypes.array,
    title: PropTypes.string.isRequired,
    addListToRecommended: PropTypes.func.isRequired,
    removeListFromRecommended: PropTypes.func.isRequired,
  };

  static listingsDataMapping = {
    id: {
      heading: 'Id',
      sortColumn: 'id'
    },
    title: {
      heading: 'Title',
      sortColumn: 'title'
    },
    hostName: {
      heading: 'Owner Name',
      sortColumn: 'id'
    },
    hostEmail: {
      heading: 'Owner Email',
      sortColumn: 'id'
    },
    address: {
      heading: 'Address',
      sortColumn: 'street'
    },
    city: {
      heading: 'City',
      sortColumn: 'city'
    },
    state: {
      heading: 'State',
      sortColumn: 'state'
    },
    country: {
      heading: 'Country',
      sortColumn: 'country'
    },
    createdAt: {
      heading: 'CreatedDate',
      sortColumn: 'createdAt'
    },
    updatedAt: {
      heading: 'Last Updated',
      sortColumn: 'updatedAt'
    },
    hostName: {
      heading: 'Owner Name',
      sortColumn: 'id'
    },
    marketingHelp: {
      heading: 'Marketing Help',
      sortColumn: 'residenceType'
    },
    isPublished: {
      heading: 'Published',
      sortColumn: 'isPublished'
    },
    lastPublished: {
      heading: 'Last Published',
      sortColumn: 'lastPublished'
    },
    isReady: {
      heading: 'Ready',
      sortColumn: 'isReady'
    },
    reviewsImportUrlAirbnb: {
      heading: 'Review Import Url',
      sortColumn: 'reviewsImportUrlAirbnb'
    },
    lastReviewsImportAirbnb: {
      heading: 'Last Reviews Import',
      sortColumn: 'lastReviewsImportAirbnb'
    },
  }

  static getSortColumn(heading) {
    const defaultSortColumn = 'id';
    if (!heading) {
      return defaultSortColumn;
    }
    for ( const item in ListingManagement.listingsDataMapping) {
      if ( ListingManagement.listingsDataMapping[item] && ListingManagement.listingsDataMapping[item].heading === heading ) {
        return ListingManagement.listingsDataMapping[item].sortColumn;
      }
    }
    return defaultSortColumn;
  }

  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      searchList: '',
      sortColumn: 'id',
      sortDirection: 1,
      typing: false,
      typingTimeout: 0
    }
    this.paginationData = this.paginationData.bind(this);
    this.sortData = this.sortData.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  paginationData(currentPage) {
    const { getAllListings: { refetch } } = this.props;
    let variables = { currentPage };
    this.setState({ currentPage });
    refetch(variables);
  }
  sortData(sortInfo) {
    // console.log(`Sorting table now by column ${sortInfo && sortInfo.column} and direction ${sortInfo && sortInfo.direction}`, sortInfo);
    const { getAllListings: { refetch } } = this.props;
    this.setState({sortColumn: ListingManagement.getSortColumn(sortInfo && sortInfo.column), sortDirection: sortInfo && sortInfo.direction, currentPage: 1});
    refetch({sortColumn: ListingManagement.getSortColumn(sortInfo && sortInfo.column), sortDirection: sortInfo && sortInfo.direction, currentPage: 1});
  }
  handleClick(searchList) {
    const { getAllListings: { refetch } } = this.props;
    const { currentPage, sortColumn, sortDirection } = this.state;
    let variables = {
      currentPage: 1,
      searchList: searchList,
      sortColumn,
      sortDirection
    };
    this.setState({ currentPage: 1 });
    refetch(variables);
  }
  handleSearchChange = (e) => {
    const self = this;
    if (self.state.typingTimeout) {
      clearTimeout(self.state.typingTimeout);
    }
    self.setState({
      searchList: event.target.value,
      typing: false,
      typingTimeout: setTimeout(function () {
        self.handleClick(self.state.searchList);
      }, 450)
    });
  }

  async deleteListing(id, type) {
    const { removeListing } = this.props;
    const { getAllListings: { refetch } } = this.props;

    let variables = { currentPage: 1 };
    await removeListing(id, type);
    this.setState({ currentPage: 1 });
    await refetch(variables);
  }

  async deleteImportedReviews(id, url) {
    const { removeImportedReviews } = this.props;
    const { getAllListings: { refetch } } = this.props;

    let variables = { currentPage: 1 };
    await removeImportedReviews(id, url);
    this.setState({ currentPage: 1 });
    await refetch(variables);
  }

  render() {
    const { intl, removeListing, title, addListToRecommended, removeListFromRecommended } = this.props;
    const { getAllListings: { loading, getAllListings } } = this.props;
    const { currentPage, searchList, sortColumn, sortDirection } = this.state;

    return (
      <div className={cx(s.pagecontentWrapper)}>
        <div className={s.contentBox}>
          <h1 className={s.headerTitle}>{title}</h1>
          <div className={cx('table-responsive', 'listing-table')}>
            {
              getAllListings && getAllListings.usersData.length > 0 && <a
                href="/export-admin-data?type=listings"
                className={cx('pull-right', s.exportLink)}
              >
                Export Data into CSV
              </a>
            }
            <div className={cx('col-md-4', s.seachContent)} >
              <FormControl
                type="text"
                placeholder={'Search'}
                onChange={(e) => this.handleSearchChange(e)}
              />
            </div>
            <Table className="table"
              // filterable={['id', 'Owner Name', 'Owner Email', 'City', 'State', 'Country']}
              noDataText="No matching records found."
              // sortable={true}
              sortable={[
                ListingManagement.listingsDataMapping.id.heading,
                ListingManagement.listingsDataMapping.title.heading,
                ListingManagement.listingsDataMapping.city.heading,
                ListingManagement.listingsDataMapping.state.heading,
                ListingManagement.listingsDataMapping.country.heading,
                ListingManagement.listingsDataMapping.marketingHelp.heading,
                ListingManagement.listingsDataMapping.isPublished.heading,
                ListingManagement.listingsDataMapping.isReady.heading,
                {
                  column: ListingManagement.listingsDataMapping.createdAt.heading,
                  sortFunction: Date
                },
                {
                  column: ListingManagement.listingsDataMapping.updatedAt.heading,
                  sortFunction: Date
                },
                {
                  column: ListingManagement.listingsDataMapping.lastPublished.heading,
                  sortFunction: Date
                },
                ListingManagement.listingsDataMapping.reviewsImportUrlAirbnb.heading,
                {
                  column: ListingManagement.listingsDataMapping.lastReviewsImportAirbnb.heading,
                  sortFunction: Date
                },
              ]}
              defaultSort={{ column: 'Id', direction: 'desc' }}
            // itemsPerPage={20}
              onSort={this.sortData}
            >
              {
                getAllListings && getAllListings.usersData.length > 0 && getAllListings.usersData.map((value, key) => {
                  let viewListing = "/rooms/" + value.id;
                  let editListing = '/become-a-host/' + value.id + '/home';
                  let isPublished = value.isPublished ? 'Yes' : 'No';
                  let isReady = value.isReady ? 'Yes' : 'No';
                  
                  let isResidenceType = value && value.residenceType == 1 ? 'Yes' : 'No';

                  let address = [value.street, value.buildingName, value.city, value.state, value.country, value.zipcode]
                    .filter(item => item)
                    .join(', ');

                  return (
                    <Tr key={key}>
                      <Td column={ListingManagement.listingsDataMapping.id.heading} data={value.id} />
                      <Td column={ListingManagement.listingsDataMapping.title.heading} data={value.title} />
                      <Td column={ListingManagement.listingsDataMapping.hostName.heading} data={value && value.user && value.user.profile && value.user.profile.firstName} />
                      <Td column={ListingManagement.listingsDataMapping.hostEmail.heading} data={value && value.user && value.user.email} />
                      <Td column={ListingManagement.listingsDataMapping.address.heading} data={address} />
                      <Td column={ListingManagement.listingsDataMapping.city.heading} data={value.city} />
                      <Td column={ListingManagement.listingsDataMapping.state.heading} data={value.state} />
                      <Td column={ListingManagement.listingsDataMapping.country.heading} data={value.country} />
                      <Td column={ListingManagement.listingsDataMapping.createdAt.heading} data={moment(value.createdAt).format('MM/DD/YYYY')} />
                      <Td column={ListingManagement.listingsDataMapping.updatedAt.heading} data={moment(value.updatedAt).format('MM/DD/YYYY hh:mm:ss a')} />
                      <Td column={ListingManagement.listingsDataMapping.marketingHelp.heading}>
                        {isResidenceType}
                      </Td>
                      {
                        value.recommend != null && <Td column="Recommend">
                          <a href="javascript:void(0)" onClick={() => removeListFromRecommended(value.id, currentPage, searchList, sortColumn, sortDirection)} >
                            Remove
                            </a>
                        </Td>
                      }

                      {
                        value.recommend == null && <Td column="Recommend">
                          <a href="javascript:void(0)" onClick={() => addListToRecommended(value.id, currentPage, searchList, sortColumn, sortDirection)} >
                            Set
                            </a>
                        </Td>
                      }

                      <Td column={ListingManagement.listingsDataMapping.isPublished.heading}>
                        {isPublished}
                      </Td>
                      <Td column={ListingManagement.listingsDataMapping.lastPublished.heading}>
                        {value.lastPublished && moment(value.lastPublished).format('MM/DD/YYYY hh:mm:ssA')}
                      </Td>
                      <Td column={ListingManagement.listingsDataMapping.isReady.heading}>
                        {isReady}
                      </Td>
                      <Td column={ListingManagement.listingsDataMapping.reviewsImportUrlAirbnb.heading}>
                        {value.reviewsImportUrlAirbnb}
                      </Td>
                      <Td column={ListingManagement.listingsDataMapping.lastReviewsImportAirbnb.heading}>
                        {value.lastReviewsImportAirbnb && moment(value.lastReviewsImportAirbnb).format('MM/DD/YYYY hh:mm:ssA')}
                      </Td>
                      <Td column="Delete Imported Reviews">
                        {
                          value.reviewsImportUrlAirbnb &&
                          <Confirm
                            onConfirm={() => this.deleteImportedReviews(value.id, value.reviewsImportUrlAirbnb)}
                            body={`Are you sure you want to delete all imported reviews from ${value.reviewsImportUrlAirbnb} for listing ${value.id} (${value.title})?`}
                            confirmText="Confirm Delete"
                            title="Delete Imported Reviews"
                          >
                            <a href="javascript:void(0)">Delete reviews</a>
                          </Confirm>
                        }
                      </Td>
                      <Td column="Edit">
                        <a href={editListing} target="_blank" >
                          Edit
                          </a>
                      </Td>

                      <Td column="View">
                        <a href={viewListing} target="_blank" >
                          View
                          </a>
                      </Td>

                      <Td column="Delete">
                        <Confirm
                          onConfirm={() => this.deleteListing(value.id, "admin")}
                          body="Are you sure you want to delete this?"
                          confirmText="Confirm Delete"
                          title="Deleting Listing"
                        >
                          <a href="javascript:void(0)">Delete</a>
                        </Confirm>
                      </Td>
                    </Tr>
                  )
                })
              }
            </Table>
            {
              getAllListings && getAllListings.usersData && getAllListings.usersData.length > 0
              && <div>
                <CustomPagination
                  total={getAllListings.count}
                  currentPage={currentPage}
                  defaultCurrent={1}
                  defaultPageSize={10}
                  change={this.paginationData}
                  paginationLabel={'Lists'}
                />
              </div>
            }
          </div>
        </div>
      </div>
    );
  }

}

const mapState = (state) => ({
});

const mapDispatch = {
  removeListing,
  removeImportedReviews,
  addListToRecommended,
  removeListFromRecommended
};
export default compose(
  injectIntl,
  withStyles(s),
  connect(mapState, mapDispatch),
  graphql(listingsQuery, {
    name: 'getAllListings',
    options: {
      variables: {
        currentPage: 1,
        searchList: '',
        sortColumn: 'id',
        sortDirection: 1,
      },
      fetchPolicy: 'network-only',
    }
  })
)(ListingManagement);
// export default withStyles(s)(connect(mapState, mapDispatch)(ListingManagement));



