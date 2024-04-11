// General
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './WishListModal.css';
import {
  Button,
  Form,
  FormGroup,
  Col,
  FormControl,
  Checkbox,
  Modal } from 'react-bootstrap';

// Redux
import { connect } from 'react-redux';
import { closeWishListModal } from '../../actions/WishList/modalActions';

// Components
import SocialLogin from '../SocialLogin';
import WishListModalForm from '../WishListModalForm';
import Link from '../Link';
import Loader from '../Loader';

import ListDetails from './ListDetails';

import CreateWishList from './CreateWishList';

// Translation
import { FormattedMessage } from 'react-intl';

// Locale
import messages from '../../locale/messages';

// GraphQL
import { graphql, gql, compose } from 'react-apollo';

// Query
import getWishListGroupQuery from './getAllWishListGroup.graphql';

class WishListModal extends Component {
  static propTypes = {
    closeWishListModal: PropTypes.any,
    wishListModal: PropTypes.bool,
    formatMessage: PropTypes.any,
    data: PropTypes.shape({
      loading: PropTypes.bool,
      getAllWishListGroup: PropTypes.any
    })
  };

  static defaultProps = {
    data: {
      loading: true
    },
  } 

  constructor(props) {
    super(props);
    this.state = {
      wishListModalStatus: false,
    };
  }

  componentDidMount() {
    const { wishListModal } = this.props;
    if (wishListModal === true) {
      this.setState({ wishListModalStatus: true });
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { wishListModal } = props;
    if (wishListModal === true && !state.wishListModalStatus) {
      return { wishListModalStatus: true };
    } else if (!wishListModal && state.wishListModalStatus) {
      return { wishListModalStatus: false };
    } else {
      return null;
    }
  }

  render() {
    const { closeWishListModal, data, data: { loading, getAllWishListGroup }, profileId, listId } = this.props;
    const { wishListModalStatus } = this.state;
    let wishListGroups = [];
    if (getAllWishListGroup && getAllWishListGroup.count > 0) {
      getAllWishListGroup.wishListGroupData.map((option, index) => {
        if (option.wishListIds.indexOf(listId) !== -1) {
          wishListGroups.push(option.id);
        }
      });  
    }

    let initialValues = {
      listId,
      wishListGroups
    };
    return (
      <div>
        <Modal show={wishListModalStatus} animation={false} onHide={closeWishListModal} dialogClassName={cx(s.logInModalContainer, 'loginModal', 'wishListCloseBtn')} >
          <Modal.Header closeButton>
          </Modal.Header>
          <Modal.Body bsClass={s.logInModalBody}>   
            <div className={cx(s.wishListTitle, s.wishListTitlePadding)}>
                <span><FormattedMessage {...messages.wishLists} /></span>
            </div>               
            <div className={s.root}>
              <div className={s.container}>
                <CreateWishList initialValues={initialValues}/> 
                {
                  loading && <Col xs={12} sm={12} md={12} lg={12}>
                    <Loader type="text" />
                  </Col>
                }
                {
                  !loading && <WishListModalForm data={data} initialValues={initialValues} />
                }  
              </div>
            </div>
          </Modal.Body>
          <div className={s.footerContainer}>
            <a href={'/rooms/' + listId} target="_blank" className={s.linkContainer}>
                <ListDetails initialValues={initialValues}/>
            </a>
          </div>
        </Modal>
      </div>
    );
  }
}


const mapState = state => ({
  wishListModal: state.modalStatus.wishListModalOpen,
  profileId: state.account.data.profileId,
  listId: state.modalStatus.listId
});

const mapDispatch = {
  closeWishListModal
};

export default compose(
  withStyles(s),
  connect(mapState, mapDispatch),
  graphql(getWishListGroupQuery,
    {
      options: (props) => ({
        variables: {
          profileId: props.profileId
        },
        fetchPolicy: 'network-only'
      })
    }
  )

)(WishListModal);
