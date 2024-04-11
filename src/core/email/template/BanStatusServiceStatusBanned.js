import React from 'react';
import PropTypes from 'prop-types';
import Layout from '../layouts/Layout';
import Header from '../modules/Header';
import Body from '../modules/Body';
import Footer from '../modules/Footer';
import EmptySpace from '../modules/EmptySpace';
import { url, sitename } from '../../../config';

class BanStatusServiceStatusBanned extends React.Component {

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
                        We are sorry to inform you that you have been banned from using Vegvisits. We don’t do this often, so you probably know what you did in order to be receiving this message from us.
                    </div>
                    <EmptySpace height={20} />
                    <div>
                        If you have any questions or would like to talk to someone about regaining your site privileges, please email us at <a style={tagStyle}>team@vegvisits.com.</a>
                    </div>
                    <EmptySpace height={40} />
                    <div>
                        Thanks, <br />
                        The {sitename} Team
					</div>

                </Body>
                <Footer />
                <EmptySpace height={20} />
            </Layout>
        );
    }

}

export default BanStatusServiceStatusBanned;