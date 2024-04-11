import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./HostToday.css";
import {
    Button,
    Grid,
    Row,
    Col,
    Form,
    FormGroup,
    FormControl,
    ControlLabel,
    Carousel,
} from "react-bootstrap";

// Translation
import {FormattedMessage, injectIntl} from "react-intl";

//local
import messages from "../../../locale/messages";

import image from "./image.png";
import NavLink from "../../NavLink";
import {connect} from 'react-redux';

class HostToday extends React.Component {
    render() {
        const {isAuthenticated} = this.props;
        return (
            <div>
                <h1 className={s.sectionTitle}>Become a Host Today!</h1>
                <div className={s.bg}>
                    <div className={s.hostWrapper}>
                        <h3 className={s.hostTitle}>
                            Whether you have an entire property, private room, a B&B, or run a retreat we'd love for you
                            to join us!
                        </h3>
                        <h5 className={s.hostSubtitle}>
                            Support the plant-based community and our planet. Listing on Vegvisits is 100% free.
                        </h5>

                        {
                            isAuthenticated ? (
                                <NavLink to="/become-a-host?mode=new">
                                    <Button className={s.btnList}>
                                        <span>Become a Host</span>
                                    </Button>
                                </NavLink>
                            ) : (
                                <NavLink to="/whyhost">
                                    <Button className={s.btnList}>
                                        <span>Become a Host</span>
                                    </Button>
                                </NavLink>
                            )
                        }

                    </div>
                </div>
            </div>
        );
    }
}

const mapState = (state) => ({
    isAuthenticated: state.runtime.isAuthenticated,
});

const mapDispatch = {};

export default withStyles(s)(connect(mapState, mapDispatch)(HostToday));
