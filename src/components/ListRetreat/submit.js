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
import { setLoaderStart, setLoaderComplete } from '../../actions/loader/loader';

import log from '../../helpers/clientLog';

async function submit(values, dispatch) {
  console.log('form-submit:', values);
  let variables = Object.assign({}, values, { listType: "Retreats" });

  if (!variables.benefits || (variables.benefits && variables.benefits.length < 4)) {
    toastr.error('Validation Error!', "Please select at least 4 benefits");
    return;
  }

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

    variables.lat = checkMapResponse.data.locationItem.lat;
    variables.lng = checkMapResponse.data.locationItem.lng;
    variables.timeZone = checkMapResponse.data.locationItem.timeZone;

    dispatch(setLoaderStart('createListingRetreat'));
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
      $title: String,
      $listType: String,
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
          title: $title,
          listType: $listType,
        ) {
          status
          id
        }
      }`;

    log.debug(`components.ListPlaceTep1.submit.submit: Calling createListing with following data: ${JSON.stringify(variables)}.`);

    if (!variables.listId) {
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
      variables.listId = data.createListing.id;
    }

    variables.accommodations = JSON.stringify(variables.accommodations)
    variables.teachers = JSON.stringify(variables.teachers)
    variables.categories = JSON.stringify(variables.categories)
    // variables.subCategory = JSON.stringify(variables.subCategory)
    variables.atmospheres = JSON.stringify(variables.atmospheres)
    variables.RetreatStyle = JSON.stringify(variables.RetreatStyle)
    variables.yogaTypes = JSON.stringify(variables.yogaTypes)
    variables.skillLevels = JSON.stringify(variables.skillLevels)
    variables.benefits = JSON.stringify(variables.benefits)
    variables.includes = JSON.stringify(variables.includes)
    variables.not_includes = JSON.stringify(variables.not_includes)
    variables.meal = JSON.stringify(variables.meal)
    variables.drink = JSON.stringify(variables.drink)
    variables.food = JSON.stringify(variables.food)
    variables.retreat_dates = JSON.stringify(variables.retreat_dates)
    variables.addons = JSON.stringify(variables.addons)
    variables.localInformation = JSON.stringify(variables.localInformation)
    variables.facilityFeatures = JSON.stringify(variables.facilityFeatures)
    variables.photos = JSON.stringify(variables.photos)
    if (variables.listId) {
      const query1 = `query (
        $listId: Int,
        $accommodations: String,
        $teachers: String,
        $categories: String,
        $eventType: String,
        $category: String,
        $title: String,
        $location: String,
        $country: String,
        $street: String,
        $city: String,
        $state: String,
        $zipcode: String,
        $lat: String,
        $lng: String,
        $subCategory: String,
        $RetreatStyle: String,
        $atmospheres: String,
        $yogaTypes: String,
        $skillLevels: String,
        $languageId: Int,
        $benefits: String,
        $summary: String,
        $reviews: String,
        $includes: String,
        $not_includes: String,
        $special: String,
        $full_description: String,
        $instagram_url: String,
        $meal: String,
        $drink: String,
        $food: String,
        $basePrice: String,
        $currency: String,
        $retreat_dates: String,
        $duration: Int,
        $showType: Int,
        $min_days: Int,
        $Seats: Int,
        $isAllowPayment: Boolean,
        $isCash: Boolean,
        $addons: String,
        $cancellationPolicy: String,
        $allow_flexibility: String,
        $use_increase_booking: String,
        $free_gift_name: String,
        $free_gift_desc: String,
        $itinerary: String,
        $localInfoDesc: String,
        $localInformation: String,
        $facilityFeatures: String,
        $seasonalInformation: String,
        $travelHelp: String,
        $photos: String,
      ) {
          createListingRetreat (
            listId: $listId,
            accommodations: $accommodations,
            teachers: $teachers,
            eventType: $eventType,
            category: $category,
            categories: $categories,
            title: $title,
            location: $location,
            country: $country,
            street: $street,
            city: $city,
            state: $state,
            zipcode: $zipcode,
            lat: $lat,
            lng: $lng,
            subCategory: $subCategory,
            RetreatStyle: $RetreatStyle,
            atmospheres: $atmospheres,
            yogaTypes: $yogaTypes,
            skillLevels: $skillLevels,
            languageId: $languageId,
            benefits: $benefits,
            summary: $summary,
            reviews: $reviews,
            showType: $showType,
            includes: $includes,
            not_includes: $not_includes,
            special: $special,
            full_description: $full_description,
            instagram_url: $instagram_url,
            meal: $meal,
            drink: $drink,
            food: $food,
            basePrice: $basePrice,
            currency: $currency,
            retreat_dates: $retreat_dates,
            duration: $duration,
            min_days: $min_days,
            Seats: $Seats,
            isAllowPayment: $isAllowPayment,
            isCash: $isCash,
            addons: $addons,
            cancellationPolicy: $cancellationPolicy,
            allow_flexibility: $allow_flexibility,
            use_increase_booking: $use_increase_booking,
            free_gift_name: $free_gift_name,
            free_gift_desc: $free_gift_desc,
            itinerary: $itinerary,
            localInfoDesc: $localInfoDesc,
            localInformation: $localInformation,
            facilityFeatures: $facilityFeatures,
            seasonalInformation: $seasonalInformation,
            travelHelp: $travelHelp,
            photos: $photos
          ) {
            id
          }
        }`;
      const resp = await fetch('/graphql', {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: query1,
          variables//: { ...variables, categories: variables.category, listId: data.createListing.id }
        }),
        credentials: 'include'
      }).catch((error) => {
        log.error(`create listing retreat: Error fetching the createListing data. Message: ${error.message}, Error: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
      });
      const { data } = await resp.json().catch((error) => {
        log.error(`create listing retreat: Error reading the createListing data. Message: ${error.message}, Error: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
      });
      if (data.createListingRetreat && data.createListingRetreat.id) {
        toastr.success("Retreat is created successfully!");
        dispatch(setLoaderComplete('createListingRetreat'));
        history.push('/s?listType=retreats');
      }
    } else {
      log.error(`Something went wrong.`);
      throw new SubmissionError({ _error: messages.somethingWentWrong });
    }
  }

}

export default submit;
