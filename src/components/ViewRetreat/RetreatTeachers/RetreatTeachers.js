import React from 'react';
import { listingBaseUrl } from '../../../helpers/cdnImages'
import {
    Button, Image,
} from "react-bootstrap";
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from '../../../index.css';
import * as FontAwesome from 'react-icons/lib/fa';

const RetreatTeachers = (props) => {
    const { teachers } = props;
    return (
        <div className={cx(s.wFull, s.borderB, s.borderGray200, s.py4)}>
            <h4>Teachers</h4>
            <div className={s.pl4}>
                {
                    teachers.map(teacher =>
                        <div className={cx(s.wFull, s.flex)}>
                            <div className={s.flex1}>
                                <p className={cx(s.bold, s.textXl)}>{teacher.name}</p>
                                <div dangerouslySetInnerHTML={{ __html: teacher.about }} />
                            </div>
                            <div className={cx(s.flex, s.justifyCenter, s.itemsCenter)}>
                                <Image circle className={s.w124px} src={`${listingBaseUrl()}x_medium_${teacher.photos[0].name}`} />
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default withStyles(s)(RetreatTeachers);
