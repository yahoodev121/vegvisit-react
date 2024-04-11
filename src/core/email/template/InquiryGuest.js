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

class InquiryGuest extends React.Component {
  static propTypes = {
    content: PropTypes.shape({
      hostName: PropTypes.string.isRequired,
      guestName: PropTypes.string.isRequired,
      checkIn: PropTypes.string.isRequired,
      checkOut: PropTypes.string.isRequired,
      listId: PropTypes.number.isRequired,
      listTitle: PropTypes.string.isRequired,
      listTimeZone: PropTypes.string.isRequired,
      threadId: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      personCapacity: PropTypes.number.isRequired,
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
          type,
          message,
          personCapacity,
      }
    } = this.props

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
                    Hi {guestName}!
                  </div>
                  <EmptySpace height={20} />
                  <div>
                    Your message to {hostName} about staying at {listTitle} has just been sent!
                    If the dates work out, then {hostName} has the option to invite you to book your stay.
                    We'll send you an email notification when this happens
                    so you can finish completing your booking
                    (you'll have 24 hours before your invitation to book expires).
                  </div>
                  <EmptySpace height={20} />
                  <div>
                    If {hostName} agrees to host you but you don’t see an invitation to book,
                    you can send a booking request through {hostName}'s listing.
                    Once it's approved, you'll be able to complete your booking.
                  </div>
                  <EmptySpace height={20} />
                  <div>
                    We hope your trip works out and that you have an amazing time!
                  </div>
                  <EmptySpace height={20} />
                  <div>
                    Talk soon,
                    <br/>
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

export default InquiryGuest
