import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Form,
  Grid,
  Row, FormGroup,
  Col,
  ControlLabel,
  FormControl,
  FieldGroup,
  Panel,
  Label,
} from 'react-bootstrap';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Verification.css';
import envelope from './envelope.png';

// Component
import Link from '../../Link';

// Locale
import messages from '../../../locale/messages';

class Verification extends Component {
    static propTypes = {
    	guestEmail: PropTypes.string.isRequired,
			resendEmailVerification: PropTypes.any.isRequired,
			formatMessage: PropTypes.any,
			bookingListing: PropTypes.number,
			bookingStartDate: PropTypes.string,
			bookingEndDate: PropTypes.string,
			bookingGuests: PropTypes.number,
			bookingMessageType: PropTypes.string,
			bookingPreApprove: PropTypes.bool
    };

    render() {
    	const { guestEmail, resendEmailVerification } = this.props;
			const { bookingListing, bookingStartDate, bookingEndDate, bookingGuests, bookingMessageType, bookingPreApprove } = this.props;
			let verificationOptions;
			if (bookingMessageType === 'requestToBook' && bookingListing && bookingStartDate && bookingEndDate && bookingGuests && typeof(bookingPreApprove) === 'boolean') {
				verificationOptions = {
					bookingListing,
					bookingStartDate,
					bookingEndDate,
					bookingGuests,
					bookingMessageType,
					bookingPreApprove,
					resendWhileBooking: true
				}
			} else if (bookingMessageType === 'inquiry' && bookingListing) {
				verificationOptions = {
					bookingListing,
					bookingMessageType,
					resendWhileBooking: true
				}
			}
        return (
	        <Grid>
		        <Row>
		          <div className={s.pageContainer}>
		            <div className={s.activationStepPanel}>
		              <div className={s.panelBody}>
										<h3 className={s.space1}><span><FormattedMessage {...messages.checkEmail} /></span></h3>
		                <div className={cx(s.textLead, s.space4)}>
		                  <div>
												<span><FormattedMessage {...messages.verificationInfo1} /></span>
		                  </div>
		                  <div>
												<span><FormattedMessage {...messages.verificationInfo2} /></span>
		                  </div>
		                </div>
		                <div className={cx(s.space4, s.spaceTop4)}>
		                  <div className={s.iconContainer}>
		                    <div className={s.space2}>
		                      <img
		                        src={envelope}
		                        className={cx(s.iconEnvelope, s.iconGray, s.iconSize)}
		                      />
		                    </div>
		                  </div>
		                </div>
		                <Col xs={12} sm={12} md={12} lg={12} className={s.space2}>
		                  <FormGroup className={s.formGroup}>
		                    <FormControl value={guestEmail} className={cx(s.formControlInput, s.textCenter)} disabled />
		                  </FormGroup>
		                </Col>
		                <Col xs={12} sm={12} md={12} lg={12}>
											<Button className={cx(s.button, s.btnPrimary)} onClick={() => {resendEmailVerification(verificationOptions)}}>
												<FormattedMessage {...messages.resendEmail} />
											</Button>
		                </Col>
		                {/* <Col xs={12} sm={12} md={12} lg={12} className={s.spaceTop2}>
		                  <Link to={"/user/edit"}>
												<span><FormattedMessage {...messages.changeEmail} /></span>
		                  </Link>
		                </Col> */}
										<Col xs={12} sm={12} md={12} lg={12} className={s.spaceTop2}>
											<div>
												<span><FormattedMessage {...messages.verificationInfo3} /></span>
											</div>
										</Col>
		              </div>
		            </div>
		          </div>
		        </Row>
	      	</Grid>
        );
    }
}

export default withStyles(s)(Verification);