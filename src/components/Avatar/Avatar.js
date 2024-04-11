// General
import React from 'react';
import PropTypes from 'prop-types';
import { graphql, gql, compose } from 'react-apollo';

// Redux
import { connect } from 'react-redux';

// Asset
import defaultPic from './defaultPic.png';
// import avatar1 from './avatar1.png';
import avatar2 from './avatar2.png';
import avatar3 from './avatar3.png';
import avatar4 from './avatar4.png';
import avatar5 from './avatar5.png';
import avatar6 from './avatar6.png';
import avatar7 from './avatar7.png';
import avatar8 from './avatar8.png';
import avatar9 from './avatar9.png';
import avatar10 from './avatar10.png';
import avatar11 from './avatar11.png';
import avatar12 from './avatar12.png';
import avatar13 from './avatar13.png';

import cx from 'classnames';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Avatar.css';

// Component 
import Link from '../Link';

// Helpers
import { avatarBaseUrl}  from '../../helpers/cdnImages'


class Avatar extends React.Component {
  static propTypes = {
    source: PropTypes.string,
    title: PropTypes.string,
    height: PropTypes.number,
    width: PropTypes.number,
    className: PropTypes.string,
    withLink: PropTypes.bool,
    profileId: PropTypes.number,
    linkClassName: PropTypes.string,
    profilePictureData: PropTypes.shape({
      loading: PropTypes.bool,
      account: PropTypes.shape({
        picture: PropTypes.string
      })
    }),
    isUser: PropTypes.bool,
    type: PropTypes.string,
    staticImage: PropTypes.bool,
    useRandomPicture: PropTypes.bool
  };

  static defaultProps = {
    source: null,
    height: 100,
    width: 100,
    profileId: null,
    withLink: false,
    profilePictureData: {
      loading: true,
      userAccount: {
        picture: null
      }
    },
    isUser: false,
    type: 'medium',
    staticImage: false,
    useRandomPicture: false
  }

  constructor (props) {
		super(props);

    if (props.useRandomPicture) {
      const avatarImgArray = [
        // avatar1,
        avatar2,
        avatar3,
        avatar4,
        avatar5,
        avatar6,
        avatar7,
        avatar8,
        avatar9,
        avatar10,
        avatar11,
        avatar12,
        avatar13
      ]
      this.defaultPic = avatarImgArray[Math.floor(Math.random() * avatarImgArray.length)];
    } else {
      this.defaultPic = defaultPic;
    }
	}

  render() {
    const {
      source,
      title,
      height,
      width,
      className,
      withLink,
      linkClassName,
      profileId,
      profilePictureData: {
        loading, userAccount
      },
      isUser,
      type,
      staticImage
    } = this.props;

    const path = avatarBaseUrl() + type + '_';
    let imgSource = this.defaultPic;

    if (isUser) {
      if (staticImage) {
        imgSource = source !== null ? source : this.defaultPic;
      } else if (!loading && userAccount != null) {
        imgSource = userAccount.picture !== null ? path + userAccount.picture : this.defaultPic;
      }
    } else {
      if (staticImage) {
        imgSource = source !== null ? source : this.defaultPic;
      } else {
        imgSource = source !== null ? path + source : this.defaultPic;
      }
    }

    if (withLink) {
      return (

        <a href={"/users/show/" + profileId} target="_blank" className={linkClassName}>
          <img src={imgSource} className={cx(s.imgBackground, className, 'reviewProfile')} alt={title} height={height} width={width} />
        </a>
      );
    } else {
      return (
        <img src={imgSource} className={cx(s.imgBackground, className, 'reviewProfile')} alt={title} height={height} width={width} />
      );
    }

  }
}

export default compose(
  withStyles(s),
  graphql(gql`
      query {
          userAccount {
              picture
          }
      }
    `,
    {
      name: 'profilePictureData',
      options: (props) => ({
        skip: !props.isUser,
        ssr: false
      })
    }),
)(Avatar);


