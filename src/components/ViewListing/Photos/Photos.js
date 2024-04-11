import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

// Redux
import { connect } from 'react-redux';

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Photos.css';
import { Button } from 'react-bootstrap';
import cx from 'classnames';

// Component
import ListCoverPhoto from '../../ListCoverPhoto';
import ListGridCoverPhoto from '../../ListGridCoverPhoto';
import ImageSlider from '../ImageSlider';
import WishListIcon from '../../WishListIcon';

// Redux Action
import { openImageLightBox, closeImageLightBox } from '../../../actions/ImageLightBox';
import { setStickyTop } from '../../../actions/Sticky/StrickyActions';
import { openSocialShareModal, closeSocialShareModal } from '../../../actions/modalActions';

// Translation
import { FormattedMessage } from 'react-intl';

// Locale
import messages from '../../../locale/messages';

import ListDefaultPhoto from '../../ListDefaultPhoto';
import SocialShareModal from '../SocialShareModal';
import * as FontAwesome from 'react-icons/lib/fa';

// Helpers
import { listingBaseUrl } from '../../../helpers/cdnImages'


class Photos extends React.Component {
  static propTypes = {
    listPhotos: PropTypes.array,
    coverPhoto: PropTypes.number,
    openImageLightBox: PropTypes.any.isRequired,
    closeImageLightBox: PropTypes.any.isRequired,
    imageLightBox: PropTypes.bool.isRequired,
    formatMessage: PropTypes.any,
  };

  static defaultProps = {
    listPhotos: [],
    imageLightBox: false
  }

  constructor(props) {
    super(props);
    this.state = {
      sources: []
    }
  }

  componentDidMount() {
    const { data, setStickyTop } = this.props;
    let sticky = document.querySelector('[data-sticky-top]'), stickyHeight = 412;

    if (data.listPhotos != null && data.listPhotos.length > 0) {
      let sources = this.compilePhotoSources(data);
      this.setState({ sources });
    }

    stickyHeight = (sticky.getBoundingClientRect().height + 10);
    setStickyTop(stickyHeight);
  }

  compilePhotoSources(data) {
    let sources = [];
    let sourceObject = {};

    if (data.coverPhoto != undefined && data.coverPhoto != null) {

      data.listPhotos.map((item, key) => {
        if (item.id === data.coverPhoto) {
          sourceObject = {};
          sourceObject['src'] = listingBaseUrl() + 'x_large_' + item.name;
          // sourceObject['src'] = `/images/listing/${item.name}`;
          sources.push(sourceObject);
        }
      });

      data.listPhotos.map((item, key) => {
        if (item.id != data.coverPhoto) {
          sourceObject = {};
          sourceObject['src'] = listingBaseUrl() + 'x_large_' + item.name;
          // sourceObject['src'] = `/images/listing/${item.name}`;
          sources.push(sourceObject);
        }
      });

    } else {
      data.listPhotos.map((item, key) => {
        sourceObject = {};
        sourceObject['src'] = listingBaseUrl() + 'x_large_' + item.name;
        // sourceObject['src'] = `/images/listing/${item.name}`;
        sources.push(sourceObject);
      });
    }
    return sources;
  }

  componentDidUpdate(prevProps, prevState) {
    const { data, setStickyTop } = this.props;
    let sticky = document.querySelector('[data-sticky-top]'), stickyHeight = 412;

    if (data.listPhotos != null && data.listPhotos.length > 0) {
      let sources = this.compilePhotoSources(data);
      if (!_.isEqual(sources, this.state.sources)) {
        this.setState({ sources });
      }
    }

    stickyHeight = (sticky.getBoundingClientRect().height + 10);
    setStickyTop(stickyHeight);
  }

  render() {
    const { sources } = this.state;
    const { data, openImageLightBox, closeImageLightBox, imageLightBox, openSocialShareModal, closeSocialShareModal, loading } = this.props;


    let coverPhoto = data.coverPhoto;
    let listPhotos = data.listPhotos;
    let wishListStatus = data.wishListStatus;
    let isListOwner = data.isListOwner;

    return (
      <div className={s.bannerContainer} data-sticky-top>
      <SocialShareModal listId={data.id} title={data.title} city={data.city} state={data.state} country={data.country}/>
        <ImageSlider
          imageLightBox={imageLightBox}
          closeImageLightBox={closeImageLightBox}
          sources={sources}
        />

        {
          listPhotos && listPhotos.length == 0 && <ListDefaultPhoto
            className={s.bannerImage}
            coverPhoto={coverPhoto}
            listPhotos={listPhotos}
            photoType={"xx_large"}
            bgImage
          >
          </ListDefaultPhoto>
        }
        <a 
          onClick={openImageLightBox}
        >

          {
            // listPhotos && listPhotos.length > 0 && listPhotos.length <= 3 && <ListCoverPhoto
            listPhotos && listPhotos.length > 0 && listPhotos.length <= 3 && <ListCoverPhoto
              className={s.bannerImage}
              coverPhoto={coverPhoto}
              listPhotos={listPhotos}
              //sources={sources}
              photoType={"xx_large"}
              bgImage
            >
              {
                listPhotos && listPhotos.length > 0 && <Button
                  className={cx(s.btn, s.viewPhotosBtn)}
                  onClick={openImageLightBox}
                >
                  <FormattedMessage {...messages.viewPhotos} />
                </Button>
              }
            </ListCoverPhoto>
          }

          {
            // listPhotos && listPhotos.length > 0 && listPhotos.length > 3 &&
            // <ListGridCoverPhoto
            sources && sources.length > 0 && sources.length > 3 &&
            <ListGridCoverPhoto
              className={s.bannerImage}
              coverPhoto={coverPhoto}
              //listPhotos={listPhotos}
              listPhotos={sources}
              photoType={"xx_large"}
              bgImage
            >
            </ListGridCoverPhoto >

          }
        </a>
        {
          sources && sources.length > 0 && <div><Button
            className={cx(s.btn, s.viewPhotosBtn)}
            onClick={openImageLightBox}
          >
            <FormattedMessage {...messages.viewPhotos} />
          </Button>
          </div>
        }
       
        {
          !isListOwner && !loading && <WishListIcon type="button" listId={data.id} key={data.id} isChecked={wishListStatus} />
        }
         {
          <div
          className={s.buttonContainer}
          onClick={openSocialShareModal}
        >
          <FontAwesome.FaSignOut className={s.wishListIcon} />
         <span className={s.paddingleft10}>Share </span>
        </div>
        }
      </div>
    );
  }
}

const mapState = (state) => ({
  imageLightBox: state.viewListing.imageLightBox
});

const mapDispatch = {
  openImageLightBox,
  closeImageLightBox,
  setStickyTop,
  openSocialShareModal
};

export default withStyles(s)(connect(mapState, mapDispatch)(Photos));
