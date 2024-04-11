import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import * as FontAwesome from 'react-icons/lib/fa';
import {
    Button,
    Col
} from 'react-bootstrap';
import { toastr } from 'react-redux-toastr';
import { graphql, gql, compose } from 'react-apollo';
import { FormattedMessage, injectIntl } from 'react-intl';

import s from '../ListPlaceStep1.css';

// Component
import ImportCalendar from './ImportCalendar';
import ExportCalendar from './ExportCalendar';
import CalendarsList from './CalendarsList';
import Loader from '../../Loader';
import messages from '../../../locale/messages';

import log from '../../../helpers/clientLog';

class SyncCalendar extends Component {

    static propTypes = {
        listId: PropTypes.number.isRequired,
        loading: PropTypes.bool,
        getListingData: PropTypes.shape({
          loading: PropTypes.bool,
          UserListing: PropTypes.object
        }),
    };

    static defaultProps = {
        loading: false
    };

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            showExport: false,
            calendarExportSecret: ''
        };
        this.openImportModal = this.openImportModal.bind(this);
        this.closeImportModal = this.closeImportModal.bind(this);
        this.openExportModal = this.openExportModal.bind(this);
        this.closeExportModal = this.closeExportModal.bind(this);
    }

    componentDidUpdate(prevProps) {
      const { getListingData } = this.props;
      const prevSecret = prevProps.getListingData && prevProps.getListingData.UserListing ? prevProps.getListingData.UserListing.calendarExportSecret : '';
      if (getListingData && getListingData.UserListing && getListingData.UserListing.calendarExportSecret && getListingData.UserListing.calendarExportSecret !== prevSecret ) {
        this.setState({ calendarExportSecret: getListingData.UserListing.calendarExportSecret});
      }
    }

    openImportModal() {
        this.setState({ showModal: true });
    }

    closeImportModal() {
        this.setState({ showModal: false });
    }

    async openExportModal() {
        const { listId, updateCalendarExportSecret, getListingData } = this.props;
        const { getListingData: { loading, UserListing } } = this.props;
        if (this.state.calendarExportSecret) {
          this.setState({ showExport: true });
        } else {
          const { data: { UpdateCalendarExportSecret } } = await updateCalendarExportSecret({
            variables: {
                listId,
            }
          });
          if (UpdateCalendarExportSecret && UpdateCalendarExportSecret.status == 200 && UpdateCalendarExportSecret.calendarExportSecret) {
            this.setState({
              calendarExportSecret: UpdateCalendarExportSecret.calendarExportSecret,
              showExport: true
            })
          } else {
            log.error(`components.ListPlaceStep1.SyncCalendar.SyncCalendar.SyncCalendar.openExportModal: updateCalendarExportSecret did not return expected result: ${JSON.stringify(UpdateCalendarExportSecret)}`);
            toastr.error('Export Calendar', 'Export information cannot be shown currently');
          }
        }
    }

    closeExportModal() {
        this.setState({ showExport: false });
    }

    render() {
        const { showModal, showExport, calendarExportSecret } = this.state;
        const { listId, loading } = this.props;
        const { getListingData: { loading: loadingListing, UserListing } } = this.props;
        return (
            <div>
                <Loader 
                    show={loading || loadingListing} 
                    type={"page"}
                >
                    <ImportCalendar listId={listId} showModal={showModal} close={this.closeImportModal} />
                    <ExportCalendar 
                        listId={listId}
                        calendarExportSecret={calendarExportSecret}
                        showModal={showExport && !loadingListing} 
                        close={this.closeExportModal} 
                    />
                    <CalendarsList />
                    
                    <Col xs={12} sm={12} md={12} lg={12} className={cx(s.spaceTop1, s.space1, s.noPadding)}>
                        <ul className={s.listType}>
                            <li className={s.space2}>
                                <Button className={s.btnContainer} onClick={this.openImportModal}>
                                    <div className={s.displayTable}>
                                        <div className={s.displayTableCellVertical}>
                                            <FontAwesome.FaDownload className={cx(s.iconColor, s.iconSize)} />
                                        </div>
                                        <div className={cx(s.paddingLeft, s.displayTableCellVertical)}>
                                            <FormattedMessage {...messages.importCalendar} />
                                        </div>
                                    </div>
                                </Button>
                            </li>
                            <li>
                                <Button className={s.btnContainer} onClick={this.openExportModal}>
                                    <div className={s.displayTable}>
                                        <div className={s.displayTableCellVertical}>
                                            <FontAwesome.FaUpload className={cx(s.iconColor, s.iconSize)} />
                                        </div>
                                        <div className={cx(s.paddingLeft, s.displayTableCellVertical)}>
                                            <FormattedMessage {...messages.exportCalendar} />
                                        </div>
                                    </div>
                                </Button>
                            </li>
                        </ul>
                    </Col>
                </Loader>
            </div>
        );
    }
}

const mapState = (state) => ({
    loading: state.calendar.importCalLoading,
});

const mapDispatch = {};

// export default withStyles(s) (connect(mapState, mapDispatch)(SyncCalendar)); 
export default compose(
  injectIntl,
  withStyles(s),
  connect(mapState, mapDispatch),
  graphql(
    gql`
      query getListingData($listId:String!, $preview: Boolean) {
        UserListing (listId:$listId, preview: $preview) {
          id
          calendarExportSecret
        }
      }
    `,
    {
      name: 'getListingData',
      options: props => ({
        variables: {
          listId: props.listId
        },
        fetchPolicy: 'network-only'
      })
    }
  ),
  graphql(
    gql`
      mutation UpdateCalendarExportSecret(
        $listId: Int!,
      ){
        UpdateCalendarExportSecret(
            listId: $listId,
        ) {
            id,
            status,
            calendarExportSecret
        }
      }
    `, {
      name: 'updateCalendarExportSecret'
    })
)(SyncCalendar)

