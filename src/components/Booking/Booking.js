import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Redux
import { connect } from 'react-redux';

// Redux Form
import { formValueSelector } from 'redux-form';

// Redux actions
import { resendEmailVerification } from '../../actions/manageUserVerification';
import { loadAccount } from '../../actions/account';

// Translation
import { injectIntl, FormattedMessage } from 'react-intl';
// Locale
import messages from '../../locale/messages';

// Component
import Meetup from './Meetup';
import Verification from './Verification';
import Payment from './Payment';
import AvatarUpload from './AvatarUpload';
import PhoneVerificationModal from '../PhoneVerificationModal/PhoneVerificationModal';

import history from '../../core/history';

// Style
import { Button, Grid, Row, Col, FormGroup } from 'react-bootstrap';
import cx from 'classnames';
import * as FontAwesome from 'react-icons/lib/fa';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Booking.css';
class Booking extends Component {
	static propTypes = {
		account: PropTypes.shape({
			userId: PropTypes.string.isRequired,
			email: PropTypes.string.isRequired,
			picture: PropTypes.string,
			displayName: PropTypes.string.isRequired,
			firstName: PropTypes.string.isRequired,
			verification: PropTypes.shape({
				isEmailConfirmed: PropTypes.bool.isRequired
			})
		}),
		bookingData: PropTypes.shape({
			id: PropTypes.number.isRequired,
			title: PropTypes.string.isRequired,
			coverPhoto: PropTypes.number,
			city: PropTypes.string.isRequired,
			state: PropTypes.string.isRequired,
			country: PropTypes.string.isRequired,
			personCapacity: PropTypes.number.isRequired,
			bookingType: PropTypes.string.isRequired,
			user: PropTypes.shape({
				email: PropTypes.string.isRequired,
				profile: PropTypes.shape({
					profileId: PropTypes.number.isRequired,
					displayName: PropTypes.string.isRequired,
					firstName: PropTypes.string.isRequired,
					picture: PropTypes.string
				})
			}),
			settingsData: PropTypes.arrayOf(PropTypes.shape({
				listsettings: PropTypes.shape({
					itemName: PropTypes.string.isRequired
				})
			})),
			houseRules: PropTypes.arrayOf(PropTypes.shape({
				listsettings: PropTypes.shape({
					itemName: PropTypes.string.isRequired
				})
			})),
			listingData: PropTypes.shape({
				basePrice: PropTypes.number.isRequired,
				cleaningPrice: PropTypes.number.isRequired,
				currency: PropTypes.string.isRequired,
				weeklyDiscount: PropTypes.number,
				monthlyDiscount: PropTypes.number,
				cancellation: PropTypes.shape({
					policyName: PropTypes.string.isRequired
				})
			}),
			listPhotos: PropTypes.arrayOf(PropTypes.shape({
				id: PropTypes.number.isRequired,
				name: PropTypes.string.isRequired
			}))
		}),
		resendEmailVerification: PropTypes.any.isRequired,
		loadAccount: PropTypes.any.isRequired,
		bookDetails: PropTypes.shape({
			startDate: PropTypes.object.isRequired,
			endDate: PropTypes.object.isRequired,
			guests: PropTypes.number.isRequired,
			preApprove: PropTypes.any
		}),
		serviceFees: PropTypes.object.isRequired,
    base: PropTypes.string.isRequired,
    toCurrency: PropTypes.string.isRequired,
		rates: PropTypes.object.isRequired,
		specialPricing: PropTypes.array
	};

	static defaultProps = {
		account: {
			email: null,
			displayName: null,
			firstName: null,
			picture: null,
			verification: {
				isEmailConfirmed: false
			}
		},
		bookingData: {
			title: null,
			personCapacity: 0,
			coverPhoto: null,
			city: null,
			state: null,
			country: null,
			user: {
				profile: {
					displayName: null,
					firstName: null,
					picture: null
				}
			},
			settingsData: [{
				listsettings: {
					itemName: null
				}
			}],
			houseRules: [],
			listingData: {
				basePrice: 0,
				cleaningPrice: 0,
				currency: null,
				weeklyDiscount: 0,
				monthlyDiscount: 0
			},
			listPhotos: []
		},
		bookDetails: {
			checkIn: null,
			checkOut: null,
			guests: 1,
			preApprove: false
		},
		specialPricing: []
	};

	constructor(props) {
		super(props);
		this.state = {
			page: 'verification',
			checkAccount: null,
			dismissPhoneVerification: false
		};
		this.nextPage = this.nextPage.bind(this);
		this.dismissPhoneVerification = this.dismissPhoneVerification.bind(this);
	}

	componentDidMount() {
		const { account, loadAccount } = this.props;
		const pageState = Booking.definePageState(loadAccount, account, this.state.checkAccount, this.state.dismissPhoneVerification);
		this.setState(pageState);
	}

	static getDerivedStateFromProps(props, state) {
		const { account, loadAccount } = props;
		const pageState = Booking.definePageState(loadAccount, account, state.checkAccount, state.dismissPhoneVerification);
		return pageState;
	}

	componentWillUnmount() {
		if (this.state.checkAccount) {
			clearInterval(this.state.checkAccount);
		}
	}

