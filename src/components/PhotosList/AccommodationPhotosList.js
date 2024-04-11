import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {gql, graphql, compose} from 'react-apollo';

// Redux
import {connect} from 'react-redux';
import {change, reduxForm} from "redux-form";

// Style
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './PhotosList.css';

// Component
import Loader from '../Loader';

// Helpers
import {listingBaseUrl} from '../../helpers/cdnImages'
import validate from "../ListRetreat/validate";
import submit from "../ListRetreat/submit";


class AccommodationPhotosList extends Component {

    removePhoto = async (index) => {
        const {formData, listId, dispatch} = this.props;
        let formAccommodations = formData.values.accommodations;
        let data = formAccommodations[listId];
        let photos = formAccommodations[listId].photos;
        photos.splice(index, 1);
        data = {
            ...data,
            photos: photos
        }
        formAccommodations[listId] = data;
        await dispatch(change('RetreatForm', 'accommodations', formAccommodations));
    }

    render() {
        const {listId, formData} = this.props;
        const formAccommodations = formData.values.accommodations;
        const data = formAccommodations[listId];
        const photos = data.photos;

        if (!photos && photos.length === 0) {
            return (
                <div className={cx('row')}>
                </div>
            )
        }

        return (
            <div className={cx('row')}>
                {
                    photos && photos.map((item, key) => {
                        return (
                            <div key={item.name} className={cx('col-lg-4 col-md-4 col-sm-6 col-xs-12 text-center')}>
                                <div className={s.listPhotoCover}>
                                    <div className={s.listPhotoMedia}>
                                        <img className={s.imgResponsive}
                                             src={listingBaseUrl() + 'x_medium_' + item.name}/>
                                    </div>
                                </div>
                                <a href="javascript:void(0);" onClick={() => {
                                    this.removePhoto(key)
                                }}>
                                    Remove file
                                </a>
                            </div>
                        );

                    })
                }
            </div>
        );
    }

}

AccommodationPhotosList = reduxForm({
    form: 'RetreatForm', // a unique name for this form
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
    validate,
    onSubmit: submit
})(AccommodationPhotosList);

const mapState = (state) => ({
    formData: state.form.RetreatForm,
});

const mapDispatch = {};

export default withStyles(s)(connect(mapState, mapDispatch)(AccommodationPhotosList));
