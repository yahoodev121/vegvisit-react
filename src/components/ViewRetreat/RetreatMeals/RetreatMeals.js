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


class RetreatMeals extends Component {

    constructor(props) {
        super(props);
        const listingRetreat = this.props.retreat.UserListing.listingRetreat;
        this.state = {
            data: {
                drinks: [],
                foods: [],
                meals: [],
            },
            ids: {
                foods: JSON.parse(listingRetreat.food),
                drinks: JSON.parse(listingRetreat.drink),
                meals: JSON.parse(listingRetreat.meal),
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
                }
            };
        }
    }

    render() {
        const { data } = this.state;
        return (
            <div className={cx(s.wFull, s.borderB, s.borderGray200, s.py4)}>
                <h4>Food</h4>
                <div className={s.pl4}>
                    <p className={cx(s.bold, s.mb1)}>Meals Provided</p>
                    <p className={s.mb1}>
                        {
                            data.meals.map(type => type.itemName).map(label =>
                                <span className={cx(s.itemsCenter, s.inlineFlex, s.mR3)}><div className={s.greenSpot} />{label}</span>
                            )
                        }
                    </p>
                    <p className={cx(s.bold, s.mb1)}>Food Type</p>
                    <p className={s.mb1}>
                        {
                            data.foods.map(type => type.itemName).map(label =>
                                <span className={cx(s.itemsCenter, s.inlineFlex, s.mR3)}><div className={s.greenSpot} />{label}</span>
                            )
                        }
                    </p>
                    <p className={cx(s.bold, s.mb1)}>Drinks Provided</p>
                    <p className={s.mb1}>
                        {
                            data.drinks.map(type => type.itemName).map(label =>
                                <span className={cx(s.itemsCenter, s.inlineFlex, s.mR3)}><div className={s.greenSpot} />{label}</span>
                            )
                        }
                    </p>
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

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(RetreatMeals)));
