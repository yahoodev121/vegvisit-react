import React from 'react';
import PropTypes from 'prop-types';
import Layout from '../layouts/Layout';
import Header from '../modules/Header';
import Body from '../modules/Body';
import Footer from '../modules/Footer';
import EmptySpace from '../modules/EmptySpace';
import { url, sitename } from '../../../config';

class BanStatusServiceStatusUnBanned extends React.Component {

	static propTypes = {
		content: PropTypes.shape({
			userMail: PropTypes.string.isRequired,
		}).isRequired
	};

	render() {
		const buttonStyle = {
			margin: 0,
			fontFamily: 'Arial',
			padding: '10px 16px',
			textDecoration: 'none',
			borderRadius: '2px',
			border: '1px solid',
			textAlign: 'center',
			verticalAlign: 'middle',
			fontWeight: 'normal',
			fontSize: '18px',
			whiteSpace: 'nowrap',
			background: '#ffffff',
			borderColor: '#56aa4eff',
			backgroundColor: '#56aa4eff',
			color: '#ffffff',
			borderTopWidth: '1px',
		};

		const linkText = {
			color: '#56aa4eff',
			fontSize: '16px',
			textDecoration: 'none',
			cursor: 'pointer',
		}

		const textStyle = {
			color: '#484848',
			backgroundColor: '#F7F7F7',
			fontFamily: 'Arial',
			fontSize: '16px',
			padding: '35px'
		};
		const tagStyle = {
			color: '#0074c2',
		}
		const { content: { userName, userMail, adminMail } } = this.props;
		let mailTo = 'mailto:' + adminMail;

		return (
			<Layout>
				{/* <Header color="rgb(255, 90, 95)" backgroundColor="#F7F7F7" /> */}
				<Body textStyle={textStyle}>
					<div>
						Hi {userName},
                    </div>
					<EmptySpace height={20} />
					<div>
					We’ve brought you some good news - you can use Vegvisits again! Please read through the Terms of Use, so you know what is allowed and not tolerated when using the platform.
                    </div>
					<EmptySpace height={20} />
					<div>
					If you have any questions, email us at <a style={tagStyle}>team@vegvisits.com</a> - we’re always here to help!
					</div>
					<EmptySpace height={40} />
					<div>
						Thanks! <br />
						The {sitename} Team
					</div>

				</Body>
				<Footer />
				<EmptySpace height={20} />
			</Layout>
		);
	}

}

export default BanStatusServiceStatusUnBanned;