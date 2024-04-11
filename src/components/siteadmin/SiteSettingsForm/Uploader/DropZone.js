import React, {Component} from 'react';
import PropTypes from 'prop-types';
import DropzoneComponent from 'react-dropzone-component';
import cx from 'classnames';
import {Col} from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '!isomorphic-style-loader!css-loader!./filepicker.css';

import {connect} from 'react-redux';
import {startLogoUploaderLoader, doUploadLogo, doRemoveLogo} from '../../../../actions/siteadmin/manageLogo';

class Dropzone extends Component {

    static propTypes = {
        doUploadLogo: PropTypes.any.isRequired,
        doRemoveLogo: PropTypes.any.isRequired,
        startLogoUploaderLoader: PropTypes.any.isRequired,
    };

    static defaultProps = {
        data: null
    };

    constructor(props) {
        super(props);
        this.success = this.success.bind(this);
        this.addedfile = this.addedfile.bind(this);
        this.dropzone = null;
    }

    success(file, fromServer) {
        const {doUploadLogo, data} = this.props;
        let fileName = fromServer.file.filename;
        let oldPicture = data != null ? data.value : null;
        let filePath = fromServer.file.path;
        doUploadLogo(fileName, filePath, oldPicture);
    }

    addedfile(file, fromServer) {
        const { startLogoUploaderLoader } = this.props;
        startLogoUploaderLoader();
    }

    render() {
        const djsConfig = {
            dictDefaultMessage: 'Click Here to Upload Logo',
            addRemoveLinks: false,
            uploadMultiple: false,
            maxFilesize: 10,
            acceptedFiles: 'image/jpeg,image/png',
            dictMaxFilesExceeded: 'Remove the existing image and try upload again',
            previewsContainer: false
        };
        const componentConfig = {
            iconFiletypes: ['.jpg', '.png'],
            postUrl: '/uploadLogo'
        };
        const eventHandlers = {
            init: dz => this.dropzone = dz,
            success: this.success,
            addedfile: this.addedfile
        };

        return (
            <div>
                <DropzoneComponent
                    config={componentConfig}
                    eventHandlers={eventHandlers}
                    djsConfig={djsConfig} 
                /> 
            </div>
        );
    }
}

const mapState = (state) => ({
});

const mapDispatch = {
    doUploadLogo,
    doRemoveLogo,
    startLogoUploaderLoader
};

export default withStyles(s)(connect(mapState, mapDispatch)(Dropzone));
