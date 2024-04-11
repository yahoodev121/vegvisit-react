import fetch from '../core/fetch';

export async function checkAvailableDates(listId, startDate, endDate) {
  let query = `query checkReservation ($checkIn: String!, $checkOut: String!, $listId: Int! ){
    checkReservation(checkIn: $checkIn, checkOut:$checkOut, listId:$listId ){
      id
      listId
      hostId
      guestId
      checkIn
      checkOut
      status
    }
  }`;

  const params = {
      listId: listId,
      checkIn: startDate,
      checkOut: endDate,
  };

  const resp = await fetch('/graphql', {
      method: 'post',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          query,
          variables: params,
      }),
      credentials: 'include',
  });

  // const { data } = await resp.json();
  const respJson = await resp.json();
  const data = respJson.data;
  
  if (data && data.checkReservation) {
    if (data.checkReservation.status === "200") {
      console.log(`helpers.checkAvailableDates.checkAvailableDates: Dates are available for Listing ${listId} from ${startDate} to ${endDate}`);
      return true;
    } else {
      if (data.checkReservation.status === "blocked") {
        console.log(`helpers.checkAvailableDates.checkAvailableDates: Result of checking available dates for ${listId} from ${startDate} to ${endDate} was: ${data.checkReservation.status}`);
      } else {
        console.log(`helpers.checkAvailableDates.checkAvailableDates: Result of checking available dates for ${listId} from ${startDate} to ${endDate} was: ${data.checkReservation.status}`);
      }
    }
  }
  return false;
}