import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ProgressBar, Button } from 'react-bootstrap';
import {
  FacebookShareButton,
  GooglePlusShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  GooglePlusIcon,
  LinkedinIcon,
  EmailIcon,
} from 'react-share';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './SocialShare.css';

import { url } from '../../../config';
import { CopyToClipboard } from 'react-copy-to-clipboard';
class SocialSharing extends React.Component {

    static propTypes = {
        listId: PropTypes.number.isRequired
    };

    render() {
        const { listId } = this.props;
        const shareUrl = url + '/rooms/' + listId;
        
        return (
            <div className={cx(s.textCenter, s.mobileBorder)}>
                <FacebookShareButton
                    url={shareUrl}
                    className={s.displayIcon}>
                    <FacebookIcon
                        size={34}
                        round />
                </FacebookShareButton>
                <TwitterShareButton
                    url={shareUrl}
                    className={s.displayIcon}>
                    <TwitterIcon
                        size={34}
                        round />
                </TwitterShareButton>
                <GooglePlusShareButton
                    url={shareUrl}
                    className={s.displayIcon}>
                    <GooglePlusIcon
                        size={34}
                        round />
                </GooglePlusShareButton>
                <LinkedinShareButton
                    url={shareUrl}
                    className={s.displayIcon}>
                    <LinkedinIcon
                        size={34}
                        round />
                </LinkedinShareButton>
              
            </div>
        )
    }
}


export default withStyles(s)(SocialSharing);
