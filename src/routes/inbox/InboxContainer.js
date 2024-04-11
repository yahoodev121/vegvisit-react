import React from 'react';
import PropTypes from 'prop-types';
import { graphql, gql, compose } from 'react-apollo';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Inbox.css';
import Inbox from '../../components/Inbox';
import withoutTawkTo from '../../components/withoutTawkTo';

// Graphql 
import AllThreadsQuery from './AllThreadsQuery.graphql';
class InboxContainer extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    inboxType: PropTypes.string.isRequired,
    allThreads: PropTypes.object
  };

  render() {
    const { allThreads, inboxType } = this.props;
    return (

      <div className={s.container}>
        <Inbox 
          allThreads={allThreads} 
          inboxType={inboxType}
        />
      </div>
    );
  }
}

export default compose(
  withoutTawkTo,
  withStyles(s),
  graphql(AllThreadsQuery, {
    name: 'allThreads',
    options: {
      variables: {
        currentPage: 1
      },
      ssr: false,
      pollInterval: 5000,
      fetchPolicy: 'network-only'
    }
  }),
)(InboxContainer);
