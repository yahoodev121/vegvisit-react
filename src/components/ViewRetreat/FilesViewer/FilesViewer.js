import React, {useState} from 'react';
import { listingBaseUrl } from '../../../helpers/cdnImages';
import {
    Button, Image,
} from "react-bootstrap";
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from '../../../index.css';
import MediaViewerModal from "./MediaViewerModal";
import * as FontAwesome from 'react-icons/lib/fa';

class FilesViewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
        };
    }

    render() {
        const { images, title } = this.props;
        const { modalVisible } = this.state;

        return (
            <div className={cx(s.mXM1, s.relative)}>
                <div className={cx(s.wFull, s.flex)}>
                    <div className={cx(s.flex1, s.p1)}>
                        <Image className={s.wFull} src={`${listingBaseUrl()}x_medium_${images[0].name}`} />
                    </div>
                    <div className={cx(s.flex1, s.wFull, s.flex, s.flexWrap)}>
                        {
                            [1,2,3,4].map(index =>
                                <div key={index} className={cx(s.flex50pro, s.p1)}>
                                    {
                                        images[index] &&
                                        <Image className={cx(s.wFull, s.hFull)} src={`${listingBaseUrl()}x_medium_${images[index].name}`} />
                                    }
                                </div>
                            )
                        }
                    </div>
                </div>
                <Button className={cx(s.absolute, s.r2, s.b2, s.uppercase, s.btnRoundedGray)} onClick={() => this.setState({modalVisible: true})}>{images.length} Photos</Button>
                <MediaViewerModal show={modalVisible} onHide={() => this.setState({modalVisible: false})} images={images} title={title} />
            </div>
        );
    }
};

export default withStyles(s)(FilesViewer);
