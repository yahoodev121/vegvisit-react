// Redux Form
import { SubmissionError } from 'redux-form';

// Fetch request
import fetch from '../../core/fetch';

// Locale
import messages from '../../locale/messages';

// Redux Action
import { getListingData } from '../../actions/getListing';
import { getListingDataStep2 } from '../../actions/getListingDataStep2';
import { manageListingSteps } from '../../actions/manageListingSteps';
import { getListingFieldsValues } from '../../actions/getListingFieldsValues';
import { setLoaderStart, setLoaderComplete } from '../../actions/loader/loader';

// For Redirect
import history from '../../core/history';

import log from '../../helpers/clientLog';

async function updateStep2(values, dispatch) {
  log.debug(`components.ListPlaceStep1.updateStep2.updateStep2: Starting update step 2 with following data: ${JSON.stringify(values)}`);

  dispatch(setLoaderStart('updateListing'));
  const query = `query (
  	$id: Int,
    $description:String,
    $title:String,
    $kitchen:String,
    $nonVeg:String,
    $aboutPlaces:String,
    $aboutKitchen:String,
    $neighourhood:String,
    $notes:String,
    $services:[String],
    $moreDetails:String,
    $coverPhoto: Int,
    $photosSorting: [Int]
  ) {
      updateListingStep2 (
        id: $id,
        description:$description,
        kitchen:$kitchen,
        nonVeg:$nonVeg,
        aboutPlaces:$aboutPlaces,
        aboutKitchen:$aboutKitchen,
        neighourhood:$neighourhood,
        notes:$notes,
        services:$services,
        moreDetails:$moreDetails,
        title:$title,
        coverPhoto: $coverPhoto
        photosSorting: $photosSorting
      ) {
        status
      }
    }`;

  const resp = await fetch('/graphql', {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: query,
      variables: values
    }),
    credentials: 'include'
  }).catch((error) => {
    log.error(`components.ListPlaceStep1.updateStep2.updateStep2: Error fetching the updateListingStep2 data. Message: ${error.message}, Error: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
  });

  const { data } = await resp.json().catch((error) => {
    log.error(`components.ListPlaceStep1.updateStep2.updateStep2: Error reading the updateListingStep2 data. Message: ${error.message}, Error: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
  });

  log.debug(`components.ListPlaceStep1.updateStep2.updateStep2: Updated listing ${values.id}. Result: ${JSON.stringify(data)}.`);

  if (data && data.updateListingStep2 && data.updateListingStep2.status == "success") {
    log.debug(`components.ListPlaceStep1.updateStep2.updateStep2: Updated listing ${values.id} successfully.`);
    await dispatch(getListingDataStep2(values.id));
    log.debug(`components.ListPlaceStep1.updateStep2.updateStep2: Dispatched getListingDataStep2 for listing ${values.id}.`);
    await dispatch(manageListingSteps(values.id, 2));
    log.debug(`components.ListPlaceStep1.updateStep2.updateStep2: Dispatched manageListingSteps (2) for listing ${values.id}.`);
    await dispatch(getListingFieldsValues("3", values.id));
    log.debug(`components.ListPlaceStep1.updateStep2.updateStep2: Dispatched getListingFieldsValues (3) for listing ${values.id}.`);
    await dispatch(setLoaderComplete('updateListing'));
    history.push('/become-a-host/' + values.id + '/home');
  } else if (data && data.updateListingStep2 && data.updateListingStep2.status == "notLoggedIn") {
    log.warn(`components.ListPlaceStep1.updateStep2.updateStep2: Listing ${values.id} not updated, not logged in.`);
    dispatch(setLoaderComplete('updateListing'));
    throw new SubmissionError({ _error: messages.notLoggedIn });
  } else {
    log.warn(`components.ListPlaceStep1.updateStep2.updateStep2: Listing ${values.id} not updated correctly, something went wrong. Result was ${JSON.stringify(data)}.`);
    dispatch(setLoaderComplete('updateListing'));
    throw new SubmissionError({ _error: messages.somethingWentWrong });
  }

}

export default updateStep2;
