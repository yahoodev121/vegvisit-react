import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import 'moment-timezone'
import { Table, TBody, TR, TD } from 'oy-vey'
import Layout from '../layouts/Layout'
import Header from '../modules/Header'
import Body from '../modules/Body'
import Footer from '../modules/Footer'
import EmptySpace from '../modules/EmptySpace'
import { url, sitename } from '../../../config'

// Helpers
import { avatarBaseUrl } from '../../../helpers/cdnImages'

class BookingRequestGuest extends React.Component {
  static propTypes = {
    content: PropTypes.shape({
      confirmationCode: PropTypes.number.isRequired,
      hostName: PropTypes.string.isRequired,
      guestName: PropTypes.string.isRequired,
      checkIn: PropTypes.string.isRequired,
      checkOut: PropTypes.string.isRequired,
      listId: PropTypes.number.isRequired,
      listTitle: PropTypes.string.isRequired,
      listTimeZone: PropTypes.string.isRequired,
      threadId: PropTypes.number.isRequired,
      hostJoinedDate: PropTypes.string.isRequired,
      hostLocation: PropTypes.string.isRequired,
      hostProfilePic: PropTypes.string.isRequired,
      receiverName: PropTypes.string.isRequired,
      senderName: PropTypes.string.isRequired,
      total: PropTypes.number.isRequired
    }).isRequired
  }

  render () {
    const textStyle = {
      color: '#484848',
      backgroundColor: '#F7F7F7',
      fontFamily: 'Arial',
      fontSize: '16px',
      padding: '35px'
    }

    const btnCenter = {
      textAlign: 'center'
    }

    const buttonStyle = {
      margin: 0,
      fontFamily: 'Arial',
      padding: '10px 16px',
      textDecoration: 'none',
      borderRadius: '2px',
      border: '1px solid',
      textAlign: 'center',
      verticalAlign: 'middle',
      fontWeight: 'bold',
      fontSize: '18px',
      whiteSpace: 'nowrap',
      background: '#ffffff',
      borderColor: '#5DAD41',
      backgroundColor: '#5DAD41',
      color: '#ffffff',
      borderTopWidth: '1px'
    }

    const profilePic = {
      borderRadius: '999px',
      margin: '0',
      padding: '0',
      lineHeight: '150%',
      borderSpacing: '0',
      width: '125px'
    }

    const userName = {
      color: '#565a5c',
      fontSize: '26px',
      fontWeight: 'bold',
      paddingBottom: '5px'
    }
    const centerText = {
      textAlign: 'center'
    }

    const {
      content: {
        guestName,
        listId,
        listTitle,
        listTimeZone,
        hostName,
        checkIn,
        checkOut,
        threadId,
        confirmationCode,
        receiverName,
        senderName
      }
    } = this.props
    const {
      content: {
        hostLastName,
        hostProfilePic,
        hostJoinedDate,
        hostLocation,
        total
      }
    } = this.props
    let hostJoinedYear =
      hostJoinedDate != null ? moment(hostJoinedDate).format('YYYY') : ''
    let checkInDate =
      checkIn && listTimeZone
        ? moment(checkIn)
            .tz(listTimeZone)
            .format('ll')
        : ''
    let checkOutDate =
      checkOut && listTimeZone
        ? moment(checkOut)
            .tz(listTimeZone)
            .format('ll')
        : ''
    let messageURL = url + '/message/' + threadId + '/guest'
    let imageURL
    if (hostProfilePic) {
      imageURL = avatarBaseUrl() + 'medium_' + hostProfilePic
    }
    return (
      <Layout>
        {/* <Header color='rgb(255, 90, 95)' backgroundColor='#F7F7F7' /> */}
        <div>
          <Table width='100%'>
            <TBody>
              <TR>
                <TD style={textStyle}>
                  <EmptySpace height={20} />
                  <div>
                    Almost there {guestName}
                    {senderName}!
                  </div>
                  <EmptySpace height={20} />
                  <div>
                    Your request to book{' '}
                    <a href={url + '/rooms/' + listId}>{listTitle}</a> from{' '}
                    {checkInDate} - {checkOutDate} has just been sent!{' '}
                    {total > 0 && <span>We'll get
                    back to you as soon as {hostName}
                    {receiverName} approves the booking so you can complete your
                    reservation. </span>}
                    Hosts have 24 hours to approve requests before
                    they expire, but most respond sooner.
                  </div>
                  <EmptySpace height={40} />
                  <div style={btnCenter}>
                    <a href={messageURL} style={buttonStyle}>
                      Message {hostName}
                      {receiverName}
                    </a>
                  </div>
                  <EmptySpace height={40} />
                  <div>
                    Thanks! <br />
                    The {sitename} Team
                  </div>
                </TD>
              </TR>
            </TBody>
          </Table>
          <EmptySpace height={40} />
        </div>
        <Footer />
        <EmptySpace height={20} />
      </Layout>
    )
  }
}

export default BookingRequestGuest
