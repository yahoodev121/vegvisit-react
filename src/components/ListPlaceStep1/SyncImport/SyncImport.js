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
import s from '../ListPlaceStep1.css';

// Component
import ImportCalendar from './ImportCalendar/ImportCalendar';
import CalendarsList from './CalendarsList';
import Loader from '../../Loader/Loader';

class SyncImport extends Component {

    static propTypes = {
        listId: PropTypes.number.isRequired,
        loading: PropTypes.bool,
    };

    static defaultProps = {
        loading: false
    };

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
        };
        this.openImportModal = this.openImportModal.bind(this);
        this.closeImportModal = this.closeImportModal.bind(this);
    }

    openImportModal() {
        this.setState({ showModal: true });
    }

    closeImportModal() {
        this.setState({ showModal: false });
    }

    render() {
        const { showModal, showExport } = this.state;
        const { listId, loading } = this.props;
        return (
            <div>
                <Loader
                    show={loading}
                    type={"page"}
                >
                    <ImportCalendar
                        listId={listId}
                        showModal={showModal}
                        close={this.closeImportModal}
                    />
                    <CalendarsList />

                    <Col xs={12} sm={12} md={12} lg={12} className={cx(s.spaceTop1, s.space5, s.noPadding)}>
                        <ul className={s.listType}>
                            <li className={s.space2}>
                                <Button className={s.btnContainer} onClick={this.openImportModal}>
                                    <div className={s.displayTable}>
                                        {/* <div className={s.displayTableCellVertical}>
                                            <FontAwesome.FaDownload className={cx(s.iconColor, s.iconSize)} />
                                        </div> */}
                                        <div className={cx(s.paddingLeft, s.displayTableCellVertical)}>
                                            {/* <span>Sync your calendar with other platforms</span> */}
                                            <span>Import Calendar</span>
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

export default withStyles(s)(connect(mapState, mapDispatch)(SyncImport)); 