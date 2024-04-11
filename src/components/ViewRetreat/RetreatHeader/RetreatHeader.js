import React from 'react';
import {
    Button
} from "react-bootstrap";
import * as FontAwesome from 'react-icons/lib/fa';
import * as MaterialDesign from 'react-icons/lib/md';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from '../../../index.css';
import Link from "../../Link";

const RetreatHeader = (props) => {
    const { retreat } = props;
    const formatValue = (value) => {
        if (value) {
            return parseFloat(value).toFixed(2);
        } else {
            return (0.00).toFixed(2);
        }
    }
    return (
        <div className={cx(s.wFull, s.flex, s.flexColumn, s.pt8)}>
            <h1 className={s.mb2}>{ retreat.UserListing.title }</h1>
            <p className={cx(s.mb2, s.inlineFlex, s.itemsCenter)}>
                <FontAwesome.FaStarO className={s.icon} />
                <span className={cx(s.mR2)}>{ formatValue(retreat.UserListing.reviewsStarRating) }</span>
                <span className={cx(s.link)}>{ retreat.UserListing.reviewsCount } reviews</span>
            </p>
            <p className={s.mb2}>
                <FontAwesome.FaMapMarker className={s.icon} />
                { retreat.UserListing.listingRetreat.location }
            </p>
            <p className={s.mb2}>
                <MaterialDesign.MdGroup className={s.icon} />
                Up to { retreat.UserListing.personCapacity | 0 } in group
            </p>
        </div>
    );
};

export default withStyles(s)(RetreatHeader);
