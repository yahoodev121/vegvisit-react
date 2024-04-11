import messages from '../../../locale/messages';

const validate = values => {

    const errors = {}

    if (!values.name) {
        errors.name = messages.required;
    } else if (values.name.trim() == "") {
        errors.name = messages.required;
    }

    return errors
}

export default validate
