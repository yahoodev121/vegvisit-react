
//PayPal API v2
import * as checkoutNodeJssdk from '@paypal/checkout-server-sdk';
import { payment as config } from '../../config';

//PayPal API v2 configuration

/**
 *
 * Returns PayPal HTTP client instance with environment that has access
 * credentials context. Use this instance to invoke PayPal APIs, provided the
 * credentials have access.
 */
export function client() {
  return new checkoutNodeJssdk.core.PayPalHttpClient(environment());
}

/**
 *
 * Set up and return PayPal JavaScript SDK environment with PayPal access credentials.
 * Currently using SandboxEnvironment. In production, use LiveEnvironment.
 *
 */
export function environment() {
  let clientId = config.paypal.clientId;
  let clientSecret = config.paypal.secret;
  let isPaypalLiveEnv = config.paypal.isLiveEnvironment;

  if (isPaypalLiveEnv) {
    return new checkoutNodeJssdk.core.LiveEnvironment(
      clientId, clientSecret
    );
  } else {
    return new checkoutNodeJssdk.core.SandboxEnvironment(
      clientId, clientSecret
    );
  }
}
