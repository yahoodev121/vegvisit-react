import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Lightbox from 'react-images';

class ImageSlider extends Component {

  static propTypes = {
  };

  constructor(props) {
    super(props);
    this.state = {
      lightboxIsOpen: false,
      currentImage: 0,
      sources: []
    };
    this.closeLightbox = this.closeLightbox.bind(this);
		this.gotoNext = this.gotoNext.bind(this);
		this.gotoPrevious = this.gotoPrevious.bind(this);
    this.gotoImage = this.gotoImage.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    const { imageLightBox, sources } = props;
    const returnObj = {};

    if(imageLightBox != undefined && imageLightBox !== state.lightboxIsOpen){
      returnObj.lightboxIsOpen = imageLightBox;
    }
    if(sources != undefined && !_.isEqual(sources, state.sources)) {
      returnObj.sources = sources;
    }

    if (Object.getOwnPropertyNames(returnObj).length > 0) {
      return returnObj;
    } else {
      return null;
    }
  }

  openLightbox (index, event) {
		event.preventDefault();
		this.setState({
			currentImage: index,
			lightboxIsOpen: true,
		});
	}

	closeLightbox () {
    const { closeImageLightBox } = this.props;
    closeImageLightBox();
		this.setState({
			currentImage: 0,
			lightboxIsOpen: false,
		});
	}
	gotoPrevious () {
		this.setState({
			currentImage: this.state.currentImage - 1,
		});
	}

	gotoNext () {
		this.setState({
			currentImage: this.state.currentImage + 1,
		});
	}

  gotoImage (index) {
		this.setState({
			currentImage: index,
		});
	}

  render() {
    const { lightboxIsOpen, currentImage, sources } = this.state;

    return (
      <div>
        <Lightbox
          images={sources}
          isOpen={lightboxIsOpen}
          currentImage={currentImage}
          onClickPrev={this.gotoPrevious}
          onClickNext={this.gotoNext}
          onClose={this.closeLightbox}
          onClickThumbnail={this.gotoImage}
          showThumbnails={true}
          showImageCount={true}
          showCloseButton={true}
          enableKeyboardInput={true}
        />
      </div>
    );
  }

}

export default ImageSlider;