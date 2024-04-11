export function generateTime(time) {
    let TimeLabel;
    switch (time) {
        case '8':
            TimeLabel = '8AM';
            break;
        case '9':
            TimeLabel = '9AM';
            break;
        case '10':
            TimeLabel = '10AM';
            break;
        case '11':
            TimeLabel = '11AM';
            break;
        case '12':
            TimeLabel = '12PM';
            break;
        case '13':
            TimeLabel = '1PM';
            break;
        case '14':
            TimeLabel = '2PM';
            break;
        case '15':
            TimeLabel = '3PM';
            break;
        case '16':
            TimeLabel = '4PM';
            break;
        case '17':
            TimeLabel = '5PM';
            break;
        case '18':
            TimeLabel = '6PM';
            break;
        case '19':
            TimeLabel = '7PM';
            break;
        case '20':
            TimeLabel = '8PM';
            break;
        case '21':
            TimeLabel = '9PM';
            break;
        case '22':
            TimeLabel = '10PM';
            break;
        case '23':
            TimeLabel = '11PM';
            break;
        case '24':
            TimeLabel = '12AM';
            break;
        case '25':
            TimeLabel = '1AM';
            break;       
    }
    return TimeLabel;
}

export function generateCheckInString(checkInStart, checkInEnd, messages, formatMessage) {
  let checkInString = '';
  if (checkInStart === 'Flexible' && checkInEnd === 'Flexible') {
    // Flexible check in time
    checkInString = (messages && formatMessage) ? formatMessage(messages.flexibleCheckIn) : 'Flexible check in time';
  }
  if (checkInStart === 'Flexible' && checkInEnd !== 'Flexible') {
    // Check in time before xx
    checkInString = (messages && formatMessage) ?
      `${formatMessage(messages.checkInTimeBefore)} ${generateTime(checkInEnd)}` :
      `Check in time before ${generateTime(checkInEnd)}`;
  }
  if (checkInStart !== 'Flexible' && checkInEnd === 'Flexible') {
    // Check in time after xx
    checkInString = (messages && formatMessage) ?
      `${formatMessage(messages.checkInTimeAfter)} ${generateTime(checkInStart)}` :
      `Check in time after ${generateTime(checkInStart)}`;
  }
  if (checkInStart !== 'Flexible' && checkInEnd !== 'Flexible') {
    // xx - yy
    checkInString = `${generateTime(checkInStart)} - ${generateTime(checkInEnd)}`;
  }
  return checkInString;
}