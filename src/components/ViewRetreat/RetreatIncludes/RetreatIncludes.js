import React, {Component} from 'react';
import { listingBaseUrl } from '../../../helpers/cdnImages'
import {
    Button, Image,
} from "react-bootstrap";
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from '../../../index.css';
import * as FontAwesome from 'react-icons/lib/fa';
// Redux
import { connect } from 'react-redux';
import {injectIntl} from "react-intl";


class RetreatIncludes extends Component {

    constructor(props) {
        super(props);

        this.state = {
            includes: [],
            notIncludes: [],
            includeIDs: this.props.includes,
            notIncludeIDs: this.props.notIncludes,
        };
    }

    static getDerivedStateFromProps(props, state) {
        const { listingFields } = props;

        if (listingFields && listingFields.retreatIncluded && listingFields.retreatNotIncluded) {
            let retreatIncluded = listingFields.retreatIncluded;
            let retreatNotIncluded = listingFields.retreatNotIncluded;
            return {
                includes: state.includeIDs ? retreatIncluded.filter(type => state.includeIDs.includes(type.id)): [],
                notIncludes: state.notIncludeIDs ? retreatNotIncluded.filter(type => state.notIncludeIDs.includes(type.id)) : [],
            };
        } else {
            return null;
        }
    }

    render() {
        const { includes, notIncludes } = this.state;
        return (
            <div className={cx(s.wFull, s.flex, s.gap4, s.borderB, s.borderGray200, s.py4)}>
                <div className={cx(s.flex, s.flexColumn)}>
                    <h4>What's Included In This Package</h4>
                    {
                        includes.map((include, index) =>
                            <p className={cx(s.inlineFlex, s.pl4, s.mb1)} key={index}><FontAwesome.FaCheck className={s.icon} />{include.itemName}</p>
                        )
                    }
                </div>
                <div className={cx(s.flex, s.flexColumn)}>
                    <h4>What's Not Included In This Package</h4>
                    {
                        notIncludes.map((notInclude, index) =>
                            <p className={cx(s.inlineFlex, s.pl4, s.mb1)} key={index}><FontAwesome.FaClose className={s.icon} />{notInclude.itemName}</p>
                        )
                    }
                </div>
            </div>
        );
    }
};

const mapState = (state) => ({
    listingFields: state.listingFields.data
});

const mapDispatch = {
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(RetreatIncludes)));
