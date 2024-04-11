// General
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// GraphQL
import { graphql, gql, compose } from 'react-apollo';

// Redux Form
import { Field, reduxForm } from 'redux-form';

// Redux
import { connect } from 'react-redux';

// Translation
import { injectIntl, FormattedMessage } from 'react-intl';
import cx from 'classnames';

// Locale
import messages from '../../../locale/messages';

import { openAddWishListGroupModal } from '../../../actions/WishList/modalActions';
import { deleteWishListGroup } from '../../../actions/WishList/deleteWishListGroup';

// GraphQL
import getWishListGroupQuery from './getWishListGroup.graphql';

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
    Grid,
    Button,
    Form,
    Row,
    FormGroup,
    Col,
    ControlLabel,
    FormControl
} from 'react-bootstrap';
import s from './EditWishListGroup.css';

import Confirm from 'react-confirm-bootstrap';

// Components
import Loader from '../../../components/Loader';
import Link from '../../Link';
import WishListGroupModal from '../WishListGroupModal';
import ListingItem from '../ListingItem';

class EditWishListComponent extends React.Component {
    static propTypes = {
        data: PropTypes.shape({
            loading: PropTypes.bool,
            getWishListGroup: PropTypes.any
        }),
    };

    static defaultProps = {
        data: {
            loading: true
        },
    }

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        history.push('/siteadmin/popularlocation/add')
    }

    render() {
        const { profileId, wishListId } = this.props;
        const { data: { loading, getWishListGroup } } = this.props;
        const { formatMessage } = this.props.intl;
        const { openAddWishListGroupModal, deleteWishListGroup } = this.props;

        let initialValues = {};

        if (getWishListGroup && getWishListGroup.id) {
            initialValues = {
                id: getWishListGroup.id,
                name: getWishListGroup.name,
                isPublic: getWishListGroup.isPublic,
                userId: getWishListGroup.userId
            };
        }

        return (
            <div>
                <WishListGroupModal actionType={'edit'} />
                <Grid fluid>
                    {
                        loading && <Col xs={12} sm={12} md={12} lg={12}>
                            <Loader type="text" />
                        </Col>
                    }
                    {
                        !loading && getWishListGroup && <Col xs={12} sm={12} md={12} lg={12} className={cx(s.landingContent, s.noPadding)}>
                            <Col xs={12} sm={12} md={12} lg={12} className={cx(s.noPadding, s.space2)}>
                                <Col xs={12} sm={6} md={6} lg={6} className={s.space2}>
                                    <Link to={"/wishlists"} className={cx(s.modalCaptionLink, s.modalCaptionLinkLarge)}>
                                        {formatMessage(messages.goToAllLists)}
                                    </Link>
                                </Col>
                                <Col xs={12} sm={6} md={6} lg={6}>
                                    <div>
                                        <Button className={cx(s.button, s.btnPrimary, s.btnlarge, s.pullRight, s.noMargin)}
                                            onClick={() => openAddWishListGroupModal(initialValues, 'EditWishListGroupForm')}>
                                            <FormattedMessage {...messages.editWishList} />
                                        </Button>
                                    </div>
                                    <div>
                                        <Confirm
                                            onConfirm={() => deleteWishListGroup(getWishListGroup.id)}
                                            // onConfirm={deleteWishListGroup(getWishListGroup.id)}
                                            body={formatMessage(messages.areYouSureDeleteWishList)}
                                            confirmText={formatMessage(messages.confirmDelete)}
                                            title={formatMessage(messages.wishList)}
                                        >
                                            <a href="javascript:void(0)"
                                                className={cx(s.modalCaptionLink, s.modalCaptionLinkLarge, s.pullRight, s.noMargin, s.paddingRight)}>
                                                <FormattedMessage {...messages.deleteWishList} />
                                            </a>
                                        </Confirm>
                                    </div>
                                </Col>
                            </Col>
                            <Col xs={12} sm={8} md={8} lg={8}>
                                <h2 className={s.landingTitle}>
                                    {
                                        getWishListGroup.name
                                    }
                                </h2>
                            </Col>
                            {
                                !loading && getWishListGroup && <Col xs={12} sm={12} md={12} lg={12}>
                                    {
                                        getWishListGroup.wishListCount > 0 && getWishListGroup.wishLists && getWishListGroup.wishLists.length > 0 && <div className={s.landingContentTitle}>
                                            <FormattedMessage {...messages.yourHomes} />
                                            <label className={cx(s.pullRight)}>
                                                <small>{getWishListGroup.wishListCount} {getWishListGroup.wishListCount > 1 ? formatMessage(messages.homes) : formatMessage(messages.home)}</small>
                                            </label>
                                        </div>
                                    }
                                    {
                                        getWishListGroup.wishLists && getWishListGroup.wishLists.length > 0 && getWishListGroup.wishListCount > 0 && <Row>
                                            {
                                                getWishListGroup.wishLists.map((item, index) => {
                                                    if (item.listData != null) {
                                                        return (
                                                            <Col lg={4} md={4} sm={4} xs={12} key={index}>
                                                                <ListingItem
                                                                    id={item.listData.id}
                                                                    basePrice={item.listData.listingData.basePrice}
                                                                    currency={item.listData.listingData.currency}
                                                                    title={item.listData.title}
                                                                    beds={item.listData.beds}
                                                                    personCapacity={item.listData.personCapacity}
                                                                    roomType={item.listData.settingsData[0].listsettings.itemName}
                                                                    coverPhoto={item.listData.coverPhoto}
                                                                    listPhotos={item.listData.listPhotos}
                                                                    bookingType={item.listData.bookingType}
                                                                    reviewsCount={item.listData.reviewsCount}
                                                                    reviewsStarRating={item.listData.reviewsStarRating}
                                                                />
                                                            </Col>
                                                        )
                                                    }
                                                })
                                            }
                                        </Row>
                                    }
                                    {
                                        getWishListGroup && getWishListGroup.wishListCount == 0 && <Row>
                                            <Col lg={12} md={12} sm={12} xs={12}>
                                                <h3>{formatMessage(messages.noWishlistsHomes)}</h3>
                                            </Col>
                                        </Row>
                                    }
                                </Col>
                            }
                        </Col>
                    }
                </Grid>
            </div>
        )
    }
}

const mapState = (state) => ({
});

const mapDispatch = {
    openAddWishListGroupModal,
    deleteWishListGroup
};

export default compose(
    injectIntl,
    withStyles(s),
    connect(mapState, mapDispatch),
    graphql(getWishListGroupQuery,
        {
            options: (props) => ({
                variables: {
                    profileId: props.profileId,
                    id: props.wishListId
                },
                fetchPolicy: 'network-only',
            })
        }
    )
)(EditWishListComponent);
