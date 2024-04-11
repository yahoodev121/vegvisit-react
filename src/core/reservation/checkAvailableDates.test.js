import moment from 'moment';
import 'moment-timezone';
import  { checkListingDatesValidity, checkReservationDatesValidity, checkAvailableDates } from './checkAvailableDates';

beforeAll(() => {
  
});

afterAll(() => {
  
});

test('Listing rules: Check 1 night stay without constraints to be valid', () => {
  let checkIn = moment('20230219T120000');
  let checkOut = moment('20230220T120000');
  const now = moment('20230218T120000');
  const checkDatesResult = checkListingDatesValidity(checkIn, checkOut, now, 30, null, null);
  console.log('checkDatesResult: ', checkDatesResult);

  expect(checkDatesResult.status).toBe(200);
});

test('Listing rules: Check 1 night stay when switching to DST using UTC time to be invalid when min nights is 1', () => {
  let checkIn = moment.utc('20230325T120000');
  console.log(`checkIn: ${checkIn.format()}`, checkIn);
  let checkOut = moment.utc('20230326T110000');
  console.log(`checkOut: ${checkOut.format()}`, checkOut);
  const now = moment.utc('20230218T120000');
  const checkDatesResult = checkListingDatesValidity(checkIn, checkOut, now, '3months', 1, null);
  console.log('checkDatesResult: ', checkDatesResult);

  expect(checkDatesResult.status).toBe('lessThanMinNights1');
});

test('Listing rules: Check 1 night stay when switching to DST using the correct time zone to be valid when min nights is 1', () => {
  let checkIn = moment.utc('20230325T120000').tz('Europe/Berlin');
  console.log(`checkIn: ${checkIn.format()}`, checkIn);
  let checkOut = moment.utc('20230326T110000').tz('Europe/Berlin');
  console.log(`checkOut: ${checkOut.format()}`, checkOut);
  const now = moment.utc('20230218T120000').tz('Europe/Berlin');
  const checkDatesResult = checkListingDatesValidity(checkIn, checkOut, now, '3months', 1, null);
  console.log('checkDatesResult: ', checkDatesResult);

  expect(checkDatesResult.status).toBe(200);
});

test('Genral validity: Check 1 night stay when switching to DST using UTC time to be invalid when min nights is 1', () => {
  let checkIn = moment.utc('20230325T120000');
  console.log(`checkIn: ${checkIn.format()}`, checkIn);
  let checkOut = moment.utc('20230326T110000');
  console.log(`checkOut: ${checkOut.format()}`, checkOut);
  const now = moment.utc('20230218T120000');
  const checkDatesResult = checkReservationDatesValidity(checkIn, checkOut, now, '3months', 1, null);
  console.log('checkReservationDatesValidity: ', checkReservationDatesValidity);

  expect(checkDatesResult.status).toBe('checkOutBeforeCheckInOrSameDay');
});

test('Genral validity: Check 1 night stay when switching to DST using the correct time zone to be valid when min nights is 1', () => {
  let checkIn = moment.utc('20230325T120000').tz('Europe/Berlin');
  console.log(`checkIn: ${checkIn.format()}`, checkIn);
  let checkOut = moment.utc('20230326T110000').tz('Europe/Berlin');
  console.log(`checkOut: ${checkOut.format()}`, checkOut);
  const now = moment.utc('20230218T120000').tz('Europe/Berlin');
  console.log(`now: ${now.format()}`, now);
  const checkDatesResult = checkReservationDatesValidity(checkIn, checkOut, now);
  console.log('checkReservationDatesValidity: ', checkReservationDatesValidity);

  expect(checkDatesResult.status).toBe(200);
});

test('Integration test: Check 1 night stay to be valid (if it fails check the reservation dates to be in the future, the list ID to be correct and the listing to have correct settings (including blocked dates)', async () => {
  let checkIn = moment.utc('20230324T120000');
  let checkOut = moment.utc('20230325T120000');
  const checkDatesResult = await checkAvailableDates(9, checkIn, checkOut);
  console.log('checkDatesResult: ', checkDatesResult);

  expect(checkDatesResult.status == 200).toBeTruthy();
});

test('Integration test: Check 1 night stay at DST start (daylight savings time) to be valid', async () => {
  let checkIn = moment.utc('20230325T120000');
  let checkOut = moment.utc('20230326T110000');
  const now = moment.utc('20230218T120000');
  const checkDatesResult = await checkAvailableDates(9, checkIn, checkOut);
  console.log('checkDatesResult: ', checkDatesResult);

  expect(checkDatesResult.status == 200).toBeTruthy();
});

test('Integration test: Check 23 hours stay at DST start (daylight savings time) to be invalid', async () => {
  let checkIn = moment.utc('20230325T120000');
  let checkOut = moment.utc('20230326T100000');
  const now = moment.utc('20230218T120000');
  const checkDatesResult = await checkAvailableDates(9, checkIn, checkOut);
  console.log('checkDatesResult: ', checkDatesResult);

  expect(checkDatesResult.status == 200).toBeFalsy();
});

test('Just some momentjs operations and logging', async () => {
  let checkIn = moment.utc('20230325T120000').tz('Europe/Berlin');
  console.log('checkIn: ', checkIn);
  console.log('checkIn - 3 UTC: ', checkIn
    .subtract(3, 'hours')
    .utc()
    .format('YYYY-MM-DD HH:mm:ss'));
  let checkOut = moment.utc('20230326T110000').tz('Europe/Berlin');
  console.log('checkOut: ', checkOut);
  console.log('checkOut - 3 UTC: ', checkOut
    .subtract(3, 'hours')
    .utc()
    .format());
  const now = moment.utc('20230218T120000');

  expect(checkIn.get('hour')).toBe(9);
  expect(checkOut.get('hour')).toBe(8);
});