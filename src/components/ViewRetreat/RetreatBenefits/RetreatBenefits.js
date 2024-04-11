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


class RetreatBenefits extends Component {

    constructor(props) {
        super(props);

        this.state = {
            benefits: [],
            benefitIDs: this.props.benefits
        };
    }

    static getDerivedStateFromProps(props, state) {
        const { listingFields } = props;

        if (listingFields && listingFields.benefitType && listingFields.benefitType.length > 0) {
            let benefitTypes = listingFields.benefitType;
            return { benefits: benefitTypes.filter(type => state.benefitIDs.includes(type.id))};
        } else {
            return null;
        }
    }

    render() {
        const { benefits } = this.state;
        return (
            <div className={cx(s.wFull, s.borderB, s.borderGray200, s.py4)}>
                <h4>Retreat Highlights</h4>
                <ul>
                    {
                        benefits.map(benefit =>
                            <li key={benefit.id}>{ benefit.otherItemName }</li>
                        )
                    }
                </ul>
            </div>
        );
    }
};

const mapState = (state) => ({
    listingFields: state.listingFields.data
});

const mapDispatch = {
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(RetreatBenefits)));
