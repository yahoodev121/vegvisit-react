import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './HomeKindofTrip.css';
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
import Loader from '../../Loader';


class HomeKindofTrip extends React.Component {
    static propTypes = {
        title: PropTypes.string,
        loading: PropTypes.bool,
    };

    render() {
        const { loading } = this.props;
        if (loading) {
            return <Loader type={"text"} />
        } else {
            return (
                <div className={s.container}>
                    <Grid fluid>
                        <div className={s.homeFind}>
                            <div className={s.homeFindHeader}>
                                Rent amazing homes for your trip
                            </div>
                            <div className={s.homePara}>
                                Homes with high standards and better facilities
                            </div>
                            <Row className={s.homeFindMain}>
                                <Col lg={6} md={6} sm={6} xs={12} className={s.paddingLeft}>
                                    <div className={s.homeFindLeft}>
                                        <div className={s.homeFindBg} style={{ backgroundImage: `url(${bannerone})` }}>
                                        </div>
                                        <div className={s.homeFindSmall}>
                                            Enjoy your trip!                                        </div>
                                        <div className={s.homeParaInner}>
                                            Rent the home that's suitable for you & your family and enjoy your trip!
                                        </div>
                                    </div>

                                </Col>
                                <Col lg={6} md={6} sm={6} xs={12} className={cx(s.paddingLeft, s.paddingTopMobile)}>
                                    <div className={s.homeFindLeft}>
                                        <div className={s.homeFindBg} style={{ backgroundImage: `url(${bannertwo})` }}></div>
                                        <div className={s.homeFindSmallColor}>
                                            Trusted community!
                                        </div>
                                        <div className={s.homeParaInner}>
                                            Our community is completely driven by trust and your family safety is assured
                                        </div>
                                    </div>

                                </Col>
                            </Row>
                        </div>

                    </Grid>
                </div>
            );
        }
    }
}

export default withStyles(s)(HomeKindofTrip);
