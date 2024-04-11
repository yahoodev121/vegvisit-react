// Action
import { updateStaticPageAction } from '../../../actions/siteadmin/updateStaticPage';

// Toaster
import {toastr} from 'react-redux-toastr';
async function submit(values, dispatch) {
   if (values.content == null || values.content == '<p><br></p>' || values.content == '<p> </p>') {
    toastr.error("Error Occured", "Please Add  Content");
  }
  else {
    await dispatch(updateStaticPageAction(values)) ;
  }

}

export default submit;
