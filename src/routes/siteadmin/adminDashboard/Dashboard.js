import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {graphql, compose} from 'react-apollo';

//Component
import AdminDashboard from '../../../components/siteadmin/AdminDashboard';
import Loader from '../../../components/Loader';

// GraphQL
import UserDashboard from './UserDashboard.graphql';
import ListingDashboard from './ListingDashboard.graphql';
import ReservationDashboard from './ReservationDashboard.graphql';
class Dashboard extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        getUserData: PropTypes.object,
        ListingDashboard: PropTypes.object,
    };

    render() {
        const { getUserData, getListingData, getReservationData, title } = this.props;

        if (getUserData.loading || getListingData.loading || getReservationData.loading){
            return <Loader type={"text"} />;
        }

        return <AdminDashboard title={title} user={getUserData} listing={getListingData} reservation={getReservationData} />;
    }
}

export default compose(
    graphql(UserDashboard, 
        {
            name: 'getUserData',
            options: {
                fetchPolicy: 'network-only'
            }
        }
    ),
    graphql(ListingDashboard, 
        {
            name: 'getListingData',
            options: {
                fetchPolicy: 'network-only'
            }
        }
    ),
    graphql(ReservationDashboard,
        {
            name: 'getReservationData',
            options: {
                fetchPolicy: 'network-only'
            }
        }
    ),
)(Dashboard);