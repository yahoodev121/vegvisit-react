import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './PopularLocationItem.css';
import {Button, Grid, Row, Col, Breadcrumb} from 'react-bootstrap';
import cx from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';

// Component

import Link from '../../Link';
// Locale
import messages from '../../../locale/messages';
import ListPopularLocationPhoto from '../../ListPopularLocationCoverPhoto';
class PopularLocationHomeSlider extends React.Component {

  static propTypes = {
    formatMessage: PropTypes.func,
    id: PropTypes.number,
    location: PropTypes.string,
    locationAddress: PropTypes.string,
    image: PropTypes.string,
  };

  render() {
    const { id, location, locationAddress, image } = this.props;
    const { coverPhoto} = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <div>
        <Link to={'/s?&address=' + locationAddress + '&chosen=1'}>
        <div className={cx(s.imgContainer)}>
          <div className={cx(s.parent)}>
            <div className={cx(s.children)}>
              <div className={cx(s.content)}>
                {/* <a href={"/rooms/" + id} target={'_blank'}> */}
                  <ListPopularLocationPhoto
                    className={cx(s.imageContent)}
                    coverPhoto={coverPhoto}
                    listPhotos={image}
                    bgImage
                  />
                {/* </a> */}
                
              </div>
            </div>
          </div>
        </div>
        <div className={s.infoContainer}>
         {location}
        </div>
        </Link>
      </div>
    );
  }
}

export default injectIntl(withStyles(s)(PopularLocationHomeSlider));
