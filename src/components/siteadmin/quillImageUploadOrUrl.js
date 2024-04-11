import {toastr} from 'react-redux-toastr';
import log from '../../helpers/clientLog';
import { url } from '../../config.js';

const insertToEditor = (imageUrl, quillRef) => {
  // push image url to rich editor.
  const range = quillRef.getEditor().getSelection();
  quillRef.getEditor().insertEmbed(range.index, 'image', imageUrl, "user");
}

const saveToServer = (file, quillRef) => {
  const fd = new FormData();
  fd.append('file', file);

  const xhr = new XMLHttpRequest();
  xhr.open('POST', `${url}/contentUpload`, true);
  xhr.onload = () => {
    if (xhr.status === 200) {
      const { status, files, url } = JSON.parse(xhr.responseText);
      log.info(`Image (${JSON.stringify(files)}) uploaded successfully with status: ${status}. Rersulting URL is ${url}`, xhr.responseText);
      insertToEditor(url, quillRef);
    } else {
      log.error(`src.components.siteadmin.quillImageUploadOrUrl.saveToServer: Saving new image to server failed. Status response: ${xhr.status}, response text: ${JSON.stringify(xhr.responseText)}`);
      toastr.error('Error', 'An error has occurred when uploading the image to the server. Status response was ' + xhr.status);
    }
  };
  xhr.send(fd);
}

const selectLocalImage = (quillRef) => {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.click();

  // Listen upload local image and save to server
  input.onchange = () => {
    const file = input.files[0];

    // file type is only image.
    if (/^image\//.test(file.type)) {
      saveToServer(file, quillRef);
    } else {
      toastr.warning('Image upload', `Only images are allowed. Your file type was ${file.type}`);
    }
  };
}

const quillImageUploadOrUrl = (quillRef) => {
  if (window.confirm('Do you want to upload a new image? Click "Cancel" if you want to specify a URL instead.')) {
    try {
      selectLocalImage(quillRef);
    } catch (error) {
      log.error(`src.components.siteadmin.quillImageUploadOrUrl.quillImageUploadOrUrl: Uploading a new image failed. Message: ${error.message}, Error: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
      toastr.error('Error', 'An error has occurred when trying to upload a new image: ' + error.message);
    }
  } else {
    try {
      const range = quillRef.getEditor().getSelection();
      const value = prompt('Please specify the image URL');
      if(value) {
          quillRef.getEditor().insertEmbed(range.index, 'image', value, "user");
      }
    } catch (error) {
      log.error(`src.components.siteadmin.quillImageUploadOrUrl.quillImageUploadOrUrl: Specifying a new image URL failed. Message: ${error.message}, Error: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
      toastr.error('Error', 'An error has occurred when trying to insert a new image URL: ' + error.message);
    }
  }
}

export default quillImageUploadOrUrl;