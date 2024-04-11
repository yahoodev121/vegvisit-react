import {
  BOOKING_PROCESS_START,
  BOOKING_PROCESS_SUCCESS,
  BOOKING_PROCESS_ERROR,
  GET_SERVICE_FEES_SUCCESS,
  BOOKING_PAYMENT_START,
  BOOKING_PAYMENT_SUCCESS,
  BOOKING_PAYMENT_ERROR,
} from '../constants';

export default function book(state = {}, action) {
  switch (action.type) {

    case BOOKING_PROCESS_START:
      return {
        ...state,
        data: null,
        bookDetails: null,
        bookingLoading: action.payload.bookingLoading,
      };
      
    case BOOKING_PROCESS_SUCCESS:
      return {
        ...state,
        data: action.payload.data,
        bookDetails: action.payload.bookDetails,
        bookingLoading: action.payload.bookingLoading,
        reservationDetails: action.payload.reservationDetails,
      };

    case BOOKING_PROCESS_ERROR:
      return {
        ...state,
        bookingLoading: action.payload.bookingLoading,
      };

    case BOOKING_PAYMENT_START:
      return {
        ...state,
        paymentLoading: action.payload.paymentLoading,
      };

    case BOOKING_PAYMENT_SUCCESS:
      return {
        ...state,
        paymentLoading: action.payload.paymentLoading,
      }; 

    case BOOKING_PAYMENT_ERROR:
    return {
      ...state,
      paymentLoading: action.payload.paymentLoading,
    }; 
      
    case GET_SERVICE_FEES_SUCCESS:
      return {
        ...state,
        serviceFees: action.payload.serviceFees,
      };

    default:
      return state;
  }
}