	static definePageState(loadAccount, account, checkAccount, dismissPhoneVerification) {
		if (account && account.picture === null) {
			if (checkAccount) {
				clearInterval(checkAccount);
			}
			return({
				page: 'avatar',
				checkAccount: null
			});
		}
		else if (account && account.verification && account.verification.isEmailConfirmed) {
			if ((!account.phoneNumber || !account.verification.isPhoneVerified) && !dismissPhoneVerification) {
				if (!checkAccount) {
					checkAccount = setInterval(() => {
						loadAccount();
					}, 5000)
				}
				return({
					page: 'phoneNumber',
					checkAccount
				});	
			} else {
				if (checkAccount) {
					clearInterval(checkAccount);
				}
				return({
					page: 'payment',
					checkAccount: null
				});
			}
		}
		else {
			if (!checkAccount) {
				checkAccount = setInterval(() => {
					loadAccount();
				}, 5000)
			}
			return({
				page: 'verification',
				checkAccount
			});
		}
	}

	nextPage(page) {
		this.setState({ page });
	}

	dismissPhoneVerification() {
		this.setState({ dismissPhoneVerification: true });
	}

	render() {
		const { page } = this.state;
		const { account, bookingData, resendEmailVerification } = this.props;
		const { bookDetails: { guests, startDate, endDate, preApprove, messageType } } = this.props;
		const { serviceFees, base, rates, toCurrency, specialPricing } = this.props;
		const { formatMessage } = this.props.intl;
		const { inquiry, hostingId } = this.props;

		return (
			<div>
				{/* {
					page === 'meetup' && <Meetup
						hostDisplayName={bookingData.user.profile.firstName}
						hostPicture={bookingData.user.profile.picture}
						guestDisplayName={account.firstName}
						guestPicture={account.picture}
						nextPage={this.nextPage}
						emailVerified={account.verification.isEmailConfirmed}
					/>
				} */}

				{
					page === 'verification' && <Verification
						guestEmail={account.email}
						resendEmailVerification={resendEmailVerification}
						bookingListing={inquiry ? hostingId : bookingData.id}
						bookingStartDate={startDate ? startDate.format('YYYY-MM-DDTHH') : undefined}
						bookingEndDate={endDate ? endDate.format('YYYY-MM-DDTHH') : undefined}
						bookingGuests={guests}
						bookingMessageType={inquiry ? 'inquiry' : messageType}
						bookingPreApprove={preApprove}
					/>
				}

				{
					page === 'phoneNumber' &&
					<Grid>
          	<Row>
              <Col xs={12} sm={12} md={12} lg={12}>
								<div className={s.phoneVerificationStepPanel}>
									<PhoneVerificationModal showVerified={false} noPhoneNumberMessage={formatMessage(messages.noPhoneNumberGuest)} className={cx(s.space6)}/>
									<div className={cx(s.space4, s.spaceTop4)}>
										<a href="javascript:void(0)" className={cx(s.modalCaptionLink)}
											onClick={this.dismissPhoneVerification}>
											<FormattedMessage {...messages.skip} />
										</a>
									</div>
								</div>
							</Col>
						</Row>
					</Grid>
				}

				{
					page === 'avatar' && <AvatarUpload
						nextPage={this.nextPage}
						guestPicture={account.picture}
						guestDisplayName={account.firstName}
						emailVerified={account.verification.isEmailConfirmed}
					/>
				}

				{
					page === 'payment' && !inquiry && <Payment
						listId={bookingData.id}
						hostId={bookingData.userId}
						guestId={account.userId}
						guestEmail={account.email}
						hostDisplayName={bookingData.user.profile.firstName}
						hostPicture={bookingData.user.profile.picture}
						listTitle={bookingData.title}
						listType={bookingData.settingsData[0].listsettings.itemName}
						coverPhoto={bookingData.coverPhoto}
						city={bookingData.city}
						state={bookingData.state}
            country={bookingData.country}
            timeZone={bookingData.timeZone}
						houseRules={bookingData.houseRules}
						checkIn={startDate}
						checkOut={endDate}
						allowedPersonCapacity={bookingData.personCapacity}
						guests={guests}
            preApprove={preApprove}
						basePrice={bookingData.listingData.basePrice}
						cleaningPrice={bookingData.listingData.cleaningPrice}
						currency={bookingData.listingData.currency}
						weeklyDiscount={bookingData.listingData.weeklyDiscount}
						monthlyDiscount={bookingData.listingData.monthlyDiscount}
						listPhotos={bookingData.listPhotos}
						serviceFees={serviceFees}
						base={base}
						rates={rates}
            toCurrency={toCurrency}
						bookingType={bookingData.bookingType}
						policyName={bookingData.listingData.cancellation.policyName}
						specialPricing={specialPricing}
						bookingData={bookingData}
						hostEmail={bookingData.user.email}
						securityDeposit={bookingData && bookingData.listingData.securityDeposit}
					/>
				}
				{
					page === 'payment' && inquiry && history.push('/rooms/' + hostingId + '?inquiry=true')
				}

			</div>
		);
	}
}

// Decorate with connect to read form values
const selector = formValueSelector('BookingForm'); // <-- same as form name

const mapState = (state) => ({
	account: state.account.data,
	bookingData: state.book.data,
	bookDetails: state.book.bookDetails,
	serviceFees: state.book.serviceFees,
	base: state.currency.base,
  rates: state.currency.rates,
  toCurrency: state.currency.to,
	specialPricing: state.viewListing.specialPricing
});

const mapDispatch = {
	resendEmailVerification,
	loadAccount
};

export default injectIntl(
  withStyles(s)(connect(mapState, mapDispatch)(Booking))
);