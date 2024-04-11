import React from 'react';
import PropTypes from 'prop-types';
import Layout from '../layouts/Layout';
import Header from '../modules/Header';
import Body from '../modules/Body';
import Footer from '../modules/Footer';
import EmptySpace from '../modules/EmptySpace';
import { url, sitename } from '../../../config';

class ReportUserMail extends React.Component {

    static propTypes = {
        content: PropTypes.shape({
            userName: PropTypes.string.isRequired,
            reporterName: PropTypes.string.isRequired,
            reportType: PropTypes.string.isRequired
        })
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

        const textStyle = {
            color: '#484848',
            backgroundColor: '#F7F7F7',
            fontFamily: 'Arial',
            fontSize: '16px',
            padding: '35px'
        };
        const { content: { userName, reporterName, reportType} } = this.props;

        return (
            <Layout>
                {/* <Header color="rgb(255, 90, 95)" backgroundColor="#F7F7F7" /> */}
                <Body textStyle={textStyle}>
                    <div>
                        Hi admin,
                    </div>
                    <EmptySpace height={20} />
                    <div>
                     Here, You receive an email to report the user {userName} by the report type { reportType } by {reporterName}.
                    </div>    
                    <EmptySpace height={20} />
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

export default ReportUserMail;