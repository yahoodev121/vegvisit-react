// Redux Form
import { SubmissionError } from 'redux-form';

// Language
import { FormattedMessage } from 'react-intl';

// Fetch request
import fetch from '../../core/fetch';

// Redux
import { setRuntimeVariable } from '../../actions/runtime';
import { setUserLogout } from '../../actions/logout';

import { loadAccount } from '../../actions/account';
import { choseToCurrency } from '../../actions/getCurrencyRates';

// Toaster
import { toastr } from 'react-redux-toastr';

// Helper
import PopulateData from '../../helpers/populateData';

// Locale
import messages from '../../locale/messages';

async function submit(values, dispatch, props, initialValues) {
  
  // if (!values.day) {
  //   //throw new SubmissionError({ _error: messages.birthDayRequired });
  //   toastr.error("Update Profile Failed", "Birth day field is missing");
  //   return false;
  // }

  // if (!values.year) {
  //   //throw new SubmissionError({ _error: messages.birthDayRequired });
  //   toastr.error("Update Profile Failed", "Birth year field is missing");
  //   return false;
  // }

  // let monthValidation = parseInt(values.month);
  // if (isNaN(monthValidation)) {
  //   toastr.error("Update Profile Failed", "Birth month field is missing");
  //   return false;
  // }

  if (values.year) {
    let now = new Date();
    let currentYear = now.getFullYear();
    let difference = currentYear - values.year;
    if (difference < 18) {
      //throw new SubmissionError({ _error: messages.mustBe18OrOld });
      toastr.error("Update Profile Failed", "Sorry, you must be 18 years old");
      return false;
    }
  }

  if (values.year && values.month && values.day) {
    if (!PopulateData.isValidDate(values.year, values.month, values.day)) {
      //throw new SubmissionError({ _error: messages.WrongDayChosen });
      toastr.error("Update Profile Failed", "Invalid date of birth, please fill the valid data");
      return false;
    }
  }

  // if (values.year && values.month && values.day) {
  //   if (!PopulateData.isValidDate(values.year, values.month, values.day)) {
  //     //throw new SubmissionError({ _error: messages.WrongDayChosen });
  //     toastr.error("Update Profile Failed", "Invalid date of birth, please fill the valid data");
  //     return false;
  //   }
  // }

  const query = `
  query (
    $firstName:String,
    $lastName:String,
  	$gender: String,
    $dateOfBirth: String,
    $email: String!,
  	$preferredLanguage: String,
  	$preferredCurrency: String,
  	$location: String,
    $info: String,
    $loggedinEmail: String,
    $countryName: String,
    $lifestyle: String,
    $spokenLanguages: String,
    $funFacts: String,
    $hobbies: String,
    $books: String,
    $music: String,
    $movies: String,
    $quote: String,
    $school: String,
    $work: String,
    $companionAnimals: String,
    $foodCategory: String,
    $userDiets: [Int]
  ) {
      userEditProfile (
        firstName:$firstName,
        lastName:$lastName,
        gender: $gender,
        dateOfBirth: $dateOfBirth,
        email: $email,
        preferredLanguage: $preferredLanguage,
        preferredCurrency: $preferredCurrency,
        location: $location,
        info: $info,
        loggedinEmail: $loggedinEmail,
        countryName: $countryName,
        lifestyle: $lifestyle,
        spokenLanguages: $spokenLanguages,
        funFacts: $funFacts,
        hobbies: $hobbies,
        books: $books,
        music: $music,
        movies: $movies,
        quote: $quote,
        school: $school,
        work: $work,
        companionAnimals: $companionAnimals
        foodCategory: $foodCategory
        userDiets: $userDiets
      ) {
        status
      }
    }
    `;

  const { year, month, day } = values;
  let dateOfBirth = (Number(month) + 1) + "-" + year + "-" + day;

  let firstNameValue = values.firstName ? values.firstName.trim() : values.firstName;
  let lastNameValue = values.lastName ? values.lastName.trim() : values.lastName;
  let phoneNumber = values.phoneNumber ? values.phoneNumber.trim() : values.phoneNumber;
  let location = values.location ? values.location.trim() : values.location;
  let infoValue = values.info ? values.info.trim() : values.info;
  let loggedinEmailValue = values.loggedinEmail ? values.loggedinEmail.trim() : values.loggedinEmail;
  let countryCode = values.phoneDialCode ? values.phoneDialCode : values.dialCode;
  let countryName = values.phoneCountryCode ? values.phoneCountryCode : null;
  let lifestyle = values.lifestyle ? values.lifestyle.trim() : values.lifestyle;
  let spokenLanguages = values.spokenLanguages ? values.spokenLanguages.trim() : values.spokenLanguages;
  let funFacts = values.funFacts ? values.funFacts.trim() : values.funFacts;
  let hobbies = values.hobbies ? values.hobbies.trim() : values.hobbies;
  let books = values.books ? values.books.trim() : values.books;
  let music = values.music ? values.music.trim() : values.music;
  let movies = values.movies ? values.movies.trim() : values.movies;
  let quote = values.quote ? values.quote.trim() : values.quote;
  let school = values.school ? values.school.trim() : values.school;
  let work = values.work ? values.work.trim() : values.work;
  let companionAnimals = values.companionAnimals ? values.companionAnimals.trim() : values.companionAnimals;
  let foodCategory = values.foodCategory ? values.foodCategory.trim() : values.foodCategory;
  let userDiets = values.userDiets;
  const params = {
    firstName: firstNameValue,
    lastName: lastNameValue,
    gender: values.gender,
    dateOfBirth: dateOfBirth,
    email: values.email,
    preferredLanguage: values.preferredLanguage,
    preferredCurrency: values.preferredCurrency,
    location: location,
    info: infoValue,
    // phoneNumber: values.phoneNumber,
    loggedinEmail: loggedinEmailValue,
    // countryCode: countryCode,
    countryName: countryName,
    lifestyle: lifestyle,
    spokenLanguages: spokenLanguages,
    funFacts: funFacts,
    hobbies: hobbies,
    books: books,
    music: music,
    movies: movies,
    quote: quote,
    school: school,
    work: work,
    companionAnimals: companionAnimals,
    foodCategory: foodCategory,
    userDiets: userDiets
  };
  const resp = await fetch('/graphql', {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: query,
      variables: params
    }),
    credentials: 'include',
  });

  const { data } = await resp.json();

  if (data.userEditProfile.status == "success") {
    await dispatch(loadAccount());
    if (values.preferredCurrency !== initialValues.preferredCurrency) {
      await dispatch(choseToCurrency(values.preferredCurrency));
    }
    toastr.success("Update Profile", "Your changes are updated!");
  } else if (data.userEditProfile.status == "email") {
    //throw new SubmissionError({ _error: messages.emailAlreadyExists });
    toastr.error("Update Profile Failed", "Email already exist, please try another email address!");
  } else if (data.userEditProfile.status == "notLoggedIn") {
    dispatch(setRuntimeVariable({
      name: 'isAuthenticated',
      value: false,
    }));
    toastr.error("Update Profile Failed", "You are not logged in, please login and try again!");
    //throw new SubmissionError({ _error: messages.notLoggedIn });
  } else {
    // throw new SubmissionError({ _error: messages.somethingWentWrong });
    toastr.error("Update Profile Failed", "Sorry, something went wrong! Reload this page and try again!");
  }

}

export default submit;
