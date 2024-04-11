import {gql} from 'react-apollo';
// Toaster
import {toastr} from 'react-redux-toastr';
import {
  SITE_ADMIN_REMOVE_IMPORTED_REVIEWS_START,
  SITE_ADMIN_REMOVE_IMPORTED_REVIEWS_SUCCESS,
  SITE_ADMIN_REMOVE_IMPORTED_REVIEWS_ERROR 
} from '../../../constants';
import log from '../../../helpers/clientLog';

export function removeImportedReviews( listId, url ) {

  return async (dispatch, getState, { client }) => {

    dispatch({
      type: SITE_ADMIN_REMOVE_IMPORTED_REVIEWS_START,
    });

    try {
          const mutation = gql`
            mutation adminRemoveImportedReviews($listId:Int!, $url:String!) {
              adminRemoveImportedReviews (listId:$listId, url:$url) {
                status
                count
              }
            }
          `;
          // Send Request to delete imported reviews
          const {data} = await client.mutate({
            mutation,
            variables: {listId, url},
            // refetchQueries: [{ query: getAllListingsQuery, variables: { currentPage: 1 } }]
          });
        
          if(data && data.adminRemoveImportedReviews && data.adminRemoveImportedReviews.status === '200'){
            dispatch({
              type: SITE_ADMIN_REMOVE_IMPORTED_REVIEWS_SUCCESS,
            });
            if (data.adminRemoveImportedReviews.count > 0) {
              toastr.success("Success!", `${data.adminRemoveImportedReviews.count} imported reviews have been deleted successfully`);
            } else {
              toastr.info("Information", "There were no reviews found which should be deleted");
            }
          } else {
            dispatch({
              type: SITE_ADMIN_REMOVE_IMPORTED_REVIEWS_ERROR,
            });
            toastr.error("Error", "The imported reviews could not be deleted successfully");
          }
    } catch (error) {
        log.error(`actions.siteadmin.ListingManagement.removeImportedReviews.removeImportedReviews: An error occurred when trying to delete imported reviews for Listing ${listId} from url ${url}. Message: ${error.message}. Error: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
        dispatch({
          type: SITE_ADMIN_REMOVE_IMPORTED_REVIEWS_ERROR,
          payload:{
            error
          }
        });
        toastr.error("Error", "An error occurred when trying to delete the imported reviews");
      return false;
    }

    return true;
  };
}
