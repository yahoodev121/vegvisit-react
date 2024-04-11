import React, {Component} from 'react';
import PropTypes from 'prop-types';
import DropzoneComponent from 'react-dropzone-component';
import cx from 'classnames';
import {Col} from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '!isomorphic-style-loader!css-loader!./filepicker.css';

import {connect} from 'react-redux';
import {change} from 'redux-form';
import {startLocationUploaderLoader, endLocationUploaderLoader} from '../../../../actions/siteadmin/manageLocationImage';
import { changeExt } from 'upath';
import { maxUploadSize } from '../../../../config';
import { toastr } from 'react-redux-toastr';

class Dropzone extends Component {

    static propTypes = {
        startLocationUploaderLoader: PropTypes.any.isRequired,
        endLocationUploaderLoader: PropTypes.any.isRequired,
    };

    static defaultProps = {
        data: null,
    };

    constructor(props) {
        super(props);
        this.success = this.success.bind(this);
        this.addedfile = this.addedfile.bind(this);
        this.dropzone = null;
    }

    async success(file, fromServer) {
        const {doUploadLocation, change} = this.props;
        let fileName = fromServer.file.filename;
        // let oldPicture = data.image != null ? data.image : null;
        let filePath = fromServer.file.path;
        let image = fileName;
        // doUploadLocation(image, filePath, oldPicture, data.id);
        await change('AddPopularLocation', 'image', fileName);
    }

    addedfile(file, fromServer) {
        if (file.size > (1024 * 1024 * maxUploadSize)) {
            toastr.error('Maximum upload size exceeded! ', 'Try again with a smaller image file.');
            this.dropzone.removeFile(file);
        } else {
            const { startLocationUploaderLoader, endLocationUploaderLoader } = this.props;
            startLocationUploaderLoader();
            endLocationUploaderLoader();
        }
    }

    render() {
        const djsConfig = {
            dictDefaultMessage: 'Click Here to Upload Image',
            addRemoveLinks: false,
            uploadMultiple: false,
            maxFilesize: 10,
            acceptedFiles: 'image/jpeg,image/png',
            dictMaxFilesExceeded: 'Remove the existing image and try upload again',
            previewsContainer: false
        };
        const componentConfig = {
            iconFiletypes: ['.jpg', '.png'],
            postUrl: '/uploadLocation'
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
    startLocationUploaderLoader,
    endLocationUploaderLoader,
    change
};

export default withStyles(s)(connect(mapState, mapDispatch)(Dropzone));
