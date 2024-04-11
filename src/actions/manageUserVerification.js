import {gql} from 'react-apollo';
// Toaster
import {toastr} from 'react-redux-toastr';
import {setLoaderStart, setLoaderComplete} from './loader/loader';

import {
    UPDATE_VERIFICATION_START,
    UPDATE_VERIFICATION_SUCCESS,
    UPDATE_VERIFICATION_ERROR,
    EMAIL_VERIFICATION_START,
    EMAIL_VERIFICATION_SUCCESS,
    EMAIL_VERIFICATION_ERROR,
    RESEND_EMAIL_VERIFICATION_START,
    RESEND_EMAIL_VERIFICATION_SUCCESS,
    RESEND_EMAIL_VERIFICATION_ERROR
} from '../constants';

// Load account data to update email verification
import { loadAccount } from './account';
// Send Email
import {sendEmail} from '../core/email/sendEmail';

// To Refresh the verification status
const query = gql ` 
    query ($userId: String!) {
        getUserVerifiedInfo (userId: $userId) {
            id
            isEmailConfirmed
            isFacebookConnected
            isGoogleConnected
            isIdVerification
            status
        }
    }`;


export function disconnectVerification(item, userId) {

    return async(dispatch, getState, {client}) => {

        dispatch({type: UPDATE_VERIFICATION_START});

        let mutation = gql `
            mutation updateUserVerifiedInfo($item: String!){
                updateUserVerifiedInfo(item: $item) {
                    status
                }
            }
        `;

        try {

            const {data} = await client.mutate({
                mutation,
                variables: {
                    item
                },
                refetchQueries: [{ query, variables: {userId} }]
            });

            if (data.updateUserVerifiedInfo.status === "success") {
                dispatch({type: UPDATE_VERIFICATION_SUCCESS});
            } else {
                dispatch({
                    type: UPDATE_VERIFICATION_ERROR, 
                    payload: {
                        status: data.updateUserVerifiedInfo.status
                    }
                });
            }
        } catch (error) {
            dispatch({
                type: UPDATE_VERIFICATION_ERROR, 
                payload: {
                    error
                }
            });
        }
    };
}


export function emailVerification(token, email, userId) {

    return async(dispatch, getState, {client}) => {

        dispatch({type: EMAIL_VERIFICATION_START});

        let emailQuery = gql `
            query EmailVerification($token: String!, $email: String!){
                EmailVerification(token: $token, email: $email) {
                    userId
                    status 
                }
            }
        `;

        try {

            const {data} = await client.query({
                query: emailQuery,
                variables: {
                    token,
                    email
                },
            });

            if (data.EmailVerification.status === "confirmed") {
                dispatch({type: EMAIL_VERIFICATION_SUCCESS});
                dispatch(disconnectVerification('email', userId));
                dispatch(loadAccount());
            }

        } catch (error) {
            dispatch({
                type: EMAIL_VERIFICATION_ERROR, 
                payload: {
                    error
                }
            });
        }
    };
}


export function resendEmailVerification(options) {

    return async(dispatch, getState, {client}) => {

        dispatch({type: RESEND_EMAIL_VERIFICATION_START});
        dispatch(setLoaderStart('resendEmailLoading'));

        let accountEmail = getState().account.data.email;
        let resendQuery = gql `
            query ResendConfirmEmail{
                ResendConfirmEmail {
                    id
                    userId
                    profile {
                        firstName
                            userData {
                                email
                            }
                    }
                    token
                    email
                    status
                }
            }
        `;

        try {

            const {data} = await client.query({
                query: resendQuery
            });

            if (data.ResendConfirmEmail.status !== 'error') {
                let content = {
                    token: data.ResendConfirmEmail.token,
                    name: data.ResendConfirmEmail.profile.firstName,
                    //email: data.ResendConfirmEmail.email
                    email: accountEmail
                };

                if (options) {
                    Object.assign(content, options);
                }

                //const { status, response } = await sendEmail(data.ResendConfirmEmail.email, 'confirmEmail', content);
                const { status, response } = await sendEmail(accountEmail, 'confirmEmail', content);
                if(status === 200){
                    toastr.success("Email is sent", "Confirmation link is sent to your email.");
                } else {
                    toastr.error("Failed to sent email", "Sorry, something went wrong. Please try again!");
                }
                
                dispatch({type: RESEND_EMAIL_VERIFICATION_SUCCESS});
                dispatch(setLoaderComplete('resendEmailLoading'));
            }

        } catch (error) {
            dispatch({type: RESEND_EMAIL_VERIFICATION_ERROR, 
                payload: {
                    error
                }
            });
            dispatch(setLoaderComplete('resendEmailLoading'));
        }
    };
}
