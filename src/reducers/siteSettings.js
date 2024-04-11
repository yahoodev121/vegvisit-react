import {
  SET_SITE_SETTINGS_SUCCESS,
  GET_LOGO_SUCCESS,
  LOGO_UPLOAD_LOADER_START,
  LOGO_UPLOAD_SUCCESS,
  LOGO_UPLOAD_ERROR,
  REMOVE_LOGO_SUCCESS,
  REMOVE_LOGO_ERROR,
  IMAGE_BANNER_UPLOAD_LOADER_START,
  UPLOAD_IMAGE_BANNER_SUCCESS,
  UPLOAD_IMAGE_BANNER_ERROR
} from '../constants';

export default function siteSettings(state = {}, action) {
  switch (action.type) {
    case SET_SITE_SETTINGS_SUCCESS:
      return {
        ...state,
        data: action.data,
      };

    case GET_LOGO_SUCCESS:
      return {
        ...state,
        logodata: action.payload.logodata,
      };

    case LOGO_UPLOAD_LOADER_START:
      return {
        ...state,
        logoUploaderLoading: action.payload.logoUploaderLoading,
      };

    case LOGO_UPLOAD_SUCCESS:
      return {
        ...state,
        logoUploaderLoading: action.payload.logoUploaderLoading,
      };

    case LOGO_UPLOAD_ERROR:
      return {
        ...state,
        logoUploaderLoading: action.payload.logoUploaderLoading,
      };

    case REMOVE_LOGO_SUCCESS:
      return {
        ...state,
        logoUploaderLoading: action.payload.logoUploaderLoading,
        logodata: null,
      };

    case REMOVE_LOGO_ERROR:
      return {
        ...state,
        logoUploaderLoading: action.payload.logoUploaderLoading,
      };

    case IMAGE_BANNER_UPLOAD_LOADER_START:
      return {
        ...state,
        bannerUploaderLoading: action.payload.bannerUploaderLoading,
      };

    case UPLOAD_IMAGE_BANNER_SUCCESS:
      return {
        ...state,
        bannerUploaderLoading: action.payload.bannerUploaderLoading,
      };

    case UPLOAD_IMAGE_BANNER_ERROR:
      return {
        ...state,
        bannerUploaderLoading: action.payload.bannerUploaderLoading,
      };

    default:
      return state;
  }
}
