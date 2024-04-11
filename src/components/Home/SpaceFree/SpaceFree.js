import React from 'react';
import PropTypes from 'prop-types';
import { FormattedDate, FormattedMessage } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './SpaceFree.css';
import {
    Grid,
    Row,
    Col,
    Image
} from 'react-bootstrap';
import cx from 'classnames';
//local

import bannertwo from './banner.jpg';
import messages from '../../../locale/messages';



class SpaceFree extends React.Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
    };

    render() {

        return (
           <div className={s.spaceFree}>
                <Grid>
                    <div >
                        <Row>
                            <Col lg={6} md={6} sm={6} xs={12}>
                            <div className={s.spaceLeft}>
                            <div className={s.spaceBg} style={{ backgroundImage: `url(${bannertwo})` }}></div>
                            
                            </div>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={12}>
                            <div className={s.spaceRight}>
                              <div className={s.spaceHeader}>
                              Find out how much you could earn hosting your place
                              </div>
                              <div className={s.spaceSmall}>
                              Turn your extra space into extra income.
                              </div>
                              <div className={s.secFourbutt}>
                                    <button>Find out more</button>
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

export default withStyles(s)(SpaceFree);
