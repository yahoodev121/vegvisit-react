
import messages from '../../locale/messages';

const validate = values => {

    const errors = {};

    if (!values.isSpecialPrice) {
        errors.isSpecialPrice = messages.required;
    }

    if (values.isSpecialPrice > 0) {
        errors.isSpecialPrice = messages.required;
    }

    if (isNaN(values.isSpecialPrice) || (parseInt(values.basePrice, 3) < 1)) {
        errors.isSpecialPrice = messages.required;
    }

    return errors;
}

export default validate;
