
// Redux Form
import { SubmissionError } from 'redux-form';

// Redirection
import history from '../../../core/history';

// Fetch request
import fetch from '../../../core/fetch';

// Redux
import { getSearchResults, loadingSearchResults } from '../../../actions/getSearchResults';
import { showResults } from '../../../actions/mobileSearchNavigation';


async function submit(values, dispatch) {

  dispatch(loadingSearchResults());
  const query =
    `query(
      $category: [Int],
      $atmosphere: [Int],
      $retreatOptions: [Int],
      $retreatStyle: [Int],
      $skillLevel: [Int],
      $localInformation: [Int],
      $language: [Int],
      $listType: String,
      $personCapacity: Int,
      $dates: String,
      $currentPage: Int,
      $lat: Float,
      $lng: Float,
      $meal: [Int],
      $roomType: [Int],
      $houseType: [Int],
      $kitchenType: [String],
      $dietType: [Int],
      $bedrooms: Int,
      $bathrooms: Int,
      $beds: Int,
      $amenities: [Int],
      $spaces: [Int],
      $houseRules: [Int],
      $priceRange: [Int],
      $durationRange: [Int],
      $geography: String,
      $bookingType: String,
      $geoType: String,
      $searchByMap: Boolean,
      $sw_lat: Float,
      $sw_lng: Float,
      $ne_lat: Float,
      $ne_lng: Float,
      $petsAllowed: Boolean
    ){
      SearchListing(
        category: $category,
        atmosphere: $atmosphere,
        retreatOptions: $retreatOptions,
        retreatStyle: $retreatStyle,
        skillLevel: $skillLevel,
        language: $language,
        listType: $listType,
        localInformation: $localInformation,
        personCapacity: $personCapacity,
        dates: $dates,
        currentPage: $currentPage
        lat: $lat,
        lng: $lng,
        meal: $meal,
        roomType: $roomType,
        houseType: $houseType,
        kitchenType: $kitchenType,
        dietType: $dietType,
        bedrooms: $bedrooms,
        bathrooms: $bathrooms,
        beds: $beds,
        amenities: $amenities,
        spaces: $spaces,
        houseRules: $houseRules,
        priceRange: $priceRange,
        durationRange: $durationRange,
        geography: $geography,
        bookingType: $bookingType,
        geoType: $geoType,
        searchByMap: $searchByMap,
        sw_lat: $sw_lat,
        sw_lng: $sw_lng,
        ne_lat: $ne_lat,
        ne_lng: $ne_lng,
        petsAllowed: $petsAllowed
      ) {
        count
        results {
          id
          title
          personCapacity
          lat
          lng
          city
          state
          country
          beds
          coverPhoto
          bookingType
          reviewsCount,
          reviewsStarRating,
          kitchen,
          listPhotos {
            id
            name
            type
            status
          }
          listingData {
            basePrice
            currency
          }
          settingsData {
            listsettings {
              id
              itemName
              itemDescription
            }
          }
          listingRetreat {
            accommodations {
              type
              price
              deposit_percent
              description
              photos {
                name
                type
              }
            }
            teachers {
              name
              email
              is_yoga_alliance
              about
              photos {
                name
                type
              }
              location {
                country
                street
                buildingName
                city
                state
                zipCode
              }
            }
            eventType
            category
            title
            location
            country
            street
            city
            state
            zipcode
            lat
            lng
            subCategory
            RetreatStyle
            atmospheres
            yogaTypes
            skillLevels
            languageId
            benefits
            summary
            includes
            not_includes
            special
            full_description
            instagram_url
            meal
            drink
            food
            currency
            retreat_dates
            duration
            min_days
            isAllowPayment
            isCash
            addons
            cancellationPolicy
            allow_flexibility
            use_increase_booking
            free_gift_name
            free_gift_desc
            itinerary
            localInfoDesc
            localInformation
            facilityFeatures
            seasonalInformation
            travelHelp
          }
          wishListStatus
          isListOwner
          listType
          experienceCategory
        }
      }
    }
  `;

  console.log('SearchForm-submit:', values);

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
    credentials: 'include',
  });

  const { data } = await resp.json();

  if (data && data.SearchListing) {
    dispatch(getSearchResults(data.SearchListing));
    //dispatch(showResults());
  }

}

export default submit;
