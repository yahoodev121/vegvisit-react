import React, { Component } from 'react';
import { connect } from 'react-redux';
import DropzoneComponent from 'react-dropzone-component';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { toastr } from 'react-redux-toastr';

import AccommodationPhotosList from "../PhotosList/AccommodationPhotosList";

import {change, reduxForm} from "redux-form";

// Style
import s from '!isomorphic-style-loader!css-loader!../PhotosUpload/filepicker.css';

import { maxUploadSize } from '../../config';

import log from '../../helpers/clientLog';
import validate from "./validate";
import submit from "./submit";

class AccommodationPhotosUpload extends Component {

  constructor(props) {
    super(props);
    this.success = this.success.bind(this);
    this.complete = this.complete.bind(this);
    this.dropzone = null;
    this.addedfile = this.addedfile.bind(this);
    this.state = {
      djsConfig: {},
    }
  }

  componentDidMount() {
    const { placeholder } = this.props;
    const isBrowser = typeof window !== 'undefined';
    const isDocument = typeof document !== undefined;
    if (isBrowser && isDocument) {
      document.querySelector(".dz-hidden-input").style.visibility = 'visible';
      document.querySelector(".dz-hidden-input").style.opacity = '0';
      document.querySelector(".dz-hidden-input").style.height = '100%';
      document.querySelector(".dz-hidden-input").style.width = '100%';
      document.querySelector(".dz-hidden-input").style.cursor = 'pointer';
    }

    if (placeholder) {
      this.setState({
        djsConfig: {
          dictDefaultMessage: placeholder,
          addRemoveLinks: false,
          maxFilesize: 10,
          maxFiles: 20,
          acceptedFiles: 'image/jpeg,image/png',
          hiddenInputContainer: '.dzInputContainer',
          // dictFileTooBig: '',
        }
      });
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { placeholder } = props;

    if (placeholder && !(state.djsConfig && placeholder === state.djsConfig.dictDefaultMessage)) {
      return {
        djsConfig: {
          dictDefaultMessage: placeholder,
          addRemoveLinks: false,
          maxFilesize: 10,
          maxFiles: 20,
          acceptedFiles: 'image/jpeg,image/png',
          hiddenInputContainer: '.dzInputContainer',
          // dictFileTooBig: '',
        }
      };
    } else {
      return null;
    }
  }


  success(file, fromServer) {
    /*const { listId, createListPhotos } = this.props;
    const { files } = fromServer;
    let fileName = files[0].filename;
    let fileType = files[0].mimetype;
    // Calling Redux action to create a record for uploaded file
    if(listId != undefined) {
      createListPhotos(listId, fileName, fileType);
    }*/
  }

  addedfile(file) {
    const { djsConfig } = this.state;

    // not more than the size in the server config
    if (file.size > (1024 * 1024 * maxUploadSize)) {
      toastr.error('Maximum upload size exceeded! ', 'Try again with a smaller image file.');
      this.dropzone.removeFile(file);
    }
  }

  async complete(file) {
    const { listId, createListPhotos } = this.props;
    log.debug(`components.PhotosUpload.PhotosUpload.complete: Starting photo upload for following file: ${JSON.stringify(file.upload)}`);
    if (file && file.xhr) {
      try {
        const { files } = JSON.parse(file.xhr.response);
        log.debug(`components.PhotosUpload.PhotosUpload.complete: Starting photo upload, files array is: ${JSON.stringify(files)}`);
        let fileName = files[0].filename;
        let fileType = files[0].mimetype;
        log.debug(`components.PhotosUpload.PhotosUpload.complete: Starting photo upload with file name ${fileName} and file type ${fileType} for list id ${listId}: ${JSON.stringify(files[0])}`);

        const { formData, listId, dispatch } = this.props;
        let formAccommodations = formData.values.accommodations;
        let data = formAccommodations[listId];
        data = {
          ...data,
          photos: formAccommodations[listId].photos.push({
            name: fileName,
            type: fileType
          })
        }
        formAccommodations[listId] = data;
        await dispatch(change('RetreatForm', 'accommodations', formAccommodations));

        log.debug(`components.PhotosUpload.PhotosUpload.complete: Removing file now ...`);
        this.dropzone.removeFile(file);
        log.debug(`components.PhotosUpload.PhotosUpload.complete: Done.`);
      } catch (error) {
        log.error(`components.PhotosUpload.PhotosUpload.complete: Error uploading listing photos. Message: ${error.message}, Error: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`, error)
        toastr.error('File upload error', 'Please try again. If the error appears again please use a different file.');
      }
    }
  }

  render() {
    const { placeholder, listId } = this.props;
    const { djsConfig } = this.state;

    const componentConfig = {
      iconFiletypes: ['.jpg', '.png'],
      //showFiletypeIcon: true,
      postUrl: '/photos'
    };
    const eventHandlers = {
      init: dz => this.dropzone = dz,
      success: this.success,
      complete: this.complete,
      addedfile: this.addedfile
    };

    return (
        <div className={cx('listPhotoContainer')}>
          <div className={cx('dzInputContainer')}>
            <DropzoneComponent
                config={componentConfig}
                eventHandlers={eventHandlers}
                djsConfig={djsConfig}
            />
          </div>
          <div>
            Maximum upload size: 10MB <br></br><br></br>
          </div>

          <AccommodationPhotosList listId={listId} />
        </div>
    );
  }

}

AccommodationPhotosUpload = reduxForm({
  form: 'RetreatForm', // a unique name for this form
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
  onSubmit: submit
})(AccommodationPhotosUpload);

const mapState = (state) => ({
  formData: state.form.RetreatForm,
});

const mapDispatch = {
};

export default withStyles(s)(connect(mapState, mapDispatch)(AccommodationPhotosUpload));
