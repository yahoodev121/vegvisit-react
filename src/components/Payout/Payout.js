import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { graphql, compose } from 'react-apollo';

import {
  Button,
  Form,
  Grid,
  Row, FormGroup,
  Col,
  ControlLabel,
  FormControl,
  FieldGroup,
  Panel,
  Label,
} from 'react-bootstrap';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Payout.css';

// Component
import PayoutList from './PayoutList';
import EmptyList from './PayoutList/EmptyList';
import Loader from '../Loader';

// Graphql
import getPayoutsQuery from './getPayoutsQuery.graphql';

class Payout extends Component {
    static propTypes = {
      PayoutData: PropTypes.shape({
        loading: PropTypes.bool.isRequired,
        getPayouts: PropTypes.array
      })
    };

    static defaultProps = {
      PayoutData: {
        loading: true,
        getPayouts: []
      }
    }

    render() {
        const { PayoutData: { loading, getPayouts } } = this.props;
        if(loading){
          return <Loader type={"text"} />;
        } else {
            if(getPayouts != undefined && getPayouts.length > 0){
              return <PayoutList data={getPayouts} />;
            } else {
              return <EmptyList />;
            }
        }
    }
}

export default compose(
    withStyles(s),
    graphql(getPayoutsQuery, {
      name: 'PayoutData',
      options: {
        ssr: false,
      }
    }),
)(Payout);