import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

// Assets
import mediumNoImage from './medium_no_image.png';
import largeNoImage from './large_no_image.jpeg';

// Helper
import { popularLocationBaseUrl } from '../../helpers/cdnImages'


class ListPopularLocationPhoto extends React.Component {
  static propTypes = {
    coverPhoto: PropTypes.number,
    listPhotos: PropTypes.array,
    className: PropTypes.string,
    bgImage: PropTypes.bool
  };

  static defaultProps = {
    bgImage: false
  }

  constructor(props){
    super(props);

    const { listPhotos } = props;
    let activePhoto = null;
    if(listPhotos != undefined) {
      activePhoto = listPhotos;
    }
    this.state = {
        photo: activePhoto
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { listPhotos } = props;
    if(listPhotos != undefined && !_.isEqual(listPhotos, state.photo)) {
      return { photo: listPhotos }
    } else {
      return null;
    }
  }
  
  render() {
    const { className, photoType, bgImage ,listPhotos} = this.props;
    const { photo } = this.state;
    let path = '', source;
    if(listPhotos != null){
        source = photo;
        path = popularLocationBaseUrl() + 'medium_';
    } else {
        source = mediumNoImage;
    }

    if(bgImage) {
        return (
            <div className={className} style={{backgroundImage: `url(${path}${source})`}}>
                {this.props.children}
            </div>
        );
    } else {
        return (
            <img src={path + source} className={className} />
        );
    }

    
  }
}

export default ListPopularLocationPhoto;
