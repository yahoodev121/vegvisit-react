import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Tr, Td } from 'reactable';
import { connect } from 'react-redux';
import { deleteUser } from '../../../actions/siteadmin/users';
import Link from '../../../components/Link';
import messages from './messages';
// Redux Action
import { updateBanServiceHistoryStatus } from '../../../actions/siteadmin/updateBanServiceHistoryStatus';
// Toaster
import { toastr } from 'react-redux-toastr';
import { graphql, gql, compose } from 'react-apollo';
import { FormattedMessage, injectIntl } from 'react-intl';
import moment from 'moment';
import Confirm from 'react-confirm-bootstrap';
// Style
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './UserManagement.css';
import CustomPagination from '../../CustomPagination';
import usersQuery from './usersQuery.graphql';
import { FormControl } from 'react-bootstrap';

class UserManagement extends React.Component {
  static propTypes = {
    userManagement: PropTypes.array,
    editUser: PropTypes.any,
    deleteUser: PropTypes.any,
    title: PropTypes.string.isRequired,
    updateBanServiceHistoryStatus: PropTypes.any.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      currentPage: 1,
      searchList: '',
      typing: false,
      typingTimeout: 0
    }
    this.handleChange = this.handleChange.bind(this);
    this.paginationData = this.paginationData.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  async handleChange(e, userId, userMail, userName) {
    const { updateBanServiceHistoryStatus } = this.props;
    const { currentPage, searchList } = this.state;
    let id = userId;
    let banStatus = e.target.value;
   
    await updateBanServiceHistoryStatus(id, banStatus, userMail, userName, currentPage, searchList);
  }
  paginationData(currentPage) {
    const { userManagement: { refetch } } = this.props;
    let variables = { currentPage };
    this.setState({ currentPage });
    refetch(variables);
  }
  handleClick(searchList) {
    const { userManagement: { refetch } } = this.props;
    const { currentPage } = this.state;
    let variables = {
      currentPage: 1,
      searchList: searchList
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
  deleteChange(id, profileId, userType){
    const { deleteUser } = this.props;
    const { userManagement: { refetch } } = this.props;
    
    let variables = { currentPage: 1 };
    deleteUser(id, profileId, userType);
    this.setState({ currentPage: 1 });
    refetch(variables);
  }

  render() {
    const { editUser, deleteUser, title, handleChange } = this.props;
    const { userManagement: { loading, userManagement } } = this.props;
    const { currentPage } = this.state;
    let userType = 'admin';
    
    return (
      <div className={cx(s.pagecontentWrapper)}>
        <div className={s.contentBox}>
          <h1 className={s.headerTitle}>{title}</h1>
          <div className={'table-responsive'}>
            {
              userManagement && userManagement.usersData && userManagement.usersData.length > 0 && <a
                href="/export-admin-data?type=users"
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
              // filterable={['First name', 'Last name', 'Email address', 'Phone number']}
              noDataText="No matching records found."
              sortable={true}
              defaultSort={{ column: 'Created Date', direction: 'desc' }}
            // itemsPerPage={20}
            >
              {
                userManagement && userManagement.usersData.length > 0 && userManagement.usersData.map((value, key) => {
                  let banStatus = value.userBanStatus;
                  let recordId = value.id;
                  let userMail = value.email;
                  let userName = value.profile && value.profile.firstName + ' ' + value.profile.lastName;
                  if (banStatus === 1) {
                    banStatus = "1";
                  } else if (banStatus === 0) {
                    banStatus = "0";
                  }
                  return (
                    <Tr key={key}>
                      <Td column={"Profile Id"} data={value.profile && value.profile.profileId} className={s.userVerticalAlign} />
                      <Td column={"First name"} data={value.profile && value.profile.firstName} className={s.userVerticalAlign} />
                      <Td column={"Last name"} data={value.profile && value.profile.lastName} className={s.userVerticalAlign} />
                      <Td column={"Email address"} data={value.email} className={s.userVerticalAlign} />
                      <Td column={"Phone number"} data={value.profile && value.profile.phoneNumber} className={s.userVerticalAlign} />
                      <Td column={"Created Date"} data={moment(value.profile && value.profile.createdAt).format('MM/DD/YYYY')} className={s.userVerticalAlign} />
                      <Td column={"Last Login"} data={value.lastLogin && moment(value.lastLogin).format('MM/DD/YYYY hh:mm:ssA')} className={s.userVerticalAlign} />
                      <Td column={"View"} className={s.userVerticalAlign}>
                        <Link to={"/siteadmin/profileView/" + ((value.profile) ? value.profile.profileId : '')} >
                          View
                        </Link>
                      </Td>
                      {
                        <Td column="Action">
                          <select name="userBanStatus" className={cx(s.formControlSelect, s.userVerticalAlign, s.btnMarginBottom)}
                            onChange={(e) => this.handleChange(e, recordId, userMail, userName)} value={banStatus}>
                            <option value="">Select</option>
                            <option value="1">Ban</option>
                            <option value="0">UnBan</option>
                          </select>
                        </Td>
                      }
                      <Td column="Delete">
                        <div>
                          <Confirm
                            onConfirm={() => this.deleteChange(value.id, value.profile && value.profile.profileId, userType)}
                            body="Are you sure you want to delete this?"
                            confirmText="Confirm Delete"
                            title="Deleting User"
                          >
                            <a href="javascript:void(0)">Delete</a>
                          </Confirm>
                        </div>
                      </Td>
                    </Tr>
                  )
                })
              }
            </Table>
            {
              userManagement && userManagement.usersData && userManagement.usersData.length > 0
              && <div>
                <CustomPagination
                  total={userManagement.count}
                  currentPage={currentPage}
                  defaultCurrent={1}
                  defaultPageSize={10}
                  change={this.paginationData}
                  paginationLabel={'Users'}
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
  updateBanServiceHistoryStatus,
  deleteUser
};
export default compose(
  injectIntl,
  withStyles(s),
  connect(mapState, mapDispatch),
  graphql(usersQuery, {
    name: 'userManagement',
    options: {
      variables: {
        currentPage: 1,
        searchList: ''
      },
      fetchPolicy: 'network-only',
    }
  })
)(UserManagement);
// export default withStyles(s)(connect(mapState, mapDispatch)(UserManagement));
