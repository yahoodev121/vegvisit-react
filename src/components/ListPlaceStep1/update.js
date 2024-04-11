// Redux Form
import { SubmissionError } from 'redux-form';

// Fetch request
import fetch from '../../core/fetch';

// Locale
import messages from '../../locale/messages';


// Redux Action
import { getListingData } from '../../actions/getListing';
import { manageListingSteps } from '../../actions/manageListingSteps';
import { getListingFieldsValues } from '../../actions/getListingFieldsValues';
import { setLoaderStart, setLoaderComplete } from '../../actions/loader/loader';

// For Redirect
import history from '../../core/history';

import log from '../../helpers/clientLog';

async function update(values, dispatch) {

  let bedTypes = JSON.stringify(values.bedTypes);
  let variables = Object.assign({}, values, { bedTypes });

  log.debug(`components.ListPlaceStep1.update.update: Starting update with following data: ${JSON.stringify(variables)}`);

  dispatch(setLoaderStart('updateListing'));
  const query = `query (
  	$id: Int,
    $roomType:String,
    $houseType:String,
    $residenceType:String,
    $bedrooms:String,
    $buildingSize:String,
    $bedType:String,
    $beds:Int,
    $personCapacity:Int,
    $bathrooms:Float,
    $bathroomType:String,
    $country:String,
    $street:String,
    $buildingName:String,
    $city:String,
    $state:String,
    $zipcode:String,
  	$lat: Float,
  	$lng: Float,
    $isMapTouched: Boolean,
    $timeZone:String,
    $amenities: [Int],
    $safetyAmenities: [Int],
    $spaces: [Int],
    $bedTypes: String,
  ) {
      updateListing (
        id: $id,
        roomType:$roomType,
        houseType:$houseType,
        residenceType: $residenceType,
        bedrooms: $bedrooms,
        buildingSize: $buildingSize
        bedType: $bedType
        beds: $beds
        personCapacity: $personCapacity
        bathrooms: $bathrooms
        bathroomType: $bathroomType
        country: $country
        street: $street
        buildingName: $buildingName
        city: $city
        state: $state
        zipcode: $zipcode
        lat: $lat
        lng: $lng
        isMapTouched: $isMapTouched,
        timeZone: $timeZone,
        amenities: $amenities,
        safetyAmenities: $safetyAmenities,
        spaces: $spaces,
        bedTypes: $bedTypes,
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
      variables
    }),
    credentials: 'include'
  }).catch((error) => {
    log.error(`components.ListPlaceStep1.update.update: Error fetching the updateListing data. Message: ${error.message}, Error: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
  });

  const { data } = await resp.json().catch((error) => {
    log.error(`components.ListPlaceStep1.update.update: Error reading the updateListing data. Message: ${error.message}, Error: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
  });

  log.debug(`components.ListPlaceStep1.update.update: Updated listing ${values.id}. Result: ${JSON.stringify(data)}.`);

  if (data && data.updateListing && data.updateListing.status == "success") {
    log.debug(`components.ListPlaceStep1.update.update: Updated listing ${values.id} successfully.`);
    await dispatch(getListingData(values.id));
    log.debug(`components.ListPlaceStep1.update.update: Dispatched getListingData for listing ${values.id}.`);
    await dispatch(manageListingSteps(values.id, 1));
    log.debug(`components.ListPlaceStep1.update.update: Dispatched manageListingSteps (1) for listing ${values.id}.`);
    await dispatch(getListingFieldsValues("2", values.id));
    log.debug(`components.ListPlaceStep1.update.update: Dispatched getListingFieldsValues (2) for listing ${values.id}.`);
    await dispatch(setLoaderComplete('updateListing'));

    history.push('/become-a-host/' + values.id + '/home');
  } else if (data && data.updateListing && data.updateListing.status == "notLoggedIn") {
    log.warn(`components.ListPlaceStep1.update.update: Listing ${values.id} not updated, not logged in.`);
    dispatch(setLoaderComplete('updateListing'));
    throw new SubmissionError({ _error: messages.notLoggedIn });
  } else {
    log.warn(`components.ListPlaceStep1.update.update: Listing ${values.id} not updated correctly, something went wrong. Result was ${JSON.stringify(data)}.`);
    dispatch(setLoaderComplete('updateListing'));
    throw new SubmissionError({ _error: messages.somethingWentWrong });
  }

}

export default update;
