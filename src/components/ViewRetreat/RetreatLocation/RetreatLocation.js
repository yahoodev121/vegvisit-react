import React from 'react';
import { listingBaseUrl } from '../../../helpers/cdnImages';
import {
    Button, Image,
} from "react-bootstrap";
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from '../../../index.css';
import * as FontAwesome from 'react-icons/lib/fa';
import ReactGoogleMapLoader from "react-google-maps-loader";
import {googleMapAPI} from "../../../config";
import MapResults from "../../SearchListing/MapResults";

const RetreatLocation = (props) => {
    const { retreat, initialFilter, searchSettings } = props;

    return (
        <div className={cx(s.wFull, s.borderB, s.borderGray200, s.py4)}>
            <h4>Location Information</h4>
            <div className={cx(s.wFull, s.flex, s.gap4)}>
                <div className={cx(s.flex1)} dangerouslySetInnerHTML={{ __html: retreat.UserListing.listingRetreat.localInfoDesc }} />
                <div
                    className={s.searchMapContainer}
                >
                    <ReactGoogleMapLoader
                        params={{
                            key: googleMapAPI, // Define your api key here
                            libraries: "places,geometry,markerwithlabel"// To request multiple libraries, separate them with a comma
                        }}
                        render={googleMaps =>
                            googleMaps && (
                                <MapResults initialFilter={initialFilter} searchSettings={searchSettings} />
                            )}
                    />
                </div>
            </div>
        </div>
    );
};

export default withStyles(s)(RetreatLocation);
