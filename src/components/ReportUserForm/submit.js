// Redux Form
import { SubmissionError, reset } from 'redux-form';

import React, { Component } from 'react';

// Fetch request
import fetch from '../../core/fetch';

// Language
import messages from '../../locale/messages';

import { adminEmail } from '../../config';

import { toastr } from 'react-redux-toastr';

// Send Email
import { sendEmail } from '../../core/email/sendEmail';

import ThankYouModal from '../ThankYouModal';

import { closeReportUserModal, openThankYouModal } from '../../actions/modalActions';

async function submit(values, dispatch) {   

    const query = `mutation (
    $reporterId:String,
    $userId:String,
    $reportType: String,
    $profileId: Int,
    $reporterName: String,
  ) {
      CreateReportUser (
        reporterId:$reporterId,
        userId:$userId,
        reportType: $reportType,
        profileId: $profileId,
        reporterName: $reporterName,
      ) {
        status
        firstName
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
            variables: values
        }),
        credentials: 'include'
    });

    const { data } = await resp.json();

    if (data.CreateReportUser.status == "success") {
        dispatch(closeReportUserModal());
        dispatch(reset('ReportUserForm'));
        dispatch(openThankYouModal());
        
        let email = adminEmail;     
        // Send Email
        let content = {
            userName: data.CreateReportUser.firstName,
            reporterName: values.reporterName,
            reportType: values.reportType
        };
        const { status, response } = await sendEmail(email, 'reportUser', content);
        if (status === 200) {
           // dispatch(openThankYouModal());
        }

    } else {
        toastr.error("Error!", "Sorry, something went wrong. Please try again!");
    }

}

export default submit;
