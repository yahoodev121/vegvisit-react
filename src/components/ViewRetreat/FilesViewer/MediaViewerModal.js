import React from 'react';
import { listingBaseUrl } from '../../../helpers/cdnImages';
import {
    Button, Image, Modal, Tabs, Tab
} from "react-bootstrap";
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from '../../../index.css';
import * as FontAwesome from 'react-icons/lib/fa';

const MediaViewerModal = (props) => {
    const { images, title } = props;
    return (
        <Modal
            {...props}
            dialogClassName={cx(s.fullDialog)}
            aria-labelledby="contained-modal-title-lg"
        >
            <Modal.Header bsClass='modal-header container' closeButton>
                <Modal.Title id="contained-modal-title-lg">{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body bsClass={cx(s.px0, 'modal-body container')}>
                <Tabs defaultActiveKey={1}>
                    <Tab eventKey={1} title="Retreat Photos">
                        <div className={cx(s.wFull, s.flex, s.gap4)}>
                            <div className={cx(s.flex1)}>
                                <h3>Retreat Photos</h3>
                            </div>
                            <div className={cx(s.flex2)}>
                                {
                                    images.map((image, index) =>
                                        <div key={index} className={cx(s.flex50pro, s.p1)}>
                                            <Image className={cx(s.wFull, s.hFull)} src={`${listingBaseUrl()}x_medium_${image.name}`} />
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </Tab>
                    <Tab eventKey={2} title="Videos">
                        Tab 2 content
                    </Tab>
                    <Tab eventKey={3} title="Testimonials">
                        Tab 3 content
                    </Tab>
                    <Tab eventKey={4} title="Accommodation">
                        Tab 4 content
                    </Tab>
                </Tabs>
            </Modal.Body>
        </Modal>
    );
};

export default withStyles(s)(MediaViewerModal);
