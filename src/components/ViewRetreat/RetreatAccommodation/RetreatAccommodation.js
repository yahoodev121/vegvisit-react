import React from 'react';
import { listingBaseUrl } from '../../../helpers/cdnImages';
import {
    Button, Image,
} from "react-bootstrap";
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from '../../../index.css';
import * as FontAwesome from 'react-icons/lib/fa';

const RetreatAccommodation = (props) => {
    const { accommodations } = props;
    return (
        <div className={cx(s.wFull, s.borderB, s.borderGray200, s.py4)}>
            <h4>Accommodation</h4>
                <div className={cx(s.wFull, s.flex, s.mXM1)}>
                {
                    accommodations.map(accommodation =>
                        <div className={cx(s.w33pro, s.px1)}>
                            <div className={cx(s.wFull, s.relative)}>
                                {
                                    accommodation.photos.length > 0 && <Image rounded className={cx(s.wFull, s.radio133pro)} src={`${listingBaseUrl()}x_medium_${accommodation.photos[0].name}`} />
                                }
                                {
                                    accommodation.photos.length > 1 &&
                                    <Button className={cx(s.absolute, s.r2, s.b2, s.uppercase, s.btnRoundedGray)}>{accommodation.photos.length} Photos</Button>
                                }
                            </div>
                            <p className={cx(s.textBlue, s.py2)}>USD${ parseInt(accommodation.price).toLocaleString() }</p>
                            <div dangerouslySetInnerHTML={{ __html: accommodation.description }} />
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default withStyles(s)(RetreatAccommodation);
