import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './BecomeHost.css';
import {
  Grid,
  Row,
  Col
} from 'react-bootstrap';

// Component
import ListPlaceStep1 from '../../components/ListPlaceStep1';
import withoutTawkTo from '../../components/withoutTawkTo';

// Translation
import { injectIntl } from 'react-intl';

class BecomeHost extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    mode: PropTypes.string,
    listId: PropTypes.number,
    formBaseURI: PropTypes.string,
    mode: PropTypes.string
  };

  render() {
    const { title, formPage, formBaseURI, mode, listId, baseCurrency } = this.props;
    return (
      <div className={s.root}>
        <div className={s.container}>
          <ListPlaceStep1
            listId={listId}
            formPage={formPage}
            formBaseURI={formBaseURI}
            mode={mode}
            baseCurrency={baseCurrency}
          />
        </div>
      </div>
    );
  }
}


export default compose(
  withoutTawkTo,
  withStyles(s)
)(BecomeHost);
