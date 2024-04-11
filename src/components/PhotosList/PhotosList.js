import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {gql, graphql, compose} from 'react-apollo';

// Redux
import {connect} from 'react-redux';

// Redux Action
import {removeListPhotos} from '../../actions/manageListPhotos';

// Style
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './PhotosList.css';

// Component
import Loader from '../Loader';

// Helpers
import {listingBaseUrl} from '../../helpers/cdnImages'
import {change, reduxForm} from "redux-form";
import validate from "../ListRetreat/validate";
import submit from "../ListRetreat/submit";


class PhotosList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            photos: []
        }
    }
    static getDerivedStateFromProps(props, state) {
        const {formData, field, listId} = props;

        let photos = [];
        if (field == 'photos') {
            photos = formData.values.photos || [];
        } else if (field == 'teachers') {
            const formTeachers = formData.values.teachers;
            const data = formTeachers[listId];
            photos = data.photos;
        } else if (field == 'accommodations') {
            const formAccommodations = formData.values.accommodations;
            const data = formAccommodations[listId];
            photos = data.photos;
        }

        return {
            photos
        }
    }

    removePhoto = async (index) => {
        const {formData, dispatch, field} = this.props;
        if (field === 'photos') {
            let photos = formData.values.photos;
            photos.splice(index, 1);
            await dispatch(change('RetreatForm', 'photos', photos));
        } else if (field === 'accommodations') {
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
        } else if (field === 'teachers') {
            let formTeachers = formData.values.teachers;
            let data = formTeachers[listId];
            let photos = formTeachers[listId].photos;
            photos.splice(index, 1);
            data = {
                ...data,
                photos: photos
            }
            formTeachers[listId] = data;
            await dispatch(change('RetreatForm', 'teachers', formTeachers));
        }
    }

    render() {
        const {photos} = this.state;

        return (
            <div className={cx('row')}>
                {
                    photos && photos.map((item, key) => {
                        return (
                            <div key={key} className={cx('col-lg-4 col-md-4 col-sm-6 col-xs-12 text-center')}>
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

PhotosList = reduxForm({
    form: 'RetreatForm', // a unique name for this form
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
    validate,
    onSubmit: submit
})(PhotosList);

const mapState = (state) => ({
    formData: state.form.RetreatForm,
});

const mapDispatch = {
    removeListPhotos,
};

export default withStyles(s)(connect(mapState, mapDispatch)(PhotosList));
