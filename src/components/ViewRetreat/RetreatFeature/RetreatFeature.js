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


class RetreatFeature extends Component {

    constructor(props) {
        super(props);
        const listingRetreat = this.props.retreat.UserListing.listingRetreat;
        this.state = {
            data: {
                category: null,
                drinks: [],
                foods: [],
                meals: [],
                retreatFor: [],
                retreatStyle: null,
                skillLevels: [],
                subCategory: [],
                yogaTypes: [],
            },
            ids: {
                category: listingRetreat.category,
                subCategory: JSON.parse(listingRetreat.subCategory),
                retreatStyle: listingRetreat.RetreatStyle,
                retreatFor: JSON.parse(listingRetreat.atmospheres),
                skillLevels: JSON.parse(listingRetreat.skillLevels),
                foods: JSON.parse(listingRetreat.food),
                drinks: JSON.parse(listingRetreat.drink),
                meals: JSON.parse(listingRetreat.meal),
                yogaTypes: JSON.parse(listingRetreat.yogaTypes),
            }
        };
    }

    static getDerivedStateFromProps(props, state) {
        const listingFields = props.listingFields;
        const { ids } = state;
        if (listingFields) {
            return {
                data: {
                    drinks: ids.drinks ? listingFields.retreatDrink.filter(type => ids.drinks.includes(type.id)) : [],
                    foods: ids.foods ? listingFields.retreatFood.filter(type => ids.foods.includes(type.id)) : [],
                    meals: ids.meals ? listingFields.retreatMeal.filter(type => ids.meals.includes(type.id)) : [],
                    retreatFor: ids.retreatFor ? listingFields.atmosphere.filter(type => ids.retreatFor.includes(type.id)) : [],
                    retreatStyle: ids.retreatStyle ? listingFields.retreatStyle.find(type => type.id == ids.retreatStyle).itemName : '',
                    skillLevels: ids.skillLevels ? listingFields.skillLevel.filter(type => ids.skillLevels.includes(type.id)) : [],
                    // TODO
                    // category: listingFields.retreatStyle.find(type => type.id == ids.category).itemName,
                    // subCategory: listingFields.skillLevel.filter(type => ids.subCategory.includes(type.id)),
                    yogaTypes: ids.yogaTypes ? listingFields.yogaType.filter(type => ids.yogaTypes.includes(type.id)) : [],
                }
            };
        }
    }

    render() {
        const { data } = this.state;
        return (
            <div className={cx(s.wFull, s.borderB, s.borderGray200, s.py4)}>
                <h4>Features</h4>
                <div className={s.pl4}>
                    {/*/ TODO Category and Subcategory */}
                    <p className={cx(s.bold, s.mb1)}>Style</p>
                    <p className={s.mb1}>{data.retreatStyle}</p>
                    <p className={cx(s.bold, s.mb1)}>Retreat For</p>
                    <p className={s.mb1}>{data.retreatFor.map(type => type.itemName).join(", ")}</p>
                    <p className={cx(s.bold, s.mb1)}>Yoga Style</p>
                    <p className={s.mb1}>{data.yogaTypes.map(type => type.itemName).join(", ")}</p>
                    <p className={cx(s.bold, s.mb1)}>Skill Level</p>
                    <p className={s.mb1}>{data.skillLevels.map(type => type.itemName).join(", ")}</p>
                    <p className={cx(s.bold, s.mb1)}>Food / Drink</p>
                    <p className={s.mb1}>{[...data.foods.map(type => type.itemName), ...data.drinks.map(type => type.itemName)].join(", ")}</p>
                    <p className={cx(s.bold, s.mb1)}>Meals included</p>
                    <p className={s.mb1}>{data.meals.map(type => type.itemName).join(", ")}</p>
                </div>
            </div>
        );
    }
};

const mapState = (state) => ({
    ...state,
    listingFields: state.listingFields.data
});

const mapDispatch = {
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(RetreatFeature)));
