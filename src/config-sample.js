/* eslint-disable max-len */

export const port = process.env.PORT || 3000;
export const host = process.env.WEBSITE_HOSTNAME || `localhost:${port}`;
export const url = process.env.WEBSITE_URL || 'http://localhost:3001';
// Our rebrandly short links
export const shortUrlGuestInbox = process.env.WEBSITE_SHORT_URL_GUEST_INBOX || 'https://vegv.link/0kjoil9';
export const shortUrlHostInbox = process.env.WEBSITE_SHORT_URL_HOST_INBOX || 'https://vegv.link/gis';
export const sitename = process.env.SITENAME || 'Your Website Name';
export const blogUrl = process.env.BLOGURL || 'https://blog.vegvisits.com';
export const adminEmail = process.env.ADMIN_EMAIL || 'admin@yourdomain.com';

export const adminEmaillist = [
  'admin_001@yourdomain.com',
  'admin_002@yourdomain.com',
  'admin_003@yourdomain.com'
];

// Max File upload size in MB
export const maxUploadSize = 1;

// default locale is the first one
export const locales = ['en-US', 'cs-CZ'];

// Developer protection
export const whoAmI = '';

// Will the server run as root user? Then puppeteer needs to be started accordingly
export const willRunAsRoot = false;

// Should the reviews import run in a child process (fork)
export const createChildProcessForReviewsImport = true;

// Persistent image location
export const spacesEndpoint = 'nyc3.digitaloceanspaces.com';
// Expiration time in minutes for temporary links to private document spaces data
export const documentsSignedUrlExpiration = process.env.DOCUMENTS_SIGNED_URL_EXPIRATION || 3;

// DB Connection
// export const databaseUrl = process.env.DATABASE_URL || 'mysql://<username>:<password>@localhost/<db-name>';
export const dbVars = {
  database: process.env.DATABASE || '<db-name>',
  user: process.env.DB_USER || '<username>',
  password: process.env.DB_PWD || '<password>',
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || '3306',
  caCertFile: process.env.DB_CA_CERT_FILE || '<path to ca-cert.pem>',
  verifyServerCertificate: process.env.DB_VERIFY_SERVER_CERTIFICATE || true
}

// Listing Photos Upload Directory
export const fileuploadDir = process.env.FILEUPLOAD_DIR || './images/upload/';

// Logo upload directory
export const logouploadDir = process.env.LOGOUPLOAD_DIR || './images/logo/';

// Home page Banner upload directory
export const banneruploadDir = process.env.BANNER_UPLOAD_DIR || './images/banner/';

// User Profile Photos Upload Directory
export const profilePhotouploadDir = process.env.PROFILE_PHOTO_UPLOAD_DIR || './images/avatar/';

//Document Upload
export const documentuploadDir = process.env.FILEUPLOAD_DIR || './images/document/';

// Location upload directory
export const locationuploadDir = process.env.LOCATIONUPLOAD_DIR || './images/popularLocation/';

// Static block image upload directory
export const homebanneruploadDir = './images/home/';

// Admin content management upload directory
export const contentManagementuploadDir = process.env.CMUPLOAD_DIR || './images/contentManagement/';

export const analytics = {

  // https://analytics.google.com/
  google: {
    trackingId: process.env.GOOGLE_TRACKING_ID || 'UA-XXXXX-X', 
  },

};

export const googleMapAPI = process.env.GOOGLE_MAP_API || '<Your API Key>';

export const serverKey = process.env.PUSH_NOTIFICATION_SERVER_KEY || '<Your API Key>';

export const logging = {
  clientLogLevel: process.env.CLIENT_LOG_LEVEL || 'warn', // one of trace/debug/info/warn/error or silent, see https://github.com/pimterry/loglevel
  clientLogConsole: process.env.CLIENT_LOG_CONSOLE || true,
  logfile: process.env.LOG_FILE || '/path/to/client/log/file/Combined.log',
  logFileLevel: process.env.LOG_FILE_LEVEL || 'warn', // one of emerg, alert, crit, error, warning, notice, info, debug, see https://github.com/winstonjs/winston
  logConsoleLevel: process.env.LOG_CONSOLE_LEVEL || 'info', // see logFileLevel
}

export const paypalClientId = process.env.PAYPAL_APP_CLIENT_ID || '<Your Client Id>';

