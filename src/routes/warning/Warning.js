import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {
  Grid,
  Row,
  Col } from 'react-bootstrap';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Warning.css';

// Components
import Link from '../../components/Link';

class Warning extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    siteName: PropTypes.string.isRequired,
  };

  render() {
    const {siteName} = this.props;
    
    return (
        <div className={s.container}>
          <Grid fluid>
            <Row className={cx(s.space6, s.spaceTop6)}>
              <Col xs={12} sm={12} md={12} lg={12} className={s.textCenter}>
                <h3 className={cx(s.textJumbo, 'hidden-xs', 'hidden-sm')}>Something went wrong!</h3>
                <h3 className={cx(s.textMedium, 'visible-xs', 'visible-sm')}>Something went wrong!</h3>
                <h2>We couldn't complete your request</h2>
                <span className={s.subTitle}>Error code: 500</span>
                <ul className={cx(s.spaceTop2, s.listStyled)}>
                  <li className={s.space2}>
                    <span>Here are some helpful links instead:</span>
                  </li>
                  <li>
                    <Link to={"/"}>Home</Link>
                  </li>
                  <li>
                    <Link to={"/s"}>Search</Link>
                  </li>
                  <li>
                    <a>Help</a>
                  </li>
                  <li>
                    <a>Hosting on {siteName}</a>
                  </li>
                  <li>
                    <a>Trust & Safety</a>
                  </li>
                </ul>
              </Col>
            </Row>
          </Grid>
        </div>
    );
  }
}

const mapState = (state) => ({
  siteName: state.siteSettings.data.siteName
});

const mapDispatch = {};

export default withStyles(s)(connect(mapState, mapDispatch)(Warning));
