
import messages from '../../locale/messages';


const validateStep3 = values => {

	const errors = {};

	if (Number(values.checkInStart) >= Number(values.checkInEnd)) {
		errors.checkInStart = messages.advanceNoticeError;
	}

	if (Number(values.checkInStart) < 8 || Number(values.checkInStart) > 25) {
		errors.checkInStart = messages.advanceNoticeInvalid;
	}

	if (Number(values.checkInEnd) < 9 || Number(values.checkInEnd) > 26) {
		errors.checkInEnd = messages.advanceNoticeInvalid;
	}


	if ((typeof values.basePrice == "number" && values.basePrice.toString().trim() === '') || (typeof values.basePrice == "string" && values.basePrice.trim() === '') || values.basePrice == null) {
		errors.basePrice = messages.required;
	}

	if (isNaN(values.basePrice) || (!/^[0-9\.]+$/.test(values.basePrice)) || (parseFloat(values.basePrice, 10) < 0)) {
		errors.basePrice = messages.basePriceInvalid;
	}

	if (values.cleaningPrice) {
		if (isNaN(values.cleaningPrice) || (!/^[0-9\.]+$/.test(values.cleaningPrice)) || (parseInt(values.cleaningPrice, 10) < 0)) {
			errors.cleaningPrice = messages.cleaningPriceInvalid;
		} else if ((!values.basePrice || values.basePrice === '0') && values.cleaningPrice !== '0') {
      errors.cleaningPrice = messages.noCleaningPriceForFreeListing;
    }
	}

	// if (values.securityDeposit) {
	// 	if (isNaN(values.securityDeposit) || (!/^[0-9\.]+$/.test(values.securityDeposit)) || (parseInt(values.cleaningPrice, 10) < 0)) {
	// 		errors.securityDeposit = messages.securityDepositInvalid;
	// 	}
	// }

	if (values.weeklyDiscount) {
		if (isNaN(values.weeklyDiscount) || (!/^[0-9\.]+$/.test(values.weeklyDiscount)) || (parseInt(values.weeklyDiscount, 10) < 0) || parseInt(values.weeklyDiscount, 10) > 99) {
			errors.weeklyDiscount = messages.discountInvalid;
		}
	}

	if (values.monthlyDiscount) {
		if (isNaN(values.monthlyDiscount) || (!/^[0-9\.]+$/.test(values.monthlyDiscount)) || (parseInt(values.monthlyDiscount, 10) < 0) || parseInt(values.monthlyDiscount, 10) > 99) {
			errors.monthlyDiscount = messages.discountInvalid;
		}
	}

	// if(values.additionalRules && values.additionalRules.trim() == "") {
	// 	errors.additionalRules = messages.blankSpace;
	// }

	/*if(values.weeklyDiscount) {
		  if(values.weeklyDiscount != parseInt(values.weeklyDiscount, 10)){
			errors.weeklyDiscount = messages.discountInvalid;
		  }
		  if(parseInt(values.weeklyDiscount, 10) < 0 || parseInt(values.weeklyDiscount, 10) > 99){
			errors.weeklyDiscount = messages.discountInvalid;
		  }
	}
  
	if(values.monthlyDiscount) {
		  if(values.monthlyDiscount != parseInt(values.monthlyDiscount, 10)){
			errors.monthlyDiscount = messages.discountInvalid;
		  }
		  if(parseInt(values.monthlyDiscount, 10) < 0 || parseInt(values.monthlyDiscount, 10) > 99){
			errors.monthlyDiscount = messages.discountInvalid;
		  }
	}*/
	// if (Number(values.maxNight) > 0) {
	// 	if (!values.maxNight || values.minNight > values.maxNight) {
	// 		errors.minNight = messages.tripLengthError1;//'Minimum nights can`t be higher than maximum nights';
	// 	}
	// 	else if (Number(values.minNight) > Number(values.maxNight)) {
	// 		errors.minNight = messages.tripLengthError1;//'Minimum nights can`t be higher than maximum nights';
	// 	}
	// 	else if (Number(values.minNight) == Number(values.maxNight)) {
	// 		errors.minNight = messages.tripLengthError1;//'Minimum nights can`t be higher than maximum nights';
	// 	}
	// }

	// else if (values.maxNight == '' && Number(values.minNight) > 0) {
	// 	errors.minNight = messages.tripLengthError1;//'Minimum nights can`t be higher than maximum nights';
	// }
	// else if (Number(values.minNight) > Number(values.maxNight)) {
	// 	errors.minNight = messages.tripLengthError1;//'Minimum nights can`t be higher than maximum nights';
	// }

	const maxNight = Number(values.maxNight);
	const minNight = Number(values.minNight);
	if (maxNight > 0) {
		if (minNight > maxNight) {
			errors.minNight = 'Minimum nights can`t be higher than maximum nights';
		}
	}
	
	return errors;
}

export default validateStep3;
