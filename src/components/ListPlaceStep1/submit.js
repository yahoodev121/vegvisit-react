// Redux Form
import { SubmissionError } from 'redux-form';

// Fetch request
import fetch from '../../core/fetch';

// Locale
import messages from '../../locale/messages';
import { toastr } from 'react-redux-toastr';

// For Redirect
import history from '../../core/history';

// Redux Action
import { getListingData } from '../../actions/getListing';
import { manageListingSteps } from '../../actions/manageListingSteps';
import { setLoaderStart, setLoaderComplete } from '../../actions/loader/loader';

import log from '../../helpers/clientLog';

async function submit(values, dispatch) {

  let bedTypes = JSON.stringify(values.bedTypes);

  let variables = Object.assign({}, values, { bedTypes });

  const checkMapQuery = `
    query ($address: String) {
      locationItem(address: $address) {
        lat
        lng
        timeZone
        status
      }
    }
  `;
  let address = `${values.street},${values.city},${values.state},${values.zipcode},${values.country},`;

  const mapResp = await fetch('/graphql', {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: checkMapQuery,
      variables: { address }
    }),
    credentials: 'include'
  }).catch((error) => {
    log.error(`components.ListPlaceTep1.submit.submit: Error fetching the locationItem data. Message: ${error.message}, Error: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
  });
  const checkMapResponse = await mapResp.json().catch((error) => {
    log.error(`components.ListPlaceTep1.submit.submit: Error reading the locationItem data. Message: ${error.message}, Error: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
  });
  log.debug(`components.ListPlaceTep1.submit.submit: Fetched locationItem data: ${JSON.stringify(checkMapResponse)}.`);

  if (checkMapResponse && checkMapResponse.data && checkMapResponse.data.locationItem && checkMapResponse.data.locationItem.status !== 200) {
    toastr.error("Invalid Address!", "Your address seems to be invalid, please go back to edit your address!");
    return;
  } else {
    dispatch(setLoaderStart('location'));

    variables.lat = checkMapResponse.data.locationItem.lat;
    variables.lng = checkMapResponse.data.locationItem.lng;
    variables.timeZone = checkMapResponse.data.locationItem.timeZone;

    const query = `query (
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
    $lat:Float,
    $lng:Float,
    $timeZone:String,
    $bedTypes: String,
    $experienceCategory: String,
  ) {
      createListing (
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
        zipcode: $zipcode,
        lat: $lat,
        lng: $lng,
        timeZone: $timeZone,
        bedTypes: $bedTypes,
        experienceCategory: $experienceCategory
      ) {
        status
        id
      }
    }`;

    log.debug(`components.ListPlaceTep1.submit.submit: Calling createListing with following data: ${JSON.stringify(variables)}.`);

    const resp = await fetch('/graphql', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: query,
        variables: variables
      }),
      credentials: 'include'
    }).catch((error) => {
      log.error(`components.ListPlaceTep1.submit.submit: Error fetching the createListing data. Message: ${error.message}, Error: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
    });
    const { data } = await resp.json().catch((error) => {
      log.error(`components.ListPlaceTep1.submit.submit: Error reading the createListing data. Message: ${error.message}, Error: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
    });
    log.debug(`components.ListPlaceTep1.submit.submit: Fetched createListing data: ${JSON.stringify(data)}.`);

    if (data.createListing && data.createListing.status == "success" && data.createListing.id) {
      await dispatch(getListingData(data.createListing.id)).catch((error) => {
        log.error(`components.ListPlaceTep1.submit.submit: Error dispatching getListingData for Listing ${data.createListing.id}. Message: ${error.message}, Error: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
      });
      log.debug(`components.ListPlaceTep1.submit.submit: Dispatched getListingData for Listing ${data.createListing.id}.`);
      await dispatch(manageListingSteps(data.createListing.id, 1)).catch((error) => {
        log.error(`components.ListPlaceTep1.submit.submit: Error dispatching manageListingSteps for Listing ${data.createListing.id}. Message: ${error.message}, Error: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
      });
      log.debug(`components.ListPlaceTep1.submit.submit: Dispatched manageListingSteps for Listing ${data.createListing.id}.`);
      history.push(data.createListing.id + '/map');
      dispatch(setLoaderComplete('location'));
      await dispatch(setLoaderComplete('location'));
    } else if (data.createListing && data.createListing.status == "notLoggedIn") {
      log.warn(`components.ListPlaceTep1.submit.submit: createListing status: Not logged in.`);
      await dispatch(setLoaderComplete('location'));
      throw new SubmissionError({ _error: messages.notLoggedIn });
    } else if (data.createListing && data.createListing.status == "adminLoggedIn") {
      log.warn(`components.ListPlaceTep1.submit.submit: createListing status: Admin logged in.`);
      await dispatch(setLoaderComplete('location'));
      throw new SubmissionError({ _error: messages.adminLoggedIn });
    } else {
      log.error(`components.ListPlaceTep1.submit.submit: createListing status: Something went wrong.`);
      await dispatch(setLoaderComplete('location'));
      throw new SubmissionError({ _error: messages.somethingWentWrong });
    }
  }

}

export default submit;
