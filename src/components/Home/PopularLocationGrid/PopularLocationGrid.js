import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './PopularLocationGrid.css';
import {
    Grid,
    Row,
    Col,
    Image
} from 'react-bootstrap';
import cx from 'classnames';

// Locale
import bannerone from './pexels-photo-1128317.jpeg';
import bannertwo from './pexels-photo-1015568.jpeg';
import messages from '../../../locale/messages';
import Loader from '../../Loader/Loader';
import PopularLocationGridItem from '../PopularLocationGridItem';

// Helper
import { popularLocationBaseUrl } from '../../../helpers/cdnImages'


class PopularLocationGrid extends React.Component {
    static propTypes = {
        data: PropTypes.arrayOf(PropTypes.shape({
          id: PropTypes.number.isRequired,
          location: PropTypes.string.isRequired,
          locationAddress: PropTypes.string.isRequired,
          image: PropTypes.string.isRequired,
          isEnable: PropTypes.string.isRequired,
          createdAt: PropTypes.string.isRequired,
          updatedAt: PropTypes.string.isRequired
        })).isRequired,
        loading: PropTypes.bool,
    };

    render() {
        const { loading, data } = this.props;
        if (loading) {
            return <Loader type={"text"} />
        } else {
            return (
                <Grid fluid>
                    <Row className={cx(s.GridCollapse)}>

                        {
                            data && data.length > 0 && data.map((item, index) => {
                                if (item.isEnable == 'true') {
                                    let path = popularLocationBaseUrl() + (index == 2 ? '' : 'medium_') + item.image;
                                    return <PopularLocationGridItem id={item.id} location={item.location} image={item.image} locationAddress={item.locationAddress} key={index} path={path} />;
                                }
                            })
                        }
                    </Row>
                </Grid>
            );
        }
    }
}

export default withStyles(s)(PopularLocationGrid);