export const payment = {

  paypal: {
    isLiveEnvironment: process.env.PAYPAL_LIVE_ENVIRONMENT || false,
    email: process.env.PAYPAL_APP_EMAIL || '<Your PayPal Email>',
    clientId: paypalClientId,
    secret: process.env.PAYPAL_APP_SECRET || '<Your Secret Key>',
    host: process.env.PAYPAL_HOST || 'api.sandbox.paypal.com',
    redirectURL: {
      success: process.env.PAYPAL_SUCCESS_URL || '/users/trips/itinerary',
      cancel: process.env.PAYPAL_CANCEL_URL || '/contact',
    },
    webhookId_payout: process.env.PAYPAL_WEBHOOK_ID_PAYOUT || '<Your PayPal Payout Webhook ID>',
    webhookId_order: process.env.PAYPAL_WEBHOOK_ID_ORDER || '<Your PayPal Order Webhook ID>',
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET || '<Your API Key>',
    publishableKey: process.env.STRIPE_PUBLISHABLE || '<Your publishable API Key>',
  },
};

// Stripe Express configuration for the client
export const useStripeExpress = process.env.STRIPE_EXPRESS || true;
export const stripeExpressCountries = process.env.STRIPE_EXPRESS_COUNTRIES || ['US'];

// Stripe Express configuration for the server
export const stripeExpress = {
  authorizationUri: process.env.STRIPE_AUTHORIZATION_URI || 'https://connect.stripe.com/express/oauth/authorize',
  accessTokenUri: process.env.STRIPE_ACCESSTOKEN_URI || 'https://connect.stripe.com/oauth/token',
  clientId: process.env.STRIPE_CLIENT_ID || '<Your Stripe Client ID>',
  redirectUri: process.env.STRIPE_REDIRECT_URI || `${url}/stripe-connected`,
  useExpress: useStripeExpress,
  countries: stripeExpressCountries
}

// Google ReCAPTCHA
export const googleCaptcha = {
  sitekey: process.env.GOOGLE_RECAPTCHA_KEY || '<Your Site key>',
  verifyUrl: process.env.GOOGLE_RECAPTCHA_VERIFYURL || 'https://www.google.com/recaptcha/api/siteverify'
};
export const googleCaptchaSecret = {
  secretkey: process.env.GOOGLE_RECAPTCHA_SECRETKEY || '<Your Secret key>'
};

// SMS configuration
export const sms = {
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNTSID || '<Your AccountSid>',
    authToken: process.env.TWILIO_AUTHTOKEN || '<Your AuthToken>',
    phoneNumber: process.env.TWILIO_PHONENUMBER ||'<Your Phone number>',
    alphanumericSenderId: process.env.TWILIO_ALPHANUMERICSENDERID || 'Vegvisits',
    alphanumericSenderIdCountryCodes: process.env.TWILIO_ALPHANUMERICSENDERID_CC || ['+44', '+49'],
    logLevel: process.env.TWILIO_LOG_LEVEL || 'debug'
  },
  sendSmsNotifications: true
};

// Email Settings
export const emailConfig = {
  sender: process.env.SMTP_FROM_NAME || '<Your From Name>',
  senderEmail: process.env.SMTP_SENDER_EMAIL || '<Your Sender Email>',
};
export const emailConfigSecret = {
  host: process.env.SMTP_HOST || 'smtp-pulse.com',
  port: process.env.SMTP_PORT || 2525,
  email: process.env.SMTP_LOGIN_EMAIL || '<Your Login Email>',
  password: process.env.SMTP_LOGIN_PASSWORD || '<Your Password>',
  secure: process.env.SMTP_SECURE || false,
  tls: process.env.SMTP_TLS || false,
}

export const facebookId = process.env.FACEBOOK_APP_ID || '<Your App id>';

export const auth = {

  jwt: { secret: process.env.JWT_SECRET || '<Your Secret Key>' },

  session: { secret: process.env.SESSION_SECRET || '<Your Secret Key>' },

  redirectURL: {
    login: process.env.LOGIN_URL || '/dashboard',
    verification: process.env.LOGIN_URL || '/user/verification',
  },

  // https://developers.facebook.com/
  facebook: {
    id: facebookId,
    secret: process.env.FACEBOOK_APP_SECRET || '<Your Secret Key>',
    returnURL: process.env.FACEBOOK_CLIENT_URL || `${url}/login/facebook/return`,
  },

  // https://cloud.google.com/console/project
  google: {
    id: process.env.GOOGLE_CLIENT_ID || '<Your client id>',
    secret: process.env.GOOGLE_CLIENT_SECRET || '<Your Secret id>',
    returnURL: process.env.GOOGLE_CLIENT_URL || `${url}/login/google/return`,
  }
};