import {gql} from 'react-apollo';
import fetch from '../../core/fetch';
import {setSiteSettings} from '../siteSettings';

import {
  LOGO_UPLOAD_LOADER_START,
  LOGO_UPLOAD_START,
  LOGO_UPLOAD_SUCCESS,
  LOGO_UPLOAD_ERROR,
  REMOVE_LOGO_START, 
  REMOVE_LOGO_SUCCESS, 
  REMOVE_LOGO_ERROR,
  GET_LOGO_START,
  GET_LOGO_SUCCESS,
  GET_LOGO_ERROR 
} from '../../constants';

const query = gql`
  query getLogo{
    getLogo {
      id
      title
      name
      value
      type
    }
  }
`;

export function startLogoUploaderLoader() {
    return (dispatch, getState, {client}) => {
        dispatch({
            type: LOGO_UPLOAD_LOADER_START,
            payload: {
                logoUploaderLoading: true
            }
        });
    };
}

export function doUploadLogo(fileName, filePath, oldPicture) {

  return async (dispatch, getState, { client }) => {

    dispatch({ type: LOGO_UPLOAD_START });

    try {
        

        let mutation = gql`
          mutation uploadLogo($fileName: String, $filePath: String) {
            uploadLogo (fileName:$fileName, filePath: $filePath) {
              status
            }
          }
        `; 

        // Send Request to create a record for logo
        const {data} = await client.mutate({
            mutation,
            variables: {fileName, filePath},
            refetchQueries: [{ query }]
        });
        
        if(data){
          dispatch({
            type: LOGO_UPLOAD_SUCCESS,
            payload: {
              logoUploaderLoading: false
            }
          });
          dispatch(setSiteSettings());
          if(oldPicture != null){
            await removeLogoFile(oldPicture);
          }
          
        }
    } catch (error) {
        dispatch({
          type: LOGO_UPLOAD_ERROR,
          payload:{
            error,
            logoUploaderLoading: false
          }
        });
        
      return false;
    }

    return true;
  };

}


export function doRemoveLogo(fileName) {

  return async (dispatch, getState, { client }) => {

    dispatch({ type: REMOVE_LOGO_START });
    dispatch(startLogoUploaderLoader());

    try {

      let mutation = gql`
        mutation removeLogo{
          removeLogo{
            status
          }
        }
      `;

      // Send Request to create a record for logo
      const {data} = await client.mutate({
        mutation,
        refetchQueries: [{ query }]
      });

      if(data){
        dispatch({
          type: REMOVE_LOGO_SUCCESS,
          payload: {
            logoUploaderLoading: false
          }
        });
        dispatch(setSiteSettings());
        await removeLogoFile(fileName);
      }
      
    } catch (error) {
        dispatch({
          type: REMOVE_LOGO_ERROR,
          payload: {
            error,
            logoUploaderLoading: false
          }
        });
        
      return false;
    }

    return true;
  };

}

async function removeLogoFile(fileName) {
    try {
        const resp = await fetch('/removeLogoFile', {
          method: 'post',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              fileName
          }),
          credentials: 'include',
        });

        const { status } = await resp.json();

        if(status){
          console.log('status from remove logo file', status);
        }
        
    } catch (error) {
      console.log('error from remove file', error);
        
      return false;
    }

    return true;
}