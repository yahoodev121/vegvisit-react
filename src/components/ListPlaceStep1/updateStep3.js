// Redux Form
import { SubmissionError } from 'redux-form';

// Fetch request
import fetch from '../../core/fetch';

// Locale
import messages from '../../locale/messages';

// Redux Action
import { getListingData } from '../../actions/getListing';
import { getListingDataStep3 } from '../../actions/getListingDataStep3';
import { manageListingSteps } from '../../actions/manageListingSteps';
import { setLoaderStart, setLoaderComplete } from '../../actions/loader/loader';
import { openGetEmailsModal } from '../../actions/modalActions';

// For Redirect
import history from '../../core/history';

import log from '../../helpers/clientLog';

async function updateStep3(values, dispatch) {

  const weeklyDiscount = values.weeklyDiscount != '' ? values.weeklyDiscount : 0;
  const monthlyDiscount = values.monthlyDiscount != '' ? values.monthlyDiscount : 0;
  const cleaningPrice = values.cleaningPrice != '' ? values.cleaningPrice : 0;
  const maxNight = values.maxNight > 0 ? values.maxNight : '';
  const variables = Object.assign({}, values, { weeklyDiscount, monthlyDiscount, cleaningPrice, maxNight });

  log.debug(`components.ListPlaceStep1.updateStep3.updateStep3: Starting update step 3 with following data: ${JSON.stringify(variables)}`);

  dispatch(setLoaderStart('updateListing'));
  const query = `query (
  	$id: Int,
    $houseRules: [Int],
    $bookingNoticeTime:String,
    $checkInStart:String,
    $checkInEnd:String,
    $maxDaysNotice:String,
    $minNight:String,
    $maxNight:String,
    $basePrice:Float,
    $securityDeposit:Float,
    $cleaningPrice:Float,
    $currency:String,
    $weeklyDiscount:Int,
    $monthlyDiscount:Int,
    $bookingType: String!,
    $cancellationPolicy: Int,
    $additionalRules:String
  ) {
      updateListingStep3 (
        id: $id,
        houseRules: $houseRules,
        bookingNoticeTime:$bookingNoticeTime,
        checkInStart:$checkInStart,
        checkInEnd:$checkInEnd,
        maxDaysNotice:$maxDaysNotice,
        minNight:$minNight,
        maxNight:$maxNight,
        basePrice:$basePrice,
        securityDeposit:$securityDeposit,
        cleaningPrice:$cleaningPrice,
        currency:$currency,
        weeklyDiscount:$weeklyDiscount,
        monthlyDiscount:$monthlyDiscount,
        bookingType: $bookingType,
        cancellationPolicy: $cancellationPolicy
        additionalRules:$additionalRules
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
    log.error(`components.ListPlaceStep1.updateStep3.updateStep3: Error fetching the updateListingStep3 data. Message: ${error.message}, Error: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
  });

  const { data } = await resp.json().catch((error) => {
    log.error(`components.ListPlaceStep1.updateStep3.updateStep3: Error reading the updateListingStep3 data. Message: ${error.message}, Error: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
  });

  log.debug(`components.ListPlaceStep1.updateStep3.updateStep3: Updated listing ${values.id}. Result: ${JSON.stringify(data)}.`);

  if (data && data.updateListingStep3 != undefined) {
    if (data.updateListingStep3.status == "success") {
      log.debug(`components.ListPlaceStep1.updateStep3.updateStep3: Updated listing ${values.id} successfully.`);
      await dispatch(getListingDataStep3(values.id));
      log.debug(`components.ListPlaceStep1.updateStep3.updateStep3: Dispatched getListingDataStep3 for listing ${values.id}.`);
      await dispatch(manageListingSteps(values.id, 3));
      log.debug(`components.ListPlaceStep1.updateStep3.updateStep3: Dispatched manageListingSteps (3) for listing ${values.id}.`);
      await dispatch(setLoaderComplete('updateListing'));
      await dispatch(openGetEmailsModal());
      history.push('/become-a-host/' + values.id + '/home');
    } else if (data.updateListingStep3.status == "notLoggedIn") {
      log.warn(`components.ListPlaceStep1.updateStep3.updateStep3: Listing ${values.id} not updated, not logged in.`);
      dispatch(setLoaderComplete('updateListing'));
      throw new SubmissionError({ _error: messages.notLoggedIn });
    } else {
      log.warn(`components.ListPlaceStep1.updateStep3.updateStep3: Listing ${values.id} not updated correctly, something went wrong. Result was ${JSON.stringify(data)}.`);
      dispatch(setLoaderComplete('updateListing'));
      throw new SubmissionError({ _error: messages.somethingWentWrong });
    }
  } else {
    log.warn(`components.ListPlaceStep1.updateStep3.updateStep3: Listing ${values.id} not updated correctly, something went wrong. Result was ${JSON.stringify(data)}.`);
    dispatch(setLoaderComplete('updateListing'));
    throw new SubmissionError({ _error: messages.somethingWentWrong });
  }

}

export default updateStep3;
