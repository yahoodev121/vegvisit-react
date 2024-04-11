import ReactGA from 'react-ga4';

import { analytics } from '../config';

export const initGA = () => {
  console.log('Handling GA initialisation now');
  console.log('process.env.NODE_ENV is ', process.env.NODE_ENV);
  if (process.env.NODE_ENV === "production" && analytics && analytics.google && analytics.google.trackingId) {
    ReactGA.initialize(analytics.google.trackingId);
  }
};